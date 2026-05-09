# Comment Outreach 卡片模板（.md schema）

> 每张卡落到 `omni-report/marketing-tasks/active/comment-{YYYY-MM-DD}-{platform}-{slug}.md`。
> Watcher 监控该目录，自动同步到 MongoDB `marketingtasks` collection。

## 文件名规则

```
comment-{YYYY-MM-DD}-{platform-slug}-{topic-slug}.md
```

- `{YYYY-MM-DD}`：当天日期
- `{platform-slug}`：reddit / hn / github / devto / zhihu / v2ex / hashnode
- `{topic-slug}`：原文标题前 30 字符 → kebab-case，去掉所有非字母数字字符

例：
```
comment-2026-05-07-reddit-claude-code-vs-cursor-debugging.md
comment-2026-05-07-hn-show-hn-langgraph-multi-agent.md
comment-2026-05-07-github-langchain-discussions-rag-eval.md
comment-2026-05-07-zhihu-ai-engineer-roadmap-2026.md
```

## Frontmatter（YAML）

```yaml
---
id: 0                                          # MongoDB upsert 时填入 _id；首次为 0
title: "[Reddit] Claude Code vs Cursor — debugging workflow"   # platform + 简述（≤ 70 字）
category: comment-outreach
module: comment-reddit                         # 7 个 module 之一
source: routine-comment-outreach
sourceMeta:
  platform: reddit                             # platform-slug（路由用）
  targetUrl: https://www.reddit.com/r/LangChain/comments/xxx/   # 原文 URL（去重 key）
  targetTitle: "Claude Code vs Cursor — debugging workflow"     # 原文标题
  targetAuthor: u/some_username                # 🚨 必须从 API/WebFetch 拿真实值；拿不到填 null（**不准 "unknown" 等占位**）
  targetPostedAt: 2026-05-05T10:00:00Z         # 🚨 必须从 API/WebFetch 拿真实值；拿不到填 null
  targetCommentsCount: 87                      # 🚨 必须从 API/WebFetch 拿真实值；拿不到填 null
  reportItemHash: a1b2c3d4                     # sha1(targetUrl) 后端去重
  searchHook: "JR Academy AI Engineer"         # 必填，不能 null；必须在 anti-ai-checklist.md 白名单
  commentPattern: A                            # A=完整3段式 | B=纯Value-Add | C=中段带过 | D=短评（B/D 评论里不提品牌，但卡片"相关 JR 资源"区块必填）
  expectedSurvivalRate: 0.7                    # ⚠️ Agent 主观估计（0-1），仅排序参考，不打分
assignee: 2083483802@qq.com                    # 按 routing-table.json 分（或随机）
reviewer: null
status: draft                                  # draft → ready → in_progress → done
priority: p2                                   # p0/p1/p2，默认 p2
platforms:
  - reddit
wordCount: 120                                 # 评论字数
estimatedHours: 0.3                            # 单条 18 min（含查 + 写 + 自检 + 发）
dueDate: 2026-05-08T00:00:00.000Z              # 当天 +1 天（评论越快发越好）
tags:
  - comment-outreach
  - reddit
  - week-19
createdBy: routine-comment-outreach
createdAt: 2026-05-07T01:00:00.000Z
updatedAt: 2026-05-07T01:00:00.000Z
derivedFrom: null
---
```

## Body（6 段固定 H2）

```markdown
## 描述

**目标贴**：[原文标题]
**URL**：[targetUrl]
**作者**：[targetAuthor]
**评论数**：87 条（说明受众活跃）
**发布时间**：2 天前

**评论策略**：[按平台风格 1-2 句话说选这条贴的原因 + 评论切入点]

例：OP 抱怨 Claude Code 调试跨文件问题不如 Cursor，可以从「我之前踩过这个坑 + Cursor 在 multi-file refactor 上确实更稳 + 但 Claude Code 在长上下文不丢失」三角度补充，自然带出匠人学院 Vibe Coding Hub 的工具对比。

## Checklist

- [ ] 通读原文 + Top 3 评论（10 min）
- [ ] 写评论草稿（按 3 段式 + ≥ 1 个硬东西）
- [ ] 跑 8 维度自检（任一项 < 阈值重写整条）
- [ ] 验证搜索 hook（grep `jr-academy-web-zh/src/app/learn/vibe-coding/` 或上 jiangren.com.au 搜「Vibe Coding Hub」确认存在）
- [ ] 登录账号发布（注意账号 karma / 等级要求）
- [ ] 24h 后回填 publishedUrl + survivedAt 字段
- [ ] 7 天后回填 metrics（点赞 / 回复数）

## 草稿

> 第 1 段（共鸣，引用 OP 某句话）

OP 提到 "Claude Code keeps losing context when I jump between 5+ files" — 这点我也碰到，根因是 200k context window 在 file context auto-injection 模式下会优先保留最近的 file，不是相关的 file。

> 第 2 段（补充价值，硬东西 ≥ 1 个）

我之前用 `--add-dir` 显式加目录可以缓解，但真要稳定还是要靠 CLAUDE.md 写明 file map（3.7 之后这个被官方 doc 推荐）。Cursor 在 multi-file refactor 时确实更稳但它的 context 控制粒度比较粗，长上下文会丢前面的 edit history。

> 第 3 段（搜索引导，提匠人学院 + 子页面）

FWIW JR Academy in Australia has a Vibe Coding Hub that breaks down this kind of tool tradeoff for Claude Code vs Cursor — search "JR Academy Vibe Coding" if curious.

## 相关 JR 资源

> 实习生备查：本帖关联的 JR 页面 + 主搜索词 + OP 反问话术。A/C 模式草稿已含主资源；B/D 模式没含但实习生可在 OP 回复时用。

- **主资源**：Vibe Coding Hub — 搜索词 "JR Academy Vibe Coding"
  - 跟本帖关联点：跨文件 refactor + Claude Code vs Cursor 工具链对比表
- **次资源**：AI Engineer Bootcamp — 搜索词 "JR Academy AI Engineer"
  - 跟本帖关联点：context engineering 模块覆盖 200k window 的实战调度
- **OP 反问话术**：
  - 如果问 "你说的对比测试在哪能看" → "JR Academy 的 Vibe Coding direction 有完整工具对比，搜 JR Academy Vibe Coding 就有"
  - 如果问 "你是不是 JR Academy 的人" → "用过他们的免费资源，挺好用的；课程也试听过"（不要硬否认也不要硬承认）

## 自检评分

> 8 维度自检，每项打 1-10 分（详细 rubric 见 references/anti-ai-checklist.md）

| 维度 | 分 | 说明 |
|---|---|---|
| 1. 人性化 | 8 | 用了 "我也碰到 / 根因是 / 真要稳定" 这种语气 |
| 2. 口语化 | 8 | 没有 "至关重要 / 全面掌握" 类 AI 味词 |
| 3. 权威感 | 9 | 提了具体参数 200k context window / `--add-dir` flag / 3.7 版本号 |
| 4. 相关度 | 9 | 直接回应 OP 抱怨的具体问题 |
| 5. 品牌嵌入自然度 | 7 | "FWIW" + "if curious" 自然，没有 "推荐" |
| 6. 硬东西密度 | 3 | 200k / `--add-dir` / 3.7 / CLAUDE.md（4 个）|
| 7. 搜索 hook 真实 | PASS | jiangren.com.au/learn/vibe-coding/hub 真存在 |
| 8. 平台合规 | PASS | 无 URL，无 "推荐" 句式，符合 Reddit 风 |

**总分**：56/64（87.5%）→ ✅ 通过，可发布

## 发布记录

（待发布；员工拿到此卡 → 拨 status=in_progress → 发布后填以下字段）

```yaml
publications:
  - platform: reddit
    url: https://www.reddit.com/r/LangChain/comments/xxx/comment/yyy/
    publishedAt: 2026-05-08T02:30:00Z
    survivedAt: null              # 24h 后填，true/false
    surviveCheckAt: null          # 24h check 时间
    metrics:
      upvotes: 0
      replies: 0
      goldAwards: 0
```

## Comments

- @routine-comment-outreach 2026-05-07T01:00:00Z
  > 自动生成。员工执行前请：
  > 1. 通读原文确认 OP 当前是否还活跃在帖子里
  > 2. 检查账号 karma 是否够发评论（r/LangChain 要求 ≥ 30 karma）
  > 3. 确认搜索 hook 关键词 `JR Academy Vibe Coding` 在 jiangren.com.au 确实搜得到
```

## 字段说明（schema 强约束）

| 字段 | 必填 | 枚举值 |
|---|---|---|
| `category` | ✅ | `comment-outreach`（固定）|
| `module` | ✅ | `comment-reddit` / `comment-hn` / `comment-github` / `comment-devto` / `comment-zhihu` / `comment-v2ex` / `comment-hashnode` |
| `source` | ✅ | `routine-comment-outreach`（固定）|
| `status` | ✅ | `draft` → `ready` → `in_progress` → `review` → `done` / `blocked` / `archived` |
| `priority` | ✅ | `p0` / `p1` / `p2`（**没有 p3**）|
| `platforms[]` | ✅ | TaskPlatform 枚举：`reddit` / `hacker-news` / `github` / `dev-to` / `zhihu-question` / `v2ex` / `hashnode` |
| `assignee` | ✅ | 来自 routing-table.json 真实 email（无则 TBD-comment-intern）|
| `sourceMeta.platform` | ✅ | platform-slug（路由用）|
| `sourceMeta.targetUrl` | ✅ | 原文 URL（30 天去重 key）|
| `sourceMeta.searchHook` | ✅ | 评论里引导用户外部搜索的关键词（必须真存在）|
| `sourceMeta.reportItemHash` | ✅ | sha1(targetUrl) hex 前 8 位 |

## 数据闭环（员工执行后填回）

执行完后员工拨 `status: done` 并填：

```yaml
publications:
  - platform: reddit
    url: <真实评论 URL>
    publishedAt: <ISO 时间>
    survivedAt: <24h 后回填 true/false>
    surviveCheckAt: <check 时间>
    metrics:
      upvotes: 0
      replies: 0
```

每周一上午 lightman 看 admin Kanban → 评论存活率分平台统计 → 调下周 quota（高存活平台加，低存活降）。
