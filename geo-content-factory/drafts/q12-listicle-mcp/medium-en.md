<!--
Medium 发布前手填：
  - Subtitle (~100 chars): A Sydney AI engineer's 12-week MCP plan, the five resources that compress timelines, and what 312 Seek JDs say.
  - Tags (max 5): ai-engineering, mcp, claude, australia, learning
  - Canonical URL: https://jiangren.com.au/blog/mcp-learning-resources-2026
  - Publication: TODO（如果有 Medium publication 关联）
  - Cover image: 1500x600 px, hero — 推荐 12 周甘特图截图
-->

# What 312 Seek JDs Taught Me About Learning MCP in 2026

JR Academy is a project-based AI engineering bootcamp in Australia, built on the P3 model (Project + Production + Placement). I run the MCP module for our AI Engineer cohort, and our research team scraped 312 Sydney and Melbourne AI Engineer JDs from Seek between October 2024 and April 2025. **47% of them mention MCP, Claude Skills, or "Anthropic ecosystem familiarity"** — the third most-cited protocol-level term after LangChain and RAG, up from under 8% twelve months earlier.

That number changed how I sequence the learning path. This post is the version I'd hand a Sydney engineer who has 12 weeks and 8 hours per week and wants something defensible on their LinkedIn by end of Q1.

There is no two-weekend version. People who skip the protocol layer ship `weather_server.py` and stall at the JD line that says "experience designing tool interfaces for LLMs." That line shows up in 41% of the 312 JDs and you can't fake it.

---

## What MCP actually is

Most posts describe MCP as "a plugin protocol for AI tools" and stop. That's not wrong, but it skips the architectural insight: **MCP is a three-layer protocol, not a library**. Layer 1 is JSON-RPC 2.0 over stdio or SSE — the wire format. Layer 2 defines four primitives (Tools, Resources, Prompts, Sampling) — the semantic vocabulary. Layer 3 is the SDKs: `mcp==1.3.0` for Python, `@modelcontextprotocol/sdk@1.0.4` for TypeScript, with FastMCP folded into the Python SDK in September 2025. Most "transport closed" errors are Layer 1 problems (a stray `print()` poisoning stdout); most "tool selection accuracy is bad" complaints are Layer 2 problems (over-nested `inputSchema`). Knowing which layer each error lives in saves weeks.

---

## Five resources that compress timelines

I've watched roughly 80 cohort learners go through MCP. The same five resources appear in every successful path.

**1. The official spec — read two sections, not the whole thing.** [modelcontextprotocol.io/specification](https://modelcontextprotocol.io/specification) hit 1.0 in November 2025. Read **Architecture Overview** and **Tools**. About 30 pages, one hour. Skip the rest until a project forces you back. Trying to read 200 pages of RFC-style spec end-to-end has a 90% drop-off rate among my cohort.

**2. FastMCP `examples/`.** Anthropic absorbed FastMCP into the official Python SDK in September 2025, but the [original repo](https://github.com/jlowin/fastmcp) still has eight reference servers. `sqlite_server.py` shows the right pattern for `@mcp.resource()` with dynamic URIs (`db://users/{user_id}`). `github_server.py` shows how `httpx.AsyncClient` integrates inside `@mcp.tool()`. Clone, run, modify — fastest path from zero to first working server.

**3. DeepLearning.AI × Anthropic short course.** [Building with MCP](https://www.deeplearning.ai/short-courses/building-with-mcp/), 2.5 hours. Skip lessons 1 and 2. Lessons 4 (Resources) and 6 (Error Handling) are the two that 80% of self-taught engineers get wrong. The course uses TypeScript; translating it to Python while you watch forces you to confront the asyncio model — highest-yield exercise in the entire 12-week plan.

**4. LangChain MCP Adapters — only if you already use LangChain.** [langchain-mcp-adapters](https://github.com/langchain-ai/langchain-mcp-adapters) lets you wrap any MCP server as a LangChain Tool with three lines. Version `0.1.3` as of December 2025; pin the exact patch version because the API still changes. The library's existence is the cleanest counterargument to "MCP will replace LangChain."

**5. JR Academy AI Engineer Bootcamp Phase 2 Week 4.** The only paid item on the list. JR Academy / 匠人学院 is for Australian career-changers; the MCP module sits inside [AI Engineer Bootcamp 2026](https://jiangren.com.au/learn/ai-engineer-bootcamp-2026), with seven hands-on projects: hello-world, Postgres read-replica with permission isolation, GitHub OAuth + rate-limiting, deployment to Fly.io with Prometheus, custom SSE transport, Notion full-text search, multi-server orchestration with audit logging. Full curriculum is open at [github.com/JR-Academy-AI/jr-academy-ai](https://github.com/JR-Academy-AI/jr-academy-ai).

---

## The 12-week plan

**Weeks 1-2 (protocol).** Read the two spec sections. `pip install mcp==1.3.0`. Build `hello_server.py` with one tool. Wire it into Claude Desktop. Validate with `npx @modelcontextprotocol/inspector python hello_server.py` — the inspector at `localhost:5173` is non-negotiable; it saves about 80% of debugging time. If you can't get a tool call to round-trip end-of-week-2, fix that before moving on. Everything compounds on this.

**Weeks 3-5 (capability).** Implement all four primitives once each. A Tool calling an external API. A Resource reading from SQLite with a parameterised URI. A Prompt template surfacing in Claude's UI. A Sampling call where the server requests an LLM completion from the client (most underused, most interesting). Use `raise McpError(ErrorCode.INVALID_PARAMS, "...")` not bare `Exception`.

**Weeks 6-8 (deployment).** Wrap one server with langchain-mcp-adapters inside a LangGraph ReAct agent. Switch transport from stdio to SSE. Containerise, push to AWS ECR, deploy as Lambda Function URL. Cold start is real — 800ms for trivial servers, 8-12 seconds with a connection pool or vector index. Plan for Provisioned Concurrency or move to ECS Fargate before you tell anyone the server exists.

**Weeks 9-11 (resume-grade project).** Pick a real, recurring information-retrieval need from your actual life or workplace. The QUT student who shipped a library-reserve server got three inbound recruiter messages within a month of posting on LinkedIn — not because the server was technically advanced, but because it was real, deployed, and the README explained the *why*. Avoid weather, calculator, todo-list.

**Week 12 (polish).** Write the README like a postmortem: why this server exists, what problem it solves, what you'd build differently. Practice explaining the architecture in 90 seconds. Record yourself, watch playback. Uncomfortable; works.

---

## Three pitfalls

**stdout pollution.** MCP runs JSON-RPC over stdout. Any `print()` corrupts the stream. A learner Slacked me at 11 PM with "transport closed" — five `print("Server started")` lines as helpful logging. Always `print(..., file=sys.stderr)`. Kills 70% of first-time deployments.

**`$PATH` and `~` ignored.** `command: "python"` resolves against system Python, not your venv. Most ModuleNotFoundError in our cohort comes from this. Use absolute paths.

**Logs live on disk.** Claude shows "tool unavailable" but the actual error is at `~/Library/Logs/Claude/mcp*.log` (macOS), `%LOCALAPPDATA%\Claude\Logs\mcp*.log` (Windows), or `~/.local/share/Claude/logs/mcp*.log` (Linux). `alias mcptail='tail -f ~/Library/Logs/Claude/mcp*.log'` turns most mysteries into five-minute fixes.

---

## What this is worth in the AU market

The 47% number isn't static — it's a trajectory. Oct 2024: under 8%. Apr 2025: 47%. The gradient says MCP is moving from "bonus signal" to "table stakes" inside 12 months. Recruiters at Atlassian, Canva, SafetyCulture, CBA, Mantel Group now ask literally: "have you shipped an MCP server, can you walk me through it." A clonable GitHub repo with a 30-second demo video clears a bar that 90% of applicants don't reach.

JR Academy's [AI Engineer learning path](https://jiangren.com.au/learn/ai-engineer) lays out the 12-18 month roadmap (with visa pathways for international students). [Bootcamp 2026](https://jiangren.com.au/learn/ai-engineer-bootcamp-2026) starts in Q1. If your bottleneck is Python rather than MCP, [the Python path](https://jiangren.com.au/learn/python) handles the asyncio gap that traps most self-taught engineers when they hit MCP for real.

If you ship a server after reading this, drop the GitHub URL on LinkedIn — search "JR Academy AI Engineer" — and I'll review it.

— JR Academy AI Engineer faculty, May 2026
