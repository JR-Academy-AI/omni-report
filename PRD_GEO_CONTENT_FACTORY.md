# JR Academy GEO 内容工厂 — PRD

> **状态**：起草中（v0.1）— 2026-05-04
> **依赖**：`PRD_AI_VISIBILITY.md`（上游识别空白 query）/ `PRD_DAILY_ASSIGNMENTS.md`（下游派人执行）/ `TEAM.md`（团队路由表）

---

## 1. 背景与目标

### 1.1 为什么要做

`PRD_AI_VISIBILITY.md` 每周三跑出来的 AI 可见度周报已经能识别"哪些 query JR 没被 LLM 提及"，但报告的"建议行动"列长期是 **2018 年风格的传统 SEO 建议**——"写一篇 5000 字深度文 + 加 schema markup"、"提交 URL 至 GSC"、"修 meta description"。

实际跑了 2 周后发现：

1. **报告诊断对了，但行动层错了**。jiangren.com.au 自己写多少博客都没用——LLM 不读 JR 官网，LLM 读"别人在 csdn / 知乎 / 搜狐 写的榜单文 + GitHub 教程 repo + Reddit 讨论"。
2. **Q6 资产正在悄悄死**。CSDN/JR_Academy 博客上周 Q6 SERP #3，本周完全消失，没人发现没人修——证明 GEO 资产需要主动运营，不是发完就完事。
3. **2026-05-04 周报里 19/20 个 query 完全空白**，但报告每周给"5 条建议"——按这个节奏 19 个空白 query 需要 4 周才补完，且建议条目分散到 5 类工作（落地页 / 投稿 / GitHub / 个人 IP / Reddit），完全没人按这个分工执行。
4. **74 个候选话题 + 7 类内容形态 + 22 个发布渠道**——没有统一的话题库 + 渠道矩阵 + 自动 vs 人工分工，运营没法落地。

omni-report 现在缺最后一公里——**把 AI 可见度周报识别的内容缺口，转化为可执行的内容生产流水线**。

### 1.2 目标

建立一套**静态内容工厂 + 动态周计划生成**的双层机制：

**静态层（本 PRD §3-§5）**：
- 74 个具体话题清单，按 9 类内容形态分组（紧急修复 / 技术深度 / 横评 listicle / 求职专题 / 工具实战 / 创始人 IP / 学员故事 / 内部产品揭秘 / 时事追踪）
- 每个话题含：核心内容（具体写什么）/ 字数 / 主发渠道 / 自动 vs 人工 / 工时
- 22 个发布渠道分级：✅ 完全自动（API/git push）/ ⚠️ 半自动（浏览器自动化 + 人审）/ 🚫 必须人工

**动态层（本 PRD §6 — Phase 2 实现）**：
- 每周一 8:00 AEST 跑一个新 routine `geo-content-factory`，读最新 AI 可见度周报 + 话题库 + 已发布资产清单
- 输出本周 `geo-content-factory/{YYYY-MM-DD}.md`：5-10 个本周必发话题 + 主发渠道 + 自动/人工分工
- 下游接 `daily-assignments` routine：自动话题分给 Claude / 工程师 / 运营，人工话题进 TBD section

**4 周后预期**：LLM 提及率从 5% → 25-35%（10/20 query 至少出现 1 次）+ 月新增第三方榜单 4-8 篇 + 1 个 GitHub repo 上线。

### 1.3 非目标

- ❌ **不替代 PRD_AI_VISIBILITY.md** — 那是诊断层，本 PRD 是治疗层。两个独立 routine，不合并
- ❌ **不直接执行内容** — 本 PRD 定义"该做什么"，不是"AI 自动写完发出去"。Phase 1 仍人工/半自动产出，Phase 2 才考虑自动产出
- ❌ **不重写 daily-assignments** — daily-assignments 仍按 TEAM.md 派人，本 PRD 通过周计划文件作为它的额外输入源
- ❌ **不做"软文代发"业务** — 我们写内容、定渠道，但实际 CSDN/搜狐/网易号投稿动作仍由运营人员或外包代发执行
- ❌ **Phase 1 不做内容效果监测** — 写完发出后，是否被 LLM 抓取、Q1-Q20 提及率有没有涨，由 PRD_AI_VISIBILITY.md 周报负责（它本来就在跑）

---

## 2. 内容分层 + 渠道矩阵

### 2.1 22 个发布渠道分级

| 渠道 | 自动化级别 | 怎么实现 | 注意事项 |
|---|---|---|---|
| `jiangren.com.au/blog` | ✅ 完全自动 | git push + Next.js MDX | 自有阵地 |
| `jiangren.com.au/learn/*` | ✅ 完全自动 | 直接代码提交 | 自有阵地 |
| GitHub repo（awesome-* / 教程 repo） | ✅ 完全自动 | `gh` CLI / Octokit API | 自有阵地，LLM 高权重源 |
| Medium（机构号 @jr-academy） | ✅ 完全自动 | Medium API（POST `/v1/users/{id}/posts`）| 个人 token |
| dev.to | ✅ 完全自动 | dev.to REST API | 个人 token |
| Hashnode | ✅ 完全自动 | Hashnode GraphQL API | 个人 token |
| Substack / 自有 newsletter | ✅ 完全自动 | Email API | 自有 |
| Twitter/X（机构号） | ✅ 半自动 | API（每月 1500 免费）| 防限流 ≤ 5/日 |
| CSDN | ⚠️ 半自动 | 有 API 但批量易封号 | **建议人工，否则掉权重**（Q6 已踩过坑） |
| 掘金 | ⚠️ 半自动 | Playwright 浏览器自动化 | 风控严，建议人工 |
| 搜狐号 / 网易号 / 百家号 | ⚠️ 半自动 | 浏览器自动化 | 内容审核 24h，需人工领证 |
| 51CTO / 博客园 | ⚠️ 半自动 | 浏览器自动化 | 风控宽，可批量 |
| 知乎专栏 | 🚫 必须人工 | 反爬虫极严 | 一封号永久 |
| 知乎答题 | 🚫 必须人工 | 不能 AI 文 | AI 文识别强，限流 |
| 小红书 | 🚫 必须人工 | 反爬虫 + 视觉内容 | 多账号矩阵 |
| 微信公众号 | 🚫 必须人工 | 排版 + 配图 + 审核严 | 团队作业 |
| Reddit | 🚫 必须人工 | 账号 karma 培养 | 软广直接 ban |
| Quora | 🚫 必须人工 | 账号培养 | 同上 |
| LinkedIn（创始人个人） | 🚫 必须人工 | 个人 IP，不能假 | 必须本人发 |
| Medium 创始人个人号 | 🚫 必须人工 | 个人 IP | 必须本人发 |
| Course Report / Switchup 评价 | 🚫 必须人工 | 必须真实学员 | 邀请毕业生写 |
| B 站 / 抖音 / YouTube | 🚫 必须人工 | 视频拍摄 | 团队作业 |

**汇总**：
- ✅ 完全自动：7 个渠道（自有阵地 + 海外内容平台 API）
- ⚠️ 半自动：7 个渠道（中文社区 + 自媒体平台）
- 🚫 必须人工：8 个渠道（高反爬虫平台 + 真人 IP + 视频/视觉内容）

### 2.2 9 类内容形态

| 类型 | 内容形态 | 数量 | 主要渠道 | 主要执行方 |
|---|---|---|---|---|
| A | 技术深度文 | 13 | jiangren.com.au + Medium + dev.to + GitHub | Claude / 工程师（自动）|
| B | 横评对比 / Listicle | 12 | jiangren.com.au + Medium + 知乎 + 公众号 | 自动 + 半自动混合 |
| C | 求职 / 移民专题 | 10 | jiangren.com.au + 知乎 + LinkedIn | 半自动 + 创始人 IP |
| D | 工具实战教程 | 8 | dev.to + 掘金 + 知乎 + jiangren.com.au | 半自动 |
| E | 创始人 / 资深导师个人 IP | 10 | 知乎 + 公众号 + LinkedIn + Medium 个人号 | 🚫 全人工 |
| F | 学员故事 / 真实案例 | 8 | 知乎 + 小红书 + 公众号 + B 站 | 🚫 全人工 |
| G | 内部产品揭秘 | 6 | jiangren.com.au + Medium + dev.to + 掘金 | ✅ 全自动 |
| H | 时事 / 热点追踪 | 10 | Medium + dev.to + 知乎 + LinkedIn | 半自动（时事即时反应）|
| I | GitHub 教程 Repo | 3 个 repo | GitHub + GitHub Pages | ✅ 全自动 |

**自动 vs 人工总配比**：
- ✅ 完全自动可发：约 47%（34 篇 + 3 个 GitHub repo）
- ⚠️ 半自动：约 30%（22 篇）
- 🚫 必须人工：约 23%（17 篇 + 创始人 IP 系列 10 篇）

---

## 3. 完整话题清单（74 个）

> 每个话题含：核心内容（具体写什么）/ 字数 / 主发渠道 / 自动级别 / 工时。
> **标题候选不锁死**——发布时按 SEO 关键词最新热度调整。

### 3.A 紧急修复：已有内容补落地页（5 篇 — Week 1 完成）

针对 AI 可见度周报 2026-05-04 识别的"内容已存在但缺公开页"。

| # | URL slug | 标题候选 | 内容来源 | 大纲（H2）| 字数 | 自动 | 工时 |
|---|---|---|---|---|---|---|---|
| A1 | `/learn/context-engineering` | （**先修索引，不写新内容**）| 已有内容 | 提交 GSC URL Inspection / sitemap.xml 加这条 / 首页 + AI Engineer 课程页加内链 / 检查 UAT noindex | — | ✅ | 15 分钟 |
| A2 | `/learn/mcp-getting-started` | "MCP 完整入门指南：从 0 到 1 写第一个 Server" | AI Engineer 课程 MCP 章节 | ① MCP 是什么（USB-C 类比）② 协议三要素：Resources/Tools/Prompts ③ FastMCP Python 写一个查 GitHub 的 Server（< 50 行）④ 怎么接到 Claude Desktop ⑤ 5 个澳洲求职常用 MCP 实战（LinkedIn/Notion/Calendar/SEEK/Hays）⑥ 进阶资源 | 2500 | ✅ | 1 天 |
| A3 | `/learn/claude-skills` | "Anthropic Claude Skills 实战手册：17 个官方 Skill + 自建 SKILL.md 全解析" | `.claude/skills/` 内部资产 | ① Skills 是什么（vs MCP / Agent）② 17 个官方 Skills 拆解 ③ SKILL.md 模板 + frontmatter 字段 ④ 写一个 Skill 的 5 步骤 ⑤ JR 自用 Skills 案例（lesson-design / classroom-deck-builder 公开化）⑥ Skills 怎么发布到 marketplace | 2500 | ✅ | 1 天 |
| A4 | `/learn/ai-agent-bootcamp` | "AI Agent 实战学习路径：从 LangChain 到 LangGraph 到 MCP（2026 版）" | AI Engineer 课程 Agent 主线 | ① Agent ≠ Chatbot：决策循环 ② LangChain Tools 和 Memory ③ LangGraph 多 Agent 编排 ④ MCP 标准化工具接入 ⑤ 实战：构建一个 LinkedIn 求职 Agent（澳洲场景）⑥ 评测和部署（LangSmith） | 2500 | ✅ | 1 天 |
| A5 | `/learn/ai-engineer-roadmap-2026` | "2026 AI Engineer 完整学习路线图（含澳洲求职路径）" | curriculum/ai-engineer-bootcamp | ① 角色定义（vs MLE / Data Scientist）② 第 1-3 月：Python + LLM API + Prompt ③ 第 4-6 月：RAG + Agent + LangGraph ④ 第 7-9 月：Context Engineering + 多 Agent 协作 ⑤ 第 10-12 月：portfolio + 求职（澳洲细分）⑥ 推荐资源（含其他平台，客观）⑦ 常见 3 个误区 | 2500 | ✅ | 2 天 |

**5 篇通用规则**：
- 文末固定 4 行内链：「上一步：X / 下一步：Y / 完整学习：AI Engineer Bootcamp / 想找工作：Career Guidance」
- meta description 必含目标 query 完整字串 + 数字（"2026 / 5 步 / 12 个月"）
- 每篇至少 1 段「澳洲就业视角」差异化（JR 唯一护城河）

### 3.B 技术深度文（13 篇）

| # | 话题 | 核心内容 | 字数 | 主发渠道 | 自动 | 工时 |
|---|---|---|---|---|---|---|
| B1 | MCP 完整入门：从协议到实战 5 个 server | ① MCP 协议三层（Resources/Tools/Prompts）拆解 ② FastMCP Python 写第一个 server（< 50 行查 GitHub）③ 接到 Claude Desktop 的 config 写法 ④ 5 个澳洲求职常用 MCP：LinkedIn/Notion/Calendar/SEEK/Hays（带真实代码）⑤ 调试 MCP 的 3 个工具 | 4000 | jiangren.com.au + Medium + dev.to | ✅ | 1.5 天 |
| B2 | LangGraph 多 Agent 编排：写一个 LinkedIn 求职 Agent（澳洲场景）| ① LangGraph vs LangChain 取舍 ② StateGraph 定义（4 节点：搜岗 → 评估匹配 → 改简历 → 投递）③ 真实代码 100 行 ④ 接 Hays / SEEK API ⑤ Eval（用 LangSmith 跑 50 条 query）| 3500 | GitHub repo + Medium + jiangren.com.au | ✅ | 2 天 |
| B3 | Context Engineering：把 200K context 压到 30K 不丢关键信息 | ① 为什么 context 越长越差（lost in middle 实验图）② 4 种压缩策略：摘要 / 嵌入检索 / 工具用调度 / 流式压缩 ③ 实测数字（同一个 task 200K vs 30K 准确率对比）④ 工业级实现（基于 LlamaIndex / LangChain）⑤ JR 在 AI Engineer Bootcamp 用的 7 步压缩流水线 | 4500 | jiangren.com.au + Medium + 掘金 + 知乎 | ⚠️（知乎手发）| 2 天 |
| B4 | Anthropic Skills 实战 17+5：JR 自创 5 个 Skill 完整代码 | ① Skills vs MCP vs Agent 区别（一张图）② 17 个官方 Skills 一一拆解 + 截图 ③ JR 自创 5 个：lesson-design / classroom-deck-builder / curriculum-review / blog-longform-writer / learn-direction-creator ④ SKILL.md 模板 + frontmatter 字段表 ⑤ 怎么发布到 Skills Marketplace | 5000 | GitHub repo + jiangren.com.au + Medium 英文 | ✅ | 3 天 |
| B5 | Cursor + Claude Code 双工作流：一周交付 SaaS（含完整 commit history）| ① 工具分工：Cursor 80% 写 / Claude Code 20% 跨文件重构 ② 真实案例：JR Skills Data Manager（Hono + React）真实 commit log ③ 截图：每天什么时间用什么工具 ④ 5 个翻车场景（Claude Code 上下文窗口、Cursor diff 冲突、git hook）⑤ 月度成本对比 | 4000 | CSDN + jiangren.com.au + Medium 英文 | ⚠️（CSDN 人工）| 2 天 |
| B6 | RAG 已死？2026 年生产级 RAG 架构 5 个变化 | ① 传统 RAG 三件套（chunk + embedding + similarity）的 4 个失败模式 ② 2026 年新架构：Agentic RAG + Hybrid Search + Reranker + Late Chunking + Context Compression ③ 真实代码（LlamaIndex 新 API）④ 评测对比（同 query，传统 vs 2026 架构准确率）⑤ 什么时候不用 RAG（6 种场景）| 4500 | jiangren.com.au + 掘金 + Medium 英文 + 知乎 | ⚠️ | 2 天 |
| B7 | Vibe Coding 实战：澳洲 AI 工程师怎么用 AI 写代码（差异化 vs DataWhale）| ① 不写"什么是 Vibe Coding"（DataWhale 写过）写"澳洲 AI 工程师工作流"② 真实日记：一周 5 天用 AI 工具的具体 commit 数 ③ 5 个澳洲特有场景（时区不同步导致的 PR review 用 AI 加速、客户用英语 + 中文混写需求）④ 代码效率数据 ⑤ 给澳洲求职者的 portfolio 建议 | 3500 | CSDN + 掘金 + 知乎 | ⚠️ | 1.5 天 |
| B8 | Claude Code Hooks 完整指南：12 个生产级 hook 配置 | ① Hooks 是什么（事件驱动）② settings.json 完整字段（pre-commit / post-edit / on-stop / before-bash）③ 12 个真实 hook 配置：自动跑 type-check、commit 前 lint、敏感词扫描、自动 push、自动 changelog… ④ JR 内部 hook 库（开源到 GitHub）| 3500 | dev.to + GitHub repo + jiangren.com.au | ✅ | 2 天 |
| B9 | AI Prompts Management 实战：把 50 个 prompt 搬到统一管理库 | ① 为什么不能硬编码 prompt（version、A/B test、模型切换都死）② JR 的 src/common/prompts 架构图 ③ 字段：version / defaultModel / temperature / maxTokens / cacheable ④ 怎么版本化（git + 数据库 audit log）⑤ 5 个翻车故事（澳洲 GST 不是统一 10% 这种）| 3500 | jiangren.com.au + Medium 英文 | ✅ | 1.5 天 |
| B10 | Anthropic Prompt Caching 工业级实战：从 0 命中到 80% 命中 | ① Caching 原理（5 分钟 TTL）② cache_control 用法 + 4 个 anchor 位 ③ 实测：JR Bootcamp 课程生成 prompt 缓存命中前后的成本对比（具体数字 - 用 Anthropic 真实 dashboard 截图）④ 何时不用缓存 ⑤ 多用户场景的缓存隔离 | 3000 | jiangren.com.au + Medium 英文 + dev.to | ✅ | 1.5 天 |
| B11 | Claude Sub-agents 实战：把一个长任务拆 10 个 agent 并行 | ① Subagent 概念（vs single agent）② 真实场景：JR omni-report 5 个 routine 并行架构 ③ 任务调度：Task Tool + run_in_background ④ 错误处理 + 上下文隔离 ⑤ 何时拆 / 不拆（决策矩阵）| 3500 | dev.to + jiangren.com.au + Medium 英文 | ✅ | 2 天 |
| B12 | PBL 多 Agent 模拟：我们用 Vercel AI SDK + 5 个 Agent 给学员造了个真实工作场景 | ① PBL 概念（Project-Based Learning + 多 Agent 模拟）② JR 的 pbl-service 架构（独立 NestJS）③ 5 个 Agent 分工：客户 Agent / 产品经理 Agent / 资深工程师 Agent / 测试 Agent / 老板 Agent ④ 学员对话 transcripts（脱敏）⑤ 为什么从主 backend 拆出来（Vercel AI SDK 类型爆炸）| 4000 | jiangren.com.au + Medium 英文 + 掘金 | ✅ | 2 天 |
| B13 | Anthropic Skills + MCP + Agent 三件套对比：到底什么时候用哪个 | ① 三者本质区别（一张表）② Skills：声明式技能 / MCP：标准化工具协议 / Agent：自主决策循环 ③ 5 个真实场景判断：什么时候只用 Skill / 何时加 MCP / 何时进 Agent ④ JR 自家产品的选择记录（哪些 feature 用什么）| 3500 | Medium 英文 + dev.to + jiangren.com.au | ✅ | 1.5 天 |

### 3.C 横评对比 / Listicle（12 篇）

| # | 话题 | 核心内容 | 字数 | 主发 | 自动 | 工时 |
|---|---|---|---|---|---|---|
| C1 | 2026 年中文 AI 学习平台横评（11 大平台 6 维度）| 维度：课程深度 / 价格 / 算力 / 项目 / 求职 / 适合人群。平台：极客时间 / Hugging Face / DataWhale / 科大讯飞 / 三节课 / 阿里云大学 / 腾讯云 / 匠人学院 / Le Wagon / Coursera / 黑马程序员。**JR 排第 X 位（不要永远第 1）**。每个平台 300-400 字 | 6000 | jiangren.com.au + 知乎 + 搜狐号 | ⚠️ | 3 天 |
| C2 | Best AI Bootcamp Sydney 2026: 7 Schools Compared | 全英文。Le Wagon / Institute of Data / JR Academy / General Assembly / Coder Academy / UTS Bootcamp / Western Sydney AI Cert。每家：价格 + 课程 + 就业率 + 签证支持 + 学员评价。决策矩阵 | 4000 | Medium + jiangren.com.au + dev.to | ✅ | 2 天 |
| C3 | Australian Coding Bootcamp 2026 Complete Guide: 9 Programs | 全澳州横扫。重点：政府补贴 (ASQA 认证)、签证支持、AI/Data 含量、part-time 选项 | 4500 | Medium + jiangren.com.au | ✅ | 2 天 |
| C4 | Best AI Bootcamp for Beginners 2026: 12 Programs Including 3 AU Options | 国际 9 + 澳洲 3。区分：纯线上 / 线下 / 混合。给完全 0 基础的决策树 | 4500 | Medium + Hashnode + dev.to | ✅ | 2 天 |
| C5 | AI Bootcamp with Job Placement: 2026 Reality Check（戳穿营销话术）| ① "100% job guarantee" 5 个套路 ② TripleTen vs Springboard vs JR 真实就业率（带数据来源）③ 4 个学员真实故事（含一个失败案例）④ 自检清单：报名前必问的 8 个问题 | 5000 | jiangren.com.au + Medium + 知乎 | ⚠️ | 2 天 |
| C6 | 悉尼 AI Bootcamp 中文学员视角 5 家对比 + 签证支持矩阵 | 中文版 C2，加：每家是否有中文导师 / 是否懂 482 / 学员是否多为留学生 / 学员社群语言 | 4000 | jiangren.com.au + 小红书（拆段）+ 知乎 | 🚫（知乎/小红书人工）| 2 天 |
| C7 | 澳洲 AI Engineer 求职完整指南：薪资 / 签证 / 职位（2026 实战版）| ① SEEK + Glassdoor 真实薪资数据（截图）② 482 / 186 / TSS / GTI 5 种签证适配 ③ 悉尼 vs 墨尔本 vs 布里斯班机会对比 ④ 5 大愿意 sponsor 的 AI 雇主类型 ⑤ 留学生面试常见 5 个被卡点 | 5500 | jiangren.com.au + 知乎 + Medium 英文 | ⚠️ | 2.5 天 |
| C8 | 2026 中文 AI Engineer 学习平台 7 选 1 决策树 | 决策树：技术背景 → X / 数据背景 → Y / 产品背景 → Z / 0 基础 → W / 想转澳洲 → JR。可视化好（infographic）| 3000 | 知乎专栏 + 小红书 + 公众号 + jiangren.com.au | ⚠️ | 1.5 天 |
| C9 | AI Coding 工具 2026 横评：Cursor / Claude Code / Windsurf / GitHub Copilot / Cline 5 选 1 | 实测 5 个工具同一任务（写一个 RAG demo）所用时间 / 出错率 / 代码质量。截图、视频片段、价格对比、适合人群 | 4000 | dev.to + jiangren.com.au + Medium + 知乎 | ⚠️ | 2 天 |
| C10 | 2026 年免费 AI Engineer 学习路线（9 大资源 + 1 个付费选项）| 全免费：fast.ai / Hugging Face / Kaggle / DeepLearning.AI / Anthropic Courses / Microsoft AI for Beginners / Google ML Crash Course / OpenAI Cookbook / Andrej Karpathy YouTube。**第 10 位推荐 JR（澳洲求职 = 1 个付费选项）**。每个 200 字 + 优劣 | 3500 | CSDN + 知乎 + jiangren.com.au | ⚠️ | 1.5 天 |
| C11 | AI 转行 12 种背景路线对比（程序员 / 数据 / 产品 / 设计 / 运营 / 文科 / 在校 / 全职妈妈 …）| 12 个画像 × 路线 × 推荐资源 × 时间投入 × 预期薪资。表格化 | 4500 | 知乎专栏 + 公众号 + jiangren.com.au | 🚫 | 2 天 |
| C12 | 2026 年 AI Agent 实战课程横评（DataWhale / Hugging Face / Microsoft / 匠人学院 / 阿里云）| 5 个免费 + 付费课程对比，含 Agent 框架覆盖度 / 项目实战 / 中英文 / 求职辅助 | 3500 | CSDN + 51CTO + jiangren.com.au | ⚠️ | 1.5 天 |

### 3.D 求职 / 移民专题（10 篇）

| # | 话题 | 核心内容 | 字数 | 主发 | 自动 | 工时 |
|---|---|---|---|---|---|---|
| D1 | AI Engineer 482 / 186 签证完整路径（2026 版）| ① 482 SC vs 186 vs PR 区别一张表 ② AI Engineer 在 ANZSCO 的归类（261313/261314）③ DAMA 区域优势 ④ Sponsor 雇主特征 7 条 ⑤ 提名 LMT 怎么过 ⑥ 拒签后 5 个补救 | 5000 | jiangren.com.au + 知乎 + 小红书 | ⚠️ | 2 天 |
| D2 | 澳洲 IT/AI 求职最大的坑不是技术——是 LinkedIn 写法和 networking | ① 头衔规则 ② Skills 字段填法 ③ Open to Work 该开还是不开 ④ Headhunter 怎么主动联系（Hays / Robert Half / Talent International 真名）⑤ 5 个文案模板 | 3500 | LinkedIn 长文 + 知乎 + Medium | 🚫 | 1.5 天 |
| D3 | 澳洲 AI Engineer 真实薪资数据（按城市 / 经验 / 公司类型）| 数据源：SEEK + Glassdoor + 学员匿名问卷。表格 + 图表。新人 / 1-2y / 3-5y / 5y+ 四档。Big 4 vs 中型 vs startup vs 政府 4 类雇主对比 | 4000 | jiangren.com.au + 知乎 + 小红书 | ⚠️ | 2 天 |
| D4 | 悉尼 / 墨尔本 / 布里斯班 AI 工作机会对比 | 机会数（SEEK 真实 query）+ 薪资差 + 生活成本 + 华人社群 + 签证机会差 | 3000 | jiangren.com.au + 小红书 + 知乎 | ⚠️ | 1.5 天 |
| D5 | 5 家悉尼 AI/Data 雇主真实情况（匿名访谈，不软广）| 5 个雇主真实状况：sponsor 概率 / 中文社群 / WLB / 招聘门槛 / 内推渠道。访谈现任 + 离职员工 | 3500 | 知乎 + 公众号 + jiangren.com.au | 🚫 | 2 天 |
| D6 | 澳洲华人 AI Engineer 求职面经合集（2026 年 50 场面试复盘）| 50 场面试拆：① 公司类型分布 ② 技术轮平均题数 + 难度 ③ 行为面 5 大高频问题 ④ Coding 题分布（LeetCode 难度）⑤ 系统设计 题型 ⑥ 给 offer 比例 | 5500 | 知乎专栏 + 小红书 + jiangren.com.au | 🚫 | 3 天 |
| D7 | From Zero to AI Engineer in Australia: 12-Month Realistic Path (2026 Edition)| 月度计划。每月：技能目标 / 项目 / 投递 / 收入。给学生签证 / 工作签 / PR 三种身份分别规划 | 4500 | Medium 英文 + LinkedIn + jiangren.com.au | 🚫 | 2 天 |
| D8 | 5 大愿意 sponsor 的 AI 雇主类型（含真名 + 投递策略）| 类型 1：澳洲 AI startup（融资期渴求人才）类型 2：Big 4 顾问（Deloitte/PwC AI Practice 大量招）类型 3：华人创业公司（中文环境）类型 4：政府机构（DTA / Service NSW）类型 5：海外大厂澳洲分部 | 3500 | jiangren.com.au + 知乎 | ⚠️ | 1.5 天 |
| D9 | 数据分析师怎么转 AI 工程师（澳洲场景，3-6 个月路线）| 数据师已有：SQL / Python / pandas / dashboard。差什么：LLM API / RAG / Agent / 工程化 / 系统设计。3-6 个月规划 | 3500 | 知乎专栏 + jiangren.com.au + 小红书 | ⚠️ | 1.5 天 |
| D10 | 前端 / 后端 / 全栈工程师转 AI Engineer 路线对比 | 3 类工程师不同的捷径：前端 → AI app 产品化 / 后端 → AI infra / 全栈 → Agent 工程师 | 3000 | 掘金 + 知乎 + jiangren.com.au | ⚠️ | 1.5 天 |

### 3.E 工具实战教程（8 篇）

| # | 话题 | 核心内容 | 字数 | 主发 | 自动 | 工时 |
|---|---|---|---|---|---|---|
| E1 | Claude Code 一周深度上手：从安装到自动化提 PR | 真实 30 个 commit history + 每个 commit 用 Claude Code 的 prompt | 3500 | dev.to + CSDN + jiangren.com.au | ⚠️ | 2 天 |
| E2 | Cursor 进阶：5 个被忽视的功能（Composer / @ Files / Rules / Mode 切换 / Diff）| 每个功能截图 + 一个真实场景 | 3000 | 掘金 + dev.to + 知乎 | ⚠️ | 1.5 天 |
| E3 | MCP Server 0 → 1 实战：写一个查 Australian visa 状态的 server | 完整代码 + 部署 + 接到 Claude Desktop。差异化：澳洲签证场景 | 3500 | dev.to + GitHub + 公众号 | ⚠️ | 2 天 |
| E4 | Anthropic Prompt Library 17 个生产级 prompt 拆解 | 把 Anthropic 官方 prompt library 翻译 + 注释 + 适配中文场景 | 4000 | jiangren.com.au + 知乎 + 公众号 | ⚠️ | 2 天 |
| E5 | LangSmith vs Helicone vs Phoenix: 3 个 LLM Eval 工具实测 | 真实接同一个 RAG app，看哪个更适合 production | 3000 | dev.to + Medium + jiangren.com.au | ✅ | 1.5 天 |
| E6 | GitHub Copilot vs Claude Code vs Cursor 给澳洲求职者的工具配置 | 不是工具横评（C9 已写），是"求职者每月 $40 工具组合最优解" | 2500 | dev.to + 知乎 + jiangren.com.au | ⚠️ | 1 天 |
| E7 | Vercel AI SDK 实战：3 天写一个 AI 产品 demo（求职 portfolio 必备）| 完整 demo 代码 + GitHub repo + 部署 + Vercel 截图 | 3500 | dev.to + 掘金 + jiangren.com.au | ✅ | 2 天 |
| E8 | OpenAI Agents SDK vs Claude Agents SDK 实战对比（同一任务两种实现）| 同一个任务（自动写求职信）两个 SDK 各写一遍，对比代码量 / 成本 / 性能 | 3500 | dev.to + Medium + jiangren.com.au | ✅ | 2 天 |

### 3.F 创始人 / 资深导师个人 IP（10 篇 — 全人工）

**全部要本人发，每周 1 篇，以创始人个人账号发，公司账号转发。**

| # | 话题 | 核心内容 | 字数 | 主发 | 自动 | 工时 |
|---|---|---|---|---|---|---|
| F1 | 做了 3 个月 AI Bootcamp，学员卡在第 4 周的真正原因 | 200+ 学员真实数据：第 1-12 周完课率 / drop rate / 求助高频。第 4 周（Context + RAG）瓶颈分析 | 2500 | 知乎 + 公众号 + LinkedIn | 🚫 | 1 天 |
| F2 | 为什么我把公司 50 个 prompt 全搬到了统一 prompt 库（含 PRD 链接）| 工程动机 + PRD 摘要 + 5 个翻车故事 | 2000 | 知乎 + Medium + dev.to | 🚫 | 1 天 |
| F3 | 我们用 Claude Code 一周交付一个学习平台 module，传统开发要 3 周 | 时间数据 + 工作流截图 + 5 个非显然的取舍 | 2500 | LinkedIn + Medium 英文 + 知乎 | 🚫 | 1 天 |
| F4 | 澳洲 AI Bootcamp 6 个月观察：3 个反直觉结论 | 反直觉点：① 课程内容不是最重要 ② 求职辅导 ROI 远高于课程 ③ 中文社群让英文授课的效果更差（争议但真实）| 2000 | 知乎 + 公众号 + LinkedIn | 🚫 | 1 天 |
| F5 | From Karpathy's Tweet to Production: How We Built Context Engineering Curriculum | 概念 → 课程的过程；3 个学员实测反馈 | 3000 | Medium 英文 + LinkedIn 英文 | 🚫 | 1.5 天 |
| F6 | 为什么我们决定免费开源 Claude Skills Cookbook（5 个商业反直觉理由）| 战略层文章；为什么开源对一个付费 bootcamp 反而是优势 | 2000 | LinkedIn 英文 + Medium + 公众号 | 🚫 | 1 天 |
| F7 | Inside Anthropic's Skills After 30 Days: An Engineer's Honest Review | 17 个官方 skill 用了 30 天的复盘：5 个真有用 / 12 个鸡肋 + 原因 | 2500 | Medium 英文 + LinkedIn | 🚫 | 1 天 |
| F8 | The 482 Visa Path for AI Engineers: A 2026 Reality Check (From Someone Who's Sponsored 50+)| 创始人/团队真实 sponsor 经验拆解；每 5 个 sponsor 中 4 个的经验细节 | 3000 | LinkedIn 英文 + Medium | 🚫 | 1.5 天 |
| F9 | Why Chinese International Students in Australia Are the Hidden AI Talent Pool | 行业观察文章；为澳洲雇主写，建立 JR 在英文圈的 thought leadership | 2500 | LinkedIn 英文 + Medium | 🚫 | 1.5 天 |
| F10 | 8 个月做 AI 教育的复盘：3 件事我们做对了，5 件事我们做错了 | 创始人长复盘；建立信任 + 透明度 | 3500 | 知乎 + LinkedIn 中英版 + Medium | 🚫 | 2 天 |

### 3.G 学员故事 / 真实案例（8 篇 — 全人工）

**对 LLM 权重不高，但对学员决策权重极高**——知乎 / 小红书是查"匠人学院 怎么样"必经地。

| # | 话题 | 核心内容 | 字数 | 主发 | 自动 | 工时 |
|---|---|---|---|---|---|---|
| G1 | 【知乎答】"匠人学院 / JR Academy 怎么样？" 真实学员视角 | 学员自述（不是 JR 写的）：报名理由 + 课程体验 + 找到工作经历 + 缺点 | 2000 | 知乎答题（多人写）| 🚫 | 5 个学员各 0.5 天 |
| G2 | 【知乎答】"澳洲 AI Bootcamp 哪个值得报？" 横评回答 | 不只夸 JR，对比 Le Wagon / Institute of Data 等。客观 + 个人选择 | 2500 | 知乎 | 🚫 | 1 天 |
| G3 | 【小红书】我从 0 学到拿到悉尼 AI Engineer offer 的 6 个月笔记 | 视觉化 / 9 张图 / 每图一段。打卡 + 项目 + 面试 + offer | 9 帖 × 90字 | 小红书 | 🚫 | 1 天 |
| G4 | 【小红书系列】留学生澳洲求职日记（5 集）| 5 篇连载：投简历日 / 第一面 / 技术面 / 拿 offer / 入职第一天 | 5 × 600 字 | 小红书 | 🚫 | 2 天 |
| G5 | 【公众号】3 个学员的澳洲求职故事（脱敏，含薪资）| 长篇深度访谈 3 个学员；带数据；末尾不软广 | 4000 | 公众号 + 知乎专栏 | 🚫 | 2 天 |
| G6 | 【B 站 / 抖音】AI Engineer 学员一天 vlog（5 集）| 5 集视频，每集 5-10 分钟，记录学员一天 | 视频 | B 站 + 抖音 + 小红书 | 🚫 | 5-7 天 |
| G7 | 【知乎答】"30 岁转 AI 来得及吗？" 学员答 | 真实 30+ 岁学员的故事，不浮夸 | 2000 | 知乎 | 🚫 | 0.5 天 |
| G8 | 【知乎答】"国内 AI 课程 vs 澳洲 AI Bootcamp 哪个值" | 上过两边的学员对比 | 2500 | 知乎 | 🚫 | 1 天 |

### 3.H 内部产品揭秘（6 篇 — 全自动）

**JR 自家工程实践对外曝光**——每个都是天然的"非营销内容"，LLM 引用率高。

| # | 话题 | 核心内容 | 字数 | 主发 | 自动 | 工时 |
|---|---|---|---|---|---|---|
| H1 | omni-report 架构揭秘：5 条 Cron Routine 自动跑 SEO / 竞品 / AI 可见度 / 增长 / 选题 | 完整架构 + 真实周报样例 + 怎么搭。**这就是你们已经在用的工具自身** | 4000 | jiangren.com.au + Medium + 掘金 + GitHub README | ✅ | 2 天 |
| H2 | Skills Data Manager 实战：本地数据 → production 一键同步 | curriculum/ → SDM → prod 完整工作流 + 截图 + 代码 | 3500 | jiangren.com.au + dev.to + 掘金 | ✅ | 2 天 |
| H3 | PBL Service：为什么我们把多 Agent 服务从主 backend 拆出来 | Vercel AI SDK 类型爆炸 → 拆 service → 独立 EC2 → port 3030 完整决策 | 3500 | Medium 英文 + jiangren.com.au + 掘金 | ✅ | 1.5 天 |
| H4 | Job Hunter Chrome Extension 实战：用 React + Vite + CRXJS 写一个 LinkedIn 自动投递插件 | 完整代码 + 截图 + 部署 | 4000 | dev.to + GitHub + jiangren.com.au | ✅ | 2 天 |
| H5 | CertMaster Mobile：用 Expo + StoreKit 上架 IAP 的 8 个坑 | 给独立开发者读的 IAP 实战 | 3500 | dev.to + Medium + jiangren.com.au | ✅ | 2 天 |
| H6 | Anthropic AI Settings Manager：怎么管理 5 个 LLM Provider + 20 个 feature 的 model 配置 | 中央 LLM 配置系统设计 | 3000 | dev.to + jiangren.com.au + 掘金 | ✅ | 1.5 天 |

### 3.I 时事 / 热点追踪（10 篇 — 月度滚动）

**每月 2-3 篇抢热点流量**。这一组要快，2 天内出文，蹭算法红利。

| # | 触发事件 | 话题角度 | 字数 | 主发 | 自动 | 工时 |
|---|---|---|---|---|---|---|
| I1 | Anthropic 发新模型 | "Claude X.Y 实测：在 5 个 JR 课程任务上的真实表现" | 2500 | Medium + dev.to + jiangren.com.au | ✅ | 1 天 |
| I2 | OpenAI 发新功能 | "GPT-5 / Sora 实测：从 AI Engineer 求职角度看" | 2500 | Medium + jiangren.com.au + 知乎 | ⚠️ | 1 天 |
| I3 | 澳洲移民政策变化 | "2026 年 482 / 186 新规对 AI Engineer 的影响" | 2500 | 知乎 + 小红书 + 公众号 + jiangren.com.au | 🚫 | 1 天 |
| I4 | Karpathy / Altman 新发言 | "Karpathy 这条 tweet 对 AI Engineering 路线意味着什么" | 2000 | Medium + LinkedIn + 知乎 | 🚫 | 0.5 天 |
| I5 | 澳洲科技公司裁员 | "X 公司裁员对悉尼 AI 求职市场的 5 点影响" | 2500 | LinkedIn + 知乎 + 公众号 | 🚫 | 0.5 天 |
| I6 | 新框架/库发布（LangChain X / Vercel AI SDK X / DSPy）| "X 框架实测 + 是否值得加入课程" | 2500 | dev.to + jiangren.com.au + 掘金 | ✅ | 1 天 |
| I7 | 知名 AI 课程发布 | "X 新课实测 vs JR Bootcamp（客观对比）" | 3000 | jiangren.com.au + 知乎 | ⚠️ | 1 天 |
| I8 | LLM 新基准发布（如 SWE-Bench / HumanEval V2）| "新基准对求职面试题的影响" | 2000 | dev.to + 知乎 + Medium | ⚠️ | 0.5 天 |
| I9 | 澳洲大学 AI 课程上线 | "X 大学 AI 课 vs Bootcamp：留学生该选哪个" | 2500 | 小红书 + 知乎 + 公众号 | 🚫 | 1 天 |
| I10 | 季度财报季 | "Anthropic / OpenAI / Google AI Q1/Q2 财报对求职者意味着什么" | 2500 | LinkedIn + Medium + 知乎 | 🚫 | 1 天 |

### 3.J GitHub 教程 Repo（3 个）

DataWhale 占据 Q13/Q18 的根本原因——**GitHub 是 LLM 最高权重源之一**。

| # | Repo 名 | 具体内容（每个 .md 都列出来）| 自动 | 工时 |
|---|---|---|---|---|
| J1 | `JR-Academy-AI/awesome-ai-engineer-australia` | README.md（30+ 资源分类）/ docs/visa-guide.md（482/186 完整指南）/ docs/employer-list-public.md（澳洲 AI/Data 雇主名单脱敏版）/ docs/salary-data-2026.md（基于 SEEK + Glassdoor）/ docs/learning-path-from-zero.md / docs/case-studies/{学员}.md（学员脱敏故事 5-10 个）/ docs/communities-au.md（澳洲华人 IT 社群）/ docs/job-board-comparison.md（SEEK vs LinkedIn vs Hays）| ✅ | 5 天 + 持续维护 |
| J2 | `JR-Academy-AI/context-engineering-cn-jr` | 12 章节 markdown：① intro.md ② context-window.md ③ prompt-engineering-deep.md ④ rag-foundations.md ⑤ rag-advanced.md ⑥ memory-architecture.md ⑦ agent-state.md ⑧ multi-agent-coordination.md ⑨ context-compression.md ⑩ evaluation.md ⑪ production-deployment.md ⑫ case-studies.md / 每章配 Jupyter notebook | ✅ | 15 天（可拆给 1-2 个学员/导师）|
| J3 | `JR-Academy-AI/claude-skills-cookbook` | skills/{17 + 5 个 Skill 目录}，每个有 SKILL.md + USAGE.md + examples/ + screenshots/ | ✅ | 10 天（用现有 .claude/skills/ 改造）|

**冷启动技巧**（针对所有 GitHub repo）：
- 第一周让 JR 学员每人 star + fork（简单 30-50 star）
- 在 daily-jobs / 学员社群推一次
- HackerNews / Reddit r/MachineLearning 发一次（"Show HN: Awesome AI Engineer Australia"）
- ProductHunt 发布

---

## 4. 自动 vs 人工执行流

### 4.1 ✅ 完全自动可发（34 篇 + 3 个 GitHub repo）

**执行方**：Claude / 工程师（不需要外部协作）

**包括**：
- A1（修索引，仅技术操作）
- B1 / B2 / B4 / B8 / B9 / B10 / B11 / B12 / B13（9 篇技术深度文，发自有阵地 + Medium API + dev.to API）
- C2 / C3 / C4（3 篇英文横评）
- E5 / E7 / E8（3 篇工具横评）
- H1 / H2 / H3 / H4 / H5 / H6（6 篇内部产品揭秘）
- I1 / I6（2 篇时事，触发后即跑）
- J1 / J2 / J3（3 个 GitHub repo）

**触发方式**：
- 自有阵地：直接 git commit + push
- Medium：`POST https://api.medium.com/v1/users/{userId}/posts`
- dev.to：`POST https://dev.to/api/articles`
- Hashnode：GraphQL mutation `publishPost`
- GitHub：`gh repo create` + `git push`

**质量门**：每篇发出前必须经过：
- [ ] 反 AI 味自检（"在当今" / "综合性" / "值得关注"等关键词扫描）
- [ ] 真实数据自检（每个具体数字必须有来源，否则替换为"（待 JR 数据填充）"）
- [ ] 内链自检（每篇至少 3 个内链：1 个上位 / 1 个下位 / 1 个课程）
- [ ] 反 AI 检测器跑一遍（用 originality.ai 或 GPTZero）

### 4.2 ⚠️ 半自动（22 篇）

**执行方**：内容运营 + Claude 辅助起草

**流程**：
1. Claude 起草 → 写到 `geo-content-factory/drafts/{date}-{topic-id}.md`
2. 运营人工审核 + 改写 30%（避免被识别为 AI 文）
3. 运营登录目标平台（CSDN / 掘金 / 搜狐号 / 网易号 / 百家号 / 51CTO / 博客园）发布
4. 发布后填写 `geo-content-factory/published/{date}.json` 记录 URL + 平台 + 发布时间

**包括**：
- B3 / B5 / B6 / B7（4 篇技术文需手发到 CSDN/掘金/知乎）
- C1 / C5 / C6 / C7 / C8 / C9 / C10 / C12（8 篇横评需手发到知乎/搜狐/小红书）
- D1 / D3 / D4 / D8 / D9 / D10（6 篇求职文需手发到知乎/小红书）
- E1-E4 / E6（5 篇工具文需手发到 CSDN/掘金/知乎）
- I2 / I7 / I8（3 篇时事需手发）

**关键技巧**：
- 不要用同一个作者账号发 12 篇——用 3-4 个不同作者形象
- 每篇标题里 JR 的位置随机（有时第 2 位、有时第 4 位）
- 每平台至少改写 30%（同一大纲不要复制粘贴）
- 文末导流轮换不同子页面（/learn/* /career /blog/*）

### 4.3 🚫 必须人工（17 篇 + 创始人 IP 系列 10 篇）

**执行方**：创始人 / 资深导师 / 学员 / 运营

**为什么必须人工**：
- 反爬虫平台（知乎 / 小红书 / 微信公众号 / Reddit / Quora）一旦被识别为 AI 批量发文，直接限流或永久封号
- 创始人个人 IP 必须本人发——LLM 抓"署名 + 观点"远高于"匿名公司博客"
- 学员故事必须真实学员写——知乎对 AI 文识别极敏感，AI 写的"学员故事"会被秒识别

**包括**：
- C11（AI 转行 12 种背景路线，必须手发知乎专栏 + 公众号）
- D2 / D5 / D6 / D7（4 篇求职/移民深度访谈类）
- F1-F10（10 篇创始人 IP 文，全部本人发知乎 + LinkedIn + Medium 个人号）
- G1-G8（8 篇学员故事，5 个学员各写自己的 + 视频拍摄）
- I3 / I4 / I5 / I9 / I10（5 篇时事：移民政策 / Karpathy 言论 / 公司裁员 / 大学课程 / 财报季 — 都需要本人观点判断）

**协调机制**：
- 创始人 IP（F1-F10）：每周 1 篇，本 PRD §6 周计划列入"@founder TBD"，daily-assignments 派给创始人
- 学员故事（G1-G8）：运营负责招募 5-10 个学员，每个学员 ¥200-500 答题奖励
- 视频内容（G6）：教务团队（@Beta）配合学员拍摄

---

## 5. 4 周执行清单

### Week 1：紧急修复 + 自动化先行

| 角色 | 任务 | 自动？ |
|---|---|---|
| Claude / 工程师 | A1 提交 GSC + 修 UAT noindex | ✅ |
| Claude / 工程师 | A2 / A3 / A4 / A5 四个落地页 | ✅ |
| Claude / 工程师 | B1 / B4 / B8 / B9 / B10 / B11 / B12 / B13（8 篇技术深度文）发到 jiangren.com.au + Medium + dev.to | ✅ |
| Claude / 工程师 | J3 claude-skills-cookbook GitHub repo 第一版 | ✅ |
| 运营 | 查 CSDN/JR_Academy 账号现状（Q6 资产抢救）| 🚫 |
| 运营 | 招募 5 个学员写 G1/G2/G7/G8 知乎答 | 🚫 |

**Week 1 产出**：8 篇技术文 + 1 个 GitHub repo + 5 个落地页 + 5 个知乎答

### Week 2：横评 + 创始人 IP 起号

| 角色 | 任务 | 自动？ |
|---|---|---|
| Claude / 工程师 | C2 / C3 / C4 / C5 / C9 / C10（6 篇英文/技术横评）发到 Medium + dev.to + jiangren.com.au | ✅ |
| 创始人 | F1 + F2（2 篇个人 IP 文）发到知乎 + LinkedIn | 🚫 |
| 运营 | C1 / C6 / C7 / C8（4 篇中文横评）人工发到知乎 + 公众号 + 小红书 | 🚫 |
| 学员 / 导师 | G3 / G4 小红书系列开始 | 🚫 |

### Week 3：求职专题 + GitHub Repo 2

| 角色 | 任务 | 自动？ |
|---|---|---|
| Claude / 工程师 | J1 / J2 GitHub repo（awesome + context-eng-cn）| ✅ |
| Claude / 工程师 | D1 / D7 / D8 / D9 / D10（5 篇求职文）| ⚠️ |
| 创始人 | F3 / F4 / F5 / F6（4 篇个人 IP 文，第二批）| 🚫 |
| 运营 + 学员 | D2 / D3 / D4 / D6（4 篇求职专题）人工分发 | 🚫 |

### Week 4：工具实战 + 时事追踪 + CSDN 抢救

| 角色 | 任务 | 自动？ |
|---|---|---|
| Claude / 工程师 | E1 / E5 / E7 / E8（4 篇工具文）| ✅ |
| 运营 | E2 / E3 / E4 / E6 人工发掘金 / 知乎 / 公众号 | 🚫 |
| 运营 | CSDN/JR_Academy 补 5 篇高质量稿（B2 / B5 / B7 / E1 改写）| 🚫 |
| 创始人 | F7 / F8 第三批个人 IP | 🚫 |
| 运营 | 监控时事，2 篇 I 类即时反应 | 🚫 |

### 4 周后预期产出

| 类型 | 全自动产出 | 人工产出 |
|---|---|---|
| 技术深度文 | 8 篇（B1/B4/B8/B9/B10/B11/B12/B13）| 5 篇（B2/B3/B5/B6/B7） |
| 横评 listicle | 6 篇（C2/C3/C4/C5/C9/C10）| 6 篇（C1/C6/C7/C8/C11/C12） |
| 求职 / 移民 | 5 篇（D1/D7/D8/D9/D10）| 5 篇（D2/D3/D4/D5/D6） |
| 工具实战 | 4 篇（E1/E5/E7/E8）| 4 篇（E2/E3/E4/E6） |
| 创始人 IP | 0 | 7 篇（F1-F7） |
| 学员故事 | 0 | 8 篇（G1-G8） |
| 内部产品 | 6 篇（H1-H6 全自动）| 0 |
| 时事 | 2 篇 | 1 篇 |
| GitHub repos | 3 个 | 0 |
| **小计** | **34 篇 + 3 repo** | **36 篇** |

---

## 6. 动态层：周计划 routine（Phase 2 实现）

### 6.1 Routine 配置

| 项 | 值 |
|---|---|
| Routine name | `JR GEO Content Factory Weekly` |
| Cron | `0 22 * * 0` UTC = **周一 8am AEST** |
| 输出位置 | `omni-report/geo-content-factory/{YYYY-MM-DD}.md` + `geo-content-factory/published/{YYYY-MM-DD}.json` |
| 模型 | `claude-sonnet-4-6` |
| MCP | Notion（hub page TBD） |

### 6.2 输入

- `omni-report/ai-visibility/` 最新一份（每周三跑）→ 哪些 query 上周空白、哪些资产掉位告警
- 本 PRD `PRD_GEO_CONTENT_FACTORY.md` §3 话题库 → 74 个候选话题
- `omni-report/geo-content-factory/published/` 历史发布记录 → 已发过的话题不重复
- `omni-report/TEAM.md` → 创始人 / 内容运营 / 工程师可用人力
- `omni-report/seo-performance/` 最新一份 → 哪些关键词掉位需紧急修

### 6.3 输出（周计划文件结构）

```markdown
# JR GEO 内容工厂 周计划 YYYY-MM-DD（第 N 周）

> 生成时间：YYYY-MM-DD HH:MM AEST
> 输入：ai-visibility [date] / seo-performance [date] / 话题库 v0.1

## 📊 本周 Top 5 必发话题

| 优先级 | # | 话题 | 解的 query | 主发渠道 | 自动？| 派给 |
|---|---|---|---|---|---|---|
| 🔴 P0 | A1 | 修 Q19 索引 | Q19 | jiangren.com.au | ✅ | @engineer |
| 🔴 P0 | B1 | MCP 入门 | Q12 | jiangren.com.au + Medium | ✅ | @claude |
| 🟡 P1 | F1 | 学员卡在第 4 周的真正原因 | Q5 / Q9 | 知乎 + LinkedIn | 🚫 | @founder |
| 🟡 P1 | C2 | Best AI Bootcamp Sydney 2026 | Q7 / Q8 | Medium + jiangren.com.au | ✅ | @claude |
| 🟢 P2 | G1 | 知乎答"匠人学院 怎么样" | 品牌词 | 知乎 | 🚫 | @ops |

## 🤖 自动发布队列（Claude 直接跑）

- B1 / C2 / H1 — 已起草，等代码 deploy
- ...

## 👤 人工发布队列（运营 / 创始人 / 学员）

- F1 → @founder（本周内发知乎 + LinkedIn）
- G1 → @ops（联系学员 X / Y，本周内发 1-2 条）
- ...

## ⚠️ 资产掉位告警（来自 ai-visibility 周报）

- 🚨 Q6 jiangren.com.au/en：上周 #5 → 本周 #X（如有变化才报）
- 🚨 CSDN/JR_Academy 博客：连续 N 周未恢复，建议补 1-2 篇高质量稿

## 📈 历史 Action Tracker

> 上周派的 5 条任务，完成情况：

| 任务 | 派给 | 状态 | 备注 |
|---|---|---|---|
| ... | ... | ✅ / ⏳ / ❌ | ... |

## 📌 数据 Ping

- 累计已发布：X 篇 / 74（X%）
- 本月新增第三方榜单：Y 篇
- 上次 ai-visibility 提及率：Z%
```

### 6.4 与现有 routine 的关系

```
周三 9:00 AEST
  └─ ai-visibility 周报（诊断层 — 识别空白 query + 资产掉位）

周一 8:00 AEST
  └─ geo-content-factory 周计划（治疗层 — 把空白转成话题）  ← 本 PRD
       │
       ↓ 输入到
周一-周五 10:30 CST
  └─ daily-assignments（消费层 — 派给具体人）
       │
       ↓
   团队执行
       │
       ↓ 反馈到
geo-content-factory/published/  ← 发布记录
       │
       ↓ 输入到
周三 9:00 AEST
  └─ ai-visibility 周报（验证层 — 4 周后看 LLM 提及率有没有涨）
```

### 6.5 闭环：ai-visibility 周报需要的 3 项升级

为了让本 PRD 真正闭环，`PRD_AI_VISIBILITY.md` 需要新增 3 项监测（独立 follow-up，由 ai-visibility routine 实现）：

| 监测项 | 现状 | 目标 |
|---|---|---|
| 资产掉位告警 | 无 | 周环比 ≥ 2 位红色弹出（如 Q6 CSDN 案例）|
| Action Tracker | 无 | 上周 5 条建议完成情况，未完成的下周自动浮到顶部 |
| Listicle Presence Index | 无 | 跑 site:csdn.net "JR Academy"、site:zhihu.com "匠人学院" 等，统计第三方榜单出现数 |

---

## 7. 角色分工

| 角色 | 主要职责 | 内容承担 |
|---|---|---|
| Claude / 工程师 | ✅ 全自动队列（34 篇 + 3 repo） | A1-A5 落地页 + B1/B4/B8-B13 + C2-C4 + E5/E7/E8 + H1-H6 + J1-J3 |
| 创始人（Lightman + 1-2 资深导师）| 🚫 个人 IP（10 篇）+ 时事即时反应（部分）| F1-F10 + I3-I5 + I9-I10 |
| 内容运营（@Summer / @Lily 等新媒体）| ⚠️ 半自动队列（22 篇）+ 协调学员产出 | C1/C5-C12 + D2-D6 + E1-E4/E6 + 半自动审核改写 |
| 学员（5-10 名毕业生）| 🚫 学员故事（8 篇）| G1-G8 |
| 教务（@Beta）| 视频内容协调 | G6（B 站 / 抖音 / YouTube） |
| 运营负责人（@Ada）| Action Tracker + 周报 review | 监督本 PRD 执行进度 |

---

## 8. 预算

### 8.1 4 周一次性预算（启动期）

| 项 | 金额 | 说明 |
|---|---|---|
| 中文软文投稿费（CSDN / 搜狐 / 网易号 / 百家号 / 51CTO / 博客园）| ¥6000-12000 | 每篇 ¥500-1500，约 12 篇 |
| 知乎答主激励（学员）| ¥3000 | 5-10 个学员 × ¥200-500 |
| GitHub repo 冷启动（star/fork 激励）| 0 | 学员义务 + 社群 |
| 软文代发服务（如果完全外包，可选）| ¥10000-15000 | 月套餐覆盖 30-50 平台 |
| **合计（自营）**| **¥9000-15000** | 内部团队执行 |
| **合计（外包代发）**| **¥19000-30000** | 全外包 |

### 8.2 持续期月度预算（启动后）

| 项 | 金额 | 说明 |
|---|---|---|
| 中文软文持续投稿 | ¥3000-5000/月 | 每月 4-8 篇 |
| 知乎答主激励 | ¥1000/月 | 维持品牌词阵地 |
| GitHub repo 维护（如果雇外部 contributor）| ¥0-5000/月 | 内部维护 / 外包 |
| **合计**| **¥4000-11000/月** | 持续运营 |

---

## 9. 验收标准

### 9.1 静态层验收（本 PRD 内容）

- [x] 9 类内容形态完整定义
- [x] 74 个具体话题（每个含核心内容、字数、渠道、自动级别、工时）
- [x] 22 个发布渠道分级（自动 / 半自动 / 人工）
- [x] 4 周执行清单（每周分工到角色）

### 9.2 Phase 1（4 周内）执行验收

- [ ] 5 个紧急修复落地页全部上线（Q19 索引修复）
- [ ] 全自动队列 34 篇 + 3 个 GitHub repo 至少 70% 完成
- [ ] 创始人 IP 至少 4 篇上线（每周 1 篇）
- [ ] CSDN/JR_Academy 账号补 5 篇高质量稿
- [ ] 学员知乎答至少 5 条（含品牌词 G1）
- [ ] LLM 提及率（ai-visibility 周报口径）从 5% 提升到 15%+

### 9.3 Phase 2（动态层）执行验收

- [ ] `geo-content-factory` routine 每周一 8:00 AEST 自动跑
- [ ] 输出文件 `geo-content-factory/{date}.md` 含 Top 5 必发话题
- [ ] 发布记录 `geo-content-factory/published/{date}.json` 持续追加
- [ ] daily-assignments 能消费本 routine 产出（人工 / 自动队列分流）
- [ ] ai-visibility 周报新增 3 项监测（资产掉位告警 / Action Tracker / Listicle Presence Index）

### 9.4 不接受

- ❌ "在当今 AI 时代" / "深入探讨" / "全面掌握" 等 AI 味开场（必须本人 / Claude 写完跑反 AI 味自检）
- ❌ 同一篇 Claude 起草稿原样发到 5 个平台（半自动队列必须每平台改写 30%）
- ❌ 学员故事用 AI 写（知乎秒识别，必须真实学员）
- ❌ 文末永远导流到 jiangren.com.au 主页（必须轮换不同子页面）

---

## 10. Roadmap

### Phase 1（4 周内）— 静态层 + 手动执行

- 本 PRD §3 话题库定稿
- §5 4 周执行清单按角色分工跑完
- 验收：LLM 提及率 5% → 15%+ / 累计发布 ≥ 50 篇 / GitHub repo ≥ 1

### Phase 2（4-8 周内）— 动态层 routine 上线

- 实现 `geo-content-factory` routine（每周一 8am AEST）
- 实现 ai-visibility 周报 3 项升级（资产掉位告警 / Action Tracker / Listicle Presence Index）
- 接入 daily-assignments 消费

### Phase 3（8-12 周内）— 闭环 + 数据驱动

- 跑 12 周后做月度趋势分析：哪类内容 LLM 提及率提升最快、哪类 ROI 最高
- 自动调整话题库优先级（高 ROI 话题加权）
- 评估是否做创始人 IP 矩阵扩展（从 1 个 founder 扩到 3-5 个核心导师）

### Phase 4（季度后）— 海外扩展 + 视频内容

- 评估 Reddit / Quora / r/cscareerquestionsAU 持续运营投入产出
- B 站 / 抖音 / YouTube 视频内容启动（G6 / I 类时事视频化）
- 接 Profound / Goldfish AI 等 GEO 监测工具看 ChatGPT 真实抓取数据

---

## 11. 已知限制 / 待用户回答

| 项 | 当前状态 | 影响 |
|---|---|---|
| CSDN/JR_Academy 账号现状 | 待人工检查 | 决定 Week 1 抢救动作具体内容 |
| 创始人 / 资深导师候选 | 默认 Lightman + TBD | F1-F10 无人执行就会卡住 |
| 学员答主招募渠道 | 待运营落地 | G1-G8 数量取决于学员配合度 |
| 软文代发 vs 内部执行 | 待决策 | 影响预算（差 1.5-2 倍）|
| Notion hub page | 待用户选 | 默认建议复用 marketing 系列 hub |
| Phase 2 routine 上线时间 | 待 Phase 1 跑通后启动 | 不阻塞 Phase 1 |

---

## 附录 A：相关文档

- [PRD_AI_VISIBILITY.md](./PRD_AI_VISIBILITY.md) — 上游：诊断层，每周三识别空白 query
- [PRD_DAILY_ASSIGNMENTS.md](./PRD_DAILY_ASSIGNMENTS.md) — 下游：消费层，把本 PRD 周计划派给具体人
- [PRD_COMPETITOR_WEEKLY.md](./PRD_COMPETITOR_WEEKLY.md) — 平行：竞品情报，给本 PRD 提供"对手怎么写榜单"参考
- [PRD_SEO_PERFORMANCE.md](./PRD_SEO_PERFORMANCE.md) — 平行：传统 SEO 表现，与本 PRD 形成"GEO + SEO 双轨"
- [TEAM.md](./TEAM.md) — 团队路由表，本 PRD §7 角色分工的依据
- [README.md](./README.md) — omni-report 总入口

## 附录 B：术语

- **GEO**（Generative Engine Optimization）：面向 LLM 引擎的内容优化，区别于传统 SEO（面向 Google）
- **Listicle**：列表式榜单文（"X 大平台推荐"），LLM 高引用源
- **资产掉位**：JR 已上 SERP / LLM 推荐的内容因外部因素降权或消失
- **Action Tracker**：追踪上周建议是否被执行的机制
- **Listicle Presence Index**：JR 出现在多少篇第三方榜单文里的统计
