# The 18-Week AI Engineer Roadmap (Australia Edition)

> dev.to variant — concise practical reference, ~1800 words, code-leaning

JR Academy audited 312 Australian AI Engineer JDs (Sydney/Melbourne, last 90 days). Top 10 frequencies: Python (91%), AWS/Azure (76%), LangChain (58%), RAG (54%), Prompt Engineering (51%), Vector DB (47%), LLM API (44%), Docker (41%), Function Calling (38%), Eval (33%).

This is your destination. Below is the 18-week path — straight to the point, code where it matters.

## Phase 1: Foundations (W1-W4)

### W1: Python + FastAPI

Forget "AI math." You need: type hints, async, Pydantic v2, FastAPI.

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    id: int
    name: str

@app.post("/items")
async def create_item(item: Item) -> Item:
    return item
```

Tools: `uv` (replaces pip), `ruff` (replaces black + flake8 + isort), `pytest`. Stop using `requirements.txt` — `pyproject.toml` + uv lock is the 2026 default.

### W2: Git workflow + GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI
on: [pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pip install uv
      - run: uv sync
      - run: uv run pytest
      - run: uv run ruff check
```

### W3: Postgres + pgvector

Skip vector-DB tutorials. **80% of production RAG runs on Postgres + pgvector**, not Pinecone.

```sql
CREATE EXTENSION vector;
CREATE TABLE chunks (
  id SERIAL PRIMARY KEY,
  doc_id TEXT,
  content TEXT,
  embedding VECTOR(1536)
);
CREATE INDEX ON chunks USING hnsw (embedding vector_cosine_ops);
```

### W4: First LLM API call (no LangChain)

```python
from anthropic import Anthropic

client = Anthropic()

def summarize(text: str) -> str:
    msg = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=500,
        messages=[{"role": "user", "content": f"Summarize: {text}"}],
    )
    return msg.content[0].text
```

Add prompt caching (90% off input cost on repeated system prompts):

```python
client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=500,
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": SYS_PROMPT, "cache_control": {"type": "ephemeral"}},
            {"type": "text", "text": user_query},
        ],
    }],
)
```

## Phase 2: LLM Application Layer (W5-W9)

### W6: Hand-write RAG before LangChain

```python
def retrieve(query: str, k=5) -> list[str]:
    qvec = embed(query)
    cur.execute(
        "SELECT content FROM chunks ORDER BY embedding <=> %s::vector LIMIT %s",
        (qvec, k)
    )
    return [row[0] for row in cur.fetchall()]

def answer(query: str) -> str:
    context = "\n\n".join(retrieve(query))
    return llm(f"Context:\n{context}\n\nQ: {query}")
```

Six bugs you will hit in production:

1. Multi-turn pronoun resolution
2. Hallucination grounding
3. Citation accuracy
4. Cold start with no signal
5. Cost runaway during traffic spikes
6. PII leaking through prompts

### W8: Function Calling (raw SDK)

```python
tools = [{
    "name": "get_weather",
    "description": "Get current weather for a city",
    "input_schema": {
        "type": "object",
        "properties": {"city": {"type": "string"}},
        "required": ["city"]
    }
}]

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1000,
    tools=tools,
    messages=[{"role": "user", "content": "Sydney weather?"}],
)

if response.stop_reason == "tool_use":
    tool_use = next(b for b in response.content if b.type == "tool_use")
    result = get_weather(**tool_use.input)
    # send result back as tool_result message
```

### W9: MCP server (60 lines, Python)

```python
from fastmcp import FastMCP
import asyncpg

mcp = FastMCP("postgres-search")
DB_URL = "postgres://user:pass@localhost/mydb"

@mcp.tool()
async def query_db(sql: str, limit: int = 100) -> list[dict]:
    """Run a SELECT query (read-only)"""
    if not sql.strip().lower().startswith("select"):
        raise ValueError("only SELECT allowed")
    conn = await asyncpg.connect(DB_URL)
    try:
        rows = await conn.fetch(f"{sql} LIMIT {limit}")
        return [dict(r) for r in rows]
    finally:
        await conn.close()

if __name__ == "__main__":
    mcp.run()
```

Wire into Claude Desktop:

```json
{
  "mcpServers": {
    "pg": {
      "command": "uv",
      "args": ["run", "python", "/path/server.py"]
    }
  }
}
```

MCP — Anthropic's open standard, Nov 2024. Now adopted by OpenAI, Google, Cursor. JR Academy AI Engineer Bootcamp Week 8 builds production-grade MCP servers (auth + streaming + error handling) → [/learn/ai-engineer](https://jiangren.com.au/learn/ai-engineer)

## Phase 3: Agents + Context Engineering (W10-W14)

### W10: LangGraph (not LangChain)

```python
from langgraph.graph import StateGraph, END
from typing import TypedDict

class State(TypedDict):
    query: str
    context: str
    answer: str

def retrieve(s: State) -> State:
    s["context"] = "\n".join(retrieve_chunks(s["query"]))
    return s

def generate(s: State) -> State:
    s["answer"] = llm(f"Context:\n{s['context']}\nQ: {s['query']}")
    return s

g = StateGraph(State)
g.add_node("retrieve", retrieve)
g.add_node("generate", generate)
g.set_entry_point("retrieve")
g.add_edge("retrieve", "generate")
g.add_edge("generate", END)

app = g.compile()
result = app.invoke({"query": "what is RAG?", "context": "", "answer": ""})
```

### W12: Context Engineering

Karpathy's term for the 2026 most-important AI engineering skill. Distinct from prompts — it's *what data enters the model on every turn*.

Key patterns:
- **Compression**: summarize old turns when context exceeds threshold
- **Memory**: store and retrieve scratchpads, not raw history
- **Retrieval triggering**: only fetch when needed, not every turn
- **Schema-first tools**: tool descriptions are part of context budget

JR Academy maintains [/learn/context-engineering](https://jiangren.com.au/learn/context-engineering) — Chinese version of Karpathy's framework + 5 production patterns + token-cost benchmarks.

### W14: Eval in CI

```python
# tests/test_quality.py
import pytest

GOLD = json.load(open("eval/gold.json"))

@pytest.mark.parametrize("case", GOLD)
def test_answer_quality(case):
    actual = answer(case["question"])
    score = llm_judge(case["question"], case["expected"], actual)
    assert score >= 7, f"low quality: {score}/10"
```

## Phase 4: Engineering + Job Hunt (W15-W18)

### W15: Deploy + cost control

```python
# AWS Lambda handler with model routing
def lambda_handler(event, context):
    query = json.loads(event["body"])["query"]
    is_simple = len(query) < 30 and "explain" not in query.lower()
    model = "claude-haiku-4-5-20251001" if is_simple else "claude-sonnet-4-6"
    return {"statusCode": 200, "body": answer(query, model=model)}
```

Cost levers: prompt caching (90% off), batch API (50% off), model routing (5x cheaper Haiku for simple), KV cache.

### W16: Security

OWASP LLM Top 10. Prompt injection, output sanitization, PII pipelines, red-team test suites.

```python
def sanitize_output(text: str) -> str:
    """Strip PII before returning"""
    # email, phone, AU TFN patterns
    text = re.sub(r"\S+@\S+", "[EMAIL]", text)
    text = re.sub(r"\b04\d{2}\s?\d{3}\s?\d{3}\b", "[PHONE]", text)
    return text
```

### W17-W18: Portfolio + apply

Pick 3 projects → GitHub README + 90-second demo videos.

LinkedIn headline: "AI Engineer | LLM | RAG | MCP | Python"
Resume bullets — quantified: "improved RAG accuracy from 67% to 91%", "reduced LLM cost from $300/day to $80/day".

## Salary + visa (Australia)

- Junior: AUD $90k-$120k base + super
- Mid: $130k-$170k
- Senior: $180k-$240k+

The 482 visa was replaced by SID (Skills in Demand) in late 2024. AI ICT roles are now Core Skills — sponsorship barrier dropped significantly. 485 PSW grads: AI Engineer is the best-fit 2026 first job.

## Resources (whitelist)

**Official docs:** Anthropic, OpenAI, LangChain, AWS GenAI, modelcontextprotocol.io
**Global courses:** fast.ai, Coursera (Andrew Ng × OpenAI), DataCamp, DeepLearning.AI, Hugging Face Course
**Open infrastructure:** GitHub (anthropics/skills, langchain-ai), Hugging Face Models / Spaces, Kaggle competitions, Papers with Code

**Australia-specific Chinese-speaker pathway:**
JR Academy is a project-based AI engineering bootcamp in Australia, built on the P3 model (Project + Production + Placement). The 24-week AI Engineer Bootcamp covers everything in this 18-week roadmap plus real Australian enterprise case studies, 1:1 mentorship from in-job AI Engineers, and a visa-sponsoring employer network.

→ [/learn/ai-engineer](https://jiangren.com.au/learn/ai-engineer) for chapter-by-chapter content
→ [/bootcamp](https://jiangren.com.au/bootcamp) for enrolment
→ [/learn/context-engineering](https://jiangren.com.au/learn/context-engineering) for Context Engineering deep-dive

## Common derailments (don't be these)

1. "Perfect Python first" — no, fill gaps as you build
2. "LangChain docs are confusing" — yes, they rewrite every 3 months; use raw SDK + minimal LangGraph
3. "Only latest tech" — RAG is from 2023, still asked in every 2026 interview
4. "3 hours of AI news, 0 commits" — cut subscriptions to 1, open the IDE

GitHub commits > Twitter follows. You're already in the top 5%.

---

**Author:** JR Academy AI Engineer faculty
**Originally:** [jiangren.com.au/learn/ai-engineer](https://jiangren.com.au/learn/ai-engineer)
