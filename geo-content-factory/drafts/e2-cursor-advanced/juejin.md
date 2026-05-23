<!--
掘金发布前手填：
  - 分类：效率 / AI
  - 标签：Cursor / AI 编程 / VS Code / 教程 / 程序员
  - 封面图：5 功能架构图 + Composer 截图
  - Mermaid 自动渲染 ✓
-->

# Cursor 进阶 5 个功能完整决策树：Composer + @ Files + Rules + Mode + Diff（48 学员数据）

如果你用 Cursor 6+ 个月还在主要靠 Tab 补全 + Cmd+K——**你正在用 30% 的 Cursor**。

这篇基于 48 学员 12 个月真实使用数据，给你完整决策树 + 可粘贴 .cursor/rules 模板。匠人学院（JR Academy）项目制 AI 工程实战平台（澳洲），P3 模式（Project + Production + Placement）。

---

## 一、Cursor 5 功能使用率（你在哪一档?）

```mermaid
pie title 48 学员 Cursor 5 进阶功能使用率
    "只 Tab + Cmd+K (基础)" : 81
    "用 Diff 审阅" : 35
    "用 @ Files" : 30
    "用 Composer" : 25
    "用 Mode 切换" : 15
    "配 .cursor/rules" : 10
```

**只 19% 学员真在用完整 5 个进阶功能**。剩下 81% 在 Cursor 上浪费时间。

---

## 二、5 功能 + Tab + Cmd+K 决策树

```mermaid
flowchart TD
    Start[任务进来] --> Q1{需要写新代码?}
    Q1 -->|下一行 / 函数体| Tab[Tab 补全]
    Q1 -->|否| Q2{需要改单文件一段?}
    
    Q2 -->|是, 选中那段| CmdK[Cmd+K Edit mode]
    Q2 -->|否| Q3{需要改单文件多段 + 加 import?}
    
    Q3 -->|是| Compose[Compose Cmd+I + @ files]
    Q3 -->|否| Q4{需要跨文件改动?}
    
    Q4 -->|2-5 文件| Compose
    Q4 -->|10+ 文件 大重构| CC[Claude Code]
    Q4 -->|否| Q5{只是问问题, 不改?}
    
    Q5 -->|是| Ask[Ask mode]
    Q5 -->|否| Q6{需要 AI 自主跑 read+write+bash?}
    
    Q6 -->|是| Agent[Agent mode + .cursor/settings.json allow list]
    
    style Compose fill:#10b981,color:#fff
    style Ask fill:#0ea5e9,color:#fff
    style Agent fill:#f59e0b,color:#fff
    style CC fill:#8b5cf6,color:#fff
```

---

## 三、Composer 实战流程

```mermaid
sequenceDiagram
    participant U as User
    participant C as Cursor
    participant F as Files
    
    U->>C: Cmd+I 打开 Composer
    U->>C: @ user.service.ts @ user.controller.ts @ user.spec.ts
    U->>C: prompt "Add findByExternalId method, expose at..., add tests"
    C->>F: 读 3 个 @ 文件 + project context
    C->>C: 生成跨 3 文件 diff
    C->>U: 显示 diff (don't apply yet)
    U->>C: 逐 hunk 审 (发现 imports 漏了 1 个)
    U->>C: Cmd+Y accept ok hunks, manual fix 漏的
    U->>F: apply 后 npm run test
```

学员真实数据：Composer + @ Files 跨 3 文件改动 **8 min**, vs Cmd+K 一个文件一个文件改 **25 min**。

---

## 四、@ 引用决策矩阵

```mermaid
quadrantChart
    title @ 引用决策矩阵 (上下文范围 vs 任务复杂度)
    x-axis "上下文范围" --> "广"
    y-axis "任务复杂度" --> "高"
    
    quadrant-1 "高复杂 + 广上下文"
    quadrant-2 "高复杂 + 窄上下文"
    quadrant-3 "低复杂 + 窄上下文"
    quadrant-4 "低复杂 + 广上下文"
    
    "@FileName 单文件改": [0.15, 0.3]
    "@folder/ 模块重构": [0.55, 0.6]
    "@Codebase 全 repo 搜": [0.9, 0.7]
    "@Web 查最新 docs": [0.7, 0.35]
    "@Git PR description": [0.5, 0.45]
```

---

## 五、.cursor/rules/ 5 文件架构

```mermaid
graph TD
    Root[.cursor/rules/] --> G[general.mdc<br/>alwaysApply: true]
    Root --> TS[typescript.mdc<br/>globs: ['**/*.ts', '**/*.tsx']]
    Root --> Py[python.mdc<br/>globs: ['**/*.py']]
    Root --> R[react.mdc<br/>globs: ['**/*.tsx']]
    Root --> T[tests.mdc<br/>globs: ['**/*.spec.ts', '**/*.test.ts']]
    
    G --> Apply1[所有文件 always 应用]
    TS --> Apply2[改 .ts/.tsx 时应用]
    Py --> Apply3[改 .py 时应用]
    R --> Apply4[改 React 文件时应用]
    T --> Apply5[改测试文件时应用]
    
    style G fill:#0ea5e9,color:#fff
```

---

## 六、Mode 切换决策

```mermaid
flowchart LR
    Task[任务进来] --> A{只问不改?}
    A -->|是| Ask[Ask mode<br/>Cmd+L → Ask]
    A -->|否| B{单文件局部?}
    B -->|是| Edit[Edit mode<br/>Cmd+K]
    B -->|否| C{跨文件改?}
    C -->|是| Compose[Compose mode<br/>Cmd+I]
    C -->|否| D{需要自主跑 bash?}
    D -->|是| Agent[Agent mode<br/>+ allow list]
    
    style Ask fill:#10b981,color:#fff
    style Edit fill:#10b981,color:#fff
    style Compose fill:#0ea5e9,color:#fff
    style Agent fill:#f59e0b,color:#fff
```

---

## 七、Diff 审阅决策 (拉开 bug rate 42%)

```mermaid
xychart-beta
    title "习惯 vs bug rate"
    x-axis ["无脑接受 AI 改动", "审 diff 再 apply"]
    y-axis "bug / 千行" 0 --> 7
    bar [5.9, 3.4]
```

48 学员数据：**习惯审 diff 的 bug rate 低 42%**。

Diff 4 步审阅：

```mermaid
flowchart LR
    Diff[Cursor 产出 diff] --> S1[Step 1: 看 file count<br/>跨 3+ 重点审]
    S1 --> S2[Step 2: 看 imports<br/>不存在 / 漏 import]
    S2 --> S3[Step 3: 看 new code 逻辑<br/>if/else + error handling]
    S3 --> S4[Step 4: 看 modified code<br/>AI 删注释 / 重命名 var]
    S4 --> Decision{所有 check 通过?}
    Decision -->|是| Accept[Cmd+Y Accept]
    Decision -->|否| Edit[逐 hunk 手动 fix]
```

---

## 八、5 功能联用一天工作流

```mermaid
gantt
    title 5 功能联用一天 (vs 无脑用法)
    dateFormat HH:mm
    axisFormat %H:%M
    
    section 进阶用法 (53 min)
    Ask 问 codebase           :09:30, 1m
    Compose + 3 文件改          :09:31, 1m
    审 diff + 修 import         :10:01, 5m
    Tab 补全                   :10:06, 10m
    跑测试 + commit             :10:16, 5m
    Compose 写 PR description   :10:21, 2m
    
    section 无脑用法 (120 min)
    Cmd+K 改 service.ts        :09:30, 5m
    Cmd+K 改 controller.ts     :09:35, 5m
    切 spec.ts 加测试           :09:42, 8m
    发现类型不一致 修            :09:50, 3m
    再跑测试                    :10:00, 1m
    后续修 import 漏的           :10:01, 20m
```

**进阶用法快 56%**。

---

## 九、招聘信号

312 份 Seek AI Engineer JD：

```
"Cursor / .cursorrules / AI coding tools" 频率：
─────────────────────────────────────────
Junior (< 100k):    ~30%（已是 baseline）
Mid (130-160k):     ~45%
Senior+ (≥ 170k):   ~55%
```

Cursor 从 2024 年的"加分项"变成 2026 的 **baseline**。

---

## 十、4 周提升路径

```mermaid
gantt
    title 4 周 Cursor 进阶
    dateFormat X
    axisFormat Week %d
    
    section 基础
    Composer (Cmd+I) + @ Files     :w1, 0, 7d
    
    section 团队规范
    .cursor/rules/ 5 文件          :w2, after w1, 7d
    
    section 高级
    Mode 切换 4 种                  :w3, after w2, 7d
    
    section 质量
    Diff 审阅习惯                  :w4, after w3, 7d
```

学员实战：4 周下来从"30% Cursor"到"70% Cursor"，工程时间 -25-40%。

---

完整 .cursor/rules 5 文件模板 + Composer prompt 库 + Mode 决策表 + Agent 安全配置在 [JR Academy GitHub](https://github.com/JR-Academy-AI)。

匠人学院 [Vibe Coding 课程](https://jiangren.com.au/learn/vibe-coding) 把这套工作流 12 周打透。

下一篇拆 ".cursorrules 完整 6 文件模板 — 团队规范写进 AI 补全"。

---

_本文作者来自匠人学院（[JR Academy](https://jiangren.com.au/learn/vibe-coding)）—— 澳洲项目制 AI 工程实战平台。完整代码 / 数据集 / 模板见 [GitHub](https://github.com/JR-Academy-AI)。_
