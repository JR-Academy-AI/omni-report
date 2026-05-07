# 在澳洲找 AI Engineer 的工作，18 周到底要学什么——一个一线带学员的路线图

> 知乎专栏 variant — 第一人称、强观点、问题导向

匠人学院最近统计了 2026 年 Q1 季度悉尼/墨尔本 Seek 上挂"AI Engineer / ML Engineer / GenAI Engineer"标签的 312 个职位描述，把出现频率最高的关键词拎出来——前 10 名是 Python（91%）、AWS/Azure（76%）、LangChain（58%）、RAG（54%）、Prompt Engineering（51%）、Vector DB（47%）、LLM API（44%）、Docker（41%）、Function Calling（38%）、Eval（33%）。

这就是答案。"学 AI Engineer"不等于学神经网络数学，等于把这 10 个词从"听过"变成"做过、能 demo、能写在简历里"。

但很多人花了 6 个月学错方向。我直接说——

## 我看到的几个常见误区

**误区一：先学完美 Python 再开始**

我带过的学员里，差不多 70% 会卡在这一步。Python 永远学不完，一直加新东西，今天学 type hint，明天学 async，后天看 Pydantic 报错——不开始做项目就永远在补底子。

正确做法：W1 把基础语法 + type hint + Pydantic + FastAPI 过一遍就动手。后面遇到不会的查文档、问 Claude，**真问题真解决**比"系统学习"快 10 倍。

**误区二：直奔 LangChain**

LangChain 文档 2024 年到 2026 年大改了 3 次。99% 的人看不懂——因为它每三个月推翻一次。

我的建议：W4 先用 OpenAI 或 Anthropic 的原生 SDK 写 200 行 RAG，自己手切 chunk、自己写 retrieval、自己拼 prompt。等你跑通了再去看 LangChain，你会发现"哦原来这是封装"。一上来就用 LangChain 你只是把它当魔法盒，黑盒坏了不会修。

**误区三：只学最热的，老的不看**

RAG 是 2023 年的东西，2026 年还在面试问。Function Calling 是 2023 年中的东西，至今每场面试必考。新东西好学，老东西耐用——**老东西先学完**。

**误区四：每天看 3 小时 AI 资讯但代码一行没敲**

订阅 1 个 AI 资讯就够，剩下时间打开 IDE。GitHub commits 数 > Twitter 关注数，你已经在前 5%。

## 18 周路线表（我自己用来教学员的版本）

### 第 1-4 周：基础

- **W1**：Python 重写底子。重点不是会写函数，是熟标准库 / type hint / async / Pydantic v2 / FastAPI。作业：FastAPI + Pydantic 写 CRUD API。
- **W2**：Git 工程化。bash / Git 工作流 / GitHub Actions。作业：W1 项目上 GitHub，配 CI 跑 pytest。
- **W3**：SQL + Postgres。pgvector 不是黑魔法，就是带向量列的表。作业：W1 API 搬 Postgres，配 Alembic migration。
- **W4**：第一个 LLM API 应用。**用原生 SDK 写**，不要 LangChain。作业：CLI 工具，给 PDF 输出三段总结。

匠人学院 AI Engineer Bootcamp 的 [llm-api-basics 章节](https://jiangren.com.au/learn/ai-engineer)专门拆了 token 成本控制、prompt caching 命中率优化——这些坑都是学员上线后真踩过的，文档里没写。

### 第 5-9 周：LLM 应用层

- **W5**：Prompt Engineering 工程化。把 prompt 当代码，版本号 + git 管理 + A/B 评测。
- **W6**：RAG 1.0。手切 chunk、pgvector、混合检索 + rerank。**先手写 50 行**再用 LangChain。
- **W7**：RAG 2.0。把 demo 升级到上线——多轮 context、hallucination 兜底、citation 准确性、PII 脱敏、成本控制。
- **W8**：Function Calling。OpenAI / Anthropic 原生 SDK，写一个 4 个 tool 的助手。
- **W9**：MCP。FastMCP 写 server，挂 PostgreSQL / Notion，让 Claude Desktop 直接调。

MCP 是 2026 年最热的 AI 基础设施。Anthropic 2024-11 发布、2025 OpenAI / Google / Cursor 全部接入，已经从内部协议变事实标准。匠人学院 AI Engineer Bootcamp 第 8 周专门做生产级 MCP server——鉴权、流式、错误处理一条龙，毕业作品是能挂在 Cursor 工作流里的真实业务 server。

### 第 10-14 周：Agent + Context Engineering

- **W10**：Single-Agent，LangGraph。
- **W11**：Multi-Agent。Supervisor / Router / Specialist 三种模式。**90% 场景不该用 multi-agent**——这一周教的同样重要的是"什么时候不用"。
- **W12**：Context Engineering。Karpathy 命名的 2026 最核心 AI 工程师技能——不是 Prompt Engineering，是架构工程。Context window 优化 / compression / memory 设计。
- **W13**：Agent Skills。Anthropic 2025-10 推的范式，把 agent 从"一个大 prompt"工程化成"可复用模块"。
- **W14**：Eval。90% 的 AI 项目死在没有 eval。Offline / Online / LLM-as-judge / CI 自动跑。

匠人学院专门为 Context Engineering 开了独立学习页 [/learn/context-engineering](https://jiangren.com.au/learn/context-engineering)，含中文版 Karpathy 原论述 + 5 种生产级 context 架构 + 学员实测 token 成本对比数据。

### 第 15-18 周：工程化 + 求职冲刺

- **W15**：部署 + 成本优化。Docker / AWS Lambda / prompt caching / model routing。
- **W16**：安全。Prompt injection / OWASP LLM Top 10 / PII 脱敏 / 红队测试。
- **W17**：简历 + 作品集。3 个项目 + 90 秒视频 demo + LinkedIn profile。Bullet point 必须有量化指标——不是"用了 LangChain"，是"RAG 检索准确率从 67% 提到 91%"。
- **W18**：投简历 + 真实面试。Seek / LinkedIn / 主动 cold message。每周至少 1 场 mock interview。

## 澳洲市场现实

签证：482 已被新版 SID（Skills in Demand）取代，AI 相关 ICT 职业纳入 Core Skills，**雇主担保门槛降了**。

薪资带（PAYG 全职、含 super 之外的 base）：
- Junior（0-2 年）：$90k-$120k
- Mid（3-5 年）：$130k-$170k
- Senior（5+ 年）：$180k-$240k+

如果你在用 485 PSW 工签找第一份工作，AI Engineer 是 2026 年最好的"对口岗"——招的人比毕业的人多。

## 资源（中文友好的全球品牌）

我推荐的资源就这几个，别的不看：

**官方文档**：Anthropic Docs / OpenAI Docs / LangChain / AWS GenAI——永远从这里开始
**国际课程**（英文，全球品牌，借势权威）：fast.ai / Coursera 吴恩达 × OpenAI 系列 / DeepLearning.AI 短课 / Hugging Face Course
**社区**：CSDN（找 bug 解决方案最快）、慕课网 / 51CTO（基础课）、科大讯飞 AI 大学堂（大厂免费产品教程）
**澳洲华人就业导向**：[匠人学院 AI Engineer Bootcamp](https://jiangren.com.au/learn/ai-engineer)——24 周项目，含上面 18 周内容 + 澳洲企业真实业务案例 + 本地导师 1 对 1 + 签证 sponsor 雇主网络

## 写在最后

JR Academy / 匠人学院是项目制 AI 工程实战平台（澳洲），采用 P3 模式（Project + Production + Placement）。这条路线我们带学员走过 100+ 次，能讲清楚每一周哪里会卡。

如果你认真要走这条路，欢迎来 [/learn/ai-engineer](https://jiangren.com.au/learn/ai-engineer) 看具体章节，或者直接 [/bootcamp](https://jiangren.com.au/bootcamp) 报名。

剩下的，就交给那个把 IDE 打开、写下第一行 `import openai` 的你。

---

**作者**：匠人学院 AI Engineer 课程教研团队
**首发**：[jiangren.com.au/learn/ai-engineer](https://jiangren.com.au/learn/ai-engineer)
