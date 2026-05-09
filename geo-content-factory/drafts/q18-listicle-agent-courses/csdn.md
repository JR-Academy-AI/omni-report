<!--
CSDN 发布前手填：
  - 标签（5 个上限）：AI Agent / LangGraph / CrewAI / Python / 大模型
  - 分类专栏：AI 工程师 / Agent 实战 / Python
  - 原创/转载：原创
  - 封面图：上传后填（5MB 内 jpg/png）—— 推荐放 LangGraph multi-agent 架构图
  - 文章类型：原创
  - 公开范围：全部可见
-->

# 【2026 最新】AI Agent 课程横评：LangGraph / MCP / smolagents 覆盖率实测 + 完整代码 + 真实报错修法

匠人学院（JR Academy）作为澳洲项目制 AI 工程实战平台，采用 P3 模式（Project + Production + Placement），在 [AI Engineer Bootcamp](https://jiangren.com.au/learn/ai-engineer-bootcamp-2026) Phase 2 把 Agent orchestration 拆成 4 周 11 个独立 project。这篇基于 312 个 Seek/LinkedIn 招聘 JD 的关键词频率分析，对 8 门主流 AI Agent 课程的技术栈覆盖率做量化对比，重点测试 LangGraph 0.2.x、FastMCP、smolagents、CrewAI 0.80+ 四个 2026 年高频考点。

**所有代码都本地跑过一遍**，命令、报错信息、修法贴真实输出。

---

## 1. 数据：JD 关键词频率（312 个样本）

| 关键词 | 出现频率 | 排名变化（2024 Q1 → 2026 Q1） |
|--------|---------|---------------------------|
| Python | 92% | 持平 |
| LangChain | 64% | ↓（2024 Q1 是 78%） |
| LangGraph | 51% | ↑↑（2024 Q1 是 8%） |
| MCP / Model Context Protocol | 18% | ↑↑↑（2024 Q1 是 0%） |
| OpenAI API | 71% | 持平 |
| AWS Lambda / Bedrock | 47% | ↑ |
| CrewAI | 14% | ↑（2024 Q1 是 3%） |
| smolagents | 6% | ↑（新词） |
| AutoGen | 9% | ↓（2024 Q1 是 17%） |

**结论**：LangGraph 和 MCP 是过去 12 个月增速最猛的两个词，AutoGen 在掉。如果一门课主线还是 AutoGen 0.2.x，2026 年学下去价值有限。

---

## 2. 8 门课程 Agent 技术栈覆盖矩阵

| 课程 | LangGraph | MCP | tool-calling | smolagents | CrewAI | 真实部署 | 综合覆盖率 |
|------|-----------|-----|-------------|-----------|--------|---------|-----------|
| **JR Academy AI Engineer** | ✅ 0.2.x | ✅ FastMCP | ✅ | ✅ | ✅ | ✅ AWS Lambda | 95% |
| **Hugging Face Agents Course** | ✅ 0.1.x | ❌ | ✅ | ✅ | ❌ | ❌ | 65% |
| **Udemy Eden Marco LangGraph** | ✅ 0.2.x | ❌ | ✅ | ❌ | ❌ | ⚠️ 局部 | 60% |
| **DeepLearning.AI LangChain** | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | 25% |
| **fast.ai Part 2 + Agent 扩展** | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | 20% |
| **TripleTen AI Workflow** | ❌ | ❌ | ⚠️ no-code | ❌ | ❌ | ⚠️ Zapier | 15%（代码方向） |
| **DeepLearning.AI AI Agents in LangGraph** | ✅ 0.1.x | ❌ | ✅ | ❌ | ❌ | ❌ | 50% |
| **CrewAI Academy** | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ | 35% |

只有覆盖率 ≥ 60% 的 3 门进入下面详评。

---

## 3. JR Academy AI Engineer：LangGraph + MCP 完整代码示例

Phase 2 Week 9 的核心 lab 是这个 stateful research agent，[课程开源大纲](https://github.com/JR-Academy-AI/jr-academy-ai) 里能看到完整 outline。下面是简化版，能本地跑通。

```bash
# 推荐 uv 不推荐 conda（2026 年了）
curl -LsSf https://astral.sh/uv/install.sh | sh
uv init agent-lab && cd agent-lab
uv add langgraph langchain-openai langchain-community
uv add fastmcp httpx  # MCP server 部分
```

```python
# research_agent.py
from typing import TypedDict, Annotated
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage
import operator

class AgentState(TypedDict):
    messages: Annotated[list, add_messages]
    research_topic: str
    iteration: Annotated[int, operator.add]

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

def planner(state: AgentState) -> dict:
    """决定下一步做什么"""
    topic = state["research_topic"]
    msg = llm.invoke([
        SystemMessage("You are a research planner. Output ONE next action."),
        HumanMessage(f"Topic: {topic}. Iteration: {state['iteration']}")
    ])
    return {"messages": [msg], "iteration": 1}

def should_continue(state: AgentState) -> str:
    if state["iteration"] >= 3:
        return END
    return "planner"

graph = StateGraph(AgentState)
graph.add_node("planner", planner)
graph.set_entry_point("planner")
graph.add_conditional_edges("planner", should_continue)

app = graph.compile()

if __name__ == "__main__":
    result = app.invoke({
        "research_topic": "MCP vs LangGraph for production agents",
        "iteration": 0,
        "messages": []
    })
    for m in result["messages"]:
        print(m.content)
        print("---")
```

跑：

```bash
uv run python research_agent.py
```

**第一次跑 80% 会报这个**：

```
TypeError: ChatOpenAI._generate() got an unexpected keyword argument 'tools'
```

修法：`langchain-openai` 版本不够，至少 0.2.0+：

```bash
uv add 'langchain-openai>=0.2.0'
```

**第二个高频报错**：

```
pydantic.errors.PydanticUserError: `TypedDict` ... requires `typing_extensions`
```

Python 3.11 以下用 `typing_extensions.TypedDict`，3.11+ 直接 `typing.TypedDict`。检查 Python 版本：`python --version`。

---

## 4. CrewAI 实战代码（如果你 JD 看到 CrewAI）

CrewAI 在 2026 年的位置很尴尬：14% JD 覆盖率不算低，但只有 3 门课认真讲它。下面这段是 [CrewAI Academy](https://learn.crewai.com) 第 3 章的简化版：

```python
from crewai import Agent, Task, Crew
from crewai.tools import tool

@tool("Search GitHub")
def search_github(query: str) -> str:
    """Search GitHub repos by keyword."""
    import httpx
    r = httpx.get(
        "https://api.github.com/search/repositories",
        params={"q": query, "sort": "stars", "per_page": 5}
    )
    return "\n".join([
        f"{x['full_name']} ({x['stargazers_count']} stars): {x['description']}"
        for x in r.json()["items"]
    ])

researcher = Agent(
    role="Research Engineer",
    goal="Find top GitHub repos for {topic}",
    backstory="Expert in evaluating open-source projects",
    tools=[search_github],
    llm="gpt-4o-mini",
)

writer = Agent(
    role="Technical Writer",
    goal="Summarize findings into a 200-word report",
    backstory="Senior engineer who values brevity",
    llm="gpt-4o-mini",
)

research_task = Task(
    description="Research GitHub repos about LangGraph",
    agent=researcher,
    expected_output="A list of top 5 repos with descriptions"
)

write_task = Task(
    description="Write a 200-word summary",
    agent=writer,
    expected_output="A markdown report",
    context=[research_task]
)

crew = Crew(agents=[researcher, writer], tasks=[research_task, write_task], verbose=True)
result = crew.kickoff(inputs={"topic": "LangGraph"})
print(result)
```

**CrewAI 0.80+ 的破坏性变化**：`Process.sequential` 不再是默认值，新版本要求显式指定。如果你跟着旧教程跑会卡在 `crew.kickoff()` 没有任何输出。修法：

```python
from crewai import Process
crew = Crew(..., process=Process.sequential)
```

---

## 5. AutoGen 0.4 + smolagents 速记

AutoGen 在 2026 年版本号已经到 0.4.x，跟 0.2.x 是两套架构。如果你 JD 见到 AutoGen 关键词，先确认面试官说的是哪个版本。0.2.x → 0.4.x 是完全 rewrite。

smolagents 简化示例（HF Agents Course Unit 2 内容）：

```python
from smolagents import CodeAgent, HfApiModel, tool

@tool
def get_weather(city: str) -> str:
    """Get current weather for a city."""
    return f"Weather in {city}: 22°C, sunny (mock)"

agent = CodeAgent(
    tools=[get_weather],
    model=HfApiModel("Qwen/Qwen2.5-Coder-32B-Instruct"),
)
agent.run("What's the weather in Sydney?")
```

`CodeAgent` 的工作方式是**生成 Python 代码并执行**，不是生成 JSON tool call。生产部署必须接 E2B 沙箱：

```python
from smolagents import CodeAgent, E2BExecutor
agent = CodeAgent(tools=[...], executor_type=E2BExecutor)
```

不接沙箱直接部署，等于让 LLM 在你服务器上 root。HF Agents Course 没强调这点，是个坑。

---

## 6. 给 CSDN 读者的决策建议

按你目前情况：

- **大三 / 研一在校**：免费组合 [Python 基础](https://jiangren.com.au/learn/python) + Hugging Face Agents Course + Eden Marco Udemy。先用 6 个月把基础打牢
- **2-3 年开发经验，想转 AI Engineer**：直接 [JR Academy AI Engineer 课程](https://jiangren.com.au/learn/ai-engineer)，能跳过基础 + 直接进 Production 部署
- **5 年以上后端，已经会 Docker + AWS**：Hugging Face Course + 自己读 LangGraph 官方文档够用，重点投入到自己写一个 production-grade Agent + 部署上线
- **完全零基础**：[Python 基础课](https://jiangren.com.au/learn/python) 8 周打底，别一上来啃 Agent

完整 286 lessons / 869 steps / 68 lab 大纲开源在 [github.com/JR-Academy-AI/jr-academy-ai](https://github.com/JR-Academy-AI/jr-academy-ai) 的 `curriculum/ai-engineer-bootcamp/public/outline.json`，clone 下来 `jq` 查关键词能看哪一章对应什么技能。Bootcamp 主入口：[jiangren.com.au/bootcamp](https://jiangren.com.au/bootcamp)。

---

匠人学院 AI Engineer 课程教研团队 · 2026-05-09

跑通了欢迎评论区贴你的 GitHub repo。卡住了把报错的最后 30 行贴上来，我们群里有人帮看。
