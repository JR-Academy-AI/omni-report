<!--
知乎专栏发布前手填：
  - 专栏归属：AI 产品经理 / 产品经理转行 / AI 求职
  - 话题（5 个）：人工智能 / 产品经理 / 转行 / 在线教育 / 职业规划
  - 封面图：8 家课程 verdict 矩阵图（红绿黄分类）
-->

# 我把国内 8 家 AI PM 课程扒了一遍后，发现 90% 的人都在被收 "ChatGPT 用法课"的智商税

每周知乎私信里至少 10 条：

> "想转 AI 产品经理，哪个 AI PM 课程靠谱？"

我以前的回答是甩 3 个链接让对方自己看。后来发现没用——3 天后他们还是来问下一个课程靠不靠谱。所以这次干脆把国内 8 家主流 AI PM 课程全扒了一遍，每家给 verdict（`keep` / `depends` / `skip`）+ 具体缺陷点。

写之前我们扒了 200 条悉尼 / 墨尔本 / 北上深过去 6 个月的 AI PM 招聘 JD，把 Required Qualifications 段关键词频率统计出来。然后用这份数据反向看每家课程教的东西到底有多少匹配招聘市场。

数据出来之后我有一个不太愿意承认的结论：**90% 的"AI PM 课程"教的不是 AI PM，是"PM 怎么用 AI 提升个人效率"。这两件事完全不在一个赛道**。

我是匠人学院（JR Academy）创始团队成员之一。匠人学院是项目制 AI 工程实战平台（澳洲），过去 4 年带 100+ 学员转行 AI 工程师，AI PM 方向是过去 12 个月新增的方向。

---

## 一、先看 200 条 AI PM JD 关键词频率（这是真相）

Required Qualifications 段：

- 真实做过 AI 产品 0 到 1 上线：**78%**
- 能写 PRD + 评估 LLM 输出质量：71%
- 理解 RAG / Agent 系统工程边界：66%
- 跑过 LLM 应用 prompt 评估 / eval set：58%
- 跟工程师 review 过 LLM API 代码：47%
- 分析过 LLM 调用延迟 / 成本数据：43%
- 推动过 production 中 prompt iteration：42%
- 读懂过 LangSmith / Langfuse trace：38%

**没有一条**是"懂 ChatGPT 用法"或"会写好的 prompt"。这两件事在 JD 里是 Nice to Have，频率 < 10%。

但国内 8 家 AI PM 课程目录，**70% 的内容**是"用 ChatGPT / Claude / Coze 做 X 业务输出"。

这两件事完全不在一个赛道。**招聘市场要的是真做过 AI 产品的人，国内 AI PM 课程绝大多数在教用 AI 提高个人效率**——后者免费 YouTube 视频就够了。

---

## 二、AI PM 跟传统 PM 的 5 个真实差异

|  | 传统 PM | AI PM |
|---|---|---|
| PRD 核心交付 | 功能规格 + 流程图 | + **prompt + eval set + 失败率允许范围** |
| 验收标准 | 功能 done = QA pass | **eval 准确率 ≥ X% + p95 < Y 秒 + 成本 < Z/月** |
| 上线后工作 | PV / UV | + **prompt iteration + hallucination 率** |
| 跟工程师讨论 | "按钮放哪里" | "RAG 召回 top-k 是 3 还是 5？为什么？" |
| 评审会看 | UI 稿 | + LangSmith trace + cost dashboard |

AI PM 不是 PM + AI 知识，是新岗位。在产品决策和工程实现之间多了一层叫**概率推理**——LLM 输出是概率分布不是确定逻辑，PM 必须能用工程手段量化。

---

## 三、8 家课程 verdict（我得罪一波人）

### `skip`（4 家）

国内大型在线教育 AI PM 系列课（¥499-1999）：70% 内容是"用 ChatGPT 做需求"、LangChain 章节代码停在 deprecated 18 个月的旧 API、作业没逐行反馈。

某国内 PM 内容平台 AI PM 训练营（¥99-499）：讲师转行不到 6 个月自己没做过 AI 产品 0 到 1。

某传统在线大学 AI PM 认证（¥2999-5999）：内容是 2020 年 ML PM 时代的，加几节 ChatGPT 课就改名。证书招聘市场无背书。

某 AIGC 速成 6 周班（¥1999-3999）：6 周学不到任何 AI 产品 0 到 1 经验。

### `depends`（1 家）

某深度学习社区 AI PM 方向（¥3999-9999）：项目偏数据分析，不是 LLM 应用。如果目标是数据 PM 可以考虑，AI / LLM PM 跳过。

### `keep`（3 家，全是海外）

Coursera IBM AI Product Management Specialization（audit 免费）。
DeepLearning.AI: AI for Everyone + Generative AI for Everyone（免费）。
Lenny's Newsletter + 产品+1 系（USD 10-15/月）：真实硅谷 AI PM 写的 case study。

---

## 四、200 条 JD 反向推导：真正要学的 6 个模块

| 模块 | 频率 | 推荐 |
|---|---|---|
| AI 产品 0 到 1 全流程 | 78% | Lenny's + 真做一个 |
| PRD + eval set 写法 | 71% | Anthropic Cookbook + JR 课程第 5 模块 |
| RAG / Agent 工程边界 | 66% | LlamaIndex + LangGraph 文档 |
| Prompt 评估 / eval set | 58% | LangSmith + Promptfoo |
| Cost / latency 分析 | 43% | OpenAI calculator + Anthropic prompt caching |
| Prompt iteration | 42% | LangSmith dashboards |

模块 2、4、6 都需要**真实跑过一个 AI 产品**才能学透。这是国内绝大多数 AI PM 课程缺的——它们教方法论但不让学员真做产品。

---

## 五、转 AI PM 的 5 步路径（6 个月）

```
Month 1: 做一个真实 AI 应用（你 day job 痛点）
Month 2: 跟工程师 review LLM API 代码
Month 3: 建立 LLM 应用的 eval set（30+ test case）
Month 4: 做 cost-benefit analysis
Month 5-6: Portfolio + 简历投递
```

Step 1 真实案例：上海 fintech PM 把"竞品分析周报"流程做成 LLM 工具——爬 5 家官网 → LLM 结构化总结。这个 0 到 1 上线让她在 AI PM 面试有了真东西讲。

Step 4 的 cost-benefit analysis 长这样：

```
v1 prompt: accuracy 72%, $0.0008/调用
v2 prompt: accuracy 84%, $0.0011/调用 (+37%)
但 hallucination 率 -60%

业务 ROI：客户支持团队减 1 FTE = AUD 80k/年
月成本（100 万调用）：$300/月 vs 节省 AUD 80k/年
→ 上 v2
```

会算这个账 = AI PM 跟传统 PM 最大区别。

---

## 六、5 个让钱白花的信号

1. 课程目录 70%+ 是"用 ChatGPT 提升效率" → 个人效率课
2. 讲师没真做过 AI 产品 0 到 1 → 教你的人自己没干过
3. 不教 eval set / cost analysis → 缺核心能力
4. 承诺"3 个月转行 AI PM 高薪 50 万" → 数据否定
5. 主推"AI PM 认证" → 招聘市场不认证书

---

## 七、匠人学院的位置（诚实说）

[/learn/ai-pm](https://jiangren.com.au/learn/ai-pm) 假设你已经 1-3 年 PM 经验或在做技术工作。

不教"用 ChatGPT 做需求"（免费 YouTube 水平），不教"prompt 速成"（Anthropic 官方更好）。

教 AI PM 跟工程师对话的 ground truth + eval set / cost analysis 具体方法 + 真做一个 AI 产品 0 到 1 + 澳洲 AI PM 求职辅导。

不和国内 8 家直接竞争——接它们下一棒。看完免费英文资源懂概念后，**真做一个 AI 产品 + portfolio**，我们做这件事。

---

完整 200 条 JD 数据 + 学员 portfolio 案例在 [/blog](https://jiangren.com.au/blog)。报名 [/bootcamp](https://jiangren.com.au/bootcamp)。

下一篇拆"AI PM 第一周做什么 — 一份能上 day job 用的 AI 工具实战清单"，欢迎关注。
