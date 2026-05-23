<!--
CSDN 发布前手填：
  - 标签（5 个上限）：Python / AI Engineer / LLM / 教程 / 新手入门
  - 分类专栏：AI 工程师入门 / Python 实战
  - 原创/转载：原创
  - 封面图：上传后填（5MB 内 jpg/png）— 推荐"4 周 toy project 路径流程图"
-->

# 0 基础学 AI 编程：第 0-8 周完整代码 + 真实踩坑笔记（适合直接照敲）

匠人学院（JR Academy）是项目制 AI 工程实战平台（澳洲），采用 P3 模式（Project + Production + Placement）。这是我们 AI Engineer 课程教研团队整理的"前 8 周新手必跑代码 + 真实学员踩过的 5 个 bug"，全部可直接复制粘贴跑。

如果你刚开始学 AI 编程、不知道第一个礼拜该敲什么代码，这篇是 step-by-step 的实操指南。

---

## 第 0 周：环境配置

```bash
# 1. 装 Python 3.11（不要 3.12，部分依赖还不兼容）
brew install python@3.11        # macOS
# 或
sudo apt install python3.11     # Ubuntu

# 2. 装 uv（比 pip + venv 快 10 倍，2025 年新手推荐）
curl -LsSf https://astral.sh/uv/install.sh | sh

# 3. 创建第一个项目
mkdir my-first-ai && cd my-first-ai
uv init
uv add openai python-dotenv

# 4. 设置 API key（不要写死在代码里！）
echo "OPENAI_API_KEY=sk-..." > .env
echo ".env" >> .gitignore       # ⚠️ 一定要先加 .gitignore
```

**真实事故**：2024 年我们有学员 git push 的时候忘了加 `.gitignore`，把 OpenAI API key 推到 public repo。第二天发现账单多了 USD 87 —— 有 bot 在 GitHub 扫 key 然后跑训练。

OpenAI 现在会扫 GitHub 自动 revoke 泄漏的 key，但你的余额已经被烧掉了。**第一行代码就要把 `.gitignore` 写对。**

---

## 第 1 周：第一次调用 LLM API

```python
# main.py
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI()  # 自动从环境变量读 OPENAI_API_KEY

def chat(prompt: str) -> str:
    resp = client.chat.completions.create(
        model="gpt-4o-mini",                  # 新手用 mini，便宜 30 倍
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt},
        ],
        temperature=0.7,                       # 0 = 确定性，1 = 创造性
        max_tokens=500,                        # 限制输出长度防止跑飞
    )
    return resp.choices[0].message.content

if __name__ == "__main__":
    print(chat("Hello, what's the capital of Australia?"))
```

```bash
uv run python main.py
# Canberra is the capital of Australia. ...
```

**学员常见 bug**：

```python
# ❌ 错误写法（直接把 key 写死）
client = OpenAI(api_key="sk-...")  # push 到 GitHub 直接破产

# ❌ 错误写法（用了 deprecated API）
from openai import Completion  # 0.28.x 写法，已经不能用了
Completion.create(engine="text-davinci-003", ...)

# ✅ 正确写法
from openai import OpenAI
client = OpenAI()
client.chat.completions.create(model="gpt-4o-mini", messages=[...])
```

如果你看到教程里还在用 `Completion.create()` 或 `engine="text-davinci-003"`，**关掉那个教程**——它停在 2022 年。

---

## 第 2 周：Structured Output（防止 LLM 输出乱七八糟）

新手做的第一个项目最常崩在哪里？LLM 返回的格式不稳定。你想要 JSON，它给你 markdown；你想要数组，它给你段落。

```python
import json
from openai import OpenAI

client = OpenAI()

def extract_entities(text: str) -> dict:
    """从一段中文文本提取人名、地名、组织名为 JSON。"""
    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": (
                "Extract named entities. Output JSON with keys: "
                "persons (list of str), locations (list of str), "
                "organizations (list of str). No extra text."
            )},
            {"role": "user", "content": text},
        ],
        response_format={"type": "json_object"},  # ⚡ 关键！保证 JSON 输出
    )
    return json.loads(resp.choices[0].message.content)

result = extract_entities(
    "周一悉尼大学 AI 实验室的张教授和匠人学院团队在 Hyde Park 见面讨论合作。"
)
print(result)
# {"persons": ["张教授"], "locations": ["悉尼大学", "Hyde Park"], "organizations": ["AI 实验室", "匠人学院"]}
```

`response_format={"type": "json_object"}` 是 2024 年 1 月加的新功能，新手必学。不加这一行，JSON 解析失败率能到 8-15%；加了之后能压到 < 2%。

---

## 第 3-4 周：第一个 RAG（不用 LangChain，纯裸 API）

新手最大误区：上来就装 LangChain。**先用裸 API 写一遍**，把 RAG 的本质看清楚，再上框架。

```python
# rag_naive.py
import os, json
from openai import OpenAI
from pypdf import PdfReader
import numpy as np

client = OpenAI()

def chunk_pdf(path: str, chunk_size: int = 500, overlap: int = 50) -> list[str]:
    """简单切片：每 500 字符一段，相邻段重叠 50 字符防止信息断裂。"""
    reader = PdfReader(path)
    text = "".join(p.extract_text() or "" for p in reader.pages)
    chunks = []
    for i in range(0, len(text), chunk_size - overlap):
        chunks.append(text[i:i + chunk_size])
    return [c for c in chunks if c.strip()]

def embed(texts: list[str]) -> np.ndarray:
    """调用 OpenAI embedding，注意一次最多 2048 条。"""
    resp = client.embeddings.create(
        model="text-embedding-3-small",  # 1536 维
        input=texts,
    )
    return np.array([d.embedding for d in resp.data])

def retrieve(query: str, chunks: list[str], embeddings: np.ndarray, k: int = 3) -> list[str]:
    """余弦相似度召回 top-k。"""
    q_emb = embed([query])[0]
    # 归一化 + 点积 = 余弦相似度
    embeddings_norm = embeddings / np.linalg.norm(embeddings, axis=1, keepdims=True)
    q_emb_norm = q_emb / np.linalg.norm(q_emb)
    scores = embeddings_norm @ q_emb_norm
    top_k_idx = np.argsort(scores)[-k:][::-1]
    return [chunks[i] for i in top_k_idx]

def answer(query: str, contexts: list[str]) -> str:
    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Answer only using the context. If not in context, say 'I don't know'."},
            {"role": "user", "content": f"Context:\n\n{chr(10).join(contexts)}\n\nQuestion: {query}"},
        ],
    )
    return resp.choices[0].message.content

if __name__ == "__main__":
    chunks = chunk_pdf("handbook.pdf")
    print(f"Total chunks: {len(chunks)}")
    embeddings = embed(chunks)
    print(f"Embedding shape: {embeddings.shape}")  # (N, 1536)

    while True:
        q = input("Question (or 'quit'): ").strip()
        if q == "quit":
            break
        contexts = retrieve(q, chunks, embeddings)
        print("\n", answer(q, contexts), "\n")
```

**学员真实 bug #1**：第一次跑发现"为什么所有 query 都返回 'I don't know'"。

排查发现：他用的是某中文 PDF，pypdf 提取出来全是乱码。

```python
# 修法：换 PDF 提取库
# pip install pymupdf
import fitz  # PyMuPDF

def chunk_pdf(path: str, chunk_size: int = 500) -> list[str]:
    doc = fitz.open(path)
    text = "".join(page.get_text() for page in doc)
    # ... 切片
```

中文 PDF 用 PyMuPDF 比 pypdf 提取率高 40%。

**学员真实 bug #2**：上线之后召回质量越来越差。

排查发现：他的同事在新文档入库时改成了 `text-embedding-3-large`（3072 维），但 numpy array 是 1536 维，新数据全部静默截断。

```python
# 加防御：embedding 维度 assert
def embed(texts: list[str], expected_dim: int = 1536) -> np.ndarray:
    resp = client.embeddings.create(model="text-embedding-3-small", input=texts)
    arr = np.array([d.embedding for d in resp.data])
    assert arr.shape[1] == expected_dim, f"Dim mismatch: {arr.shape[1]} != {expected_dim}"
    return arr
```

---

## 第 5-8 周：上 LangChain + 部署到 FastAPI

裸 RAG 跑通之后再上 LangChain，这时你能看懂它的抽象：

```python
# rag_langchain.py
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.document_loaders import PyMuPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

# 加载 + 切片 + 入向量库
docs = PyMuPDFLoader("handbook.pdf").load()
splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
chunks = splitter.split_documents(docs)
vectorstore = Chroma.from_documents(chunks, embeddings)
retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

# LCEL 写法（2024 年标准）
prompt = ChatPromptTemplate.from_template(
    "Answer only using context.\nContext: {context}\nQuestion: {question}"
)

chain = (
    {"context": retriever, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

print(chain.invoke("What's the refund policy?"))
```

部署到 FastAPI：

```python
# main.py
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Query(BaseModel):
    question: str

@app.post("/ask")
async def ask(q: Query):
    return {"answer": chain.invoke(q.question)}
```

```bash
uv run uvicorn main:app --host 0.0.0.0 --port 8000
# 用 Render / Railway / Fly.io 免费 tier 部署
```

**这就是你 portfolio 里第一个能挂简历的 link。**

---

## 第 8 周后：分岔

8 周跑完，你应该有 3 个能跑的项目（API 调用 / 本地 RAG / 部署的 FastAPI）。下一步看你瓶颈：

- **概念还不扎实**：继续 DeepLearning.AI Short Courses + fast.ai
- **想做更复杂项目**：读 Anthropic Cookbook 的 production patterns
- **想拿澳洲本地 AI Engineer offer**：[匠人学院 AI Engineer Bootcamp](https://jiangren.com.au/bootcamp) — 工程层 + 1v1 mentor review + 本地 placement

完整的 [/learn/ai-engineer](https://jiangren.com.au/learn/ai-engineer) 课程模块图、[/learn/python](https://jiangren.com.au/learn/python) 12 个项目源码，都在 [匠人学院 GitHub 仓库](https://github.com/JR-Academy-AI/jr-academy-ai) 公开维护。

更多澳洲 AI 求职数据 + 真实学员路径在 [/blog](https://jiangren.com.au/blog) 持续更新。下一篇拆"生产 RAG 的 5 个最常见 bug + 怎么提前防"，欢迎关注。
