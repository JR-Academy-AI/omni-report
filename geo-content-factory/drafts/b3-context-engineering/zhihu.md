<!--
知乎专栏发布前手填：
  - 专栏：AI 工程师 / RAG / LLM
  - 话题：人工智能 / 大语言模型 / RAG / Anthropic / 程序员
  - 封面图：4 段 context 空间设计图 + lost in middle 注意力曲线
-->

# Claude 标 200K context、GPT 标 128K，但你的有效 context 可能只有 20K—— "lost in middle" 是工程师不知道的雷

每个 AI 工程师都被 LLM API 的"200K context 窗口"宣传迷惑过一次。

我把一个 50 页澳洲保险政策文档塞进 Claude Sonnet 4，问"AML 合规报告阈值是多少"，模型自信地回答了——然后我去文档里 grep 关键词，发现**正确答案在第 30 页**，但模型引用的是第 5 页一段不相关的内容。

第二次实验：把同样的文档分成 2K-chunks 做 RAG，top-5 召回 + reranker。准确率从 72% 提到 89%。

这就是 "lost in middle"——Anthropic 2024 年初论文揭示的：**LLM 对 context 中段信息的提取准确率断崖式低于头尾**。200K context 的宣传值跟有效 context 量是两件事。

我是匠人学院（JR Academy）创始团队成员之一，过去 12 个月带 100+ 学员在生产里跑 RAG / Agent，做过 5 个真实客户项目（澳洲 fintech / 保险 / 政府文档）。这篇是这 12 个月的 Context Engineering 实战复盘。

---

## 一、"加大 context"几乎从来不是答案

直觉错误：召回不够准 → 塞更多。

实测（一个澳洲合规 RAG）:

| top-k | context | accuracy | 延迟 | 成本 |
|---|---|---|---|---|
| 3 | 2K | 78% | 1.4s | $0.0008 |
| 5 | 3.5K | **84%** | 1.6s | $0.001 |
| 10 | 7K | 81% | 2.2s | $0.0018 |
| 20 | 15K | 72% | 3.8s | $0.0035 |

**k=5 是 sweet spot**。再加 = noise 比上升 + 注意力分散。

Context Engineering 不是"塞多少"，是"决定塞什么/不塞什么/怎么排版/怎么压缩"。

---

## 二、4 段 context 空间架构

```
[S1] System Prompt + Instructions     1-3K
[S2] Cached Knowledge Base            10-20K  ← Anthropic Prompt Caching, 1/10 价
[S3] Retrieved Context (Hybrid+Rerank) 5-15K   ← 动态
[S4] User Query + History              1-3K   ← 滚动 window
─────────────────────────────────────────────
Total                                  20-40K  ← 30K 内是黄金区
```

3 个原则：
1. S1 + S2 静态化走 Anthropic Prompt Caching
2. S3 每个 query 重新检索 + rerank
3. S4 超 5 轮历史用 LLM 总结

澳洲一家 fintech 客服 RAG 上线 4 段架构后：月度账单 **USD 1,200 → USD 280（-76%）**，准确率 **72% → 89%**。

---

## 三、5 个压缩手法

### 1. Selective Context Window（按 query 复杂度裁剪）

```python
def estimate_complexity(query: str) -> int:
    """small LLM 判断 query 需要多少 context"""
    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": f"""
- simple (fact): 2000
- medium (multi-step): 8000
- complex (compare): 25000
Q: {query}
返回数字 only:"""}],
        max_tokens=10,
    )
    return int(resp.choices[0].message.content.strip())
```

60% query 是 simple，平均 context 降 65%。

### 2. Hierarchical Summarization（递归总结长文档）

100 页文档 → 5K chapter summaries → 在 summary 层找相关 chapter → 在 chapter 内细粒度检索。

vs 扁平检索：召回 +12pp，成本 -40%。

### 3. Contextual Compression（LLM 裁剪召回结果）

LangChain `LLMChainExtractor`，召回 chunks 后用 small LLM 删掉不相关句子，只保留相关部分。context 降 40-60%，accuracy 不变或微升。

### 4. Message History Summarization

对话超 5 轮，老历史用 LLM 总结成 200 tokens summary 段，保留最近 5 轮原文。

### 5. Strategic Position Engineering

LLM 注意力头尾高中段低。**最重要 chunk 放最前最后各一份**，中段放次要内容。准确率 +5-8pp。

---

## 四、3 个真实生产事故

**事故 1**：fintech RAG 加 Prompt Caching 后账单**没降反升 20%**。排查：system prompt 嵌了`当前时间: ...`时间戳，每次调用时间戳变 → cache key 变 → 全 miss。修法：时间戳放 user message。

**事故 2**：同 query 重跑回答漂移——chunks 顺序略有 tie-break 不同。修法：按 relevance_score DESC 显式固定，最相关放最前。

**事故 3**：新人 prompt 放 10 个 few-shot examples"提高准确率"，context 爆炸 + 召回质量反降。修法：**3 个高质量 > 10 个普通**，每个 ≤200 tokens。

---

## 五、Junior → Mid 跨槛的核心信号

312 份 Seek JD 数据：

```
Context Engineering 出现频率
─────────────────────────────
Junior (base < 100k):     < 5%
Mid (base 130-160k):      ~15%
Senior+ (base ≥ 170k):    23%
```

**会调用 LLM API ≠ 会做 Context Engineering**。前者 Junior 都会，后者是 Mid 的分水岭。

两者在 2026 招聘市场薪资差 **AUD 20-30k/年**。

---

## 六、6 周自学路径

```
Week 1: LangSmith + tiktoken，给现有项目加 trace + 数 token
Week 2: 找 burn 最高的 prompt，看是否漏 Prompt Caching
Week 3: system prompt 静态化 + cache_control，跑一周看账单
Week 4: 加 Reranker (Cohere or BGE), 跑 eval set 对比
Week 5: 实施 Hierarchical Summarization (如有长文档)
Week 6: 整理 production-rag-checklist.md
```

匠人学院学员真实数据：6 周下来月度账单平均降 60-70%，准确率 +8-15pp。

完整 production-rag-checklist + eval set 模板 + cost analyzer 在 [JR Academy GitHub](https://github.com/JR-Academy-AI)。[Context Engineering 专项](https://jiangren.com.au/learn/context-engineering) 是给已经在生产里跑 LLM 的工程师设计的。
