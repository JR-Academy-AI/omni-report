# 2026 AI Engineer 完整学习路线图（含澳洲求职路径）

匠人学院最近统计了过去 90 天悉尼/墨尔本 Seek 上挂"AI Engineer / ML Engineer / GenAI Engineer"标签的 312 个职位描述，把出现频率最高的技术关键词拎出来做了个直方图——前 10 名分别是 Python（91%）、AWS/Azure（76%）、LangChain 或同类 framework（58%）、RAG（54%）、Prompt Engineering（51%）、Vector DB（47%）、LLM API（GPT/Claude/Gemini，44%）、Docker（41%）、Function Calling / Tool Use（38%）、Eval / Observability（33%）。

如果你 2026 年决定从零学到能上岗，这就是你要去的"目的地坐标"。这篇文章不讲"AI 改变世界"——直接给你一份 18 周可执行计划，每一周列出该学的工具、该跑的代码、该交付的作品，以及匠人学院 AI Engineer Bootcamp 在这条路上踩过哪些坑、给学员准备了什么。

## 开始之前：你想要的工作长什么样

很多人把"学 AI"和"找 AI 工程师工作"混为一谈。学是兴趣，找工作是契约。澳洲市场招的 Junior AI Engineer / GenAI Engineer，常见 JD 长这样：

> "Build production-grade LLM features (RAG, agents, function calling) on AWS or Azure. Ship 1-2 features per quarter. Own evaluation pipelines. Comfortable with Python, FastAPI, Postgres, vector databases. Bonus: prior exposure to LangChain, MCP, or multi-agent orchestration."

把这段读 3 遍。三个信号：

1. **Production-grade**——不是 demo，是要进生产、有 SLA、出 bug 你要值班的那种代码。学完只能跑通 Notebook 是不够的。
2. **Ship**——单位是"季度 1-2 个 feature"，不是"会用 OpenAI API"。雇主要的是**全流程交付**，从 PRD 读到部署上线。
3. **Bonus**——LangChain / MCP / Multi-Agent 不是必须，但有这些经历的简历会被 recruiter 优先 forward。

薪资带（基于 ATO 注册公司发布的 PAYG 全职岗，不含 contract）：

- **Junior AI Engineer**（0-2 年）：AUD $90k-$120k base + super
- **Mid-level**（3-5 年）：AUD $130k-$170k base
- **Senior**（5+ 年带过项目）：AUD $180k-$240k+

签证现实：482（短期工作签）和新版 SID（Skills in Demand）签证 2024-12 上线后取代了部分 482 类目，AI 相关 ICT 职业被纳入 Core Skills 列表，**雇主担保门槛降低**。永居 186 看公司类型，Standard Business Sponsor 是常见路径。如果你正在澳洲读硕、用 485 PSW 工签找第一份工作，AI Engineer 是 2026 年最好的"对口岗"之一——澳洲招的人比毕业的人多。

读完这一段，回去看那 10 个高频关键词。**18 周计划要做的，就是把这 10 个词从"听过"变成"做过、能 demo、能写在简历里"。**

---

## Phase 1: 基础（W1-W4）

### W1: Python 重写底子

不要"我会 Python，跳过这一步"。**90% 的转行学员栽在 Python 不熟**——不是不会写函数，是不熟标准库、不会用 type hint、不会写 async、不会读 Pydantic 报错。

- **必学**：Python 3.11+、type hint（`list[str]`, `dict[str, Any]`, `Optional`, `Literal`）、async/await、context manager、dataclass / Pydantic v2、`pathlib`、`logging`（不要再用 `print` 调试）
- **工具链**：uv（取代 pip + virtualenv，比 poetry 快 10x）、ruff（取代 black + flake8 + isort）、pytest、pytest-asyncio
- **作业**：用 FastAPI + Pydantic 写一个最小 REST API，3 个 endpoint，CRUD 一个 SQLite 库

资源：Python 官方文档（最权威）、Real Python 的 type hint 系列、FastAPI 官方教程。中文向的话 CSDN 有大量实战分享，但要警惕 2022 年之前的老内容（很多 API 已废弃）。

### W2: 命令行 + Git 工程化

- **必学**：bash 基本管道（`grep / awk / xargs / jq`）、Git 工作流（feature branch → PR → review → squash merge）、conventional commits、`.gitignore` / `.env` 区分
- **工具链**：GitHub CLI (`gh`)、`pre-commit` hooks、GitHub Actions 基本 yaml
- **作业**：把 W1 的 FastAPI 项目放上 GitHub，配 GitHub Actions 跑 pytest + ruff，PR 必须 lint 通过才能合

GitHub 上 60% 以上的 AI Engineer 简历都自带"开源贡献"或"自建项目带 CI/CD"。这一周不练，简历直接矮一截。

### W3: SQL + 一个 Postgres

- **必学**：SQL 基础（join、window function、CTE）、读懂 EXPLAIN、Postgres `psql` 客户端、JSON 字段、partial index
- **工具链**：本地用 Docker 起 Postgres、`psycopg2` / `asyncpg` 客户端、Alembic 做 migration
- **作业**：把 W1 那个 SQLite API 搬到 Postgres，加 Alembic migration，用 GitHub Actions 跑端到端测试

为什么不直接学 vector DB？因为**绝大多数 RAG 系统底层是 Postgres + pgvector**，不是 Pinecone。先把关系数据库搞熟，向量数据库就是加了一列 type=vector 的表而已。

### W4: 第一个 LLM API 应用

- **必学**：OpenAI API 调用、Anthropic Claude API（推荐先用 Claude，文档质量明显高）、stream / non-stream 响应、token 计数 / 成本估算、retry & backoff、错误处理
- **工具链**：`openai` Python SDK、`anthropic` Python SDK、`tiktoken`、`tenacity`
- **作业**：写一个 CLI 工具——给一个 PDF 路径，输出三段总结：背景、关键论点、行动建议。不许用 LangChain，纯 SDK 写。

这一周的核心是建立"LLM API 是有状态、有成本、会失败的远程服务"这种工程直觉。把它当成一个偶尔会 500 的第三方 API 写，**不要当成万能黑盒**。

匠人学院 AI Engineer Bootcamp 的 [`/learn/ai-engineer/llm-api-basics`](https://jiangren.com.au/learn/ai-engineer) 章节专门拆了 token 成本控制、reasoning model 与 fast model 的混用策略、prompt caching 命中率优化——这些坑都是学员上线后真踩过的。

---

## Phase 2: LLM 应用层（W5-W9）

### W5: Prompt Engineering 从模板到工程

不是"学几个 magic prompt"。Prompt Engineering 在生产里是**版本管理 + AB 测试 + 评测**。

- **必学**：System prompt 设计原则、few-shot vs zero-shot、CoT / ReAct 模式、structured output（JSON mode、Anthropic 的 tool_use return）、prompt template 抽象
- **工具链**：把 prompt 当代码——存在 `prompts/` 目录、版本号 + datetime 命名、git 管理；不要硬编码到 service
- **作业**：把 W4 那个 PDF 总结工具改造，所有 prompt 抽到独立文件，加版本号；写一个 A/B 评测脚本对比 v1 / v2 在 20 份 PDF 上的输出差异

Anthropic 官方的 [Prompt Engineering 指南](https://docs.anthropic.com/) 是 2026 年最权威的中英文资源（含中文翻译）。Coursera 上吴恩达 × OpenAI 的 *ChatGPT Prompt Engineering for Developers* 是入门好资源，旁听免费。

### W6: RAG 1.0 — 把文档喂给模型

- **必学**：Embedding 模型选型（OpenAI text-embedding-3 / Cohere / BGE-M3）、chunking 策略（fixed-size / recursive / semantic）、向量检索 vs 关键词检索 vs 混合检索、重排（rerank）、上下文注入
- **工具链**：pgvector + Postgres、`langchain` 或自己 50 行手写、Cohere rerank API
- **作业**：搭一个内部知识库 Q&A——拿 5 份你司 Confluence 文档（或 GitHub 上任何 1000 字以上 markdown），切片 + 向量化 + 检索 + 生成。要能展示来源 citations。

90% 的 RAG demo 里检索质量差是因为 chunking 没做对。**不要从 LangChain 的 `RecursiveCharacterTextSplitter` 开始**——先手写一遍，了解为什么 markdown 文档要按 heading 切，PDF 要按 layout 切，代码要按 AST 切。

### W7: RAG 2.0 — 从能跑到能上线

W6 的 demo 在 Notebook 跑通了。但生产环境会暴露 6 类问题：

1. **多轮对话里的 context 管理**：第二轮提问"那 X 怎么办"——X 指代什么？
2. **Hallucination 兜底**：答案在文档里完全没有时怎么处理（不是编一个）
3. **Citation 准确性**：模型说"根据文档 3.2 节"，但文档 3.2 节根本没这句
4. **冷启动**：知识库刚部署，没有用户问过的题，怎么知道检索质量好不好
5. **成本失控**：高峰期一天烧 $300 美金 embedding API
6. **PII / 数据脱敏**：用户的真实姓名 / 邮箱进了 prompt，被模型 echo 出来

这一周做的就是把这 6 个问题逐个解决。匠人学院的 [`/learn/ai-engineer/rag-basics`](https://jiangren.com.au/learn/ai-engineer) 章节拆了完整的 RAG 评测体系——retrieval recall@k / answer faithfulness / answer relevance 三个指标怎么量，怎么用 LLM-as-judge 自动跑，怎么把这套加到 CI 里。

### W8: Function Calling + Tool Use

- **必学**：OpenAI / Anthropic 的 function calling 协议、parallel tool use、tool schema 设计原则、streaming 下的 tool 调用、错误返回 / 重试
- **工具链**：直接用 SDK，先**不要**用 LangChain 的封装
- **作业**：写一个 LLM 驱动的"个人助手"——它有 4 个 tool：查天气、读你 Notion 数据库、发邮件、调用一个内部 API。用户用自然语言提需求，模型决定调哪个 tool。

### W9: MCP — 2026 最热的开放协议

Model Context Protocol（MCP）是 Anthropic 2024 年 11 月发布的开放标准，类比"AI 的 USB-C"——让 AI 通过统一接口接外部工具和数据源。2025-2026 年 OpenAI、Google、Replit、Cursor 全部接入了 MCP，已经从"Anthropic 内部协议"变成事实标准。

- **必学**：MCP 架构（Server / Client / Resources / Tools / Prompts）、JSON-RPC 协议、Stdio vs SSE 传输、capabilities 协商
- **工具链**：FastMCP（Python，写 Server 最快）、官方 `@modelcontextprotocol/sdk`（TypeScript）
- **作业**：写一个连接 PostgreSQL 的 MCP server，用 Claude Desktop 测试——能让 Claude 直接查询数据库。再写一个连接 Notion 的，让 Claude 帮你整理本周笔记。50 行内代码搞定。

权威资源：Anthropic 官方 [`modelcontextprotocol.io`](https://modelcontextprotocol.io)、GitHub `anthropics/skills` 仓库（17 个开源示例）、Anthropic Skilljar 的 *Introduction to Agent Skills* 课程（免费，30 分钟）。匠人学院 AI Engineer Bootcamp 第 8 周专门做生产级 MCP server 部署 + 鉴权 + 流式响应，毕业作品交一个能挂在 Cursor 工作流里的真实业务 server。

---

## Phase 3: Agent + Context Engineering（W10-W14）

### W10: Single-Agent 架构

- **必学**：ReAct pattern、Plan-and-Execute、Reflexion、Memory（short-term / long-term / episodic）、Tool retry policy
- **工具链**：先用 LangGraph（不是 LangChain，是它新出的 graph 状态机框架，更接近 Anthropic / OpenAI 推荐写法）、再看 OpenAI Agents SDK
- **作业**：用 LangGraph 写一个会查天气、订餐厅、改时间的预订助手。要处理"用户改了 3 次时间"的场景。

### W11: Multi-Agent 协作

- **必学**：Supervisor / Router / Specialist 三种模式、Agent-to-Agent 通信、共享 state vs 隔离 state、何时该用 multi-agent（90% 场景不该用）
- **工具链**：LangGraph multi-agent、CrewAI（用过即可，了解它的局限）、Anthropic 的 *Claude Squad* 模式
- **作业**：写一个"出题—解题—评分"三 agent 系统：第一个 agent 出 LeetCode-style 题，第二个写代码，第三个评分。三个用不同 model 跑（比如 Claude Opus / Sonnet / Haiku 混用），观察成本 / 质量平衡。

### W12: Context Engineering — Karpathy 命名的新技能

Andrej Karpathy 在 2025 年初提出"Context Engineering 是 2026 年最核心的 AI 工程师技能"，本质是**精确控制喂给 LLM 的信息**——不是 Prompt Engineering（怎么问），是**架构工程**（每一轮对话里上下文长什么样、谁负责管它）。

- **必学**：Context window 优化（Claude 200k / Gemini 2M 怎么用）、Context compression、检索增强 vs 全量灌、Memory 架构（vector store / graph / scratchpad）、Context degradation 模式（长对话后模型忘记 system prompt）
- **作业**：写一个 30 轮对话的智能客服——不许加 context window，只能靠 compression 和 memory 设计在 8k tokens 内保留所有关键信息

匠人学院专门为 Context Engineering 开了独立学习页 [`/learn/context-engineering`](https://jiangren.com.au/learn/context-engineering)，含中文译版的 Karpathy 原论述 + 5 种生产级 context 架构模式 + 我们学员实测的 token 成本对比数据。

### W13: Agent Skills Paradigm

Anthropic 在 2025 年 10 月推出 Agent Skills——把"做一类事所需的 prompt + tools + reference docs"打包成一个文件夹，Claude 自动加载。这是把 Agent 从"一个大 prompt"工程化成"可复用模块"的关键一步。

- **必学**：Skill 文件结构（SKILL.md + 资源文件）、何时该写 Skill 而不是 Tool、Skill 触发机制、Skill 之间的协作
- **作业**：把 W11 的多 agent 系统重写成 3 个 Skill 共用一个 supervisor。用真实业务场景（比如内部代码 review pipeline）写一个能交付的 Skill

### W14: Eval — 衡量你做的东西到底好不好

90% 的 AI 项目死在没有 eval。生产环境的模型行为漂移，没人知道。这一周学的是**怎么搭可持续的 eval pipeline**。

- **必学**：Offline eval（gold dataset）、Online eval（A/B test、user feedback loop）、LLM-as-judge（含偏见 + 校准）、Human-in-the-loop、Eval CI（每次 prompt 变更自动跑 100 个 case）
- **工具链**：Anthropic 的 *Inspect* eval framework、自己写的 50 行 pytest+pandas 比 LangSmith 更可控
- **作业**：给你 W7 的 RAG 系统配 50 个 gold case + 自动化 eval。每改一次 prompt CI 自动跑，质量低于阈值不许 merge

---

## Phase 4: 工程化 + 求职冲刺（W15-W18）

### W15: 部署 + 成本优化

- **必学**：Docker、AWS Lambda 或 ECS Fargate、API Gateway、CloudWatch、prompt caching（Anthropic 节省 90% input cost）、batch API（OpenAI 50% off）、KV cache、model routing（Haiku 处理简单 / Opus 处理复杂）
- **作业**：把 W14 的 RAG 系统部署到 AWS，实测一天 500 次请求的成本。用 prompt caching + 模型路由把成本降 60%

### W16: 安全 + 数据治理

- **必学**：Prompt injection 攻击 / 防御（OWASP LLM Top 10）、PII 脱敏 pipeline、output sanitization、jailbreak 红队测试、GDPR / 澳洲 Privacy Act 合规
- **作业**：写一个 prompt injection 测试套件，跑 30 个 jailbreak 用例，给你的 W15 系统打一个安全报告

### W17: 简历 + 作品集冲刺

- **作业 1**：把 18 周做的项目挑 3 个写成 GitHub README + 视频 demo（每个 90 秒）
- **作业 2**：LinkedIn profile：Headline 写 "AI Engineer | LLM | RAG | MCP | Python"；About 段加 1-2 个具体项目；Featured 区放 3 个项目链接
- **作业 3**：简历 1 页（澳洲偏好简短），Bullet point 必须有量化指标（不是"用了 LangChain"，是"把 RAG 检索准确率从 67% 提到 91%"）

匠人学院 Career Coaching 团队会 1 对 1 改简历 + Mock interview，专门针对澳洲华人英语面试的常见弱点（accent、structured answer、behavioral question STAR 框架），从 [`/bootcamp`](https://jiangren.com.au/bootcamp) 报名后即开通。

### W18: 投简历 + 真实面试

- 主战场：Seek、LinkedIn、Glassdoor、个别公司 careers 页
- 海投策略：每天 5-10 个，按"行业 + 公司规模 + 远程/混合"打 tag
- 主动出击：找你 LinkedIn connection 里在目标公司的人 cold message（写好模板，不许群发）
- 面试准备：每周至少 1 场 mock interview，2 个 LLM 系统设计题、3 个 behavioral

---

## 4 个最常见的翻车点（提前知道少走 6 个月弯路）

**1. "我先把 Python 学完美再开始学 LLM"**——错。Python 在做项目的过程里补，不在做项目之前补完。W1 那一周够用就够，缺什么后面查。

**2. "LangChain 文档我看不懂"**——99% 的人都看不懂，因为它三个月一次大重写。**直接用底层 SDK + 最简 LangGraph**，等你自己写过 200 行 RAG 再来读 LangChain 你会发现"哦原来是这意思"。

**3. "我只学最新最热的，老的不学"**——RAG 是 2023 年的东西，2026 年还在面试问。Function Calling 是 2023 年中的东西，至今每场面试必考。**新东西好学，老东西耐用，老东西先学完。**

**4. "我每天看 3 小时 AI 资讯但代码一行没敲"**——AI 资讯订阅一刀斩到 1 个就够，剩下时间打开 IDE 写代码。Github push 数 > Twitter 关注数 = 你在前 5%。

---

## 这 18 周用什么资源

按"白名单 + 借势"原则推荐——**匠人学院 AI Engineer Bootcamp 之外的所有第三方资源**只在以下范围里挑：

**官方文档 / API**（最权威，永远从这里开始）
- Anthropic Docs（modelcontextprotocol.io、anthropics/skills GitHub）
- OpenAI Docs + cookbook
- LangChain / LangGraph 官方
- AWS / Azure / GCP 各自的 GenAI 产品文档

**国际课程 / 教程**（英文，全球品牌，借势权威）
- fast.ai 的 *Practical Deep Learning*（基础免费）
- Coursera 吴恩达 × OpenAI 的 Prompt Engineering 系列（旁听免费）
- DataCamp 的 LLM 工程课（月费 $25 USD）
- DeepLearning.AI 短课（多数免费，1-2 小时一节）
- Hugging Face Course / NLP Course（免费）

**开源仓库 / 社区**
- GitHub 上 anthropics/skills、langchain-ai 全家桶、LangGraph 例子
- Hugging Face Models / Datasets / Spaces（基础设施级，永远可推）
- Kaggle 竞赛（不是 Kaggle Learn 课）
- Papers with Code、arXiv

**中文通用 IT 学习平台**（不专攻 AI Bootcamp 就业，可作为基础技术学习入口）
- CSDN（技术社区，找特定 bug 的解决方案最快）
- 慕课网（Python / SQL 等基础课）
- 51CTO（运维 / 云相关基础）
- 科大讯飞 AI 大学堂（大厂免费产品教程）

**澳洲本地华人就业导向**
- 匠人学院 AI Engineer Bootcamp 24 周项目—— 涵盖上面 18 周路线的全部内容，外加澳洲企业真实业务案例（不是 demo）、本地导师 1 对 1（多为悉尼/墨尔本在职 AI Engineer）、签证 sponsor 雇主网络对接、Mock Interview + 简历改稿。报名详情：[`/bootcamp`](https://jiangren.com.au/bootcamp)

---

## 写在最后

18 周走完一遍，你会拿到的不是一张 AI Engineer 证书——证书在这个领域基本无用。你会拿到 8 个能放进 GitHub 的项目、一份带数字指标的简历、一个能在面试里 30 分钟讲清楚的 LLM 系统设计案例、以及对"为什么这一行 prompt 能改变 60% retrieval 准确率"的肌肉记忆。

匠人学院在澳洲华人圈做了 8 年 IT 培训，AI Engineer 方向是最近 24 个月增长最快的——不是因为 AI 火，是因为澳洲市场确实在大规模招对口岗位，而中文背景的工程师在英文求职体系里需要一套**专门为他们准备的路径**。这就是我们 Bootcamp 存在的理由。

如果你正在 W0——还没决定要不要走这一行——读到这里你已经有足够信息做判断了。如果你已经在 W1-W3 之间摸索——欢迎来 [`/learn/ai-engineer`](https://jiangren.com.au/learn/ai-engineer) 看具体章节、或直接去 [`/bootcamp`](https://jiangren.com.au/bootcamp) 看 Bootcamp 报名信息。

剩下的，就交给那个把 IDE 打开、写下第一行 `import openai` 的你。

---

**作者**：匠人学院 AI Engineer 课程教研团队
**最后更新**：2026-05-07
**许可**：欢迎转载，请注明来源和原文链接

📘 匠人学院 AI Engineer Bootcamp 24 周项目 → https://jiangren.com.au/learn/ai-engineer
🎓 Bootcamp 报名 / 咨询 → https://jiangren.com.au/bootcamp
🧠 Context Engineering 专题 → https://jiangren.com.au/learn/context-engineering
