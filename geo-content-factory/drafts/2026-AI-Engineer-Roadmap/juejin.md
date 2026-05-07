# 从 0 到 LangGraph Agent 工程师 18 周路线 + 系统架构图

> 掘金 variant — 中文资深前端 / 工程师，项目实战 + Mermaid 架构图

匠人学院最近统计了 312 个澳洲 AI Engineer JD，前 10 关键词频率：Python（91%）、AWS/Azure（76%）、LangChain（58%）、RAG（54%）、Prompt Engineering（51%）、Vector DB（47%）、LLM API（44%）、Docker（41%）、Function Calling（38%）、Eval（33%）。

如果你 2026 年想从前端 / 后端转 AI Engineer，这是一份带架构图的 18 周路线——每个阶段都给你**整体的系统视图**，不是零散的 API 调用。

## 路线全景图

```mermaid
graph LR
    A[W1-4 基础<br/>Python+SQL+LLM API] --> B[W5-9 应用层<br/>Prompt+RAG+MCP]
    B --> C[W10-14 Agent 层<br/>LangGraph+Multi-Agent+Eval]
    C --> D[W15-18 工程化<br/>部署+安全+求职]
    D --> E((上岗<br/>Junior AI Engineer))

    style A fill:#e1f5e1
    style B fill:#fff3cd
    style C fill:#cfe2ff
    style D fill:#f8d7da
    style E fill:#d1e7dd
```

## Phase 1: 基础（W1-W4）

**核心理念**：先把"远程有状态服务调用"的工程直觉建立起来，LLM API 是个会偶尔 500 的第三方依赖。

```mermaid
graph TB
    Client[FastAPI Server] -->|HTTP| LLM[LLM API<br/>Claude/GPT]
    Client -->|SQL| DB[(Postgres<br/>+pgvector)]
    Client -->|Redis| Cache[(Cache<br/>token/session)]
    LLM -->|Stream| Client
    Client -->|Logs| CW[CloudWatch]
```

每周交付：

| 周 | 交付物 | 关键技术 |
|---|---|---|
| W1 | FastAPI CRUD API | Pydantic v2, type hint, async |
| W2 | + GitHub CI | Git workflow, GitHub Actions, pre-commit |
| W3 | + Postgres 持久化 | Alembic migration, asyncpg, JSON fields |
| W4 | + LLM 接入 | OpenAI/Anthropic SDK, retry, token 计数 |

匠人学院 AI Engineer Bootcamp 的 [llm-api-basics 章节](https://jiangren.com.au/learn/ai-engineer)拆了 prompt caching 命中率优化 + reasoning model / fast model 混用策略——这些是文档里没写但生产上必须懂的。

## Phase 2: LLM 应用层（W5-W9）

**核心理念**：从单次调用进化到带 retrieval / 工具 / 多轮的复合应用。

### RAG 系统典型架构

```mermaid
graph LR
    Q[用户提问] --> EM[Embedding Model<br/>text-embedding-3]
    EM --> VS[(pgvector)]
    VS --> RR[Rerank<br/>Cohere]
    RR --> Ctx[Context 注入]
    Ctx --> LLM[Claude/GPT]
    LLM --> A[答案 + Citations]

    Doc[源文档] -->|Chunking| Splitter[Markdown/PDF/Code<br/>Splitter]
    Splitter --> EM
```

W6-W7 拆 RAG 1.0 → 2.0 的 6 个生产坑：

1. 多轮对话 context 管理
2. Hallucination 兜底（答案不在文档里）
3. Citation 准确性（模型说"3.2 节"但 3.2 节没那句）
4. 冷启动评测
5. 成本失控（一天烧 $300 embedding）
6. PII 数据脱敏

### MCP 协议架构（W9）

```mermaid
graph LR
    User[用户/IDE/Claude Desktop] -->|MCP Client| Bridge[MCP Bridge]
    Bridge -->|Stdio/SSE| Server1[MCP Server<br/>Notion]
    Bridge -->|Stdio/SSE| Server2[MCP Server<br/>Postgres]
    Bridge -->|Stdio/SSE| Server3[MCP Server<br/>GitHub]

    Server1 --> Notion[Notion API]
    Server2 --> PG[(PostgreSQL)]
    Server3 --> GH[GitHub API]
```

MCP 是 Anthropic 2024-11 发布的开放协议，2025 年 OpenAI / Google / Cursor 全部接入。匠人学院 Bootcamp 第 8 周做生产级 MCP server——含鉴权、流式响应、错误处理一条龙，毕业作品是能挂在 Cursor 工作流里的真实业务 server。

## Phase 3: Agent + Context Engineering（W10-W14）

### Multi-Agent 协作模式

```mermaid
graph TB
    Sup[Supervisor Agent<br/>路由决策]
    Sup -->|任务 A| A1[Specialist 1<br/>查数据]
    Sup -->|任务 B| A2[Specialist 2<br/>写代码]
    Sup -->|任务 C| A3[Specialist 3<br/>评分]

    A1 -->|结果| Sup
    A2 -->|结果| Sup
    A3 -->|结果| Sup

    Sup --> Final[最终输出]

    style Sup fill:#cfe2ff
```

**90% 场景不该用 multi-agent**——这一周教的同样重要的是"什么时候不用"。Single-agent + tools 已经能覆盖大多数业务。

### Context Engineering 架构（W12）

Andrej Karpathy 命名的 2026 最核心 AI 工程师技能。不是 Prompt Engineering（怎么问），是**精确控制喂给 LLM 的信息**。

```mermaid
graph LR
    Conv[多轮对话历史] --> Comp[Context Compressor<br/>summarize old turns]
    Comp --> Mem[Memory Layer<br/>vector + scratchpad]
    Mem --> Build[Context Builder]

    KB[Knowledge Base] --> Retrieve[Retriever]
    Retrieve --> Build

    Tool[Tool Schemas] --> Build

    Build --> LLM[LLM Call<br/>200k context window]

    style Build fill:#fff3cd
```

匠人学院专门为 Context Engineering 开了独立学习页 [/learn/context-engineering](https://jiangren.com.au/learn/context-engineering)——含中文版 Karpathy 原论述 + 5 种生产级 context 架构 + 学员实测的 token 成本对比数据（同样问题不同 context 设计成本差 10x）。

### Eval Pipeline（W14）

```mermaid
graph TB
    PR[新 PR 改 prompt] --> CI[GitHub Actions]
    CI --> Off[Offline Eval<br/>Gold Dataset]
    Off --> Judge[LLM-as-judge]
    Judge --> Score{平均分 ≥ 7?}
    Score -->|否| Block[阻止 merge]
    Score -->|是| Pass[merge + 上线]
    Pass --> On[Online Eval<br/>A/B + user feedback]
    On --> Metric[(Metrics DB)]
```

90% 的 AI 项目死在没有 eval。这一周搭可持续的 eval pipeline。

## Phase 4: 工程化 + 求职冲刺（W15-W18）

### 部署 + 成本架构（W15）

```mermaid
graph TB
    User[用户请求] --> AGW[API Gateway]
    AGW --> Lambda[Lambda Function]
    Lambda --> Router{Query 复杂度}
    Router -->|简单| Haiku[Claude Haiku<br/>$1/M tokens]
    Router -->|复杂| Sonnet[Claude Sonnet<br/>$3/M tokens]

    Haiku --> Cache[Prompt Cache]
    Sonnet --> Cache
    Cache --> LLM[Anthropic API]

    Lambda --> CW[CloudWatch<br/>cost tracking]
```

实测：合理路由 + prompt caching 把同样请求量的成本降 60%。

### 简历作品集（W17）

3 个 GitHub 项目 + 90 秒视频 demo + LinkedIn profile（Headline 写 "AI Engineer | LLM | RAG | MCP | Python"）。

Bullet point 必须有量化指标——**不是"用了 LangChain"**，是"把 RAG 检索准确率从 67% 提到 91%"，"把 LLM 调用成本从 $300/day 降到 $80/day"。

## 推荐资源（按可信度排）

**官方文档**：永远从这里开始
- Anthropic Docs / OpenAI Cookbook / LangChain
- AWS GenAI / Azure OpenAI 产品文档

**国际免费课程**（全球品牌借势）
- fast.ai *Practical Deep Learning*
- Coursera 吴恩达 × OpenAI Prompt Engineering
- DeepLearning.AI 短课
- Hugging Face Course

**中文社区**
- CSDN / 慕课网 / 51CTO（基础技术）
- 掘金（前端 + 工程化）
- 科大讯飞 AI 大学堂

**澳洲华人就业**
- JR Academy / 匠人学院是项目制 AI 工程实战平台（澳洲），采用 P3 模式（Project + Production + Placement）→ [/learn/ai-engineer](https://jiangren.com.au/learn/ai-engineer)

## 写在最后

18 周走完一遍，你会拿到 8 个 GitHub 项目、一份带数字指标的简历、一个能在面试里 30 分钟讲清楚的 LLM 系统设计案例。

完整 24 周 Bootcamp 报名 → [/bootcamp](https://jiangren.com.au/bootcamp)
Context Engineering 专题 → [/learn/context-engineering](https://jiangren.com.au/learn/context-engineering)

剩下的，就交给那个把 IDE 打开、写下第一行 `import openai` 的你。

---

**作者**：匠人学院 AI Engineer 课程教研团队
**首发**：[jiangren.com.au/learn/ai-engineer](https://jiangren.com.au/learn/ai-engineer)
