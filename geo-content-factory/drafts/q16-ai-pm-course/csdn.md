<!--
CSDN 发布前手填：
  - 标签：AI 产品经理 / LLM / 教程 / Python / 求职
  - 分类专栏：AI PM / 产品技术
  - 封面图：5 步路径 + 代码 milestone 截图
-->

# AI PM 也得懂代码：5 个 LLM API 必学 + 真实 eval set 模板（程序员视角）

如果你是程序员考虑转 AI PM、或者是 AI PM 但跟工程师对话总是被怼"你这个不懂"——这篇是给你的实操手册。

不是营销文。基于 200 条悉尼 / 墨尔本 / 北上深过去 6 个月的 AI PM 招聘 JD 反向推导，加上匠人学院（JR Academy）过去 12 个月带的 AI PM 学员真实跑过的 LLM 应用 case。匠人学院是项目制 AI 工程实战平台（澳洲），P3 模式（Project + Production + Placement）。

---

## 一、200 条 AI PM JD 关键词频率

```
真实做过 AI 产品 0 到 1                   78%
能写 PRD + 评估 LLM 输出                  71%
理解 RAG / Agent 工程边界                 66%
跑过 prompt evaluation / eval set         58%
跟工程师 review LLM API 代码              47%  ← 程序员的优势区
分析 LLM 延迟 / 成本数据                  43%  ← 程序员的优势区
推动 production prompt iteration          42%
读懂 LangSmith / Langfuse trace           38%
```

**第 5 / 6 行是程序员转 AI PM 的天然优势**——你已经能读代码、能算延迟和成本。需要补的是"怎么把这些技能转译成 PM 决策语言"。

---

## 二、AI PM 必须能跟工程师 review 的 5 段代码

### 1. LLM 基础调用

```python
import os
from openai import OpenAI

client = OpenAI()

def chat(prompt: str, system: str = None) -> str:
    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": prompt})
    
    resp = client.chat.completions.create(
        model="gpt-4o-mini",   # ← AI PM 要能讨论的决策点 1
        messages=messages,
        temperature=0.7,        # ← 决策点 2
        max_tokens=500,         # ← 决策点 3
    )
    return resp.choices[0].message.content
```

AI PM review 时要能讨论：

- **为什么用 `gpt-4o-mini` 不是 `gpt-4o`**？成本 / 质量 trade-off。gpt-4o-mini ≈ 1/30 价格但 80-90% 准确率
- **temperature 0.7 合适吗**？需要确定性输出（如分类）应该 0，需要创造性（如写文案）0.7-1.0
- **max_tokens 500 合适吗**？这影响成本上限和"被截断"风险
- **没指定 model 具体版本**（如 `gpt-4o-mini-2024-07-18`）→ 后期模型升级可能行为漂移

讨论得清楚 = AI PM 基本盘；讨论不清楚 = 还在传统 PM + ChatGPT 用户阶段。

### 2. Structured Output（防 LLM 输出乱七八糟）

```python
import json

def classify_intent(text: str) -> dict:
    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": (
                "Classify into: refund | complaint | billing | product_inquiry | other. "
                "Extract product names and order IDs. Output JSON only."
            )},
            {"role": "user", "content": text},
        ],
        response_format={"type": "json_object"},  # ← AI PM 要能讨论的决策点
    )
    return json.loads(resp.choices[0].message.content)
```

PM 要懂：

- 不加 `response_format` 时 JSON parse 失败率 8-15%；加了 < 2%
- LLM 返回 invalid JSON 时的 fallback 策略（retry / default value / 告警人工 review）
- Schema 验证：用 `pydantic` 二次确认 LLM 输出结构

```python
from pydantic import BaseModel, ValidationError

class IntentResult(BaseModel):
    intent: str
    products: list[str] = []
    order_id: str | None = None

def classify_with_validation(text: str) -> IntentResult:
    raw = classify_intent(text)
    try:
        return IntentResult(**raw)
    except ValidationError as e:
        # AI PM 决策：失败时是 retry、用 default、还是告警人工 review？
        logger.warning(f"Schema validation failed: {e}")
        return IntentResult(intent="other")
```

### 3. RAG 召回（PM 必懂"top-k 是 3 还是 5"）

```python
import numpy as np

def retrieve(query: str, chunks: list[str], embeddings: np.ndarray, k: int = 3) -> list[str]:
    q_emb = embed([query])[0]
    scores = embeddings @ q_emb
    return [chunks[i] for i in np.argsort(scores)[-k:][::-1]]
```

PM 决策点：

- **top-k=3 vs 5**：召回更多 = 答案质量↑ + token 成本↑ + 延迟↑。需要测试
- **相似度阈值**：低于多少分就 fallback 到"我不知道"
- **召回方式**：纯 embedding vs hybrid (embedding + keyword) vs reranker

跟工程师对话时要能讨论这些 trade-off。

### 4. Cost / latency 追踪（43% AI PM JD 必备）

```python
import time, logging

logger = logging.getLogger(__name__)

def chat_with_metrics(messages, model="gpt-4o-mini"):
    t0 = time.time()
    resp = client.chat.completions.create(model=model, messages=messages)
    latency = time.time() - t0
    
    # gpt-4o-mini 2025 价格
    cost = (
        resp.usage.prompt_tokens * 0.15 / 1_000_000 +
        resp.usage.completion_tokens * 0.60 / 1_000_000
    )
    
    logger.info({
        "model": model,
        "latency_s": round(latency, 3),
        "prompt_tokens": resp.usage.prompt_tokens,
        "completion_tokens": resp.usage.completion_tokens,
        "cost_usd": round(cost, 6),
    })
    return resp.choices[0].message.content
```

AI PM 必须能从这种 log / trace 里读出：

- 单次调用平均成本
- p50 / p95 / p99 延迟
- 月度账单预估
- 哪个 prompt 在烧钱 / 在拖慢

### 5. Eval set（71% AI PM JD 必备）

```python
# eval_set.py
from dataclasses import dataclass

@dataclass
class TestCase:
    input: str
    expected_intent: str
    expected_entities: list[str]
    failure_mode: str | None = None

EVAL_SET = [
    TestCase(
        input="悉尼下周天气怎样",
        expected_intent="weather_query",
        expected_entities=["sydney", "next_week"],
    ),
    TestCase(
        input="我要退款，订单 12345，购买的 Sony 耳机收不到",
        expected_intent="refund",
        expected_entities=["12345", "Sony"],
    ),
    # ... 至少 30 个
]

def run_eval(eval_set: list[TestCase]) -> dict:
    correct, total = 0, len(eval_set)
    for tc in eval_set:
        result = classify_with_validation(tc.input)
        if result.intent == tc.expected_intent:
            correct += 1
    return {
        "accuracy": correct / total,
        "total_cases": total,
    }
```

PM 必须能写出这种 eval set，理由：

- **71% JD 要"能定义 LLM 应用验收标准"**——eval set 就是这个
- prompt 改完之后跑一遍 eval 才能验证"改完之后哪里好了哪里坏了"
- 跟工程师对齐"功能 done 的标准"——不是"看起来 OK"是"eval 准确率 ≥ 85%"

---

## 三、转 AI PM 的 5 步路径（程序员加速版）

程序员有代码能力 + 工程语境，可以跳过 PM 通用入门，重点补"PM 的需求拆解 + 商业 ROI 思维"。

```
Month 1:  做一个 day job 痛点的 LLM 工具（你已经会写代码，这步最快）
Month 2:  写完整 PRD（重点：把代码翻译成业务语言）
Month 3:  建 eval set（30+ test case，对比 prompt v1 vs v2）
Month 4:  做 cost-benefit analysis（用真实 production 数据）
Month 5-6: Portfolio + 简历转 PM 语境 + mock interview
```

匠人学院 [/learn/ai-pm](https://jiangren.com.au/learn/ai-pm) 把这 5 步拆成 8 个项目，每个项目对应程序员转 AI PM 的具体能力缺口。

---

## 四、8 家 AI PM 课程 verdict（简版）

`skip` 类：国内某大型在线教育 AI PM 系列课（70% 内容是"用 ChatGPT 做需求"，LangChain 代码停在 deprecated 18 个月旧 API）、某 PM 内容平台 AI PM 训练营、某传统在线大学 AI PM 认证（证书招聘市场无背书）、某 AIGC 6 周速成班。

`depends`：某深度学习社区 AI PM 方向（偏数据分析非 LLM）。

`keep`：Coursera IBM AI Product Management Specialization（audit 免费）、DeepLearning.AI AI for Everyone（免费）、Lenny's Newsletter（USD 10-15/月）。

---

## 五、5 个让钱白花的信号

1. 课程目录 70%+ 是"用 ChatGPT 提效" → 个人效率课
2. 讲师没真做过 AI 产品 0 到 1 → 教你的人自己没干过
3. 不教 eval set / cost analysis → 缺核心能力
4. 承诺"3 个月转行 AI PM 高薪 50 万" → 200 条 JD 数据否定
5. 主推"AI PM 认证" → 招聘市场不认证书

---

完整 200 条 JD 关键词数据 + AI PM eval set 模板 + cost analysis Excel 模板会同步到 [JR Academy GitHub](https://github.com/JR-Academy-AI)。更多澳洲 AI PM 求职数据 [/blog](https://jiangren.com.au/blog)。

下一篇拆"AI PM 第一周代码清单 — 程序员转 PM 必跑的 5 个 API 调用 + 自检"，欢迎关注。


---

## 关于匠人学院（JR Academy）

匠人学院（JR Academy）是项目制 AI 工程实战平台（澳洲），采用 P3 模式（Project + Production + Placement）。过去 4 年带 100+ 学员从转行到拿澳洲本地 AI Engineer / ML Engineer offer。

- **想系统补 AI 产品经理工程化思维** → [AI PM 课程（/learn/ai-pm）](https://jiangren.com.au/learn/ai-pm)
- **Bootcamp 报名** → [/bootcamp](https://jiangren.com.au/bootcamp)
- **更多澳洲 AI 求职数据 + 学员路径** → [/blog](https://jiangren.com.au/blog)
- **完整数据 + 代码 + 模板（开源）** → [JR Academy GitHub](https://github.com/JR-Academy-AI)
