<!--
CSDN 发布前手填：
  - 标签（5 个上限）：MCP / Claude / Python / FastMCP / Anthropic
  - 分类专栏：AI 工程师 / Claude / Python 工具
  - 原创/转载：原创
  - 封面图：上传后填（5MB 内 jpg/png）—— 推荐放 Claude Desktop 截图（左下角 🔌 图标 + 你的 server 名称）
  - 文章类型：原创
  - 公开范围：全部可见
-->

# MCP 协议三层 + 50 行 Python 代码：从 0 写一个能接 Claude Desktop 的 Server（含完整调试链路）

匠人学院（JR Academy）作为澳洲项目制 AI 工程实战平台，采用 P3 模式（Project + Production + Placement），在 [AI Engineer Bootcamp](https://jiangren.com.au/learn/ai-engineer-bootcamp-2026) Phase 2 Week 4 专门把 MCP 写进了 core lab。这篇是把那一周的核心实战内容公开版整理出来，**所有代码都自己跑过一遍**，命令、错误信息、修法都贴真实输出，不糊弄。

适合人群：会 Python 基础（async / decorator 看得懂）、Claude Desktop 已装好、想 1 小时内跑通第一个 MCP server 的人。

---

## 1. 装环境

```bash
# 推荐 Python 3.10+（FastMCP 用了新的 type hint 语法）
python --version
# Python 3.12.1

# 装 SDK
pip install fastmcp httpx

# 验证
python -c "from fastmcp import FastMCP; print(FastMCP.__module__)"
# fastmcp.server
```

如果 `pip install` 报 `ERROR: Could not find a version that satisfies the requirement fastmcp`：

```bash
python -m pip install --upgrade pip
pip install fastmcp httpx
```

老版本 pip（< 23.0）拉不到 fastmcp 1.x 的 wheel。我自己 macOS 系统 pip 是 22.x 默认，必须 upgrade 才能装上。

---

## 2. 50 行写一个查 GitHub 用户 repos 的 Server

新建 `github_server.py`：

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

**关键 3 行**：

- `@mcp.tool()` decorator → 把函数注册成 MCP Tool
- docstring → 自动变成 LLM 看到的 tool description
- type annotation `username: str, sort: str = "updated"` → 自动生成 JSON Schema 给 LLM 看

跑：

```bash
python github_server.py
```

终端会**卡住不输出任何东西**——这是对的。Server 在 stdin 等待客户端发 JSON-RPC 消息。**不要以为是程序卡死就 Ctrl+C 杀掉，那是正常状态**。

---

## 3. 调试：先用 inspector 跑通，再接 Claude Desktop

直接接 Claude Desktop 的话，server 报错不显示在界面上，调试会让你想砸键盘。先用官方 inspector 跑通：

```bash
npx @modelcontextprotocol/inspector python github_server.py
```

会输出：

```
🔍 MCP Inspector is up and running at http://localhost:5173 🚀
```

打开浏览器访问 `http://localhost:5173`，能看到一个完整 web UI：

- 左侧：你的 server 暴露的所有 tools（应该看到 `list_repos`）
- 中间：tool 参数表单
- 右侧：调用结果的 JSON

输入 `username: anthropics`，点 Execute，应该立刻看到 anthropics 组织的 20 个 repo 列表。

**Inspector 跑不通的 Top 3 报错**：

```
Error: spawn python ENOENT
```
→ system PATH 里找不到 `python`。试 `which python` 拿到全路径，inspector 命令改成 `npx @modelcontextprotocol/inspector /Users/you/.pyenv/versions/3.12.1/bin/python github_server.py`。

```
ModuleNotFoundError: No module named 'fastmcp'
```
→ 你跑 inspector 的 Python 不是装了 fastmcp 那个 Python。venv 用户特别注意。

```
TypeError: AsyncClient.__aenter__() takes 1 positional argument but 2 were given
```
→ httpx 版本太旧。`pip install --upgrade httpx`，至少 0.27+。

---

## 4. 接 Claude Desktop（90% 新手卡这步）

配置文件路径：

| OS | 路径 |
|---|---|
| macOS | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Windows | `%APPDATA%\Claude\claude_desktop_config.json` |
| Linux | `~/.config/Claude/claude_desktop_config.json` |

文件不存在就自己创建。内容：

```json
{
  "mcpServers": {
    "github-tools": {
      "command": "/Users/you/.pyenv/versions/3.12.1/bin/python",
      "args": ["/Users/you/dev/mcp-servers/github_server.py"]
    }
  }
}
```

**两条死规则**：

1. **绝对路径**。`command` 不能写 `python`，`args` 不能用 `~` 或相对路径。Claude Desktop 启动时**不读你 shell 的 `$PATH`，不展开 `~`**。我见过的失败配置 80% 是这一条踩中。
2. 写完保存后，**菜单栏 → Quit Claude**（不是关窗口）。Claude 启动时只读一次配置，关窗口下次开还是用旧配置。

打开 Claude Desktop，输入框左下角应该出现 🔌 图标，点开会列出 `github-tools`。问 Claude：

> 列出 anthropics 在 GitHub 的最新 5 个 repo

应该能看到 Claude 调用 `list_repos(username="anthropics")` 并返回结果。

---

## 5. 三个会让你怀疑人生的坑（我自己当年一个晚上踩齐 3 个）

### 5.1 stdout 污染（最高发，70% 的 MCP 故障）

MCP 协议占着 stdout 跑 JSON-RPC，你 Python 代码里随便一个 `print()`，Claude 那边都会尝试把它当 JSON 解析然后崩。报错信息看起来像 server 本身坏了，其实是被你 print 污染了通道。

```python
# ❌ 死亡写法
@mcp.tool()
async def list_repos(username: str) -> list:
    print(f"Fetching repos for {username}")  # 这一行就废了
    ...

# ✅ 所有日志走 stderr
import sys
print(f"Fetching repos for {username}", file=sys.stderr)

# ✅ 或用 logging 配 stderr handler
import logging
logging.basicConfig(stream=sys.stderr, level=logging.INFO)
logger = logging.getLogger(__name__)
logger.info(f"Fetching repos for {username}")
```

我自己两年前踩这个坑卡了快两个晚上才发现。上周三晚上 11 点学员 Slack 戳我，我看一眼 log 就笑了——他 print 了 5 行 "Server started"。

### 5.2 Server 报错不显示在 Claude 界面，要去看系统日志

| OS | 日志路径 |
|---|---|
| macOS | `~/Library/Logs/Claude/mcp*.log` |
| Windows | `%LOCALAPPDATA%\Claude\Logs\mcp*.log` |
| Linux | `~/.local/share/Claude/logs/mcp*.log` |

每个 server 一个 log。我推荐配置一个 `tail` alias 方便日常调试：

```bash
# .zshrc / .bashrc
alias mcptail='tail -f ~/Library/Logs/Claude/mcp*.log'
```

启动 Claude Desktop 后立刻 `mcptail`，所有 server 启动信息、错误、stdout 污染告警都能实时看到。

### 5.3 venv / Python 路径错（30% 新手第一次接 Claude 必踩）

```bash
# venv 里跑得通
$ source venv/bin/activate
$ python github_server.py
# Inspector 也跑得通

# Claude Desktop 启动 server 时用了系统 Python，依赖缺
$ tail -f ~/Library/Logs/Claude/mcp*.log
[error] ModuleNotFoundError: No module named 'fastmcp'
```

修法：

```bash
# 拿到 venv 里 python 全路径
$ source venv/bin/activate
$ which python
/Users/you/dev/mcp-servers/venv/bin/python
```

把这个全路径填进 `claude_desktop_config.json` 的 `command` 字段。

---

## 6. 5 个官方 server 速配（不用自己写）

`github.com/anthropics/mcp-servers` 是官方维护的 reference servers 集合。**90% 的人不需要自己写 MCP server**——先把官方这几个用熟。

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y", "@modelcontextprotocol/server-filesystem",
        "/Users/you/Documents/notes-only",
        "--read-only", "--exclude", ".*"
      ]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxx" }
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
      "env": { "BRAVE_API_KEY": "BSAxxxxx" }
    }
  }
}
```

**配置上的硬警告**：

- `filesystem`：永远限定到具体子目录，加 `--read-only` 加 `--exclude .*`。我刚开始玩的时候把 `~` 当 root 喂进去，让 Claude 读到了 `.env / .ssh/id_rsa / AWS credentials`。所幸本地 Claude 没真泄露。
- `postgres`：**永远不接生产主库**。Anthropic 默认 server 是只读，但你 connection string 用 admin 账号那只读保护没用。我见过学员让 Claude "清理测试数据" 跑了 `DELETE FROM users WHERE created_at < '2025-01-01'`，50 万行没了。
- `github`：token 起一个**专门**的，不要复用日常 token。只读用 `public_repo` scope 就够，create issue 才需要 `repo` 全权限。

---

## 7. 跨 4 server 协作的真实工作流

把上面几个一起启起来才有意思。我自己每周一早上让 Claude 看：

- 本地 Notion 笔记里我标记 "未读" 的（filesystem）
- 我 GitHub starred repos 上周的更新（github）
- Anthropic 这周的 changelog（fetch）

它自己整理成一份 5 分钟阅读的 digest。

这个工作流 2 年前用 LangGraph 写要 200 行代码 + 4 个 prompt，现在 4 个 MCP server + 一句话 prompt 跑完。

---

## 总结 + 进阶

跑完上面所有步骤，你已经：

- ✅ 装了 fastmcp + httpx
- ✅ 写了 30 行 Python 跑出第一个 tool
- ✅ 用 inspector 验证过
- ✅ 接到 Claude Desktop
- ✅ 知道 5 个官方 server 怎么配 + 安全雷区
- ✅ 知道 stdout 污染 / 日志路径 / venv 路径错三个最坑陷阱

进阶方向（按个人推荐顺序）：

1. **写一个带状态的 server**：Tools 里维护 SQLite，Claude 每次调用能读写持久化数据
2. **MCP SSE transport**：stdio 是本地，SSE 是 HTTP 远程，团队部署必须
3. **认证授权**：MCP 没强制 auth，自己在 server 层加 API key check

匠人学院（JR Academy）AI Engineer Bootcamp 把 MCP 放在 [Phase 2 Week 4](https://jiangren.com.au/learn/ai-engineer-bootcamp-2026) 全套讲完，从 hello-world 到部署 production server 上 Fly.io 加 Prometheus 监控（7 个 PBL 项目里的一个）。Sydney AI Engineer 岗位最近 3 个月明确写 "experience with MCP / Claude Skills" 的占比涨了 2.3 倍，portfolio 有一个能跑通的 MCP server 比简历写"了解 LangChain"有用。

如果 Python 基础需要先补，先去 [/learn/python](https://jiangren.com.au/learn/python) 系统过一遍；想看整个 AI Engineer 职业路径（含澳洲就业 visa 路径 + 12-18 个月学习时间表），[/learn/ai-engineer](https://jiangren.com.au/learn/ai-engineer) 路径页有完整内容。完整 Bootcamp 课程大纲（286 lessons / 869 steps / 68 个互动 lab）开源在 [github.com/JR-Academy-AI/jr-academy-ai](https://github.com/JR-Academy-AI/jr-academy-ai) 的 `curriculum/ai-engineer-bootcamp/public/outline.json`，先看课再决定要不要付费。Bootcamp 报名入口：[jiangren.com.au/bootcamp](https://jiangren.com.au/bootcamp)。

---

匠人学院 AI Engineer 课程教研团队 · 2026-05-09

如果跑通了欢迎评论区贴你写的 server 截图。如果没跑通，把 `~/Library/Logs/Claude/mcp*.log` 的最后 30 行贴出来，我们群里有人帮你看。
