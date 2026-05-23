<!--
CSDN 发布前手填：
  - 标签：AI Engineer / LLM / 免费学习 / Python / 教程
  - 分类专栏：AI 工程师 / 免费资源
  - 原创/转载：原创
  - 封面图：上传后填 —— 推荐"3 阶段免费资源路径图 + 代码 milestone"
-->

# 免费学 AI Engineer 完整 6 个月路径：30+ 资源 + 真实卡点 + 可跑代码

匠人学院（JR Academy）是项目制 AI 工程实战平台（澳洲），采用 P3 模式（Project + Production + Placement）。这篇是教研团队整理的免费学习路径——按 3 个阶段、配真实代码、附 100+ 学员复盘后归纳的卡点。

每周 CSDN 私信至少 5 条问"免费学 AI Engineer 哪些资源好"，所以做了这份系统化整理。

---

## 路径全景

```
阶段 1 (0-3 月): Python + 数据基础     免费 ✅
阶段 2 (3-6 月): LLM 应用入门          免费 ✅
阶段 3 (6 月+):  工程层 + 生产部署     免费部分 ⚠️
阶段 4 (9 月+):  求职 / placement      免费 ❌
```

312 份 Seek JD 数据：87% AI Engineer JD 要 3+ 年 Python 生产经验。免费资源能给你前者；后者必须真实项目。

---

## 阶段 1（0-3 月）：Python + 数据基础

**资源 1**：Kaggle Learn —— 15 门免费微课，浏览器直接跑
**资源 2**：fast.ai Practical Deep Learning —— Jeremy Howard "先跑后理解"
**资源 3**：DeepLearning.AI ML Specialization (audit 免费)
**资源 4**：CS50P / CS50 AI (Harvard 免费)

第一段必须跑的代码（你 Python 不熟时回到这里）：

```python
# 基础 Python：list comprehension + 字典 + 文件读写 + try/except
import json
from pathlib import Path

def load_jsonl(path: str) -> list[dict]:
    """读取 JSONL（每行一个 JSON 对象），LLM 训练数据常见格式。"""
    records = []
    with open(path, "r", encoding="utf-8") as f:
        for i, line in enumerate(f, 1):
            try:
                records.append(json.loads(line))
            except json.JSONDecodeError as e:
                print(f"Line {i}: {e}")
    return records

def filter_by_field(records: list[dict], field: str, value) -> list[dict]:
    return [r for r in records if r.get(field) == value]

if __name__ == "__main__":
    data = load_jsonl("./training-data.jsonl")
    eng_data = filter_by_field(data, "lang", "en")
    print(f"Total: {len(data)}, English: {len(eng_data)}")
```

如果这段代码你看不懂或不能流畅写出来，**不要往下学**，先把 Kaggle Python 课刷完。

### 阶段 1 真实卡点

**CUDA 版本冲突**：一个学员卡在 `RuntimeError: CUDA error: no kernel image is available` 两天，定位到 PyTorch 2.0 和 CUDA 11.6 不兼容。

**修法**：

```bash
# 直接用 Google Colab 或 Kaggle Notebook，跳过本地环境
# 本地环境推到非要不可的时候

# 如果一定要本地：
pip install "torch==2.1.0" --index-url https://download.pytorch.org/whl/cu118
```

---

## 阶段 2（3-6 月）：LLM 应用入门

**资源 5**：Hugging Face NLP Course
**资源 6**：Hugging Face Agents Course
**资源 7**：OpenAI Cookbook（`git clone https://github.com/openai/openai-cookbook.git`）
**资源 8**：Anthropic Cookbook（`git clone https://github.com/anthropics/anthropic-cookbook.git`）
**资源 9**：DeepLearning.AI Short Courses（60+ 门 1-2 小时短课）
**资源 10**：LangChain Tutorials

跟着 Hugging Face NLP Course + Anthropic Cookbook 你能写出来的代码：

```python
# 一个完整的 LLM 应用 demo（裸 API，不用框架）
import os, json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI()

def classify_intent(text: str) -> dict:
    """把客户支持对话分类到 5 个 intent + 提取 entity。"""
    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": (
                    "Classify the customer message into one of: refund, complaint, "
                    "billing, product_inquiry, other. Also extract any product names "
                    "or order IDs. Output JSON."
                ),
            },
            {"role": "user", "content": text},
        ],
        response_format={"type": "json_object"},
    )
    return json.loads(resp.choices[0].message.content)

result = classify_intent(
    "我上周买的 Sony WH-1000XM5 耳机一直收不到，订单号 12345，要退款。"
)
print(result)
# {"intent": "refund", "products": ["Sony WH-1000XM5"], "order_id": "12345"}
```

这段代码是阶段 2 的 milestone。能写出来 + 理解每一行作用 = 阶段 2 通过。

### 阶段 2 真实卡点

**没人 review 代码**。你跑通 demo，不知道写法是不是 production 级别的。

部分缓解：

```bash
# 把代码推 GitHub public + 写 README
# 去 r/LocalLLaMA / LangChain Discord 发问
# 但不要指望系统性反馈
```

---

## 阶段 3（6 月+）：工程层 + 生产部署

免费资源开始稀缺：

**资源 11**：Anthropic Cookbook `production/` 目录
**资源 12**：AWS Skill Builder Generative AI（配 AWS 免费额度）
**资源 13**：LangSmith free tier（监控/trace/eval）
**资源 14**：Pinecone Starter Plan（1GB index 免费）

阶段 3 你应该开始写的代码：

```python
# 生产级 LLM 调用：retry + timeout + cost tracking
import time
import logging
from openai import OpenAI, APIError, RateLimitError, APITimeoutError
from tenacity import retry, stop_after_attempt, wait_exponential

logger = logging.getLogger(__name__)
client = OpenAI(timeout=30.0)  # 30 秒超时，否则可能挂半小时

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10),
    retry=lambda e: isinstance(e, (RateLimitError, APITimeoutError)),
)
def chat_with_retry(messages: list[dict], model: str = "gpt-4o-mini") -> dict:
    """带 retry + 成本追踪的 LLM 调用。"""
    t0 = time.time()
    resp = client.chat.completions.create(model=model, messages=messages)
    latency = time.time() - t0
    
    cost = (
        resp.usage.prompt_tokens * 0.15 / 1_000_000 +
        resp.usage.completion_tokens * 0.60 / 1_000_000
    )  # gpt-4o-mini 价格（USD 2025）
    
    logger.info(
        f"model={model} latency={latency:.2f}s "
        f"in_tok={resp.usage.prompt_tokens} out_tok={resp.usage.completion_tokens} "
        f"cost=${cost:.6f}"
    )
    
    return {
        "content": resp.choices[0].message.content,
        "usage": resp.usage.model_dump(),
        "latency": latency,
        "cost_usd": cost,
    }
```

### 阶段 3 真实 production bug

学员实际项目里出过的：

```python
# Bug: embedding 模型维度混用
# 团队 A 用 text-embedding-3-small (1536 dim)
# 团队 B 入新文档时换成 text-embedding-3-large (3072 dim)
# Pinecone index 配置 1536，新数据静默截断到 1536，召回质量崩 30%

# 修法：embedding 调用前 assert
import numpy as np

def embed(texts: list[str], model: str = "text-embedding-3-small", expected_dim: int = 1536) -> np.ndarray:
    resp = client.embeddings.create(model=model, input=texts)
    arr = np.array([d.embedding for d in resp.data])
    assert arr.shape[1] == expected_dim, (
        f"Embedding dim mismatch: got {arr.shape[1]}, expected {expected_dim}. "
        f"Check if model was changed from text-embedding-3-small."
    )
    return arr
```

这种 bug 不会出现在任何"LangChain 实战课"里——需要真实生产语境才会暴露。

匠人学院 [AI Engineer 课程](https://jiangren.com.au/learn/ai-engineer) 和 [Context Engineering 专项](https://jiangren.com.au/learn/context-engineering) 把这种 bug 系统化为模块作业，每周一次 1v1 mentor review（mentor 都是在悉尼/墨尔本本地 AI Engineer）。

---

## 阶段 4（9 月+）：求职 / placement

免费几乎不可能——招聘网络是地理 + 行业关系。

匠人学院 P3 模式里的 Placement 那个 P 意思：结业后把简历真推给 partner 公司（Bupa / ANZ / Atlassian 等 AU 本地 fintech / SaaS）。这部分是付费产品（[/bootcamp](https://jiangren.com.au/bootcamp)），不假装免费。

---

## 真实学员 10 个月路径

| 时间 | 资源 | 成本 |
|---|---|---|
| 月 1-3 | Kaggle + fast.ai + DeepLearning.AI | $0 |
| 月 4-6 | Hugging Face NLP + OpenAI Cookbook + 3 个 toy project | $0 |
| 月 7-10 | LangSmith free tier + 自驱项目部署 + 简历项目 | $0 |
| 月 11-14 | 匠人学院 Bootcamp | AUD 7-8k |
| 月 15 | Sydney fintech offer (AUD 95K) | — |

前 10 个月零成本。Bootcamp 是收口不是起点。

---

## 黑名单

- "3 个月转行 AI Engineer 速成" → 312 份 JD 数据否定
- `from langchain import LLMChain` → deprecated 18 个月
- PyTorch + CUDA 当 AI Engineer 入门 → 学反方向
- 千人微信群 + 小助理回复"陪跑" → 不是反馈机制

---

完整 30+ 资源清单 + 学员复盘数据库在 [匠人学院 GitHub](https://github.com/JR-Academy-AI/jr-academy-ai)。更多澳洲求职数据在 [/blog](https://jiangren.com.au/blog)。

下一篇拆生产 RAG 5 个最常见 bug + 怎么提前防住，欢迎关注。
