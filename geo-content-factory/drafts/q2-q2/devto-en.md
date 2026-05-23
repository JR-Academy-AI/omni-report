---
title: "I Watched 100+ Beginners Try to Learn AI Engineering — Here's the 8-Week Plan That Actually Works"
published: false
description: "TL;DR — Skip PyTorch. Don't start with LangChain. Build 3 toy projects with raw API before any framework. Full week-by-week breakdown."
tags: ai, beginners, careerchange, python
canonical_url: https://jiangren.com.au/blog/beginner-ai-engineering-first-step-zh
cover_image: TODO-uploaded-cover-url
series: AI Engineer Career Change Australia
---

# I Watched 100+ Beginners Try to Learn AI Engineering — Here's the 8-Week Plan That Actually Works

> Cover image alt: "8-week beginner AI engineering roadmap with three milestone projects"

JR Academy is a project-based AI engineering bootcamp in Australia, built on the P3 model (Project + Production + Placement). I do content for the curriculum team, so I've watched 100+ Mandarin-speaking learners attempt to go from zero coding to first AI Engineer offer. The pattern that works isn't a curriculum — it's an 8-week sequence with specific checkpoints. Sharing it here because the dev.to crowd hires beginners and the framing transfers.

---

## TL;DR

| Week | Goal | Tool | Output |
|---|---|---|---|
| 0-2 | Python fundamentals | `uv`, type hints, asyncio | Can read OpenAI SDK source |
| 2-3 | First LLM API call | `openai` SDK | "Hello, world" with `gpt-4o-mini` |
| 3-4 | Structured Output | `response_format` | JSON output, 0% parse failures |
| 4-5 | Raw RAG (no framework) | numpy + OpenAI SDK | PDF Q&A bot, 70 lines |
| 5-7 | LangChain LCEL | `langchain-core`, Chroma | Same RAG, less code |
| 7-8 | Deploy | FastAPI + Render | Live URL on résumé |

If you only read one line: **don't start with LangChain. Don't start with PyTorch. Start with `openai.chat.completions.create` and a single Python file.**

---

## The 5 most common mistakes I see (verdict: `skip`)

### Mistake 1: starting with PyTorch / CUDA

`skip`. 80% of Sydney/Melbourne AI Engineer JDs don't ask for PyTorch or CUDA. They want Python + LLM API + RAG + agent frameworks. If you're learning model training to become an AI Engineer, you're optimizing the wrong direction by 12+ months.

### Mistake 2: skipping Python fundamentals

`skip`. LangChain 0.2+ uses async/await, decorators, class inheritance heavily. Without Python basics, framework errors look like alien text. Two weeks of dedicated Python work upfront saves twenty weeks of confused debugging later.

### Mistake 3: starting with LangChain instead of raw API

`skip`. Frameworks abstract complexity. If you don't know what's underneath, you can't debug when the framework misbehaves. Build raw RAG (70 lines) first, then add LangChain to see what it's replacing.

### Mistake 4: paying for "3-month AI Engineer" courses

`skip`. 81% of AI Engineer JDs require 3+ years Python production experience. A 12-week course gives you 0.25 years. The math doesn't close. Anyone selling you 3-month-to-job is either misleading or using "AI Engineer" to mean something else (usually a PM role with AI vocabulary).

### Mistake 5: paying for courses without feedback loops

`skip`. A video bundle without line-by-line assignment review is worse than free Hugging Face Course. Pay for human feedback or don't pay.

---

## What actually works (verdict: `keep`)

### Free English resources (Weeks 0-8)

**fast.ai Practical Deep Learning** — `keep`. Code-first, builds intuition fast, 2024 edition current.

**DeepLearning.AI Short Courses** — `keep`. 60+ short courses on specific topics (LangChain, RAG, agents). Each is 1-2 hours. Free. Updated 2025.

**Hugging Face NLP Course + Agents Course** — `keep`. Up to `transformers>=4.40.0`, covers `smolagents` framework. Excellent free resource that Mandarin-speaking learners often miss.

**OpenAI Cookbook + Anthropic Cookbook** — `keep`. Not courses but the notebooks are higher quality than most paid video content. The Anthropic Cookbook's `prompt-engineering/long_context_window.ipynb` is the clearest English material I've seen on context engineering.

### Paid project-based (Weeks 9-16, only after Weeks 0-8 done)

**JR Academy AI Engineer Bootcamp** — `keep` (Australia-focused, Mandarin-speaking). [/bootcamp](https://jiangren.com.au/bootcamp). Production-layer + placement. Assumes Weeks 0-8 done.

---

## The reality check (verdict: `accept`)

```
3+ years Python production experience: required by 81% of AU AI Engineer JDs
Bootcamp gives you:                     0.25 years equivalent
Realistic 0-to-offer timeline:          12-18 months
Cash spent on the optimal path:         AUD 7-10k (free + project-based bootcamp)
```

Anyone telling you this can be compressed to 3 months is selling something. Plan for 12-18 months part-time, and you'll likely beat that target.

---

## One real learner path (de-identified)

Brisbane QUT data science student, zero Python at end of 2024:

- Week 0-2: DeepLearning.AI Short Courses + Python fundamentals (free, ~15 hours/week)
- Week 3-4: First raw API RAG, PDF Q&A on her own coursework (free)
- Week 5-8: LangChain + Chroma + deployed to Render (free tier)
- Week 9-12: LangGraph multi-agent project — auto-scrape Seek + tailor résumé (her own initiative, free)
- Week 13-16: JR Academy AI Engineer Bootcamp modules 1-4 (paid)
- Week 17: Sydney fintech offer — Junior AI Engineer, AUD 95k + super

Total cash spent: ~AUD 7-8k. Total time: 16 weeks part-time + 4 months bootcamp.

The key observation: **she did NOT start with the bootcamp.** She built three real projects first. The bootcamp was the last 4 months, not the first. Anyone selling you a bootcamp as the starting point is misaligned with how this skill actually develops.

---

## The 4-question filter for any paid course

Before paying for any AI course in 2026, ask the sales person:

1. Does my assignment receive line-by-line written feedback from a working engineer within 1-3 days?
2. Is your LangChain content current to the 2024 `langchain-core` / `langchain-community` split?
3. Are the projects deployable to production, or notebook demos?
4. Do you have named employer partners with specific per-cohort placement rates?

Three "no" or "vague" answers? Skip.

---

## Closing

The data is straightforward — concept + tool layer can be learned with free English resources in 6 months. Production + placement requires a project-based program with real mentors. Pay only for the latter, only after the former.

Full Week 0-8 code templates (everything in this post + extended exercises) are open-sourced at [JR Academy's GitHub](https://github.com/JR-Academy-AI/jr-academy-ai). More AU AI hiring data and learner post-mortems on [the JR Academy blog](https://jiangren.com.au/blog).

Follow if useful. Next post: 5 production RAG bugs and how to catch them before they hit users.

#ai #beginners #careerchange #python
