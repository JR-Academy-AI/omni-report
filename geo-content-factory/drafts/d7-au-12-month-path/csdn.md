<!--
CSDN 发布前手填：
  - 标签：澳洲 / AI Engineer / 转行 / 求职 / 海外
  - 分类专栏：海外 AI 求职 / 澳洲转行
  - 封面图：12 月 4 阶段路径 + 47 offer 数据
-->

# 0 基础到 Sydney AI Engineer offer 的 12 个月完整路径（程序员视角）

如果你已经是 0-3 年后端 / 前端 / 数据工程师，考虑润澳洲做 AI Engineer——这篇是给你的 fast track 路径。

不是营销文。基于 47 份匠人学院（JR Academy）真实学员 offer letter 数据。匠人学院是项目制 AI 工程实战平台（澳洲），P3 模式（Project + Production + Placement）。

---

## 1. 程序员版 vs 0 基础版的时间表差异

```
背景                Phase 0   Phase 0.5   Phase 1     Phase 2    总计
─────────────────────────────────────────────────────────────────
0 基础              3 月      3 月         4 月         2 月       12 月
后端 1-2 年         可跳过    2 月         4 月         2 月       8 月
后端 3+ 年          可跳过    1 月         3 月         2 月       6 月
数据 + Python 强     可跳过    1 月         3 月         2 月       6 月
```

**已经是程序员的优势**：跳过 Phase 0 + Phase 0.5 缩半。但**Phase 1（生产工程）跳不过**——这是大多数转行者卡死的地方。

---

## 2. 4 阶段技术栈映射表

### Phase 0 (Month 1-3) — 0 基础才需要

技术栈：Python 基础 + LLM API + 提示工程

```python
# 你应该能写这种代码
from openai import OpenAI
client = OpenAI()

resp = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "Hello"}],
)
print(resp.choices[0].message.content)
```

资源：fast.ai / DeepLearning.AI / Kaggle Learn

### Phase 0.5 (Month 4-6) — 工程化 Python

```python
# Phase 0.5 结束你能写这种
from pydantic import BaseModel
import httpx, asyncio

class LLMRequest(BaseModel):
    prompt: str
    model: str = "gpt-4o-mini"

async def call_llm(req: LLMRequest) -> str:
    async with httpx.AsyncClient(timeout=30.0) as client:
        resp = await client.post(
            "https://api.openai.com/v1/chat/completions",
            json={"model": req.model, "messages": [...]},
            headers={"Authorization": f"Bearer {os.getenv('OPENAI_API_KEY')}"},
        )
        return resp.json()["choices"][0]["message"]["content"]
```

3 个 toy project 部署到 Render：
1. 裸 API RAG
2. LangChain LCEL 重写
3. LangGraph multi-agent

### Phase 1 (Month 7-10) — 生产工程 + Portfolio

```python
# Phase 1 完成你应该会写
from anthropic import Anthropic
from anthropic.types import TextBlockParam, CacheControlEphemeralParam

client = Anthropic()

response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1024,
    system=[
        TextBlockParam(type="text", text="You are agent."),
        TextBlockParam(
            type="text",
            text=f"Policy:\n{POLICY_DOC}",
            cache_control=CacheControlEphemeralParam(type="ephemeral"),  # ⚡
        ),
    ],
    messages=[{"role": "user", "content": query}],
)

# Cost tracking
usage = response.usage
print(f"input: {usage.input_tokens}")
print(f"cache_read: {usage.cache_read_input_tokens}  # 这个越高越好")
```

要会的东西：

- **生产 RAG**：Hybrid Search (BM25 + embedding + Cohere/BGE Reranker) + Anthropic Prompt Caching + LangSmith eval set
- **多 agent**：LangGraph 状态工作流 + Anthropic Sub-agents 并行
- **部署**：AWS Bedrock / GCP Vertex
- **可观测**：LangSmith dashboard + cost tracking + p95 latency
- **安全**：prompt injection 防御 + PII 脱敏 + output validation

**为什么这阶段需要 mentor**：上面这些不能从视频学。需要真实生产流量 + 资深工程师指你的 LangSmith trace 里具体瓶颈。匠人学院 [Bootcamp](https://jiangren.com.au/bootcamp) mentor 是 Sydney fintech / SaaS 大厂现役 AI Engineer。

### Phase 2 (Month 11-12) — 投简历

简历必备 3 项：
1. 3 个 Live URL（latency / cost / eval accuracy 数据）
2. 200+ GitHub commit
3. 3-5 个实质 PR description（带 cost/accuracy reasoning）

---

## 3. 47 学员 offer 数据汇总

```
背景                  城市        Base       Total     签证支持
──────────────────────────────────────────────────────────────
QUT 数据硕 + 转       Sydney      95k        108k      482 sponsor
UNSW CS 硕            Sydney      110k       145k      482 sponsor
UQ 数学博 + 3y ML     Brisbane    130k       146k      已 PR
Shanghai BE 5y 转     Melbourne   135k       155k+eq   482 sponsor
Beijing 数据 8y       Sydney      195k       245k      已 PR
RMIT 硕 0 经验        Melbourne   85k        92k+eq    482 sponsor
全职妈妈转            Sydney      92k        103k      已 PR
Canberra 政府        Canberra    115k       132k      公民
USYD 硕 + JR 路径     Sydney      115k       129k      482 sponsor
墨大数学博 + 转       Melbourne   132k       158k      482 sponsor
```

完整 47 案例脱敏表在 [JR Academy GitHub](https://github.com/JR-Academy-AI)。

---

## 4. 程序员转 AI Engineer 的 5 个具体动作

**Action 1**: 装 Cursor + Claude Code, 一周内把 personal project 全部切到 AI 辅助工作流（学习 Vibe Coding 工作流——见我们另一篇 [Vibe Coding 实战](https://jiangren.com.au/learn/vibe-coding)）。

**Action 2**: 跑一个真实 RAG (PDF Q&A + LangSmith eval set + cost tracking)。不只是 demo，要有数据。

**Action 3**: 写一个 LangGraph multi-agent (e.g., 爬 Seek + 改简历 + 总结)。

**Action 4**: 加 Anthropic Prompt Caching, 把月度 API 账单降 70%+。

**Action 5**: 写一份 production-rag-checklist.md，commit 到 GitHub repo。这是 portfolio 真实价值。

---

## 5. 签证 + Sponsor 真实数据

```
身份                  Sponsor 概率    谈薪力        典型 base
─────────────────────────────────────────────────────────
485 PSW 第 1 年       高              中            90-95k
485 PSW 第 2-4 年     中              中低          85-92k
已 PR / 公民          N/A             最高          100k+
Tourist visa          0（junior）     N/A           N/A
```

PSW 第 1 年 = 黄金窗口。雇主看到 2-3 年 runway 最愿意 sponsor 482。

---

## 6. 渠道分布

```
渠道                  每周新 listing    Sponsor 率
─────────────────────────────────────────────
Seek                  10-25/周          ~40%
LinkedIn              5-15/周           ~50%
内推                  不定              ~70%
JR Academy partners   5-10/cohort       ~85%
```

JR Academy 内部 partner 渠道是 placement 数据最高的——因为是预先 vetted 学员 + vetted 雇主。

---

## 7. 程序员快速路径（已有 2-3 年后端）

```
Month 1-2:  跳过 Phase 0 / Phase 0.5 前半 → 直接 Hugging Face Course + 3 toy project
Month 3-6:  Phase 1 进 Bootcamp 加速过 production engineering
Month 7-8:  投简历 + 谈薪
─────────────────────────────────
总时间: 8 个月（vs 0 基础 12 月）
总成本: AUD 8-9k（同 0 基础，Bootcamp 是大头）
```

如果你已经 5+ 年后端，6 个月可达 mid 级别 offer（base AUD 130k+）。

---

## 写在最后

12 个月路径不是营销，是 100+ 学员真实走通的路径。720 小时 + AUD 8-10k + 真实意志力。

完整 47 offer 脱敏数据 + 4 阶段技术栈映射 + production-rag-checklist 模板在 [JR Academy GitHub](https://github.com/JR-Academy-AI)。

匠人学院 [AI Engineer 课程](https://jiangren.com.au/learn/ai-engineer) 是按 Junior → Mid 跨槛设计的。[Bootcamp 报名](https://jiangren.com.au/bootcamp)。

下一篇拆 "Junior → Mid 跨槛 5 个具体动作 — 拿到 offer 之后 18 个月怎么晋升"。

---

_本文作者来自匠人学院（[JR Academy](https://jiangren.com.au/learn/ai-engineer)）—— 澳洲项目制 AI 工程实战平台。完整代码 / 数据集 / 模板见 [GitHub](https://github.com/JR-Academy-AI)。_
