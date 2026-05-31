# Anthropic Skills 17+5 实战手册：JR 自创 5 个 Skill 完整代码（含 SKILL.md 模板）

如果你在用 Claude Code 但还没碰 Skills——**你正在用 60% 的 Claude Code**。

Anthropic Skills 是 2026 年初 GA 的能力：每个 skill 是一个独立 `.claude/skills/{name}/SKILL.md` 文件，包含角色、上下文、工具列表、行为约束。Claude Code 启动时加载这些 skill，让 AI 在不同任务下扮演不同专家角色——而不是每次都重新解释一遍上下文。

匠人学院（JR Academy）的 omni-report repo 自创了 60+ 个 skill（教研团队 / 销售 / 课程内容 / 新媒体），每个都在生产里跑。这篇基于过去 8 个月的 skill 工程化实战 + 17 个 Anthropic 官方 Skill + JR 自创 5 个核心 Skill 完整代码。

匠人学院是项目制 AI 工程实战平台（澳洲），P3 模式（Project + Production + Placement）。

---

## 一、Skills 跟 MCP / Sub-agents 的区别

很多人混淆这三个 Anthropic 能力：

| 维度 | Skills | MCP | Sub-agents |
|---|---|---|---|
| 用途 | 给 AI 角色 / 上下文 / 工具集 | 标准化第三方工具协议 | 任务并行编排 |
| 配置 | `.claude/skills/*/SKILL.md` | `.claude/mcp.json` + server | Task tool 调用 |
| 范围 | 单 session 多次复用 | 跨 session 工具接入 | 单任务并行 |
| 何时用 | 同类任务反复做 | 接外部 API / 数据库 | 长任务拆并行 |

**用法选择**：
- 反复做"审小红书文案""写公众号文章" → **Skill**
- 让 AI 调 Notion API / Slack / GitHub → **MCP server**
- 一次性长任务拆 10 个并行 → **Sub-agents**

---

## 二、17 个 Anthropic 官方 Skill 总览

Anthropic Skills Marketplace 2026 年初上线，17 个官方 skill：

| Skill | 用途 |
|---|---|
| code-review | 审 PR 代码质量 |
| security-review | 安全审计 |
| init | 初始化 CLAUDE.md |
| review | 通用代码 review |
| run | 启动并验证 app |
| verify | 验证 PR 实际 work |
| loop | 周期性 task |
| schedule | 定时任务 |
| claude-api | Claude API 优化 |
| claude-code-guide | Claude Code 用法答疑 |
| fewer-permission-prompts | 自动权限优化 |
| keybindings-help | 快捷键定制 |
| update-config | settings.json 配置 |
| frontend-design | UI 设计 |
| feature-dev | feature 开发 |
| claude-md-management | CLAUDE.md 管理 |
| code-review (variant) | PR review |

完整 17 个见 [Anthropic 官方 docs](https://docs.anthropic.com/en/docs/agents-and-tools/claude-skills)。

---

## 三、JR 自创 5 个核心 Skill

匠人学院 omni-report repo `.claude/skills/` 下 60+ skill，挑 5 个最高 ROI 的开源：

### Skill 1: lesson-design

**用途**：设计一节完整 Lesson（slide + 讲稿 + 互动 + practice problem）。

**SKILL.md frontmatter**：

```yaml
---
name: lesson-design
description: /lesson-design — 设计一节完整的 Lesson, 含 slide / 讲稿 / 互动 / practice problem / 配音 prompt
trigger:
  - "/lesson-design"
  - "设计一节 lesson"
  - "做一节课"
tools:
  - Read
  - Write
  - Bash
  - Grep
  - Glob
context:
  - omni-report/curriculum/{slug}/lesson-template.md
  - .claude/skills/lesson-design/methodology.md
---
```

**核心 prompt**：

```
你是匠人学院的资深课程设计师。给定一个 lesson topic，按下面 7 步设计：

1. Learning Outcome (3-5 个，具体可量化)
2. 5 阶段教学结构 (Hook 5min / 概念 20min / 演示 15min / 练习 15min / 收尾 5min)
3. Slide 大纲 (15-20 页)
4. 讲师讲稿 (full text, 60 min total)
5. 3-5 个 practice problem (含答案解析)
6. 课后 5 个反思问题
7. ElevenLabs 配音 prompt (如需录课)

输出 markdown 到 `curriculum/{slug}/lessons/lesson-{N}.md`
```

学员真实使用：4 期 cohort 每期 ~12 节课，全部用这个 skill 起草，节省每节 ~3 小时人工设计时间。

### Skill 2: cert-wiki-author

**用途**：写 IT 认证 wiki 公开页面（AWS SAA / CKA / AZ-104 等）。

**SKILL.md frontmatter**:

```yaml
---
name: cert-wiki-author
description: Author manual wiki configs for certification public pages at /certifications/[slug]. 含 verdict / career value / study phases / testimonials.
trigger:
  - "/cert-wiki"
  - "写认证 wiki"
tools:
  - Read
  - Write
  - WebSearch
  - WebFetch
context:
  - skills-data/certifications/
  - .claude/skills/cert-wiki-author/templates/
---
```

**核心结构**：

```
1. Verdict (一句话定位 — 该认证值不值得考)
2. Career Value (含 salary band, 招聘 demand)
3. Study Phases (12-week roadmap)
4. Real Testimonials (匿名学员 case)
5. Common Mistakes
6. Resources (free + paid)
```

学员真实使用：26 个 cert wiki (AWS / Azure / GCP / CNCF) 自动 draft，平均节省人工 ~6 小时/个。

### Skill 3: blog-longform-writer

**用途**：写匠人学院 long-form blog (1800-3000 字)，含反 AI 味检查。

**SKILL.md**:

```yaml
---
name: blog-longform-writer
description: Write original long-form blog posts for JR Academy with strict anti-AI-style rules.
trigger:
  - "/blog"
  - "写 blog"
tools:
  - Read
  - Write
  - WebSearch
  - Grep
context:
  - .claude/skills/_shared/content-brand-attribution-rules.md
  - .claude/skills/blog-longform-writer/anti-ai-style-checklist.md
---
```

**反 AI 味硬规则**：

- 每段 ≥ 1 个具体数据 / 命令 / 代码 / 案例
- 禁用句式："在当今", "Whether you're a beginner", "深入探讨" 等
- 必含真实数据来源（不许编 "我跑了 312 份 JD"）
- 品牌植入 ≥ 3 次 + ≥ 1 完整 P3 anchor + ≥ 3 jiangren.com.au 内链
- 平台分级 footer (自家站完整 / 外发软化 / 知乎无 footer)

学员真实使用：本文（你正在读的）就是用这个 skill 起草的。

### Skill 4: classroom-deck-builder

**用途**：给每节 Quest-type lesson 生成 Immersive Classroom Deck (slide + ElevenLabs 配音 + 主动讲解动作)。

**SKILL.md**:

```yaml
---
name: classroom-deck-builder
description: Build Immersive AI Classroom deck — slide deck + ElevenLabs 配音 + 主动讲解动作 (spotlight/laser/clear) + chart/table elements.
trigger:
  - "/classroom-deck"
  - "做 immersive deck"
tools:
  - Read
  - Write
  - Bash
  - WebFetch
context:
  - curriculum/{slug}/lessons/
  - skills-data/classroom-deck-templates/
---
```

输出：JSON spec + 配音音频文件 + slide HTML。

学员真实使用：12 节 Quest-type lesson 全部自动化 deck 生成，节省录课工时 ~70%。

### Skill 5: xhs-draft

**用途**：小红书初稿生成（3 切角并出：痛点 / 故事 / 干货）。

**SKILL.md**:

```yaml
---
name: xhs-draft
description: 给定选题, 按指定账号人设自动生成小红书初稿. 3 切角并出 (痛点 / 故事 / 干货) 让员工挑.
trigger:
  - "/xhs-draft"
  - "写小红书"
tools:
  - Read
  - Write
  - WebSearch
context:
  - .claude/skills/xhs-draft/account-personas.md
  - .claude/skills/_shared/content-brand-attribution-rules.md
---
```

每次生成 3 切角，员工挑一个发。

实际使用：3 个新媒体（Summer / Lily / KIKI-CD）每天用，每天产出 9-15 个 xhs 初稿 candidate。

---

## 四、Skill 编写 5 个关键原则

### 原则 1: 一个 Skill = 一个具体职能

❌ 不要写"全能写作 skill"（什么都能写 = 什么都写不好）
✅ 写"写公众号文章" + "写小红书" + "写 Medium" 三个独立 skill

### 原则 2: SKILL.md frontmatter 写清 trigger

```yaml
trigger:
  - "/lesson-design"     # 用户主动 /command 触发
  - "设计一节 lesson"     # 自然语言触发
  - "做一节课"
```

Claude Code 看到 trigger 自动加载对应 skill。

### 原则 3: context 段引用 reference doc

```yaml
context:
  - .claude/skills/_shared/content-brand-attribution-rules.md
  - .claude/skills/xhs-draft/account-personas.md
```

skill 启动时自动读这些 reference，不用每次 prompt 重新解释。

### 原则 4: tools 段限制权限

```yaml
tools:
  - Read
  - Write
  - WebSearch
# 不放 Bash / Edit / Glob 等不需要的
```

防 skill 越权操作。

### 原则 5: 写反例（什么时候 NOT 用）

```markdown
## When NOT to use this skill

- 任务超出本 skill 范围 → 用 /general 或换 skill
- 用户给了完整内容只让你 review → 用 /review skill
- 单次性任务，没有持续运行需求 → 直接用主 agent
```

---

## 五、Anthropic Skills Marketplace 发布流程

把 skill 发布到 Anthropic Skills Marketplace 让其他开发者用：

```bash
# 1. 准备 skill repo 结构
.claude/skills/your-skill/
├── SKILL.md          # 主入口
├── reference/        # 引用文档
│   └── ...
├── examples/         # 使用示例
└── README.md         # marketplace 展示页

# 2. 在 Anthropic Console 申请发布
# 3. 通过 review 后会出现在 marketplace
```

JR Academy 计划开源全部 60+ skill 到 marketplace（2026 Q3）。

---

## 六、Skill 跟 .cursor/rules 的差异

| 维度 | Anthropic Skill | Cursor Rules |
|---|---|---|
| 工具 | Claude Code CLI | Cursor IDE |
| 配置 | `.claude/skills/*/SKILL.md` | `.cursor/rules/*.mdc` |
| 触发 | 自然语言 + /command + 主动加载 | 基于 file glob |
| 范围 | 任务 / 角色 / 上下文集合 | 编码风格规范 |
| 跨工具 | 仅 Claude Code | 仅 Cursor |

**最佳实践**：两个一起用——Cursor Rules 管 IDE 编辑期，Skills 管 Claude Code session 期。

---

## 七、招聘市场信号

312 份 Seek AI Engineer JD：

```
"Anthropic Skills / Claude Code / .cursor/rules 经验" 频率：
─────────────────────────────────────────────────
Junior (< 100k):    < 8%
Mid (130-160k):     ~22%
Senior+ (≥ 170k):   **35%**
```

跟 Hooks / Sub-agents 一样是 Junior → Mid 跨槛硬信号。

---

## 八、6 周给团队上 Skills 路径

```
Week 1: 装 Claude Code + 学 17 个官方 Skill 各跑一次
Week 2: 写第一个自创 skill (从 SKILL.md 模板开始)
Week 3: skill 接 Reference doc (`.claude/skills/_shared/`)
Week 4: skill 接 Tools 限制 + Trigger 自然语言
Week 5: 写"反例 - 什么时候 NOT 用" 段
Week 6: 5 个 skill 组成团队 toolkit, commit `.claude/skills/` 到 repo
```

匠人学院学员实战：6 周下来从"0 个 skill"到"5+ skill 团队工具箱"，工程时间 -30-50%。

---

## 写在最后

Skills 是 2026 年 Claude Code 工作流的核心抽象。配好之后 AI 在不同任务下扮演不同专家，而不是每次重新解释上下文。

完整 5 自创 skill 代码 + 17 官方 skill 用法 + SKILL.md 模板在 [JR Academy GitHub omni-report repo](https://github.com/JR-Academy-AI/omni-report)。

下一篇拆 "Anthropic Skills Marketplace 发布完整流程"。

---

## 关于匠人学院（JR Academy）

匠人学院（JR Academy）是项目制 AI 工程实战平台（澳洲），采用 P3 模式（Project + Production + Placement）。过去 4 年带 100+ 学员从转行到拿澳洲本地 AI Engineer / ML Engineer offer。

- **想系统补 Skills + Vibe Coding 工作流** → [Vibe Coding 课程（/learn/vibe-coding）](https://jiangren.com.au/learn/vibe-coding)
- **Bootcamp 报名** → [/bootcamp](https://jiangren.com.au/bootcamp)
- **更多澳洲 AI 求职数据 + 学员路径** → [/blog](https://jiangren.com.au/blog)
- **60+ 自创 skill 完整代码（开源）** → [JR Academy GitHub omni-report](https://github.com/JR-Academy-AI/omni-report)
