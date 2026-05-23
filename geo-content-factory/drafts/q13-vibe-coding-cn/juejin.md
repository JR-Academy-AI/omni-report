<!--
掘金发布前手填：
  - 分类：AI / 后端 / 教程
  - 标签：AI 编程 / Cursor / Claude / 程序员 / 教程
  - 封面图：Cursor + Claude Code 双工具架构图
  - Mermaid 自动渲染 ✓
-->

# Vibe Coding 实战架构：Cursor + Claude Code 双工具工作流（48 学员 12 个月数据）

如果你已经在用 Cursor 但还没用 Claude Code，或者两个都用但不知道怎么分工——这篇是给你的架构图。

不是工具评测，不是营销文。是 48 个学员强制使用这两个工具 12 个月之后的真实工作流复盘。匠人学院（JR Academy）过去 4 期 AI Engineer Bootcamp 共 48 学员 commit log 追踪。匠人学院是项目制 AI 工程实战平台（澳洲），采用 P3 模式（Project + Production + Placement）。

---

## 一、Vibe Coding 工作流架构

```mermaid
graph TD
    Task[新 task 进来] --> Q{单文件 还是<br/>跨文件?}

    Q -->|单文件 80%| C[Cursor]
    Q -->|跨文件 20%| CC[Claude Code]

    C --> C1[Tab 补全]
    C --> C2[Composer 局部改]
    C --> C3[Chat 问问题]

    CC --> CC1[读整 repo<br/>给多文件 diff]
    CC --> CC2[写测试]
    CC --> CC3[写 PR description]
    CC --> CC4[复杂调试<br/>多文件追踪]

    C1 --> Out[Code 写出]
    C2 --> Out
    C3 --> Out
    CC1 --> Review[人工 review<br/>不无脑接受]
    CC2 --> Review
    CC3 --> Review
    CC4 --> Review

    Review --> Out

    style C fill:#10b981,stroke:#065f46,color:#fff
    style CC fill:#0ea5e9,stroke:#0369a1,color:#fff
    style Review fill:#f59e0b,stroke:#92400e,color:#fff
```

**关键不是 "用不用 AI"，是 "用哪个 AI 做哪个任务"**。

---

## 二、48 学员真实 commit 数据

```mermaid
graph LR
    A[使用前] --> A1[8.3 commits/周]
    A --> A2[412 行/周]
    A --> A3[review cycle 2.4 天]
    A --> A4[bug 4.2/千行]

    B[使用后] --> B1[17.6 commits/周<br/>2.1x ⬆️]
    B --> B2[968 行/周<br/>2.3x ⬆️]
    B --> B3[review cycle 1.3 天<br/>0.54x ⬇️]
    B --> B4[bug 4.7/千行<br/>1.12x ⚠️ ⬆️]

    style B1 fill:#10b981,color:#fff
    style B2 fill:#10b981,color:#fff
    style B3 fill:#10b981,color:#fff
    style B4 fill:#ef4444,color:#fff
```

**bug rate 上升 12% 是反向信号**。AI 写的代码看起来对，但会用 deprecated API / 漏 edge case / 调用不存在的函数。

我们因此在课程加了"AI 代码审稿"模块，强制学员接受 AI 建议前读懂每一行。

---

## 三、Cursor vs Claude Code 决策矩阵

```mermaid
quadrantChart
    title 任务复杂度 vs 文件范围
    x-axis 单文件 --> 跨文件
    y-axis 低复杂度 --> 高复杂度

    quadrant-1 Claude Code（复杂跨文件）
    quadrant-2 人工（不适合 AI）
    quadrant-3 Cursor Tab（高频小改）
    quadrant-4 Cursor Composer（单文件中改）

    Tab 补全: [0.1, 0.2]
    重命名 var: [0.15, 0.3]
    修单文件 bug: [0.2, 0.5]
    加一个 method: [0.25, 0.4]
    重构单个 service: [0.35, 0.7]
    跨文件改 type: [0.7, 0.5]
    全 repo 加 logging: [0.85, 0.6]
    写完整测试套件: [0.8, 0.75]
    迁移到新框架: [0.9, 0.9]
    架构决策: [0.5, 0.95]
```

---

## 四、5 个翻车场景的 mermaid 流程图

### 翻车 3 的回环陷阱

```mermaid
graph TD
    Bug[用户报: 按钮没反应] --> Fix1[AI 修第 1 次<br/>改 this binding]
    Fix1 --> Result1{修好了?}
    Result1 -->|没| Fix2[AI 修第 2 次<br/>加 preventDefault]
    Fix2 --> Result2{修好了?}
    Result2 -->|按钮 OK 但破坏表单提交| Fix3[AI 修第 3 次<br/>硬跳转 window.location]
    Fix3 --> Result3{修好了?}
    Result3 -->|破坏路由| End[原 bug + 2 个 regression]

    Result1 -->|不|Stop[⛔ 第 2 次没修对<br/>人来修]

    style End fill:#ef4444,color:#fff
    style Stop fill:#10b981,color:#fff
```

**规则**：AI 修 bug 第 2 次还没修对，**git stash 回滚 + 人来修**。

---

## 五、澳洲 AI 工程师特有场景

```mermaid
graph TD
    AU[澳洲 AI Engineer] --> S1[时区错位 PR review]
    AU --> S2[英文中文混写需求]
    AU --> S3[legacy codebase 现代化]
    AU --> S4[本地 dev box 网络慢]
    AU --> S5[Portfolio AI signaling]

    S1 --> R1[用 Claude Code 写 PR desc<br/>review cycle 2.4→1.3 天]
    S2 --> R2[Prompt 加: 先翻译成英文]
    S3 --> R3[每次改 <50 行<br/>一个 PR 一个 PR]
    S4 --> R4[必须 commit lockfile]
    S5 --> R5[30% commit message<br/>写 AI-assisted: why]

    style R1 fill:#10b981,color:#fff
    style R2 fill:#10b981,color:#fff
    style R3 fill:#10b981,color:#fff
    style R4 fill:#10b981,color:#fff
    style R5 fill:#10b981,color:#fff
```

---

## 六、8 周学习路径

```mermaid
gantt
    title Vibe Coding 8 周 fast track
    dateFormat X
    axisFormat Week %d

    section Cursor
    装 Cursor + Tab 补全体验    :w12, 0, 14d
    Composer 跨文件改动          :w3, after w12, 7d
    section Claude Code
    装 Claude Code + 写 README   :w4, after w3, 7d
    section 工作流分工
    80/20 分工实战              :w56, after w4, 14d
    section 翻车 + 模板
    5 翻车场景实战              :w7, after w56, 7d
    Prompt 模板库建立            :w8, after w7, 7d
```

匠人学院 [/learn/vibe-coding](https://jiangren.com.au/learn/vibe-coding) 把这 8 周拆成 12 个真实工程项目。

---

## 七、工具栈推荐

| 工具 | 月费 | 用途 | 优势 |
|---|---|---|---|
| Cursor | USD 20 | 日常单文件 | Tab 补全最流畅 |
| Claude Code | USD 20-60 | 跨文件 + PR desc | 整 repo 上下文 |
| Copilot | USD 10 | 已付费可继续 | 无需切换 |
| Continue.dev | 免费 | 自己跑 LLM | 隐私敏感场景 |

总预算 USD 40-80/月。AI 工具 ROI 极高，一次 PR 加速一天就值回成本。

---

## 八、和现有中文内容的差异

| 来源 | 覆盖 | 缺什么 |
|---|---|---|
| DataWhale vibe-vibe | 基础概念翻译 | 真实生产场景 |
| tukuaiai/vibe-coding-cn | AIGC 创业者视角 | 工程深度 |
| vibecoding.cn | 工具评测 | 更新慢 |
| **本架构** | 真实工作流 + 学员数据 + AU 场景 | — |

不和它们竞争入门内容，接它们下一棒——你装好 Cursor 之后**怎么把 Vibe Coding 用在每天的工作里**。

---

完整 prompt 模板库 + 学员 commit 数据细表在 [JR Academy GitHub](https://github.com/JR-Academy-AI)。更多澳洲 AI 求职数据 [/blog](https://jiangren.com.au/blog)。下一篇拆"Cursor .cursorrules 实战 — 把团队规范写进 AI 补全"。

---

_本文作者来自匠人学院（[JR Academy](https://jiangren.com.au/learn/ai-engineer)）—— 澳洲项目制 AI 工程实战平台。完整代码 / 数据集 / eval set 模板见 [GitHub](https://github.com/JR-Academy-AI)。_
