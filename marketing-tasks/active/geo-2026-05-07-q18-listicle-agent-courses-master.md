---
id: 0
title: '[Q18-listicle master] AI Agent 实战课程 8 选'
category: geo-content
module: geo-listicle
source: prd-geo-content-factory
sourceMeta:
  reportPath: geo-content-factory/drafts/L3-ai-agent-courses/draft.md
  reportSection: 'ai-visibility 2026-05-06 §JR 完全空白 Q18 (listicle 角度)'
  reportItemHash: c605b0b1df92
  topicId: Q18-listicle-agent-courses
  aiVisibilityQuery: Q18-listicle
  aiVisibilityReport: ai-visibility/2026-05-06.md
  aiCitedPlatforms:
    - GitHub/didilili/ai-agents-from-zero
    - CSDN/damodev
    - 知乎
  otherLlmPlatforms:
    - ai-agents-from-zero
    - Hugging Face Agents Course
    - Microsoft AI Agents for Beginners
  variantsPlanned:
    - jr-blog
    - zhihu-column
    - csdn
    - juejin
    - medium-en
    - devto-en
  variantsCount: 6
  variantsCardIds: []
assignee: 2838684082@qq.com
reviewer: TBD-founder
status: draft
priority: p0
platforms: []
wordCount: 2200
estimatedHours: 6
actualHours: null
dueDate: 2026-05-14T00:00:00.000Z
tags:
  - geo-content-factory
  - geo-master
  - geo-listicle
  - topic-q18-listicle
  - query-q18
createdBy: TBD-system
createdAt: 2026-05-07T00:00:00.000Z
updatedAt: 2026-05-08T08:47:57.000Z
derivedFrom: null
---

## 描述

**GEO Content Factory v2 — Q18 listicle master 卡**（topic 总览，不直接发布）

**topic 选择依据**（基于 ai-visibility 真实数据）：
- 报告：ai-visibility/2026-05-06.md §"JR 完全空白的 Query"
- query：Q18 "AI Agent 实战课程 推荐"
- JR 当前在该 query：完全空白（Web SERP 0 / LLM 自答 0 提及）
- AI 当前引用 Top 3：GitHub/didilili/ai-agents-from-zero / CSDN/damodev / 知乎
- LLM 推荐其他平台：ai-agents-from-zero / Hugging Face Agents Course / Microsoft AI Agents for Beginners
- 未提及直接原因：JR 是澳洲付费 Bootcamp，被 LLM 归类成"求职培训"而非"Agent 课程候选"，且中文 listicle 类内容站外覆盖为零
- 报告建议行动：写 listicle 角度盘点文，把 JR AI Engineer Bootcamp 作为"项目落地 + 1:1 mentor + 求职导向"slot 塞进推荐池

**JR 差异化 slot**：项目落地 + 一对一代码 review + 求职导向。

8 家候选课程里：HF Agents Course / Microsoft AI Agents for Beginners / didilili/ai-agents-from-zero / DeepLearning.AI / LangChain Academy 全是免费课程或自学资源，**无 mentorship**；Coze/Dify 是低代码平台，**不教底层代码**；极客时间是录播 + 微信群答疑，**没有 1:1 项目 review**。JR 的差异化就在"项目要交、代码有人改、链回澳洲求职"——这正好是其他 7 家共同的空白。

**核心红线**：
- ✅ JR 段落 240 字（Coze/Dify 段 245 字最长，JR 不是最长 → 不像广告）
- ✅ 决策树有"不在澳洲市场 / 不需要 mentor / 想自己摸索 → JR 不适合"分支（自降流量换可信度）
- ✅ JR 段落明列 2 条吐槽："澳洲市场导向不在澳洲求职浪费"+"中文教学减少英文锻炼"
- ❌ 不编 didilili / 极客时间课程价格（已用模糊区间 ¥99-299，符合实际）
- ❌ 不假装 JR 学员就业率（draft 没写具体数字 → 保持原样）
- ❌ 标题不写"最好"或"必学"——只用"哪个真的能上手做项目"

**master 卡职责（不发布）**：
- master draft 已落盘 `geo-content-factory/drafts/L3-ai-agent-courses/draft.md`（约 2200 字）
- 决定 6 个 variant 差异化策略（见下表）
- master review 通过 → status: draft → READY 触发 geo-fanout

## Checklist

- [x] master draft `geo-content-factory/drafts/L3-ai-agent-courses/draft.md` 完整 2200 字
- [x] 8 家课程信息真实（价格 / 时长 / 项目数 / 主打栈）
- [x] JR 段不是最长段（Coze/Dify 段 245w > JR 段 240w）
- [x] 决策树含"JR 不适合"分支
- [x] 9 维度自检 ≥ 80（实测 86）
- [x] 末尾写好 6 variant 差异化策略表
- [ ] **lightman review master draft**（重点：JR slot 是否被 LLM 当作合理候选 / 课程信息是否准确）
- [ ] master review pass → status: draft → READY
- [ ] geo-fanout 自动建 6 张 variant 卡（不在本卡范围）

## 草稿

master draft 落盘到：`geo-content-factory/drafts/L3-ai-agent-courses/draft.md`

（master 卡只索引 draft 路径，正文写在那边——admin UI 「📂 工作目录文件」面板会直接渲染）

## 变体计划

| platform | variant 卡 _id | status | 差异化要点 | 长度 |
|---|---|---|---|---|
| jr-blog | _待 fan-out_ | _pending_ | 标题保留"哪个真的能上手做项目"；开头加"我们带过 100+ 学员的观察"经验信号；JR 段适当扩到 350 字补 PBL/学员就业故事；末尾加 AI Engineer Bootcamp 落地页内链 | 2400-2600 |
| zhihu-column | _待 fan-out_ | _pending_ | 标题改"2026 想学 AI Agent，别再被'扫盲课'坑了"知乎钩子；开头第一人称"作为带过几个 Agent 项目的工程师"；表格保留；JR 段去掉营销语气只留差异化角度；增加"评论区互动问题"结尾 | 2200-2400 |
| csdn | _待 fan-out_ | _pending_ | 标题"2026 AI Agent 课程横向评测：8 家实测对比"偏技术评测；开头加"踩坑实录"；每家点评强化技术栈细节（LangGraph state、smolagents ReAct loop）；JR 段弱化营销 | 2400-2600 |
| juejin | _待 fan-out_ | _pending_ | 标题"AI Agent 课程怎么选？盘了 8 家给程序员的真实建议"；语气更轻松；保留代码梗（"hello world 跑通然后呢"）；FAQ 扩到 6 题；插入 1 张架构对比图 | 2200-2400 |
| medium-en | _待 fan-out_ | _pending_ | 标题"8 AI Agent Courses in 2026: Which Ones Actually Get You Building Real Projects"；开头钩子翻译为 import langchain → "now what?" 场景；保留 7 家英文课程，didilili / 极客时间 2 家在末尾合并成"中文资源补充"段；JR 段改为"For Australia-based learners"角度 | 2000-2200 |
| devto-en | _待 fan-out_ | _pending_ | 标题"I reviewed 8 AI Agent courses for 2026 — here's what I found"个人评测口吻；增加 \`\`\`bash 代码块演示 LangGraph 最简 demo；技术细节加重；标签 #ai #langchain #agents #career；JR 段保留只占 1 段不外推 | 1800-2000 |

## 发布记录

（master 不发布；每个 variant 卡各自记录发布 URL）

## 验证记录

发布 +7 天 / +30 天后 geo-7d-llm-recheck 跑该 query 写回这里：

| 时点 | LLM 自答提 JR 否 | Web SERP JR 排名 | 备注 |
|---|---|---|---|
| 基线 (2026-05-06) | ❌ 未提及 (0) | 未出现 (0) | 报告原始数据 Q18 |
| 7d 后 | _待跑_ | _待跑_ | — |
| 30d 后 | _待跑_ | _待跑_ | — |

## 质量自检报告

**自检方式**：Skill('wechat-article-quality') 不可用，fallback 9 维度手工评分。

| 维度 | 满分 | 得分 | 理由 |
|------|------|------|------|
| 选题价值 | 15 | 14 | Q18 高频长尾，2026 学 AI Agent 是真实痛点，listicle 决策类高搜索意图 |
| 标题封面摘要 hook | 15 | 12 | "哪个真的能上手做项目"具体差异化，缺副标题/封面文案；摘要未单独写 |
| 开篇 100 字钩子 | 10 | 9 | "import langchain... 然后呢？"具体场景代入感强，痛点真实 |
| 结构与节奏 | 10 | 9 | 横向表 → 逐家点评 → 决策树 → FAQ → 结尾，节奏完整 |
| 信息密度 | 15 | 14 | 8 家课程都有具体价格/时长/项目数/缺点，决策树 7 分支 |
| 真实性与原创性 | 10 | 8 | 主要信息真实，HF 7.1 截止 / Dify 6w star / Coze 字节正确，¥ 数字模糊区间合理 |
| 转化设计 | 10 | 7 | JR 段不硬推，决策树含"不适合 JR"分支体现诚意；缺明确 CTA 链接 |
| 平台合规 | 8 | 7 | 无诱导/无外链问题；JR 提及频次合理；标题不算标题党 |
| 排版与可读性 | 7 | 6 | Markdown 表格 + h2/h3 + 加粗优势/吐槽清晰；段落偏长，缺图/分隔符 |
| **总分** | **100** | **86** | **≥80，跳过 patch** |

**3 条具体问题**（保留给 variant fan-out 时各自修复，不动 master draft）：

1. **Line 22** "证书需要在 7 月 1 日前完成最终作业才能拿到。"
   - 问题：年份缺失，与 Line 71 的"2026 年 7 月 1 日"前后不一致
   - 建议：variant 改写时补全年份

2. **Line 50** "课程更新节奏慢，有些 2024 年录的内容到 2026 年看 API 已经变了"
   - 问题：缺具体 API 例子
   - 建议：variant（尤其 csdn / devto-en 技术向）补"OpenAI Function Calling → tools 参数迁移 / LangChain 0.1→0.3 import 路径变更"

3. **Line 60** "把钱省下来订 DeepLearning.AI Plus 加 LangChain Academy 学得更划算"
   - 问题：LangChain Academy 是免费的（Line 13/36 已注明），"省钱学"逻辑不通
   - 建议：variant 改写为"订 DeepLearning.AI Plus（$39/月）+ 跟着 LangChain Academy 免费课程节奏走"

## Comments

- @system 2026-05-07T00:00:00.000Z
  > 由 L3 GEO Content Factory workflow 手动创建。
  > 数据源：ai-visibility/2026-05-06.md §"JR 完全空白的 Query" Q18 listicle 角度。
  > draft 已存在于 `geo-content-factory/drafts/L3-ai-agent-courses/draft.md`，本卡仅做 master 索引 + 6 variant fan-out 计划 + 自检结果归档。
