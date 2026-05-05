# omni-report

JR Academy 运营报告归档仓库。各类站点健康度 / SEO / 数据完整性 / 内容质量等定时跑出来的报告都落在这里。

## 目录

```
seo-reports/{YYYY-MM-DD}.md          每日 jiangren.com.au sitemap 健康度报告
seo-performance/{YYYY-MM-DD}.md      每周一 GSC + DataForSEO + PSI 排名/流量/CWV 周报
competitor-reports/{YYYY-MM-DD}.md   每周日 23 家竞品 × 5 维度情报简报
marketing-topics/{YYYY-MM-DD}.md     每周一+三 基于热点 + 竞品周报的内容/活动选题包
ai-visibility/{YYYY-MM-DD}.md        每周三 GEO 可见度（20 query 测 AI 是否推荐 JR）
growth-playbook/{YYYY-MM-DD}.md      每周二 5 个增长玩法 idea（裂变 / 游戏 / 限时 / 联名）
daily-assignments/{YYYY-MM-DD}.md    每工作日 10:30 CST 把上面 4 份报告切成 10 人 todo（消费层）
marketing-tasks/                      🆕 Marketing 任务 .md 文件（Markdown-First / git audit 单一权威源）
  active/                              进行中（status != archived）
  archive/{YYYY-MM}/                   归档（done + archived）
  _config/routing-table.json           Module → 默认 assignee 路由（36 module + 11 小红书账号 + 5 城市）
scripts/                              生成报告的脚本
TEAM.md                              团队路由表（10 人 + 4 TBD，daily-assignments 必读）
PRD_COMPETITOR_WEEKLY.md             竞品周报 PRD
PRD_MARKETING_TOPICS.md              内容选题包 PRD
PRD_AI_VISIBILITY.md                 AI 可见度 PRD（诊断层 — 识别 LLM 提及率空白）
PRD_SEO_PERFORMANCE.md               SEO 表现周报 PRD（关键词排名 + GSC + Web Vitals）
PRD_GROWTH_PLAYBOOK.md               增长玩法 PRD
PRD_DAILY_ASSIGNMENTS.md             每日工作分配 PRD（消费层）
PRD_GEO_CONTENT_FACTORY.md           🆕 GEO 内容工厂 PRD（74 话题静态库 + 9 类形态 + 22 渠道）
PRD_MARKETING_TASKS_ADMIN.md         🆕 Marketing 任务管理 admin module PRD（Markdown-First 架构 / v0.2 通用）
BELLA_GEO_TASKS.md                   🆕 Bella 任务清单（视频/视觉/跨平台搬运 — 3 天/周）
SERENA_GEO_TASKS.md                  🆕 Serena 任务清单（公众号 owner / 长文主力 — 5 天/周）
```

## Marketing Tasks Admin Module（jr-academy-admin）

Marketing 任务的统一管理系统，**Markdown-First** 架构：

```
.md 文件（git tracked，唯一权威源）
   ↓ FilesystemWatcher（chokidar）
MongoDB MarketingTask collection（衍生查询索引）
   ↓
Admin UI（jr-academy-admin /marketing-tasks）
   ↑ 拖拽 / 改 status / 加发布记录
   └→ 写 .md + 同步 MongoDB + git auto-commit
```

3 条写入入口都先写 `.md`：
1. PRD 一键 import（`PRD_GEO_CONTENT_FACTORY.md` 的 74 话题）
2. 5 条 omni-report routine 的 actionable items
3. Admin UI 操作

启动后端：
```bash
cd jr-academy && bun run start              # 标准启动（推荐）
ENABLE_WATCHER=true bun run start            # 启用 .md filesystem watcher
bun run scripts/marketing-task-reindex.ts    # 一键从 .md 重建 MongoDB（disaster recovery）
```

完整规范见 [`PRD_MARKETING_TASKS_ADMIN.md`](./PRD_MARKETING_TASKS_ADMIN.md)（含 Markdown 主权层 / 12 个 service / 4 个 admin 页面 / 7 列状态流 / 路由表设计）。配套 [`PRD_GEO_CONTENT_FACTORY.md`](./PRD_GEO_CONTENT_FACTORY.md)（74 话题静态库）+ [`BELLA_GEO_TASKS.md`](./BELLA_GEO_TASKS.md) + [`SERENA_GEO_TASKS.md`](./SERENA_GEO_TASKS.md)。

## SEO Performance Weekly

每周一 09:00 AEST (Brisbane) 由远程 routine 自动跑（cron `0 23 * * 0` UTC）：

1. **Phase 1**: GSC API 拉本周 search analytics（query / page / country / device 4 维度）
2. **Phase 2A-D**: DataForSEO SERP 抓 100 关键词 × 3 location（AU-EN / AU-ZH / CN-ZH）排名，4 batch 渐进 commit
3. **Phase 3**: PageSpeed Insights 抓 GSC top 50 流量页面的 Core Web Vitals
4. **Phase 4**: diff 上周 → 找排名跌幅 / 涨幅 / 内容机会 / 流量异常 / CWV 差页面 → ROI 排序
5. **Phase 5**: 渲染 markdown 周报（含 mermaid 历史折线，最近 12 周）

数据落 `seo-performance/{YYYY-MM-DD}.json` (结构化) + `.md` (人读)。每 phase 结束立即 git push（防 stream idle timeout）。

本地手跑：

```bash
bun run seo-perf                    # 全流程
bun run seo-perf:gsc                # 只跑 Phase 1
bun run seo-perf:serp -- --batch=A  # SERP batch A 只跑品牌词
bun run seo-perf:cwv -- --top=20    # 只跑 top 20 页面 CWV
bun run seo-perf:analyze            # 重新分析（不重新拉数据）
bun run seo-perf:render             # 重新渲染 markdown
```

完整规范见 [`PRD_SEO_PERFORMANCE.md`](./PRD_SEO_PERFORMANCE.md)。
Setup（GSC service account / DataForSEO / PSI key）见 [`scripts/seo-performance/SETUP.md`](./scripts/seo-performance/SETUP.md)。

**为什么重要**：替代 Semrush Pro（$140/月）的核心功能 — 关键词排名追踪 + GSC 表现 + CWV 监控。月成本 $0.72。

## SEO Healthcheck

每天 AEST 06:00 由远程 routine 自动跑：

1. 拉 `https://jiangren.com.au/sitemap.xml` index → 递归展开 23 个子 sitemap
2. 并发 HEAD 请求所有 URL（concurrency=20, 10s timeout, 跟随 3xx）
3. 分类：200 / 3xx / 404 / 410 / 5xx / timeout / DNS-error
4. diff 昨天的报告 → 标 🆕 新坏 / 🔁 持续坏 / ✨ 已修复
5. 写 `seo-reports/{YYYY-MM-DD}.md`

本地手跑：

```bash
bun run scripts/seo-healthcheck.ts                # 用今天 AEST 日期
bun run scripts/seo-healthcheck.ts 2026-04-25     # 指定日期（写到该日期文件名）
```

## Competitor Weekly Research

每周日 20:00 AEST (Brisbane) 由远程 routine 自动跑：

1. **5 个 batch 渐进 commit**（防 stream idle timeout）：先写骨架 → Batch A 全球 → B 中文 → C 澳洲 → D Newsletter → E 求职 → finalize TL;DR + 建议
2. WebSearch 23 家竞品（全球 AI 学习平台 10 + 中文 AI 学习 6 + 澳洲 Bootcamp 4 + AI Newsletter 3）× 5 个维度（新课/定价/内容/行业/求职）
3. 反 AI 味格式硬规则（每条信息要有公司名 + 链接 + 日期/数字）
4. 写 `competitor-reports/{YYYY-MM-DD}.md`（约 6-7 个 commit 渐进 push）
5. Notion MCP 写**极简摘要页**（TL;DR + 关键动态 + 建议 + GitHub 全文链接，≤1k tokens）到 hub page `34ddd76b576d8068abbed825956db0c6`

完整规范见 [`PRD_COMPETITOR_WEEKLY.md`](./PRD_COMPETITOR_WEEKLY.md)。

Routine: https://claude.ai/code/routines/trig_013pfieJXDDCa9rQktNxFoKx

## Marketing Topics Weekly

每周一 08:00 AEST (Brisbane) 由远程 routine 自动跑：

1. 读前一天产出的 competitor-reports（拿 AI 行业动态，省一半 search）
2. WebSearch 当周微博 / 知乎 / B 站 / 小红书 trending
3. 输出：5 场推荐线上讲座 + 3 场线下活动 + 联名机会 + 长尾话题
4. 4 个 Phase 渐进 commit（防 stream idle timeout）
5. 写 `marketing-topics/{YYYY-MM-DD}.md`
6. Notion MCP 写极简摘要页

完整规范见 [`PRD_MARKETING_TOPICS.md`](./PRD_MARKETING_TOPICS.md)。

## AI Visibility Weekly (GEO)

每周三 09:00 AEST (Brisbane) 由远程 routine 自动跑：

1. 用 20 个真实学员 query（学习入门 5 + 求职 5 + 工具 5 + 平台 5）测 AI 引擎是否推荐 JR
2. **双层测试**：Web Search（模拟 Google）+ Claude LLM 自答（代理 AI 助手视角）
3. 输出仪表盘：JR 被提及次数 / 空白 query / 竞品提及频率 / 周环比
4. 给 SEO + 内容团队具体行动清单（"补这 3 篇深度文 / 修这 2 个 meta"）
5. 写 `ai-visibility/{YYYY-MM-DD}.md` + Notion 全文同步

完整规范见 [`PRD_AI_VISIBILITY.md`](./PRD_AI_VISIBILITY.md)。

**为什么重要**：~50% 学员第一次接触 JR 不是通过 Google，而是通过 AI 助手。GEO（Generative Engine Optimization）是 2026-2027 SEO 战场。

## Growth Playbook Weekly

每周二 07:00 AEST (Brisbane) 由远程 routine 自动跑：

1. 读上游：竞品周报（看竞品玩法）+ 选题包（看本周热点）+ 节日 calendar
2. 锚定 JR 业务清单（Bootcamp / Lab / 求职 / 社群）+ 经典 growth hack 灵感池
3. 输出 **5 个为 JR 量身设计的增长玩法**（每个含落地步骤 + 预估指标）
4. 加 1-2 个"本周不推荐"玩法（说明为什么）
5. 写 `growth-playbook/{YYYY-MM-DD}.md` + Notion 全文同步

完整规范见 [`PRD_GROWTH_PLAYBOOK.md`](./PRD_GROWTH_PLAYBOOK.md)。

## Daily Assignments（消费层 — 把上游报告切成人头 todo）

每工作日 10:30 CST (= 12:30 AEST winter / 13:30 AEDT summer) 由远程 routine 自动跑：

1. 读 `TEAM.md` 拿到当前 10 人 + 4 TBD 路由规则
2. 读最近 7 天的 4 份上游报告（competitor / marketing-topics / growth-playbook / ai-visibility）→ 提取所有 actionable items
3. 按 TEAM.md §2 路由规则把 actionable items 切成 10 人 + 4 TBD
4. 时区感知：成都 / 墨尔本 / 布里斯班 各自处理，Seren 周四+周五才主动派、海外实习生工作日待标注则进待办池
5. 写 `daily-assignments/{YYYY-MM-DD}.md`（成都日期）+ Notion 极简摘要

完整规范见 [`PRD_DAILY_ASSIGNMENTS.md`](./PRD_DAILY_ASSIGNMENTS.md)。团队路由见 [`TEAM.md`](./TEAM.md)。

## 加新报告类型

新增报告类型时：

1. 在 `scripts/` 写 `{report-type}-healthcheck.ts`
2. 在仓库根新建 `{report-type}-reports/` 目录
3. 在 `package.json` 加 `"{report-type}": "bun run scripts/{report-type}-healthcheck.ts"`
4. 创建 RemoteTrigger routine（参考 SEO 那个）

每个报告类型独立目录，不混在一起。
