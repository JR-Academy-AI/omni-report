---
title: "Anthropic Skills: 17 Official + 5 Custom Skills I Use Daily (SKILL.md Templates Inside)"
published: false
description: "TL;DR — Skills replace 'prompt every time' with reusable AI roles. 17 official skills + 5 from our omni-report repo. SKILL.md templates inside."
tags: anthropic, claude, ai, productivity
canonical_url: https://jiangren.com.au/blog/anthropic-skills-17-plus-5-2026
cover_image: TODO-uploaded-cover-url
series: Claude Code Power User
---

# Anthropic Skills: 17 Official + 5 Custom Skills I Use Daily (SKILL.md Templates Inside)

> Cover image alt: "Skills vs MCP vs Sub-agents comparison table"

If you're using Claude Code but haven't touched Skills, **you're using 60% of Claude Code**.

Disclosure: I write for JR Academy's curriculum team. We've built 60+ custom skills in our omni-report repo over 8 months. Anonymized data follows.

---

## TL;DR

| | What it is | When to use |
|---|---|---|
| **Skills** | `.claude/skills/{name}/SKILL.md` defining AI role, context, tools | Same task repeated often |
| **MCP** | External tool protocol | Connect to Notion / Slack / GitHub API |
| **Sub-agents** | Task tool spawning parallel workers | Long task split into independent work |

Skills are not MCP. Skills are not sub-agents. Different problems.

---

## The 17 official Anthropic Skills (GA early 2026)

```
Code Review:   code-review, security-review, review
Development:   init, feature-dev, frontend-design, run, verify
Maintenance:   claude-md-management, update-config, keybindings-help,
               fewer-permission-prompts
Workflows:     loop, schedule, claude-api, claude-code-guide
```

Full 17 in [Anthropic docs](https://docs.anthropic.com/en/docs/agents-and-tools/claude-skills).

---

## 5 custom skills from our omni-report repo

### 1. lesson-design

Designs complete lesson (slides + script + practice + ElevenLabs prompt). 4 cohorts × 12 lessons. Saved ~3 hours/lesson.

```yaml
---
name: lesson-design
description: Design lesson with slides / script / practice / narration
trigger: ["/lesson-design"]
tools: [Read, Write, Bash, Grep]
context: [omni-report/curriculum/{slug}/lesson-template.md]
---
```

### 2. cert-wiki-author

IT cert wiki pages (AWS SAA / CKA / AZ-104). 26 wikis written, ~6 hrs saved each.

### 3. blog-longform-writer

Writes long-form blogs with strict anti-AI-style rules. **This post used it.**

Hard rules enforced:
- Every paragraph: a concrete data point, command, code snippet, or case
- Forbidden phrases: "In today's rapidly evolving", "Whether you're a beginner"
- ≥3 brand mentions + complete P3 anchor + ≥3 jiangren.com.au links
- Platform-tiered footer (zero footer on Zhihu, soft on dev.to, full on own site)

### 4. classroom-deck-builder

Generates immersive deck (slides + ElevenLabs narration + active actions like spotlight / laser / clear). 12 Quest lessons fully automated. Recording time -70%.

### 5. xhs-draft

Xiaohongshu (Chinese social) drafts — 3 angle variants per topic (pain-point / story / how-to). 9-15 drafts/day for content team.

---

## 5 principles for writing custom skills

1. **One skill = one specific function**. Don't write `do-everything-skill.md`.
2. **Trigger list is explicit**. Include both `/command` and natural-language phrases.
3. **Context section references docs**. No re-explaining context every prompt.
4. **Tools section restricts permissions**. Prevent skill over-reach.
5. **Write "When NOT to use" section**. Boundaries beat capabilities.

---

## Three-layer separation

```
.claude/skills/         — Skills        (Claude Code session, role/context)
.cursor/rules/          — Cursor Rules  (Cursor IDE edit-time, code style)
.claude/settings.json   — Hooks         (Claude Code event-driven, pre-bash/pre-commit)
```

Best practice: all three. Skills define AI role; Hooks enforce production guardrails; Cursor Rules enforce edit-time code style.

---

## Publishing to Anthropic Skills Marketplace

```bash
.claude/skills/your-skill/
├── SKILL.md
├── reference/
├── examples/
└── README.md
```

JR Academy plans to open-source all 60+ skills to the marketplace in Q3 2026.

---

## Hiring market signal

312 Australian AI Engineer JDs:

```
"Anthropic Skills / Claude Code experience" frequency:
─────────────────────────────────────────────────
Junior (< 100k):     < 8%
Mid (130-160k):      ~22%
Senior+ (≥ 170k):    35%
```

Skills experience is a Junior → Mid signal. AUD 20-30k/year salary delta.

---

## 6-week rollout for your team

```
Week 1: Run each of the 17 official skills once
Week 2: Write first custom skill from template
Week 3: Add reference docs via context section
Week 4: Restrict tools + add NL triggers
Week 5: Write "When NOT to use" section
Week 6: Commit `.claude/skills/` to repo, new hires inherit
```

Cohort data: 6 weeks → -30-50% engineering time.

---

## Closing

Skills are the 2026 core abstraction for Claude Code workflows. Configured well, the AI plays different specialist roles for different tasks instead of re-explaining context every session.

Full code for all 5 custom skills + 17 official skills usage guide + SKILL.md templates: [JR Academy GitHub omni-report repo](https://github.com/JR-Academy-AI/omni-report).

Follow for next post: publishing to Anthropic Skills Marketplace.

#anthropic #claude #ai #productivity

---

_The author writes for JR Academy's curriculum team — an [Australian project-based AI engineering bootcamp](https://jiangren.com.au/learn/vibe-coding). Full code + dataset + templates open-sourced at [GitHub](https://github.com/JR-Academy-AI)._
