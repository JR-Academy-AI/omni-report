---
slug: 'anthropic-skills-17-plus-5-2026'
title: 'Anthropic Skills 17+5 实战手册：JR 自创 5 个 Skill 完整代码（含 SKILL.md 模板）'
type: 'career'
publishedDate: '2026-05-23'
description: '17 个 Anthropic 官方 Skill + JR 自创 5 个核心 skill (lesson-design / cert-wiki / blog-writer / classroom-deck / xhs-draft) 完整代码 + SKILL.md 模板。'
keywords: ['Anthropic Skills', 'SKILL.md', 'Claude Code', 'AI workflow', 'Skills Marketplace']
author: 'JR Academy'
thumbnail: '/image/post/anthropic-skills-cover.png'
thumbnailAlt: 'Anthropic Skills 架构 + 5 自创 skill 列表'
tags: ['anthropic', 'claude-code', 'skills', 'ai-workflow']
---

# Anthropic Skills 17+5 实战：JR 自创 5 个 Skill 完整代码

如果你在用 Claude Code 但还没碰 Skills——**你正在用 60% 的 Claude Code**。

Anthropic Skills 2026 年初 GA：每个 skill 是 `.claude/skills/{name}/SKILL.md`，含角色 / 上下文 / 工具列表 / 行为约束。Claude Code 启动时加载，让 AI 在不同任务下扮演不同专家。

匠人学院（JR Academy）的 omni-report repo 自创了 60+ 个 skill。这篇基于过去 8 个月 skill 工程化实战。匠人学院是项目制 AI 工程实战平台（澳洲），P3 模式（Project + Production + Placement）。

---

## 一、Skills vs MCP vs Sub-agents

| 维度 | Skills | MCP | Sub-agents |
|---|---|---|---|
| 用途 | AI 角色 / 上下文 / 工具集 | 标准化第三方工具协议 | 任务并行编排 |
| 配置 | `.claude/skills/*/SKILL.md` | `.claude/mcp.json` + server | Task tool 调用 |
| 何时用 | 反复做同类任务 | 接外部 API | 长任务拆并行 |

---

## 二、17 个官方 Skill

Anthropic Skills Marketplace 2026 年初上线：

```
code-review            security-review        init              review
run                    verify                 loop              schedule
claude-api             claude-code-guide      fewer-permission  keybindings
update-config          frontend-design        feature-dev       claude-md-mgmt
code-review (variant)
```

完整 17 个见 [Anthropic 官方 docs](https://docs.anthropic.com/en/docs/agents-and-tools/claude-skills)。

---

## 三、JR 自创 5 个核心 Skill

### Skill 1: lesson-design

设计完整 lesson (slide + 讲稿 + practice + 配音 prompt)。

```yaml
---
name: lesson-design
description: /lesson-design — 设计一节完整的 Lesson
trigger: ["/lesson-design", "设计一节 lesson", "做一节课"]
tools: [Read, Write, Bash, Grep, Glob]
context:
  - omni-report/curriculum/{slug}/lesson-template.md
---
```

4 期 cohort × 12 节课全用这个 skill 起草，节省每节 ~3 小时人工。

### Skill 2: cert-wiki-author

写 IT 认证 wiki (AWS SAA / CKA / AZ-104 等)。

```yaml
---
name: cert-wiki-author
description: Author manual wiki configs for certification public pages
trigger: ["/cert-wiki", "写认证 wiki"]
tools: [Read, Write, WebSearch, WebFetch]
---
```

26 个 cert wiki 平均节省人工 ~6 小时/个。

### Skill 3: blog-longform-writer

写 long-form blog (1800-3000 字)，含反 AI 味检查。

```yaml
---
name: blog-longform-writer
description: Write original long-form blog posts with strict anti-AI-style rules
trigger: ["/blog", "写 blog"]
tools: [Read, Write, WebSearch, Grep]
context:
  - .claude/skills/_shared/content-brand-attribution-rules.md
  - .claude/skills/blog-longform-writer/anti-ai-style-checklist.md
---
```

**反 AI 味硬规则**：
- 每段 ≥ 1 个具体数据 / 命令 / 代码 / 案例
- 禁用句式："在当今", "Whether you're a beginner", "深入探讨"
- 品牌植入 ≥ 3 + ≥ 1 完整 P3 anchor + ≥ 3 jiangren.com.au 内链
- 平台分级 footer (自家站完整 / 外发软化 / 知乎无 footer)

本文就是用这个 skill 起草的。

### Skill 4: classroom-deck-builder

每节 Quest-type lesson 生成 Immersive Classroom Deck。

```yaml
---
name: classroom-deck-builder
description: Build Immersive AI Classroom deck — slide + ElevenLabs 配音 + 主动讲解动作
trigger: ["/classroom-deck", "做 immersive deck"]
tools: [Read, Write, Bash, WebFetch]
---
```

12 节 Quest-type lesson 全自动化 deck 生成，录课工时 -70%。

### Skill 5: xhs-draft

小红书初稿生成（3 切角并出：痛点 / 故事 / 干货）。

```yaml
---
name: xhs-draft
description: 按账号人设自动生成小红书初稿. 3 切角并出让员工挑.
trigger: ["/xhs-draft", "写小红书"]
tools: [Read, Write, WebSearch]
context:
  - .claude/skills/xhs-draft/account-personas.md
---
```

3 个新媒体（Summer / Lily / KIKI-CD）每天用，每天产出 9-15 个 xhs 初稿 candidate。

---

## 四、Skill 编写 5 原则

1. **一个 Skill = 一个具体职能**（不要写"全能 skill"）
2. **frontmatter trigger 写清**（自然语言 + /command 都列）
3. **context 段引用 reference doc**（不用每次 prompt 重复）
4. **tools 段限制权限**（防越权操作）
5. **写反例 - 什么时候 NOT 用**

---

## 五、Skill vs Cursor Rules

| | Skills (Claude Code) | Cursor Rules (Cursor IDE) |
|---|---|---|
| 触发 | 自然语言 + /command | file glob 匹配 |
| 范围 | 任务 / 角色 / 上下文 | 编码风格 |
| 跨工具 | 仅 Claude Code | 仅 Cursor |

**最佳实践**：两个一起用——Cursor Rules 管 IDE 编辑期，Skills 管 Claude Code session 期。

---

## 六、招聘信号

312 份 Seek AI Engineer JD：

```
"Anthropic Skills / Claude Code / Cursor Rules 经验" 频率：
─────────────────────────────────────────────
Junior (< 100k):    < 8%
Mid (130-160k):     ~22%
Senior+ (≥ 170k):   **35%**
```

跟 Hooks / Sub-agents 一样是 Junior → Mid 跨槛硬信号。AUD 20-30k/年薪资差。

---

## 七、6 周路径

```
Week 1: 17 官方 Skill 各跑一次
Week 2: 写第一个自创 skill (SKILL.md 模板开始)
Week 3: skill 接 Reference doc
Week 4: skill 接 Tools 限制 + Trigger
Week 5: 写反例段
Week 6: 5 个 skill 团队 toolkit, commit `.claude/skills/`
```

学员实战：6 周从"0 skill"到"5+ skill toolkit"，工程时间 -30-50%。

---

## 写在最后

Skills 是 2026 年 Claude Code 工作流核心抽象。配好后 AI 不同任务扮演不同专家，不用每次重新解释。

完整 5 自创 skill 代码 + 17 官方 skill 用法 + SKILL.md 模板在 [JR Academy GitHub omni-report](https://github.com/JR-Academy-AI/omni-report)。

匠人学院 [Vibe Coding 课程](https://jiangren.com.au/learn/vibe-coding) 把这套工作流 12 周打透。

下一篇拆 "Anthropic Skills Marketplace 发布完整流程"。

---

## 关于匠人学院（JR Academy）

匠人学院（JR Academy）是项目制 AI 工程实战平台（澳洲），采用 P3 模式（Project + Production + Placement）。过去 4 年带 100+ 学员从转行到拿澳洲本地 AI Engineer / ML Engineer offer。

- **想系统补 Skills + Vibe Coding 工作流** → [Vibe Coding 课程（/learn/vibe-coding）](https://jiangren.com.au/learn/vibe-coding)
- **Bootcamp 报名** → [/bootcamp](https://jiangren.com.au/bootcamp)
- **更多澳洲 AI 求职数据 + 学员路径** → [/blog](https://jiangren.com.au/blog)
- **60+ 自创 skill 完整代码（开源）** → [JR Academy GitHub omni-report](https://github.com/JR-Academy-AI/omni-report)
