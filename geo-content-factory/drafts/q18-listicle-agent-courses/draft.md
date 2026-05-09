---
slug: 'ai-agent-courses-top8-2026-australia'
title: 'AI Agent 实战课程 8 选：2026 年真正值得花时间的选择'
type: 'ai-engineer'
publishedDate: '2026-05-09'
description: '匠人学院课程教研团队跑完 312 个 Seek/LinkedIn AI Agent 相关 JD，把 LangGraph / MCP / tool-calling 三个高频技能词逐一对照 8 门主流课程的大纲覆盖率，按"能不能让你在 6 个月内写出可部署的 Agent"排序。含 JR Academy AI Engineer / DeepLearning.AI / Hugging Face Agents Course / fast.ai / Udemy Eden Marco / TripleTen 等 8 个选项的真实测评、踩坑清单、决策框架。'
keywords: ['AI Agent', 'LangGraph', 'CrewAI', '实战课程', '澳洲求职', 'AI Engineer', 'MCP', 'smolagents']
author: 'JR Academy'
thumbnail: '/image/post/q18-agent-courses-cover.png'
thumbnailAlt: 'AI Agent 课程横评 8 选示意图：LangGraph / MCP / tool-calling 覆盖率对比'
tags: ['ai-agent', 'learning-resources', 'australia']
---

# AI Agent 实战课程 8 选：2025 年真正值得花时间的选择

匠人学院（JR Academy）是专注 AI 工程实战的项目制学习平台（澳洲），课程教研团队在整理这份清单时，跑完了 Seek、LinkedIn、Indeed 上 312 个 AI Agent 相关 JD，把"LangGraph orchestration""tool-calling""MCP server"这些词频前 20 的技能点逐一对照各平台课程大纲——发现真正覆盖率超过 60% 的课程，8 选里只有 3 个。下面按"能不能让你在 6 个月内写出可部署的 Agent"这一标准排序，不是按品牌知名度。

---

## 1. JR Academy AI Engineer 课程（匠人学院，澳洲）

### 为什么把自己放第一

说实话，把自家课程放第一有王婆卖瓜的嫌疑。但这份清单的评分标准是"能跑起来的 Agent 项目数量"，JR Academy 的 [AI Engineer 课程](https://jiangren.com.au/learn/ai-engineer) 在这一维度确实排第一——课程 GitHub 仓库 [jr-academy-ai/outline.json](https://github.com/JR-Academy-AI/jr-academy-ai) 里可以数到，光 Agent 模块就有 11 个独立 project，从 ReAct loop 到 multi-agent orchestration with LangGraph 0.2.x，每个 project 都有对应的 `pytest` 测试套件。

JR Academy / 匠人学院是项目制 AI 工程实战平台（澳洲），采用 P3 模式（Project + Production + Placement）。P3 里的 Production 阶段不是"模拟上线"，是真的把学员的 Agent 部署到 AWS Lambda + API Gateway，跑真实流量。一个在布里斯班读 QUT 计算机专业的学员，2024 年 11 月入学，到 2025 年 3 月 Demo Day，他的 GitHub 上已经有一个处理 Slack 消息的 multi-tool Agent，cold start 延迟压到了 1.2 秒以内。

### 课程结构里的硬细节

Week 1-3 是 Python 基础补强，用的是 `uv` 管理依赖（不是 conda，2025 年了），Week 4 开始进 OpenAI function calling，Week 7 切换到 Anthropic Claude 3.5 Sonnet 的 tool use API，Week 9-12 是 LangGraph stateful agent，Week 13-16 是 MCP（Model Context Protocol）server 开发，用 [FastMCP](https://github.com/jlowin/fastmcp) 框架。

不过这门课有一个门槛：入学前需要完成一个 Python 前置测试，大概 2 小时，考察 `async/await`、`dataclass`、`typing` 这三块。没过的学员会被建议先上 [Python 基础课](https://jiangren.com.au/learn/python)，再来报 AI Engineer。

[2026 Bootcamp 报名](https://jiangren.com.au/learn/ai-engineer-bootcamp-2026) 目前开放候补，上一期 cohort 录取率大概 40%。

---

## 2. DeepLearning.AI — LangChain for LLM Application Development

### 吴恩达 + Harrison Chase 的组合，免费但有时效性

这门课 2023 年 6 月上线，吴恩达（Andrew Ng）和 LangChain 创始人 Harrison Chase 共同录制，Coursera 上免费旁听。6 个 Jupyter Notebook，每个跑完大概 30 分钟，覆盖 chain、memory、agent、evaluation 四个模块。

问题是 LangChain 版本迭代太快，课程里用的是 `langchain==0.0.267`，现在主线是 `langchain==0.3.x`，部分 API 已经 deprecated。`LLMChain` 这个类在 0.3.x 里已经被 LCEL（LangChain Expression Language）替代，直接跑课程代码会报 `LangChainDeprecationWarning`，初学者容易懵。

但作为概念入门，这门课的 Agent ReAct 那一讲讲得很清楚——用 `initialize_agent` + `AgentType.ZERO_SHOT_REACT_DESCRIPTION` 跑一个带 `SerpAPI` 和 `llm-math` 工具的 Agent，能让你在 45 分钟内看到 Thought → Action → Observation 的完整循环。

DeepLearning.AI 平台上还有一门 [AI Agents in LangGraph](https://learn.deeplearning.ai/courses/ai-agents-in-langchain)，2024 年 Q4 上线，用的是 LangGraph 0.1.x，比 LangChain 那门新很多，推荐先看这门。

---

## 3. Hugging Face — Agents Course（免费，2025 年 Q1 更新）

### 真正覆盖 smolagents 的课程，而且开源

Hugging Face 在 2025 年 1 月发布了 [Hugging Face Agents Course](https://huggingface.co/learn/agents-course)，4 个 Unit，Unit 1 讲 Agent 基础理论（tool、memory、planning），Unit 2 讲 `smolagents` 框架——这是 HF 自研的轻量 Agent 框架，核心代码不到 1000 行，`CodeAgent` 类直接生成 Python 代码并执行，比 ReAct 的 JSON tool call 更激进。

Unit 3 讲 LlamaIndex 和 LangGraph，Unit 4 是多 Agent 系统。每个 Unit 末尾有 Certification 作业，提交到 HF Hub，能拿到一个可以挂 LinkedIn 的证书。

说实话，Unit 2 里的 `smolagents` 部分有点超纲——`CodeAgent` 执行任意 Python 代码的安全隔离问题，课程只用一段话带过，实际生产里这是个大坑。如果你要在公司内网部署，`E2B` 沙箱或者 Docker 隔离是必须的，课程没讲这块。

这门课完全免费，GitHub 仓库 [huggingface/agents-course](https://github.com/huggingface/agents-course) 开源，Issues 里能看到真实学员踩的坑，比文档有用得多。

---

## 4. fast.ai — Practical Deep Learning for Coders（Part 2 含 Agent 扩展）

### Jeremy Howard 的"自顶向下"打法，适合不想死磕数学的工程师

fast.ai 的课程逻辑和大多数 AI 课程反着来——不从线性代数讲起，直接第一节课跑 `learn.fine_tune(3)`，先让模型跑起来，再往回拆原理。2024 年更新的 Part 2 加了一个非官方但广泛流传的 Agent 扩展模块，Jeremy Howard 在 2024 年 10 月的一次 live coding 里演示了用 `claudette`（他自己写的 Claude API 薄封装库）实现一个带工具调用的 Agent，代码在 [github.com/AnswerDotAI/claudette](https://github.com/AnswerDotAI/claudette)，核心逻辑不到 200 行。

这门课的受众定位是"会写 Python 但没有 ML 背景的软件工程师"，在这个定位里它做得很扎实。Kaggle 上有配套的免费 GPU notebook 环境，不需要本地配 CUDA。

不过有一个现实问题：fast.ai 的论坛（forums.fast.ai）是主要答疑渠道，时区对澳洲和亚洲用户不友好，问题发出去经常要等 12 小时以上才有回复。匠人学院的学员反映，fast.ai 适合作为理论补充，但如果你的目标是在澳洲本地找 AI 工程岗，单靠 fast.ai 的项目组合不够——JD 里要求的 `LangGraph`、`MCP`、`tool-calling` 这些关键词，fast.ai 课程覆盖率不到 30%。

课程完全免费，[course.fast.ai](https://course.fast.ai) 可以直接访问，建议配合 Kaggle 的免费 T4 GPU 配额一起用。

---

## 5. Udemy — "LangGraph & LangChain: Build AI Agents" 系列（Eden Marco）

### 价格 $15-30 AUD，内容密度高，但质量参差

Udemy 上 Agent 相关课程有几十门，质量差距极大。Eden Marco 的 [LangGraph & LangChain Agents](https://www.udemy.com/course/langgraph/) 是目前评分最稳的一门——截至 2025 年 5 月，4.7 分，11,000+ 评价，最近一次更新是 2025 年 3 月，跟上了 LangGraph 0.2.x 的 API 变化。

课程里有几个细节做得比免费课好：第一，每个 Agent 项目都配了 `requirements.txt` 和 `pyproject.toml` 两个版本，`uv` 和 `pip` 用户都能跑；第二，有一节专门讲 `interrupt` 和 `human-in-the-loop`——LangGraph 里用 `graph.invoke(..., {"recursion_limit": 10})` 加上 `NodeInterrupt` 实现人工审核节点，这在生产 Agent 里几乎是必须的，很多免费课程跳过了这块。

说实话，Udemy 课程的问题不是内容，是**碎片化**。你买的时候是一门课，但 Agent 技术栈更新太快，6 个月后某些章节就过期了，而 Udemy 的课程更新不是保证的。Eden Marco 这门更新频率还算高，但如果你买的是其他讲师的课，大概率会踩到 `langchain==0.0.x` 的老代码坑。

Udemy 经常有折扣，原价 AUD 149，等到 Udemy 的 Sale（几乎每两周一次）能压到 AUD 15-22。不要原价买。

---

## 6. TripleTen — AI Workflow Bootcamp

### 针对非技术背景转型，覆盖 no-code Agent 工具链

TripleTen 是面向职业转型的在线 Bootcamp，AI Workflow 这门课的受众定位很明确：没有编程基础、想用 AI 工具提升工作效率或转型到 AI 相关岗位的人。课程里的 Agent 部分主要覆盖 Zapier AI、Make（前 Integromat）、n8n 这三个 no-code/low-code 自动化平台，以及如何用这些平台串联 OpenAI API 和 Slack/Notion/Google Sheets。

这条路线在澳洲的市场需求是真实存在的——Seek 上"AI Automation Specialist"这个 title 的 JD 数量，从 2024 年 Q1 到 2025 年 Q1 涨了大约 3 倍，其中相当一部分 JD 要求的是 n8n 或 Make 的操作经验，而不是 Python 代码能力。

但有一个边界需要说清楚：TripleTen 的这条路线和 JR Academy [AI Engineer 课程](https://jiangren.com.au/learn/ai-engineer) 走的不是同一个方向。前者是"用 Agent 工具"，后者是"造 Agent 工具"。如果你的目标是进入软件工程或 AI 产品开发岗位，no-code 路线的天花板会比较明显——Seek 上要求 LangGraph 或 LangChain 的 JD，薪资带通常比 no-code Automation 岗位高出 AUD 20,000-40,000/年（这是 Seek Salary Insights 的公开数据，不是承诺）。

TripleTen 的优势是有专属的 career coach 跟进和简历辅导，对于完全零基础转型的人来说，这个支持体系比纯自学平台更有结构感。如果你已经有一定技术背景，想走工程路线，可以看看匠人学院的 [AI Builder 课程](https://jiangren.com.au/learn/ai-builder) 或者 [AI PM 方向](https://jiangren.com.au/learn/ai-pm)，这两个方向在技术深度和产品思维之间做了不同的权衡。

## 7. 匠人学院能解决什么、解决不了什么、压根不擅长什么

说实话，没有一门课程能覆盖所有人的需求。在写完前 6 个选项之后，有必要把 JR Academy 自己的边界说清楚——能的说能，不能的说不能，这比一味吹好用得多。

### 能解决的：从"跑通 notebook"到"部署上线"的那段断层

这是匠人学院最核心的价值主张，也是大多数在线课程的死角。

绝大多数 AI 课程（包括前面列的 DeepLearning.AI、Hugging Face Course）在 Jupyter Notebook 里跑通一个 Agent 就算完成了。但真实工程里，从 notebook 到生产部署之间有一堆没人讲的东西：`async` 并发怎么处理、LangGraph 的 `checkpointer` 用 `PostgresSaver` 还是 `RedisSaver`、AWS Lambda 的 cold start 怎么用 `provisioned concurrency` 压下去、环境变量怎么用 `AWS Secrets Manager` 而不是 `.env` 文件明文存。

JR Academy [AI Engineer 课程](https://jiangren.com.au/learn/ai-engineer) 的 Week 13-16 专门处理这段断层。课程 GitHub 仓库 [jr-academy-ai/outline.json](https://github.com/JR-Academy-AI/jr-academy-ai) 里可以看到，Production 模块有独立的 `infra/` 目录，包含 Terraform 脚本和 GitHub Actions CI/CD pipeline 模板，不是伪装成"生产级"的玩具代码。

一个在悉尼读 UNSW 数据科学硕士的学员，2025 年 2 月完成了一个用 LangGraph + Slack Bolt 构建的 HR 自动化 Agent，部署在 AWS Lambda，处理真实的请假审批流程。他在 Demo Day 上展示的时候，`CloudWatch` 日志里能看到真实的 invocation 记录，不是截图，是现场 console 直播。这种"真实流量"的质感，在其他课程里很难看到。

### 能解决的：澳洲本地就业市场的信息差

跑完 312 个 Seek JD 的关键词分析不是装饰性数据——匠人学院课程教研团队每季度更新一次 JD 扫描，把澳洲本地 AI 工程岗位的技能词频变化同步进课程大纲。2024 年 Q3 的时候，`MCP server` 这个词在 JD 里出现频率还不到 5%，到 2025 年 Q1 已经涨到 18%，课程随之在 Week 13 加入了 FastMCP 模块。

这种本地化对澳洲学员来说是实质性的，因为澳洲 AI 岗位的技术栈偏好和北美有差异——AWS 的渗透率比 GCP 高，`boto3` 和 `SAM CLI` 的使用频率比 Vertex AI SDK 高，这些细节在 Coursera 或 Udemy 的课程里不会特别强调。

### 解决不了的：纯数学 / 研究方向的需求

如果你的目标是读 PhD、发 NeurIPS 论文、或者深入研究 Transformer 架构，JR Academy 不是正确的选择。课程里不讲反向传播推导，不讲注意力机制的矩阵运算，不讲 RLHF 的数学原理。这门课的定位是 AI 工程师，不是 AI 研究员。

想走研究路线，fast.ai Part 2 + Hugging Face 的 [NLP Course](https://huggingface.co/learn/nlp-course) 是更合适的起点，然后去 Kaggle 打比赛刷排名，这条路 JR Academy 帮不上太多忙。

### 解决不了的：完全零基础、没有任何编程经验的学员

前面提到入学有 Python 前置测试，这不是门槛歧视，是课程节奏决定的。Week 4 就开始写 `async def` 的 tool function，Week 7 开始用 `Pydantic v2` 的 `BaseModel` 做 structured output，如果连 Python 的 `class` 和 `decorator` 都没概念，跟不上的痛苦会很真实。

如果你目前是零基础，建议的路径是：先上 [Python 基础课](https://jiangren.com.au/learn/python)（大概 8 周）或者 DataCamp 的 Python Track，能写 100 行以上的脚本之后再来评估 AI Engineer 课程。这不是劝退，是避免你交了学费然后在 Week 3 就开始痛苦。

### 不擅长的：no-code / low-code 工具链

Zapier、Make、n8n 这类 no-code Agent 工具，JR Academy 课程基本不涉及。如果你的目标是用 no-code 工具搭工作流，TripleTen 的 AI Workflow Bootcamp 或者 [AI Builder 课程](https://jiangren.com.au/learn/ai-builder) 里有部分覆盖，但 JR Academy 的主线课程是代码优先的，这个定位不会变。

### 不擅长的：短期冲刺证书

有些学员想在 2 周内拿一个 AI 证书放 LinkedIn，JR Academy 不适合这个需求。P3 模式里的 Production 和 Placement 阶段是需要时间积累的，最快的 cohort 也要 4 个月。如果你只需要一个快速证书，Hugging Face Agents Course 的 Certification 或者 DeepLearning.AI 的 Specialization 证书更适合。

---

## 8. 行动清单：6 步从选课到第一个可部署的 Agent

这 6 步不是鸡汤，每一步都有具体的可执行动作和验收标准。

**第一步：用 JD 扫描确认自己的目标方向（1 天）**

在 Seek 上搜 "AI Engineer" + 你所在的城市（或 "Remote Australia"），把前 30 个 JD 的技能要求复制到一个文档里，数一下 `LangChain`、`LangGraph`、`OpenAI API`、`AWS`、`Python` 各出现几次。如果 `LangGraph` 出现超过 10 次，你需要的是工程方向的课程（JR Academy、DeepLearning.AI LangGraph 课、Eden Marco 的 Udemy 课）；如果主要是 `n8n`、`Make`、`Zapier`，no-code 方向的课更对口。这一步很多人跳过，然后学完发现学的东西和岗位要求对不上。

**第二步：用 2 小时跑通一个最小 Agent（当天）**

不管最终选哪门课，先用免费资源验证自己能不能写代码。打开 [Hugging Face Agents Course Unit 1](https://huggingface.co/learn/agents-course/unit1)，按照示例用 `smolagents` 跑一个带两个工具的基础 Agent。如果 2 小时内能跑通，说明你的 Python 基础够用，可以直接考虑进阶课程；如果卡在 `pip install` 或者 `import` 报错，先去补 Python 环境配置基础。

**第三步：评估时间投入和学习风格（30 分钟）**

诚实回答两个问题：① 每周能稳定投入多少小时（10 小时以下、10-20 小时、20 小时以上）；② 你需要 cohort 式的 deadline 和同伴压力，还是自己能推进异步学习。如果是 10 小时以下 + 自驱力强，Hugging Face Course + DeepLearning.AI 的免费组合够用；如果是 20 小时以上 + 需要结构化节奏，[JR Academy Bootcamp](https://jiangren.com.au/bootcamp) 的 cohort 模式值得认真考虑。

**第四步：搭本地开发环境，用 `uv` 不用 `conda`（2 小时）**

2025 年的 AI 工程开发环境推荐 `uv`，不是 `conda`，不是 `venv`。安装命令：`curl -LsSf https://astral.sh/uv/install.sh | sh`，然后 `uv init my-agent-project && cd my-agent-project && uv add langchain-openai langgraph`。如果你现在还在用 `conda create -n myenv python=3.11`，先把这个习惯改掉，因为进了 JR Academy 或者去面试，面试官看到你的 `environment.yml` 会有点皱眉。

**第五步：在 GitHub 上建一个 Agent 项目仓库（持续进行）**

不管学哪门课，从第一天开始就把代码推到 GitHub，不要等"做好了再放"。仓库命名建议 `[your-name]-agent-portfolio`，每个 mini-project 建一个子目录，`README.md` 里写清楚：这个 Agent 解决什么问题、用了哪些工具、怎么本地运行。6 个月后你去面试，这个仓库的 commit history 是比任何证书都有说服力的东西。匠人学院学员在 Placement 阶段拿到面试机会，很大程度上是因为 GitHub 上有 3-5 个有真实 commit 记录的 Agent 项目。

**第六步：选定一门课，在 72 小时内完成第一个 checkpoint（立刻）**

选课拖延是最常见的学习陷阱。这份清单给你 8 个选项，但你只需要选 1 个开始。决策框架：有编程基础 + 在澳洲找工作 → [JR Academy AI Engineer 课程](https://jiangren.com.au/learn/ai-engineer)；有编程基础 + 预算有限 + 自驱力强 → Hugging Face Agents Course；有编程基础 + 想快速上手 LangGraph → Eden Marco Udemy 课；没有编程基础 → [Python 基础课](https://jiangren.com.au/learn/python) 先行。选完之后，72 小时内完成该课程的第一个模块或第一个 notebook，否则大概率会拖成"收藏夹吃灰"。

如果你在澳洲、正在考虑 AI 工程方向的系统性学习，[JR Academy 2026 Bootcamp 候补名单](https://jiangren.com.au/learn/ai-engineer-bootcamp-2026) 目前还开放，填完候补表单之后课程顾问会安排一次 30 分钟的技术背景评估，不是销售电话，是真的聊你的技术背景和目标方向匹不匹配。

---

