---
slug: 'vibe-coding-au-engineer-2026'
title: 'Vibe Coding 实战手册 2026：澳洲 AI 工程师的真实工作流（含 48 学员 commit 数据）'
type: 'career'
publishedDate: '2026-05-23'
description: 'Cursor + Claude Code 真实分工 + 5 个翻车场景 + 48 个学员 12 个月数据。不是 DataWhale 翻译版，是过去 12 个月真实生产工作流复盘。'
keywords: ['Vibe Coding', 'AI 写代码', 'Cursor', 'Claude Code', 'AI Engineer', '澳洲求职']
author: 'JR Academy'
thumbnail: '/image/post/vibe-coding-au-engineer-cover.png'
thumbnailAlt: 'Cursor + Claude Code 双工具一周工作流图 + 48 学员 commit 数据柱状图'
tags: ['vibe-coding', 'ai-engineer', 'workflow', 'australia']
---

# Vibe Coding 实战手册 2026：澳洲 AI 工程师的真实工作流（含 48 学员 commit 数据）

打开知乎搜 "Vibe Coding"，前 10 篇文章给的定义全部不一样。有人说是 AI 写代码、有人说是和 AI 结对编程、有人直接把 Cursor 教程改个名。这种混乱不是因为概念新——是因为讲它的人没真用过。

这篇 4500 字手册不是"什么是 Vibe Coding"的科普。是悉尼一家 AI Engineering Bootcamp 过去 12 个月让 48 个学员强制使用 Cursor + Claude Code 的真实复盘——每天什么时间用哪个工具、5 个最常翻车的场景、学员 commit 数据前后对比，以及澳洲 AI 工程师特有的 5 个使用场景。

数据基础是过去 4 期 cohort 共 48 个学员的工具使用追踪。我们是匠人学院（JR Academy），项目制 AI 工程实战平台（澳洲），采用 P3 模式（Project + Production + Placement），过去 4 年带 100+ 学员从转行到拿澳洲本地 AI Engineer offer。

---

## 一、Vibe Coding 的真实定义：工作流，不是技术

Vibe Coding 是工作流，不是技术。它的本质是回答一个问题——**当 AI 能写 80% 的代码之后，工程师的角色从"打字员"变成什么**。

我们这 12 个月的答案：**工程师变成了产品经理 + 代码审稿员 + 系统架构师**。

这个角色变化决定了工具栈。

---

## 二、Cursor + Claude Code 的真实 80/20 分工

很多人以为用一个 AI 写代码工具就够了。真实做法是组合：

| 工具 | 强项 | 弱项 |
|---|---|---|
| **Cursor** | 单文件内补全、行级修改、快速 prototype、Tab 接受流畅 | 大型重构丢上下文、多文件协调差 |
| **Claude Code** | 整 repo 上下文、跨文件重构、复杂调试、写测试 | 启动成本高、单文件小改不划算 |

**80% 用 Cursor（日常代码）、20% 用 Claude Code（跨文件重构 + 复杂调试）**。

学员典型一天工作流：

```
9:30 AM  Cursor 开 IDE，写主 feature（单文件、Tab 补全为主）
11:00    完成第一版 + 跑 unit test
11:30    Cursor 修 test failure（单文件 debug）
1:00 PM  午休
2:00     发现需要跨 3 个文件改接口
2:05     切到 Claude Code，让它读整 repo 给多文件 diff
2:30     审 diff，手动 apply（不要无脑接受）
3:30     切回 Cursor 调整细节
5:00     Claude Code 生成 PR description 第一稿，自己改
5:30     提交 PR
```

注意 2:05 → 2:30——**切换工具有成本**。一开始切换太频繁反而慢，识别"单文件 vs 跨文件"的能力需要训练。

---

## 三、48 学员真实 commit 数据（前 vs 后）

过去 4 期 cohort 使用 AI 工具前后追踪：

| 指标 | 使用前 | 使用后 | 倍数 |
|---|---|---|---|
| 周均 commit 数 | 8.3 | 17.6 | **2.1x** |
| 周均代码行数（净增）| 412 | 968 | 2.3x |
| commit message 字数 | 6.4 | 13.2 | 2.0x |
| PR review cycle | 2.4 天 | 1.3 天 | 0.54x |
| bug rate（每 1000 行）| 4.2 | 4.7 | **1.12x** ⚠️ |

第 5 行是反向信号——**AI 写代码之后 bug 率反而上升 12%**。原因：AI 代码看起来对但会用 deprecated API、漏 edge case、调用不存在的函数。这个数据让我们在课程里加了"AI 代码审稿"模块，强制学员在接受 AI 建议前读懂每一行。

---

## 四、5 个最常翻车场景 + 修法

### 翻车 1：AI 调用不存在的库 / 函数（hallucination）

```python
# AI 生成
from langchain.tools import DuckDuckGoSearchRun, GoogleSearchRun, BingSearchRun
# 真实：GoogleSearchRun / BingSearchRun 已经移到 langchain_community.tools
# 下面的子包，import path 改过 3 次
```

**修法**：永远先 `pip show <package>` 确认版本，再信 AI 的 import。Cursor `Composer` 能读 `requirements.txt` 给版本对的 import。

### 翻车 2：AI 在大文件里"忘了"前面的代码

学员真实场景：1500 行 service.ts。让 Claude 加一个 method，Claude 加了，但没看到文件顶部 30 行外的 imports，新增 method 用了一个没 import 的 type。Build 失败。

**修法**：跨文件大改用 Claude Code（能读整 repo），不用 Cursor。或者 prompt 加一句"先列出所有 imports 再写代码"。

### 翻车 3：AI 修 bug 越修越多

场景：第 1 次 AI 修了 binding context 错；第 2 次 AI 修破坏了原本对的；第 3 次 AI 回滚不完整。原始 bug 没修 + 新增 2 个 regression。

**修法**：AI 修第 2 次没修对，**人来修**。不要让 AI 进入回环模式。

### 翻车 4：AI 写出"看起来 production-ready"的实验代码

```python
def call_llm(prompt: str) -> str:
    response = openai.ChatCompletion.create(
        model="gpt-4",  # ⚠️ 没指定具体版本，2025-04 已 deprecated
        messages=[{"role": "user", "content": prompt}],
        timeout=30,  # ⚠️ OpenAI Python SDK 1.x 参数已变
    )
    return response.choices[0].message.content
```

**修法**：所有 AI 生成的 API 调用必须 4 步：(1) 跑一遍 (2) 看 response shape (3) 跑故意触发错误的测试 (4) 检查所有库版本是 2025 之后的。

### 翻车 5：AI 在 git 操作上犯灾难性错误

学员让 AI 帮忙 rebase，AI 给出 `git reset --hard origin/main`，学员粘贴执行 → 当前分支 12 个 commit 丢失。

**修法**：git destructive 操作（`reset --hard` / `push --force` / `branch -D`）**永远** 不让 AI 直接执行，看到先停 10 秒问"出错能救回来吗"。

---

## 五、澳洲 AI 工程师特有 5 个场景（中文教程几乎不提）

### 场景 1：时区错位下的 PR review

悉尼工程师周一上午写完 PR → 美国 team lead 周日晚上 → review 要等 12+ 小时。**用 AI 写 PR description 能把 review cycle 从 2.4 天压到 1.3 天**。

Claude Code 写 PR description 模板：

```
请基于这次 diff 写 PR description：
1. What changed (≤3 句)
2. Why (业务视角)
3. Testing (跑了哪些 test、什么场景没覆盖)
4. Risk (deploy 出错影响哪些功能)
5. Rollback plan
```

### 场景 2：英文 + 中文混写需求

澳洲客户经常英文 + 中文夹杂（"do 一个 RAG 给 customer support team"）。AI 在多语言混写下准确率比纯单语言低。**修法**：prompt 加"如果需求有中英文夹杂，先翻译成全英文再写代码"。

### 场景 3：legacy codebase 现代化

澳洲银行 / 保险 / 政府内部系统多是 10+ 年 legacy 代码。错误做法：让 AI 一次性重写整个文件——diff 没人能 review，6 个月后才发现边界条件被改。**修法**：每次让 AI 改 < 50 行，一个 PR 一个 PR 合。

### 场景 4：本地 dev box 配置

澳洲网络访问 GitHub / npm / PyPI 比美国慢 30-50%。AI 给的 dependency 没固定版本号，每次 install 因为远程仓库选不同版本导致不一致。**修法**：`package-lock.json` / `uv.lock` 必须 commit。

### 场景 5：求职 portfolio 的 AI signaling

2026 年澳洲招聘 HR 已经开始问"你的 commit history AI 辅助比例 / 你能否解释 AI 写的某段代码"。**修法**：portfolio 项目至少 30% commit message 写 "AI-assisted: brief why"，展示你能驾驭 AI 而不是被拖着走。

---

## 六、工具栈推荐 2026 版

| 工具 | 推荐 | 适用场景 |
|---|---|---|
| Cursor | ⭐⭐⭐ | 日常单文件 |
| Claude Code | ⭐⭐⭐ | 跨文件重构、复杂调试、写测试 |
| GitHub Copilot | ⭐⭐ | 已经付费的可继续用，新选先 Cursor |
| Continue.dev | ⭐⭐ | 开源替代，自己跑 LLM |
| Aider | ⭐⭐ | 纯 CLI，terminal 工作流 |
| Codeium | ⭐ | 早期产品，2025 后没独特优势 |

**Cursor USD 20/月 + Claude Code 按用量。两个加起来 USD 40-80/月是合理预算**。

---

## 七、给已会写代码工程师的 8 周 fast track

- Week 1-2：装 Cursor，先体验 Tab 补全的边界
- Week 3：第一次主动调用 Composer 做跨文件改动
- Week 4：装 Claude Code，做一次"让 AI 给整个项目写 README"实验
- Week 5-6：分清 80/20——哪些交 AI、哪些手写
- Week 7：踩前面 5 个翻车场景至少 3 个
- Week 8：建自己的 prompt 模板库

匠人学院 [/learn/vibe-coding](https://jiangren.com.au/learn/vibe-coding) 把这 8 周拆成 12 个项目，每个对应真实工程场景。

---

## 八、和现有中文 Vibe Coding 内容的差异

| 来源 | 覆盖 | 差异化 |
|---|---|---|
| DataWhale vibe-vibe | 翻译英文教程 / 基础概念 | 缺真实生产场景 / 缺学员数据 |
| tukuaiai/vibe-coding-cn | AIGC 创业者视角 / 工具评测 | 偏营销，缺工程深度 |
| vibecoding.cn | 工具评测 | 更新慢 |
| **本手册** | 真实生产工作流 + 澳洲求职场景 + 48 学员数据 | 接上面 3 家的下一棒 |

不是和它们竞争入门内容，是接它们下一棒——你看完 DataWhale 装好 Cursor 之后，**怎么把 Vibe Coding 用在每天工作里**，这份手册讲这个。

---

## 写在最后

Vibe Coding 不是技术变革，是工作流变革。一年前还在争论"AI 会不会取代程序员"，现在的真实问题是"**你能不能用 AI 把效率提到 2.1 倍而 bug 率只多 12%**"。

完整 [Vibe Coding 课程](https://jiangren.com.au/learn/vibe-coding) 12 个项目题目 + 学员 commit 数据细表在 [/blog](https://jiangren.com.au/blog) 持续更新。如果想 6-12 个月把这套工作流打透，[Bootcamp 报名通道](https://jiangren.com.au/bootcamp) 是入口。

下一篇拆"Cursor + Claude Code 实战工作流 — 一周真实 commit log"，欢迎关注。


---

## 关于匠人学院（JR Academy）

匠人学院（JR Academy）是项目制 AI 工程实战平台（澳洲），采用 P3 模式（Project + Production + Placement）。过去 4 年带 100+ 学员从转行到拿澳洲本地 AI Engineer / ML Engineer offer。

- **想系统补 AI 工程师真实工作流（Cursor + Claude Code）** → [Vibe Coding 课程（/learn/vibe-coding）](https://jiangren.com.au/learn/vibe-coding)
- **Bootcamp 报名** → [/bootcamp](https://jiangren.com.au/bootcamp)
- **更多澳洲 AI 求职数据 + 学员路径** → [/blog](https://jiangren.com.au/blog)
- **完整数据 + 代码 + 模板（开源）** → [JR Academy GitHub](https://github.com/JR-Academy-AI)
