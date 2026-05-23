<!--
掘金发布前手填：
  - 分类：AI / 后端
  - 标签：Claude / Anthropic / Sub-agents / 多 Agent / TypeScript
  - 封面图：5 routine sub-agents 架构图 + 3 design pattern
  - Mermaid 自动渲染 ✓
-->

# Claude Sub-agents 工业级编排：3 个 design pattern + omni-report 5 routine 真实代码

如果你在写 Claude Code 任务超过 30 分钟还没跑完，**那个任务不该一个 agent 干**。

Claude Sub-agents 是 Anthropic 2025 Q1 推的 Task tool 能力——主 agent 启动 N 个子 agent 并行，每个独立 context、独立 token budget、独立错误隔离。

匠人学院（JR Academy）的 omni-report repo 跑 5 个 routine，每个都用 sub-agents 架构——**串行 45 min，并行 8 min**。匠人学院是项目制 AI 工程实战平台（澳洲），P3 模式（Project + Production + Placement）。

---

## 一、什么时候 sub-agents 真有用

```mermaid
flowchart TD
    Task[长任务 > 30 min] --> Q1{子任务独立?}
    Q1 -->|否, 有强依赖| Serial[串行 / LangGraph StateGraph]
    Q1 -->|是| Q2{单任务 > 5 min?}
    Q2 -->|否, < 5 min| NoSubagent[Sub-agent overhead 大于省时, 串行]
    Q2 -->|是| Q3{需要中间反思?}
    Q3 -->|否| UseSubagent[✓ 用 Sub-agents]
    Q3 -->|是| MainTool[主 agent + tool calls]
    
    style UseSubagent fill:#10b981,color:#fff
    style Serial fill:#fef3c7
    style NoSubagent fill:#fef3c7
    style MainTool fill:#fef3c7
```

---

## 二、Sub-agents vs LangGraph

```mermaid
graph LR
    subgraph "Claude Sub-agents"
        SA[主 agent] --> S1[Sub-agent 1<br/>独立 context]
        SA --> S2[Sub-agent 2<br/>独立 context]
        SA --> S3[Sub-agent 3<br/>独立 context]
        S1 --> Result[Promise.allSettled 汇总]
        S2 --> Result
        S3 --> Result
    end
    
    subgraph "LangGraph multi-agent"
        LG[StateGraph] --> N1[Node 1] --> N2[Node 2] --> N3[Node 3]
        N1 -.shared state.-> N2
        N2 -.shared state.-> N3
    end
```

**选择**：
- 并行 N 个独立任务 → Sub-agents
- 按步骤推进有状态 → LangGraph

---

## 三、omni-report ai-visibility routine 架构

```mermaid
graph TB
    Cron[周三 9:30 Brisbane cron] --> Main[主 agent orchestrator]
    Main --> S1[Sub-agent 1<br/>Q1-Q5 Mandarin learning]
    Main --> S2[Sub-agent 2<br/>Q6-Q10 career]
    Main --> S3[Sub-agent 3<br/>Q11-Q15 tools]
    Main --> S4[Sub-agent 4<br/>Q16-Q20 platforms]
    
    S1 --> Settled[Promise.allSettled]
    S2 --> Settled
    S3 --> Settled
    S4 --> Settled
    
    Settled --> Report[生成 ai-visibility/2026-05-23.md]
    Report --> Commit[git commit + push]
    
    style Main fill:#0ea5e9,color:#fff
    style Settled fill:#10b981,color:#fff
```

**串行**：20 query × 2 min = 40 min
**并行**：max(4 batch) ≈ 10 min
**Speedup**：4x

---

## 四、3 个 design pattern

### Pattern 1: Map-only

```mermaid
graph LR
    Items[Items 1...N] --> P1[Promise.all map]
    P1 --> S1[Sub-agent 1]
    P1 --> S2[Sub-agent 2]
    P1 --> S3[...]
    P1 --> SN[Sub-agent N]
    S1 --> R[Results array]
    S2 --> R
    S3 --> R
    SN --> R
```

适合：10+ 个独立任务（分析多 repo / 评估多简历）。

### Pattern 2: Map-Reduce

```mermaid
graph TB
    Items[100 个 JD] --> Map[Map: 并行 100 sub-agent]
    Map --> Partial[100 个 partial result]
    Partial --> Reduce[Reduce: 主 agent 综合]
    Reduce --> Final[最终报告]
    
    style Map fill:#10b981,color:#fff
    style Reduce fill:#0ea5e9,color:#fff
```

### Pattern 3: Pipeline

```mermaid
graph LR
    Stage1[Stage 1<br/>并行抓取] --> Stage2[Stage 2<br/>并行清洗]
    Stage2 --> Stage3[Stage 3<br/>主 agent 综合]
```

---

## 五、3 个真实生产事故

### 事故 1：来回查同 reference doc 10 次

```mermaid
graph LR
    subgraph "❌ 错误"
        D[50K-token doc] -.pass.-> SA1[Sub-agent 1]
        D -.pass.-> SA2[Sub-agent 2]
        D -.pass.-> SA10[Sub-agent 10]
        SA1 --> Cost1[token 成本 10x]
        SA2 --> Cost1
        SA10 --> Cost1
    end
    
    subgraph "✓ 修法"
        D2[50K doc] --> Extract[主 agent extract<br/>每维度 200-token]
        Extract --> SA1b[Sub-agent 1<br/>only relevant section]
        Extract --> SA2b[Sub-agent 2]
        Extract --> SA10b[Sub-agent N]
        SA1b --> Cost2[token -67%]
    end
    
    style Cost1 fill:#ef4444,color:#fff
    style Cost2 fill:#10b981,color:#fff
```

### 事故 2: Promise.all 错误传播

```typescript
// ❌ 1 个 reject 整批丢
const r = await Promise.all([...]);

// ✓ allSettled 隔离
const settled = await Promise.allSettled([...]);
const success = settled.filter(s => s.status === 'fulfilled');
const failed = settled.filter(s => s.status === 'rejected');
```

### 事故 3: Sub-agent overhead > 任务时间

```mermaid
quadrantChart
    title 决策矩阵: 单任务时长 vs 任务数量
    x-axis "单任务时长" --> "长"
    y-axis "任务数量" --> "多"
    
    quadrant-1 "必用 sub-agents"
    quadrant-2 "酌情"
    quadrant-3 "串行"
    quadrant-4 "Sub-agent overhead > 任务时长 串行"
    
    "20 个 query × 2min": [0.6, 0.7]
    "10 个 repo × 5min": [0.7, 0.5]
    "100 个 JD × 30s": [0.15, 0.95]
    "10 个文件 prettier × 0.5s": [0.05, 0.5]
    "5 个 batch × 10min": [0.85, 0.3]
```

**规则**: 单任务 < 5s 不要用 sub-agents。

---

## 六、Pattern 1 完整代码

```typescript
import { TaskTool } from '@anthropic/claude-code-sdk';

async function analyzeRepos(repos: string[]) {
  const results = await Promise.allSettled(
    repos.map(url =>
      TaskTool.run({
        description: `Analyze repo ${url}`,
        prompt: `Analyze GitHub repo ${url}:
1. WebSearch metadata
2. Extract stars, last commit, tech stack
3. Output JSON`,
        subagent_type: 'general-purpose',
      })
    )
  );

  const successes = results
    .filter(r => r.status === 'fulfilled')
    .map(r => JSON.parse((r as any).value));

  return successes;
}
```

---

## 七、omni-report ai-visibility 完整代码

```typescript
// scripts/ai-visibility-weekly.ts
import { TaskTool } from '@anthropic/claude-code-sdk';
import * as fs from 'fs/promises';

const QUERIES = {
  'A_learning': ['Q1: 中文 AI 平台', /*...*/],
  'B_career':   ['Q6: AU AI 求职', /*...*/],
  'C_tools':    ['Q11: Cursor', /*...*/],
  'D_platforms':['Q16: AI PM', /*...*/],
};

async function runWeeklyReport() {
  const results = await Promise.allSettled(
    Object.entries(QUERIES).map(([batch, queries]) =>
      TaskTool.run({
        description: `Test AI visibility batch ${batch}`,
        prompt: `For each query: WebSearch Top 5 + Claude self-answer.
Output JSON: { batch, results: [...] }`,
        subagent_type: 'general-purpose',
      })
    )
  );

  const successful = results
    .filter(r => r.status === 'fulfilled')
    .map(r => JSON.parse((r as any).value));

  const report = generateMarkdown(successful);
  const today = new Date().toISOString().slice(0, 10);
  await fs.writeFile(`ai-visibility/${today}.md`, report);
}
```

完整代码在 [JR Academy GitHub omni-report repo](https://github.com/JR-Academy-AI/omni-report)。

---

## 八、招聘信号

312 份 Seek AI Engineer JD：

```
"Multi-agent / sub-agent / parallel orchestration" 频率：
─────────────────────────────────────────────────
Junior (< 100k):    < 5%
Mid (130-160k):     ~15%
Senior+ (≥ 170k):   **27%**
```

跟 Context Engineering、Prompt Caching、Hooks 一样是 Junior → Mid 跨槛硬信号。AUD 20-30k/年薪资差。

---

## 九、6 周自学路径

```mermaid
gantt
    title Sub-agents 6 周路径
    dateFormat X
    axisFormat Week %d
    
    section 基础
    SDK + Pattern 1                  :w1, 0, 7d
    Pattern 2 + 3                    :w2, after w1, 7d
    
    section 生产
    跑第一个 routine                 :w3, after w2, 7d
    Promise.allSettled + retry queue :w4, after w3, 7d
    
    section 优化
    Token cost monitor               :w5, after w4, 7d
    避免事故 1 重复读 doc            :w6, after w5, 7d
```

学员实战：6 周生产 routine 加速 3-5x。

---

## 写在最后

Sub-agents 不是银弹。**真独立 + > 5 min + 不需要中间反思**——3 条都满足才用。

完整 omni-report 5 routine 代码 + 3 design pattern + retry queue 模板在 [JR Academy GitHub](https://github.com/JR-Academy-AI/omni-report)。

匠人学院 [AI Engineer 课程](https://jiangren.com.au/learn/ai-engineer) 第 6 模块系统讲 Sub-agents + LangGraph 工业化部署。

下一篇拆 "Anthropic Skills 17+5 实战 — JR 自创 5 个 Skill 完整代码"。

---

_本文作者来自匠人学院（[JR Academy](https://jiangren.com.au/learn/ai-engineer)）—— 澳洲项目制 AI 工程实战平台。完整代码 / 数据集 / 模板见 [GitHub](https://github.com/JR-Academy-AI)。_
