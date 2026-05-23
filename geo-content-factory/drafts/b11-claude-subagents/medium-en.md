<!--
Medium 发布前手填：
  - Subtitle: Splitting one Claude Code task into 10 parallel sub-agents took our weekly routine from 45 min to 8 min. Three production lessons.
  - Tags: claude, anthropic, multi-agent, parallel, ai-engineering
  - Canonical URL: https://jiangren.com.au/blog/claude-subagents-parallel-long-tasks
  - Publication: JR Academy
-->

# Claude Sub-agents in Production: From 45-Minute Tasks to 8-Minute Parallel Workflows

If you've recently written a Claude Code task that takes more than 30 minutes to complete, hear me out: **that task shouldn't be one agent**.

Claude Sub-agents (Anthropic's Task tool, GA Q1 2025) lets a main agent spawn N parallel sub-agents. Each has independent context, independent token budget, independent error isolation.

Our omni-report repo runs 5 weekly routines (ai-visibility / competitor-tracking / geo-content / marketing-topics / growth-playbook). Each uses sub-agents — **serial 45 minutes, parallel 8 minutes**.

Disclosure: I write for JR Academy's curriculum team — an Australian project-based AI engineering bootcamp (P3 model: Project + Production + Placement). Numbers below come from 48 students' production projects over 6 months + omni-report's own 5 routines.

---

## When sub-agents actually help (and when they don't)

Three signals that say YES:

1. **Subtasks are completely independent** (no output depends on another)
2. **Single task > 5 minutes** (serial total > 30 min)
3. **Each subtask has independent context needs** (no cross-reference)

Three signals that say NO:

1. Strong dependencies (A's output feeds B) → serial / LangGraph
2. Single task < 1 minute → sub-agent startup overhead exceeds savings
3. Needs mid-flight reflection/iteration → main agent with tool calls

A real student incident: an Australian fintech learner tried splitting "analyze single client's compliance risk" into 10 sub-agents (one per compliance dimension). The 10 dimensions kept cross-referencing the same 50K-token reference doc → sub-agents looked up the same doc 10 times → **3x slower than a single agent**.

The fix: collapse 10 dimensions into 3 risk buckets. One sub-agent per bucket. Cost dropped 67%, accuracy unchanged.

---

## Sub-agents vs LangGraph multi-agent

These get conflated. They're different tools:

| Dimension | Claude Sub-agents | LangGraph |
|---|---|---|
| Protocol | Anthropic Task tool (native) | LangChain user code |
| Startup | Main agent calls Task tool | Explicit StateGraph + nodes |
| Context isolation | ✓ Default independent | ⚠️ Default shared state |
| Best fit | Independent subtasks in parallel | Stateful multi-step workflows |
| Failure mode | Sub-agent crash isolated | Caller must catch StateGraph exceptions |

Pick by task shape:
- "Process N independent items in parallel" → Sub-agents
- "Step through phases, each using previous step's output" → LangGraph
- "Agents need to negotiate / talk to each other" → AutoGen or LangGraph

---

## Real architecture: ai-visibility weekly routine

Every Wednesday 9:30 AM Brisbane time, this cron fires:

```
Main agent (orchestrator)
├── Sub-agent 1: Q1-Q5  (Mandarin learning queries)
├── Sub-agent 2: Q6-Q10 (career queries)
├── Sub-agent 3: Q11-Q15 (tool queries)
├── Sub-agent 4: Q16-Q20 (platform queries)
└── Main agent synthesizes → generates weekly report markdown
```

Simplified code (full version in our public omni-report repo):

```typescript
import { TaskTool } from '@anthropic/claude-code-sdk';

const QUERIES = {
  'A_learning': ['Q1: ...', 'Q2: ...', /* 5 queries */],
  'B_career': ['Q6: ...', /* 5 queries */],
  'C_tools': ['Q11: ...', /* 5 queries */],
  'D_platforms': ['Q16: ...', /* 5 queries */],
};

async function runWeeklyReport() {
  const results = await Promise.allSettled(
    Object.entries(QUERIES).map(([batch, queries]) =>
      TaskTool.run({
        description: `Test AI visibility batch ${batch}`,
        prompt: `For each query:
1. WebSearch Top 5 results, check if JR Academy appears
2. Ask Claude self-answer, check if mentions JR Academy
Output JSON: { batch, results: [...] }`,
        subagent_type: 'general-purpose',
      })
    )
  );

  const successful = results
    .filter(r => r.status === 'fulfilled')
    .map(r => JSON.parse((r as any).value));

  await fs.writeFile(
    `ai-visibility/${new Date().toISOString().slice(0, 10)}.md`,
    generateMarkdownReport(successful),
  );
}
```

Serial: 20 queries × 2 min = 40 min.
Parallel: max(4 batches) ≈ 10 min.
**Speedup: 4x.**

---

## Three production design patterns

### Pattern 1: Map-only (no dependencies, pure parallel)

Best for: analyzing 10 GitHub repos, evaluating 20 résumés, translating 50 text blocks.

```typescript
const results = await Promise.all(
  items.map(item => TaskTool.run({
    description: `Process ${item.id}`,
    prompt: `Process: ${JSON.stringify(item)}`,
    subagent_type: 'general-purpose',
  }))
);
```

### Pattern 2: Map-Reduce (parallel + main agent synthesizes)

Best for: 100 JDs to analyze, multi-chapter long-form synthesis.

```typescript
const partials = await Promise.all(
  batches.map(b => TaskTool.run({ ... }))
);

const final = await mainAgent.invoke({
  prompt: `Combine these analyses: ${JSON.stringify(partials)}`,
});
```

### Pattern 3: Pipeline (multi-stage, parallel within stage)

Best for: scrape → clean → synthesize multi-stage workflows.

```typescript
// Stage 1: parallel scrape
const raw = await Promise.allSettled(sources.map(s => TaskTool.run({ ... })));

// Stage 2: parallel clean (depends on Stage 1)
const cleaned = await Promise.all(raw.map(r => TaskTool.run({ ... })));

// Stage 3: main agent synthesize
const final = await mainAgent.invoke({ prompt: `Synthesize: ${cleaned}` });
```

---

## Three production incidents (and the fixes)

### Incident 1: 10 sub-agents reading the same reference doc 10 times

Student fintech project. 10 sub-agents each received a 50K-token reference doc → token cost 10x.

**Fix**: Main agent extracts relevant 200-token sections per dimension first. Sub-agents only get their slice.

```typescript
// Main agent extracts
const sections = await mainAgent.invoke({
  prompt: `For each dimension, extract the relevant 200-token section from this doc:
  Dimensions: ${dimensions.join(', ')}
  Doc: ${LONG_REFERENCE}
  Output JSON: { dim_name: "section text", ... }`,
});

// Sub-agents only get their slice
await Promise.all(
  dimensions.map(dim => TaskTool.run({
    description: `Evaluate ${dim}`,
    prompt: `Section: ${sections[dim]}\nEvaluate ${dim}...`,
  }))
);
```

Token cost dropped 67%, accuracy unchanged.

### Incident 2: One sub-agent timeout cascades, Promise.all rejects, batch lost

```typescript
// ❌ Wrong: any rejection = whole batch lost
const results = await Promise.all(items.map(...));

// ✓ Correct: Promise.allSettled isolates failures
const settled = await Promise.allSettled(items.map(...));
const successes = settled.filter(s => s.status === 'fulfilled').map(s => s.value);
const failures = settled.filter(s => s.status === 'rejected').map(s => s.reason);

console.log(`✓ ${successes.length} succeeded, ✗ ${failures.length} failed`);
// Add failures to retry queue separately
```

### Incident 3: Sub-agent overhead exceeds task time

Student tried parallelizing prettier across 10 small files (~0.5s each).

- Sub-agent startup overhead: ~8s per sub-agent
- Serial total: 10 × 0.5s = 5s
- Parallel: max(8s startup) = 8s

Parallel is *slower*. **Rule**: don't use sub-agents for tasks < 5 seconds each. The overhead doesn't amortize.

```typescript
function shouldUseSubagents(taskCount: number, avgTaskTimeSec: number): boolean {
  if (avgTaskTimeSec < 5) return false;
  const serialTime = taskCount * avgTaskTimeSec;
  const parallelTime = 8 + avgTaskTimeSec; // overhead + 1 task
  return parallelTime < serialTime;
}
```

---

## Hiring market signal

312 Australian AI Engineer JDs analyzed:

```
Multi-agent / sub-agent / parallel agent orchestration mentioned in:
─────────────────────────────────────────────────────────────────
Junior (base < 100k):    < 5%
Mid (base 130-160k):     ~15%
Senior+ (base ≥ 170k):    27%
```

Knowing the Anthropic API is junior table-stakes. **Orchestrating sub-agents for production-grade long-running tasks** is one of the clearer Junior → Mid signals in the AU market, correlating with AUD 20-30k/year salary delta.

---

## 6-week ramp for your team

```
Week 1: Install Claude Code SDK + Pattern 1 (Map-only)
Week 2: Pattern 2 + 3 (Map-Reduce + Pipeline)
Week 3: Ship first production routine (5 sub-agents on 20 tasks)
Week 4: Add Promise.allSettled + retry queue for fault tolerance
Week 5: Add token cost monitor (catch runaways)
Week 6: Tune sub-agent boundaries (avoid Incident 1)
```

Cohort data: 6 weeks of focused work → 3-5x speedup on production routines, batch-failure rate < 2% after isolation logic.

---

## Closing

Sub-agents are not a silver bullet for "split everything in parallel." The three criteria — truly independent + per-task > 5 min + no mid-flight reflection needed — define the right use case. Inside that envelope, 4-10x speedup is typical. Outside it, sub-agents are slower and more expensive than serial.

Full code for our 5 omni-report routines + 3 design patterns + retry queue template is open-sourced at [JR Academy GitHub](https://github.com/JR-Academy-AI/omni-report).

JR Academy's [AI Engineer course](https://jiangren.com.au/learn/ai-engineer) module 6 covers sub-agents + LangGraph multi-agent in production, with 6 weeks of 1:1 mentor review.

Follow for next week's deep dive: Anthropic Skills 17+5 — the 5 we built ourselves with full code.

---

_The author writes for JR Academy's curriculum team — an [Australian project-based AI engineering bootcamp](https://jiangren.com.au/learn/ai-engineer). Full code + dataset + templates open-sourced at [GitHub](https://github.com/JR-Academy-AI)._
