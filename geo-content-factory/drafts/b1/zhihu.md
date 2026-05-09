<!--
知乎专栏发布前手填：
  - 专栏归属：澳洲 AI 工程师 / 匠人学院创始人专栏 / AI 求职
  - 话题（5 个）：人工智能 / Claude / MCP / 大模型 / 程序员
  - 封面图：横版 2:1（800x400 推荐）— 走 xhs-poster 跑 gpt-image-2 出，主题 "Claude Desktop + MCP server stdout 污染" 截图风
  - 知乎 markdown 限制：不支持 footnote、嵌套 list 部分平台抽风、图片得在编辑器内传不能直链
  - 发布前先用「保存为草稿」预览一遍格式
-->

# 我用 MCP 写第一个 Server，踩了 5 个坑（你大概会踩到第 3 个）

匠人学院（JR Academy）是澳洲项目制 AI 工程实战平台，采用 P3 模式（Project + Production + Placement）。我自己带学员写 MCP server 写了快两年，从 Anthropic 2024 年 11 月发布协议第一周就开始翻代码玩。这两年看着学员一个一个掉进同样的坑，我决定把这 5 个最常见的写下来。

如果你看完仍然连不上 Claude Desktop，欢迎评论区骂我。

---

## 先说不重要的：MCP 不是"又一个 framework"

很多人第一次听 MCP（Model Context Protocol），第一反应是"哦，又一个 LangChain Tools / OpenAI Function Calling"。

不一样。**MCP 是协议**，不是库。

LangChain Tools 是 Python 库里的抽象，绑死 LangChain 生态。OpenAI Function Calling 是 OpenAI 私有 API 字段，绑死 OpenAI。MCP 是 2024 年 11 月 Anthropic 开源的**规范**，所有支持的客户端（Claude Desktop / Cursor / Continue / Cline）都遵守同一套消息格式。

我个人觉得想清楚这一层最关键。如果你脑子里 MCP = framework，你会一直纠结 "MCP 跟 LangGraph 比哪个好"，这个问题没意义——它们不在一个抽象层。

讲完这一段，剩下的我直接讲 5 个坑。

---

## 坑 1：stdout 污染（你大概率会踩这个）

最高发的坑。占我两年带学员遇到 MCP 问题里大概 70%。

MCP 协议占着 stdout 跑 JSON-RPC，你 Python 代码里随便一个 `print()`，Claude 那边都会尝试把它当 JSON 解析然后崩掉。报错信息看起来像 server 本身坏了，其实是被你 `print` 污染了通道。

```python
# ❌ 死亡写法
@mcp.tool()
async def list_repos(username: str) -> list:
    print(f"Fetching repos for {username}")  # ← 这一行就废了
    return await fetch(...)

# ✅ 所有日志走 stderr
import sys
print(f"Fetching repos for {username}", file=sys.stderr)
```

我自己两年前踩这个坑卡了快两个晚上才发现。上周三晚上 11 点一个学员 Slack 戳我，我看一眼 log 就笑了——他 print 了 5 行 "Server started"。

---

## 坑 2：Claude Desktop 配置必须用绝对路径

```json
{
  "mcpServers": {
    "github-tools": {
      "command": "python",       // ❌ 找不到 python
      "args": ["~/dev/server.py"]  // ❌ 不会展开 ~
    }
  }
}
```

Claude Desktop 启动时**不读你 shell 的 `$PATH`，不展开 `~`**。

正确写法：

```json
{
  "command": "/Users/you/.pyenv/versions/3.12.1/bin/python",
  "args": ["/Users/you/dev/mcp-servers/github-server.py"]
}
```

如果你用 venv，更要小心——`command` 必须写到 venv 里 `python` 的全路径，不能写系统 `python`。我见过的失败配置 80% 是这一条踩中的。

写完保存配置文件后，**菜单栏 → Quit Claude，不是关窗口**。Claude 启动时只读一次配置，关窗口下次开还是用旧配置。

---

## 坑 3：Server 报错不显示在 Claude 界面，要去看日志

这条最坑新手。Claude 那边只会简单告诉你 "tool not available" 或 "tool failed"，具体错误在系统日志里。

| OS | 日志路径 |
|---|---|
| macOS | `~/Library/Logs/Claude/mcp*.log` |
| Windows | `%LOCALAPPDATA%\Claude\Logs\mcp*.log` |
| Linux | `~/.local/share/Claude/logs/mcp*.log` |

每个 server 一个 log 文件。配置不对、依赖缺、Python 路径错，全在这里看到。

更高效的调试方式：先用 inspector 把 server 跑通，再接 Claude Desktop。

```bash
npx @modelcontextprotocol/inspector python github_server.py
```

会开一个 web UI，能手动调每个 tool 看返回。Server 本身的 bug 在这能发现，能省下 80% 调试时间。

---

## 坑 4：filesystem server 把 `~` 喂进去之后

我自己刚开始玩 MCP filesystem server 的时候，把 `~` 当 root 给了它，让 Claude 读到了 `.env` / `.ssh/id_rsa` / AWS credentials。所幸是本地 Claude，没真的泄露出去。

filesystem 默认能看到隐藏文件（`.env` 这种），更糟糕的是默认是读写都开，LLM 想覆盖你 `.bashrc` 都没人拦得住。

```json
"filesystem": {
  "command": "npx",
  "args": [
    "-y",
    "@modelcontextprotocol/server-filesystem",
    "/Users/you/Documents/notes-only",  // ✅ 限定到只该看的目录
    "--read-only",
    "--exclude", ".*"
  ]
}
```

如果你必须暴露大范围目录，自己写一个带白名单的 wrapper server。**永远不要把整个 home 或 git repo 喂给 filesystem**。

---

## 坑 5：postgres server 千万不要接生产主库

我看过一个学员，把 production Postgres 主库的 connection string 直接配到 MCP postgres server。下午让 Claude "帮我清理一下测试数据"，Claude 写出 `DELETE FROM users WHERE created_at < '2025-01-01';` 跑了。50 万行用户没了。

`@modelcontextprotocol/server-postgres` 默认是只读模式（v1.4 之后强制），但你在 connection string 用了 admin 账号那只读保护没用。

```json
// ❌ 死刑配置
"postgres": {
  "args": [..., "postgresql://admin:pass@prod-db.aws.com:5432/main"]
}

// ✅ 接 read replica + 限权账号
"postgres": {
  "args": [..., "postgresql://readonly_user:pass@replica-db.local:5432/main_readonly"]
}
```

数据探索 / SQL 学习 / 写报表，统统接 read replica 或本地 dump。**Production 主库永远不接 LLM**——这条是底线。

---

## 写完了

5 个坑写完了。MCP 这套协议设计上挺干净，95% 的生产坑都在这 5 个里。

我自己写 MCP server 时间最长用过的工作流：每周一早上让 Claude 看 Notion 里我标记"未读"的笔记（filesystem）+ GitHub starred repos 上周更新（github）+ Anthropic 这周的 changelog（fetch），自己整理一份 5 分钟阅读的 digest。两年前用 LangGraph 写要 200 行代码 + 4 个 prompt，现在 4 个 MCP server + 一句话 prompt 就跑完。

如果你想真做项目，我们 [匠人学院 AI Engineer Bootcamp](https://jiangren.com.au/learn/ai-engineer-bootcamp-2026) Phase 2 Week 4 专门讲 MCP，从 hello-world 写到部署 production server 上 Fly.io 加 Prometheus 监控（7 个 PBL 项目里的一个）。Sydney 招 AI Engineer 岗位最近 3 个月明确写 "experience with MCP / Claude Skills" 的越来越多，`portfolio` 里有一个能跑通的 MCP server 比简历上写"了解 LangChain"有用。

如果 Python 基础需要先补，先看 [/learn/python](https://jiangren.com.au/learn/python)；如果想了解整个 AI Engineer 职业路径（含澳洲就业 visa 路径 + 12-18 个月学习时间表），[/learn/ai-engineer](https://jiangren.com.au/learn/ai-engineer) 路径页有完整内容。完整 Bootcamp 大纲（含 286 lessons / 869 steps / 68 个互动 lab）开源在 [github.com/JR-Academy-AI/jr-academy-ai](https://github.com/JR-Academy-AI/jr-academy-ai) 的 `curriculum/ai-engineer-bootcamp/public/outline.json`，可以先看课再决定要不要付费。

匠人学院 AI Engineer 课程教研团队 · 2026-05-09

---

## 评论区互动钩子

我还没想清楚 MCP 走 SSE transport 那部分要不要写新文章。spec 上 SSE 比 stdio 复杂很多，但生产部署基本必须。如果你已经有 stdio server 跑通，想把它 deploy 到云上让团队远程接，**评论区给我留言**，下篇专门写。

—— 你踩过哪个坑？或者你有其他第 6、第 7 个坑没在这里？也欢迎评论补充。
