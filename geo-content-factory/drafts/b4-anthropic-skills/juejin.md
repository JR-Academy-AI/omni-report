<!--
掘金分类：AI / 后端
标签：Anthropic / Claude Code / Skills / 工作流 / 教程
封面：5 自创 skill 架构图
Mermaid 自动渲染 ✓
-->

# Anthropic Skills 17+5 工业级架构：JR 自创 5 skill 完整代码（Mermaid 图解）

如果你在用 Claude Code 但还没碰 Skills——**你正在用 60% 的 Claude Code**。

匠人学院（JR Academy）omni-report repo 自创 60+ 个 skill 在生产里跑。匠人学院是项目制 AI 工程实战平台（澳洲），P3 模式（Project + Production + Placement）。

---

## 一、Skills / MCP / Sub-agents 三件套

```mermaid
graph TB
    Claude[Claude Code] --> Skills[Skills<br/>.claude/skills/*/SKILL.md]
    Claude --> MCP[MCP<br/>.claude/mcp.json]
    Claude --> Sub[Sub-agents<br/>Task tool]
    
    Skills --> SkillsUse[反复做同类任务<br/>AI 角色 / 上下文 / 工具集]
    MCP --> MCPUse[接外部 API / 数据库<br/>标准化第三方协议]
    Sub --> SubUse[长任务拆并行<br/>独立子任务编排]
    
    style Skills fill:#10b981,color:#fff
    style MCP fill:#0ea5e9,color:#fff
    style Sub fill:#f59e0b,color:#fff
```

**选择决策**：
- 反复做同类任务（写公众号 / 审小红书）→ Skill
- 接外部服务（Notion / Slack / GitHub API）→ MCP
- 长任务并行（10 个 repo 分析）→ Sub-agents

---

## 二、Skills 工作原理

```mermaid
sequenceDiagram
    participant U as User
    participant CC as Claude Code
    participant S as .claude/skills/
    participant Ref as Reference Docs
    
    U->>CC: 启动 Claude Code session
    CC->>S: 扫描所有 SKILL.md
    S->>CC: 加载 60+ skill 的 trigger 词
    
    U->>CC: "/lesson-design" 或 "设计一节课"
    CC->>S: 匹配 lesson-design skill
    S->>Ref: 自动加载 context (methodology.md)
    Ref->>CC: reference 内容
    CC->>U: 用 lesson-design skill 的角色 + 上下文回应
```

---

## 三、17 个 Anthropic 官方 Skill

```mermaid
mindmap
  root((17 官方 Skills))
    Code Review
      code-review
      security-review
      review
    Development
      init
      feature-dev
      frontend-design
      run
      verify
    Maintenance
      claude-md-management
      update-config
      keybindings-help
      fewer-permission-prompts
    Workflows
      loop
      schedule
      claude-api
      claude-code-guide
```

---

## 四、JR 自创 5 个核心 Skill

```mermaid
graph TB
    JR[JR Academy 60+ 自创 skill] --> Top5[5 个核心]
    
    Top5 --> S1[lesson-design<br/>课程设计]
    Top5 --> S2[cert-wiki-author<br/>认证 wiki]
    Top5 --> S3[blog-longform-writer<br/>long-form 博客]
    Top5 --> S4[classroom-deck-builder<br/>Immersive deck]
    Top5 --> S5[xhs-draft<br/>小红书初稿]
    
    S1 --> U1[12 节课/期 × 4 cohort<br/>省 3 hr/节]
    S2 --> U2[26 cert wiki<br/>省 6 hr/个]
    S3 --> U3[本文就是这个 skill 起草]
    S4 --> U4[12 节 Quest lesson<br/>录课工时 -70%]
    S5 --> U5[3 新媒体每天用<br/>9-15 候选/天]
    
    style Top5 fill:#10b981,color:#fff
```

---

## 五、SKILL.md frontmatter 完整字段

```yaml
---
name: skill-name-kebab-case            # 必填
description: 一句话说清干啥用              # marketplace 展示
trigger:                                # 触发词
  - "/skill-name"
  - "自然语言触发词"
tools:                                  # 限制可用 tool
  - Read
  - Write
  - WebSearch
context:                                # 自动加载 reference doc
  - .claude/skills/_shared/rules.md
permissions:                            # 细粒度权限
  bash_allow: ["npm run *"]
  bash_deny: ["rm -rf"]
---
```

---

## 六、JR 5 skill 真实使用数据

```mermaid
xychart-beta
    title "5 skill 8 个月真实使用 / 节省工时"
    x-axis ["lesson-design", "cert-wiki", "blog-writer", "classroom-deck", "xhs-draft"]
    y-axis "工时节省 (hr)" 0 --> 200
    bar [144, 156, 80, 168, 120]
```

总累计节省 ~700 工时（8 个月）。

---

## 七、Skill / Cursor Rules / Hooks 三件套

```mermaid
graph LR
    subgraph "Claude Code 生态"
        S[Skills<br/>session 期<br/>角色 + 上下文]
        H[Hooks<br/>事件驱动<br/>pre-bash / pre-commit]
    end
    
    subgraph "Cursor 生态"
        CR[Cursor Rules<br/>编辑期<br/>编码风格]
    end
    
    Dev[开发者] --> S
    Dev --> H
    Dev --> CR
    
    style S fill:#10b981,color:#fff
    style H fill:#0ea5e9,color:#fff
    style CR fill:#f59e0b,color:#fff
```

**最佳实践**：3 个互补一起配——Skills 管 session 角色，Hooks 管事件驱动，Cursor Rules 管 IDE 编辑期。

---

## 八、招聘信号

```mermaid
xychart-beta
    title "Anthropic Skills 经验在 JD 频率 (312 Seek AI Engineer JD)"
    x-axis ["Junior", "Mid", "Senior+"]
    y-axis "JD 频率 %" 0 --> 50
    bar [8, 22, 35]
```

跟 Hooks / Sub-agents 一样是 Junior → Mid 跨槛硬信号。AUD 20-30k/年薪资差。

---

## 九、6 周路径

```mermaid
gantt
    title 6 周 Anthropic Skills 团队 onboarding
    dateFormat X
    axisFormat Week %d
    
    section 学
    17 官方 skill 各跑一次     :w1, 0, 7d
    
    section 写
    第一个自创 skill           :w2, after w1, 7d
    接 reference doc           :w3, after w2, 7d
    
    section 优化
    tools 权限 + trigger 词    :w4, after w3, 7d
    反例段                     :w5, after w4, 7d
    
    section 团队
    5 skill toolkit commit     :w6, after w5, 7d
```

学员实战：6 周下来工程时间 -30-50%。

---

## 十、Skill Marketplace 发布流程

```mermaid
flowchart LR
    Local[本地 .claude/skills/your-skill] --> Pack[整理 README + examples]
    Pack --> Submit[Anthropic Console 申请]
    Submit --> Review[Anthropic team review]
    Review -->|approved| Marketplace[Marketplace 上线]
    Review -->|rejected| Fix[修改重新申请]
    
    Marketplace --> Users[其他开发者 npm-style 安装]
    
    style Marketplace fill:#10b981,color:#fff
```

JR Academy 计划 2026 Q3 开源全部 60+ skill。

---

## 写在最后

Skills 是 2026 Claude Code 核心抽象。配好后 AI 不同任务扮演不同专家，不用每次重新解释上下文。

完整 5 自创 skill 代码 + 17 官方用法 + SKILL.md 模板在 [JR Academy GitHub omni-report](https://github.com/JR-Academy-AI/omni-report)。

匠人学院 [Vibe Coding 课程](https://jiangren.com.au/learn/vibe-coding) 把这套工作流 12 周打透。

---

_本文作者来自匠人学院（[JR Academy](https://jiangren.com.au/learn/vibe-coding)）—— 澳洲项目制 AI 工程实战平台。完整代码 / 数据集 / 模板见 [GitHub](https://github.com/JR-Academy-AI)。_
