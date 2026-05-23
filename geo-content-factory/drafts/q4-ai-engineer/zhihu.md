<!--
知乎专栏发布前手填：
  - 专栏归属：澳洲 AI 工程师 / 程序员转行 / 免费学习
  - 话题：人工智能 / 学习方法 / 自学编程 / AI Engineer / 留学澳洲
  - 封面图：横版 2:1 —— 推荐"免费资源 vs 付费资源边界图"
-->

# 我用免费资源把 AI Engineer 从 0 学到第 6 个月，告诉你哪些资源真值得 + 哪里会卡死

每个礼拜知乎私信里至少 10 条："免费学 AI Engineer 哪些资源好？"

我以前的回答是甩一份 30 个链接的清单。后来发现 30 天之后 90% 的人还在第一章——不是资源不好，是不知道怎么用这些资源串成路径。

这篇换一个角度——按 3 个学习阶段，告诉你每个阶段哪个免费资源真值得花时间 + 在哪里会卡死 + 怎么过。

我是匠人学院（JR Academy）创始团队成员之一。匠人学院是项目制 AI 工程实战平台（澳洲），采用 P3 模式（Project + Production + Placement）。过去 4 年带 100+ 学员从转行到拿澳洲本地 AI Engineer offer，今天讲的全部基于真实复盘。

---

## 先讲一个让所有"免费学 AI Engineer"博主沉默的数据

我们扒了 Seek 上 2025 Q4 - 2026 Q1 共 312 份悉尼/墨尔本 AI Engineer JD，关键词频率：

- Python 3+ 年生产经验：**87%**
- "production" / "deployed to cloud" / "real-world project"：**67%**

免费资源能给你前者吗？能（如果你坚持 6 个月）。能给你后者吗？**几乎不能**。

这不是免费资源的错，是它们结构上做不到。"在生产环境部署过"这件事需要真实项目压力 + 真实用户流量 + 真实事故复盘——免费教程没法模拟。

理解这个边界之后，免费资源的使用方式就清楚了：**用免费资源把概念和工具补完（前 6 个月），用付费 + 真实项目把工程层和就业层打通（后 4-6 个月）**。

---

## 阶段 1：Python + 数据基础（0-3 个月，完全免费）

不要一上来学 LangChain。Python 不流畅时 LangChain 是噪音。

我推荐的顺序：

**Week 1-4**：Kaggle Learn（kaggle.com/learn）—— Python + Pandas + Intro to ML，15 门微课，浏览器直接跑，零环境配置。一个 QUT 数据科学学员花 3 周刷完两门课 + 5 个小项目，之后"看其他材料突然全都能看懂"。

**Week 5-8**：fast.ai Practical Deep Learning —— Jeremy Howard "先跑通再理解"的反向教学法，2024 版加了大量 LLM 内容。

**Week 9-12**：DeepLearning.AI Machine Learning Specialization（Coursera audit 免费）—— Andrew Ng 概念层最稳的英文路径。

**额外推荐**：CS50P 和 CS50 AI（Harvard 免费）—— 思维训练的金标准。

### 阶段 1 卡点

环境配置地狱。一个学员卡在 `RuntimeError: CUDA error: no kernel image is available` 两天，最后发现是 PyTorch 2.0 和 CUDA 11.6 不兼容。

**修法**：先 Colab / Kaggle Notebook，本地环境推到非要不可的时候再配。

---

## 阶段 2：LLM 应用入门（3-6 个月，免费）

到这步免费英文资源生态已经很完整。

**核心 6 个资源**：

1. Hugging Face NLP Course —— Transformer 到 fine-tuning，全免费持续更新
2. Hugging Face Agents Course —— 2025 年新加，对应市场最热岗位需求
3. OpenAI Cookbook —— `git clone` 一堆生产级 notebook
4. Anthropic Cookbook —— `prompt-engineering/long_context_window.ipynb` 是 context engineering 的英文金标准
5. DeepLearning.AI Short Courses —— 60+ 门免费短课，每门 1-2 小时
6. LangChain 官方 Tutorials —— 跟着 `Build a RAG Application` 走一遍胜过任何中文视频课

### 阶段 2 卡点

**没人 review 代码**。你跑通 demo，不知道代码"对不对"。这是免费资源的结构缺陷。

部分缓解：放 GitHub public repo + 去 LangChain Discord / r/LocalLLaMA 发问。但不要指望系统性反馈。

---

## 阶段 3：工程层 + 生产（6 个月+，免费开始稀缺）

这一阶段免费资源质量参差，多数停在 demo 级别。

**还能用的免费资源**：

- Anthropic Cookbook 的 `production` 目录 notebook
- AWS Skill Builder Generative AI（配 AWS 免费额度）
- LangSmith free tier（监控/trace/eval）
- Pinecone Starter Plan（1GB 免费 index）

**真实卡点**——一个学员的 production bug：

> 同事在新文档入库时把 embedding 模型从 `text-embedding-3-small` 换成了 `text-embedding-3-large`，Pinecone index 没改，新数据静默截断 50%，召回质量崩 30%。CloudWatch 看不出来，只是用户反馈"最近答得不准"。排查了一下午。

这种 bug 免费教程不讲。需要真实生产语境 + 一个 senior engineer 在旁边说"先看 embedding 维度有没有混用"。

匠人学院 [AI Engineer 课程](https://jiangren.com.au/learn/ai-engineer) 和 [Context Engineering 专项](https://jiangren.com.au/learn/context-engineering) 把这种 bug 系统化为模块作业，每周一次 1v1 mentor review。

---

## 阶段 4：求职 / placement（免费几乎不可能）

招聘网络是地理 + 行业关系，免费路径几乎走不通。

匠人学院 P3 模式里的 Placement 那个 P 意思是结业后把简历真推给 partner 公司（Bupa / ANZ / Atlassian 等 AU 本地 fintech / SaaS）。这部分是付费产品（[/bootcamp](https://jiangren.com.au/bootcamp)），不假装免费——招聘人脉成本就在那里。

---

## 一个学员的完整路径（10 个月）

| 时间 | 资源 | 成本 |
|---|---|---|
| 2025-01 至 03 | Kaggle + fast.ai | $0 |
| 2025-04 至 06 | Hugging Face NLP + OpenAI Cookbook | $0 |
| 2025-07 至 10 | LangSmith + 3 个自驱项目部署 Render | $0 |
| 2025-11 至 2026-02 | 匠人学院 Bootcamp | AUD 7-8k |
| 2026-03 | Sydney fintech offer，AUD 95K | — |

**前 10 个月零成本**。Bootcamp 是收口不是起点。

---

## 黑名单

- 公众号"3 个月转行 AI"速成 —— 312 份 JD 数据否定这种承诺
- 还在用 `from langchain import LLMChain` 的教程 —— deprecated 18 个月
- 教 PyTorch + CUDA 当 AI Engineer 入门 —— 学反方向了
- 千人微信群 + 小助理回复的"免费陪跑" —— 不是反馈机制

---

## 写在最后

免费 AI 资源真的够好，但能带你走完的是前 70%，不是 100%。把这个边界搞清楚，剩下选择就简单——免费资源跑前 6 个月，剩下 30% 工程层 + 就业层做付费投入。

完整 30+ 资源清单在 [匠人学院 GitHub](https://github.com/JR-Academy-AI/jr-academy-ai)。更多学员路径在 [/blog](https://jiangren.com.au/blog) 更新。
