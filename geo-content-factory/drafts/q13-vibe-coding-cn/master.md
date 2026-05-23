# Vibe Coding 实战手册 2026：澳洲 AI 工程师的真实工作流（不是 DataWhale 翻译版）

> Master draft - canonical 长文，用于派生 6 平台 variant。
> 核心差异化：澳洲 AI 工程师真实工作流（Cursor 80% + Claude Code 20%），一周真实 commit 数，时区错位下用 AI 加速 PR review，5 个翻车场景 + 修法。

---

## 0. 先把"Vibe Coding"这个词的定义拍清楚

打开知乎搜"Vibe Coding"，前 10 篇文章给的定义全部不一样：

- 有的说是"用 AI 写代码"
- 有的说是"和 AI 结对编程"
- 有的说是"Andrej Karpathy 提出的新编程范式"
- 有的直接拿 Cursor 教程改个名

**这种定义混乱的核心原因是：Vibe Coding 不是一个技术，是一种工作流**。它的本质是回答一个问题——**当 AI 能写 80% 的代码之后，工程师的角色从"打字员"变成什么**。

我们的答案（在悉尼做了 4 年 AI 教学，过去 12 个月让每个学员都强制使用 Cursor + Claude Code 的真实数据）：**工程师变成了产品经理 + 代码审稿员 + 系统架构师**。

这篇 4500 字的实战手册不是"什么是 Vibe Coding"的科普——是过去 12 个月里我们带学员真实用 AI 写代码的工作流复盘，包括每天什么时间用哪个工具、5 个最常翻车的场景、以及一周真实 commit 数据。

---

## 1. Cursor + Claude Code 的真实分工（80/20 法则）

主流误区：用一个 AI 写代码工具就够了。

真实做法：**Cursor 写日常代码（80%）+ Claude Code 跨文件重构（20%）**。

为什么这样分工：

| 工具 | 强项 | 弱项 |
|---|---|---|
| Cursor | 单文件内补全 / 行级修改 / 快速 prototype / Tab 接受流畅 | 大型重构容易丢上下文 / 多文件协调差 / 调试复杂错误时回环慢 |
| Claude Code | 整 repo 上下文 / 跨文件重构 / 复杂调试 / 写测试 / 大段文档 | 启动成本高（要明确指令）/ 单文件小改不划算 / token 成本累积快 |

学员典型一天工作流：

```
9:30 AM - Cursor 开 IDE，写当天的主要 feature 代码（单文件、Tab 补全为主）
11:00 AM - 完成 feature 第一版，跑 unit test
11:30 AM - Cursor 修 test failure（单文件 debug）
1:00 PM  - 午休
2:00 PM  - 发现需要跨 3 个文件改接口
2:05 PM  - 切换到 Claude Code，让它读整 repo 后给出多文件 diff
2:30 PM  - 审 Claude 给的 diff，手动 apply（不要无脑接受）
3:30 PM  - 切回 Cursor 调整细节
5:00 PM  - 写 PR description，用 Claude Code 生成第一稿，自己改
5:30 PM  - 提交 PR
```

注意 2:05 → 2:30 那段——**切换工具有成本**。一开始切换太频繁反而慢，但当你能识别"这个任务是单文件还是跨文件"的时候，切换收益就开始显现。

---

## 2. 学员真实 commit 数据（脱敏，2025-2026 cohort）

我们追踪了过去 4 期 cohort（每期 12 个学员，共 48 人）使用 AI 工具前后的 commit 数据：

| 指标 | 使用 AI 之前 | 使用 AI 之后 | 倍数 |
|---|---|---|---|
| 周均 commit 数 | 8.3 | 17.6 | **2.1x** |
| 周均代码行数（净增）| 412 | 968 | 2.3x |
| 平均 commit message 字数 | 6.4 | 13.2 | 2.0x |
| PR 平均 review cycle | 2.4 天 | 1.3 天 | 0.54x |
| bug rate（每 1000 行）| 4.2 | 4.7 | **1.12x** ⚠️ |

第 5 行 bug rate 是个**反向信号**——AI 写代码之后 bug 率稍微上升了 12%。原因：AI 生成的代码看起来对，但有时会用 deprecated API / 漏掉 edge case / 调用不存在的函数（hallucination）。这个数据让我们在课程里加了"AI 代码审稿"模块，强制学员在接受 AI 建议前必须读懂每一行。

---

## 3. 5 个最常翻车场景 + 修法

### 翻车 1：AI 调用不存在的库 / 函数（hallucination）

```python
# AI 生成的代码（看起来对）
from langchain.tools import DuckDuckGoSearchRun, GoogleSearchRun, BingSearchRun

# 真实情况：DuckDuckGoSearchRun 存在，GoogleSearchRun 和 BingSearchRun 都被
# LangChain 移到了 langchain_community.tools.google_search / bing_search 包下，
# 且 import path 已经改了 3 次
```

**修法**：永远先跑 `pip show <package>` 确认版本，再相信 AI 给的 import path。Cursor 的 `Composer` 功能可以读 `requirements.txt` 给出符合当前版本的 import，比裸 prompt 准很多。

### 翻车 2：AI 在大文件里"忘了"前面的代码

```python
# 学员真实场景：1500 行的 user.service.ts
# 学员让 Claude 加一个 method，Claude 加了
# 但 Claude 没看到文件顶部 30 行外的 imports，新增 method 用了一个没 import 的 type
# Build 失败
```

**修法**：跨文件的大改用 Claude Code（不是 Cursor），它能读整 repo。或者明确告诉 AI："请先列出文件里所有 imports 然后再写代码"，强制它扫一遍。

### 翻车 3：AI 修 bug 越修越多

```python
# 场景：用户报"按钮不响应"
# 第 1 次 AI 修：加了 event listener 但 binding context 错
# 第 2 次 AI 修：改了 binding 但破坏了原本对的另一个地方
# 第 3 次 AI 修：尝试回滚但回滚不完整
# 最后：原始 bug 没修 + 新增了 2 个 regression
```

**修法**：AI 修第 2 次还没修对，**人来修**。不要让 AI 进入回环模式。一个经验法则：让 AI 修 bug 时给它 1 次机会，第 2 次不行就 git diff 看它都改了什么、回滚、自己 debug。

### 翻车 4：AI 写出"看起来 production-ready"的实验代码

```python
# AI 生成
def call_llm(prompt: str) -> str:
    """Call LLM API with retry and timeout."""
    response = openai.ChatCompletion.create(
        model="gpt-4",  # ⚠️ 没指定具体版本，gpt-4 在 2025-04 已 deprecated
        messages=[{"role": "user", "content": prompt}],
        timeout=30,  # ⚠️ OpenAI Python SDK 1.x 后参数变了
    )
    return response.choices[0].message.content
```

**修法**：所有 AI 生成的 API 调用代码必须做 4 件事：(1) 跑一遍 (2) 看 response shape 对不对 (3) 跑一遍故意触发错误的测试 (4) 检查所有库版本是不是 2025 之后的。少一项都会埋坑。

### 翻车 5：AI 在 git 操作上犯灾难性错误

```bash
# 学员让 AI 帮忙 rebase main 到当前分支
# AI 给出的命令：git reset --hard origin/main
# 学员粘贴执行 → 当前分支的 12 个 commit 全部丢失
# 没 push 过，找不回
```

**修法**：git 命令 **永远不要** 让 AI 直接执行 destructive 操作。`reset --hard` / `push --force` / `branch -D` 这种命令看到 AI 给出来时先停 10 秒问自己"如果我执行错了能救回来吗"。

---

## 4. 澳洲 AI 工程师特有的 5 个场景

中文 Vibe Coding 教程几乎没提的部分：

### 场景 1：时区错位下的 PR review

悉尼工程师周一上午写完 PR → 美国 team lead 还在周日晚上 → review 要等 12+ 小时。**用 AI 写 PR description 极大压缩 review 时间**——一个写得好的 PR description 能让 review cycle 从 2.4 天压到 1.3 天（数据见前文表格）。

Claude Code 写 PR description 的 prompt 模板（我们课程在用）：

```
请基于这次 diff 写一个 PR description，包含：
1. What changed（不超过 3 句）
2. Why（用户/业务视角，不是技术视角）
3. Testing（具体跑了哪些 test、什么场景没覆盖）
4. Risk（如果 deploy 出问题影响哪些功能）
5. Rollback plan
```

### 场景 2：英文 + 中文混写的需求文档

澳洲客户经常用英文 + 中文夹杂的需求（"do a RAG 系统给 customer support team 用"）。AI 在多语言混写场景下解析准确率比纯中文 / 纯英文都低。**修法**：在 prompt 里加一句"如果需求有英文中文夹杂，先翻译成全英文再开始写代码"。

### 场景 3：legacy codebase 的逐步现代化

很多澳洲传统行业（银行、保险、政府）的内部系统是 10+ 年的 legacy 代码。用 AI 现代化时常见错误：**让 AI 一次性重写整个文件**——这种 diff 没人能 review，merge 之后 6 个月才发现某个边界条件被改了。**修法**：每次只让 AI 改 < 50 行，一个 PR 一个 PR 合。

### 场景 4：本地 dev box 配置

澳洲网络访问 GitHub / npm / PyPI 比美国慢 30-50%。AI 给的 dependency 列表如果版本号没固定，每次 `npm install` / `pip install` 会因为远程仓库选了不同版本导致结果不一样。**修法**：所有项目 `package-lock.json` / `uv.lock` / `requirements.lock` 必须 commit。

### 场景 5：求职 portfolio 的 AI signaling

2026 年澳洲招聘市场（参考前段时间扒的 312 份 Seek AI Engineer JD），HR 已经开始问："你的 commit history 里 AI 辅助比例多少 / 你能不能解释你 AI 写的某段代码"。**修法**：portfolio 项目里至少有 30% commit message 写明"AI-assisted: brief why"，showcase 你能驾驭 AI 而不是被 AI 拖着走。

---

## 5. Vibe Coding 的工具栈推荐（2026 版）

| 工具 | 推荐 | 适用场景 |
|---|---|---|
| Cursor | ⭐⭐⭐ | 日常单文件代码、Tab 补全 |
| Claude Code | ⭐⭐⭐ | 跨文件重构、复杂调试、写测试 |
| GitHub Copilot | ⭐⭐ | 已经付费 Copilot 的可以继续用，新选先 Cursor |
| Continue.dev | ⭐⭐ | 开源替代，自己跑 LLM 时用 |
| Aider | ⭐⭐ | 纯 CLI，喜欢 terminal 工作流的用 |
| Codeium | ⭐ | 早期产品，2025 之后没什么独特优势 |

**Cursor 月费 USD 20、Claude Code 按 Anthropic 用量计费。两个加起来一个月 USD 40-80 是合理预算**。少于这个数说明你用得不够多——这种工具 ROI 极高，一次 PR 加速一天就值回成本。

---

## 6. 给已经会写代码的工程师的 fast track

如果你已经是后端 / 前端 / 数据工程师（2-3 年），上手 Vibe Coding 的 8 周路径：

- Week 1-2：装 Cursor + 用一周写正常代码，先体验 Tab 补全的边界
- Week 3：第一次主动调用 Composer 做跨文件改动，对比和手动改的差异
- Week 4：装 Claude Code，做一次"让 AI 给整个项目写 README"的实验
- Week 5-6：把日常工作流分清 80/20——哪些任务交 AI、哪些手写
- Week 7：踩前面 5 个翻车场景至少 3 个
- Week 8：建立自己的 prompt 模板库（PR description / 测试生成 / debug 等）

我们匠人学院（JR Academy）的 [/learn/vibe-coding](https://jiangren.com.au/learn/vibe-coding) 把这 8 周拆成 12 个项目，每个项目对应一个真实工程场景。

---

## 7. 关于和 DataWhale / vibe-vibe / vibecoding.cn 的区别

中文 Vibe Coding 内容市场目前的 3 个主要来源：

- **DataWhale vibe-vibe**：翻译 + 转述英文教程，覆盖基础概念
- **tukuaiai/vibe-coding-cn**：偏 AIGC 创业者视角，重营销
- **vibecoding.cn**：偏工具评测，更新慢

这三家覆盖了"什么是 Vibe Coding"和"怎么装 Cursor"。我们这份手册的差异化：**真实生产场景 + 澳洲求职场景 + 学员 commit 数据**。不是和它们竞争入门内容，是接它们的下一棒——你看完 DataWhale 装好 Cursor 之后，**怎么把 Vibe Coding 用在每天的工作里**，这份手册讲这个。

---

## 8. 我们做这份手册的位置

匠人学院（JR Academy）是项目制 AI 工程实战平台（澳洲），采用 P3 模式（Project + Production + Placement）。过去 4 年带 100+ 学员从转行到拿澳洲本地 AI Engineer / ML Engineer offer。Vibe Coding 是过去 12 个月每期 cohort 都强制实践的工作流——这份手册就是这 4 期实践复盘出来的。

完整 [Vibe Coding 课程](https://jiangren.com.au/learn/vibe-coding) 模块图 + 12 个项目题目在网站上。如果你已经会写代码、想 6-12 个月把 Vibe Coding 工作流打透，[Bootcamp 报名通道](https://jiangren.com.au/bootcamp) 是入口。

更多澳洲 AI 求职数据 + 真实学员路径持续更新在 [/blog](https://jiangren.com.au/blog)。下一篇会拆"Cursor + Claude Code 实战工作流 — 一周真实 commit log"。


---

## 关于匠人学院（JR Academy）

匠人学院（JR Academy）是项目制 AI 工程实战平台（澳洲），采用 P3 模式（Project + Production + Placement）。过去 4 年带 100+ 学员从转行到拿澳洲本地 AI Engineer / ML Engineer offer。

- **想系统补 AI 工程师真实工作流（Cursor + Claude Code）** → [Vibe Coding 课程（/learn/vibe-coding）](https://jiangren.com.au/learn/vibe-coding)
- **Bootcamp 报名** → [/bootcamp](https://jiangren.com.au/bootcamp)
- **更多澳洲 AI 求职数据 + 学员路径** → [/blog](https://jiangren.com.au/blog)
- **完整数据 + 代码 + 模板（开源）** → [JR Academy GitHub](https://github.com/JR-Academy-AI)
