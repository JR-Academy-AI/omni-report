<!--
掘金发布前手填：
  - 分类：AI / 产品 / 教程
  - 标签：AI 产品经理 / LLM / 产品设计 / 教程 / 求职
  - 封面图：AI PM 工具链架构图
  - Mermaid 自动渲染 ✓
-->

# AI PM 必备工具链架构 + PRD 模板（基于 200 条 JD 反向推导）

如果你是程序员考虑转 AI PM、或者是 AI PM 但 PRD 总被工程师怼"这怎么验证"——这篇是给你的架构图 + 模板。

数据基础：200 条悉尼 / 墨尔本 / 北上深 AI PM 招聘 JD（2025-11 至 2026-05）关键词反向推导 + 匠人学院（JR Academy）过去 12 个月带的 AI PM 学员真实项目复盘。匠人学院是项目制 AI 工程实战平台（澳洲），P3 模式（Project + Production + Placement）。

---

## 一、AI PM 工具链架构图

```mermaid
flowchart TB
    PM[AI PM] --> PRD[PRD<br/>包含 prompt + eval + 验收标准]
    PRD --> Build[工程实现]
    Build --> Trace[LangSmith / Langfuse<br/>trace + cost dashboard]
    Trace --> PM
    
    PM --> EvalSet[eval set<br/>30+ test case]
    EvalSet --> RunEval[跑 eval]
    RunEval --> Decision{准确率 ≥ X%<br/>p95 < Y<br/>cost < Z?}
    Decision -->|是| Release[上线]
    Decision -->|否| Iterate[Prompt iteration]
    Iterate --> RunEval
    
    Release --> Monitor[Production 监控]
    Monitor --> Hallucination[hallucination 率]
    Monitor --> CostDaily[日成本]
    Monitor --> LatencyP95[p95 延迟]
    
    style PM fill:#0ea5e9,color:#fff
    style EvalSet fill:#10b981,color:#fff
    style Decision fill:#f59e0b,color:#fff
    style Monitor fill:#8b5cf6,color:#fff
```

**关键点**：AI PM 比传统 PM 多了 3 个工具——eval set / cost dashboard / trace 阅读。这 3 个工具在 200 条 JD 里出现频率分别 71% / 43% / 38%，是 AI PM 跟传统 PM 区分的核心。

---

## 二、200 条 JD 关键词频率（柱状图）

```
真实做过 AI 产品 0 到 1                   78% ████████████████████████████████
能写 PRD + 评估 LLM 输出                  71% █████████████████████████████
理解 RAG / Agent 工程边界                 66% ███████████████████████████
跑过 prompt evaluation / eval set         58% ███████████████████████
跟工程师 review LLM API 代码              47% ███████████████████
分析 LLM 延迟 / 成本数据                  43% █████████████████
推动 production prompt iteration          42% █████████████████
读懂 LangSmith / Langfuse trace           38% ███████████████
```

注意**没有一条**是"懂 ChatGPT 用法"——这件事在 Nice to Have 段频率 < 10%。

但国内 8 家 AI PM 课程目录 70% 内容在教"用 ChatGPT / Claude / Coze 做 X 业务输出"。**这两件事完全不在一个赛道**。

---

## 三、AI PM 的 PRD 模板（含 prompt + eval + 验收标准）

传统 PM PRD vs AI PM PRD 对比：

```mermaid
graph LR
    subgraph 传统 PM PRD
        T1[1. 背景]
        T2[2. 用户故事]
        T3[3. 功能规格]
        T4[4. UI 设计稿]
        T5[5. 验收标准: QA pass]
    end
    
    subgraph AI PM PRD
        A1[1. 背景]
        A2[2. 用户故事]
        A3[3. 功能规格]
        A4[4. UI 设计稿]
        A5[5. **System Prompt 设计**]
        A6[6. **User Input 边界 + 防护**]
        A7[7. **Output Schema + 验证**]
        A8[8. **Eval set: 30+ test case**]
        A9[9. **验收标准: 准确率 + p95 + cost**]
        A10[10. **Rollout plan + Rollback**]
        A11[11. **Monitor 指标**]
    end
    
    style A5 fill:#10b981,color:#fff
    style A8 fill:#10b981,color:#fff
    style A9 fill:#10b981,color:#fff
    style A11 fill:#10b981,color:#fff
```

AI PM PRD 多出来的 4 项（绿色）是国内 70% AI PM 课程不教的——但是 200 条 JD 里 78% 的公司明确要求。

完整 PRD 模板（Markdown）示例：

````markdown
# PRD: 客户支持工单智能分类

## 5. System Prompt 设计

```
你是客户支持工单分类助手。把用户消息分类到:
- refund: 退款请求
- complaint: 投诉
- billing: 账单问题
- product_inquiry: 产品咨询
- other: 其他

同时提取:
- product names (mentioned products)
- order_id (订单号)

输出 JSON 格式，不要任何额外文字。
```

## 6. User Input 边界

- 长度上限: 2000 字符（超出截断 + 提示 PM）
- 敏感词检测: prompt injection 关键词（"ignore previous instructions" 等）
- PII 处理: 不入 log（按公司隐私政策）

## 7. Output Schema

```python
class Result(BaseModel):
    intent: Literal["refund", "complaint", "billing", "product_inquiry", "other"]
    products: list[str] = []
    order_id: str | None = None
```

Fallback: invalid JSON → retry 1 次 → 仍失败则 intent="other"

## 8. Eval Set

至少 30 个 test case，覆盖:
- 5 个 refund 典型场景（含模糊表达）
- 5 个 complaint 场景（含情绪化表达）
- 5 个 billing 场景
- 5 个 product_inquiry 场景
- 5 个 other 兜底
- 5 个 prompt injection 攻击场景（必须 refuse）

## 9. 验收标准

- 准确率 ≥ 85%（在 eval set 上）
- p95 延迟 < 2 秒
- 单次调用成本 < $0.001
- 月度成本预算 < AUD 500（100 万次调用）

## 10. Rollout

- Phase 1 (Week 1): 10% 流量，对比人工分类
- Phase 2 (Week 2): 50% 流量，监控差异
- Phase 3 (Week 3+): 100% 流量

## 11. Monitor 指标

- LangSmith dashboard:
  - 日均调用数
  - 准确率（基于 1% 人工 review 样本）
  - p95 / p99 延迟
  - 日成本
- 业务指标:
  - 客户支持平均响应时间
  - 1 个 FTE 节省（业务侧 ROI）
````

---

## 四、Cost-Benefit Analysis 模板

```mermaid
flowchart TD
    Start[新 prompt 版本] --> Run[跑 eval set]
    Run --> Metrics[采集:<br/>accuracy / latency / cost]
    Metrics --> Compare{vs 当前版本}
    Compare -->|质量提升| ROI[业务 ROI 计算]
    Compare -->|质量下降| Reject[拒绝]
    ROI --> Calc{月成本增加<br/>vs<br/>业务收益}
    Calc -->|收益 > 成本| Deploy[上线]
    Calc -->|收益 < 成本| Hold[保留当前]
    
    style Deploy fill:#10b981,color:#fff
    style Reject fill:#ef4444,color:#fff
    style Hold fill:#f59e0b,color:#fff
```

具体例子：

```
v1 prompt:
  accuracy: 72%
  avg token in/out: 850 / 220
  cost/call: $0.0008
  
v2 prompt:
  accuracy: 84%  (+12pp)
  avg token in/out: 1100 / 180
  cost/call: $0.0011  (+37%)
  hallucination rate: -60%

业务 ROI:
  hallucination 减少 = 客户支持团队减 1 FTE
  1 FTE = AUD 80k/年
  
月成本对比:
  v2 多花: $300/月 × 100 万调用 × ($0.0011 - $0.0008) ≈ $300/月
  节省: AUD 80k/年 ≈ AUD 6,667/月
  
ROI: $300 vs $6,667 = 22x → 必上 v2
```

会算这个账 = AI PM 跟传统 PM 最大区别。

---

## 五、6 个月转 AI PM 路径

```mermaid
gantt
    title 6 个月转 AI PM 路径
    dateFormat X
    axisFormat Month %d
    
    section 项目实战
    做一个 day job AI 工具    :m1, 0, 30d
    写完整 PRD                :m2, after m1, 30d
    建 eval set + 跑 eval     :m3, after m2, 30d
    Cost-benefit analysis    :m4, after m3, 30d
    
    section 求职准备
    Portfolio 整理            :m5, after m4, 30d
    简历 + 投递 + mock        :m6, after m5, 30d
```

匠人学院 [/learn/ai-pm](https://jiangren.com.au/learn/ai-pm) 把这 6 步拆成 8 个真实项目，每个项目对应一个 AI PM 核心能力 + 1v1 导师 review。

---

## 六、工具栈推荐

| 工具 | 用途 | 价格 |
|---|---|---|
| LangSmith | trace + eval + monitor | 免费 tier 够个人项目 |
| Promptfoo | open-source eval framework | 免费 |
| Anthropic Console | prompt iteration + cache analytics | 免费 |
| OpenAI Cost Calculator | 月度成本预估 | 免费 |
| Cursor | AI PM 写代码工具 | USD 20/月 |
| Figma | UI 设计 | 免费 / USD 12 |

总预算 USD 20-30/月。

---

## 七、8 家 AI PM 课程 verdict

`skip` 类（4 家）：国内大型在线教育 AI PM 系列课、国内 PM 内容平台 AI PM 训练营、传统在线大学 AI PM 认证、AIGC 6 周速成班。

`depends`（1 家）：某深度学习社区 AI PM 方向（数据 PM 可考虑）。

`keep`（3 家）：Coursera IBM AI Product Management Specialization (audit 免费)、DeepLearning.AI AI for Everyone (免费)、Lenny's Newsletter (USD 10-15/月)。

---

完整 PRD 模板 + eval set 模板 + cost calculator + 8 家课程详细测评在 [JR Academy GitHub](https://github.com/JR-Academy-AI)。更多澳洲 AI PM 求职数据 [/blog](https://jiangren.com.au/blog)。

下一篇拆"AI PM 第一周做什么 — 真实 day job 痛点变 LLM 工具的 5 个 case"，欢迎关注。

---

_本文作者来自匠人学院（[JR Academy](https://jiangren.com.au/learn/ai-engineer)）—— 澳洲项目制 AI 工程实战平台。完整代码 / 数据集 / eval set 模板见 [GitHub](https://github.com/JR-Academy-AI)。_
