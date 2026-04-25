# JR Academy 竞品周报 — PRD

## 1. 背景与目标

### 1.1 为什么要做

JR Academy 现在做竞品调研只有两个场景：

1. **设计新 Bootcamp 时**跑 `/bootcamp-research` skill — 单点深度，针对某一个方向（如 "AI Adoption Specialist"），调研一次性的、产出 `market-data.md` 进 curriculum 目录
2. **CEO/PM 拍脑袋** — 看到某竞品出了新课，临时手动开 PR 改课纲

这两条路径的共同问题：**没有持续的市场情报输入**。结果是：

- 通往 AGI 之路上线了"AI Builder 实战"两周后我们才知道
- DeepLearning.AI 出了新的 Agent 课程我们没及时对标
- Coursera 上 Andrew Ng 的新专项发布、Maven 上某个 cohort 课卖爆了，这些信号没人收集
- 中文 AI KOL（赛博禅心、卡兹克）每周推荐的工具/课程，没汇总到平台决策层
- 澳洲本地 Bootcamp（Coder Academy / Academy Xi）的定价调整、新班次开课，PM 不知道

后果是**JR Academy 的课程上线节奏总比竞品慢 2-4 周**，错失最佳市场窗口。

### 1.2 目标

每周日晚 8:00 (Brisbane) 自动产出一份**全球 + 中文 + 澳洲三市场**的竞品情报简报，覆盖刚结束的一周（周一到周日全覆盖），作为：

- PM 周一站会的开场材料（"上周市场发生了什么"）
- 课程团队规划下一阶段 Bootcamp/Lesson 的输入
- CEO 战略决策的事实基础（不是凭感觉）

### 1.3 非目标

- ❌ **不**替代 `/bootcamp-research` 单方向深度调研（两者并存，定位不同）
- ❌ **不**做实时监测（每周快照已足够，AI 教育市场不是高频交易）
- ❌ **不**自动改课纲、自动发文章 — 报告只做信息聚合，决策仍由人做
- ❌ **不**抓付费墙后的内部数据（Maven cohort 销量、Coursera GMV 等无法获取的指标，不强求）
- ❌ **不**做竞品监控告警（"Competitor X 降价 30%" 这种实时推送，v2 再说）

### 1.4 当前状态

| 维度 | 现状 |
|---|---|
| 调研触发方式 | 人工，按需 |
| 调研频率 | 不固定，平均每月 0-1 次 |
| 调研覆盖 | 单方向（如 AI Engineer），不覆盖全市场 |
| 信息归档 | 散落在 `curriculum/{bootcamp}/market-data.md` 或微信聊天 |
| 决策输入 | PM 凭印象 + Google 临时搜索 |

---

## 2. 用户场景

### 2.1 主要场景：周一早会

**Persona**：JR Academy PM / 课程负责人  
**时间**：周一上午 9:30，团队站会前  
**痛点**：周末发生的市场动态完全断片  
**新流程**：

1. 周日 20:00 (Brisbane) Agent 跑完，周报 commit 到 `competitor-reports/YYYY-MM-DD.md`（日期 = 周日当天）
2. PM 周一 9:15 打开 GitHub 看周报（手机/电脑）
3. 周一 9:30 站会开场："上周通往 AGI 之路上了 X，DeepLearning.AI 出了 Y，我们要不要响应？"

### 2.2 次要场景：季度战略复盘

每季度末，PM 把 12-13 份周报合在一起，做：
- 竞品出新课的频率分布（谁在加速？）
- 定价趋势（涨价/降价/打折）
- 内容热点的演变（年初是 RAG，季度末是 Agent？）

---

## 3. 调研范围（Sources）

### 3.1 全球 AI 学习平台（10 个）

| # | 名称 | 看什么 |
|---|---|---|
| 1 | DeepLearning.AI | 新 Specialization、新 short course、Andrew Ng 公开演讲 |
| 2 | Coursera | AI 专项新品、新合作大学、Plus 订阅价变动 |
| 3 | Hugging Face Learn | Agents / NLP / Audio / Diffusion 新课 |
| 4 | fast.ai | Jeremy Howard 新课、新 lesson |
| 5 | Anthropic Cookbook + Claude Skills | 新 cookbook、新 skill、官方 best practices |
| 6 | OpenAI Academy + Cookbook | 新 guide、Sora/GPT 新功能教程 |
| 7 | LangChain Academy | LangGraph / LangSmith 新课 |
| 8 | Maven | 本周热门 cohort-based course、知名讲师新开课 |
| 9 | Scrimba | AI Engineer Path 更新、互动 Lab 新功能 |
| 10 | AI Engineer (swyx) + Latent Space | 大会议程、Newsletter 重点话题 |

### 3.2 中文 AI 学习平台（6 个）

| # | 名称 | 看什么 |
|---|---|---|
| 1 | 通往 AGI 之路 (waytoagi.com) | 新教程、新工具收录、社区热门话题 |
| 2 | 极客时间 (geekbang.org) | 新 AI 课、训练营开班、价格 |
| 3 | 量子位 + 机器之心 | 新课、付费报告、企业培训动态 |
| 4 | 得到 App | 新 AI 课、罗振宇/吴军/万维钢 AI 主题动态 |
| 5 | AI 产品榜 | 本周新上 AI 工具 Top 10 |
| 6 | 中文 AI KOL | 赛博禅心、卡兹克、宝玉、林粒粒、AI 进化论 — 公众号/B站/小红书本周内容 |

### 3.3 澳洲 Bootcamp（4 个 — 英文站对标）

| # | 名称 | 看什么 |
|---|---|---|
| 1 | Coder Academy | 新班次、Web Development / Data Science / AI 课纲变化 |
| 2 | Academy Xi | UX / Product / AI 课程、企业培训 |
| 3 | General Assembly Sydney | Bootcamp 新主题、就业报告 |
| 4 | Le Wagon Australia | Web Dev / Data Science 班次、价格 |

### 3.4 全球 AI Newsletter（3 个 — 趋势监测）

The Rundown AI / TLDR AI / Ben's Bites — 不是直接竞品，是行业风向标。

### 3.5 动态发现（兜底）

Agent 每周用以下关键词搜本周新冒出的玩家（防漏）：

- `"AI bootcamp" OR "AI course" launch site:producthunt.com`
- `"AI 训练营" 开班 2026`
- `Australia coding bootcamp 2026`
- `cohort-based AI course 2026`

---

## 4. 调研维度（5 个）

每个竞品按以下 5 个维度提取信息（不是每个维度每周都有更新，没更新就跳过）：

| # | 维度 | 提取什么 | 信号强度 |
|---|---|---|---|
| 1 | **新课 / Bootcamp 上线** | 课程名、主题、价格、开课日期、链接 | 🔴 最高 |
| 2 | **定价 & 营销活动** | 折扣力度、促销期、企业培训新方案、订阅价变动 | 🟡 高 |
| 3 | **内容出圈** | 小红书/B站/X/LinkedIn/YouTube 上获得 10k+ 互动的 AI 教育内容 | 🟡 高 |
| 4 | **AI 行业动态** | 新模型、新工具、新框架（影响课程内容方向） | 🟢 中 |
| 5 | **求职信号** | 全球 + 澳洲 AI 相关岗位招聘趋势、薪资变化（数据源：LinkedIn / Seek / Indeed） | 🟢 中 |

---

## 5. 输出规范

### 5.1 文件路径

```
competitor-reports/YYYY-MM-DD.md
```

文件名是周报生成的当天日期（周一）。

### 5.2 Markdown 结构

```markdown
# 竞品周报 YYYY-MM-DD（覆盖 YYYY-MM-DD ~ YYYY-MM-DD）

## TL;DR（5 条以内）

- 通往 AGI 之路上线《AI Agent 实战》，定价 ¥1980，开课日期 X
- DeepLearning.AI 出了新 short course "Building with Anthropic Claude"，免费
- ...

## 1. 新课 / Bootcamp 上线（按市场分组）

### 全球
- **DeepLearning.AI** — [Building with Anthropic Claude](https://...) — 1 小时 short course，免费 — 上线日期 2026-04-22
- **Coursera** — Andrew Ng 新 Specialization "AI for Everyone v2" — $49/月 — ...

### 中文
- ...

### 澳洲
- ...

## 2. 定价 & 营销

- Maven：年中 30% off 促销，截止 2026-05-15
- 极客时间：训练营 5 折券，新用户专享
- ...

## 3. 内容出圈

| 平台 | 标题 / 链接 | 互动数 | 一句话点评 |
|---|---|---|---|
| 小红书 | "我用 Cursor 一周做了 5 个产品" | 12k 收藏 | 个人 builder 内容继续走红，Vibe Coding 方向正确 |
| B站 | 林粒粒《AI Agent 全流程》 | 80k 播放 | 中文 AI Agent 教学需求旺盛 |

## 4. AI 行业动态影响课程方向

- Anthropic 发布 Claude Skills（YYYY-MM-DD）— 我们的 Vibe Coding Bootcamp 应增加 Claude Skills 实战章节
- ...

## 5. 求职信号

- LinkedIn 澳洲 "AI Engineer" 职位本周新增 X 个（上周 Y）
- Seek "Prompt Engineer" 平均薪资 AUD 130k - 180k
- ...

## 6. 对 JR Academy 的建议（3 条以内）

1. **响应**：通往 AGI 之路出了 Agent 实战课，建议本周内启动我们 AI Engineer Bootcamp 的 Agent 章节增强
2. **机会**：Maven 30% off 期间，我们可以做对标定价测试
3. **风险**：DeepLearning.AI 的免费 Claude 课程会蚕食付费市场，需要差异化（强调中文 + 求职服务）

## 附录：信息来源
- [链接 1]
- [链接 2]
- ...
```

### 5.3 反 AI 味格式要求（强制）

参考 `CLAUDE.md` 的 Anti-Template Content Rule。具体到周报：

| 禁止 | 必须 |
|---|---|
| ❌ "在当今快速发展的 AI 教育市场中..." | ✅ 直接列具体公司 + 课程名 |
| ❌ "本周市场动态丰富多彩..." | ✅ "本周覆盖 23 个竞品，发现 7 个新课、3 个定价变动" |
| ❌ "DeepLearning.AI 是行业领先的平台..." | ✅ 不写废话，直接说他们出了什么 |
| ❌ "建议我们密切关注..." | ✅ "建议本周内启动 X" |

每条信息必须包含：**真实链接 + 具体数字 + 日期**。如果某周某维度没东西可写，直接跳过该维度，不要为了凑字数硬编。

---

## 6. 技术方案

### 6.1 架构

```
┌────────────────────────────────────────────────────┐
│  Anthropic Cloud (CCR Remote Agent)                │
│                                                    │
│  Cron: 0 10 * * 0 (UTC) = 周日 8pm Brisbane        │
│                                                    │
│  ┌──────────────────────────────────────────────┐  │
│  │  Claude Sonnet 4.6                           │  │
│  │  + Web Search                                │  │
│  │  + Bash / Read / Write / Edit / Glob / Grep  │  │
│  │  + Notion MCP (write summary page only)      │  │
│  │                                              │  │
│  │  Phase 0: Read PRD + history                 │  │
│  │  Phase 1: Write skeleton MD → commit         │  │
│  │  Phase 2: 5 batches WebSearch + Edit + commit│  │
│  │  Phase 3: Finalize TL;DR + 建议 → commit     │  │
│  │  Phase 4: Notion 极简摘要页 (≤1k tokens)     │  │
│  └──────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────┘
```

### 6.2 配置

| 项 | 值 |
|---|---|
| Routine name | `JR Competitor Weekly Research` |
| Cron | `0 10 * * 0`（UTC，等于周日 8pm Brisbane） |
| Repo | `https://github.com/JR-Academy-AI/omni-report` |
| Model | `claude-sonnet-4-6` |
| Tools | Bash / Read / Write / Edit / Glob / Grep / WebSearch |
| MCP | Notion（v1 启用，hub page `34ddd76b576d8068abbed825956db0c6`，**只写极简摘要 + GitHub 全文链接**，避免 stream idle timeout） |
| Environment | Default (env_016YZGciCpxXVeLRinN31W4D) |

### 6.3 Prompt 设计原则

- 自包含 — Agent 不知道之前对话，prompt 必须把所有 context 给齐
- 列出全部 23 个竞品名 + URL（Agent 不要自己搜竞品名单）
- 强调 commit message 格式（`feat(competitor): {phase} {date}`）
- 强调反 AI 味规则（直接 inline，不依赖 CLAUDE.md）
- 输出失败时（如某竞品搜不到），明确说"X 本周无更新"，不要瞎编

完整 prompt 见 `附录 A`。

### 6.4 防 stream idle timeout 设计（重要）

CCR 远程 agent 有 streaming idle 限制（约 ~60s 没输出 token 就被 kill）。**v1 首次跑就在 Phase 4 被 kill**——单次往 Notion 塞整篇 200 行 markdown，input 超长导致 idle 超时。

修复后的设计原则：

| 反模式 ❌ | 正确模式 ✅ |
|---|---|
| 跑完 5 个 batch 最后一次性 push | 每个 batch 立即 commit + push（断了下次能续） |
| 一次输出 1500-3000 字长文 | 先写 `_TBD_` 骨架，每个 batch 用 Edit 填 ≤300 字段 |
| 一次 MCP call 塞整篇 MD | Notion 只塞 ≤1k tokens 摘要 + GitHub 全文链接 |
| 23 个 source 一次 search | 拆 5 个 batch，每 batch ≤3 次 WebSearch |

**核心心法**：每个 turn 输出 ≤1k tokens，每个 tool call input/output ≤3k tokens。

这套 pattern 也适用于 omni-report 里其他 routine（SEO healthcheck 已经天然按"一次 healthcheck 一次 commit"做了，无需改）。

---

## 7. 验收标准

第一份周报（2026-05-03，周日）必须满足：

- [ ] 文件路径正确：`competitor-reports/2026-05-03.md`
- [ ] 包含 23 个竞品的覆盖（每个至少出现一次，没更新就标 "本周无新动态"）
- [ ] 至少 3 条新课信息（公司名 + 课程名 + 价格 + 链接 + 日期）
- [ ] 至少 3 条定价/营销信息
- [ ] 至少 3 条内容出圈案例（带平台 + 互动数 + 链接）
- [ ] TL;DR 控制在 5 条以内
- [ ] 给 JR Academy 的建议 3 条以内（不是泛泛"密切关注"）
- [ ] **零** "在当今...""综合性""深入探讨"等 AI 味开场
- [ ] commit 已 push 到 main
- [ ] 报告整体在 1500-3000 字之间（信息密度高，不水）

---

## 8. 风险与对策

| 风险 | 概率 | 对策 |
|---|---|---|
| Web 搜索拿不到付费墙后数据（Maven 销量、Coursera GMV） | 高 | 接受；只用公开信号 |
| 中文站点反爬 / 加载失败 | 中 | 多源验证，失败标"本周无法访问" |
| 报告质量随时间漂移（变 AI 味） | 中 | 每月人工审一次，必要时改 prompt |
| 周报生成失败（Agent crash / 网络） | 低 | 检查 Routines 控制台 https://claude.ai/code/routines；可手动 re-run |
| 某竞品改版导致旧 URL 失效 | 中 | Agent 在 prompt 里加 fallback 搜索逻辑 |
| 周报内容重复（每周都说同样的事） | 中 | Agent 必须先读上周报告，新报告只写 delta |

---

## 9. Roadmap

| 版本 | 范围 | 时间 |
|---|---|---|
| **v1（本期）** | 23 竞品 × 5 维度，5 batch 渐进 commit 到 repo + Notion 极简摘要页（hub `34ddd76b...`） | 2026-04-25 已跑通首份 |
| **v2** | 月度汇总周报为月报，自动生成给 CEO 的战略建议 | 2026-Q3 |
| **v3** | Admin 后台加 Tab 整合趋势分析 | 2026-Q4 |
| **v4** | 触发式告警（"Competitor X 降价 30%" 立即推送） | 待定 |

---

## 附录 A：Remote Agent Prompt（v1.1 — 防 stream idle timeout）

> Routine `trig_013pfieJXDDCa9rQktNxFoKx` 实际运行的 prompt。如修改本附录，**必须同步 update routine**（否则 routine 上跑的还是旧 prompt）。

```
你是 JR Academy 的竞品研究 Agent。今天周日，生成本周（覆盖周一到周日）竞品周报。

⚠️ 关键策略：「骨架 + 渐进填充 + 每段就 commit」，避免单次输出过长导致 stream idle timeout。

━━━━━━━━━━━━━━
【Phase 0：准备】
━━━━━━━━━━━━━━
1. 读 PRD_COMPETITOR_WEEKLY.md（了解格式与硬规则）
2. `ls competitor-reports/`（确认历史）
3. 算今天日期：`TZ='Australia/Brisbane' date +%Y-%m-%d` → 设为 `$DATE`

━━━━━━━━━━━━━━
【Phase 1：写骨架 + 立刻 commit】
━━━━━━━━━━━━━━
Write `competitor-reports/$DATE.md` 骨架（每个 section 用 _TBD_ 占位）。
commit + push：`feat(competitor): scaffold $DATE`

━━━━━━━━━━━━━━
【Phase 2：5 批 search + Edit + commit】
━━━━━━━━━━━━━━
每批最多 3 次 WebSearch、3 次 Edit，做完立即 commit + push（防丢）。

- Batch A — 全球平台 (10): DeepLearning.AI, Coursera, Hugging Face Learn, fast.ai, Anthropic, OpenAI, LangChain, Maven, Scrimba, AI Engineer
- Batch B — 中文平台 (6): 通往 AGI 之路, 极客时间, 量子位, 机器之心, 得到, AI 产品榜, 中文 KOL
- Batch C — 澳洲 (4): Coder Academy, Academy Xi, General Assembly Sydney, Le Wagon Australia
- Batch D — Newsletter + 行业动态: The Rundown AI, TLDR AI, Ben's Bites
- Batch E — 求职: LinkedIn / Seek / Indeed 全球 + 澳洲 AI 岗位

每批 Edit 对应骨架 section，commit message 格式：`feat(competitor): {batch} batch`。

━━━━━━━━━━━━━━
【Phase 3：收尾】
━━━━━━━━━━━━━━
Edit「TL;DR」(5 条) 和「§6 建议」(3 条，可执行)。
commit "feat(competitor): finalize $DATE" + push

━━━━━━━━━━━━━━
【Phase 4：Notion 极简摘要（≤1k tokens 防 timeout）】
━━━━━━━━━━━━━━
⚠️ 不要把整篇 MD 丢进 Notion——之前这里被 stream idle timeout 杀过。

调用 `notion-create-pages`：
- parent: `{"type": "page_id", "page_id": "34ddd76b576d8068abbed825956db0c6"}`
- 标题: `竞品周报 $DATE`
- icon: `📊`
- content: 模板（只填变量，不要贴全文）

```markdown
**覆盖周期**：$DATE-6 ~ $DATE
**🔗 完整报告**：https://github.com/JR-Academy-AI/omni-report/blob/main/competitor-reports/$DATE.md

---

## TL;DR
[复制 5 条]

## 关键动态（3 条）
[挑本周最重要的 3 件事]

## 对 JR 的建议
[复制 3 条]

---
_详细 23 个 source / 定价 / 内容 / 求职 → 看 GitHub 全文_
```

━━━━━━━━━━━━━━
【硬规则 — 反 AI 味】
━━━━━━━━━━━━━━
- 禁止 "在当今...""综合性""深入探讨""值得关注""快速发展" 等空话
- 每条信息必须有：公司名 + 具体内容 + 真实链接 + 日期/数字
- 没东西就跳过，禁止硬编
- §6 建议必须可执行（启动 X 章节）
- MD 整体 1200-2000 字

━━━━━━━━━━━━━━
【完成确认】
━━━━━━━━━━━━━━
- [ ] competitor-reports/$DATE.md 已 push（约 6-7 个 commit）
- [ ] Notion 摘要页已创建
- [ ] 0 条 AI 味开场
```

完整 23 source URL 列表见 §3。Routine 内 prompt 包含完整 URL（自包含），本附录省略以方便阅读。

---

## 附录 B：相关文档

- `curriculum/.claude/skills/bootcamp-research.md` — 单方向深度调研 skill（与本周报互补）
- `CLAUDE.md` §"禁止生成模版化/AI 味内容" — 输出质量硬规则
- `https://claude.ai/code/routines` — Routine 管理控制台
