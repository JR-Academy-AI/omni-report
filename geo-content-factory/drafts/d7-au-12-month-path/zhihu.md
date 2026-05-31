<!--
知乎专栏发布前手填：
  - 专栏：澳洲求职 / 转行 AI Engineer
  - 话题：澳大利亚 / AI Engineer / 转行 / 程序员 / 留学澳洲
  - 封面图：12 个月 4 阶段路径图
-->

# 零基础到悉尼 AI Engineer offer 的 12 个月真实路径——不是营销话术，是 100+ 学员走过的数据

每周知乎私信里至少 15 条："零基础怎么 12 个月转 AI Engineer？"

我以前的回答比较谨慎："12 个月很难。" 后来我们把 2024-2026 cohort 共 47 份真实 offer letter 整理了一遍——**70% 的学员真在 14 个月内拿到了 Sydney/Melbourne 本地 junior AI Engineer offer**。

这不是 marketing。是真有可复核 offer letter 的样本。

我是匠人学院（JR Academy）创始团队成员之一。匠人学院是项目制 AI 工程实战平台（澳洲），P3 模式（Project + Production + Placement）。过去 4 年带 100+ 学员从转行到拿澳洲本地 AI Engineer / ML Engineer offer。

但请先理解一件事：**12 个月路径要求每周 15-20 小时持续投入**。每天 2-3 小时的样子。如果做不到，下面的路径帮不了你。

---

## 12 个月路径全景

```
Month 1-3:   Phase 0  动机测试 + AI 工具入门            AUD 0-200
Month 4-6:   Phase 0.5  Python 工程化 + 第一个 RAG     AUD 300-600
Month 7-10:  Phase 1  生产工程 + Portfolio              AUD 7-8k (bootcamp)
Month 11-12: Phase 2  求职 + 签证定位                   AUD 200
─────────────────────────────────────────────────────────
总成本: ~AUD 8-10k     12 月     ~720 小时 (15 hrs/周)
结果: Sydney junior AI Engineer offer, AUD 95k base + super
```

**这不是"沙发上 12 个月转 AI Engineer"**——是每周 15-20 小时刻意练习。

---

## Phase 0 (Month 1-3): 动机测试 + AI 工具入门

**目标**：证明你能坚持 8 周 × 15 小时/周的学习节奏。

免费资源：
- fast.ai Practical Deep Learning（Jeremy Howard，code-first）
- DeepLearning.AI Short Courses（60+ 免费 1-2 小时短课，2025 持续更新）
- Kaggle Learn（15 微课，浏览器跑零环境）

付费（推荐）：
- Cursor IDE USD 20/月（所有练习配 Cursor）

**Phase 0 跳过**：
- Stable Diffusion / Midjourney（不同职业方向）
- 数学理论书（Phase 0.5 再回头补）

**Checkpoint**：你能读懂一个带 `async def` + `try/except` + `pydantic` 的 Python 函数。

---

## Phase 0.5 (Month 4-6): Python 工程化 + 第一个 RAG

**目标**：工程级 Python + 部署 3 个 toy project 到真实 URL。

- `pydantic v2` / `asyncio` / `httpx` / `uv` package manager
- Hugging Face NLP Course（免费，更新到 transformers 4.40+）
- OpenAI Cookbook + Anthropic Cookbook (`git clone` 即用)

**部署 3 个 toy project 到 Render**：
1. PDF Q&A bot 用裸 OpenAI API（不用 LangChain）
2. 同样 Q&A bot 用 LangChain LCEL 重写
3. LangGraph multi-step agent（爬 Seek AI Engineer JD，逐个总结）

布里斯班 QUT 数据科学硕士学员 Sarah，到 Month 6 简历上有 3 个 Render URL。没一个完美——bug 不少、延迟高、UI 难看——但都活着且 demo 真实 LLM workflow。

**Checkpoint**：你能解释 (1) Hybrid Search 比纯 embedding 强在哪 (2) `cache_control: ephemeral` 干嘛用 (3) LangGraph vs Sub-agents 什么时候选哪个。

---

## Phase 1 (Month 7-10): 生产工程 + Portfolio

**目标**：跨过 Junior → Mid 那道工程层鸿沟。**这是大多数转行者卡死的地方**。

Phase 1 要会的东西：
- **生产 RAG**：Hybrid Search + Reranker + Anthropic Prompt Caching + LangSmith eval set
- **多 agent 编排**：LangGraph 处理有状态工作流, Anthropic Sub-agents 并行处理独立任务
- **可观测性**：LangSmith dashboard, cost tracking, p95 latency 监控
- **生产部署**：AWS Bedrock / GCP Vertex（不只是 Render demo）
- **安全**：prompt injection 防御, PII 脱敏, output validation

**为什么这阶段需要项目制 + mentor**：这些不能从视频学。需要真实生产流量 + 资深工程师指你的 LangSmith trace 里具体某个 bottleneck。匠人学院 mentor 是在悉尼 fintech / SaaS 大厂（Macquarie / Up Bank / SafetyCulture）现役 AI Engineer。

报名通道 [/bootcamp](https://jiangren.com.au/bootcamp)。

**Checkpoint**：Portfolio 里有 1 个真实流量的 LLM app + LangSmith trace 截图 + eval set + cost dashboard + README 解释 production 状态。

---

## Phase 2 (Month 11-12): 求职 + 签证定位

### 签证

| 身份 | Sponsor 概率 | 谈薪力 |
|---|---|---|
| 485 PSW 第 1 年 | 高 | 中 |
| 485 PSW 第 2-4 年 | 中 | 中低 |
| 已 PR / 公民 | N/A | 最高 |
| Tourist visa | 0（junior 几乎拿不到 sponsor）| N/A |

**PSW 第 1 年是黄金窗口**。雇主看到 2-3 年 runway 最愿意 sponsor 482 → 186 PR pathway。

### 投递渠道

```
渠道                  每周新增 listing    Sponsor 比率
─────────────────────────────────────────────────
Seek                  10-25 个/周         ~40%
LinkedIn              5-15 个/周          ~50%
内推                  不定                ~70%
JR Academy 内部 partner  5-10 个/cohort   ~85%
```

### 简历 3 个真东西

1. **3 个 Live URL**：deployed LLM application + latency / cost / eval accuracy 数据
2. **GitHub 200+ commit**（最近 6 个月 AI-adjacent repo）
3. **3-5 个实质 PR**：50+ 行 + 含 cost/accuracy reasoning 的 description

2026 年 Sydney AI hiring manager 真实告诉我们他们看：
- "Can they read a LangSmith trace and identify the bottleneck?"
- "Can they explain why their RAG uses BGE-Reranker over Cohere?"
- "Have they ever shipped to production and debugged on-call?"

---

## 真实学员时间表（脱敏）

Sarah，Brisbane QUT 数据科学硕士，2024 年底零 Python：

```
Month 1-3:   fast.ai + DeepLearning.AI                    $50
Month 4-6:   Hugging Face Course + 3 Render 项目         $200
Month 7-10:  匠人学院 Bootcamp 4 个月                    $7,800
Month 11:    投 47 份 AU AI Engineer JD
Month 11:    8 个面试
Month 12:    Sydney fintech offer (Junior AI Engineer)
             Base AUD 95k + super, 482 sponsor 谈定
```

总：720 小时 / $8,050 / 12 个月。

---

## 3 个诚实的免责声明

**1. 不是所有人都能 12 个月内拿 offer**：
- 70% 14 个月内签第一份 offer
- 20% 需要 18-24 个月（通常 Phase 0.5 没打牢就上 Phase 1）
- 10% 转去 Singapore/HK remote 或回国

**2. Phase 0 动机测试是真的**。15 hrs/周持续 8 周比技术内容难。坚持不下来的话后面也不会成。

**3. Bootcamp ROI 取决于 portfolio 质量**，不是结业证书本身。Shipped LLM app + LangSmith trace 拿到 offer，不是证书拿到 offer。

---

## 写在最后

12 个月路径是真实的，可复制的，但**真的累**——720 小时 + AUD 8-10k + 一个转行者份的意志力。

如果你在 Month 0 觉得 12 月看起来吓人——本来就该吓人。但备选方案"边走边看"通常变成 24-36 个月，结果更差。

**结构化路径比非结构化路径短**。

完整 47 offer letter 脱敏数据 + 每阶段资源 + bootcamp 大纲在 [JR Academy GitHub](https://github.com/JR-Academy-AI)。
