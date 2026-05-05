# JR Academy Marketing Tasks Admin Module — PRD

> **状态**: v0.2（2026-05-04，从 `PRD_GEO_TASKS_ADMIN.md` reframe — scope 从 GEO-only 扩展到全 marketing 任务管理）
> **上游数据源**:
> - [`PRD_GEO_CONTENT_FACTORY.md`](./PRD_GEO_CONTENT_FACTORY.md)（74 话题静态库 — 一类任务源）
> - [`PRD_COMPETITOR_WEEKLY.md`](./PRD_COMPETITOR_WEEKLY.md)（竞品周报 actionable）
> - [`PRD_MARKETING_TOPICS.md`](./PRD_MARKETING_TOPICS.md)（选题包 actionable）
> - [`PRD_GROWTH_PLAYBOOK.md`](./PRD_GROWTH_PLAYBOOK.md)（增长玩法 actionable）
> - [`PRD_AI_VISIBILITY.md`](./PRD_AI_VISIBILITY.md)（AI 可见度修复 actionable）
> - [`PRD_SEO_PERFORMANCE.md`](./PRD_SEO_PERFORMANCE.md)（SEO 修复 actionable）
> **下游**: [`PRD_DAILY_ASSIGNMENTS.md`](./PRD_DAILY_ASSIGNMENTS.md)（升级：从写 markdown → 同时写 admin MongoDB）
> **代码位置**: `jr-academy/src/modules/marketing-task/`（后端）/ `jr-academy-admin/src/pages/MarketingTasks/`（前端）
> **灵感来源**: [hades217/Chorus](https://github.com/hades217/Chorus) AI-native 看板（7 列状态流 + checklist）

---

## 1. 背景与目标

### 1.1 为什么要做（5 个执行缺口）

JR Academy 当前 marketing 任务派活靠 5 条松散路径并行：

1. `daily-assignments` routine 每工作日 10:30 CST 把 4 份上游 omni-report 报告切成 markdown todo → 站会人工分发，但状态、进度、结果回收全靠群消息
2. 飞书群 / 微信群临时拍活 → 没记录、没追踪、跨城市（成都/墨尔本/布里斯班）协作翻车
3. `BELLA_GEO_TASKS.md` / `SERENA_GEO_TASKS.md` 个人 markdown → 只有任务清单，没状态流转
4. omni-report 5 条 routine（competitor / marketing-topics / growth-playbook / ai-visibility / seo-performance）每周输出 N 条"建议行动"，但**没自动派给具体人，大多数没人执行**——已经在 `PRD_GEO_CONTENT_FACTORY.md` §1.1 踩过坑（"建议行动列写错了"）
5. 站会拍板 / 月度 KPI 复盘没系统记录 → 谁产出了什么、ROI 多少、要不要扩招，全靠运营负责人（Ada）个人记忆

`jr-academy-admin` 已经是 **JR 所有运营 / 教学 / 销售 / 财务工具的统一中心**（per CLAUDE.md "All admin features go in jr-academy-admin"），所有 marketing 团队成员（Summer / Lily / KIKI-CD / Bella / Serena / Aurora / Seren / KIKI-BNE / Han / Neomi 等）已注册 admin 账号。复用现有 User / Auth / Permission / 部署 / 监控系统是最低成本路径。

### 1.2 目标

构建一个 admin 内的**通用 Marketing 任务管理模块**，覆盖 marketing 团队全部派活场景，达到：

- **看板可视化** 7 列状态流（参考 Chorus）：Draft → Ready → In Progress → Review → Done → Blocked → Archived
- **任务复用 admin User 系统**——assignee 是 User ObjectId ref，不是字符串
- **多源数据汇入**——5 条 omni-report routine + PRD 一键 import + 手工创建 + 跨任务派生
- **自动派活**——`daily-assignments` routine 升级后从写 markdown → 同时写 admin MongoDB
- **数据闭环**——ai-visibility / seo-performance routine 跑完后把指标反馈到对应任务的 `outcomeMetrics` 字段
- **跨城市透明**——墨尔本（Seren / Han）/ 布里斯班（KIKI-BNE）/ 成都（其余）任务统一可见
- **markdown 互通**——单向 import（GEO 74 话题 + 课程营销 PRD + 活动策划）/ 单向 export（任务完成自动 append 到对应 routine 的 published 目录）

### 1.3 非目标 / scope 边界

⚠️ **明确不进 admin marketing 任务系统的工作类型**（这些走各自现有工具）：

| 工作类型 | 不进的原因 | 现有承接工具 |
|---|---|---|
| 销售跟进（Amelia / Rain / Angela 课程顾问 CRM 跟进 / Neomi 销售线索）| 高频低粒度，不适合 routine 派活 | 现有 CRM 系统 / 微信群 |
| 教务核心（Beta 学员日常 / 简历优化 / 面试辅导）| 与学员强绑定，不属于 marketing | 教务管理工具 |
| HR（Melody 招聘 / 培训 / 薪资 / 绩效 / 入转调离）| HR 工作隔离 | HR 系统 |
| 财务（Ada 报销 / 工资 / 个税）| 财务工作隔离 | 财务系统 |
| 产品开发（课程开发 / Bootcamp 教学 / curriculum 工作流）| 走 `curriculum/` AI pipeline | curriculum/ + Skills Data Manager |
| 平台技术开发（jr-academy 后端 / jr-academy-web-zh 前端 / 落地页）| 工程任务走 git / Linear / GitHub Issues | git / GitHub |

✅ **明确进 admin marketing 任务系统**：

| 任务类型 | 数据源 | 主要 assignee |
|---|---|---|
| GEO 内容工厂（74 话题 + 后续扩展）| PRD_GEO_CONTENT_FACTORY import | Bella / Serena / 创始人 / 学员 / Claude-bot |
| 小红书每日发文 | 手工 + marketing-topics routine | Summer / Lily / KIKI-CD |
| 视频号 / 抖音 / B 站 | 手工 + 跨任务派生（Serena 公众号 → Bella 拆视频）| Bella |
| 公众号每日 | 手工 + 跨任务派生（创始人 IP 知乎首发 → Serena 公众号）| Serena |
| SEO 优化（meta / CWV / sitemap / 内链）| seo-performance routine | Claude-bot / 工程师 / Serena |
| AI 可见度修复（落地页 / 索引 / listicle）| ai-visibility routine | Claude-bot / Serena |
| 内容选题落地（讲座 / 活动 / 长尾话题）| marketing-topics routine | Summer / Lily / KIKI-CD / 团队 |
| 竞品 actionable | competitor-reports routine | 团队按 routine 建议派 |
| 增长玩法落地（裂变 / 限时 / 联名 / 游戏）| growth-playbook routine | Ada / 团队 |
| 线下活动策划 / 执行 / 复盘 | 手工 + 节日 calendar | Aurora（暂停）/ Seren / KIKI-BNE / Han |
| 营销 campaign / 节日 / 限时 | 手工 | Ada / 新媒体三人组 |
| 联名 / KOL 合作 | 手工 + competitor routine | Ada / 创始人 |
| 淘宝考证店铺 marketing 部分 | 手工 + Neomi 周报 | Neomi |
| 跨部门 marketing 协作（Beta 配合营销活动）| 手工 | Beta（仅 marketing 部分） |
| 站会临时活 / 用户反馈处理 | 手工 | 任意 |

### 1.4 v0.1 → v0.2 的关键变化

| 维度 | v0.1 (GEO-only) | v0.2 (Marketing 通用) |
|---|---|---|
| 数据模型 | `GeoTask` | `MarketingTask` |
| Schema 增加字段 | — | `category`（高层分类）/ `source`（数据源）|
| Module enum 数量 | 14 个 | 30+ 个（覆盖所有发布渠道 + 工作类型）|
| 数据源 | 仅 PRD_GEO_CONTENT_FACTORY | 5 条 omni-report routine + 多 PRD + 手工 + 派生 |
| 路由表覆盖 | Bella / Serena / 创始人 / 学员 / Claude-bot | + Summer / Lily / KIKI-CD / Aurora / Seren / KIKI-BNE / Han / Neomi / Beta（marketing 跨部门部分） |
| 后端模块名 | `geo-task` | `marketing-task` |
| 前端目录 | `pages/GeoTasks/` | `pages/MarketingTasks/` |
| daily-assignments 关系 | 单向输入（routine 派活）| 双向（routine 写任务 + admin 给 routine 反馈完成度）|
| 数据闭环 | 仅 ai-visibility | + seo-performance + 后续可扩展任意 routine |
| **🚨 存储模型** | **MongoDB 单一权威源** | **`.md` 文件是原始数据（git tracked）+ MongoDB 是衍生查询索引层**（Chorus 哲学）|

### 1.5 🚨 存储原则（Markdown-First）

**绝对原则**：所有任务原始数据用 `.md` 文件存储（YAML frontmatter + body），MongoDB 仅作衍生查询索引。

为什么：
1. **Git 自带 audit trail** — 谁改的、什么时候、改了什么，git log + diff 全有
2. **离线可读 / 可手工编辑** — 任何编辑器都能改，不依赖 admin UI
3. **routine 写 .md 比写 DB 更幂等** — 文件名带 reportItemHash 自动去重
4. **回滚简单** — `git revert` 一条命令
5. **跟 Chorus 哲学对齐** — markdown-as-DB，DB 丢了能从 .md 完整重建

数据流（双向）：
```
routine 跑完
   ↓ 写 .md（事务性 + git commit）
omni-report/marketing-tasks/{date}/{task-slug}.md
   ↓ FilesystemWatcher 检测
MarkdownSyncService 解析 YAML + body
   ↓ upsert
MongoDB MarketingTask collection
   ↓ 读
Admin UI（看板 / 列表 / dashboard）

──────── 反向 ────────

Admin UI 拖拽改 status / 加 checklist / 加发布记录
   ↓ API 调用
后端事务性：
   ① 写 .md 文件（更新 YAML 或 body section）
   ② 同步写 MongoDB（避免等 watcher 延迟）
   ③ 可选 git auto-commit（按操作类型 — 比如 status 流转 commit / checklist 勾选不 commit）
```

**唯一权威源**：`.md` 文件。MongoDB 全表删了，能从 `.md` 重建（reindex 命令）。
**冲突解决**：MongoDB 与 .md 不一致时，**永远以 .md 为准**。watcher 检测到不一致 → MongoDB 失效记录 → 重新从 .md 解析。

---

## 2. 替代方案分析（含 v0.1 → v0.2 升级理由）

| 方案 | 状态 | 理由 |
|---|---|---|
| A. 仅用 markdown 文件 | ❌ | 已踩坑（BELLA / SERENA / daily-assignments markdown 文件状态散乱）|
| B. Chorus-style 独立工具 | ❌ | "All admin features go in jr-academy-admin" |
| C. tools/skills-data-manager 加 dashboard | ❌ | 仅本地访问，跨 3 城团队必须 web |
| D. **GEO-only 任务模块（v0.1）** | ⚠️ **被 v0.2 替代** | scope 锁死在 GEO 太窄，团队还有 11 类 marketing 工作没覆盖 |
| E. **Marketing 通用任务模块（v0.2 本次）** | ✅ | 一次架构覆盖所有 marketing 派活场景，schema 通用化（category + module + source 三层），后续加新 category 不动架构 |

**v0.1 → v0.2 升级的关键洞察**：
- 用户原始 ask 只是 GEO，但 GEO 只是 marketing 任务的 1/12，单独立模块会和未来"小红书任务管理"/"活动任务管理"冲突重构
- omni-report 已有 5 条 routine 输出 actionable，每条都需要派活归宿——一个通用模块比 5 个垂直模块好维护
- admin User / Auth / Permission 只需复用 1 次

---

## 3. 数据模型

### 3.0 🚨 Markdown 文件是原始数据（先讲这个）

**目录结构**：

```
omni-report/marketing-tasks/
├── README.md                       # 索引说明
├── _config/
│   ├── routing-table.json          # Module → 默认 Assignee 路由表（service 读这个）
│   └── derivation-rules.json       # 跨任务派生规则（Phase 2）
├── active/                         # 进行中（status != archived）
│   ├── geo-b5-cursor-claude-code.md
│   ├── geo-c1-zhihu-platform-comparison.md
│   ├── seo-q19-context-engineering.md
│   ├── redbook-summer-2026-05-w1.md
│   ├── ai-visibility-2026-05-04-q6-csdn-rescue.md
│   └── ...
└── archive/                        # 归档（含 done + archived）
    └── 2026-05/
        ├── geo-a1-context-engineering-index-fix.md
        └── ...
```

**单个任务 .md 文件结构**（YAML frontmatter + 5 个固定 body section）：

```markdown
---
id: 65f1a2b3c4d5e6f7a8b9c0d1            # MongoDB ObjectId（首次写入时生成，后续不变）
title: "Cursor + Claude Code 双工作流：一周交付 SaaS"
category: geo-content
module: geo-csdn
source: prd-geo-content-factory
sourceMeta:
  topicId: B5
  reportPath: omni-report/PRD_GEO_CONTENT_FACTORY.md
  reportItemHash: a1b2c3d4              # 防 routine 重复 import
assignee: serena@jiangren.com.au         # email，后端 lookup 转 ObjectId
reviewer: lightman@jiangren.com.au
status: in_progress
priority: p0
platforms: [csdn, jiangren-blog]
wordCount: 4000
estimatedHours: 16
actualHours: null
dueDate: 2026-05-08
tags: [csdn-rescue, week-1]
createdBy: lightman@jiangren.com.au
createdAt: 2026-05-04T10:00:00+08:00
updatedAt: 2026-05-05T14:30:00+08:00
derivedFrom: null                        # 派生任务时填上游 task id
---

## 描述

（取自 PRD §3 "核心内容"列）

① 工具分工：Cursor 80% 写 / Claude Code 20% 跨文件重构
② 真实案例：JR Skills Data Manager（Hono + React）真实 commit log
③ 截图：每天什么时间用什么工具
④ 5 个翻车场景（Claude Code 上下文窗口、Cursor diff 冲突、git hook）
⑤ 月度成本对比

## Checklist

- [ ] 改写 30%（去 AI 味）
- [ ] 适配 CSDN 程序员调性
- [x] 跑 originality.ai 自检（2026-05-05 14:30）
- [ ] 登录账号发布
- [ ] 填发布 URL + metrics

## 草稿

（textarea content / 或链接到 omni-report/geo-content-factory/drafts/...md）

## 发布记录

- platform: csdn
  url: https://blog.csdn.net/jr_academy/article/...
  publishedAt: 2026-05-08T15:00:00+08:00
  aiCheckScore: 0.18
  metrics:
    views: 1240
    likes: 42
    comments: 3
    shares: 8

## Comments

- @lightman 2026-05-05T10:00:00+08:00
  > 检查一下"澳洲求职"那段表述，可能太直
- @serena 2026-05-05T11:00:00+08:00
  > 改了，加了"对求职感兴趣的可以..."委婉化
```

**5 个固定 body section**（解析器按这 5 个 H2 拆分，缺失则视为空）：
1. `## 描述` — 任务详情
2. `## Checklist` — markdown todo list
3. `## 草稿` — textarea / draftPath 链接
4. `## 发布记录` — 发布信息列表
5. `## Comments` — 协作记录

**文件命名规则**（slug 从 title 派生 + topic prefix 防冲突）：
```
{category-prefix}-{topicId-or-slug}-{short-desc}.md

例：
  geo-b5-cursor-claude-code.md
  redbook-summer-2026-05-w1.md
  seo-q19-context-engineering.md
  event-melbourne-2026-06-meetup.md
  ad-hoc-bug-fix-mobile-pricing.md
```

**Git commit 策略**：
- routine 写入：自动 commit `chore(marketing-tasks): import {N} tasks from {routine-name}`
- Admin UI 改 status：自动 commit `chore(marketing-tasks): {task-id} {old} → {new}`
- Admin UI 改 checklist：**不自动 commit**（高频，污染 git log）→ 每天定时 squash commit
- Admin UI 加 comment：自动 commit `chore(marketing-tasks): comment on {task-id}`

### 3.1 MarketingTask Schema（`jr-academy/src/models/marketingTask.schema.ts`）

> **注意**：MongoDB schema 是 .md 文件的**镜像 / 索引**，不是权威源。所有字段和 .md YAML frontmatter 一一对应。

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.schema';

export type MarketingTaskDocument = MarketingTask & Document;

// 高层分类（用于 dashboard 分组 + KPI 拆分）
export enum TaskCategory {
  // GEO 内容工厂（v0.1 全部）
  GEO_CONTENT = 'geo-content',

  // 日常社媒
  SOCIAL_REDBOOK = 'social-redbook',
  SOCIAL_VIDEO = 'social-video',
  WEIXIN_PUBLIC = 'weixin-public',

  // SEO / AI 可见度
  SEO_OPTIMIZATION = 'seo-optimization',
  AI_VISIBILITY_FIX = 'ai-visibility-fix',

  // 选题 / 竞品 / 增长（来自 omni-report routine）
  CONTENT_TOPIC = 'content-topic',
  COMPETITOR_ACTION = 'competitor-action',
  GROWTH_HACK = 'growth-hack',

  // 活动 / 合作
  EVENT_OFFLINE = 'event-offline',
  CAMPAIGN = 'campaign',
  PARTNERSHIP = 'partnership',
  KOL_COLLABORATION = 'kol-collaboration',

  // 商业辅助
  TAOBAO_OPS = 'taobao-ops',
  CROSS_TEAM = 'cross-team',

  // 临时
  AD_HOC = 'ad-hoc',
}

// 子模块（具体工作流 + 路由依据）
export enum TaskModule {
  // GEO 工厂子模块（沿用 v0.1）
  GEO_LANDING_PAGE = 'geo-landing-page',
  GEO_GITHUB_REPO = 'geo-github-repo',
  GEO_AUTO_PUBLISH = 'geo-auto-publish',
  GEO_CSDN = 'geo-csdn',
  GEO_ZHIHU_COLUMN = 'geo-zhihu-column',
  GEO_SOHU_NETEASE_BAIJIA = 'geo-sohu-netease-baijia',
  GEO_JUEJIN = 'geo-juejin',
  GEO_WEIXIN_PUBLIC = 'geo-weixin-public',
  GEO_XIAOHONGSHU = 'geo-xiaohongshu',
  GEO_WEIXIN_VIDEO = 'geo-weixin-video',
  GEO_CROSS_PLATFORM_TRANSFER = 'geo-cross-platform-transfer',
  GEO_CANVA_DESIGN = 'geo-canva-design',
  GEO_FOUNDER_IP = 'geo-founder-ip',
  GEO_STUDENT_STORY = 'geo-student-story',
  GEO_TIMELY_NEWS = 'geo-timely-news',
  GEO_STUDENT_ANSWER_COORDINATION = 'geo-student-answer-coordination',
  GEO_CSDN_RESCUE = 'geo-csdn-rescue',

  // 日常社媒
  REDBOOK_DAILY = 'redbook-daily',
  REDBOOK_HOT_TOPIC = 'redbook-hot-topic',
  REDBOOK_ACCOUNT_MAINTENANCE = 'redbook-account-maintenance',
  VIDEO_DAILY = 'video-daily',
  VIDEO_LIVE = 'video-live',
  WEIXIN_DAILY = 'weixin-daily',
  WEIXIN_LONGFORM = 'weixin-longform',

  // SEO
  SEO_META_FIX = 'seo-meta-fix',
  SEO_CWV_FIX = 'seo-cwv-fix',
  SEO_SITEMAP = 'seo-sitemap',
  SEO_INTERNAL_LINK = 'seo-internal-link',
  SEO_404_FIX = 'seo-404-fix',

  // 活动
  EVENT_PLANNING = 'event-planning',
  EVENT_EXECUTION = 'event-execution',
  EVENT_RETROSPECTIVE = 'event-retrospective',

  // 增长 / 联名 / 玩法
  CAMPAIGN_PLAN = 'campaign-plan',
  PARTNERSHIP_NEGOTIATE = 'partnership-negotiate',
  KOL_OUTREACH = 'kol-outreach',
  GROWTH_HACK_LAUNCH = 'growth-hack-launch',

  // 淘宝
  TAOBAO_LISTING = 'taobao-listing',
  TAOBAO_PROMOTION = 'taobao-promotion',
  TAOBAO_CUSTOMER_SERVICE = 'taobao-customer-service',

  // 跨部门 / 临时
  CROSS_TEAM_SUPPORT = 'cross-team-support',
  AD_HOC_TASK = 'ad-hoc-task',
}

// 数据源（追溯任务从哪来 + 闭环用）
export enum TaskSource {
  PRD_GEO_CONTENT_FACTORY = 'prd-geo-content-factory',
  PRD_COURSE_MARKETING = 'prd-course-marketing',
  PRD_EVENT_PLANNING = 'prd-event-planning',
  ROUTINE_COMPETITOR = 'routine-competitor',
  ROUTINE_MARKETING_TOPICS = 'routine-marketing-topics',
  ROUTINE_GROWTH_PLAYBOOK = 'routine-growth-playbook',
  ROUTINE_AI_VISIBILITY = 'routine-ai-visibility',
  ROUTINE_SEO_PERFORMANCE = 'routine-seo-performance',
  ROUTINE_DAILY_ASSIGNMENTS = 'routine-daily-assignments',
  MANUAL_CREATE = 'manual-create',
  TASK_DERIVED = 'task-derived',
}

export enum TaskStatus {
  DRAFT = 'draft',
  READY = 'ready',
  IN_PROGRESS = 'in_progress',
  REVIEW = 'review',
  DONE = 'done',
  BLOCKED = 'blocked',
  ARCHIVED = 'archived',
}

export enum TaskPriority {
  P0 = 'p0',
  P1 = 'p1',
  P2 = 'p2',
}

export enum TaskPlatform {
  // 自有
  JIANGREN_BLOG = 'jiangren-blog',
  JIANGREN_LEARN = 'jiangren-learn',
  GITHUB = 'github',
  // 海外
  MEDIUM = 'medium',
  DEV_TO = 'dev-to',
  HASHNODE = 'hashnode',
  LINKEDIN = 'linkedin',
  REDDIT = 'reddit',
  TWITTER = 'twitter',
  // 中文社区
  CSDN = 'csdn',
  ZHIHU_COLUMN = 'zhihu-column',
  ZHIHU_QUESTION = 'zhihu-question',
  JUEJIN = 'juejin',
  WEIXIN_GZH = 'weixin-gzh',
  XIAOHONGSHU = 'xiaohongshu',
  WEIXIN_VIDEO = 'weixin-video',
  DOUYIN = 'douyin',
  BILIBILI = 'bilibili',
  // 自媒体
  SOHU = 'sohu',
  NETEASE = 'netease',
  BAIJIA = 'baijia',
  TOUTIAO = 'toutiao',
  JIANSHU = 'jianshu',
  CNBLOGS = 'cnblogs',
  CTO51 = '51cto',
  // 商业
  TAOBAO = 'taobao',
  // 线下
  OFFLINE_EVENT = 'offline-event',
  // 内部
  INTERNAL_DOC = 'internal-doc',
}

@Schema({ timestamps: true })
export class MarketingTask {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String })
  description?: string;

  // ───── 分类 ─────
  @Prop({ type: String, enum: Object.values(TaskCategory), required: true, index: true })
  category: TaskCategory;

  @Prop({ type: String, enum: Object.values(TaskModule), required: true, index: true })
  module: TaskModule;

  @Prop({ type: String, enum: Object.values(TaskSource), required: true, index: true })
  source: TaskSource;

  // 数据源元信息（如来自哪份 routine 报告）
  @Prop({
    type: {
      reportPath: String,        // 'omni-report/ai-visibility/2026-05-04.md'
      reportSection: String,     // 'Q19 Context Engineering'
      reportItemHash: String,    // hash 防重复 import
      topicId: String,           // PRD 话题 ID（A1 / B5 / C1 等）
    },
  })
  sourceMeta?: {
    reportPath?: string;
    reportSection?: string;
    reportItemHash?: string;
    topicId?: string;
  };

  // ───── 派活 ─────
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: false, index: true })
  assignee?: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  reviewer?: User;

  // ───── 状态 ─────
  @Prop({ type: String, enum: Object.values(TaskStatus), default: TaskStatus.DRAFT, index: true })
  status: TaskStatus;

  @Prop({ type: String, enum: Object.values(TaskPriority), default: TaskPriority.P2, index: true })
  priority: TaskPriority;

  // ───── 内容 ─────
  @Prop({ type: [String], enum: Object.values(TaskPlatform), default: [] })
  platforms: TaskPlatform[];

  @Prop({ type: Number })
  wordCount?: number;

  @Prop({ type: String })
  draftPath?: string;

  @Prop({ type: String })
  draftContent?: string;

  // ───── 发布 ─────
  @Prop([{
    platform: { type: String, enum: Object.values(TaskPlatform) },
    url: String,
    publishedAt: Date,
    aiCheckScore: Number,
    metrics: {
      views: Number,
      likes: Number,
      comments: Number,
      shares: Number,
      collections: Number,
    },
  }])
  publications: any[];

  // ───── 进度 ─────
  @Prop([{ text: String, done: { type: Boolean, default: false }, doneAt: Date }])
  checklist: { text: string; done: boolean; doneAt?: Date }[];

  @Prop({ type: Date, index: true })
  dueDate?: Date;

  @Prop({ type: Number, default: 0 })
  estimatedHours?: number;

  @Prop({ type: Number })
  actualHours?: number;

  // ───── 数据闭环 ─────
  @Prop({
    type: {
      relatedQueries: [String],   // ai-visibility Q1-Q20
      llmMentionRate: Number,
      serpRanking: Number,
      seoTrafficLift: Number,     // seo-performance 流量提升
      lastVerifiedAt: Date,
    },
  })
  outcomeMetrics?: any;

  // ───── 协作 ─────
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  createdBy: User;

  @Prop([{
    text: String,
    by: { type: MongooseSchema.Types.ObjectId, ref: 'User' },
    at: Date,
  }])
  comments?: { text: string; by: User; at: Date }[];

  @Prop({ type: [String], default: [] })
  tags: string[];

  // 跨任务派生（GEO 任务 done → 自动派生小红书拆段任务）
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'MarketingTask' })
  derivedFrom?: MarketingTask;

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'MarketingTask' }])
  derivedTasks?: MarketingTask[];
}

export const MarketingTaskSchema = SchemaFactory.createForClass(MarketingTask);

// 索引
MarketingTaskSchema.index({ assignee: 1, status: 1, priority: -1 });
MarketingTaskSchema.index({ status: 1, priority: -1, dueDate: 1 });
MarketingTaskSchema.index({ category: 1, status: 1 });
MarketingTaskSchema.index({ module: 1, status: 1 });
MarketingTaskSchema.index({ source: 1, createdAt: -1 });
MarketingTaskSchema.index({ 'sourceMeta.reportItemHash': 1 }, { unique: true, sparse: true }); // 防 routine 重复 import
MarketingTaskSchema.index({ tags: 1 });
```

### 3.2 ID-first 合规

| 字段 | 类型 | 合规 |
|---|---|---|
| assignee / reviewer / createdBy | `ObjectId, ref: 'User'` | ✅ |
| comments[].by | `ObjectId, ref: 'User'` | ✅ |
| derivedFrom / derivedTasks | `ObjectId, ref: 'MarketingTask'` | ✅ |
| sourceMeta.topicId | `String`（PRD 内部代号 A1 / B5）| ⚠️ 仅追溯用，不 populate |
| sourceMeta.reportItemHash | `String`（防重 hash）| ⚠️ 业务唯一键 |

无 slug 字段，无 `id || _id` 兜底。

---

## 4. 后端架构

### 4.1 模块结构（含 Markdown 主权层 3 个新 service）

```
jr-academy/src/modules/marketing-task/
├── marketing-task.module.ts
├── marketing-task.controller.ts          # 员工 endpoints
├── marketing-task-admin.controller.ts    # Admin 批量 endpoints (@SkipThrottle)
├── marketing-task-routine.controller.ts  # routine 写入专用 endpoints (受 routine token 保护)
├── marketing-task.service.ts             # 主协调（仅 delegation, ≤ 300 行）
├── services/
│   ├── marketing-task-crud.service.ts            # CRUD（写时同时改 .md + MongoDB）
│   ├── marketing-task-query.service.ts           # 仅读 MongoDB（衍生索引层）
│   ├── marketing-task-statistics.service.ts
│   ├── marketing-task-import.service.ts          # PRD → 写 N 个 .md
│   ├── marketing-task-source-sync.service.ts     # routine → 写 N 个 .md
│   ├── marketing-task-routing.service.ts
│   ├── marketing-task-publication.service.ts
│   ├── marketing-task-derivation.service.ts
│   ├── marketing-task-helper.service.ts
│   │
│   ├── 🆕 markdown-sync.service.ts               # ✅ Markdown 主权层核心
│   │     - parse(mdPath) → { frontmatter, body sections }
│   │     - serialize(task) → md 字符串
│   │     - updateFrontmatter(mdPath, partial)
│   │     - updateBodySection(mdPath, section, content)
│   │     - syncToMongoDB(mdPath) — upsert MongoDB
│   │     - reindexAll() — 扫描 active/+archive/ 全重建 MongoDB
│   │
│   ├── 🆕 filesystem-watcher.service.ts          # ✅ chokidar watcher
│   │     - watch('omni-report/marketing-tasks/{active,archive}/**/*.md')
│   │     - on('add' / 'change') → markdown-sync.syncToMongoDB(path)
│   │     - on('unlink') → MongoDB.delete(taskIdFromPath)
│   │     - dedup hash 防回环（自己写的 .md 不再触发同步）
│   │
│   └── 🆕 git-commit.service.ts                  # ✅ 自动 commit 策略
│         - commitTaskCreate(task) — chore(marketing-tasks): create {id} {title}
│         - commitStatusChange(task, oldStatus) — chore: {id} {old} → {new}
│         - commitChecklistToggle(task) — 不立即 commit，每天定时 squash
│         - commitComment(task, comment) — chore: comment on {id}
│         - dailySquash() — 每日定时合并 checklist 类琐碎 commit
├── scripts/
│   └── reindex.ts                                # ✅ 一键从 .md 重建 MongoDB
├── dto/
└── types/
```

### 4.2 Service 责任边界（按 600 行硬上限）

| Service | 主要方法 | 不做 |
|---|---|---|
| `CrudService` | CRUD（写操作事务性：先写 .md → 再写 MongoDB → git commit）| ❌ 复杂查询 / 派活 |
| `QueryService` | `findWithFilters()` / `boardView()` / `myTasks()` / `byCategoryDashboard()`（**只读 MongoDB**）| ❌ 数据修改 |
| `StatisticsService` | 个人 KPI / category 产出 / 数据闭环 dashboard | ❌ CRUD |
| `ImportService` | PRD 解析 → 写 N 个 .md（不直接写 MongoDB）| ❌ 写 MongoDB |
| `SourceSyncService` | 5 条 routine 解析 → 写 N 个 .md（带 reportItemHash 防重）| ❌ 写 MongoDB |
| `RoutingService` | Module → 默认 assignee 路由 / casual / 实习生 / 离职 fallback | ❌ 任务创建 |
| `PublicationService` | 发布信息更新（写 .md publications section）+ 触发 outcomeMetrics | ❌ 通用 update |
| `DerivationService` | 跨任务派生（写新 .md + 上游 .md frontmatter 加 derivedTasks）| ❌ CRUD |
| `HelperService` | status 流转校验 / 进度计算 / slug 派生 | ❌ DB 操作 |
| 🆕 `MarkdownSyncService` | parse/serialize .md ↔ MongoDB upsert / reindexAll() | ❌ 业务逻辑 |
| 🆕 `FilesystemWatcherService` | chokidar 监控 + dedup 防回环 | ❌ 解析 .md |
| 🆕 `GitCommitService` | 自动 commit 按操作类型策略 + 每日 squash | ❌ 业务逻辑 |

### 4.3 REST Endpoints

#### 员工 controller — 受 SuperAdminGuard 保护

```
GET    /marketing-tasks                       # 列表（filter: category / status / assignee / module / source）
GET    /marketing-tasks/board                 # 看板视图
GET    /marketing-tasks/me                    # 我的任务
GET    /marketing-tasks/:id
POST   /marketing-tasks                       # 手工创建
PATCH  /marketing-tasks/:id
DELETE /marketing-tasks/:id
POST   /marketing-tasks/:id/checklist
PATCH  /marketing-tasks/:id/checklist/:idx
POST   /marketing-tasks/:id/publications
PATCH  /marketing-tasks/:id/status
POST   /marketing-tasks/:id/derive            # 手动派生子任务
GET    /marketing-tasks/stats/me
GET    /marketing-tasks/stats/by-category
```

#### Admin 批量 controller — `@SkipThrottle()` + SuperAdminGuard

```
POST   /admin-cms/marketing-tasks/import-from-prd
       Body: { prdPath, category }            # GEO PRD / 课程营销 / 活动策划任意 PRD
POST   /admin-cms/marketing-tasks/auto-assign-batch
POST   /admin-cms/marketing-tasks/sync-from-routine
       Body: { routine: 'ai-visibility', reportPath }   # 手工触发 routine 数据汇入
GET    /admin-cms/marketing-tasks/stats/team
GET    /admin-cms/marketing-tasks/stats/category-dashboard
GET    /admin-cms/marketing-tasks/stats/source-pipeline   # 各数据源汇入率 + 完成率
POST   /admin-cms/marketing-tasks/export-published        # 导出 done 任务到对应 routine 的 published/
DELETE /admin-cms/marketing-tasks/bulk
```

#### Routine controller — 受 routine service token 保护

```
POST   /marketing-tasks/from-routine          # routine 自动写入端点
       Body: { routine, items: [...] }
       支持去重（按 sourceMeta.reportItemHash）
```

### 4.4 状态流转规则

```
draft → ready                      ✅ 派活
ready → in_progress                ✅ 开工
in_progress → review               ✅ 提交审稿
in_progress → blocked              ✅ 阻塞
review → done                      ✅ 通过
review → in_progress               ✅ 退回改
blocked → in_progress              ✅ 解除阻塞
done → archived                    ✅ 归档
* → archived                       ✅ 任何 → 归档
archived → *                       ❌ 归档不可恢复
done → in_progress                 ❌ 已发布不可回退
```

非法流转抛 `BadRequestException`。

---

## 5. Admin UI 设计

### 5.1 页面结构

```
jr-academy-admin/src/pages/MarketingTasks/
├── MarketingTasksBoard.tsx       # /marketing-tasks?view=board
├── MarketingTasksList.tsx        # /marketing-tasks?view=list
├── MarketingTasksStats.tsx       # /marketing-tasks?view=stats
├── EditMarketingTask.tsx         # /marketing-tasks/:id/edit
├── CreateMarketingTask.tsx       # /marketing-tasks/create
└── components/
    ├── KanbanColumn.tsx
    ├── TaskCard.tsx
    ├── TaskFilterBar.tsx
    ├── CategoryGroupSwitcher.tsx     # 看板按 category 还是 status 分组切换
    ├── ChecklistEditor.tsx
    ├── PublicationsTable.tsx
    ├── ImportFromPrdButton.tsx
    ├── SyncFromRoutineButton.tsx     # 手工触发 routine 数据汇入
    └── AutoAssignBatchButton.tsx
```

### 5.2 看板视图（默认）

**两种分组模式**（URL 参数切换）：

**模式 1：按 status 分组** (`?group=status`)——Chorus 7 列：

```
Draft | Ready | In Progress | Review | Done | Blocked | Archived
```

**模式 2：按 category 分组** (`?group=category`)——15 列横向滚动：

```
GEO Content | Social RedBook | Social Video | Weixin Public | SEO | AI Visibility | ...
```

**任务卡片显示**：
- 标题（截断 2 行）
- category 徽章（GEO / RedBook / SEO 等不同颜色）
- module 小标签
- source 来源 icon（PRD / routine 名缩写 / Manual）
- topicId 徽章（仅 source = PRD_GEO_CONTENT_FACTORY 时）
- 优先级色块
- assignee 头像 + 名字
- 平台 icons
- checklist 进度
- 截止日期
- 派生任务标记（如有 derivedFrom 或 derivedTasks）

**拖拽**：`@dnd-kit/core` + `@dnd-kit/sortable`，乐观更新。

**过滤器**：
- category（多选）
- module（多选）
- source（多选 — 区分手工 / PRD / routine）
- assignee（多选）
- priority / status / 标签

### 5.3 列表视图

```
[ ] | Title | Category | Module | Source | Assignee | Status | Priority | Due | Updated
```

支持多选批量改 status / priority / assignee + 列排序 + CSV 导出。

### 5.4 数据 dashboard

5 个区块：

1. **个人 KPI** — 每个员工本周产出 + 4 周累计（按 category 拆）
2. **Category 产出热力图** — 15 个 category 各本周完成数 vs 目标
3. **数据闭环** — ai-visibility Q1-Q20 提及率 / seo-performance 关键词排名 + 任务关联
4. **Source 漏斗** — 每条 routine 输出 N 条 actionable → 派活 N 条 → 完成 N 条 → ROI 验证
5. **跨任务派生链** — 公众号 → 小红书拆段 → 视频号脚本 完整链路可视化

### 5.5 URL state 规范

```
/marketing-tasks?view=board&group=status&category=geo-content,social-redbook&assignee=<userId>
/marketing-tasks?view=board&group=category&priority=p0,p1
/marketing-tasks?view=list&source=routine-ai-visibility&status=in_progress&page=2
/marketing-tasks?view=stats&range=4w&category=geo-content
/marketing-tasks/:id/edit?tab=publications
```

### 5.6 视觉风格（按 CLAUDE.md UI Design System）

styled-components + framer-motion / Neo-Brutalism / 不用 MUI / antd。

### 5.7 Admin 侧边栏入口

新增 section "运营 / 任务管理"：

```
运营 / 任务管理
├── 任务看板             /marketing-tasks?view=board
├── 任务列表             /marketing-tasks?view=list
├── 数据 Dashboard       /marketing-tasks?view=stats
├── ─────
├── 一键导入 PRD         （触发 import-from-prd modal）
├── 同步 omni-report     （触发 sync-from-routine modal）
└── ─────
└── 文档：Marketing PRD（链接到 GitHub）
```

---

## 6. 多源数据集成

### 6.1 源 1：PRD 一键 import

最低成本，启动期主用。

```typescript
// GeoTaskImportService.importFromPRD(prdPath, category)
// 解析 markdown 表格 → 创建 N 条 MarketingTask（status=draft, source=PRD_*）
```

支持 PRD：
- `PRD_GEO_CONTENT_FACTORY.md` → category=GEO_CONTENT，74 话题
- `PRD_COURSE_MARKETING.md`（未来）→ category=CAMPAIGN
- `PRD_EVENT_PLANNING.md`（未来）→ category=EVENT_OFFLINE

### 6.2 源 2：5 条 omni-report routine 自动写入

每条 routine 跑完后，新增"Phase: 写入 admin"：

```
Phase X — 写入 admin marketing-tasks:
  ├─ 解析自己产出的 actionable items
  ├─ 计算每条 reportItemHash（防重复）
  ├─ 调 POST /marketing-tasks/from-routine
  │     Body: {
  │       routine: 'ai-visibility',
  │       items: [
  │         { title, description, category, module, sourceMeta, ... }
  │       ]
  │     }
  └─ MongoDB 内：source=ROUTINE_AI_VISIBILITY，status=DRAFT，无 assignee
```

每条 routine 对应 category：

| Routine | TaskSource | TaskCategory（默认） |
|---|---|---|
| competitor-reports | ROUTINE_COMPETITOR | COMPETITOR_ACTION |
| marketing-topics | ROUTINE_MARKETING_TOPICS | CONTENT_TOPIC |
| growth-playbook | ROUTINE_GROWTH_PLAYBOOK | GROWTH_HACK |
| ai-visibility | ROUTINE_AI_VISIBILITY | AI_VISIBILITY_FIX |
| seo-performance | ROUTINE_SEO_PERFORMANCE | SEO_OPTIMIZATION |

### 6.3 源 3：手工创建

站会临时活、用户反馈处理、跨部门协作请求。

### 6.4 源 4：跨任务派生

`MarketingTaskDerivationService.deriveOnDone(taskId)` 在任务 status → DONE 时触发：

```typescript
// 例 1：GEO 公众号长文 done → 自动派生小红书拆段任务 + 视频号脚本任务
if (task.module === 'geo-weixin-public') {
  await create({
    title: `小红书拆段：${task.title}`,
    category: SOCIAL_REDBOOK,
    module: REDBOOK_HOT_TOPIC,
    derivedFrom: task._id,
    assignee: routing.byModule(REDBOOK_HOT_TOPIC), // 默认 Bella
  });
  await create({
    title: `视频号脚本：${task.title}`,
    category: SOCIAL_VIDEO,
    module: VIDEO_DAILY,
    derivedFrom: task._id,
    assignee: routing.byModule(VIDEO_DAILY), // 默认 Bella
  });
}
```

派生规则可配置（DerivationRules 表 / Phase 2）。

### 6.5 daily-assignments routine 升级

当前每工作日 10:30 CST 写 markdown 文件。升级后：

```
原 Phase B（消费上游报告 → 切待办池）
原 Phase C（按人头写 markdown）
                ↓
新增 Phase B'：
  ├─ Query MongoDB: GET /marketing-tasks?status=draft|ready&priority=p0,p1（前 N 条）
  ├─ 按 module 路由（RoutingService），设 assignee + 改 status: draft → ready
  ├─ 调 PATCH /admin-cms/marketing-tasks/auto-assign-batch
  └─ 把派出去的任务追加到当日 markdown 各人 todo 区块（保持兼容）

新增 Phase B''：
  ├─ 反向查 MongoDB：上周派活完成度（status=done / blocked / 仍 in_progress）
  └─ 写到 daily-assignments/{date}.md 顶部"上周完成度"区块
```

markdown 文件保留作为今日摘要 + git audit trail。

---

## 7. 路由表（Module → 默认 Assignee）

```typescript
const MODULE_TO_DEFAULT_ASSIGNEE: Record<TaskModule, string> = {
  // GEO 工厂
  GEO_LANDING_PAGE: 'hello@jiangren.com.au',
  GEO_GITHUB_REPO: 'hello@jiangren.com.au',
  GEO_AUTO_PUBLISH: 'hello@jiangren.com.au',
  GEO_CSDN: 'serena@jiangren.com.au',
  GEO_ZHIHU_COLUMN: 'serena@jiangren.com.au',
  GEO_SOHU_NETEASE_BAIJIA: 'serena@jiangren.com.au',
  GEO_JUEJIN: 'serena@jiangren.com.au',
  GEO_WEIXIN_PUBLIC: 'serena@jiangren.com.au',
  GEO_XIAOHONGSHU: 'bella@jiangren.com.au',
  GEO_WEIXIN_VIDEO: 'bella@jiangren.com.au',
  GEO_CROSS_PLATFORM_TRANSFER: 'bella@jiangren.com.au',
  GEO_CANVA_DESIGN: 'bella@jiangren.com.au',
  GEO_FOUNDER_IP: 'lightman@jiangren.com.au',
  GEO_STUDENT_STORY: 'TBD-student',
  GEO_TIMELY_NEWS: 'TBD-content',
  GEO_STUDENT_ANSWER_COORDINATION: 'serena@jiangren.com.au',
  GEO_CSDN_RESCUE: 'serena@jiangren.com.au',

  // 日常社媒
  REDBOOK_DAILY: 'TBD-redbook-account',  // 按账号路由（见 §7.1）
  REDBOOK_HOT_TOPIC: 'TBD-redbook-account',
  REDBOOK_ACCOUNT_MAINTENANCE: 'TBD-redbook-account',
  VIDEO_DAILY: 'bella@jiangren.com.au',
  VIDEO_LIVE: 'bella@jiangren.com.au',
  WEIXIN_DAILY: 'serena@jiangren.com.au',
  WEIXIN_LONGFORM: 'serena@jiangren.com.au',

  // SEO
  SEO_META_FIX: 'hello@jiangren.com.au',
  SEO_CWV_FIX: 'hello@jiangren.com.au',
  SEO_SITEMAP: 'hello@jiangren.com.au',
  SEO_INTERNAL_LINK: 'serena@jiangren.com.au',
  SEO_404_FIX: 'hello@jiangren.com.au',

  // 活动（按城市）
  EVENT_PLANNING: 'TBD-event-by-city',     // 见 §7.2
  EVENT_EXECUTION: 'TBD-event-by-city',
  EVENT_RETROSPECTIVE: 'TBD-event-by-city',

  // 增长 / 联名
  CAMPAIGN_PLAN: 'ada@jiangren.com.au',
  PARTNERSHIP_NEGOTIATE: 'ada@jiangren.com.au',
  KOL_OUTREACH: 'ada@jiangren.com.au',
  GROWTH_HACK_LAUNCH: 'ada@jiangren.com.au',

  // 淘宝
  TAOBAO_LISTING: 'neomi@jiangren.com.au',
  TAOBAO_PROMOTION: 'neomi@jiangren.com.au',
  TAOBAO_CUSTOMER_SERVICE: 'neomi@jiangren.com.au',

  // 跨部门 / 临时
  CROSS_TEAM_SUPPORT: 'TBD-crossteam',
  AD_HOC_TASK: 'TBD-adhoc',
};
```

### 7.1 小红书账号路由（按账号 → 人）

不是 module 级路由，是**账号级路由**（参考 `docs/COMPANY_TEAM.md`）：

| 账号 | 默认 owner |
|---|---|
| 澳洲匠人学院 / Rain姐说求职 / 澳洲实习猿 / Kiki的分享日记 | Summer |
| Amelia在悉尼 / momo在澳洲 / JR匠人学院 | Lily |
| UQ课代表 / UNSW课代表 / 墨大课代表 / 素人号 | KIKI-CD |

任务里加字段 `targetAccount?: string`（小红书账号名），路由按 `targetAccount` 查表。

### 7.2 活动按城市路由

```
EVENT_*:
  city=Sydney/Melbourne → Seren（周四+周五）/ Han（待标注工作日，进待办池）
  city=Brisbane → KIKI-BNE（待标注工作日）
  city=Chengdu / online → @Ada
```

任务里加字段 `targetCity?: string`。

### 7.3 离职 / 暂停 / casual fallback

参考 `omni-report/TEAM.md` 现有规则：

| 员工 | 状态 | 路由处理 |
|---|---|---|
| Aurora | ⏸️ 暂停 | 任何 EVENT_* 不路由给她，fallback Seren |
| Melody | HR-only | 不接 marketing 任务 |
| Amelia / Rain / Angela | 销售 | 不接 marketing 任务 |
| Seren | casual 周四+周五 | 派给她但 dueDate 至少要包含周四或周五 |
| Han / KIKI-BNE | 实习 2 天/周（待标注）| 进待办池，待标注工作日后再派 |
| Bella | 实习 3 天/周 | 派活节奏减半（per `PRD_DAILY_ASSIGNMENTS.md` §3.3）|
| Serena | 实习 5 天/周 | 几乎全职等价 |

`RoutingService.byModule()` 会自动调用 `TEAM.md` rules（建议 TEAM.md 改成 `team.json` 让 service 直接读）。

---

## 8. 权限模型

| 角色 | admin User 标识 | 能做什么 |
|---|---|---|
| 普通员工 | `roles: ['admin', 'staff']` | 看自己 + 同事任务 / 改自己任务 / 不能批量 / 不能删 |
| 运营负责人（Ada）| `roles: ['admin', 'ops-lead']` | 看全部 / 批量操作 / 派活 / 改 assignee / 不能删 |
| 创始人（Lightman）| `roles: ['admin', 'superadmin']` | 全部权限 + dashboard + 批量删除 |
| 系统用户（hello@jiangren.com.au / routine token）| `roles: ['admin', 'system']` | service token 调用 routine endpoints；复用现有公司邮箱，不开新账号 |

```typescript
@Patch(':id')
@Roles('staff', 'ops-lead', 'superadmin')

@Post('/admin-cms/marketing-tasks/import-from-prd')
@Roles('ops-lead', 'superadmin')
@SkipThrottle()

@Post('/marketing-tasks/from-routine')
@Roles('system')
```

---

## 9. Markdown 主权层（替代旧的"Markdown 兼容"）

> **原则重申（v0.2 关键升级）**：`.md` 文件是**唯一权威源**。MongoDB 是**衍生查询索引**。MongoDB 全表丢失能从 `.md` 完整重建。

### 9.1 数据流（双向同步）

```
①  routine / Claude / 创始人 / Admin UI 任意写入入口
            ↓
②  写 .md 文件（事务性 + git auto-commit）
            ↓
③  FilesystemWatcher 检测变化（chokidar）
            ↓
④  MarkdownSyncService 解析 YAML + 5 个 body section
            ↓
⑤  upsert MongoDB MarketingTask（按 frontmatter.id）
            ↓
⑥  Admin UI 读 MongoDB（看板 / 列表 / dashboard）

──────── 反向：UI 写操作 ────────

⑦  Admin UI 拖拽改 status（例）
            ↓
⑧  API 同时执行：
    a) 改 .md frontmatter（YAML 库 update）
    b) 同步写 MongoDB（避免等 watcher 延迟）
    c) git commit（按操作类型策略，见 §3.0）
            ↓
⑨  watcher 检测到 .md 变化（自己触发的）→ skip 同步（防回环）
```

### 9.2 PRD 一键导入（MVP 必做）

`ImportService.importFromPRD(prdPath, defaultCategory)`：

1. 读 PRD（如 `PRD_GEO_CONTENT_FACTORY.md`）
2. 解析 §3 表格 → N 个任务
3. **写 N 个 .md 文件到 `omni-report/marketing-tasks/active/`**（不是直接写 MongoDB！）
4. watcher 自动同步到 MongoDB

支持的 PRD：
- `PRD_GEO_CONTENT_FACTORY.md` → category=GEO_CONTENT
- 未来：课程营销 PRD / 活动策划 PRD（预留 parser 扩展点）

### 9.3 Routine 写入（5 条 routine）

每条 routine 跑完后：

1. 自己产出 `omni-report/{routine}/{date}.md` 周报（保持现状不变）
2. **新增一步：解析自己的 actionable items → 写 N 个 .md 任务文件到 `marketing-tasks/active/`**
3. 文件名带 `reportItemHash` 防重复（例：`ai-vis-2026-05-04-q19-csdn-rescue-{hash}.md`）
4. watcher 自动同步到 MongoDB

routine 不直接调 admin API 写 MongoDB——**唯一写入路径是写 .md 文件**。

### 9.4 Admin UI 写操作（事务性）

任何 UI 操作（拖拽改 status / 勾选 checklist / 加发布记录 / 加 comment）后端事务性执行：

```typescript
async updateStatus(taskId: string, newStatus: TaskStatus) {
  const mdPath = await this.findMarkdownPath(taskId);

  // 1. 改 .md（YAML frontmatter）
  await this.markdownSync.updateFrontmatter(mdPath, { status: newStatus });

  // 2. 同步写 MongoDB（不等 watcher）
  await this.crud.update(taskId, { status: newStatus });

  // 3. Git commit（按策略 — status 流转必 commit）
  await this.gitService.commit(`chore(marketing-tasks): ${taskId} status → ${newStatus}`);

  // 4. watcher 之后会检测到 .md 变化，但 sync service 用 dedup hash 跳过（防回环）
}
```

### 9.5 重建 MongoDB（disaster recovery）

任何时刻可以：

```bash
bun run scripts/marketing-tasks/reindex.ts
```

效果：
- 删除 MongoDB MarketingTask collection 全部记录
- 扫描 `omni-report/marketing-tasks/{active,archive}/**/*.md`
- 解析每个文件 → upsert MongoDB

完全无损。git history 是真权威。

### 9.6 跨任务派生（Phase 2）

派生 = 创建新 .md 文件 + 自动 link：

```typescript
// 上游任务 A done → 自动派生子任务 B、C
async deriveOnDone(taskA) {
  if (taskA.module === 'geo-weixin-public') {
    const taskB = await create({
      title: `小红书拆段：${taskA.title}`,
      derivedFrom: taskA.id,
      ...
    });
    // create() 内部：写 .md → watcher → MongoDB

    // 同时更新 taskA 的 .md frontmatter，加入 derivedTasks: [taskB.id]
    await this.markdownSync.appendDerivedTask(taskA.markdownPath, taskB.id);
  }
}
```

### 9.7 冲突解决

| 冲突场景 | 解决策略 |
|---|---|
| `.md` 与 MongoDB 不一致 | 永远以 `.md` 为准。watcher 重新解析 .md → 覆盖 MongoDB |
| 两个 routine 同时写同一 reportItemHash | 第二个写入失败（文件名冲突），routine 自己重试或合并 |
| Admin UI 写 .md 时文件被外部编辑 | 用 file lock（advisory lock）+ git merge driver |
| Git commit 失败（如 hook 拒绝） | API 写操作回滚（删 .md 改动 + MongoDB 恢复）|
| Watcher 漏掉某次 .md 变化 | 每小时跑一次 `reindex.ts` 全扫，diff 修正 |

---

## 10. MVP / Phase 2 / Phase 3

### MVP（目标 2-2.5 周内上线，含 Markdown 主权层）

- [x] Schema + 后端 **12 个 service**（9 业务 + 3 markdown 层：MarkdownSync / FilesystemWatcher / GitCommit）
- [x] 3 个 controller（员工 + admin 批量 + routine 写入）
- [x] Admin 4 个页面（Board / List / Edit / Create）
- [x] 看板拖拽（@dnd-kit）+ 双分组模式（status / category）
- [x] URL state（filter / view / group / pagination）
- [x] **`omni-report/marketing-tasks/` 目录结构 + .md 文件模板（YAML frontmatter + 5 个固定 body section）**
- [x] **MarkdownSyncService 完整实现**（parse / serialize / updateFrontmatter / updateBodySection / syncToMongoDB）
- [x] **FilesystemWatcher 启动**（chokidar + dedup 防回环）
- [x] **`scripts/reindex.ts` 一键重建 MongoDB**（disaster recovery 必备）
- [x] **GitCommitService 4 种策略**（create / status / comment / 每日 squash）
- [x] PRD import 改造：写 N 个 .md（不直接写 MongoDB）
- [x] **2 条 routine 对接**（ai-visibility + seo-performance）— routine 写 .md → watcher → MongoDB
- [x] CRUD 写操作事务性（.md + MongoDB 同步 + git commit）
- [x] 自动派活（路由表 + 城市 / 账号 / casual / 实习生节奏）
- [x] 权限（员工 / ops-lead / superadmin / system）
- [x] CSV 导出
- [x] **冲突测试**：故意改 .md 与 MongoDB 不一致 → 验证以 .md 为准

### Phase 2（4-8 周内）

- [ ] 剩余 3 条 routine 对接（competitor / marketing-topics / growth-playbook）
- [ ] daily-assignments routine 升级（双向 — 写任务 + 反查完成度）
- [ ] 跨任务派生规则（公众号 → 小红书 / 视频号 自动派生）
- [ ] 数据 dashboard（5 个区块）
- [ ] 单向 export 到 routine published 目录
- [ ] 评论 / @ 提醒
- [ ] 小红书账号级路由（targetAccount 字段）

### Phase 3（季度后）

- [ ] AI 辅助起草（Claude API → 任务 description 生成草稿）
- [ ] DerivationRules 配置表（页面化规则编辑）
- [ ] 燃尽图 / Sprint 视图
- [ ] 移动端
- [ ] 与 jr-wiki 对接
- [ ] 与外部消息（飞书 / 微信 / Slack）对接通知
- [ ] AI 辅助任务质量审核（自动跑 originality.ai 检测）

---

## 11. 验收标准

### 11.1 后端

- [ ] `marketing-task` 模块 9 个 service 全部 < 600 行
- [ ] 主 service 仅 delegation，无业务实现
- [ ] 没有跨 service 重复方法
- [ ] 所有 endpoint 通过 SuperAdminGuard / 路由 endpoint 通过 routine token
- [ ] `/admin-cms/marketing-tasks/*` 加 `@SkipThrottle()`
- [ ] schema 合规：assignee / reviewer / createdBy 全 ObjectId ref
- [ ] 索引齐全（含 sourceMeta.reportItemHash unique sparse 防 routine 重复）
- [ ] 单元测试覆盖：CRUD / Routing / SourceSync 关键逻辑 80%+
- [ ] e2e 测试：登录 → PRD import → routine 写入 → 自动派活 → 改 status → 添加发布 → 查看个人 KPI

### 11.2 前端

- [ ] 4 页面无 MUI / antd
- [ ] 全用 styled-components + framer-motion
- [ ] 看板拖拽流畅 + 双分组模式（status / category）
- [ ] URL state 同步：浏览器后退 / 直接打开 URL / 刷新 复现
- [ ] 桌面 1280px+ 完美 / 移动端不优先
- [ ] 空状态 / 错误状态 / 加载状态友好

### 11.3 业务

- [ ] PRD import 解析 GEO 74 话题正确
- [ ] 5 条 routine 至少 2 条能正确写入（含 reportItemHash 去重）
- [ ] 路由表正确：B5 → @Serena / 小红书账号 → 对应 owner / EVENT 按城市路由 / Aurora 暂停不被路由
- [ ] 普通员工只能看 / 改自己任务，看不到批量
- [ ] superadmin 能批量删除 + dashboard

### 11.4 不接受

- ❌ Service 超过 600 行
- ❌ assignee 用字符串而非 ObjectId
- ❌ `||` / `??` 兜底链 ≥ 2 层
- ❌ 引入 MUI / antd
- ❌ 不同步 URL state
- ❌ 没有 reportItemHash 去重导致 routine 写入重复任务

---

## 12. Roadmap

| 阶段 | 时间 | 范围 |
|---|---|---|
| MVP | Week 1-2 | §10 MVP 全部 |
| Phase 2 | Week 3-8 | §10 Phase 2 |
| Phase 3 | 季度后 | §10 Phase 3 |

---

## 13. 与其他 routine 关系图

```
                                    上游
PRD_GEO_CONTENT_FACTORY  PRD_COURSE_MARKETING  PRD_EVENT_PLANNING
        │                         │                    │
        └─────────┬───────────────┴────────────────────┘
                  ↓ import
                  │
                  │      ┌─ competitor-reports（周日）
                  │      │
                  │      ├─ marketing-topics（周一+三）
                  │      │
   sync-from ←───────────┼─ growth-playbook（周二）
                  │      │
                  │      ├─ ai-visibility（周三）
                  │      │
                  │      └─ seo-performance（周一）
                  ↓
   MarketingTask MongoDB collection ←──── outcomeMetrics 反馈
                  │                              ↑
                  │                              │
                  ↓ Phase B'                     │
   daily-assignments routine                    │
   （每工作日 10:30 CST）                       │
                  │                              │
                  ↓ 派给具体员工                 │
              员工执行                           │
                  │                              │
                  ↓ 状态流转                     │
              任务 done                         │
                  │                              │
                  ↓ 自动派生                     │
   小红书拆段 / 视频号脚本（跨任务派生）          │
                  │                              │
                  ↓ Phase 2 single export        │
   routine published/ 目录                      │
                  │                              │
              员工发布到第三方                   │
                  │                              │
                  ↓ 4 周后                       │
   ai-visibility / seo-performance routine ─────┘
   （跑出新一周数据，反馈到 outcomeMetrics）
```

---

## 14. 待用户回答 / 决策

### 14.1 业务决策

| 项 | 当前状态 | 影响 |
|---|---|---|
| `hello@jiangren.com.au` 系统用户开通 | 待运营 | 自动派活 / SEO 修复 / GEO landing page 都需要 |
| 看板拖拽 lib：@dnd-kit | 推荐已用 | 不阻塞 |
| Admin 侧边栏入口 | 建议新增 "运营 / 任务管理" section | 信息架构 |
| 普通员工是否能看同事任务 | 默认能看（透明）| 权限 |
| 5 条 routine 全对接节奏 | MVP 先 ai-visibility + seo-performance / Phase 2 剩余 3 条 | 验证流程后再扩 |
| 跨任务派生规则在哪定义 | hard-code 在 DerivationService（Phase 1）/ 配置表（Phase 3）| 影响灵活性 |
| TEAM.md 是否改成 team.json 让 service 读 | 建议 Phase 2 做 | 影响路由表实时性 |
| Aurora 状态变化时谁改路由表 | Ada 手工改 admin User → roles | 运维 |

### 14.2 🆕 Markdown 主权层决策

| 项 | 推荐方案 | 备选 / 影响 |
|---|---|---|
| **Git auto-commit 策略** | 4 类策略：① create / status 流转必 commit ② checklist 勾选不 commit（每日 squash）③ comment 必 commit ④ 发布记录必 commit | 备选：全部即时 commit（git log 污染）/ 全部不 commit（失去 audit）|
| **文件命名规则** | `{category-prefix}-{topicId-or-slug}-{short-desc}.md`（max 80 字符）| 备选：纯 ObjectId 命名（不可读）/ 纯 slug 命名（冲突）|
| **active vs archive 切分阈值** | status=archived 立即移到 archive/{YYYY-MM}/ | 备选：done 也移 archive（但近期 done 可能要回看）/ 永不移（active/ 越来越大）|
| **Watcher 心跳 + 全扫频率** | chokidar 实时 + 每小时 reindex.ts diff 修正 | 备选：仅 chokidar（漏掉就不知道）/ 仅每小时全扫（延迟高）|
| **冲突解决：MongoDB vs .md 不一致** | **永远以 .md 为准**，watcher 重新解析覆盖 MongoDB | 这是核心原则，不可改 |
| **Routine 写 .md 的去重 key** | `reportItemHash`（基于 routine 名 + 日期 + 条目内容 hash）| 备选：纯日期（routine 重跑会重复）/ UUID（永远不重，但 routine 重新跑同一个建议就是新任务）|
| **Admin UI 改 .md 后是否 push** | 默认 commit 不 push，每日定时 push | 备选：每次 commit 立即 push（多人协作冲突）/ 永不自动 push（需要人工）|
| **`.md` 文件存哪个 git repo** | `omni-report` repo（与 routine 报告同 repo）| 备选：jr-academy（混杂业务代码）/ 独立 repo（多 repo 维护）|
| **如果 .md 损坏（YAML 解析失败）** | watcher 跳过 + 记 error log + admin UI 显示该任务 "PARSE_ERROR" | 备选：删除 MongoDB 记录（数据丢失）/ 阻塞整个 sync（一坏全瘫）|
| **大量任务时性能** | active/ 1000 个 .md 实测 watcher OK / 10000+ 时考虑分目录（按 category 子目录）| 阈值待 stress test |

---

## 15. 工时估算

| 任务 | 工时 |
|---|---|
| 后端 schema + 9 个 service + 3 个 controller + DTO + 单测 | 3 天 |
| 前端 4 个页面 + 看板（双分组）+ 表格 + 表单 + filter | 3 天 |
| PRD import 解析逻辑（多 PRD 模板）| 0.5 天 |
| 路由表 + 城市 / 账号 / casual / 实习节奏 fallback | 0.5 天 |
| 2 条 routine 写入对接（ai-visibility + seo-performance）| 1 天 |
| 集成测试 + 调试 | 1 天 |
| 文档 + 团队 onboarding | 0.5 天 |
| **总计 MVP** | **~9.5 工日**（一个工程师 2 周）|

Phase 2 额外：~5-7 工日（剩余 3 条 routine + daily-assignments 双向 + 派生规则 + dashboard）。

---

## 附录 A：相关文档

- 上游：
  - [PRD_GEO_CONTENT_FACTORY.md](./PRD_GEO_CONTENT_FACTORY.md) — 74 话题静态库
  - [PRD_COMPETITOR_WEEKLY.md](./PRD_COMPETITOR_WEEKLY.md)
  - [PRD_MARKETING_TOPICS.md](./PRD_MARKETING_TOPICS.md)
  - [PRD_GROWTH_PLAYBOOK.md](./PRD_GROWTH_PLAYBOOK.md)
  - [PRD_AI_VISIBILITY.md](./PRD_AI_VISIBILITY.md)
  - [PRD_SEO_PERFORMANCE.md](./PRD_SEO_PERFORMANCE.md)
- 下游：
  - [PRD_DAILY_ASSIGNMENTS.md](./PRD_DAILY_ASSIGNMENTS.md)
- 个人任务清单：
  - [BELLA_GEO_TASKS.md](./BELLA_GEO_TASKS.md)
  - [SERENA_GEO_TASKS.md](./SERENA_GEO_TASKS.md)
- 团队：
  - [TEAM.md](./TEAM.md)
  - [docs/COMPANY_TEAM.md](../docs/COMPANY_TEAM.md)
- 灵感：
  - [hades217/Chorus](https://github.com/hades217/Chorus)

## 附录 B：术语

- **GEO**（Generative Engine Optimization）：面向 LLM 引擎的内容优化（marketing 工作的一个 category）
- **状态流转**：Draft → Ready → In Progress → Review → Done → Blocked → Archived（7 列 Kanban）
- **数据闭环**：内容 / SEO 任务发布后，routine 周报抓取数据 → outcomeMetrics 字段更新 → dashboard 显示 ROI
- **Category**：高层任务分类（GEO / 小红书 / 公众号 / SEO 等 15 类）
- **Module**：具体子模块（30+ 个，路由依据）
- **Source**：任务数据来源（PRD import / 5 条 routine / 手工 / 派生）
- **跨任务派生**：一个任务 done → 自动创建 N 个子任务（如公众号 → 小红书拆段 + 视频号脚本）
