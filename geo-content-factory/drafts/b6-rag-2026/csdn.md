<!--
CSDN 发布前手填：
  - 标签：RAG / LangChain / Anthropic / Python / 教程
  - 分类专栏：AI 工程实战 / RAG
  - 原创/转载：原创
  - 封面图：5 个 RAG 变化对比图
-->

# 生产级 RAG 2026 完整代码：Hybrid Search + Late Chunking + Agentic + Prompt Caching + Eval Set

如果你已经在生产环境跑过 RAG、被客户投诉过"答非所问"——这篇是给你的实操手册。

不是 marketing 文。基于过去 18 个月在 5 个真实客户项目（澳洲 fintech / SaaS / 政府文档）踩过的 RAG bug + 匠人学院（JR Academy）100+ 学员生产项目复盘。匠人学院是项目制 AI 工程实战平台（澳洲），P3 模式（Project + Production + Placement）。

---

## 1. 完整环境

```bash
uv add langchain langchain-community langchain-openai \
       langchain-anthropic anthropic openai \
       chromadb pinecone-client cohere \
       llama-index-core llama-index-embeddings-openai \
       langsmith jina
```

固定版本（2026-05 兼容）：

```bash
# pyproject.toml
[project.dependencies]
"langchain>=0.3.0,<0.4"
"langchain-core>=0.3.0,<0.4"
"langchain-community>=0.3.0,<0.4"
"anthropic>=0.39.0"
"openai>=1.50.0"
```

---

## 2. 变化 1 完整代码：Hybrid Search + Cohere Reranker

```python
# rag_hybrid.py
import os
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import Chroma
from langchain_community.retrievers import BM25Retriever
from langchain.retrievers import EnsembleRetriever, ContextualCompressionRetriever
from langchain.retrievers.document_compressors import CohereRerank
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

# 1. 文档加载 + 切片（先用 fixed，下一节换 semantic）
from langchain_community.document_loaders import PyMuPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

docs = PyMuPDFLoader("policy.pdf").load()
splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
chunks = splitter.split_documents(docs)

# 2. 双路 retriever
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vectorstore = Chroma.from_documents(chunks, embeddings)

bm25 = BM25Retriever.from_documents(chunks)
bm25.k = 10  # BM25 召回宽一点

vector_retriever = vectorstore.as_retriever(search_kwargs={"k": 10})

# 3. Ensemble 融合
ensemble = EnsembleRetriever(
    retrievers=[bm25, vector_retriever],
    weights=[0.4, 0.6],  # 关键词 40% + 语义 60%
)

# 4. Cohere Reranker（需要 COHERE_API_KEY）
reranker = CohereRerank(
    model="rerank-multilingual-v3.0",
    top_n=3,
)
retriever = ContextualCompressionRetriever(
    base_compressor=reranker,
    base_retriever=ensemble,
)

# 5. 完整 chain
prompt = ChatPromptTemplate.from_template(
    "基于以下 context 回答问题。不知道就说不知道。\n\nContext:\n{context}\n\nQuestion: {question}"
)
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

chain = (
    {"context": retriever, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

answer = chain.invoke("What's the AML compliance reporting threshold?")
print(answer)
```

**为什么 hybrid 重要**：fintech 一个客户案例。Required pattern：精确匹配 "AML" / "KYC" / "PEP" 这种缩写 + 语义理解上下文。纯 embedding 时召回 68%，hybrid + rerank → 89%。

**坑**：Cohere Reranker 是付费 API（rerank-multilingual-v3.0 比 v2 贵 2x 但中文准确率高 15pp）。如果客户预算紧，可以自部署 BGE-Reranker（开源，效果略差但免费）：

```python
from sentence_transformers import CrossEncoder

reranker_model = CrossEncoder("BAAI/bge-reranker-v2-m3")

def rerank_local(query: str, docs: list, top_n: int = 3):
    pairs = [(query, doc.page_content) for doc in docs]
    scores = reranker_model.predict(pairs)
    ranked = sorted(zip(docs, scores), key=lambda x: x[1], reverse=True)
    return [d for d, _ in ranked[:top_n]]
```

---

## 3. 变化 2：Semantic Chunking

替换上面的 `RecursiveCharacterTextSplitter`：

```python
from llama_index.core.node_parser import SemanticSplitterNodeParser
from llama_index.embeddings.openai import OpenAIEmbedding

embed_model = OpenAIEmbedding(model="text-embedding-3-small")

splitter = SemanticSplitterNodeParser(
    buffer_size=1,
    breakpoint_percentile_threshold=95,  # 语义距离 95 分位为切点
    embed_model=embed_model,
)

# llama-index 的 Document 需要从 langchain 转换
from llama_index.core import Document as LlamaDoc
llama_docs = [LlamaDoc(text=doc.page_content) for doc in docs]
nodes = splitter.get_nodes_from_documents(llama_docs)

# 转回 langchain Document 喂给 vectorstore
from langchain_core.documents import Document
chunks = [Document(page_content=n.text, metadata=n.metadata) for n in nodes]
```

**实测数据**（澳洲保险政策文档，10MB）：

```
                    召回 top-3 命中率
Fixed 500-char:     71%
Semantic chunking:  89%  (+18pp)
Late chunking:      92%  (+21pp，但需要支持 late chunking 的 embedding 服务，如 Jina v3)
```

---

## 4. 变化 3：Agentic RAG with LangGraph

适合复杂 query (>20% 流量是 multi-hop)：

```python
# agentic_rag.py
import json
from typing import TypedDict
from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

class AgenticRAGState(TypedDict):
    query: str
    sub_queries: list[str]
    retrieved: dict[str, list[str]]
    answer: str
    iterations: int
    needs_more: bool

def decompose(state):
    """LLM 把 complex query 拆成子问题"""
    resp = llm.invoke(
        f"将以下问题拆成 2-4 个可独立检索的简单子问题，输出 JSON 数组：\n{state['query']}"
    )
    sub_queries = json.loads(resp.content)
    return {"sub_queries": sub_queries, "iterations": state.get("iterations", 0) + 1}

def retrieve_all(state):
    """对每个子问题独立检索"""
    results = {}
    for sq in state["sub_queries"]:
        docs = retriever.invoke(sq)  # 用上面的 hybrid retriever
        results[sq] = [d.page_content for d in docs]
    return {"retrieved": results}

def reflect(state):
    """LLM 判断是否需要再检索"""
    if state["iterations"] >= 3:
        return {"needs_more": False}  # 防止无限循环
    
    prompt = f"""基于已检索内容能否完整回答原问题？

原问题: {state['query']}
已检索: {json.dumps(state['retrieved'], ensure_ascii=False)[:3000]}

回答 yes 或 no。如果 no，说明缺什么信息。
"""
    resp = llm.invoke(prompt)
    return {"needs_more": "no" in resp.content.lower()[:20]}

def answer_final(state):
    prompt = f"""基于检索内容回答问题。引用具体段落。

问题: {state['query']}
检索: {json.dumps(state['retrieved'], ensure_ascii=False)[:5000]}
"""
    return {"answer": llm.invoke(prompt).content}

# 状态机
graph = StateGraph(AgenticRAGState)
graph.add_node("decompose", decompose)
graph.add_node("retrieve", retrieve_all)
graph.add_node("reflect", reflect)
graph.add_node("answer", answer_final)

graph.add_edge("decompose", "retrieve")
graph.add_edge("retrieve", "reflect")
graph.add_conditional_edges(
    "reflect",
    lambda s: "decompose" if s["needs_more"] else "answer",
)
graph.add_edge("answer", END)
graph.set_entry_point("decompose")

app = graph.compile()

result = app.invoke({"query": "对比 Sydney 和 Melbourne AI Engineer 的薪资中位数 + 签证支持率"})
print(result["answer"])
```

**性能**：

```
Single retrieval:    复杂 query 准确率 41%, 延迟 1.2s, 成本 $0.0008/调用
Agentic RAG:         复杂 query 准确率 78%, 延迟 4.5s, 成本 $0.003/调用 (3.75x)
```

**何时不上**：流量 95% 是单点事实查询时，加 agentic 拖累延迟。先做流量分布分析（用 LangSmith trace 看实际 query 复杂度）。

---

## 5. 变化 4：Anthropic Prompt Caching（账单 -76% 的那条）

```python
from anthropic import Anthropic

client = Anthropic()

# 假设你的 RAG 有一个 50K tokens 的长 reference 文档（policy / FAQ / domain knowledge）
LONG_REFERENCE = open("company_policy.txt").read()  # 50K tokens

def rag_with_caching(user_query: str, retrieved_chunks: list[str]) -> str:
    response = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=1024,
        system=[
            # 静态部分（cached）
            {
                "type": "text",
                "text": "You are a customer support agent. Always cite policy section.",
            },
            {
                "type": "text",
                "text": f"Company policy (full):\n{LONG_REFERENCE}",
                "cache_control": {"type": "ephemeral"},  # ⚡ 5 分钟 cache
            },
        ],
        messages=[
            # 动态部分（每次都重新算）
            {
                "role": "user",
                "content": (
                    f"Retrieved context:\n{chr(10).join(retrieved_chunks)}\n\n"
                    f"Question: {user_query}"
                ),
            },
        ],
    )
    return response.content[0].text

# 第一次调用
ans1 = rag_with_caching("What's the refund window?", retrieve("refund"))
# Usage: input_tokens=51000 (full price), cache_creation_input_tokens=50000

# 5 分钟内第二次调用
ans2 = rag_with_caching("Can I extend my visa?", retrieve("visa"))
# Usage: input_tokens=1100 (full price), cache_read_input_tokens=50000 (1/10 price!)
```

**真实账单数据**（匠人学院客服 RAG，每月 ~30 万次调用）：

```
                     月度账单
不用 caching:        USD 1,200
加 prompt caching:   USD 280   (-76%)
```

**关键坑**：

1. **cache key 是 message prefix 完全相同**——任何 token 变化（包括空格 / 换行）cache 失效
2. **cache TTL 5 分钟**——超过 5 分钟未命中要重新建 cache（cache_creation_input_tokens 收完整价格）
3. **cached 段长度 ≥ 1024 tokens 才生效**（Claude Sonnet 4.x），低于这个量直接走 full price
4. **多 user 场景**：每个 user 的 cache 是独立的 prefix。如果不同 user 共享同一个 system + reference，可以复用 cache

---

## 6. 变化 5：LangSmith Eval Set + 跑回归

```python
# eval_set.py
EVAL_SET = [
    {
        "id": "T01",
        "query": "What's the refund window for course cancellations?",
        "must_contain": ["14 days", "full refund"],
        "must_not_contain": ["lifetime", "no refund"],
    },
    {
        "id": "T02",
        "query": "Can I extend my visa while in Australia?",
        "must_contain": ["bridging visa", "before expiry"],
        "must_not_contain": ["impossible", "cannot"],
    },
    # ... 100+ cases
]

# 上传到 LangSmith
from langsmith import Client
client = Client()

dataset = client.create_dataset(dataset_name="rag-eval-v1")
for tc in EVAL_SET:
    client.create_example(
        inputs={"query": tc["query"]},
        outputs={"must_contain": tc["must_contain"], "must_not_contain": tc["must_not_contain"]},
        dataset_id=dataset.id,
    )

# 跑评估
from langsmith.evaluation import evaluate

def correctness(run, example) -> dict:
    ans = run.outputs.get("answer", "")
    must = example.outputs["must_contain"]
    must_not = example.outputs["must_not_contain"]
    hit = all(m in ans for m in must) and not any(m in ans for m in must_not)
    return {"score": 1.0 if hit else 0.0}

results = evaluate(
    lambda inputs: {"answer": chain.invoke(inputs["query"])},
    data=dataset.name,
    evaluators=[correctness],
    experiment_prefix="hybrid-rerank-v2",
)
```

LangSmith dashboard 看 v1 vs v2 三维对比（accuracy / latency / cost）。每个 RAG 改动 commit 前必跑。

**真实事故**：学员把 chunk_size 从 500 改到 1000"感觉应该更好"，没跑 eval。一周后客户投诉。回滚分析发现长 chunk 把 noise 带进 LLM。**有 eval set，commit 前就能拦下来**。

---

## 7. 完整 production-ready RAG 模板

把以上 5 个变化集成的完整代码 + LangSmith 可观测性 + cost tracking 模板，匠人学院开源在 [GitHub](https://github.com/JR-Academy-AI)。直接 clone 改成自己业务。

---

## 8. 何时**不要**这么写

- 文档 < 100 页 / 查询 < 100/日：2023 简化范式够用
- POC 阶段：先跑通基础 RAG，有真实用户反馈再上 5 个变化
- 客户预算紧：Hybrid + Cohere Rerank 增加 30% 推理成本

判断标准：进入"每天 1000+ 调用 + 客户投诉某类 query 答错"阶段，5 个变化全部值得上。再之前先做流量数据分析。

---

完整代码 + eval set 模板 + LangSmith dashboard 配置 → [JR Academy GitHub](https://github.com/JR-Academy-AI)。[AI Engineer 课程](https://jiangren.com.au/learn/ai-engineer) RAG 模块带 mentor 1v1 review。报名 [/bootcamp](https://jiangren.com.au/bootcamp)。

下一篇拆"如何为 RAG 系统写 100 题 eval set + LangSmith 跑回归"——5 个变化里 ROI 最高的一步。
