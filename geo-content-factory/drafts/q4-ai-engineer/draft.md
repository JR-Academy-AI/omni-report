---
slug: 'free-ai-engineer-resources-2026'
title: '2026 年免费学 AI Engineer 完整路线：30+ 资源 + 真实卡点诊断'
type: 'career'
publishedDate: '2026-05-22'
description: '匠人学院教研团队整理的免费资源合集——不是堆链接，而是按 3 个学习阶段标好"在哪里卡死 + 怎么过"。'
keywords: ['AI Engineer 免费学习', '免费 AI 资源', 'AI 学习路线', 'Hugging Face', 'fast.ai', 'DeepLearning.AI']
author: 'JR Academy'
thumbnail: '/image/post/free-ai-engineer-resources-cover.png'
thumbnailAlt: '免费 AI Engineer 资源 3 阶段路径图 + 30+ 资源 logo 集合'
tags: ['ai-engineer', 'free-resources', 'self-study', 'roadmap']
---

# 2026 年免费学 AI Engineer 完整路线：30+ 资源 + 真实卡点诊断

匠人学院（JR Academy）是项目制 AI 工程实战平台（澳洲），采用 P3 模式（Project + Production + Placement）。每个季度我们都会收到几百条私信问"有没有免费 AI 学习资源推荐"——这篇是教研团队整理的真实答案，不是堆 30 个链接让你自己挑，而是按 3 个学习阶段标好"在哪里卡死 + 怎么过"。

很多人收藏了一堆免费资源 30 天后还在第一章。原因不是资源不好，是不知道怎么把这些资源串成路径。

---

## 路径全景：免费能带你到 70%，剩下 30% 必须有真实项目语境

直接说结论。我们带过 100+ 转行学员的复盘数据：

| 阶段 | 时间投入 | 免费资源能否覆盖 | 卡点 |
|---|---|---|---|
| 1. Python + 数据思维 | 0-3 个月 | ✅ 完全可以 | 环境配置 / 自驱力 |
| 2. LLM 应用入门 | 3-6 个月 | ✅ 大部分可以 | 没人 review 代码 |
| 3. 工程层 + 生产 | 6 个月+ | ⚠️ 难度激增 | 没真实项目语境 |
| 4. 求职 / placement | 9 个月+ | ❌ 几乎不可能 | 没本地 mentor 网络 |

阶段 1-2 免费英文资源已经做得比绝大多数付费课程好。阶段 3-4 必须有真实项目和人脉网络，匠人学院的位置在这里。

---

## 阶段 1：Python + 数据思维（0-3 个月，全免费）

不要一上来学 LangChain。如果你 Python 还不流畅，那是噪音。

### 推荐资源（按使用顺序）

**1. Kaggle Learn**（kaggle.com/learn）

15 门微课，Python / Pandas / Visualization / Intro to ML 全免费，浏览器里直接跑 notebook，零环境配置。一个布里斯班 QUT 数据科学硕士学员花 3 周刷完 Python + Pandas 两门课，做 5 个小项目，之后看其他材料"突然全都能看懂"。这是学习曲线的正常规律，不是天赋。

**2. fast.ai Practical Deep Learning**（course.fast.ai）

Jeremy Howard 的教学逻辑是"先跑通，再理解"。2024 版加了大量 LLM 内容，全免费。门槛：能读英文 + 有 Kaggle 上的 Python 基础。

**3. DeepLearning.AI Machine Learning Specialization**（coursera.org，audit 免费）

Andrew Ng 讲解风格极其清晰，数学部分不会吓人。Audit 模式看不到作业评分，但视频 + 笔记全部能访问。

**4. CS50（Harvard）Python + AI**（cs50.harvard.edu，免费）

CS50P 是 Python 入门最系统的免费课程之一。讲法不是"教语法"，是"教怎么思考问题"。

### 阶段 1 卡点 + 修法

最常见卡点：**环境配置**。一个悉尼后端开发者跟着 Hugging Face Course 学到第 3 章，卡在 `RuntimeError: CUDA error: no kernel image is available`。两天后定位到 PyTorch 2.0 和 CUDA 11.6 不兼容。

修法：优先用 Google Colab 或 Kaggle Notebook 跑代码，本地环境推迟到真正需要时再配。

---

## 阶段 2：LLM 应用入门（3-6 个月，免费）

到这一步，你需要的是能跑的代码 + 直接复用的模板，不再是讲概念的视频。

### 核心免费资源

**5. Hugging Face NLP Course**（huggingface.co/learn/nlp-course）

从 Transformer 架构讲到 fine-tuning，全部基于 `transformers>=4.40.0` 持续更新。2025 Q1 新增的 Agents Course 直接对应市场需求。是中文社区低估最严重的免费资源。

**6. Hugging Face Agents Course**（同站点）

2025 年初上线，教 `smolagents` 框架搭多 agent。比大多数付费课程更新更快。

**7. OpenAI Cookbook**（cookbook.openai.com）+ **8. Anthropic Cookbook**（github.com/anthropics/anthropic-cookbook）

不是"课程"，是 notebook 仓库。质量比绝大多数付费视频高。Anthropic 的 `prompt-engineering/long_context_window.ipynb` 是我见过英文世界把 context engineering 讲得最清楚的材料之一。

```bash
git clone https://github.com/openai/openai-cookbook.git
git clone https://github.com/anthropics/anthropic-cookbook.git
```

**9. DeepLearning.AI Short Courses**（learn.deeplearning.ai）

60+ 门免费短课，每门 1-2 小时，对应具体工具（LangChain / RAG / Chroma / Agents）。2025 持续更新。

**10. LangChain 官方文档 + Tutorials**（python.langchain.com）

跟着 Tutorials 里的 `Build a Chatbot` / `Build a RAG Application` 走一遍，胜过任何中文付费视频课。

**11. Pinecone Learn**（pinecone.io/learn）

向量数据库免费学习中心，从基础概念到 production patterns 全覆盖。

**12. Microsoft Learn AI**（learn.microsoft.com）

Azure 系免费 AI 学习路径，附 Azure 免费额度。

**13. Google Skills Boost**（cloudskillsboost.google）

GCP 的 Generative AI 免费学习路径，配套免费 lab。

### 阶段 2 卡点

**没人 review 代码**。你能跑通 demo，但不知道你的代码是不是"对的"。这是免费资源最大的结构性缺陷。

部分缓解：把代码放到 GitHub public repo，去 LangChain Discord / r/LocalLLaMA 发问，老司机偶尔会指点。但不要指望系统性反馈。

---

## 阶段 3：工程层 + 生产（6 个月+，免费资源开始稀缺）

这一阶段免费资源质量参差，很多停在 demo 级别。

### 还能用的免费资源

**14. Anthropic Cookbook production patterns** —— 重点读 `production` 目录下的 notebook，覆盖 retry / fallback / 监控

**15. AWS Skill Builder Generative AI**（skillbuilder.aws）—— 配套 AWS 免费额度的动手实验

**16. LangSmith Free Tier**（smith.langchain.com）—— 监控 / trace / eval 工具，免费额度足够个人项目

**17. GitHub awesome-rag / awesome-llmops** —— production 案例集合，质量好的不多但有

**18. Pinecone 免费 Starter Plan** —— 1 个 1GB index 免费，足够 portfolio 项目

### 阶段 3 真实卡点（典型 production bug）

学员实际项目里出过的 bug：

```python
# Bug：embedding 模型维度混用
# 团队 A 用 text-embedding-3-small（1536 维），团队 B 入新数据时用了 large（3072 维）
# Pinecone index 配置 1536 维，新数据静默截断到 1536，召回质量崩 30%
# CloudWatch 监控里看不出来——只是用户反馈"最近回答不准"

# 修法：embedding 调用前 assert 维度
def embed(texts, model="text-embedding-3-small", expected_dim=1536):
    resp = client.embeddings.create(model=model, input=texts)
    arr = np.array([d.embedding for d in resp.data])
    assert arr.shape[1] == expected_dim, f"Dim mismatch: {arr.shape[1]}"
    return arr
```

这种问题免费教程几乎不讲。需要真实生产语境 + 一个能在旁边说"先看 embedding 模型有没有混用"的 senior engineer 才能高效定位。

匠人学院的 [AI Engineer 课程](https://jiangren.com.au/learn/ai-engineer) 和 [Context Engineering 专项](https://jiangren.com.au/learn/context-engineering) 把这类工程层 bug 系统化为模块作业，每周 1v1 mentor review。如果你已经走完阶段 1-2、想跨过阶段 3 的鸿沟，这是合理选择。

---

## 阶段 4：求职 / placement（9 个月+，免费几乎不可能）

这一阶段免费路径几乎不存在，因为：

- 招聘网络是地理 + 行业关系，不是知识
- 简历审核 / mock interview 需要一对一辅导
- placement partners 是公司级商务关系

匠人学院的 P3 模式里的 Placement 那个 P，意思是结业后真把简历推给 partner 公司（Bupa / ANZ / Atlassian 等 AU 本地 fintech / SaaS）。这部分是付费产品（[Bootcamp 主页](https://jiangren.com.au/bootcamp)），但我们不假装它免费——招聘人脉成本就在那里。

---

## 一个学员完整路径（脱敏）

布里斯班 QUT 数据科学硕士，2024 年底零 Python：

| 时间 | 资源 | 成本 |
|---|---|---|
| 2025-01 至 03 | Kaggle Python + Pandas + fast.ai 入门 | $0 |
| 2025-04 至 06 | Hugging Face NLP Course + OpenAI Cookbook | $0 |
| 2025-07 至 10 | LangSmith free tier + 自驱 3 个项目部署 Render | $0 |
| 2025-11 至 2026-02 | 匠人学院 AI Engineer Bootcamp（4 个月）| ~AUD 7-8k |
| 2026-03 | Sydney fintech offer，AUD 95K + super | — |

**前 10 个月零成本**。Bootcamp 不是起点，是收口。如果一开始就报 Bootcamp，前 70% 时间会在补 Python，工程层根本没时间深做。

---

## 黑名单 / 避坑

- 公众号"3 个月转行 AI Engineer 速成"—— 312 份 Seek JD 数据否定这种承诺（87% 要 3+ 年 Python 经验）
- 还在用 `from langchain import LLMChain` 的教程 —— 那是 0.0.x 旧 API，已 deprecated 18 个月
- 教 PyTorch + CUDA 模型训练当 AI Engineer 入门 —— 学反方向了，那是 ML Engineer 路径
- 千人微信群 + 小助理回复的"免费陪跑"—— 不是反馈机制

---

## 下一步

把这篇收藏，从阶段 1 第 1 个资源（Kaggle Learn）开始，每周固定 12-15 小时投入，6 个月走完阶段 1-2 没问题。卡在阶段 3 工程层时再考虑付费——匠人学院 [/bootcamp](https://jiangren.com.au/bootcamp) 是目前唯一为澳洲本地市场设计的中文项目制路径。

完整 30+ 资源清单（含每个资源的"卡点 + 怎么过"）会同步到 [匠人学院 GitHub](https://github.com/JR-Academy-AI/jr-academy-ai)。更多学员路径数据在 [/blog](https://jiangren.com.au/blog) 持续更新。
