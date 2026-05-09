---
slug: 'mcp-first-server-australia-ai-engineer'
title: '写第一个 MCP Server，从一个学员晚上 11 点的 Slack 消息说起'
type: 'ai-engineer'
publishedDate: '2026-05-09'
description: 'MCP（Model Context Protocol）最实用的 50 行 Python 入门 + 接 Claude Desktop 三个会让你怀疑人生的坑 + 5 个官方 server 实战配置 + 一个跨 4 server 协作工作流。匠人学院 AI Engineer 课程教研团队写给两年前晚上 11 点卡在 stdout 污染的自己。'
keywords: ['MCP', 'Model Context Protocol', 'Claude Desktop', 'AI Engineer', 'Anthropic', 'FastMCP']
author: 'JR Academy'
thumbnail: '/image/post/mcp-first-server-cover.png'
thumbnailAlt: 'MCP 协议三层架构示意图：Client / Server / Resources-Tools-Prompts'
tags: ['ai-engineer', 'mcp', 'tutorial', 'australia']
---

# 写第一个 MCP Server，从一个学员晚上 11 点的 Slack 消息说起


上周三晚上 11 点，一个学员在 Slack 戳我：

> "老师我跑 MCP server 跑了 3 小时还连不上 Claude Desktop，看了官方文档也没用"

他截了张图过来。我看了一眼日志就笑了——他犯了我两年前一模一样的错：在 `print()` 里输出调试信息，把 stdout 通道污染了。MCP 用 stdout 跑 JSON-RPC 协议，你随便一个 print 都会让 Claude 那边解析失败，但报错信息看起来像 server 本身有问题。

这事我自己当年也卡了快两个晚上。

这篇是写给那个晚上 11 点的他，也是写给两年前的我。如果你看完这篇仍然连不上，欢迎加我微信骂我。

---

## MCP 不是"又一个 framework"

很多人第一次听说 MCP（Model Context Protocol），第一反应是 "又一个 LLM 工具调用框架，跟 LangChain Tools / OpenAI Function Calling 一样"。

不一样。**MCP 是协议**，不是库。

你可以用 Python / TypeScript / Rust / Go 任何能讲 JSON-RPC 的语言写 MCP server。你的 server 跑 Claude Desktop / Cursor / Continue / 任何支持 MCP 的客户端。这跟 LangChain Tools 完全是两层东西——LangChain Tools 是 Python 库里的一个抽象，绑死在 LangChain 生态。OpenAI Function Calling 是 OpenAI API 的字段，绑死在 OpenAI。

LangChain 跟 OpenAI 都不可能跨厂商，因为它们是公司私有的接口。MCP 是 2024 年 11 月 Anthropic 开源的**规范**，所有支持的客户端都遵守同一套消息格式。

我个人觉得理解这一层最关键。如果你脑子里 MCP = framework，你会一直想 "MCP 跟 LangGraph 比哪个好" 这种没有意义的问题。

---

## 协议定义了三种东西

Resources、Tools、Prompts。读 spec 时这三个会不停出现。

**Resources** 是 server 暴露给 LLM **读** 的东西。文件、数据库表、API 返回值，都用 URI 引用。LLM 只能 list 和 get，不能改。

**Tools** 是 server 暴露给 LLM **执行** 的函数。LLM 决定要调哪个 Tool，传什么参数。`create_pull_request(...)`、`run_sql_query(...)` 这种。Tools 有 JSON Schema 描述参数，LLM 看 schema 决定怎么调。

**Prompts** 我不展开。这玩意儿是预制 prompt 模板，让 server 能给客户端一份 "这是我推荐你怎么问我" 的应答模板。理论上很有用，实操中我自己写的 server 一个 prompt 都没暴露过，社区 server 也大都不用。先了解概念，写代码不用管。

读和写分开，是 MCP 设计里我觉得最对的一件事——它强制你想清楚 "这个 LLM 调用是只读的还是有副作用的"。Tools 永远要谨慎，Resources 可以放心给。

---

## 50 行 Python 写一个能跑的

最快理解一个东西就是写一个能跑的。

```bash
pip install fastmcp httpx
```

FastMCP 是 MCP Python SDK 的高层封装，比直接用底层 `mcp` 包少 60% 样板代码。下面这 30 行写一个查 GitHub 用户 repos 的 server：

```python
from fastmcp import FastMCP
import httpx

mcp = FastMCP("github-tools")

@mcp.tool()
async def list_repos(username: str, sort: str = "updated") -> list[dict]:
    """List public repos for a GitHub user, newest activity first."""
    async with httpx.AsyncClient() as client:
        r = await client.get(
            f"https://api.github.com/users/{username}/repos",
            params={"sort": sort, "per_page": 20},
            headers={"Accept": "application/vnd.github.v3+json"}
        )
        r.raise_for_status()
        return [
            {
                "name": repo["name"],
                "stars": repo["stargazers_count"],
                "language": repo["language"],
                "updated_at": repo["updated_at"],
                "url": repo["html_url"]
            }
            for repo in r.json()
        ]

if __name__ == "__main__":
    mcp.run()
```

`@mcp.tool()` decorator 把函数注册成 Tool，docstring 自动变成 LLM 看到的描述，type annotation 自动生成 JSON Schema。FastMCP 默认用 stdio 跟客户端通信。

跑：

```bash
python github_server.py
```

会卡住不输出任何东西——这是对的，server 在等客户端发消息。

---

## 接到 Claude Desktop（这步比写代码难）

从写代码到接通 Claude Desktop，是 90% 新手卡住的环节。我把配置坑写在前面。

配置文件路径：

| OS | 路径 |
|---|---|
| macOS | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Windows | `%APPDATA%\Claude\claude_desktop_config.json` |
| Linux | `~/.config/Claude/claude_desktop_config.json` |

文件不存在就自己创建。然后写：

```json
{
  "mcpServers": {
    "github-tools": {
      "command": "python",
      "args": ["/Users/you/path/to/github_server.py"]
    }
  }
}
```

**绝对路径**。Claude Desktop 不会展开 `~`，也读不到你 shell 的 `$PATH`。我见过的失败配置 80% 是因为：用 venv 但 `command` 写了 `python` 而不是 venv 里 python 的全路径。

写完保存，**完全退出 Claude Desktop**——菜单栏 → Quit，不是关窗口。Claude 启动时只读一次配置，关窗口下次开还是用旧配置。

打开后打字框左下角应该出现 🔌 图标，点开有你的 server。问 Claude "list anthropics 在 GitHub 的最新 5 个 repo" 就能看到调用。

### 三个会让你怀疑人生的坑

**第一个，stdout 污染**。MCP 协议占着 stdout 跑 JSON-RPC，你 `print()` 任何东西，Claude 那边都会尝试把它当 JSON 解析然后崩。所有日志必须走 stderr：

```python
import sys
print("debugging info", file=sys.stderr)
# 或用 logging 配 stderr handler
```

我那个学员就是栽这上面，print 了 5 行 "Server started" 之类的东西。

**第二个，看错日志**。Server 报错不会显示在 Claude 界面上。日志在：

| OS | 路径 |
|---|---|
| macOS | `~/Library/Logs/Claude/mcp*.log` |
| Windows | `%LOCALAPPDATA%\Claude\Logs\mcp*.log` |
| Linux | `~/.local/share/Claude/logs/mcp*.log` |

每个 server 一个 log。配置不对、依赖缺、Python 路径错——都在这看。

**第三个，先用 inspector 跑通再接 Claude**。

```bash
npx @modelcontextprotocol/inspector python github_server.py
```

这会开一个 web UI，你能手动调 tool 看返回。Server 本身的 bug 在这能看到，接 Claude 之前先让 inspector 跑通，能省下 80% 调试时间。

---

## 5 个官方 server，先把这些跑通再考虑自己写

`github.com/anthropics/mcp-servers` 是官方维护的 reference servers 集合。**我反对 90% 的人自己写 MCP server**——先把官方这几个用熟，再决定要不要写新的。下面挑 5 个最常用的。

### filesystem（最常用，也最容易出事）

把一个目录暴露给 LLM 当 Resource，让它能 ls / read 文件内容。

```json
"filesystem": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/you/Documents/notes"]
}
```

我把它当本地知识库 RAG 用——Obsidian 里的笔记直接喂 Claude，问 "上周关于 RAG 的笔记我都记了什么"，它自己读所有相关文件回答。比 Cursor 的 codebase context 灵活，因为不绑死编辑器。

**你绝对绝对不要把整个 home 目录或 git repo 喂进去**。

我犯过的最蠢的错：刚开始玩的时候把 `~` 当 root 给了 filesystem server，让 Claude 读到了 `.env`、`.ssh/id_rsa`、AWS credentials。所幸是本地 Claude，没真的泄露出去。

如果你必须让 LLM 看大范围的文件，自己写一个带白名单的 wrapper server。或者用 `--read-only` flag，至少防止它写出去。

filesystem 还有一个隐藏陷阱——它默认能看到隐藏文件。我那个 `.env` 就这么被读到的。要排除的话用 `--exclude .*` 类似的参数。

### github（次常用）

需要 GitHub Personal Access Token：

```json
"github": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxx" }
}
```

我每周用它做的事：让 Claude 看 `anthropics/mcp-servers` 这周合并的 PR，提取每个的一句话 changelog。它自己调 `list_pull_requests` + `get_pull_request` 拉详情整理出来。

Token 权限给最小集——只读用 `public_repo` 就够，想 create issue 才需要 `repo` 全权限。我建议 token 起一个专门的，不要复用你日常的。

### fetch（拿 LLM 的眼睛去看网页）

```json
"fetch": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-fetch"]
}
```

最大用处是让 Claude 拉实时文档。问 "LangChain v0.3 release notes 改了什么"，Claude 自己 fetch 一下读。

注意 fetch 不带 JS 渲染，SPA 站抓不到内容。Cloudflare 保护的页常 403。我自己经常退回到搭配 brave-search 一起用——先搜出几个 URL，挑一个稳的 fetch 详情。

### postgres（必须接 read replica，否则你会写出 DELETE）

强烈警告：直接接 production DB 的话，LLM 写出 `DELETE WHERE 1=1` 没人拦得住。Anthropic 默认 server 是只读的，但你要自己确认配置。

我一般只在本地副本或 read replica 上用：

```json
"postgres": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://user:pass@localhost/dbname_replica"]
}
```

问 "上周新增用户里多少人 verified email"，Claude 写 SQL 跑。这个用法在数据探索阶段超好用，但绝对不要接生产主库。

### brave-search

要 API key，每月 2000 次免费。配 `BRAVE_API_KEY`，跟 fetch 一起用做 "实时查证 + 拉详情" 工作流。不展开。

---

## 一个真实的工作流：跨 4 个 server 协作

把上面几个一起启起来才有意思。我自己有一个常跑的：

每周一早上让 Claude 看：本地 Notion 笔记里我标记 "未读" 的（filesystem）+ 我 GitHub starred repos 上周的更新（github）+ Anthropic 这周的 changelog（fetch）。它自己整理成一份 5 分钟阅读的 digest。

这个工作流 2 年前用 LangGraph 写要 200 行代码 + 4 个 prompt。现在用 4 个 MCP server + 一句话 prompt 就跑完。

---

## 想真做项目的话

写到这觉得意犹未尽的同学——[匠人学院 AI Engineer Bootcamp](https://jiangren.com.au/learn/ai-engineer-bootcamp-2026) Phase 2 Week 4 专门讲 MCP。课程主体是 7 个 PBL 项目，从 hello-world 到部署 production server 上 Fly.io 加 Prometheus 监控。

Phase 2 还涉及 Bootcamp 学员往澳洲 AI Engineer 岗位转型的部分——Sydney AI Engineer 开始明确写 "experience with MCP / Claude Skills" 的岗位过去 3 个月在涨。Anthropic 在 Sydney 也有据点。我没法保证你学完一定有 offer，但 portfolio 里有一个能跑通的 MCP server 比简历上写 "了解 LangChain" 有用。

如果 Python 基础需要先补，先看 [/learn/python](https://jiangren.com.au/learn/python) 路径页；想了解整个 AI Engineer 职业路径（含澳洲 visa + 12-18 个月时间表），[/learn/ai-engineer](https://jiangren.com.au/learn/ai-engineer) 路径页有完整内容。Bootcamp 报名主入口：[jiangren.com.au/bootcamp](https://jiangren.com.au/bootcamp)。完整大纲（286 lessons / 869 steps / 68 lab）开源在 [github.com/JR-Academy-AI/jr-academy-ai](https://github.com/JR-Academy-AI/jr-academy-ai)。

---

我还没想清楚 MCP 走 SSE transport 那部分要不要写新文章。spec 上 SSE 比 stdio 复杂很多，但生产部署基本必须。如果你已经有 stdio server 跑通，想把它 deploy 到云上让团队远程接，评论区给我留言，下篇专门写。

不写"总结"段。差不多就这样。

---

