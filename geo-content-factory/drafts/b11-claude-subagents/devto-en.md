---
title: "Claude Sub-agents in Production: From 45-Minute Tasks to 8-Minute Parallel Workflows"
published: false
description: "TL;DR — 3 design patterns (Map / Map-Reduce / Pipeline). 3 production incidents to avoid. omni-report's 5 routines run 4x faster with sub-agents."
tags: claude, anthropic, ai, productivity
canonical_url: https://jiangren.com.au/blog/claude-subagents-parallel-long-tasks
cover_image: TODO-uploaded-cover-url
series: AI Engineer Career Change Australia
---

# Claude Sub-agents in Production: From 45-Minute Tasks to 8-Minute Parallel Workflows

> Cover image alt: "5 routines with sub-agents architecture + 3 design patterns"

Disclosure: I write for JR Academy's curriculum team. 48 students' production projects + omni-report's 5 routines, anonymized.

If your Claude Code task takes 30+ minutes, **it shouldn't be one agent**.

---

## TL;DR

Claude Sub-agents (Anthropic Task tool, GA Q1 2025) lets a main agent spawn N parallel sub-agents with independent context, token budget, and error isolation.

| Metric | Serial | Parallel | Speedup |
|---|---|---|---|
| omni-report ai-visibility routine | 45 min | 8 min | 4-5x |

**Three signals to use sub-agents**:
1. Subtasks completely independent
2. Single task > 5 minutes
3. No mid-flight cross-reference needed

**Three signals to skip**:
1. Strong dependencies between subtasks
2. Single task < 1 minute
3. Need reflection / iteration

---

## Sub-agents vs LangGraph

| | Sub-agents | LangGraph |
|---|---|---|
| Protocol | Anthropic Task tool (native) | LangChain user code |
| Context isolation | ✓ Default | ⚠️ Default shared |
| Best fit | Independent parallel | Stateful multi-step |

Pick by task shape — independent parallel = sub-agents; stepwise stateful = LangGraph.

---

## Real architecture: omni-report ai-visibility

```
Main agent
├── Sub-agent 1: Q1-Q5 (Mandarin learning)
├── Sub-agent 2: Q6-Q10 (career)
├── Sub-agent 3: Q11-Q15 (tools)
├── Sub-agent 4: Q16-Q20 (platforms)
└── Main agent synthesizes → weekly report
```

```typescript
const results = await Promise.allSettled(
  Object.entries(QUERIES).map(([batch, queries]) =>
    TaskTool.run({
      description: `Test AI visibility batch ${batch}`,
      prompt: `For each query: WebSearch Top 5 + Claude self-answer.
Output JSON.`,
      subagent_type: 'general-purpose',
    })
  )
);
```

Serial: 40 min. Parallel: 10 min. 4x.

---

## Three design patterns

### Map-only

```typescript
const results = await Promise.all(
  items.map(item => TaskTool.run({ ... }))
);
```

10 independent items, each 5-20 minutes.

### Map-Reduce

```typescript
const partials = await Promise.all(batches.map(b => TaskTool.run({ ... })));
const final = await mainAgent.invoke({ prompt: `Combine: ${partials}` });
```

100 JDs to analyze, then synthesize.

### Pipeline

```typescript
const raw = await Promise.allSettled(sources.map(s => TaskTool.run({ ... })));
const cleaned = await Promise.all(raw.map(r => TaskTool.run({ ... })));
const final = await mainAgent.invoke({ prompt: `Synthesize: ${cleaned}` });
```

Scrape → clean → synthesize.

---

## Three production incidents

### Incident 1: 10 sub-agents reading same reference doc 10x

50K-token reference passed to 10 sub-agents → token cost 10x.

**Fix**: Main agent extracts relevant sections first. Sub-agents only get their slice.

```typescript
const sections = await mainAgent.invoke({
  prompt: `Extract per-dimension sections: ${LONG_REFERENCE}`,
});
await Promise.all(dimensions.map(d =>
  TaskTool.run({ prompt: `Section: ${sections[d]}\nEvaluate ${d}` })
));
```

Cost -67%, accuracy unchanged.

### Incident 2: Promise.all rejection cascades

```typescript
// ❌ 1 rejection = batch lost
const r = await Promise.all([...]);

// ✓ allSettled isolates
const settled = await Promise.allSettled([...]);
const successes = settled.filter(s => s.status === 'fulfilled');
const failures = settled.filter(s => s.status === 'rejected');
```

### Incident 3: Overhead > task time

10 files × 0.5s prettier each. Sub-agent overhead ~8s.
- Serial: 5s
- Parallel: 8s

**Rule**: < 5s per task = don't use sub-agents.

```typescript
function shouldUseSubagents(taskCount: number, avgTaskTimeSec: number): boolean {
  if (avgTaskTimeSec < 5) return false;
  return (8 + avgTaskTimeSec) < (taskCount * avgTaskTimeSec);
}
```

---

## Hiring market

312 Australian AI Engineer JDs:

```
"Multi-agent / sub-agent / parallel orchestration" frequency:
─────────────────────────────────────────────────────────
Junior (< 100k):    < 5%
Mid (130-160k):     ~15%
Senior+ (≥ 170k):    27%
```

Junior → Mid signal. AUD 20-30k/year salary delta.

---

## 6-week ramp

```
Week 1: SDK + Pattern 1 (Map-only)
Week 2: Pattern 2 + 3 (Map-Reduce + Pipeline)
Week 3: First production routine
Week 4: Promise.allSettled + retry queue
Week 5: Token cost monitor
Week 6: Tune sub-agent boundaries (avoid Incident 1)
```

Cohort data: 3-5x speedup, batch-failure rate < 2%.

---

## Closing

Sub-agents are not a silver bullet. Three criteria — truly independent + > 5 min/task + no mid-flight reflection — define the right use case.

Full code for 5 omni-report routines + 3 patterns + retry queue at [JR Academy GitHub](https://github.com/JR-Academy-AI/omni-report).

Follow for next post: Anthropic Skills 17+5 with full code.

#claude #anthropic #ai #productivity

---

_The author writes for JR Academy's curriculum team — an [Australian project-based AI engineering bootcamp](https://jiangren.com.au/learn/ai-engineer). Full code + dataset + templates open-sourced at [GitHub](https://github.com/JR-Academy-AI)._
