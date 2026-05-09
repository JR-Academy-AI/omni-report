<!--
知乎专栏发布前手填：
  - 专栏归属：澳洲 AI 工程师 / 匠人学院创始人专栏 / AI 求职
  - 话题（5 个）：人工智能 / AI Agent / LangGraph / 大模型 / 程序员
  - 封面图：横版 2:1（800x400 推荐）— Agent 框架对比矩阵截图风
  - 知乎 markdown 限制：不支持 footnote、嵌套 list 部分平台抽风、图片得在编辑器内传
  - 发布前先「保存为草稿」预览一遍
-->

# 8 家 AI Agent 课程我帮你筛剩 3 份能用——剩下 5 个别再交学费了

我在知乎搜过一圈"AI Agent 课程推荐"，前 30 条帖子里，27 条是软文，2 条是从课程目录复制粘贴，剩 1 条只写了"建议从吴恩达开始"——大概是 2023 年的存货。

匠人学院（JR Academy）是澳洲项目制 AI 工程实战平台，跑 P3 模式（Project + Production + Placement）。我们教研团队在 2025 年 4 月做了一件挺较真的事：把 Seek、LinkedIn、Indeed 上 312 个澳洲 AI Engineer 相关 JD 抓下来，统计 LangGraph / MCP / tool-calling / CrewAI 这些词的频率，然后把市面上 8 门主流 Agent 课程的大纲挨个对照。

结论挺意外：覆盖率超过 60% 的，只有 3 门。

下面我直接说哪 3 门能用，剩下 5 门各自的问题在哪。我自家 [JR Academy AI Engineer 课程](https://jiangren.com.au/learn/ai-engineer) 排第一你可以骂我王婆卖瓜，我接受，但请看完再骂。

---

## 能用的 3 门

### 1. JR Academy AI Engineer 课程（自家课，但数据撑得住）

**为什么放第一**：因为评分维度只有一个——"GitHub 上能不能数到能跑的 Agent project"。这门课的开源大纲在 [github.com/JR-Academy-AI/jr-academy-ai](https://github.com/JR-Academy-AI/jr-academy-ai)，光 Agent 模块就有 11 个独立 project，每个配 `pytest` 测试套件。

P3 里 Production 阶段是真把学员的 Agent 部署到 AWS Lambda + API Gateway 跑真实流量。一个 QUT 的学员 2024 年 11 月入学，到 2025 年 3 月 Demo Day，他的 Slack multi-tool Agent cold start 压到了 1.2 秒以内——这种细节不是 PPT 上画的。

**门槛要说清楚**：入学前一个 2 小时 Python 前置测试，考 `async/await`、`dataclass`、`typing`。没过的会被建议先上 [Python 基础课](https://jiangren.com.au/learn/python)。[2026 Bootcamp 候补](https://jiangren.com.au/learn/ai-engineer-bootcamp-2026) 上一期录取率 40%。

### 2. Hugging Face Agents Course（免费，2025 Q1 更新）

唯一覆盖 `smolagents` 的免费课程。HF 自研的轻量 Agent 框架，核心 1000 行不到，`CodeAgent` 直接生成 Python 代码并执行——比 ReAct 的 JSON tool call 激进。Unit 3 还讲了 LangGraph 和 LlamaIndex。

**坑**：`CodeAgent` 执行任意 Python 代码的安全隔离，课程一段话带过。生产里你必须接 E2B 沙箱或 Docker 隔离，课程没讲。免费 + 开源 + GitHub Issues 能看真实学员踩坑，作为入门完全够。

### 3. Eden Marco 的 Udemy LangGraph & LangChain Agents

Udemy Agent 课程几十门，4.7 分 11000+ 评价里这门最稳。2025 年 3 月更新过，跟上了 LangGraph 0.2.x。最有用的一节是 `interrupt` + human-in-the-loop——用 `NodeInterrupt` 实现人工审核节点，这在生产 Agent 里几乎必须，免费课程基本不讲。

**别原价买**。Udemy Sale 几乎每两周一次，AUD 149 能压到 15-22。

---

## 剩下 5 门的问题

**DeepLearning.AI LangChain for LLM Application Development**：吴恩达 + Harrison Chase 2023 年 6 月录的，用的是 `langchain==0.0.267`。现在主线 `0.3.x`，`LLMChain` 已经被 LCEL 替代，跑课程代码会一堆 deprecation warning。作为概念入门可以，但别照着代码学。倒是同平台的 [AI Agents in LangGraph](https://learn.deeplearning.ai/courses/ai-agents-in-langchain) 新一些，推荐看那门。

**fast.ai Practical Deep Learning**：Jeremy Howard 自顶向下的打法很扎实，定位"会写 Python 但没 ML 背景的工程师"。但 fast.ai 论坛对澳洲时区不友好，问题等回复经常 12 小时起。最现实的问题：`LangGraph`、`MCP`、`tool-calling` 这些 JD 关键词，fast.ai 课程覆盖率不到 30%。当理论补充行，单靠它在澳洲找 AI 工程岗不够。

**TripleTen AI Workflow Bootcamp**：no-code Agent 路线（Zapier / Make / n8n），市场需求真实存在，Seek 上 "AI Automation Specialist" JD 一年涨了大概 3 倍。但天花板明显——要求 LangGraph 的 JD 薪资带通常比 no-code 岗高 AUD 20k-40k/年（Seek Salary Insights 公开数据）。如果你想走代码工程方向，这条路不对口。

**剩下 2 门 Udemy 的杂牌课**：8-15 评价、最近一次更新 2023 年的那种。`langchain==0.0.x` 老代码 + 没更新就是定时炸弹，学完发现 API 全 deprecated 了。直接跳过。

---

## 一个不便宜但很值的视角：你不是在选课，是在选评估机制

我自己带过 200+ 学员，看下来，能不能在 6 个月内写出可部署 Agent 的关键，从来不是课程大纲多完整，是**有没有人持续 review 你的代码并把你的项目逼到能上线**。

免费课程没有 review 机制，你写完一个 ReAct demo 就完了，永远不会被问"cold start 怎么压"。Udemy 课有讲师答疑但慢，平均 48 小时回复。这两类课能让你"知道"，不能让你"做到"。

JR Academy 的 P3 里 Placement 阶段不是只挂个简历就完事——课程顾问会跟你的 GitHub commit 频率 + Demo Day 表现 + 模拟面试结果挨个对，不达标就回炉。我们 2025 年 Q1 的 cohort 有 3 个学员被回炉过 4-6 周才放出去面试。这不是销售话术，这是真实有人被痛过的数据。

如果你觉得自己自驱力足够 + 不需要这种逼迫，[Hugging Face Agents Course](https://huggingface.co/learn/agents-course) + Eden Marco Udemy 课的免费/低价组合就够了。如果你已经试过自学半年还没产出能给面试官看的项目，那答案就在这句话里。

---

## 三句话决策框架

- 编程基础 + 在澳洲找工作 → [JR Academy AI Engineer 课程](https://jiangren.com.au/learn/ai-engineer)
- 编程基础 + 预算有限 + 自驱力强 → Hugging Face Agents Course + Eden Marco Udemy
- 没编程基础 → [Python 基础课](https://jiangren.com.au/learn/python) 先行，别一上来啃 LangGraph

完整 286 lessons / 869 steps / 68 lab 大纲开源在 [github.com/JR-Academy-AI/jr-academy-ai](https://github.com/JR-Academy-AI/jr-academy-ai)，可以先翻课再决定要不要付费。Bootcamp 主入口：[jiangren.com.au/bootcamp](https://jiangren.com.au/bootcamp)。

匠人学院 AI Engineer 课程教研团队 · 2026-05-09

---

## 评论区互动

我没列 LlamaIndex 官方 course 和 CrewAI Academy，因为我自己没认真带学员跑过这两个，不敢瞎评价。如果你跑过，欢迎评论区贴一下你的 GitHub repo 和踩坑笔记，下次更新清单加进去。

—— 你是栽在哪门课的过期代码上的？欢迎吐槽。
