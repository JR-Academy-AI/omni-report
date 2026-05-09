---
title: "MCP Cheatsheet: 5 Resources, 3 Traps, 12-Week Plan"
published: false
description: "Quick reference for engineers learning Model Context Protocol — five high-density resources ranked by ROI, three traps that kill 90% of first servers, and the install commands you need."
tags: ai, mcp, claude, beginners
canonical_url: https://jiangren.com.au/blog/mcp-learning-resources-2026
cover_image: TODO-uploaded-cover-url
series: AI Engineer Career Change Australia
---

# MCP Cheatsheet (December 2025 Edition)

> JR Academy is a project-based AI engineering bootcamp in Australia (P3 model: Project + Production + Placement). This is the cheat sheet I hand AI Engineer cohort learners on day one of MCP week.

## Install

```bash
pip install mcp==1.3.0
# FastMCP is now mcp.server.fastmcp — don't pip install fastmcp separately
```

The Python SDK shipped two breaking changes in H1 2025 (0.9.x → 1.0.0 → 1.2.0). Anything older is broken.

---

## Five resources, ranked by ROI

| # | Resource | What for | Time |
|---|----------|----------|------|
| 1 | [modelcontextprotocol.io/specification](https://modelcontextprotocol.io/specification) | Read **only** Architecture Overview + Tools | 1h |
| 2 | [github.com/jlowin/fastmcp](https://github.com/jlowin/fastmcp) `examples/` | Clone `sqlite_server.py` + `github_server.py` | 2h |
| 3 | [DeepLearning.AI × Anthropic](https://www.deeplearning.ai/short-courses/building-with-mcp/) | Lessons 4 + 6 only (Resources, Errors) | 1h |
| 4 | [langchain-mcp-adapters](https://github.com/langchain-ai/langchain-mcp-adapters) | Wrap any MCP server as LangChain Tool | 30m |
| 5 | [JR Academy AI Engineer Bootcamp](https://jiangren.com.au/learn/ai-engineer-bootcamp-2026) | 7 PBL projects: stdio → SSE → Lambda | 4 wk |

Don't read the whole spec. Two sections gets 95% of the value. The remaining 198 pages will trap you for a weekend with no payoff.

---

## Minimum viable server

```python
from mcp.server.fastmcp import FastMCP
import httpx

mcp = FastMCP("github-tools")

@mcp.tool()
async def list_repos(username: str) -> list[dict]:
    """List public repos for a GitHub user."""
    async with httpx.AsyncClient() as client:
        r = await client.get(
            f"https://api.github.com/users/{username}/repos",
            params={"per_page": 20}
        )
        r.raise_for_status()
        return [{"name": x["name"], "stars": x["stargazers_count"]} for x in r.json()]

if __name__ == "__main__":
    mcp.run(transport="stdio")
```

Verify before touching Claude Desktop:

```bash
npx @modelcontextprotocol/inspector python github_server.py
# opens localhost:5173
```

Inspector first. Always. Saves ~80% of debugging time.

---

## Wire into Claude Desktop

```json
{
  "mcpServers": {
    "github-tools": {
      "command": "/Users/you/.pyenv/versions/3.12.1/bin/python",
      "args": ["/Users/you/dev/github_server.py"]
    }
  }
}
```

Config path: macOS `~/Library/Application Support/Claude/claude_desktop_config.json` · Windows `%APPDATA%\Claude\` · Linux `~/.config/Claude/`.

Then **fully Quit Claude (menu bar → Quit)**. Closing the window doesn't reload config.

---

## The three traps

### 1. `print()` poisons stdout

```python
# WRONG
print(f"Sending email to {to}")

# RIGHT
import sys
print(f"Sending email to {to}", file=sys.stderr)
```

70% of first-time failures. I lost 1.5 hours to a single leftover debug print.

### 2. Claude Desktop ignores `$PATH` and `~`

`command: "python"` → resolves against system Python → `ModuleNotFoundError`. Use absolute paths to your venv's `bin/python`.

### 3. Logs live on disk

```bash
# zshrc
alias mcptail='tail -f ~/Library/Logs/Claude/mcp*.log'
```

Most "Claude can't see my server" mysteries become 5-minute fixes once you read the actual error.

---

## Two security non-negotiables

**Filesystem**: never expose `~`. Always `--read-only --exclude .*` and a specific subdirectory.

**Postgres**: never connect to the prod primary. Default read-only mode breaks if your connection string is admin. Use a read replica. A cohort learner once asked Claude to "clean up some test data" — half a million `users` rows got `DELETE`d.

---

## 12-week plan

| Weeks | Focus | Output |
|-------|-------|--------|
| 1-2 | Spec + hello server | Tool round-trips through Claude Desktop |
| 3-5 | All 4 primitives | One project per primitive |
| 6-8 | LangChain adapter + SSE + Lambda | HTTPS endpoint live |
| 9-11 | Real-business server | Resume-grade GitHub repo |
| 12 | README + mock interview | 90-second pitch |

Maps to JR Academy's [AI Engineer Bootcamp 2026](https://jiangren.com.au/learn/ai-engineer-bootcamp-2026) Phase 2. Full curriculum (286 lessons, 869 steps) open at [github.com/JR-Academy-AI/jr-academy-ai](https://github.com/JR-Academy-AI/jr-academy-ai).

---

## What this is worth in AU

312 Sydney + Melbourne AI Engineer JDs scraped Oct 2024 → Apr 2025. **47% mention MCP, Claude Skills, or "Anthropic ecosystem familiarity."** Up from <8% twelve months earlier. Recruiters at Atlassian, Canva, SafetyCulture now ask literally: "have you shipped an MCP server, can you show me?"

A cloneable GitHub repo with working config in the README clears a bar 90% of applicants don't reach.

---

If your bottleneck is async Python rather than MCP, [匠人学院 Python path](https://jiangren.com.au/learn/python) covers the asyncio gap. Full AI Engineer path: [jiangren.com.au/learn/ai-engineer](https://jiangren.com.au/learn/ai-engineer). Bootcamp: [jiangren.com.au/bootcamp](https://jiangren.com.au/bootcamp).

If you ship a server, drop the repo URL in the comments. I'll read it.

— JR Academy AI Engineer faculty, May 2026
