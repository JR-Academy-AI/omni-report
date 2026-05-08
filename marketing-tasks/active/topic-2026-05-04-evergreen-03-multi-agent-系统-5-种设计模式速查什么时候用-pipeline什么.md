---
id: 0
title: 「Multi-Agent 系统 5 种设计模式速查：什么时候用 pipeline，什么时候用 supervisor，什么时候用 mesh」
category: content-topic
module: ad-hoc-task
source: routine-marketing-topics
sourceMeta:
  reportPath: marketing-topics/2026-05-04.md
  reportSection: 长尾常青话题
  reportItemHash: 46d3bb5775c3
assignee: 2838684082@qq.com
reviewer: null
status: draft
priority: p2
platforms: []
wordCount: null
estimatedHours: null
actualHours: null
dueDate: null
tags:
  - imported-from-routine
  - marketing-topics
  - evergreen
createdBy: TBD-system
createdAt: 2026-05-05T02:08:43.465Z
updatedAt: 2026-05-05T02:08:43.465Z
derivedFrom: null
---
## 描述

**「Multi-Agent 系统 5 种设计模式速查：什么时候用 pipeline，什么时候用 supervisor，什么时候用 mesh」**

— 适合形式：小红书 4 图信息图（每种模式一张架构图 + 适用场景 + 代价）+ B 站 20 分钟视频（LangGraph 代码演示每种模式的最小实现）— 适合时机：任何时候都有流量；多 Agent 本周爆热后搜索量上涨，但这类内容 6 个月内不会过期；做成系列（设计模式 / 调试方法 / 成本优化）可以持续出到年底

## Checklist

- [ ] 确认内容形式（视频 / 长文 / 图文）
- [ ] 大纲 + 素材调研
- [ ] 撰写 / 制作
- [ ] 多平台发布（B 站 / 知乎 / 小红书）
- [ ] 30 天后回看流量数据 + 二次推广

## 草稿

**形式定位**：本稿同时供小红书 4 图信息图（每图 1 模式 + 1 reject 模式）和 B 站
20 分钟视频脚本切分。LangGraph 代码示例放视频字幕带 / 小红书第 4 图右下二维码。

---

# Multi-Agent 系统 5 种设计模式速查

写多 Agent 的人 80% 一上来就用 supervisor，因为 LangGraph 文档第一个例子就是它。
但生产系统跑下来你会发现：90% 的真实 task 用 pipeline 就够了，剩下 10% 才需要
supervisor / hierarchical / mesh 这些更重的拓扑。这篇按"什么时候用 / 什么时候
不要用 / 真实代价"三档把 5 个模式排一遍。

每个模式给一个 LangGraph 最小实现 + 一个我们实际跑过的 task，外加一句话"踩坑
摘要"。

## 1. Pipeline（顺序流水线）

**结构**：A → B → C → D，单向，每个 agent 处理上一个的输出。

**什么时候用**：
- 任务可以拆成清晰的几步，且每步的产出独立可验证
- 不需要 agent 互相协商
- 例子：用户 query → 改写 → 检索 → 排序 → 生成答案

**什么时候不要用**：
- 步骤之间有循环依赖（比如生成出来不满意要回去重新检索）
- 中间步骤失败需要 fallback（pipeline 挂了就整条挂）

**真实代价**：每个 agent 串行 = 总延迟 = sum(每个 agent 延迟)。4 个 agent 各
2 秒 = 8 秒响应时间。生产 RAG 用户耐心阈值是 6 秒，所以 4 步以上的 pipeline
就要考虑加并行段或缓存。

**LangGraph 5 行代码**：

```python
graph = StateGraph(State)
graph.add_node("rewrite", rewrite_agent)
graph.add_node("retrieve", retrieve_agent)
graph.add_node("rerank", rerank_agent)
graph.add_node("answer", answer_agent)
graph.add_edge("rewrite", "retrieve")
graph.add_edge("retrieve", "rerank")
graph.add_edge("rerank", "answer")
graph.set_entry_point("rewrite")
graph.set_finish_point("answer")
```

**踩坑摘要**：每一步的 State 字段要明确写在 TypedDict 里。我们见过最离谱的
case 是上一步往 `state["misc"]` 里塞东西，下一步从 `state["context"]` 里
拿，结果一个空字段一直传到最后。

---

## 2. Supervisor（编排者-工人）

**结构**：一个 supervisor agent 看用户 query，决定路由到哪个 worker agent。
worker 完成后回到 supervisor，supervisor 决定继续路由 / 还是结束。

**什么时候用**：
- 用户意图不清楚，需要 agent 决策路由（比如客服 bot：是技术问题还是退款？）
- worker 之间能力差异大，没法统一塞进 pipeline

**什么时候不要用**：
- 任务流是固定的（你已经知道走哪几步）→ 用 pipeline 更便宜
- supervisor 自己没法判断要不要继续（这种情况说明你需要的是 mesh 或者
  hierarchical）

**真实代价**：supervisor 每次决策都是一次 LLM 调用。一个 5 轮对话最少 10 次
LLM 调用（5 次 supervisor + 5 次 worker），是 pipeline 的 2.5 倍 token
成本。

**LangGraph 实现要点**：用 `add_conditional_edges` 让 supervisor 根据返回的
`next` 字段路由：

```python
def supervisor(state):
    decision = llm.invoke(state["messages"], tools=router_tools)
    return {"next": decision.tool_calls[0]["name"]}

graph.add_conditional_edges("supervisor", lambda s: s["next"], {
    "billing": "billing_agent",
    "tech": "tech_agent",
    "FINISH": END,
})
```

**踩坑摘要**：supervisor 一定要给一个 FINISH 出口，不然能死循环跑到 token
预算耗尽。我们生产配过 max_iterations=10 硬熔断。

---

## 3. Hierarchical（层级树）

**结构**：supervisor 下面挂多个 sub-supervisor，每个 sub-supervisor 又管几个
worker。多层路由。

**什么时候用**：
- 域非常宽，单个 supervisor 装不下所有路由逻辑（>10 个 worker 就到极限）
- 有清晰的领域边界（比如 worker 分"销售/技术/法务"，每个域内再分子任务）

**什么时候不要用**：
- worker 数量 ≤ 10 → 直接 supervisor 就够，多一层增加调试地狱
- 各域之间有大量交叉依赖（hierarchical 假设域是相对独立的，否则你就是在
  做 mesh 但用了错误结构）

**真实代价**：每个 query 至少 3 次路由决策（top supervisor → sub supervisor
→ worker），调试时栈要看 3 层。LangSmith trace 容易看花眼。

**LangGraph 实现**：每一层都是一个独立的 `StateGraph`，sub graph 作为父
graph 的 node 嵌入：

```python
billing_subgraph = StateGraph(...)  # 内部有 refund / dispute / 子 worker
top_graph.add_node("billing", billing_subgraph.compile())
```

**踩坑摘要**：sub graph 的 state schema 要兼容父 graph 的 schema，不然
state 传过来是 None。我们建议父子用同一份 TypedDict。

---

## 4. Mesh（点对点协商）

**结构**：N 个 agent 互相可以发消息，没有中心化的 supervisor。每个 agent 自
判断要不要响应、要不要传给谁。

**什么时候用**：
- 任务本质就是几个对等专家的协商（写论文：作者 / 审稿人 / 编辑互评）
- 单点决策不可行（没有人有全局信息）

**什么时候不要用**：
- 99% 的生产系统不要用 mesh — token 成本失控、收敛性没保证、调试不可能
- 如果你想用 mesh 做"大家投票"，那应该用 ensemble（见 §5），更便宜

**真实代价**：消息传递呈 O(N²) 增长。3 个 agent 互发 3 轮就是 27 次 LLM 调用。
我们见过一个 mesh demo 跑出 $80 一次 query。

**LangGraph 实现**：用 `Command` 让 agent 自主发消息到任意其他节点：

```python
def reviewer(state) -> Command:
    review = llm.invoke(state["draft"])
    if review.needs_revision:
        return Command(goto="author", update={"feedback": review})
    return Command(goto="editor")
```

**踩坑摘要**：mesh 必须配硬熔断（max_iterations + max_token_budget），
不然 agent 之间能死循环对话到天荒地老。我们建议生产环境直接禁用 mesh，
真要用就改成 hierarchical + 局部 mesh。

---

## 5. Ensemble（并行 + 投票）

**结构**：N 个 agent 同时跑同一个任务，最后一个 aggregator 综合结果（投票 /
weighted average / picks best）。

**什么时候用**：
- 任务有客观正确答案（数学题 / 代码题）→ 多模型并跑投票准确率更高
- 任务模糊但需要多视角（写文章 → 5 个 agent 写 5 个开头，editor 选 1 个）

**什么时候不要用**：
- 任务是流程类（pipeline 那种）→ 并行没意义，因为后面步骤要等所有前面跑完
- 钱不富裕 — N 倍 token 成本

**真实代价**：N 倍 LLM 调用（N 个 worker + 1 个 aggregator）。但延迟和单个
agent 一样（并行）。Trade-off 是钱换准确率。

**LangGraph 实现**：用 `Send` API 把同一份输入广播给多个节点：

```python
def fan_out(state):
    return [Send("worker", {"input": state["query"], "id": i}) for i in range(5)]

def aggregator(states):  # 接收所有 worker 的返回
    return {"answer": majority_vote([s["output"] for s in states])}
```

**踩坑摘要**：worker 的 state 隔离要做对。如果 5 个 worker 共享同一个
state field 写入，最后到 aggregator 就只剩一个值（最后一个 worker 覆盖
前面的）。要用 reducer 把 list append 起来。

---

## 怎么选：决策树

```
任务步骤固定吗？
├─ 是 → Pipeline ✅
└─ 否 ↓
   每次只走 1 条分支吗？
   ├─ 是（路由型）→ Supervisor ✅
   │   worker > 10 个？
   │   ├─ 是 → Hierarchical
   │   └─ 否 → Supervisor 就够
   │
   ├─ 否（要并行 + 综合）↓
       答案有客观正确性？
       ├─ 是 → Ensemble ✅
       └─ 否 → 你大概率不该做多 Agent，先想想能不能用 single LLM + 长 context
```

**90% 的生产系统答案是 Pipeline**。在 JR Academy AI Engineer Bootcamp 我们
看到的真实分布是：pipeline 70% / supervisor 20% / hierarchical 5% /
ensemble 4% / mesh 1%。

---

## 适配三平台投放

**小红书 4 图信息图**（取 §1-§4 各一图，每图 ≤ 150 字 + 1 张 LangGraph 架构
草图）：
- 图 1：Pipeline — "90% 生产系统的答案"
- 图 2：Supervisor — "意图路由 = 2.5x 成本"
- 图 3：Hierarchical — "worker > 10 才用得上"
- 图 4：Mesh + Ensemble 对比 — "想用 mesh 的 99% 应该用 ensemble"

**B 站 20 分钟视频结构**（每段约 4 分钟）：
- 0:00-1:30 开场：80% 的人一上来就用 supervisor 是错的
- 1:30-5:30 §1 Pipeline + 现场跑 LangGraph 代码
- 5:30-9:30 §2 Supervisor + 跑代码
- 9:30-13:30 §3-4 Hierarchical + Mesh
- 13:30-17:30 §5 Ensemble + 决策树
- 17:30-20:00 90/20/5/4/1 真实生产分布 + Bootcamp 课程引流

**知乎专栏长文**（直接复用本稿，加 1 张决策树思维导图作为封面）。

---

## CTA

匠人学院 AI Engineer Bootcamp 第 4 周《Multi-Agent 系统》模块每个模式都要在
LangGraph + Kimi K2.6 上跑通最小实现 + 1 个真实业务 case。课程完整大纲：
[jiangren.com.au/learn/ai-engineer/hub](https://jiangren.com.au/learn/ai-engineer/hub)



## 发布记录

（暂无）

## Comments

- @system 2026-05-05T02:08:43.465Z
  > 由 `omni-report/scripts/marketing-topics-to-tasks.ts` 自动从内容选题包「长尾常青话题 #3」生成。
