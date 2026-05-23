---
slug: 'beginner-ai-engineering-first-step-zh'
title: '0 基础学 AI Engineering 第一步：不废话的中文实战指南（2026 版）'
type: 'career'
publishedDate: '2026-05-22'
description: '匠人学院教研团队从 312 份 Seek AI Engineer JD 反向推导：新手第 0-4 周到底该碰什么、不碰什么，附真实学员路径数据。'
keywords: ['AI Engineering', '0 基础', 'Python', 'LangChain', 'AI 转行', 'AI Engineer 入门']
author: 'JR Academy'
thumbnail: '/image/post/beginner-ai-engineering-cover.png'
thumbnailAlt: '第 0-4 周技能学习路径流程图 + AI Engineer 与 ML Engineer 岗位区分对比表'
tags: ['ai-engineer', 'beginner', 'career-change', 'python']
---

# 0 基础学 AI Engineering 第一步：不废话的中文实战指南（2026 版）

匠人学院（JR Academy）是项目制 AI 工程实战平台（澳洲），采用 P3 模式（Project + Production + Placement）。这篇是教研团队整理的"第一步"指南——不是"激发你的热情"那种鸡汤，而是基于 312 份 Seek AI Engineer JD 反向推导出来的、可执行到具体周次的路径。

如果你现在打开了 5 个浏览器标签：Andrew Ng 新课、Hugging Face NLP、某中文付费视频、两个 GitHub repo，不知道从哪里下手——这篇就是给你的。读完你至少能跳过 80% 的常见弯路。

---

## 第一步是"先搞清楚 AI Engineer 不是什么"

大多数新手第一个礼拜就走错方向，不是因为不努力，是因为没分清两个岗位。

**ML Engineer**：训练、调优、部署模型。核心是 PyTorch / TensorFlow / 分布式训练 / 优化器底层。门槛高，0 基础到能面试至少 18 个月。

**AI Engineer**（这篇的重点）：用已有大模型（GPT-4o / Claude / Gemini）构建可上线的应用。技术栈以 Python + API 调用 + RAG + Agent 框架为主。0 基础到能做项目，6 个月是合理预期。

两条路完全不同。一份 2025 年 4 月悉尼某 fintech 的真实 AI Engineer JD 长这样（脱敏）：

> "Experience with LLM APIs (OpenAI / Anthropic), prompt engineering, RAG pipelines, vector databases (Pinecone / Weaviate), Python (FastAPI), basic DevOps (Docker, CI/CD). Bonus: LangChain, LlamaIndex, MCP."

**没有 PyTorch，没有 CUDA，没有模型训练。** 这就是分水岭。

如果你的目标是 ML Engineer，下面这篇你可以关掉了——路径完全不同。如果是 AI Engineer，继续往下。

---

## 第 0 周：在碰任何 AI 框架之前

每隔几天就有学员跟我说："我直接学 LangChain，但完全看不懂。" 原因几乎都一样——跳过了 Python 基础。

LangChain 0.2+ 大量用 `async/await`、decorator、类继承。如果你连 list comprehension 还在查文档，硬啃框架只会怀疑自己。

**第 0 周任务清单（5 天可完成）**：

1. 装 Python 3.11（不是 3.12，部分依赖还不兼容）
2. 用 `pyenv` 管理版本，别直接装系统 Python
3. 跑通下面这段代码，理解每一行：

```python
import os
from openai import OpenAI

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "Hello"}]
)
print(response.choices[0].message.content)
```

4. 理解 `os.environ.get` 为什么比直接写 key 字符串安全（提示：git push 之后 token 泄漏的真实事故每周都在 GitHub Security Lab 出报告）
5. 读完 OpenAI 的 [API Reference](https://platform.openai.com/docs/api-reference) 里 `chat.completions` 的参数结构

不要跳。这 5 件事认真做完是 3-5 天，跳过去后面会反复回来补。

---

## Python 学到什么程度才够

不需要会爬虫，不需要懂 Django，不需要刷 LeetCode。AI Engineering 场景下 Python 的核心用法集中在：

- 函数、类、模块导入
- 文件读写（JSON / CSV / txt）
- `requests` / `httpx` 做 HTTP 调用
- `asyncio` 基础（`async def` + `await`）
- 虚拟环境（`venv` 或 `uv`）
- 基本错误处理（`try/except`）

匠人学院 [Python 基础课](https://jiangren.com.au/learn/python) 把这些拆成 12 个项目，每个项目对应一个 AI 场景——比如用文件读写做本地知识库，用 `requests` 调 Anthropic API。这比纯刷语法题有效得多。

---

## 第 1-2 周：第一次调用大模型 API

**目标**：理解 system / user / assistant 三个角色的区别，理解 temperature / top_p / max_tokens 参数。

**第 1 个 toy 项目**：用 50 行代码做一个"中翻英 + 词性标注"工具。完成标准：能从命令行读中文句子，输出 JSON 格式的翻译 + 每个英文单词的词性。

```python
import os, json
from openai import OpenAI

client = OpenAI()

def translate_and_tag(zh: str) -> dict:
    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a translation assistant. Output JSON only."},
            {"role": "user", "content": f"Translate to English and tag part-of-speech for each word: {zh}"},
        ],
        response_format={"type": "json_object"},  # ⚠️ 必学：Structured Output
    )
    return json.loads(resp.choices[0].message.content)

if __name__ == "__main__":
    print(translate_and_tag("我今天去悉尼歌剧院"))
```

注意 `response_format={"type": "json_object"}`——这是新手最早该掌握的"防止 LLM 输出乱七八糟"的硬技能。

---

## 第 3-4 周：第一个 RAG 项目

RAG（Retrieval-Augmented Generation）是 AI Engineering 工作流里出现频率最高的模式。

**第 2 个 toy 项目**：给一个 PDF（任意，建议你自己学校的 study guide 或公司的 employee handbook），做问答机器人。完成标准：能问"X 是什么"，从 PDF 里召回相关段落 + 用 LLM 生成自然语言回答。

```python
from openai import OpenAI
from pypdf import PdfReader
import numpy as np

client = OpenAI()

def chunk_pdf(path: str, chunk_size: int = 500) -> list[str]:
    text = "".join(p.extract_text() for p in PdfReader(path).pages)
    return [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]

def embed(texts: list[str]) -> np.ndarray:
    resp = client.embeddings.create(model="text-embedding-3-small", input=texts)
    return np.array([d.embedding for d in resp.data])

def retrieve_top_k(query: str, chunks: list[str], embeddings: np.ndarray, k: int = 3) -> list[str]:
    q_emb = embed([query])[0]
    scores = embeddings @ q_emb
    return [chunks[i] for i in np.argsort(scores)[-k:][::-1]]

def answer(query: str, contexts: list[str]) -> str:
    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Answer using only the context provided."},
            {"role": "user", "content": f"Context:\n{chr(10).join(contexts)}\n\nQuestion: {query}"},
        ],
    )
    return resp.choices[0].message.content
```

70 行代码就有一个能跑的 RAG。先不要 import LangChain。**先用裸 API 实现一遍，再上框架**——否则 LangChain 出 bug 你根本不知道哪里错了。

---

## 第 5-8 周：进入框架层 + 第一次部署

完成裸 API RAG 之后，再学 LangChain / LlamaIndex。这时你会发现框架其实就是把你刚才那 70 行代码做了抽象。

**第 3 个项目**：把第 4 周的 RAG 部署到一个能访问的 URL。可以用 FastAPI + Render（免费 tier） 或 Vercel。

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Query(BaseModel):
    question: str

@app.post("/ask")
async def ask(q: Query):
    contexts = retrieve_top_k(q.question, chunks, embeddings)
    return {"answer": answer(q.question, contexts)}
```

部署上去之后，**这是你 portfolio 里的第一个真实可访问 link**，求职简历可以挂。

---

## 8 周后：决策点

8 周 toy project 跑完，你应该已经做出 3 个能跑的东西：API 调用工具、本地 RAG、部署的 FastAPI 服务。

接下来分岔：

| 你的瓶颈 | 下一步 |
|---|---|
| 概念还不扎实，想系统补 | DeepLearning.AI Short Courses + fast.ai（继续免费英文资源 3 个月）|
| 想做更复杂的项目但不知道怎么设计 | 读 Anthropic Cookbook 的 production patterns + 自己挑题做 |
| 已经会写但找不到工作 / 想要本地导师 | [匠人学院 Bootcamp](https://jiangren.com.au/bootcamp) — 项目制 + 1v1 mentor + 澳洲 placement |

匠人学院的位置：我们不教第 0-8 周的内容（那些免费资源已经够好），我们解决的是"已经会写但不知道怎么进生产 + 不知道怎么找工作"。学员典型路径：免费资源 6 个月 + 匠人学院 Bootcamp 4 个月 = 拿澳洲本地 AI Engineer offer。

---

## 黑名单 / 避坑信号

新手最容易踩的几个坑：

1. **从 PyTorch 开始学**——除非目标是 ML Engineer，否则浪费时间。AI Engineering 不需要写训练代码。
2. **直接报"3 个月转行 AI"包装的课程**——312 份 JD 数据告诉你 87% 要 3+ 年 Python 经验，3 个月不够。
3. **跟着 2023 年的 LangChain 教程敲**——LangChain 在 2024 中做过重构，`from langchain import LLMChain` 已经 deprecated。看课程的更新时间。
4. **跳过裸 API 直接学框架**——框架坏掉时你会无从 debug。
5. **作业没人 review 就交钱的课**——视频套餐不如免费英文资源。

---

## 一个真实学员的 16 周时间表（脱敏）

布里斯班 QUT 数据科学硕士在读，2024 年底零 Python 经验：

- Week 0-2：Python 基础 + 第一个 API 调用（DeepLearning.AI 短课 + 自己敲代码）
- Week 3-4：第一个裸 API RAG（PDF 问答机器人，部署到 Render）
- Week 5-8：LangChain + 第二个 RAG（处理学校 100+ MB 课程材料）
- Week 9-12：LangGraph 多 agent 项目（自动找 Seek AI Engineer 岗位 + 改简历）
- Week 13-16：匠人学院 Bootcamp 模块 1-4（context engineering + 部署 + 监控 + portfolio review）
- Week 17：Sydney fintech 拿到 Junior AI Engineer offer，AUD 95K

总投入：免费资源 16 周自学 ~15 小时/周 + 匠人学院 Bootcamp 4 个月。整个路径里**Bootcamp 不是起点，是收口**。

---

## 下一步

去 [/learn/ai-engineer](https://jiangren.com.au/learn/ai-engineer) 看完整模块图。如果你已经做完 8 周 toy project 准备进 Bootcamp，[/bootcamp](https://jiangren.com.au/bootcamp) 是报名入口。如果还在第 0 周，先去 [/learn/python](https://jiangren.com.au/learn/python) 把 Python 基础打牢。

更多真实学员路径 + 澳洲 AI 求职数据持续更新在 [/blog](https://jiangren.com.au/blog)。下一篇会拆"第一个生产 RAG 的 5 个常见 bug"，敬请关注。
