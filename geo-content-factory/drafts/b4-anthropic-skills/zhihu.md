<!--
知乎专栏：AI 工程师 / Claude / Anthropic
话题：Claude / Anthropic / AI / 程序员 / 工作流
封面：5 自创 skill + 17 官方 skill 架构图
-->

# 用 Claude Code 没用 Skills？你正在用 60% 的 Claude Code—— JR 自创 5 个 Skill 完整代码

Anthropic Skills 2026 年初 GA 之后，我们在 omni-report repo 自创了 60+ 个 skill。每个都在生产里跑。

但我每周收到知乎私信问 "Anthropic Skills 怎么用" 还是十几条——大多数人压根没碰过 SKILL.md。

我是匠人学院（JR Academy）创始团队成员之一。匠人学院是项目制 AI 工程实战平台（澳洲），P3 模式（Project + Production + Placement）。这篇分享我们生产里真在用的 5 个核心 skill 完整代码。

---

## 一、Skills 是什么 / 为什么必须用

Skills = `.claude/skills/{name}/SKILL.md` 文件，含：

- **角色**：AI 在这个 skill 下是什么身份
- **上下文**：自动加载哪些 reference doc
- **工具集**：能用 Read / Write / Bash 等哪些 tool
- **触发条件**：自然语言 + /command

Claude Code 启动时加载这些 skill，**让 AI 在不同任务下扮演不同专家**，不是每次重新解释一遍上下文。

---

## 二、Skills vs MCP vs Sub-agents

```
Skills:      AI 角色 / 上下文 / 工具集     反复做同类任务
MCP:         标准化第三方工具协议           接外部 API / DB
Sub-agents:  任务并行编排                  长任务拆并行
```

**用法选择**：
- 反复做"审小红书文案" → Skill
- 让 AI 调 Notion / Slack → MCP
- 一次性长任务并行 → Sub-agents

---

## 三、JR 自创 5 个核心 Skill

### Skill 1: lesson-design

设计一节完整 lesson (slide + 讲稿 + practice problem + 配音 prompt)。

```yaml
---
name: lesson-design
description: /lesson-design — 设计一节完整的 Lesson
trigger: ["/lesson-design", "设计一节 lesson"]
tools: [Read, Write, Bash, Grep, Glob]
context:
  - omni-report/curriculum/{slug}/lesson-template.md
---
```

4 期 cohort × 12 节课全用，每节省 3 小时。

### Skill 2: cert-wiki-author

写 IT 认证 wiki (AWS SAA / CKA / AZ-104)。

```yaml
---
name: cert-wiki-author
description: Author manual wiki configs for certification public pages
trigger: ["/cert-wiki"]
tools: [Read, Write, WebSearch, WebFetch]
---
```

26 个 cert wiki, 每个省 6 小时。

### Skill 3: blog-longform-writer

写 long-form blog 含反 AI 味检查。**本文就是这个 skill 起草的**。

```yaml
---
name: blog-longform-writer
description: Write original long-form blog posts with strict anti-AI-style rules
trigger: ["/blog", "写 blog"]
tools: [Read, Write, WebSearch, Grep]
context:
  - .claude/skills/_shared/content-brand-attribution-rules.md
---
```

反 AI 味硬规则：
- 每段 ≥ 1 个具体数据 / 命令 / 案例
- 禁用句式："在当今", "Whether you're a beginner"
- 平台分级 footer (自家站完整 / 知乎无 footer)

### Skill 4: classroom-deck-builder

每节 Quest-type lesson 生成 Immersive Classroom Deck (slide + ElevenLabs 配音)。

```yaml
---
name: classroom-deck-builder
description: Build Immersive AI Classroom deck
trigger: ["/classroom-deck"]
tools: [Read, Write, Bash, WebFetch]
---
```

12 节 lesson 全自动化, 录课工时 -70%。

### Skill 5: xhs-draft

小红书 3 切角并出 (痛点 / 故事 / 干货)。

```yaml
---
name: xhs-draft
description: 给定选题, 按指定账号人设自动生成小红书初稿
trigger: ["/xhs-draft"]
tools: [Read, Write, WebSearch]
---
```

3 个新媒体每天用，每天产出 9-15 个候选稿。

---

## 四、Skill 编写 5 原则

1. **一个 Skill = 一个具体职能**（不要写"全能 skill"）
2. **frontmatter trigger 写清**（自然语言 + /command）
3. **context 段引用 reference doc**（不用每次重复解释）
4. **tools 段限制权限**（防越权操作）
5. **写反例段**（什么时候 NOT 用这个 skill）

---

## 五、Skill vs Cursor Rules

```
Skills (Claude Code): 任务 / 角色 / 上下文
Cursor Rules (Cursor IDE): 编码风格规范
```

**最佳实践**：两个一起用——Cursor Rules 管 IDE 编辑期，Skills 管 Claude Code session 期。

---

## 六、招聘信号

312 份 Seek AI Engineer JD：

```
"Anthropic Skills / Claude Code / .cursor/rules" 频率：
─────────────────────────────────────────
Junior (< 100k):    < 8%
Mid (130-160k):     ~22%
Senior+ (≥ 170k):   **35%**
```

Junior → Mid 跨槛硬信号。

---

## 七、6 周自学路径

```
Week 1: 17 官方 skill 各跑一次
Week 2: 写第一个自创 skill
Week 3: 接 Reference doc
Week 4: Tools 权限 + Trigger 自然语言
Week 5: 写反例段
Week 6: 5 skill 团队 toolkit
```

学员实战：6 周下来工程时间 -30-50%。

---

## 写在最后

Skills 是 2026 Claude Code 核心抽象。配好后 AI 不同任务扮演不同专家。

完整 5 自创 skill 代码 + 17 官方用法在 [JR Academy GitHub omni-report](https://github.com/JR-Academy-AI/omni-report)。

匠人学院 [Vibe Coding 课程](https://jiangren.com.au/learn/vibe-coding) 把这套 12 周打透。
