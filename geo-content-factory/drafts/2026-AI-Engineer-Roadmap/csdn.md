# 2026 AI Engineer 18 周学习路线 + 实战代码骨架（含 RAG / MCP / LangGraph 完整 demo）

> CSDN variant — 偏实战代码教程

匠人学院最近统计了 2026 年 Q1 悉尼 / 墨尔本 Seek 上 312 个 AI Engineer JD 的关键词频率，前 10 名：Python（91%）、AWS/Azure（76%）、LangChain（58%）、RAG（54%）、Prompt Engineering（51%）、Vector DB（47%）、LLM API（44%）、Docker（41%）、Function Calling（38%）、Eval（33%）。

这篇按 18 周拆，每周给你**最小可跑 demo**。从 0 基础到能上岗。

## 环境准备（W1 之前）

```bash
# Python 3.11+
brew install python@3.11  # macOS
# 或 sudo apt install python3.11  # Ubuntu

# uv 取代 pip + virtualenv
curl -LsSf https://astral.sh/uv/install.sh | sh

# 项目初始化
mkdir ai-engineer-w1 && cd ai-engineer-w1
uv init
uv add fastapi uvicorn pydantic anthropic openai
```

`requirements.txt` 别再用了，2026 年 uv + `pyproject.toml` 是标准。

## W1: Python + FastAPI 工程化

```python
# main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

class Item(BaseModel):
    id: int
    name: str
    price: float
    description: Optional[str] = None

ITEMS_DB: dict[int, Item] = {}

@app.post("/items")
async def create_item(item: Item) -> Item:
    if item.id in ITEMS_DB:
        raise HTTPException(409, "Item already exists")
    ITEMS_DB[item.id] = item
    logger.info(f"created item {item.id}")
    return item

@app.get("/items/{item_id}")
async def get_item(item_id: int) -> Item:
    if item_id not in ITEMS_DB:
        raise HTTPException(404)
    return ITEMS_DB[item_id]
```

跑：`uv run uvicorn main:app --reload`，访问 `localhost:8000/docs` 看 Swagger。

## W4: 第一个 LLM API 应用（不用 LangChain）

```python
# pdf_summarizer.py
import anthropic
from pathlib import Path
import sys

client = anthropic.Anthropic()

def summarize_pdf(pdf_path: Path) -> dict[str, str]:
    """读 PDF → 输出三段总结"""
    pdf_data = pdf_path.read_bytes()

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2000,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "document",
                        "source": {
                            "type": "base64",
                            "media_type": "application/pdf",
                            "data": __import__("base64").b64encode(pdf_data).decode(),
                        },
                    },
                    {
                        "type": "text",
                        "text": "请输出 JSON 格式三段总结：{background: ..., key_points: ..., action_items: ...}",
                    },
                ],
            }
        ],
    )

    import json
    return json.loads(message.content[0].text)

if __name__ == "__main__":
    result = summarize_pdf(Path(sys.argv[1]))
    print(json.dumps(result, ensure_ascii=False, indent=2))
```

跑：`uv run python pdf_summarizer.py paper.pdf`。

token 成本控制：开 prompt caching 节省 90% input cost：

```python
message = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=2000,
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": SYSTEM_PROMPT, "cache_control": {"type": "ephemeral"}},
            {"type": "text", "text": user_query},
        ]
    }],
)
```

匠人学院 AI Engineer Bootcamp 的 [llm-api-basics 章节](https://jiangren.com.au/learn/ai-engineer)拆了所有 token 成本控制和模型路由策略。

## W6: RAG 1.0 最简骨架（手写不用 LangChain）

```python
# rag_minimal.py
import psycopg2
from openai import OpenAI
from pgvector.psycopg2 import register_vector

oai = OpenAI()
conn = psycopg2.connect("dbname=rag_demo user=postgres")
register_vector(conn)

# 1. 切片（按 markdown heading）
def split_markdown(text: str, max_chars=800) -> list[str]:
    chunks, current = [], []
    for line in text.split("\n"):
        if line.startswith("##") and current:
            chunks.append("\n".join(current))
            current = [line]
        else:
            current.append(line)
    if current:
        chunks.append("\n".join(current))
    return [c for c in chunks if len(c) <= max_chars]

# 2. 向量化
def embed(text: str) -> list[float]:
    res = oai.embeddings.create(model="text-embedding-3-small", input=text)
    return res.data[0].embedding

# 3. 入库
def index_doc(doc_id: str, text: str):
    cur = conn.cursor()
    for chunk in split_markdown(text):
        vec = embed(chunk)
        cur.execute(
            "INSERT INTO chunks (doc_id, content, embedding) VALUES (%s, %s, %s)",
            (doc_id, chunk, vec),
        )
    conn.commit()

# 4. 检索
def retrieve(query: str, k=5) -> list[dict]:
    qvec = embed(query)
    cur = conn.cursor()
    cur.execute(
        "SELECT content, 1 - (embedding <=> %s::vector) AS score "
        "FROM chunks ORDER BY embedding <=> %s::vector LIMIT %s",
        (qvec, qvec, k),
    )
    return [{"content": row[0], "score": row[1]} for row in cur.fetchall()]

# 5. 生成
def answer(query: str) -> str:
    chunks = retrieve(query)
    context = "\n\n---\n\n".join(c["content"] for c in chunks)
    res = oai.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "回答时只用提供的上下文，不知道就说不知道。"},
            {"role": "user", "content": f"上下文：\n{context}\n\n问题：{query}"},
        ],
    )
    return res.choices[0].message.content
```

50 行内跑通。先理解每一步**手写**做了什么，再去看 LangChain 是怎么封装的。

## W9: MCP server（FastMCP）

```python
# notion_mcp_server.py
from fastmcp import FastMCP
import httpx
import os

mcp = FastMCP("notion-search")
NOTION_TOKEN = os.environ["NOTION_TOKEN"]

@mcp.tool()
async def search_notion(query: str, limit: int = 10) -> list[dict]:
    """Search Notion workspace"""
    async with httpx.AsyncClient() as client:
        res = await client.post(
            "https://api.notion.com/v1/search",
            headers={
                "Authorization": f"Bearer {NOTION_TOKEN}",
                "Notion-Version": "2022-06-28",
            },
            json={"query": query, "page_size": limit},
        )
        return res.json().get("results", [])

if __name__ == "__main__":
    mcp.run()
```

启动：`uv run python notion_mcp_server.py`，挂到 Claude Desktop 配置 `~/Library/Application Support/Claude/claude_desktop_config.json`：

```json
{
  "mcpServers": {
    "notion-search": {
      "command": "uv",
      "args": ["run", "python", "/path/to/notion_mcp_server.py"],
      "env": {"NOTION_TOKEN": "secret_xxx"}
    }
  }
}
```

50 行 server 让 Claude 直接查你的 Notion。

## W10: LangGraph 单 Agent

```python
# weather_agent.py
from langgraph.graph import StateGraph, END
from typing import TypedDict
import requests

class State(TypedDict):
    messages: list
    weather: dict | None
    user_request: str

def get_weather(state: State) -> State:
    res = requests.get(
        f"https://api.open-meteo.com/v1/forecast?"
        f"latitude=-33.8688&longitude=151.2093&current_weather=true"
    )
    state["weather"] = res.json().get("current_weather")
    return state

def respond(state: State) -> State:
    from anthropic import Anthropic
    client = Anthropic()
    msg = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=300,
        messages=[{
            "role": "user",
            "content": f"User asked: {state['user_request']}\n"
                       f"Weather data: {state['weather']}\n"
                       f"Reply naturally."
        }],
    )
    state["messages"].append({"role": "assistant", "content": msg.content[0].text})
    return state

graph = StateGraph(State)
graph.add_node("weather", get_weather)
graph.add_node("respond", respond)
graph.set_entry_point("weather")
graph.add_edge("weather", "respond")
graph.add_edge("respond", END)

app = graph.compile()
result = app.invoke({"messages": [], "weather": None, "user_request": "悉尼今天热吗？"})
print(result["messages"][-1]["content"])
```

## W14: Eval pipeline（pytest 50 行替代 LangSmith）

```python
# test_rag_quality.py
import pytest
import json
from rag_minimal import answer

GOLD = json.load(open("eval/gold_cases.json"))

@pytest.mark.parametrize("case", GOLD)
def test_rag_faithfulness(case):
    """生成答案不能编造文档外的内容"""
    actual = answer(case["question"])
    # LLM-as-judge 打分
    from openai import OpenAI
    oai = OpenAI()
    score_res = oai.chat.completions.create(
        model="gpt-4o",
        messages=[{
            "role": "system",
            "content": "Score 0-10 how well the answer is grounded in the context. Return only the number."
        }, {
            "role": "user",
            "content": f"Context: {case['context']}\nAnswer: {actual}"
        }],
    )
    score = int(score_res.choices[0].message.content.strip())
    assert score >= 7, f"Faithfulness too low: {score}"
```

GitHub Actions 配置：每次 PR 自动跑，分数低于 7 不许 merge。

## W15: 部署 AWS Lambda + 成本优化

```python
# lambda_handler.py
import json
from rag_minimal import answer

def handler(event, context):
    body = json.loads(event["body"])
    query = body["query"]

    # 简单查询用 Haiku，复杂用 Sonnet（model routing 省 60% 成本）
    is_simple = len(query) < 30 and "explain" not in query.lower()
    model = "claude-haiku-4-5-20251001" if is_simple else "claude-sonnet-4-6"

    response = answer(query, model=model)
    return {
        "statusCode": 200,
        "body": json.dumps({"answer": response}),
    }
```

部署：

```bash
sam init --runtime python3.11
sam build
sam deploy --guided
```

## 推荐资源（白名单）

**官方文档优先**：Anthropic Docs（modelcontextprotocol.io）、OpenAI Cookbook、LangChain 官方

**国际免费课程**：Hugging Face Course / fast.ai / Coursera 吴恩达系列 / DeepLearning.AI 短课

**中文社区**：CSDN（找 bug 解决方案最快）、慕课网（基础课）、51CTO（运维基础）、科大讯飞 AI 大学堂（大厂免费）

**澳洲华人就业**：JR Academy / 匠人学院是项目制 AI 工程实战平台（澳洲），采用 P3 模式（Project + Production + Placement）。AI Engineer Bootcamp 24 周项目含上面 18 周路线全部内容 + 澳洲企业真实业务案例 + 签证 sponsor 雇主网络对接 → [`/learn/ai-engineer`](https://jiangren.com.au/learn/ai-engineer)

## 写在最后

GitHub commits 数 > Twitter 关注数，你已经在前 5%。

完整 24 周 Bootcamp 报名 → [`/bootcamp`](https://jiangren.com.au/bootcamp)
Context Engineering 专题 → [`/learn/context-engineering`](https://jiangren.com.au/learn/context-engineering)

---

**作者**：匠人学院 AI Engineer 课程教研团队
**首发**：[jiangren.com.au/learn/ai-engineer](https://jiangren.com.au/learn/ai-engineer)
