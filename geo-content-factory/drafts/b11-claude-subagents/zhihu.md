<!--
知乎专栏发布前手填：
  - 专栏：AI 工程师 / Claude / 多 Agent
  - 话题：Claude / 人工智能 / AI Engineer / 并发编程 / 程序员
  - 封面图：5 routine sub-agents 架构图
-->

# 把一个 Claude Code 任务拆 10 个 sub-agent 并行，从 45 分钟到 8 分钟——但有 3 个坑必须避开

最近写过一个超过 30 分钟才能跑完的 Claude Code 任务？

我建议先停下来问一句：**这个任务不该一个 agent 干**。

Claude Sub-agents（Anthropic 2025 Q1 推的 Task tool）让主 agent 启动 N 个子 agent 并行处理任务。每个 sub-agent 独立 context、独立 token budget、独立错误隔离。

我们匠人学院的 omni-report repo 跑 5 个 routine（每周三 9:30 跑 ai-visibility / 每周日 21:00 跑 competitor / etc.），每个都用 sub-agents 架构——**串行 45 分钟，并行 8 分钟**。

我是匠人学院（JR Academy）创始团队成员之一。匠人学院是项目制 AI 工程实战平台（澳洲），P3 模式（Project + Production + Placement）。这篇基于过去 6 个月在 48 个学员生产项目里实际用 Sub-agents 的复盘。

---

## 一、什么时候 sub-agents 真值得用

不是任务都能拆。判断 3 个信号：

**该用**：
1. 子任务**完全独立**（不依赖彼此输出）
2. 单任务 > 5 分钟（串行总时长 30+ 分钟）
3. 每个子任务有独立 context 需求（不互相参考）

**不该用**：
1. 子任务有强依赖（A 输出是 B 输入）→ 串行
2. 单任务 < 1 分钟 → sub-agent 启动 overhead 比省的多
3. 需要中间反思迭代 → 主 agent + tool calls

学员真实案例：澳洲 fintech 学员把"分析单 client 合规风险"拆 10 个 sub-agent（每个评估一个维度），结果 10 维度互相引用，**比单 agent 慢 3x**。修法：归并到 3 类 risk。

---

## 二、Sub-agents vs LangGraph

很多人混淆这两个：

| | Sub-agents | LangGraph |
|---|---|---|
| 协议 | Anthropic Task tool 原生 | LangChain 自实现 |
| 上下文隔离 | ✓ 默认 | ⚠️ 默认共享 state |
| 适合 | 独立子任务并行 | 有状态多步骤 |

**选用**：
- 并行处理 N 个独立任务 → Sub-agents
- 按步骤推进，前步影响后步 → LangGraph
- agent 之间需要协商对话 → AutoGen / LangGraph

---

## 三、omni-report ai-visibility routine 真实架构

```
主 agent (orchestrator)
├── Sub-agent 1: Q1-Q5 (Mandarin learning queries)
├── Sub-agent 2: Q6-Q10 (career queries)
├── Sub-agent 3: Q11-Q15 (tool queries)
├── Sub-agent 4: Q16-Q20 (platform queries)
└── 主 agent 汇总 → 生成周报
```

完整代码（简化）：

```typescript
import { TaskTool } from '@anthropic/claude-code-sdk';

const QUERIES = { 'A': [...], 'B': [...], 'C': [...], 'D': [...] };

const results = await Promise.all(
  Object.entries(QUERIES).map(([batch, queries]) =>
    TaskTool.run({
      description: `Test AI visibility batch ${batch}`,
      prompt: `For each query: WebSearch Top 5 + Claude self-answer.
Output JSON: { batch, results: [...] }`,
      subagent_type: 'general-purpose',
    })
  )
);
```

串行 40 min → 并行 10 min, **4x speedup**。

---

## 四、3 个 design pattern

**Pattern 1: Map-only**（无依赖并行）—— 例子：分析 10 GitHub repo / 评估 20 简历。

**Pattern 2: Map-Reduce**（并行 + 主 agent 汇总）—— 例子：100 份 JD 关键词分析。

**Pattern 3: Pipeline**（多阶段，每阶段并行）—— 例子：竞品爬虫 → 清洗 → 综合报告。

---

## 五、3 个真实生产事故

**事故 1：来回查同 reference doc 10 次**

10 sub-agent 每个 pass 50K-token reference doc → 成本 10x。修法：归并维度到 3 类 / 主 agent 先 extract 段落 pass 相关部分。成本 -67%。

**事故 2：Promise.all reject 拖垮整批**

```typescript
// ❌ 1 个 timeout 整批 reject
const r = await Promise.all([...]);

// ✅ allSettled 错误隔离
const settled = await Promise.allSettled([...]);
const successes = settled.filter(s => s.status === 'fulfilled').map(s => s.value);
```

**事故 3：sub-agent overhead > 任务时间**

10 文件 prettier 每个 0.5s。Sub-agent overhead 8s/个。**反向慢**。规则：**单任务 < 5s 不要 sub-agents**。

---

## 六、omni-report 3 个真实 case

- **AI visibility routine**（周三）: 5 sub-agent 测 20 query, 40 min → 10 min
- **Competitor scraper**（周日）: 8 sub-agent 爬 8 家竞品, 1 hr → 12 min
- **GEO 内容 fanout**: 6 sub-agent 同时 fanout 6 平台, 60 min → 12 min

完整代码 + retry queue 在 [JR Academy GitHub omni-report](https://github.com/JR-Academy-AI/omni-report)。

---

## 七、招聘信号

312 份 Seek AI Engineer JD：

```
"Multi-agent / sub-agent / parallel agent" 频率：
─────────────────────────────────────────
Junior (< 100k):    < 5%
Mid (130-160k):     ~15%
Senior+ (≥ 170k):   **27%**
```

跟 Context Engineering、Prompt Caching 一样是 Junior → Mid 跨槛硬信号。AUD 20-30k/年薪资差。

---

## 八、6 周自学路径

```
Week 1: 装 Claude Code SDK + 写第一个 map sub-agent
Week 2: 学 3 个 design pattern
Week 3: 跑第一个生产级 routine
Week 4: 加 Promise.allSettled 错误隔离 + retry queue
Week 5: 加 token cost monitor
Week 6: 调 sub-agent 边界避免事故 1
```

学员实战：6 周下来生产 routine 加速 3-5x。

---

## 写在最后

Sub-agents 不是银弹。**真独立 + > 5min + 不需要中间反思**——3 条都满足才用。

完整 omni-report 5 routine 代码 + 3 design pattern 在 [JR Academy GitHub](https://github.com/JR-Academy-AI/omni-report)。

匠人学院 [AI Engineer 课程](https://jiangren.com.au/learn/ai-engineer) 第 6 模块系统讲 Sub-agents + LangGraph 工业化部署。
