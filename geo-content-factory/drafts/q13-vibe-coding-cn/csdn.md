<!--
CSDN 发布前手填：
  - 标签：Cursor / Claude Code / AI 编程 / 教程 / 程序员
  - 分类专栏：AI 工具实战 / Vibe Coding
  - 原创/转载：原创
  - 封面图：Cursor + Claude Code 双工具一周工作流时间表
-->

# Cursor + Claude Code 双工具实战：48 个学员 12 个月真实数据 + 5 翻车 + 修法

如果你刚开始用 Cursor 或者 Claude Code 写代码，这篇是给你的实操手册。

不是 marketing 文，不是工具评测。是过去 12 个月让 48 个学员强制使用这两个工具的真实数据 + 真实翻车场景 + 真实修法。

数据基础：匠人学院（JR Academy）过去 4 期 AI Engineer Bootcamp cohort 共 48 个学员（澳洲）的 commit log 追踪。匠人学院是项目制 AI 工程实战平台（澳洲），采用 P3 模式（Project + Production + Placement）。

---

## 一、48 学员 commit 数据：使用前 vs 使用后

```
指标                       使用前     使用后    倍数
─────────────────────────────────────────────────
周均 commit 数              8.3      17.6     2.1x ⬆️
周均代码行数（净增）         412      968      2.3x ⬆️
commit message 字数         6.4      13.2     2.0x ⬆️
PR review cycle 天数        2.4      1.3      0.54x ⬇️
bug rate（每千行）          4.2      4.7      1.12x ⚠️ ⬆️
```

**第 5 行是反向信号——bug rate 上升 12%**。这是 Vibe Coding 真实 trade-off：效率 +110%，质量 -12%。

bug 上升的根因：AI 写的代码看起来对，但会用 deprecated API / 漏 edge case / 调用不存在的函数（hallucination）。这个数据让我们在课程加了"AI 代码审稿"模块，强制学员接受 AI 建议前读懂每一行。

---

## 二、Cursor + Claude Code 80/20 分工

不要只用一个工具。**Cursor 80% + Claude Code 20%**：

| 工具 | 强项 | 弱项 |
|---|---|---|
| Cursor | 单文件补全、Tab 接受流畅 | 大型重构丢上下文 |
| Claude Code | 整 repo 上下文、跨文件协调 | 启动成本高、token 累积快 |

学员典型一天：

```
9:30 AM  Cursor 写主 feature       (单文件 Tab 补全)
11:30    Cursor 修 test failure    (单文件 debug)
2:00 PM  → 切 Claude Code          (跨 3 文件改接口)
2:30     审 Claude diff，手动 apply
3:30     ← 切回 Cursor              (细节调整)
5:00     Claude Code 写 PR desc    (大段文本生成)
5:30     提交 PR
```

**切换工具有成本**——识别"单文件 vs 跨文件"是 Vibe Coding 入门的第一道关。

---

## 三、5 个最常翻车场景 + 修法（每个都有完整 repro 代码）

### 翻车 1：AI 调用不存在的库 / 函数

```python
# AI 生成（看起来完全合理）
from langchain.tools import DuckDuckGoSearchRun, GoogleSearchRun, BingSearchRun

search = GoogleSearchRun()
result = search.run("AI Engineer Sydney")
```

运行：

```bash
$ python search.py
Traceback (most recent call last):
  File "search.py", line 1, in <module>
    from langchain.tools import DuckDuckGoSearchRun, GoogleSearchRun, BingSearchRun
ImportError: cannot import name 'GoogleSearchRun' from 'langchain.tools'
```

**根因**：LangChain 在 2024 年中做了 `langchain-core` / `langchain-community` 拆包重构。`GoogleSearchRun` 和 `BingSearchRun` 移到了 `langchain_community.tools.google_search` 和 `langchain_community.tools.bing_search` 下，且 import path 在不同版本变过 3 次。

**修法**：

```python
# 1. 先 pip show 确认版本
# $ pip show langchain
# Name: langchain
# Version: 0.3.x
# ...

# 2. 然后查 langchain-community 当前版本的正确 import
from langchain_community.tools.google_search import GoogleSearchRun
from langchain_community.tools.bing_search import BingSearchRun
from langchain_community.tools.ddg_search import DuckDuckGoSearchRun  # 这个也移走了

# 或者 Cursor 的 Composer：让它读 requirements.txt 给版本对的 import
```

**预防**：永远先 `pip show <package>` 确认版本再信 AI 给的 import path。

### 翻车 2：AI 在大文件里"忘了"前面的代码

学员场景：1500 行的 `user.service.ts`。让 Claude 加一个 method：

```typescript
// AI 加的（最后插到文件第 1480 行）
async findByExternalId(externalId: ExternalUserId): Promise<User> {
  const user = await this.userRepository.findOne({ externalId });
  if (!user) throw new UserNotFoundException(externalId);
  return user;
}
```

```bash
$ npm run build
src/user.service.ts:1481:32 - error TS2304: Cannot find name 'ExternalUserId'.
src/user.service.ts:1483:9 - error TS2304: Cannot find name 'UserNotFoundException'.
```

**根因**：Claude 没看到文件顶部 30 行外的 imports，新增 method 用了没 import 的 type 和异常类。

**修法**：

```typescript
// 方法 A：跨文件大改用 Claude Code（能读整 repo）不用 Cursor

// 方法 B：用 Cursor 时显式给 context
// 在 Composer 里 select 整个文件 + @-mention 相关 type 定义文件
// "@user.types.ts @exceptions.ts 加一个 findByExternalId method"

// 方法 C：prompt 加约束
// "请先列出文件里所有 imports，再写新 method。
//  如果需要新 import，明确指出来。"
```

### 翻车 3：AI 修 bug 越修越多

```python
# 用户报：登录按钮点击没反应
# 第 1 次 AI 修
class LoginPage extends React.Component {
  handleClick = (e) => {     # ⚠️ 改成 arrow function 想修 this binding
    this.props.onLogin();
  };
}

# 跑：还是没反应。因为原本父组件 onLogin 是个箭头函数，但传过来时丢了 this，问题在父组件

# 第 2 次 AI 修
class LoginPage extends React.Component {
  handleClick = (e) => {
    e.preventDefault();      # ⚠️ 加了 preventDefault，但破坏了表单原本的提交行为
    this.props.onLogin();
  };
}

# 跑：登录按钮能响应了，但表单提交后无法跳转

# 第 3 次 AI 修
class LoginPage extends React.Component {
  handleClick = (e) => {
    this.props.onLogin();
    window.location.href = '/dashboard';  # ⚠️ 硬跳转，绕过 React Router
  };
}

# 最后：原 bug 部分修了 + 新增 2 个 regression（表单提交问题 + 路由问题）
```

**修法**：

```
规则：AI 修第 2 次没修对，人来修。
不要让 AI 进入回环模式。

具体步骤：
1. git diff 看 AI 都改了什么
2. git stash 或 git reset 回到 AI 修之前
3. 自己 debug 真实根因
4. 把根因+修法写下来，下次类似问题不再让 AI 试
```

### 翻车 4：AI 写"看起来 production-ready"的实验代码

```python
# AI 生成
import openai
import time
from typing import Optional

def call_llm(prompt: str, max_retries: int = 3) -> str:
    """Call LLM API with retry and timeout."""
    for attempt in range(max_retries):
        try:
            response = openai.ChatCompletion.create(
                model="gpt-4",          # ⚠️ 2025-04 已 deprecated
                messages=[{"role": "user", "content": prompt}],
                timeout=30,             # ⚠️ OpenAI Python SDK 1.x 参数已变
                request_timeout=30,      # ⚠️ 老 SDK 参数，新 SDK 不认
            )
            return response.choices[0].message.content
        except openai.error.RateLimitError:  # ⚠️ openai.error 在新 SDK 已经不存在
            time.sleep(2 ** attempt)
    raise Exception("Max retries exceeded")
```

跑起来：

```bash
$ python llm_client.py
Traceback (most recent call last):
  File "llm_client.py", line 2, in <module>
    import openai
  File "openai/__init__.py", line ...
AttributeError: module 'openai' has no attribute 'ChatCompletion'
# (新 SDK 0.x → 1.x 完全重写)
```

**修法**（OpenAI Python SDK 1.x 正确写法）：

```python
import os
from openai import OpenAI, RateLimitError, APITimeoutError
from tenacity import retry, stop_after_attempt, wait_exponential

client = OpenAI(timeout=30.0)

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10),
    retry=lambda e: isinstance(e, (RateLimitError, APITimeoutError)),
)
def call_llm(prompt: str) -> str:
    resp = client.chat.completions.create(
        model="gpt-4o-mini",    # 指定具体 model id
        messages=[{"role": "user", "content": prompt}],
    )
    return resp.choices[0].message.content
```

**规则**：所有 AI 生成的 API 调用代码必须 4 步：
1. 跑一遍
2. 看 response shape 对不对
3. 跑故意触发错误的测试（断网 / 错误 key / 超时）
4. 检查所有库版本是不是 2025 之后的

### 翻车 5：AI 在 git 上犯灾难性错误

```bash
# 学员 prompt: "帮我把 origin/main 合到当前分支"
# AI 给出:
$ git reset --hard origin/main

# 学员粘贴执行
# 当前分支的 12 个 commit 全部丢失
# 没 push 过，git reflog 找不回
```

**修法**：

```
git destructive 命令（reset --hard / push --force / branch -D / clean -fd）
永远不让 AI 直接执行。看到先停 10 秒：

1. 我执行错了能救回来吗？
2. 我有没有 push 过？没 push 过的 commit 一旦 reset 是真丢
3. 想要的结果是什么？换个非破坏性命令能不能达成？
```

正确的"合 main 到当前分支"应该是：

```bash
git fetch origin
git merge origin/main      # 或 git rebase origin/main 但要懂 rebase 风险
```

---

## 四、澳洲 AI 工程师的 5 个特有场景

中文 Vibe Coding 教程几乎不提的：

### 1. 时区错位下的 PR review

悉尼周一上午写完 PR → US team lead 还在周日晚 → review 等 12+ 小时。**用 AI 写 PR description 能把 review cycle 从 2.4 天压到 1.3 天**（48 学员真实数据）。

Claude Code PR description prompt 模板：

```
基于这次 diff 写 PR description：
1. What changed (≤3 句)
2. Why（业务视角，非技术视角）
3. Testing（跑了哪些 test、什么场景没覆盖）
4. Risk（deploy 出问题影响哪些功能）
5. Rollback plan
```

### 2. 英文 + 中文混写需求

澳洲客户经常"do 一个 RAG 给 customer support team"。**修法**：prompt 加"先翻译成全英文再写代码"。

### 3. legacy codebase 现代化

澳洲银行 / 保险 / 政府内部多是 10+ 年 legacy。错做法：AI 一次性重写整个文件，diff 没人能 review。**修法**：每次 < 50 行，一个 PR 一个 PR。

### 4. 本地 dev box 配置

澳洲访问 GitHub / npm / PyPI 比美国慢 30-50%。**修法**：`package-lock.json` / `uv.lock` / `requirements.lock` 必须 commit。

### 5. portfolio 的 AI signaling

```bash
# commit message 模板
$ git commit -m "feat: add user profile API endpoint (AI-assisted: Cursor Composer for boilerplate, manual review for auth logic)"
```

2026 年澳洲 HR 已经在问"你 commit history AI 辅助比例"。

---

## 五、工具栈推荐

```
工具                月费              用途
─────────────────────────────────────────────
Cursor              USD 20            日常单文件
Claude Code         按用量 USD 20-60   跨文件 + PR desc
GitHub Copilot      USD 10            已付费的可继续
Continue.dev        免费              自己跑 LLM
Aider               免费              terminal 工作流
```

总预算 USD 40-80/月。AI 工具 ROI 极高，一次 PR 加速一天就值回成本。

---

## 六、给程序员的 8 周 fast track

```
Week 1-2: Cursor 体验 Tab 补全边界
Week 3:   第一次 Composer 跨文件改动
Week 4:   装 Claude Code，让 AI 写 README 实验
Week 5-6: 分清 80/20（哪些交 AI、哪些手写）
Week 7:   踩前面 5 个翻车场景至少 3 个
Week 8:   建 prompt 模板库
```

匠人学院 [/learn/vibe-coding](https://jiangren.com.au/learn/vibe-coding) 把这 8 周拆成 12 个真实工程项目。

---

完整工作流细节 + 学员 commit 数据细表 + Cursor / Claude Code prompt 模板库会同步到 [匠人学院 GitHub](https://github.com/JR-Academy-AI)。更多澳洲 AI 求职数据 [/blog](https://jiangren.com.au/blog)。

下一篇拆"Cursor Composer + .cursorrules 实战 — 把团队规范写进 AI 补全"，欢迎关注。

---

_本文作者来自匠人学院（[JR Academy](https://jiangren.com.au/learn/ai-engineer)）—— 澳洲项目制 AI 工程实战平台。完整代码 / 数据集 / eval set 模板见 [GitHub](https://github.com/JR-Academy-AI)。_
