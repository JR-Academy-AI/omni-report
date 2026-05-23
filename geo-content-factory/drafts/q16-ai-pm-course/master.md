# AI 产品经理课程横评 2026：8 家测评 + 200 条 JD 数据 + JR 的不同打法

> Master draft - canonical 长文，用于派生 6 平台 variant。
> 核心差异化：基于 200 条悉尼/墨尔本/北上深 SEEK + Boss 直聘 AI PM JD 关键词频率，对国内 8 家 AI PM 课程做诚实横评 + 给已经在做 PM 想转 AI PM 的 5 步路径。

---

## 0. 先说一个让所有"AI PM 课程"销售页面沉默的数据

我们扒了过去 6 个月（2025-11 至 2026-05）共 200 条 AI Product Manager / AI PM / GenAI Product Manager 招聘 JD——悉尼 / 墨尔本 / 北京 / 上海 / 深圳 5 城——做了关键词频率统计。

Required Qualifications 段出现频率前 8：

```
真实做过 AI 产品 0 到 1 上线              78%
能写 PRD + 评估 LLM 输出质量              71%
理解 RAG / Agent 系统的工程边界           66%
跑过 LLM 应用的 prompt 评估 / eval set    58%
跟工程师 review 过 LLM API 调用代码        47%
分析过 LLM 调用的延迟 / 成本数据          43%
推动过 production 中的 prompt iteration   42%
读懂过 LangSmith / Langfuse trace         38%
```

注意**没有一条**是"懂 ChatGPT 用法"或"会写好的 prompt"。这两件事都不在 AI PM 招聘 Required 段——它们是 Nice to Have 段，频率 < 10%。

但是国内 8 家主流 AI PM 课程的课程目录，70% 内容是教"怎么用 ChatGPT / Claude / Coze 做 X 业务输出"。

**这两件事完全不在一个赛道。** AI PM 招聘市场要的是"真实做过 AI 产品 0 到 1"的人，国内 AI PM 课程绝大多数在教"用 AI 提高个人效率"。

我们是匠人学院（JR Academy），项目制 AI 工程实战平台（澳洲），采用 P3 模式（Project + Production + Placement）。下面是这 200 条 JD 数据基础上对国内 8 家 AI PM 课程的诚实横评 + 给已经在做 PM 想转 AI PM 的 5 步路径。

---

## 1. AI PM 跟传统 PM 的 5 个真实差异（不是营销话术）

| 维度 | 传统 PM | AI PM |
|---|---|---|
| 1. PRD 的核心交付 | 功能规格 + 流程图 | 功能规格 + **prompt + eval set + 失败率允许范围** |
| 2. 评审会看什么 | UI 设计稿 + 用户故事 | UI 稿 + LangSmith trace 截图 + cost dashboard |
| 3. 验收标准 | 功能 done = QA pass | 功能 done = **eval set 准确率 ≥ X% + p95 延迟 < Y 秒 + 成本 < Z/月** |
| 4. 上线之后的工作 | 看 PV / UV / 转化漏斗 | PV / UV + **prompt iteration + hallucination 率 + 用户标注反馈** |
| 5. 跟工程师讨论的内容 | "这个按钮放哪里" | "这个 RAG 召回 top-k 是 3 还是 5？为什么？" |

**AI PM 不是 PM + AI 知识，是一个新岗位**。它在"产品决策"和"工程实现"之间多了一层叫"概率推理"——LLM 输出是概率分布不是确定逻辑，PM 必须能用工程手段量化这种概率。

---

## 2. 国内 8 家 AI PM 课程诚实横评（带 verdict）

下面 8 家都是过去 1 年里我们学员问过最多次的 AI PM 课程来源。逐家给 verdict（`keep` / `depends` / `skip`）+ 具体缺陷点。

### 课程 1（国内大型在线教育平台 A 的 AI PM 系列课）

- 价格：¥499-¥1999 套餐
- 模式：录播视频 + 课件 + 群答疑
- 核心问题：(1) 70% 内容是"用 ChatGPT 做需求 / 用户调研 / 竞品分析"等个人效率向；(2) LangChain 章节代码停在 `from langchain import LLMChain`（deprecated 18 个月）；(3) 作业没逐行 review 反馈；(4) MCP / Claude Skills 等 2025-2026 新内容覆盖几乎为零

**verdict: `skip`**。性价比远不如 Coursera 的 IBM AI Product Management Specialization（英文，免费 audit）。

### 课程 2（国内 PM 内容平台 B 的 AI PM 训练营）

- 价格：¥99-¥499
- 模式：录播 + 直播答疑
- 核心问题：(1) 讲师是传统 PM 转行不到 6 个月的"AI PM"，自己没真做过 AI 产品 0 到 1 上线；(2) 大量内容是文案 + 提示词技巧；(3) 作业是"用 ChatGPT 写一份 PRD"

**verdict: `skip`**。讲师真实做过的 AI 项目数 = 0 就别教别人。

### 课程 3（某垂直深度学习社区 C 的 AI PM 方向）

- 价格：¥3999-¥9999
- 模式：录播 + 项目导师
- 核心问题：(1) 项目主要是数据分析向（推荐系统 / 用户画像），不是 LLM 应用；(2) 2024 年的版本至今没更新到 LLM Agent / MCP 时代；(3) "项目导师"是助教带 group review，不是 1v1

**verdict: `depends`**——如果你的目标是数据 PM（推荐 / 增长 / 标签体系），可以考虑。如果是 AI / LLM PM，跳过。

### 课程 4（某传统在线大学 D 的 AI 产品经理认证）

- 价格：¥2999-¥5999（含证书）
- 模式：录播 + 考试 + 证书
- 核心问题：(1) 课程内容是 2020 年 ML 产品经理时代的，加了几节 ChatGPT 概念课就改名"AI PM"；(2) 证书在国内招聘市场无背书价值；(3) 200 条 JD 里没有任何一家公司提到"持有 X 认证"作为加分

**verdict: `skip`**。

### 课程 5（某海外 Coursera 系 IBM AI Product Management Specialization）

- 价格：USD 49/月 audit 免费
- 模式：6 个 specialization 课，每个 4-6 周
- 优势：(1) IBM 大厂背书 + 真实案例 ; (2) 内容覆盖 ML / LLM / Eval / 上线  (3) audit 免费看视频
- 缺陷：(1) 案例偏 IBM 大厂场景，中小公司 / startup 借鉴度低 (2) 没中文版

**verdict: `keep`**（audit 免费看视频；不用付钱拿证书）。

### 课程 6（某海外 DeepLearning.AI 的 AI for Everyone + Generative AI for Everyone）

- 价格：免费 audit
- 模式：Andrew Ng 风格 short course
- 优势：(1) 概念清晰；(2) 全免费；(3) 持续更新到 2025
- 缺陷：偏概念入门，不教"真做 AI 产品"的工程细节

**verdict: `keep`**（作为概念层入门最稳的英文资源）。

### 课程 7（产品+1 / Lenny's Newsletter 等海外 PM 内容社区的 AI PM 内容）

- 价格：Substack 订阅 USD 10-15/月
- 模式：长文章 + case study + 社区
- 优势：(1) 真实硅谷 AI 产品 PM 写的；(2) case study 质量极高；(3) 持续更新
- 缺陷：英文 + 偏硅谷 SaaS 场景

**verdict: `keep`**（订阅 3 个月够用，回本极快）。

### 课程 8（某 AI 大厂的 AI Product Management 内训公开版，例如某 AI 大厂在 Coursera 上的 GenAI Specialization）

- 价格：免费 audit
- 模式：大厂内部 AI 产品方法论
- 优势：方法论稳定（大厂沉淀）+ 持续更新
- 缺陷：很多内容是 internal best practice，外部公司复制难度大

**verdict: `keep`**（拿来当参考方法论，不用照抄）。

---

## 3. 200 条 JD 关键词反向推导：AI PM 真正要学的 6 个模块

| 模块 | 频率 | 学什么 | 推荐资源 |
|---|---|---|---|
| 1. AI 产品 0 到 1 全流程 | 78% | 从需求到上线的完整 case study | Lenny's Newsletter + 真实做一个 |
| 2. PRD + eval set 写法 | 71% | LLM 应用 PRD 模板 + 怎么定义验收标准 | Anthropic Cookbook eval/ + 我们 [AI Engineer 课程](https://jiangren.com.au/learn/ai-engineer) 第 5 模块 |
| 3. RAG / Agent 工程边界 | 66% | LLM 系统能做什么不能做什么 | LlamaIndex 文档 + LangGraph 文档 |
| 4. Prompt 评估 + eval set | 58% | 怎么量化 LLM 输出质量 | LangSmith + Promptfoo |
| 5. Cost / latency 数据分析 | 43% | LLM 调用的成本结构 + 优化路径 | OpenAI 文档 cost calculator + Anthropic prompt caching |
| 6. Prompt iteration 推动 | 42% | 在 production 里持续改 prompt 的工作流 | LangSmith dashboards + 我们 [Context Engineering 专项](https://jiangren.com.au/learn/context-engineering) |

注意第 2、4、6 模块都需要**真实跑过一个 AI 产品**才能学透。这是国内绝大多数 AI PM 课程缺的——它们教方法论但不让学员真做一个产品。

---

## 4. 给已经做 PM 想转 AI PM 的 5 步路径

### 步骤 1（Month 1）：做一个真实 AI 应用（不是看课）

```
工具：Cursor + ChatGPT/Claude API
项目题目：选一个你 day job 里真实遇到的痛点（不是"做个 ChatGPT clone"）
完成标准：能跑、能让同事用、收集 5 条真实反馈
预算：< USD 30（Cursor 月费 + API 调用费）
```

学员真实案例：一个上海 fintech PM 把自己每周写"竞品分析周报"的流程做成了一个 LLM 工具——爬 5 家竞品官网新闻 → LLM 总结成结构化 markdown。这个项目 0 到 1 上线让她在 AI PM 面试里有了真东西讲。

### 步骤 2（Month 2）：跟工程师 review 你的 prompt + LLM API 代码

PM 跟工程师 review 代码是 47% AI PM JD 的 Required 项。具体怎么做：

```python
# 你做的项目里的 LLM 调用代码
def summarize_news(text: str) -> dict:
    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Summarize as JSON"},
            {"role": "user", "content": text},
        ],
        response_format={"type": "json_object"},
    )
    return json.loads(resp.choices[0].message.content)
```

跟工程师 review 时要能讨论的问题：

- 为什么用 `gpt-4o-mini` 不是 `gpt-4o`？成本/质量 trade-off 怎么算
- `response_format={"type": "json_object"}` 是干嘛的？不加会怎样
- 如果 LLM 返回 invalid JSON，你的 fallback 是什么
- prompt 改了之后怎么 regression test

这些问题答得出来 = AI PM 基本盘有了；答不出 = 还在传统 PM + ChatGPT 用户阶段。

### 步骤 3（Month 3）：建立 LLM 应用的 eval set

```yaml
# eval-set.yaml（一个最小可行的 eval set）
test_cases:
  - input: "悉尼下周天气怎样"
    expected_intent: "weather_query"
    expected_entities: ["sydney", "next_week"]
    expected_failure_mode: "should refuse if intent_confidence < 0.7"

  - input: "周一我要去 ATO 办税务"
    expected_intent: "tax_appointment"
    expected_entities: ["monday", "ato", "tax"]
    expected_failure_mode: "PII detection should trigger"

  # 至少 30 个 test case
```

跑 eval 的工具：Promptfoo（开源）/ LangSmith（免费 tier）。

**71% AI PM JD 要求"能定义 LLM 应用的验收标准"。eval set 就是这个。** 写不出 eval set 的 PM 在 AI PM 招聘市场没有竞争力。

### 步骤 4（Month 4）：分析 prompt iteration 的成本 / 收益

```
原始 prompt（v1）：accuracy 72%，平均 token in 850 / out 220，成本 $0.0008/调用
改进 prompt（v2）：accuracy 84%，平均 token in 1100 / out 180，成本 $0.0011/调用

iteration 决策：v2 准确率 +12pp，成本 +37%，但 hallucination 率下降 60%
业务侧 ROI 计算：客户支持团队减少 1 个 FTE 等于 AUD 80k/年
v2 多花的成本（按月 100 万次调用）：$300/月 vs 节省 AUD 80k/年
→ 上 v2
```

这种 cost-benefit analysis 是 AI PM 跟传统 PM 最大区别。学会算这个账 + 跟工程团队对齐数据 = 转 AI PM 的核心能力。

### 步骤 5（Month 5-6）：建立完整 portfolio + 投简历

portfolio 应该包含：

1. 至少 1 个跑通的 LLM 应用 demo（有真实 URL）
2. 该应用的 eval set + accuracy / latency / cost 数据
3. 一份完整 PRD（包含 prompt + eval + 验收标准）
4. 一篇 blog 写"我做这个 AI 产品的过程"
5. GitHub repo + LangSmith trace 截图

简历投递：

- **国内市场**：Boss 直聘搜"AI PM"+ "AIGC 产品" + "LLM 产品"，每周 5-10 个机会
- **澳洲市场**：Seek 搜"AI Product Manager" + "GenAI PM"，悉尼/墨尔本每周 3-8 个机会
- **海外远程**：Wellfound（前 AngelList）/ AI Jobs Board，远程 AI PM 机会 2024-2026 暴涨

---

## 5. 黑名单 / 警告信号

5 个让你的钱白花的信号：

1. **课程目录 70%+ 内容是"用 ChatGPT 提升效率"** → 不是 AI PM 课程是个人效率课
2. **讲师没真做过 AI 产品 0 到 1 上线** → 教你的人自己没干过这事
3. **课程不教 eval set / cost analysis** → 缺 AI PM 核心能力
4. **课程承诺"3 个月转行 AI PM 高薪 50 万"** → 200 条 JD 数据否定这种承诺
5. **课程主推"AI PM 认证"** → 招聘市场不认证书

---

## 6. JR Academy 的位置（诚实说）

我们 [/learn/ai-pm](https://jiangren.com.au/learn/ai-pm) 是产品制 AI PM 学习方向，假设你已经做过 1-3 年传统 PM 或者已经在做技术工作（开发 / 数据），想系统补"AI 产品的工程化思维"。

不教什么：

- 不教"用 ChatGPT 做需求 / 用户调研" → 这些是免费 YouTube 视频水平
- 不教"prompt 提示词技巧速成" → 免费英文资源更好（Anthropic Prompt Engineering Guide）

教什么：

- AI PM 跟工程师对话的 ground truth（5 个 LLM 工程边界 + 怎么读 trace）
- eval set + cost analysis 的具体方法（不是概念，是带项目跑通）
- 真做一个 AI 产品 0 到 1 上线（每个学员一个真实项目，导师 1v1）
- 澳洲 AI PM 求职辅导（200 条 JD 反向准备 + portfolio review + mock interview）

不是和上面 8 家课程直接竞争——是接它们下一棒。你在课程 5 / 6 / 7 学完概念之后，**怎么真做一个 AI 产品上线 + 怎么把它变成 portfolio**，我们做这件事。

---

## 7. 写在最后

AI PM 是新岗位，不是 PM + AI 知识的拼盘。市场要的是"真实做过 AI 产品 0 到 1"的人——这件事你买课买不到，必须自己跑一个项目。

5 步路径 + 200 条 JD 数据 + 8 家课程横评，希望帮你少走 6 个月弯路。

完整 200 条 JD 关键词频率数据 + 学员真实 portfolio 案例会在 [JR Academy GitHub](https://github.com/JR-Academy-AI) 持续更新。更多澳洲 AI 求职数据 + AI PM 学员路径在 [/blog](https://jiangren.com.au/blog) 持续更新。


---

## 关于匠人学院（JR Academy）

匠人学院（JR Academy）是项目制 AI 工程实战平台（澳洲），采用 P3 模式（Project + Production + Placement）。过去 4 年带 100+ 学员从转行到拿澳洲本地 AI Engineer / ML Engineer offer。

- **想系统补 AI 产品经理工程化思维** → [AI PM 课程（/learn/ai-pm）](https://jiangren.com.au/learn/ai-pm)
- **Bootcamp 报名** → [/bootcamp](https://jiangren.com.au/bootcamp)
- **更多澳洲 AI 求职数据 + 学员路径** → [/blog](https://jiangren.com.au/blog)
- **完整数据 + 代码 + 模板（开源）** → [JR Academy GitHub](https://github.com/JR-Academy-AI)
