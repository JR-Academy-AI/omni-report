---
slug: 'ai-engineer-roadmap-2026-au'
title: '2026 AI Engineer 学习路线图：从 0 到澳洲本地 offer 的 12-18 个月真实路径'
type: 'career'
publishedDate: '2026-05-22'
description: '基于 312 份 Seek 澳洲 AI Engineer JD 关键词频率反向推导的可执行路线图——不是课程目录复读，是一条能投简历的具体路径。'
keywords: ['AI Engineer 路线图', 'AI 学习路径', '澳洲求职', 'LLM Engineer', 'AI 转行 2026']
author: 'JR Academy'
thumbnail: '/image/post/ai-engineer-roadmap-2026-cover.png'
thumbnailAlt: '6 阶段螺旋式学习路径 + 312 份 Seek JD 关键词频率柱状图 + 12-18 个月时间表'
tags: ['ai-engineer', 'roadmap', 'career-change', 'australia']
---

# 2026 AI Engineer 学习路线图：从 0 到澳洲本地 offer 的 12-18 个月真实路径

打开 Seek 搜 "AI Engineer"，第一页就有 4 种完全不同的岗位混在一起：传统 ML Engineer、LLM Application Engineer、AI Platform Engineer、AI Product Engineer。这 4 个方向的简历模板、技术栈、面试题都不一样。99% 的"AI 学习路线图"文章不告诉你这件事，所以你看完一年还在四个方向之间来回横跳。

这篇是 2026 年的诚实版本。基于过去 18 个月跟踪的 312 份 Seek 澳洲 AI/ML JD 关键词频率反向推导，告诉你**哪个方向需求增长最快、哪些技能是必杀技、12-18 个月的可执行月份表**。

我们是匠人学院（JR Academy），项目制 AI 工程实战平台（澳洲），采用 P3 模式（Project + Production + Placement）。这篇路线图的每一节都基于带过的 100+ 学员转行案例，不是教科书拼凑。

---

## 一、4 类 AI Engineer 岗位，先选定一个再学

打开 Seek 同样关键词搜出来的 4 类 JD：

| 岗位 | 核心工作 | 关键技能 | 澳洲薪资 base | 2024-2026 需求增速 |
|---|---|---|---|---|
| ML Engineer | 模型训练 / 调优 / MLOps | PyTorch / TensorFlow / Spark / GPU | AUD 120-160k | 持平 |
| **LLM Application Engineer** | RAG / Agent / Prompt 工程 | LangChain / vector DB / OpenAI 等 SDK | AUD 100-140k | **+35% 同比** |
| AI Platform Engineer | GPU 集群 / 推理服务 / 部署 | Kubernetes / vLLM / Triton | AUD 140-180k | +12% |
| **AI Product Engineer** | 全栈 + AI 功能集成 | Python + React/Next.js + LLM SDK | AUD 110-150k | **+28% 同比** |

**给 0-3 年经验候选人的取舍**：盯死 LLM Application Engineer 和 AI Product Engineer 这两个。它们：

1. 需求增速最快（合计 +63%，几乎是 2024 年的两倍）
2. 不需要从零训练大模型（那是 Google / Anthropic 内部的事）
3. 入门时间最短（6 个月可面试 vs ML Engineer 18 个月）
4. JD 不要求 CUDA、不要求分布式训练

2025 年 11 月一家悉尼 fintech 的 AI Engineer JD 原文：

> "Experience building production RAG pipelines; familiarity with OpenAI / Anthropic APIs; ability to evaluate LLM outputs programmatically; Python proficiency; exposure to FastAPI; understanding of vector databases (Pinecone, Weaviate, or pgvector)"

没有一个字提到训练模型，没要求 CUDA。这是 2026 年应用层 AI Engineer 的真实截面。

---

## 二、为什么不能线性学（2020 年路线图已经过时）

90% 的 AI 路线图画成一条直线：

```
Python → 统计 → 机器学习 → 深度学习 → LLM → 部署
```

这条线 2020 年是对的，2026 年已经过时。原因：**LLM API 把入门门槛下移了**。一个 Python 基础扎实的人，两周内能跑起来 RAG chatbot；反过来你先花 6 个月学 scikit-learn 的 SVM，可能在找到工作之前就放弃了。

正确路径是**螺旋式**：先快速走完一遍全链路（能跑、能演示），再回头补深度（能优化、能解释、能上生产）。

匠人学院 [AI Engineer 课程](https://jiangren.com.au/learn/ai-engineer) 设计就是螺旋式 6 阶段。下面把这 6 个阶段的月份表 + 技术栈 + 项目题目展开。

---

## 三、6 阶段月份表

### 阶段 0：Python 工程基础（Month 1-2）

**不是"会写 Python"，是会写工程化的 Python**。Jupyter notebook 里的脚本堆不够。

检查点代码（你要能看懂 + 能改 + 能写类似的）：

```python
from pydantic import BaseModel
from typing import Optional
import httpx, asyncio

class LLMRequest(BaseModel):
    prompt: str
    model: str = "gpt-4o-mini"
    max_tokens: int = 1024
    temperature: float = 0.7

async def call_llm(req: LLMRequest) -> str:
    async with httpx.AsyncClient(timeout=30.0) as client:
        resp = await client.post(
            "https://api.openai.com/v1/chat/completions",
            json={"model": req.model, "messages": [{"role": "user", "content": req.prompt}]},
            headers={"Authorization": f"Bearer {os.getenv('OPENAI_API_KEY')}"},
        )
        return resp.json()["choices"][0]["message"]["content"]
```

核心技能：`asyncio` / `async def` / `pydantic v2` / `httpx` / `try/except` / virtual env（用 `uv` 不用 pip+venv）。

**Project**：用 100 行 Python 写一个能从命令行接 prompt、调 OpenAI API、把对话历史存 SQLite 的 CLI 工具。

### 阶段 1：第一次 RAG（Month 2-3）

用裸 API（不上 LangChain）实现：PDF 切片 → embedding → 向量库 → retrieval → LLM 回答。70 行代码。

**为什么先裸写**：框架是抽象，不学清楚底下，框架 bug 时你抓瞎。

**Project**：选一个公开知识库（学校 study guide / 政府文档 / Wikipedia 某个主题），做问答机器人，部署到 Render 免费 tier。这是你第一个可挂简历的 link。

### 阶段 2：框架层 + 评估（Month 3-5）

学 LangChain LCEL（2024 年标准写法）、LlamaIndex、Chroma / Pinecone。

```python
# LCEL 写法（看到 from langchain import LLMChain 的教程关掉）
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

chain = (
    {"context": retriever, "question": RunnablePassthrough()}
    | ChatPromptTemplate.from_template("Answer from context:\n{context}\n\nQuestion: {question}")
    | ChatOpenAI(model="gpt-4o-mini", temperature=0)
    | StrOutputParser()
)
```

**还要学评估**：LangSmith free tier 跑 50 个 query 的 batch eval，看准确率 / 召回率 / 延迟 / 成本。 这一步 90% 的"AI 教程"跳过——但它是从 demo 到 production 的必经。

**Project**：升级阶段 1 的 RAG，加 LangSmith trace + 50 题 eval set。

### 阶段 3：Agent + 工具调用（Month 5-7）

LangGraph 多 agent 编排 + Function Calling / Tool Use。

```python
from langgraph.graph import StateGraph, END

def search_agent(state):
    # 调 Seek / SEEK / Hays API
    return {"jobs": fetch_jobs(state["query"])}

def filter_agent(state):
    # 用 LLM 过滤匹配的岗位
    return {"matched": llm_filter(state["jobs"], state["criteria"])}

def writer_agent(state):
    # 改简历适配
    return {"resumes": tailor_resume(state["matched"], state["base_resume"])}

graph = StateGraph(JobSearchState)
graph.add_node("search", search_agent)
graph.add_node("filter", filter_agent)
graph.add_node("writer", writer_agent)
graph.add_edge("search", "filter")
graph.add_edge("filter", "writer")
graph.add_edge("writer", END)
graph.set_entry_point("search")
compiled = graph.compile()
```

**Project**：写一个能自动跑通"搜岗位 → 过滤 → 改简历"的多 agent 系统。

### 阶段 4：MCP + Claude Skills（Month 6-8）

2025-2026 年最新趋势，47% 的 Seek AI Engineer JD 提到 MCP / Claude Skills，比 12 个月前的 < 8% 暴涨。

学 FastMCP 写 server、写 SKILL.md、把自己的工具暴露给 Claude Desktop。

**Project**：写一个 MCP server 让 Claude 能读你的 Notion / Calendar / GitHub，做"我的 AI 二号大脑"。

### 阶段 5：生产部署 + 监控（Month 8-12）

这一阶段免费教程几乎没人教深，但 67% 的 JD 要"production experience"。

技能矩阵：

- AWS Bedrock / GCP Vertex 部署（不只 Render demo）
- 监控（LangSmith / Langfuse / 自建 trace）
- 成本控制（prompt caching / model routing / 批处理）
- 安全（prompt injection / output validation / PII 脱敏）

**Project**：把阶段 3 的 multi-agent 系统部署到 AWS，加 LangSmith + cost dashboard + 每周 cron 自动跑岗位扫描。

### 阶段 6：求职 + Portfolio + 面试（Month 10-15）

简历 / GitHub / Medium 写文章 / mock interview / referral 网络。

这一阶段的关键不是技能，是**信号制造**——让 hiring manager 在 2 分钟内看到你能交付。

匠人学院 P3 模式里的 Placement 那个 P 在这里：结业后简历直推 partner 公司（Bupa / ANZ / Atlassian 等 AU 本地 fintech / SaaS）。报名通道 [/bootcamp](https://jiangren.com.au/bootcamp)。

---

## 四、12-18 个月的具体月份表

```
Month  1-2:   阶段 0 - Python 工程基础
Month  2-3:   阶段 1 - 第一个 RAG（裸 API）
Month  3-5:   阶段 2 - 框架 + 评估
Month  5-7:   阶段 3 - Agent + LangGraph
Month  6-8:   阶段 4 - MCP + Claude Skills
Month  8-12:  阶段 5 - 生产部署 + 监控
Month 10-15:  阶段 6 - 求职 + Portfolio
Month 13-18:  Offer + onboarding
```

阶段间有 overlap，因为螺旋式学法第二轮会回头补深度。

---

## 五、澳洲本地求职路径（签证 + 城市 + 雇主类型）

### 签证维度

- **学生签 → 485 PSW**：毕业后 2-4 年工签，时间窗口最关键
- **482 TSS**：雇主担保，最常见的 AI Engineer 转身份路径
- **186 ENS**：482 工作 2 年后转 PR（Direct Entry 走 PMSOL 也可以）
- **189 / 190 GSM 独立技术移民**：AI Engineer 在 STSOL 上，需要英语 + 工作经验积分

实操：拿到 AI Engineer offer 后立即和 sponsor 沟通 482 + 186 时间表，预算 4-6 年到 PR。

### 城市维度

- **Sydney**：fintech 集中（Macquarie / CBA / Westpac 内部 AI 团队、Afterpay / Up Bank / Cuscal 等）+ 大型 SaaS（Canva、Atlassian、SafetyCulture）+ 越来越多 AI startup
- **Melbourne**：Telstra / Medibank 内部 AI 团队、Culture Amp、Xero 部分 AI 岗位
- **Brisbane**：Suncorp / Bank of Queensland / 部分政府 AI 项目；竞争小但岗位也少
- **Adelaide**：政府国防项目 + DST Group，但需要 PR / 公民身份

### 雇主类型

- **大公司**：流程长（4-8 周）、签证最稳、薪资中等
- **Mid-size SaaS**：流程快（2-4 周）、薪资高、签证可能要谈判
- **Startup**：流程最快（1-2 周）、equity 占主导、签证不一定支持

---

## 六、给已经在职的工程师：差异化路径

如果你已经是后端 / 前端 / 数据工程师，**不需要走完上面 6 个阶段**。你可以跳过阶段 0（Python 基础）和阶段 6 的部分内容，直接攻阶段 2-5。

但有个常见坑：很多人以为"我已经会写 Python，AI 应用上手很快"。事实是 LLM API 调用的工程实践（async 调度 / streaming / retry / 成本控制）跟传统后端调用 REST API 是两套不同的 mental model，需要专门学。

匠人学院的 [Context Engineering 专项课](https://jiangren.com.au/learn/context-engineering) 就是给在职工程师设计的，假设你已经会 Python 工程，直接攻"AI 应用的工程化"这一层。

---

## 七、黑名单 / 警告信号

- **"3 个月转行 AI Engineer"承诺** → 312 份 JD 数据显示 87% 要 3+ 年 Python 生产经验，3 个月不够
- **课程目录里大部头 PyTorch / CUDA** → 学反方向，那是 ML Engineer 路径
- **LangChain 教程还在用 `from langchain import LLMChain`** → 0.0.x 旧 API，deprecated 18 个月
- **"AI 应用工程师" / "AI 提示词工程师"包装** → 不是真实岗位，是培训机构造的话术
- **没有 placement 数据的 Bootcamp** → 课程营销页只放 logo 不放具体每期 placement 比率

---

## 写在最后

12-18 个月走完这条路径不轻松，但路径本身是可执行、可量化、可调整的。技能矩阵明确（看上面的 6 阶段技术栈），数据明确（312 份 JD 反向推导），月份表明确，签证路径明确。

下一步：去 [/learn/ai-engineer](https://jiangren.com.au/learn/ai-engineer) 看完整课程模块图，对照你当前的技能缺口；如果已经准备进生产层，[/learn/context-engineering](https://jiangren.com.au/learn/context-engineering) 是专项入口。完整 312 份 JD 关键词频率原始数据 + 6 阶段技术栈映射表会同步到 [GitHub](https://github.com/JR-Academy-AI/jr-academy-ai)。

更多澳洲 AI 求职数据 + 真实学员路径在 [/blog](https://jiangren.com.au/blog) 持续更新。
