<!--
CSDN 标签：Anthropic / Claude Code / Skills / SKILL.md / YAML
分类专栏：AI 工程实战
封面：5 自创 skill 完整代码
-->

# Anthropic Skills 完整可粘贴 SKILL.md 模板：JR 自创 5 个生产级 skill 代码

如果你已经在用 Claude Code 但还没碰 Skills——这篇是给你的实操手册。

匠人学院（JR Academy）的 omni-report repo 自创了 60+ 个 skill 在生产里跑。匠人学院是项目制 AI 工程实战平台（澳洲），P3 模式（Project + Production + Placement）。

---

## 1. Skills 文件结构

```
.claude/skills/
├── _shared/                          # 共享 reference
│   └── content-brand-attribution-rules.md
├── lesson-design/
│   ├── SKILL.md                       # 主入口
│   ├── methodology.md                 # 教学法 reference
│   ├── examples/
│   └── README.md
├── cert-wiki-author/
│   ├── SKILL.md
│   └── templates/
└── ... (60+ skills)
```

---

## 2. SKILL.md frontmatter 完整字段

```yaml
---
name: skill-name-kebab-case            # 必填
description: 一句话说清干啥用              # 必填, 给 marketplace 看
trigger:                                # 触发词列表
  - "/skill-name"                       # /command 触发
  - "自然语言触发词 1"
  - "自然语言触发词 2"
tools:                                  # 限制可用 tool
  - Read
  - Write
  - Bash
  - Grep
  - Glob
  - WebSearch
  - WebFetch
context:                                # 启动时自动加载的 reference doc
  - omni-report/curriculum/template.md
  - .claude/skills/_shared/rules.md
permissions:                            # (可选) 细粒度权限
  bash_allow:
    - "npm run *"
    - "uv run *"
  bash_deny:
    - "rm -rf"
    - "git reset --hard"
---

# Skill 主 prompt

你是 [角色定义]。给定 [输入类型]，按 [N 步流程] 处理：

1. ...
2. ...
3. ...

## Output format

[输出格式说明]

## When NOT to use this skill

- 反例 1
- 反例 2
- 反例 3
```

---

## 3. JR 自创 5 个 skill 完整代码

### Skill 1: lesson-design (完整代码)

```markdown
# .claude/skills/lesson-design/SKILL.md

---
name: lesson-design
description: /lesson-design — 设计一节完整的 Lesson, 含 slide / 讲稿 / 互动 / practice problem / 配音 prompt
trigger:
  - "/lesson-design"
  - "设计一节 lesson"
  - "做一节课"
  - "/lesson"
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

# Lesson Design Skill

你是匠人学院的资深课程设计师。给定一个 lesson topic，按 7 步设计：

## Step 1: Learning Outcome (3-5 个)

- 必须可量化 (e.g., "能跑通 100 行裸 RAG 代码", not "理解 RAG 概念")
- 用 Bloom Taxonomy 高阶动词 (Apply, Analyze, Evaluate, Create)

## Step 2: 5 阶段教学结构

```
1. Hook       5 min    抓注意力 (痛点 / 反常识数据 / 学员故事)
2. Concept    20 min   核心概念 (max 3 个 key point)
3. Demo       15 min   讲师演示真实代码
4. Practice   15 min   学员动手 (小 lab)
5. Wrap-up    5 min    回顾 + 下节预告
```

## Step 3: Slide 大纲 (15-20 页)

- 每页 ≤ 30 字
- 多用 diagram / table
- Code snippet 高亮关键行

## Step 4: 讲师讲稿 (full text, 60 min)

- 1 min 讲稿 ≈ 150-200 字
- 含具体例子 / 学员真实问题 / 反例

## Step 5: 3-5 个 practice problem

- 含答案解析
- 难度递增

## Step 6: 课后 5 个反思问题

- 不是 quiz，是反思
- 例: "如果你的 client 不接受 RAG accuracy 84%，你怎么解释 trade-off?"

## Step 7: ElevenLabs 配音 prompt

如果需要录课：

```
Voice: confident, friendly, slightly enthusiastic. Pace: medium.
Pronunciation: tech terms in original English (LangChain, Claude).
```

## Output format

输出 markdown 到 `curriculum/{slug}/lessons/lesson-{N}.md`

## When NOT to use this skill

- 短于 30 分钟的内容 (mini-tutorial)
- 1v1 mentor session (用 /mentor-session skill)
- Workshop hands-on heavy (用 /workshop-design skill)
```

学员真实使用：4 期 cohort × 12 节课全用，每节省 ~3 小时。

### Skill 2-5 模板（简版）

完整 5 skill 代码 ~3000 行，落 [JR Academy GitHub omni-report repo](https://github.com/JR-Academy-AI/omni-report)。

### Skill 2: cert-wiki-author

```yaml
---
name: cert-wiki-author
trigger: ["/cert-wiki", "写认证 wiki"]
tools: [Read, Write, WebSearch, WebFetch]
context:
  - skills-data/certifications/
  - .claude/skills/cert-wiki-author/templates/
---
# 6 段结构: Verdict / Career Value / Study Phases / Testimonials / Mistakes / Resources
```

### Skill 3: blog-longform-writer

```yaml
---
name: blog-longform-writer
trigger: ["/blog", "写 blog"]
tools: [Read, Write, WebSearch, Grep]
context:
  - .claude/skills/_shared/content-brand-attribution-rules.md
  - .claude/skills/blog-longform-writer/anti-ai-style-checklist.md
---
# 反 AI 味硬规则 + 平台分级 footer
```

### Skill 4: classroom-deck-builder

```yaml
---
name: classroom-deck-builder
trigger: ["/classroom-deck"]
tools: [Read, Write, Bash, WebFetch]
context:
  - skills-data/classroom-deck-templates/
---
# 输出: JSON spec + ElevenLabs 配音音频 + slide HTML
```

### Skill 5: xhs-draft

```yaml
---
name: xhs-draft
trigger: ["/xhs-draft", "写小红书"]
tools: [Read, Write, WebSearch]
context:
  - .claude/skills/xhs-draft/account-personas.md
  - .claude/skills/_shared/content-brand-attribution-rules.md
---
# 3 切角并出: 痛点版 / 故事版 / 干货版
```

---

## 4. Skills 跟 MCP / Sub-agents 的代码区别

```typescript
// Skills: 启动 Claude Code 时自动加载，session 内反复用
// .claude/skills/lesson-design/SKILL.md 即配置全部

// MCP: 接外部服务
// .claude/mcp.json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["@notion/mcp-server"]
    }
  }
}

// Sub-agents: 主 agent 主动调用
const result = await TaskTool.run({
  description: 'Analyze 10 GitHub repos in parallel',
  prompt: '...',
  subagent_type: 'general-purpose',
});
```

---

## 5. 5 个 Skill 编写原则

1. **一 Skill = 一具体职能**（不写"全能 skill"）
2. **frontmatter trigger 写清**（自然语言 + /command 都列）
3. **context 段引用 reference doc**（不用每次 prompt 重复）
4. **tools 段限制权限**（防越权）
5. **写反例段** What NOT to use this skill

---

## 6. Anthropic Skills Marketplace 发布

```bash
# 1. 准备 skill repo 结构
mkdir -p .claude/skills/your-skill/{reference,examples}
touch .claude/skills/your-skill/{SKILL.md,README.md}

# 2. 在 Anthropic Console 申请发布
# 3. 通过 review 后出现在 marketplace
```

JR Academy 计划 2026 Q3 开源全部 60+ skill 到 marketplace。

---

## 7. Skill vs Cursor Rules vs Hooks

```
.claude/skills/       — Skills (Claude Code session 期, 角色/上下文)
.cursor/rules/        — Cursor Rules (Cursor IDE 编辑期, 编码风格)
.claude/settings.json — Hooks (Claude Code 事件驱动, pre-bash 等)
```

3 个互补，可以一起配。

---

## 8. 招聘信号

```
312 Seek AI Engineer JD: "Anthropic Skills / Claude Code / Cursor Rules" 频率
─────────────────────────────────────────────────────
Junior (< 100k):    < 8%
Mid (130-160k):     ~22%
Senior+ (≥ 170k):   ~35%
```

---

## 9. 6 周路径

```
Week 1: 跑 17 官方 skill
Week 2: 写第一个自创 skill (从 SKILL.md 模板)
Week 3: 接 reference doc
Week 4: tools 权限 + trigger 自然语言
Week 5: 写反例段
Week 6: 5 个 skill commit `.claude/skills/` 到 repo
```

学员实战：6 周下来工程时间 -30-50%。

---

完整 5 自创 skill 代码 + 17 官方 skill 用法 + SKILL.md 模板在 [JR Academy GitHub omni-report](https://github.com/JR-Academy-AI/omni-report)。

匠人学院 [Vibe Coding 课程](https://jiangren.com.au/learn/vibe-coding) 把这套工作流 12 周打透 + 6 周 mentor 1v1。

---

_本文作者来自匠人学院（[JR Academy](https://jiangren.com.au/learn/vibe-coding)）—— 澳洲项目制 AI 工程实战平台。完整代码 / 数据集 / 模板见 [GitHub](https://github.com/JR-Academy-AI)。_
