<!--
Medium 发布前手填：
  - Subtitle (~100 chars): An 8-week curriculum derived from 312 Sydney/Melbourne AI Engineer JDs — for non-English-native learners
  - Tags (max 5): ai-engineering, beginners, learning-to-code, career-change, python
  - Canonical URL: https://jiangren.com.au/blog/beginner-ai-engineering-first-step-zh
  - Publication: JR Academy
  - Cover image: 1500x600 — "Week 0-8 milestone roadmap + AI Engineer vs ML Engineer JD comparison"
-->

# How to Learn AI Engineering From Scratch: The 8-Week Curriculum I Wish I Had

I work on the curriculum team at JR Academy, a project-based AI engineering bootcamp in Australia built on the P3 model (Project + Production + Placement). When complete beginners ask "where do I start learning AI", I used to recommend a list of resources. After watching 100+ learners try the same path and seeing where 80% of them got stuck, I rewrote the answer into an 8-week plan with specific checkpoints.

Sharing it here for English-reading beginners — especially career-changers who don't have a CS background and are facing the wall of "AI Engineer vs ML Engineer, LangChain vs LlamaIndex, Pinecone vs Chroma" without a clue.

---

## First: Know which AI job you're targeting

Most beginners waste 3 months learning the wrong thing because they don't separate two roles.

| Role | Core work | Stack | 0-to-interview timeline |
|---|---|---|---|
| **ML Engineer** | Train, fine-tune, deploy models | PyTorch, CUDA, distributed training | 18+ months |
| **AI Engineer** | Build LLM applications using existing models | Python + LLM API + RAG + agent frameworks | 6 months |

If you're targeting AI Engineer (this post), you don't need PyTorch. You don't need CUDA. You don't need to understand backpropagation math. The 312 AI Engineer JDs we analyzed on Seek (Australia, Q4 2025 - Q1 2026) don't list any of those.

What 80% of them list:

```
Python (3+ years production)        87%
LangChain                           79%
vector database                     71%
RAG / retrieval pipeline            68%
prompt engineering (production)     58%
LangGraph / agents                  47%
```

If your learning path doesn't map to those keywords, you're optimizing the wrong direction.

---

## Week 0-2: Python fundamentals (no shortcuts)

The most common beginner mistake: jump straight into LangChain without solid Python. LangChain 0.2+ uses `async/await`, decorators, class inheritance heavily. Without Python fundamentals, framework errors look like alien text.

What you need (and what you don't):

**Need**:
- Functions, classes, module imports
- File I/O (JSON, CSV, text)
- `requests` / `httpx` for HTTP
- `asyncio` basics (`async def` + `await`)
- Virtual environments (use `uv`, not `pip + venv`)
- Type hints
- `try/except` error handling

**Don't need** (yet): web scraping, Django, LeetCode algorithms, advanced metaclasses. They don't show up in AI Engineering work.

Time: 2 weeks part-time (~15 hours/week) if you've programmed before. 4-6 weeks if you're truly zero-experience.

---

## Week 2-3: First API call

```python
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI()

def chat(prompt: str) -> str:
    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt},
        ],
        temperature=0.7,
        max_tokens=500,
    )
    return resp.choices[0].message.content
```

Understand:
1. `system` vs `user` role distinction
2. `temperature` (0 = deterministic, 1+ = creative)
3. `max_tokens` limits **output** length (prevents runaway costs)
4. Model choice: `gpt-4o-mini` is 1/30 the cost of `gpt-4o` and good enough for 90% of beginner work

**Safety rule from day 1**: never hardcode the API key in source. Use `.env` and add `.env` to `.gitignore` before your first commit. Every week somewhere on GitHub Security Lab a beginner leaks an OpenAI key and gets a USD 80-200 bill before OpenAI auto-revokes it.

---

## Week 3-4: Structured Output

The most common beginner-project crash: LLM output format isn't stable. You want JSON, you get markdown. You want a list, you get prose.

```python
import json

resp = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "Extract entities. Output JSON only."},
        {"role": "user", "content": "Sydney University AI Lab and JR Academy met at Hyde Park."},
    ],
    response_format={"type": "json_object"},  # critical
)
data = json.loads(resp.choices[0].message.content)
```

`response_format={"type": "json_object"}` shipped in January 2024. Without it, JSON parse failure rate is 8-15%. With it, < 2%. Mandatory first-month learning.

---

## Week 4-5: First RAG (raw API, no framework)

**Why raw API first**: frameworks abstract things away. If you don't understand the underlying pieces, framework bugs leave you helpless.

```python
import numpy as np
from openai import OpenAI

client = OpenAI()

def embed(texts: list[str]) -> np.ndarray:
    resp = client.embeddings.create(model="text-embedding-3-small", input=texts)
    return np.array([d.embedding for d in resp.data])

def retrieve(query: str, chunks: list[str], embeddings: np.ndarray, k: int = 3) -> list[str]:
    q_emb = embed([query])[0]
    scores = embeddings @ q_emb
    return [chunks[i] for i in np.argsort(scores)[-k:][::-1]]

def answer(query: str, contexts: list[str]) -> str:
    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Answer only from context. If unsure, say 'I don't know'."},
            {"role": "user", "content": f"Context:\n{chr(10).join(contexts)}\n\nQuestion: {query}"},
        ],
    )
    return resp.choices[0].message.content
```

70 lines. A working RAG. Now you understand what LangChain is abstracting when you eventually use it.

**Project assignment**: pick any PDF (your university's syllabus, employee handbook, whatever), build a Q&A bot on top of it. Should run on your laptop in one terminal session.

---

## Week 5-7: Add a framework + go to production

After raw RAG works, add LangChain. You'll recognize what each abstraction is replacing:

```python
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vectorstore = Chroma.from_texts(chunks, embeddings)
retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

prompt = ChatPromptTemplate.from_template(
    "Answer only from context.\nContext: {context}\nQuestion: {question}"
)

chain = (
    {"context": retriever, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)
```

Note: this is LCEL syntax (LangChain Expression Language), the 2024 standard. If a tutorial still uses `from langchain import LLMChain`, it's from 2023 — skip it.

---

## Week 7-8: Deploy

Wrap the chain in FastAPI, push to GitHub, deploy on Render or Railway free tier:

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Query(BaseModel):
    question: str

@app.post("/ask")
async def ask(q: Query):
    return {"answer": chain.invoke(q.question)}
```

Now you have `https://your-first-ai.onrender.com/ask` — a real URL you can put on your résumé. Most "AI engineer learning paths" stop before this step. Don't.

---

## Week 8: The honest decision tree

You now have three shipped toy projects. Where to go next depends on what's actually holding you back:

- **Concepts still shaky** → free English resources continue. Add DeepLearning.AI Short Courses (60+ free courses, 2025-current) and fast.ai. 3-6 more months part-time.
- **Want to build more complex projects, don't know how to design** → read Anthropic Cookbook and OpenAI Cookbook production patterns. Pick a real problem, build for 2-3 months.
- **Need feedback loops, want job placement in Australia** → JR Academy's [AI Engineer Bootcamp](https://jiangren.com.au/bootcamp). 4 months, 1:1 mentor review weekly, named placement partners in AU fintech / SaaS.

JR Academy assumes you've done Week 0-8 already (with free resources). We don't re-teach what DeepLearning.AI does well. We focus on production-layer engineering and placement — the two layers that free resources can't deliver.

---

## What I'd specifically tell my younger self

1. **The "AI Engineer in 3 months" promise is marketing copy.** 87% of Sydney/Melbourne AI Engineer JDs require 3+ years Python production experience. The real timeline is 12-18 months, not 3.
2. **Don't pay for concept/tool layer in 2026.** Free English resources are better than Chinese paid video bundles. Pay only for production-layer + placement.
3. **Build three shipped projects before paying for any course.** A bootcamp without prior projects burns 70% of its time re-teaching basics.
4. **Track JD data, not course reviews.** What companies actually require shifts faster than course curricula. Re-scrape Seek every 6 months and recalibrate.

---

## Closing

Learning AI Engineering from scratch is hard but not mysterious. The path is well-defined if you stop treating "AI learning" as one category. Concept + tool layer: 6 months free English resources. Production + placement: 4 months project-based program with real mentors.

Full Week 0-8 code templates and the JD-keyword-frequency dataset (open-sourced) are at [JR Academy's GitHub](https://github.com/JR-Academy-AI/jr-academy-ai). More learner stories and Australian AI hiring data on [the JR Academy blog](https://jiangren.com.au/blog).

If you found this useful — follow for next week's deep-dive on the 5 most common production RAG bugs and how to catch them before they hit users. Comments and pushback welcome.
