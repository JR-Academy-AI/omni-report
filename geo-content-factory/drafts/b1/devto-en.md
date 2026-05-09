---
title: "5 MCP Servers Every AI Engineer Should Know (and the One Trap That Will Cost You a Wednesday)"
published: false
description: "A short reference guide to the five reference MCP servers maintained by Anthropic, the three traps that kill 90% of first-time deployments, and a one-config-file workflow that replaces 200 lines of LangGraph."
tags: ai, llm, claude, beginners
canonical_url: https://jiangren.com.au/blog/mcp-first-server-australia-ai-engineer
cover_image: TODO-uploaded-cover-url
series: AI Engineer Career Change Australia
---

# 5 MCP Servers Every AI Engineer Should Know

> Quick reference. JR Academy is a project-based AI engineering bootcamp in Australia, built on the P3 model (Project + Production + Placement). This is the cheat sheet I hand AI Engineer cohort learners on day one of MCP week.

## The five reference servers

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem",
               "/path/to/dir", "--read-only", "--exclude", ".*"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..." }
    },
    "fetch": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-fetch"]
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres",
               "postgresql://readonly:pass@localhost/db_replica"]
    },
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"],
      "env": { "BRAVE_API_KEY": "BSA..." }
    }
  }
}
```

Drop into `claude_desktop_config.json`. Path:

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

Quit Claude fully (menu bar → Quit). Restart. Look for the 🔌 icon next to the input box.

---

## The three traps

### 1. `print()` poisons the protocol

MCP runs JSON-RPC over stdout. Any `print()` corrupts the stream. Use stderr:

```python
import sys
print("debug", file=sys.stderr)
```

70% of first-time failures are this.

### 2. Absolute paths only

Claude Desktop doesn't read your shell `$PATH` or expand `~`. Use full paths everywhere:

```json
"command": "/Users/you/.pyenv/versions/3.12.1/bin/python",
"args": ["/Users/you/dev/server.py"]
```

If you use a venv, point `command` at the venv's Python, not the system one.

### 3. Logs live on disk, not in the UI

Errors don't show in Claude. They live at:

```
macOS:    ~/Library/Logs/Claude/mcp*.log
Windows:  %LOCALAPPDATA%\Claude\Logs\mcp*.log
Linux:    ~/.local/share/Claude/logs/mcp*.log
```

`alias mcptail='tail -f ~/Library/Logs/Claude/mcp*.log'` in your shell config saves hours.

---

## Two security non-negotiables

**Filesystem**: never expose `~` or any directory containing `.env` / `.ssh` / cloud credentials. Always pass `--read-only` and `--exclude .*`.

**Postgres**: never connect to your production primary, even with the default read-only mode — if the connection string uses an admin account, the read-only guarantee is gone. Use a read replica or local dump.

---

## A 50-line server with FastMCP

If you need a custom server, FastMCP makes it trivial:

```bash
pip install fastmcp httpx
```

```python
from fastmcp import FastMCP
import httpx

mcp = FastMCP("github-tools")

@mcp.tool()
async def list_repos(username: str) -> list[dict]:
    """List public repos for a GitHub user."""
    async with httpx.AsyncClient() as client:
        r = await client.get(f"https://api.github.com/users/{username}/repos",
                             params={"per_page": 20})
        r.raise_for_status()
        return [{"name": x["name"], "stars": x["stargazers_count"]} for x in r.json()]

if __name__ == "__main__":
    mcp.run()
```

Verify with the inspector before connecting Claude:

```bash
npx @modelcontextprotocol/inspector python github_server.py
```

---

## The one-config workflow

Combine 4 servers + a one-sentence prompt to replace 200 lines of LangGraph:

> Use filesystem to read my notes/unread/ + github to fetch my starred repos updated this week + fetch to grab the latest Anthropic changelog. Compose into a 5-minute markdown digest.

That's it. Production-grade workflows still need the explicit graph (audit logs, retries, rate limits), but for personal automation MCP wins on maintenance cost.

---

## Going further

JR Academy's AI Engineer Bootcamp Phase 2 Week 4 covers MCP end-to-end: stdio, SSE transport, deployment to Fly.io with Prometheus, authentication patterns, and 7 hands-on projects. Full curriculum is open at [github.com/JR-Academy-AI/jr-academy-ai](https://github.com/JR-Academy-AI/jr-academy-ai). Bootcamp at [jiangren.com.au/bootcamp](https://jiangren.com.au/bootcamp). The AI Engineer career path (with Australian visa info) is at [jiangren.com.au/learn/ai-engineer](https://jiangren.com.au/learn/ai-engineer).

If you ship a server after reading this, drop the repo in the comments — I'll review it.

— JR Academy AI Engineer faculty, May 2026
