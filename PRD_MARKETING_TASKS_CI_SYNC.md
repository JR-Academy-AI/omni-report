# Marketing Tasks CI Sync — PRD

> **状态**: spec / 待实施
> **上游依赖**: [`PRD_MARKETING_TASKS_ADMIN.md`](./PRD_MARKETING_TASKS_ADMIN.md)（admin 模块设计 + backend schema + .md frontmatter 规范）
> **代码位置**:
> - omni-report repo: `.github/workflows/sync-marketing-tasks.yml`（新增）
> - jr-academy backend: `src/modules/marketing-task/services/marketing-task-sync.service.ts`（修复）
> **参考模式**: jr-wiki / training-rag 的 GitHub Actions ingest workflow（push to main → 后端 API 同步）

---

## 1. 背景

### 1.1 现状

omni-report repo 是 marketing tasks `.md` 数据的 source of truth。生产路径：

```
本地 Claude / routine 写 .md → push omni-report → ??? → prod jr-academy MongoDB → admin UI / SDM
```

中间这段「???」当前**没有可靠通道**。

### 1.2 为什么之前的设计走不通

backend `marketing-task-artifacts.service.ts:14` 假设：

```ts
private readonly omniReportRoot = path.resolve(process.cwd(), '..', 'omni-report');
```

意思是「prod 容器内 `/app/../omni-report` 必须是真实目录」。配套设计：
- **FilesystemWatcherService** 用 chokidar 监听 `${tasksDir}/{active,archive}/**/*.md`
- 检测到 `add/change/unlink` → 调 `markdownSync.syncToMongoDB(filePath)` → 写 Mongo

但 prod 实际部署：

| 项 | 现状 |
|---|---|
| 容器构建 | Jenkins build → ECR push → SSH ubuntu@13.238.204.157 → `docker run` |
| Volume mount | **没有** `-v` 任何路径 |
| 容器 WORKDIR | `/app` |
| 容器内 `/omni-report` | **不存在** |

所以 watcher 启动时监听的目录根本不存在，**这条路从未跑通过**。

### 1.3 prod Mongo 现有数据来源

prod Mongo 当前有 34 张 marketing-task。**不是**通过 watcher 同步进去的，最可能是：
- 早期开发时直接调 `/marketing-tasks` POST endpoint 创建
- 或者 SDM Push 写到容器临时文件系统（容器重建丢失，又被重新写入）

无论如何，**没有一条「omni-report 改动 → prod Mongo」的自动化通道存在**。

### 1.4 SDM `/sync/import` 链路也断了

backend 已经实现 `POST /admin-cms/marketing-tasks/sync/import`（`marketing-task-sync.service.ts:111` `importBatch`），SDM Push 调它。逻辑：

```ts
// marketing-task-sync.service.ts:157
await this.markdownSync.writeFile(abs, task.rawMarkdown);
// ↑ 写文件后：
//   1. mkdir { recursive: true } 自动创建 /omni-report/marketing-tasks/active/
//   2. 注册 selfWrite hash → watcher 看到 add/change 后跳过（避免回环）
// ❌ 但 importBatch 自己也没显式调 syncToMongoDB
//    结果：文件写到容器临时 fs，Mongo 不更新
```

**这是个未发现的 bug**——SDM Push 当前实际不写 Mongo。修复成本：1 行代码。

---

## 2. 决策：CI → API（不走 host mount）

### 2.1 选项对比

| 维度 | A. host mount + cron pull | **B. omni-report CI → API**（本 PRD） | C. backend 内置 GitHub fetcher |
|---|---|---|---|
| 改 Jenkinsfile_prod | ✅ 加 `-v /home/ubuntu/omni-report:/omni-report:ro` | ❌ 不动 | ❌ 不动 |
| SSH prod EC2 | ✅ 配 deploy key + clone + cron | ❌ 不需要 | ❌ 不需要 |
| 改 prod 容器配置 | ✅ 重新部署一次 | ❌ 不需要 | ❌ 不需要 |
| 修改 backend 代码 | ❌ 不动 | ✅ 1 行（importBatch 加 syncToMongoDB） | ✅ 新 service ~80 行 + Dockerfile 加 git |
| 改动文件数 | 4（Jenkinsfile + host filesystem + crontab + redeploy） | 2（backend 1 行 + omni-report 1 个 yaml） | 3（service + module + Dockerfile） |
| 实时性 | 2 分钟 cron 间隔 | 30 秒（GH Action 启动） | 配置：1-2 分钟 cron |
| 已验证模式 | 否（设计师本意但从未实现） | ✅ jr-wiki + training-rag 同模式 | 否 |
| host 文件系统依赖 | ✅ 强依赖 | ❌ 解耦 | ❌ 解耦 |
| 未来迁 K8s/Vercel | 要重新设计 mount | 零适配 | 零适配 |

**选 B**。理由：

1. **最小改动**——2 处改动 vs 4 处
2. **复用已验证模式**——jr-wiki / training-rag 同样 push-to-prod 路径已经跑了几个月
3. **不动 prod**——零 SSH、零 Jenkinsfile、零 redeploy 风险
4. **解耦 host filesystem**——以后迁 K8s/Vercel/任何 PaaS 零成本

### 2.2 不选 C 的原因

C 的 backend 内置 fetcher 也是干净方案，但：
- 多 80 行代码 + 测试
- Dockerfile 加 git binary（image 体积↑）
- backend 模块多一个职责（拉数据）

B 让 CI 做"什么时候拉、拉什么"的判断，backend 只负责"接 payload 写 Mongo"。**关注点更清晰**。

未来如果 omni-report 数据量爆炸（>1000 卡）/ 需要 webhook 实时性，再升级 C 不晚。

---

## 3. 详细设计

### 3.1 数据流

```
[作者本地 Claude]
       │ git push omni-report
       ▼
[GitHub omni-report repo]
       │ on: push to main, paths: marketing-tasks/**/*.md
       ▼
[GitHub Actions: sync-marketing-tasks.yml]
       │ 1. checkout
       │ 2. 扫描 marketing-tasks/active/*.md → 打包 JSON
       │ 3. POST /admin-cms/marketing-tasks/sync/import
       │    Authorization: Bearer ${SUPERADMIN_TOKEN}
       ▼
[prod jr-academy backend]
       │ importBatch(tasks)
       │   ├─ 校验 filename + frontmatter
       │   ├─ writeFile (容器内 /omni-report/marketing-tasks/active/{filename})
       │   └─ syncToMongoDB(absPath)  ← ★ 本 PRD 修复点
       ▼
[prod MongoDB marketingtasks collection]
       │
       ▼
[admin UI / SDM 看到数据]
```

### 3.2 Backend 修复（jr-academy）

**文件**: `jr-academy/src/modules/marketing-task/services/marketing-task-sync.service.ts:157`

**当前**:
```ts
try {
  await this.markdownSync.writeFile(abs, task.rawMarkdown);
  if (exists) updated++;
  else created++;
} catch (err: any) {
  this.logger.error(`importBatch: write ${task.filename} failed: ${err.message}`);
  errors.push({ filename: task.filename, error: err.message });
}
```

**改为**:
```ts
try {
  await this.markdownSync.writeFile(abs, task.rawMarkdown);
  await this.markdownSync.syncToMongoDB(abs);  // ← 新增：直接写 Mongo，不依赖 watcher
  if (exists) updated++;
  else created++;
} catch (err: any) {
  this.logger.error(`importBatch: write+sync ${task.filename} failed: ${err.message}`);
  errors.push({ filename: task.filename, error: err.message });
}
```

**为什么这样改是安全的**:

1. `writeFile` 已经注册 selfWrite hash → watcher 看到 add/change 会跳过 → **不会回环**
2. `syncToMongoDB` 是幂等 upsert（按 `_id` / `reportItemHash` / `markdownPath`）→ 重复调用安全
3. 单元测试已存在 `markdown-sync.integration.spec.ts`，加一个 importBatch → Mongo 的 e2e case

**测试增量**:

```ts
// marketing-task-sync.service.spec.ts (新增 case)
it('importBatch 写完文件后立即同步 Mongo', async () => {
  const taskModel = mongoose.model('MarketingTask');
  await sync.importBatch([{ filename: 'test.md', rawMarkdown: validMd }]);
  const inDb = await taskModel.findOne({ markdownPath: /test\.md$/ });
  expect(inDb).not.toBeNull();
  expect(inDb.title).toBe('Test Title');
});
```

### 3.3 omni-report GitHub Actions

**文件**: `omni-report/.github/workflows/sync-marketing-tasks.yml`

```yaml
name: Sync Marketing Tasks to Prod

on:
  push:
    branches: [main]
    paths: ['marketing-tasks/active/**/*.md']
  workflow_dispatch:  # 手动兜底（首次全量同步 / 修 bug 后重试）

concurrency:
  group: sync-marketing-tasks
  cancel-in-progress: false  # 不取消，保证按 push 顺序串行

jobs:
  sync:
    runs-on: ubuntu-latest
    timeout-minutes: 5
    steps:
      - uses: actions/checkout@v4

      - name: Build payload + POST to prod
        env:
          PROD_API: ${{ secrets.JR_ACADEMY_PROD_API }}  # https://api.jiangren.com.au
          TOKEN: ${{ secrets.JR_ACADEMY_SUPERADMIN_TOKEN }}
        run: |
          node <<'EOF'
          const fs = require('fs');
          const path = require('path');

          const dir = 'marketing-tasks/active';
          if (!fs.existsSync(dir)) {
            console.log(`No ${dir} directory; nothing to sync`);
            process.exit(0);
          }

          const tasks = fs.readdirSync(dir)
            .filter(f => f.endsWith('.md'))
            .map(f => ({
              filename: f,
              rawMarkdown: fs.readFileSync(path.join(dir, f), 'utf-8')
            }));

          console.log(`Posting ${tasks.length} tasks to ${process.env.PROD_API}`);

          const res = await fetch(
            `${process.env.PROD_API}/admin-cms/marketing-tasks/sync/import`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.TOKEN}`
              },
              body: JSON.stringify({ tasks, strategy: 'upsert' })
            }
          );

          const json = await res.json();
          console.log(JSON.stringify(json, null, 2));

          if (!res.ok || !json.success) {
            console.error(`Sync failed: HTTP ${res.status}`);
            process.exit(1);
          }
          if ((json.errors?.length ?? 0) > 0) {
            console.error(`${json.errors.length} task(s) failed validation`);
            process.exit(1);
          }
          console.log(`✓ created=${json.created} updated=${json.updated} skippedInvalid=${json.skippedInvalid}`);
          EOF
```

**设计选择说明**:

| 选择 | 理由 |
|---|---|
| `paths: ['marketing-tasks/active/**/*.md']` | 只关心 active/，archive/ 改动不触发 |
| `workflow_dispatch` 手动兜底 | 首次全量 + 失败重试 |
| `concurrency` 不 cancel-in-progress | 保证按 push 顺序串行（避免 race） |
| `timeout-minutes: 5` | 34 张卡 ~ 5 秒，5 分钟有 60× 安全裕量 |
| 全量 active/ 每次都 POST | 简单可靠；upsert 幂等；34 张数据量 ~50KB 不大 |
| 不做增量 diff | 第一版避免复杂；将来 100+ 卡再优化 |
| 失败 `process.exit(1)` | GitHub Actions 标记失败 → email 通知 → 手动 dispatch 重试 |

### 3.4 GitHub Secrets

omni-report repo Settings → Secrets and variables → Actions → New repository secret:

| Secret 名 | 值 | 来源 |
|---|---|---|
| `JR_ACADEMY_PROD_API` | `https://api.jiangren.com.au` | prod API base URL |
| `JR_ACADEMY_SUPERADMIN_TOKEN` | superadmin 的 long-lived token | 同 omni-report 5 个 routine 用的 token |

> **注**: 已有 routine 应该已经在用同样的 superadmin token POST 到 prod（e.g. `routine-marketing-topics`）。复用同一个 token，不新增。

### 3.5 老卡删除策略（next iteration）

**当前 PRD 不实现**——先把"add / update"链路打通验证。

老卡删除独立到 follow-up：

**Option 1**: 给 importBatch 加 `replaceActive: true` 参数
- prod active 集合 = payload tasks 列表
- payload 没有的卡 → 软删除（status: archived）或硬删除
- 优点：一次 API 调用搞定全量
- 缺点：误传空 payload 会删光（要加 safeguard：empty payload reject）

**Option 2**: 新 endpoint `/sync/diff-and-prune`
- 接收 `{ activeFilenames: string[] }`
- backend 比对 Mongo 现有 markdownPath → 删多余的
- 优点：删除显式分离，不会和 import 混淆
- 缺点：Action 要发两次 HTTP

**推荐 Option 1**（更简单），但加 safeguards:
```ts
// importBatch with replaceActive
if (opts?.replaceActive) {
  if (input.length === 0) {
    throw new Error('replaceActive requires non-empty input (refused empty payload to prevent mass-delete)');
  }
  if (input.length < currentActiveCount * 0.5) {
    this.logger.warn(`replaceActive: payload (${input.length}) < 50% of current (${currentActiveCount}), proceed?`);
    // 默认仍执行；要 strict 就加 confirmReplaceActive: true 二次确认
  }
  // delete tasks with markdownPath starting with active/ but filename not in input
}
```

---

## 4. 实施计划

### Phase 1: Backend 修复 + 测试（30 分钟）

| 步骤 | 文件 | 操作 |
|---|---|---|
| 1.1 | `marketing-task-sync.service.ts:157` | 加 `await this.markdownSync.syncToMongoDB(abs);` |
| 1.2 | `marketing-task-sync.service.spec.ts` | 加 e2e case：importBatch 后查 Mongo 有数据 |
| 1.3 | 本地跑 `bun test marketing-task-sync` | 确认绿 |
| 1.4 | commit jr-academy → push → Jenkins prod build | 让 prod 拿到修复 |

### Phase 2: omni-report Action（15 分钟）

| 步骤 | 文件 | 操作 |
|---|---|---|
| 2.1 | `omni-report/.github/workflows/sync-marketing-tasks.yml` | 创建 workflow |
| 2.2 | omni-report repo Settings → Secrets | 配 `JR_ACADEMY_PROD_API` + `JR_ACADEMY_SUPERADMIN_TOKEN` |
| 2.3 | omni-report commit → push | 触发首次全量同步 |
| 2.4 | GitHub Actions 页面看 log | 期望：created=N updated=M errors=0 |

### Phase 3: 验证（15 分钟）

| 步骤 | 操作 | 期望 |
|---|---|---|
| 3.1 | curl prod `/admin-cms/marketing-tasks/sync/dump` | count = active/*.md 数量 |
| 3.2 | 打开 admin UI marketing-tasks 看板 | 全部卡可见 |
| 3.3 | 本地修改一张 .md → push → 等 30 秒 | prod Mongo 对应卡 updatedAt 更新 |
| 3.4 | SDM `/marketing-tasks` 点 Pull | 看到 prod 数据；点 Push 也能 ✅ |

### Phase 4（follow-up，本 PRD 不阻塞）: replaceActive

- Backend 加 `replaceActive` 参数 + safeguards
- omni-report Action body 加 `replaceActive: true`
- 验证：删本地一张 .md → push → 30 秒后 prod Mongo 那张消失

---

## 5. 风险与回滚

### 5.1 风险

| 风险 | 影响 | 缓解 |
|---|---|---|
| Action 跑挂（network / token expired） | prod 拿不到新数据 | GitHub Actions 失败邮件通知 → 手动 dispatch 重试 |
| token 泄漏 | 攻击者可写 prod marketing-tasks | secret 在 GH，不写代码；定期轮换；操作审计在 backend log |
| backend importBatch 修改后引入 regression | SDM Push 也受影响 | 上 prod 前跑全量 test；回滚就是 revert 那 1 行 |
| payload 太大被反代/throttle 挡 | sync 失败 | controller 已有 `@SkipThrottle()`；payload <100KB 远低于反代默认 limit |
| 同时 push 多次触发并发 Action | 后写覆盖前写（race） | `concurrency.cancel-in-progress: false` 串行执行 |
| watcher 还在容器里启动（虽然目录不存在） | 起一个空 chokidar，监听不到 | 无副作用；后续 PRD 可直接 disable watcher（写 SKIP_WATCHER=true） |

### 5.2 回滚

| 场景 | 操作 |
|---|---|
| backend 那行改坏了 | git revert + Jenkins prod build；老 34 卡照常在 Mongo |
| Action 把数据写错了 | omni-report repo disable workflow；prod Mongo 用 admin UI 手动改 / SDM Push 老快照 |
| 全部链路想回到原点 | revert backend + delete workflow yaml；prod 数据保留（upsert 不删） |

---

## 6. 非目标

明确**不在本 PRD 范围内**：

- ❌ 废掉 FilesystemWatcherService（保留为 dev fallback / 未来再决定）
- ❌ 改 Jenkinsfile_prod 加 volume mount（已经被 CI → API 模式取代）
- ❌ Webhook 实时同步（30 秒延迟够用）
- ❌ 增量 diff（数据量小，全量 upsert 足够）
- ❌ 跨环境同步（uat / dev 各自独立，本 PRD 只覆盖 prod）
- ❌ replaceActive 删除老卡（next iteration）
- ❌ 双向同步（admin UI 改动写回 omni-report）—— 永远不做（per `marketing-task-crud.service.ts` 注释 "单向数据流 omni-report → MongoDB"）

---

## 7. 参考

- `PRD_MARKETING_TASKS_ADMIN.md` — Marketing tasks admin 模块完整设计
- `jr-academy/src/modules/marketing-task/services/marketing-task-sync.service.ts` — `importBatch` 当前实现
- `jr-academy/src/modules/marketing-task/services/markdown-sync.service.ts` — `syncToMongoDB` + `syncStringToMongoDB` 实现
- jr-wiki workflow（同模式参考）
- training-rag `.github/workflows/ingest-knowledge-prod.yml`（同模式参考）

---

## 8. v1 实施记录（2026-05-07）

### 8.1 端到端打通

3 期 ai-visibility 周报 → `scripts/ai-visibility-to-tasks.ts` → 10 张 `marketing-tasks/active/aivis-*.md` → push → workflow → prod MongoDB → admin Kanban 实测可见。详细记录见 `PRD_AI_VISIBILITY.md § 9`。

### 8.2 Service 脱钩文件系统（关键修复）

**问题**：第一次 sync workflow 跑 `EACCES: permission denied, mkdir '/omni-report'`——prod 容器没有 omni-report 目录，旧 importBatch 实现尝试 `fs.access` 并通过 watcher 链路 selfWrite，永远失败。

**修复**（已 commit `2136ebb2` + `b8c5bf71`）：

`marketing-task-sync.service.ts:importBatch` 改成完全脱离文件系统：
- 不读 `active/` 目录（prod 容器没这个）
- 不写文件（旧 writeFile + watcher 链路废弃）
- 不做 snapshot（prod 没文件可备份；版本管理交给 omni-report git repo）
- 用 `markdownSync.existsByMarkdownPath(logicalPath)` 做 Mongo-truth 判断（替代 fs.access）
- 主路径走 `markdownSync.syncStringToMongoDB(filename, rawMarkdown)` 直接从字符串解析后写 Mongo

**结果**：第二次 push 后 sync 成功，`created: 10, updated: 26`。

### 8.3 Workflow partial-success 修复

**问题**：sync workflow 在 `errors.length > 0` 即 exit 1，让 workflow 永远 red。但**主路径成功**（`created+updated > 0`）+ 部分卡 frontmatter 校验失败这种 partial success 被误报为完全 fail。

**修复**（`.github/workflows/sync-marketing-tasks.yml`）：

```js
const totalProcessed = (json.created ?? 0) + (json.updated ?? 0);
const errorCount = json.errors?.length ?? 0;

if (errorCount > 0) {
  if (totalProcessed === 0) {
    console.error(`::error::All ${errorCount} task(s) failed validation`);
    process.exit(1);
  } else {
    console.warn(`::warning::Partial success: ${totalProcessed} synced, ${errorCount} failed validation`);
  }
}
```

**实测**：56 synced + 34 failed validation，workflow status 从 `failure` → `success`。

### 8.4 已发现的 schema 陷阱

| 陷阱 | 后端 enum 值 | 直觉错值 |
|---|---|---|
| platform slug | `jiangren-blog` / `zhihu-column` / `dev-to` | `jr-blog` / `zhihu` / `devto` |

`platforms` 字段用 `IsEnum(TaskPlatform, { each: true })` 校验，错值会让 `syncStringToMongoDB` 返回 null，sync 报 `errors[].error: "sync returned null (frontmatter check failed?)"`。

**修复方向**：to-tasks 脚本生成时 `platforms: []` 是空的，员工人工填容易踩坑。next iteration 加 `--validate` flag + frontmatter 注释合法 slug 列表。

### 8.5 已知尾巴

- ❌ archive 闭环（卡片 review→done 后归档机制）—— 需要后端加 `archived` 字段 + sync 处理 archive 路径，单独 PR
- ❌ 34 张其他 sessions 的旧卡 frontmatter 不合规—— 跟本 PRD 解耦，各 session owner 自己修

### 8.6 secret 改用 org 公用名（2026-05-23）

**症状**：workflow 自 run #27（2026-05-10 01:43）起连续 21 次 failure，每次 step 3 只跑 1 秒就退出。最近一次 run #46/47 step 3 duration 1s，对比 #26（最后成功）3s。

**根因**：原 yaml 用了**定制** secret 名 `JR_ACADEMY_PROD_API` / `JR_ACADEMY_SUPERADMIN_TOKEN`。1 秒退出 = bash guard `[ -z "$TOKEN" ]` 立即触发，说明 secret 值是空的。推测早期某次手动配过一个 7-day JWT，2026-05-10 前后过期没人续。jr-wiki / training-rag 一直用的是 org 公用 `ADMIN_TOKEN` / `API_URL`，跟着 org 滚动续期所以稳定。

**修复**：workflow 改用公用名（同 jr-wiki `scraped-jobs-sync.yml` § L33-35）：

```yaml
PROD_API: ${{ secrets.API_URL || 'https://api.jiangren.com.au' }}
TOKEN: ${{ secrets.ADMIN_TOKEN }}
```

`API_URL` 还带 fallback，即便 org 没配 URL 这一项，workflow 也用 default。

**补救**：连挂 14 天积压 158 张本地 active/ vs 124 张 prod。2026-05-23 用本地 SDM token 手动 batch push 一次，结果 created=92 / updated=58 / errors=8（全是 commit `f443273` 那批 05-20 comment 卡缺 `id` + `title` frontmatter，跟本 fix 无关）。

**未来防呆**：建议给本 workflow + omni-report 其他 routine workflow 配**失败邮件通知**（GH Actions UI Settings → Notifications），避免下次再悄悄连挂两周。
