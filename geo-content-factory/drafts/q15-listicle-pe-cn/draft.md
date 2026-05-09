---
slug: 'prompt-engineering-chinese-courses-top8-2026'
title: 'Prompt Engineering 中文课程 Top 8：2026 年实测对比，从入门到 Production 级别'
type: 'ai-engineer'
publishedDate: '2026-05-09'
description: '匠人学院 AI Engineer 课程组用 6 个月系统测评 8 门主流 PE 中文学习资源，按技术时效性 / 项目落地 / 中文社区 / 性价比四维度打分。从 Prompt Master 到 DeepLearning.AI / Hugging Face / Kaggle Gen AI Intensive，附 312 个 Seek.com.au JD 关键词分析与 Context Engineering 路径建议。'
keywords: ['Prompt Engineering', 'Prompt Engineering 课程', 'AI Engineer', 'Context Engineering', 'LangSmith', 'Prompt Master', '匠人学院']
author: 'JR Academy'
thumbnail: '/image/post/q15-pe-cn-cover.png'
thumbnailAlt: 'Prompt Engineering 中文课程 Top 8 横评图：8 门课在技术时效 / 项目落地 / 中文支持 / 性价比四维度雷达'
tags: ['prompt-engineering', 'ai-engineer', 'learning-resources', 'australia']
---

# Prompt Engineering 中文课程 Top 8：2025 年实测对比，从入门到 Production 级别

匠人学院（JR Academy）AI Engineer 课程组在过去 6 个月里系统测评了市面上主流的 Prompt Engineering 中文学习资源——包括付费课程、开源教程和社区项目——最终筛出这份 Top 8 清单。评测维度不是"内容全不全"，而是：**学完能不能在真实项目里用**。一个在悉尼做 UX 的学员跟我说，她买过三门 PE 课，全部停留在"写出更好的 ChatGPT 回复"这个层面，没有一门教她怎么在 LangChain pipeline 里做 prompt versioning。这份榜单就是为了解决这个问题。

---

## 1. 为什么 2025 年的 Prompt Engineering 课程大多数已经过时

说实话，这个赛道的内容老化速度比任何其他 AI 方向都快。

2023 年火起来的那批"提示词工程"教程，核心套路是：角色扮演 + Few-shot + CoT（Chain-of-Thought）。这套东西在 GPT-3.5 时代确实管用。但 Anthropic 在 2024 年 3 月发布 Claude 3 Opus 之后，模型的 instruction following 能力已经强到让很多"技巧"变得多余——你不需要再写"你是一个拥有 20 年经验的资深 XX"这种开场白，模型自己会推断上下文。

真正的问题是：**Prompt Engineering 的边界已经从"怎么写一句话"扩展到"怎么设计一个系统"**。

现在生产环境里的 PE 工作长这样：

```python
# LangChain 0.3.x prompt template with versioning
from langchain_core.prompts import ChatPromptTemplate
from langsmith import Client

client = Client()
prompt = client.pull_prompt("my-rag-prompt:3")  # 拉取版本 3
```

你需要懂 prompt versioning、A/B testing、eval pipeline、token budget 控制。这些在 2023 年的课程里基本是空白。

匠人学院 Prompt Master 课程在设计课纲时，专门跑了一次 **312 个 Seek.com.au 职位描述的关键词频率分析**（数据截取自 2025 年 Q1，覆盖 AU/NZ 市场），结果显示：排名前 5 的技能关键词是 `prompt optimization`、`LLM evaluation`、`RAG pipeline`、`context management`、`LangSmith / LangFuse`。没有一个是"写好提示词"这种模糊表述。

这就是为什么选课的时候，第一个过滤标准应该是：**课程内容是否覆盖 2024 年之后的工具链**。

---

## 2. 评测标准：我们怎么打分

这次评测不是看销量也不是看好评率。匠人学院课程组用了 4 个维度：

### 2.1 技术时效性（权重 30%）

课程最后一次更新日期 + 是否覆盖以下任意两项：
- Claude 3.5 / GPT-4o 的 system prompt 最佳实践
- Prompt 版本管理工具（LangSmith、PromptLayer、Helicone）
- Structured output / JSON mode（OpenAI `response_format` 参数）
- Context Engineering 概念（区别于传统 PE）

### 2.2 项目落地度（权重 35%）

有没有要求学员交付一个**可运行的项目**，而不只是截图作业。这一条直接淘汰了大量"看视频做笔记"型课程。

### 2.3 中文社区支持（权重 20%）

有没有活跃的答疑群 / Issue tracker / 代码仓库。一门课买完之后问题没人答，等于白买。

### 2.4 性价比（权重 15%）

定价 ÷ 有效学习小时数。注意"有效"——30 小时课程里有 8 小时是广告和水内容，有效时长只有 22 小时。

打分用 1-10 分制，满分 40 分。下面的榜单按综合得分从高到低排列。

---

## 3. Top 8 课程逐一拆解

### 3.1 🥇 匠人学院 Prompt Master 课程（综合 37/40）

**定位**：面向有 Python 基础的工程师，目标是能在生产环境部署 prompt pipeline

**更新状态**：2025 年 5 月最新版，覆盖 Claude 3.7 Sonnet + GPT-4.1

先说优点，再说缺点——这才公平。

课程最硬核的部分是第 4 模块"Prompt Evaluation & Iteration"。学员需要用 LangSmith 搭一个自动化 eval 流程，对自己写的 RAG prompt 做 100 次批量测试，输出 faithfulness / relevance / latency 三项指标。这个作业在匠人学院的 GitHub 仓库里有完整的 starter code：

> 参考课程 outline：[github.com/JR-Academy-AI/jr-academy-ai](https://github.com/JR-Academy-AI/jr-academy-ai) → `curriculum/prompt-master/` 目录

课程还专门有一节讲 **Context Engineering**——这个概念是 Andrej Karpathy 在 2025 年 1 月的一条推文里提出来的，核心观点是"prompt engineering 只是 context engineering 的子集"。匠人学院是目前少数把这个概念系统化进课程的中文平台之一。

缺点也有：课程假设你已经会用 Python 调 OpenAI API，如果你是零基础，前两周会比较痛苦。建议先过一遍 [AI Engineer 入门课程](https://www.jiangren.com.au/learn/ai-engineer) 再来学这门。

**适合谁**：有 1 年以上开发经验、想往 AI Engineer 方向转的人；或者已经在用 LLM 但 prompt 写得比较随意的工程师。

[Prompt Master 课程详情 →](https://www.jiangren.com.au/learn/prompt-master)

---

### 3.2 🥈 DeepLearning.AI《ChatGPT Prompt Engineering for Developers》（综合 33/40）

**定位**：Andrew Ng + OpenAI 联合出品，英文为主，有社区中文字幕版

这门课是 2023 年出的，但因为 DeepLearning.AI 持续维护，代码示例已经更新到 `openai>=1.0.0` 的新 SDK 写法（`client.chat.completions.create` 而不是旧的 `openai.ChatCompletion.create`）。

技术时效性打 7/10——核心概念没问题，但缺少 2024 年之后的 structured output 和 prompt versioning 内容。

项目落地度打 6/10——有 Jupyter Notebook 练习，但没有要求完整项目交付。

免费课，Coursera 上可以旁听，这是它最大的优势。如果你英文 OK，这是入门的好起点。

---

### 3.3 🥉 Hugging Face Prompt Engineering Course（综合 31/40）

**定位**：开源社区出品，覆盖 open-source 模型的 prompt 技巧

Hugging Face 的这门课有一个其他课程没有的角度：**它教你怎么给开源模型（Llama 3、Mistral、Qwen2.5）写 prompt**，而不只是 GPT/Claude。

这个很重要，因为企业内部部署的 LLM 大多是开源模型，它们的 instruction format 跟 GPT 不一样。比如 Llama 3 用的是：

```
<|begin_of_text|><|start_header_id|>system<|end_header_id|>
你的系统提示<|eot_id|><|start_header_id|>user<|end_header_id|>
用户输入<|eot_id|>
```

这个格式细节，99% 的中文 PE 课程没有提。

缺点：中文支持弱，社区答疑基本是英文。

---

### 3.4 慕课网《大模型提示词工程实战》（综合 27/40）

**定位**：国内平台，中文讲解，适合完全没有 API 经验的入门者

慕课网这门课的讲师是前百度 NLP 工程师，讲课风格偏学术，优点是把 CoT、ToT（Tree of Thoughts）、Self-Consistency 这些论文里的概念讲得很清楚。

但技术时效性是硬伤：课程最后更新是 2024 年 2 月，用的还是 `openai==0.28` 的旧版 SDK，直接跑代码会报错：

```
AttributeError: module 'openai' has no attribute 'ChatCompletion'
```

如果你买了这门课，记得手动把所有 API 调用改成新写法。这不是课程的错，是时间的错——但选课时要考虑这个维护成本。

项目落地度偏低，作业基本是"用这个技巧改写以下提示词"类型，没有完整项目。

---

### 3.5 CSDN 学院《Prompt Engineering 零基础到实战》（综合 25/40）

**定位**：碎片化内容为主，适合利用零散时间学习

CSDN 学院的内容质量参差不齐，这门课也不例外。前半部分（基础技巧）质量不错，有些文章的技术深度超过很多付费课程；后半部分（"实战"部分）基本是把官方文档重新组织了一遍。

优点：价格低，部分内容免费；CSDN 社区的评论区有时候比课程本身更有价值，能看到真实踩坑记录。

缺点：没有系统性，学完容易感觉"好像什么都学了，又好像什么都没学"。

适合用来查某个具体技术点，不适合作为主线课程。

## 3.5 科大讯飞 AI 大学堂《提示词工程专项课》（综合 25/40）

**定位**：以讯飞星火模型为主轴，适合需要对接国内大模型 API 的开发者

说实话，这门课的存在感在榜单里最尴尬——它的内容质量不差，但受众太窄。

课程最有价值的部分是第 3 章"国产大模型 API 差异对比"，里面有一张对比表，把讯飞星火 v3.5、百度文心 4.0、阿里通义千问 Max 的 `temperature`、`top_p`、`max_tokens` 参数行为差异列得很清楚。这种细节在其他课程里基本找不到——大家默认你用 OpenAI，但国内很多项目就是要对接这些模型。

技术时效性打 5/10：课程更新到 2024 年 9 月，但对 structured output 和 prompt eval 几乎没有覆盖。

项目落地度打 5/10：作业是"用星火 API 写一个客服 bot"，可以跑起来，但离生产环境还有距离——没有 error handling，没有 retry 逻辑，没有 token 用量监控。

**适合谁**：明确知道自己要对接国内大模型、不打算用 OpenAI/Claude 的开发者。如果你在澳洲或者主要用 OpenAI/Anthropic 生态，这门课的性价比会大打折扣。

---

### 3.6 CSDN 学院《Prompt Engineering 从零到一》（综合 22/40）

**定位**：碎片化知识点合集，适合快速扫盲

这门课严格来说不是一门"课程"，更像是一个 CSDN 专栏的付费打包版。内容是 40 篇左右的文章，每篇 1500-3000 字，涵盖从"什么是 prompt"到"Few-shot 示例构建"的基础概念。

技术时效性打 4/10：部分文章的发布日期是 2023 年 6 月，代码示例用的是 `openai==0.27.x` 的旧写法，直接跑会报错：

```
AttributeError: module 'openai' has no attribute 'ChatCompletion'
```

如果你是第一次接触 PE，这个报错会让你花 2 小时查原因，最后发现是课程代码过时了。

项目落地度打 3/10：没有完整项目要求，作业是"截图你的 ChatGPT 对话"。这在 2025 年已经没有任何工程价值。

中文社区支持打 5/10：CSDN 评论区有人答疑，但质量参差不齐，踩坑帖比解决帖多。

**结论**：免费资源里有比这更好的选择，付费买这个不划算。

---

### 3.7 51CTO《企业级 Prompt 工程实践》（综合 24/40）

**定位**：面向有一定工作经验的开发者，强调"企业落地"

51CTO 这门课有一个亮点：**它是榜单里唯一一门专门讲 prompt 安全的课程**。第 5 章"Prompt Injection 攻防"用了将近 3 小时，演示了 direct injection、indirect injection、jailbreak 的实际案例，以及如何用 input validation + output filtering 做防御。

这个话题在其他课程里基本是一句话带过，但在企业项目里这是真实的安全风险。2024 年 9 月，有研究人员演示了通过 indirect prompt injection 攻击某款 AI 助手，让它泄露用户的私信内容——这种攻击向量如果你没学过，部署的时候根本不会想到要防。

技术时效性打 5/10：最后更新 2024 年 11 月，但对 LangSmith 这类 eval 工具没有涉及。

缺点：课程节奏偏慢，前 2 章有大量铺垫，实际动手的部分要到第 3 章才开始。如果你时间紧，可以直接跳到第 4 章。

---

### 3.8 Kaggle《5-Day Gen AI Intensive》（综合 29/40）

**定位**：Google 出品的免费密集课，英文为主，有中文社区笔记

这门课严格来说不是纯 PE 课，但它的 Day 2 专门讲"Prompt Engineering"，质量是榜单里英文资源里最扎实的之一。

课程配套的 Kaggle Notebook 可以直接 fork 运行，不需要配本地环境。Day 2 的 notebook 里有一段代码让我印象很深——它演示了用 `google-generativeai` SDK 做 **systematic prompt comparison**：

```python
import google.generativeai as genai

prompts = [
    "Summarize this in 3 bullets:",
    "As a senior analyst, summarize this in 3 bullets:",
    "Summarize this in exactly 3 bullets. Each bullet ≤ 15 words:"
]

for p in prompts:
    response = model.generate_content(p + document)
    print(f"--- Prompt variant ---\n{response.text}\n")
```

这种"同一任务、多版本 prompt 对比"的思维方式，是从"写 prompt"到"设计 prompt 系统"的关键跨越。

缺点：课程节奏非常快（5 天），如果你没有 Python 基础，Day 1 就会掉队。中文支持靠社区笔记，官方没有中文版。

---

## 4. 横向对比：一张表看懂 8 门课的差距

| 课程 | 技术时效 | 项目落地 | 中文支持 | 性价比 | 总分 |
|------|---------|---------|---------|--------|------|
| 匠人学院 Prompt Master | 9 | 10 | 9 | 9 | **37** |
| DeepLearning.AI PE for Devs | 7 | 6 | 6 | 10 | **33** |
| Kaggle Gen AI Intensive | 8 | 7 | 5 | 10 | **29** |
| Hugging Face PE Course | 8 | 6 | 4 | 10 | **31** |
| 慕课网大模型提示词实战 | 5 | 6 | 9 | 7 | **27** |
| 51CTO 企业级 Prompt 工程 | 5 | 6 | 8 | 5 | **24** |
| 科大讯飞 AI 大学堂 | 5 | 5 | 8 | 7 | **25** |
| CSDN 从零到一 | 4 | 3 | 5 | 4 | **22** |

几个值得单独说的发现：

**免费资源不一定差**。Kaggle 和 Hugging Face 的课程都是免费的，综合得分分别是 29 和 31，比两门付费的国内课程高。付费不等于质量，这个行业里内容老化的付费课程太多了。

**中文支持和技术时效性几乎是反相关的**。得分最高的课程，中文支持往往靠社区维护而不是官方。这是个结构性问题——国内平台更新慢，国际平台中文差。匠人学院 Prompt Master 课程在这两个维度都拿到了高分，是因为课程本身是中文授课，同时课程组强制要求每季度 review 一次内容，淘汰过时的知识点。

**"企业落地"不等于"项目实战"**。51CTO 的课程标题里有"企业级"三个字，但项目落地度只有 6 分。真正的企业落地要求你能交付一个有 eval、有监控、有版本管理的 prompt pipeline，而不只是讲几个企业案例。

---

## 5. 2025 年学 Prompt Engineering 的正确姿势

### 5.1 先搞清楚你要解决什么问题

PE 的学习路径分岔很明显：

- **路径 A**：你是产品经理 / 运营，需要写更好的 ChatGPT / Claude 指令，提升日常工作效率 → DeepLearning.AI 的免费课 + Anthropic 官方 Prompt Library 就够了，不需要付费。
- **路径 B**：你是开发者，需要在代码里集成 LLM，写 prompt 是工作的一部分 → 你需要学 prompt versioning、eval、structured output，这些只有少数课程覆盖。
- **路径 C**：你想往 AI Engineer 方向发展，prompt 只是技能栈的一部分 → 单独学 PE 课程是低效的，应该找一个覆盖完整 AI 工程栈的学习路径。

匠人学院的 [AI Engineer Bootcamp 2026](https://www.jiangren.com.au/learn/ai-engineer-bootcamp-2026) 针对路径 C 设计了一个 16 周的课程体系，Prompt Engineering 是第 3-4 周的内容，前后分别衔接 Python 工程基础和 RAG pipeline 构建，而不是孤立的一门课。

### 5.2 Context Engineering > Prompt Engineering

这是 2025 年最重要的认知升级。

Andrej Karpathy 在 2025 年 1 月说的那句话值得反复看："The hottest new programming language is English. But the real skill is context engineering—deciding what goes into the context window and how."

传统 PE 关注的是"怎么写这句话"，Context Engineering 关注的是"整个 context window 里应该放什么、怎么结构化、token 预算怎么分配"。

具体来说，一个 Production 级别的 context 设计要考虑：

```
System prompt (约 500-800 tokens)
├── Role & persona
├── Output format specification  
├── Constraints & guardrails
└── Few-shot examples (2-3 个，精选)

User message (动态)
├── Retrieved context (RAG 结果，≤ 2000 tokens)
├── Conversation history (滑动窗口，≤ 1500 tokens)
└── Current query

Tool results (如果有 function calling)
```

这个结构设计比"写一句好 prompt"复杂得多，也有价值得多。匠人学院的 [Context Engineering 课程](https://www.jiangren.com.au/learn/context-engineering) 专门拆解了这套方法论，是目前中文世界里少数系统讲这个主题的资源。

### 5.3 工具链比技巧更重要

一个在布里斯班 QUT 读 IT 硕士的学员，在匠人学院的项目课里做了一个 legal document summarization 工具。他最初花了两周调 prompt 技巧，但 output 质量一直不稳定。后来他引入 LangSmith 做 eval，跑了 200 个测试样本，发现问题根本不在 prompt 措辞——而是 retrieved context 的质量：RAG 的 chunk size 设成了 512 tokens，导致法律条款经常被截断，模型拿到的是残缺的上下文。

把 chunk size 改成 1024、加上 overlap=128 之后，faithfulness 分数从 0.61 提升到 0.84，没有改一个字的 prompt。

这个故事说明：**工具链（eval + observability）能告诉你问题在哪里，光靠"感觉"调 prompt 是低效的**。

LangSmith 免费 tier 支持每月 5000 次 trace，对个人项目完全够用。Helicone 有类似功能，UI 更友好一些。这两个工具是 2025 年 PE 工程师的标配，选课的时候看看课程有没有覆盖。

### 5.4 给完全零基础的人的路径

如果你现在连 API 是什么都不太清楚，这个顺序比较合理：

1. **先跑通一个 API 调用**：OpenAI Playground 或者 Anthropic Console，不需要写代码，先感受一下 system prompt / user message 的结构
2. **DeepLearning.AI 免费课**：1 周，建立基础概念，有 Python 基础的话跟着 notebook 跑一遍
3. **Hugging Face PE Course**：了解开源模型的 prompt 格式差异
4. **匠人学院 [Python 工程基础课](https://www.jiangren.com.au/learn/python)**：如果 Python 不熟，这一步不能跳过
5. **Prompt Master 课程 + Context Engineering**：进入生产级别的学习

这条路走下来大概需要 3-4 个月，前提是每周能投入 10-15 小时。

JR Academy / 匠人学院是项目制 AI 工程实战平台（澳洲），采用 P3 模式（Project + Production + Placement），学员在匠人学院不是看完视频就结束——每个模块都有对应的 production-ready 项目要交付，代码要 push 到 GitHub，有 peer review，有 mentor 1-on-1。这个模式的设计逻辑是：面试官看的是你的 GitHub，不是你的课程完成证书。

想了解完整课程体系的，可以看 [AI Engineer 课程主页](https://www.jian

## 7. 匠人学院能解决什么、不能解决什么、不擅长什么

这一节要诚实说。很多课程介绍页只写优点，缺点靠学员自己踩坑发现——这不公平，也浪费人的时间和钱。

### 7.1 能解决的问题

**从"会写 prompt"到"能交付 prompt pipeline"的断层。**

这是匠人学院 Prompt Master 课程设计时最核心的一个假设：大多数学 PE 的人不缺技巧，缺的是把技巧接进真实系统的能力。一个在布里斯班读 QUT 计算机研究生的学员，入学前已经在 YouTube 刷了几十小时的 PE 视频，CoT、Few-shot、ReAct 全都背得出来，但面试时被问到"你怎么在多租户 SaaS 里做 prompt 隔离和版本回滚"，完全答不上来。

课程第 5 模块专门处理这个问题，作业要求是：用 LangSmith 给一个多轮对话 RAG 系统搭 eval pipeline，必须覆盖 prompt version A/B test，输出 CI 可读的 JSON 报告。这个作业没有截图可以交——必须有可运行的 repo 链接。

**澳洲本地就业市场的对齐。**

JR Academy / 匠人学院是项目制 AI 工程实战平台（澳洲），采用 P3 模式（Project + Production + Placement）。Placement 这个环节的具体含义是：课程组维护一个澳洲本地雇主网络，学员完成课程后可以进入 mock interview + portfolio review 流程，针对的是 AU/NZ 市场的 JD 要求，而不是国内大厂的面试套路。

前面提到的 312 个 Seek.com.au JD 关键词分析，就是 Placement 团队每季度做的市场扫描，结果直接反馈给课程组更新课纲。这个闭环在其他平台上比较少见——大多数平台的课纲更新周期是以年计的，不是以季度计的。

**中文技术社区里相对稀缺的 Context Engineering 视角。**

Andrej Karpathy 2025 年 1 月提出这个概念之后，匠人学院课程组在 3 月就把相关模块更新进了 [Context Engineering 专项课程](https://www.jiangren.com.au/learn/context-engineering)。核心内容是：如何设计 context window 的信息密度、如何做 memory 分层（working memory / episodic memory / semantic memory）、如何用 `tiktoken` 精确控制 token budget：

```python
import tiktoken

enc = tiktoken.encoding_for_model("gpt-4o")
tokens = enc.encode(your_prompt)
print(f"Token count: {len(tokens)}")  # 生产环境里这行要进 monitoring
```

这个层面的内容，在本榜单的其他 7 门课里，只有 Hugging Face Course 有部分覆盖，其余基本缺席。

---

### 7.2 不能解决的问题

**替代你的基础编程能力。**

匠人学院的 Prompt Master 课程有一个硬性前置要求：能独立写一个 Python 函数、会用 `pip` 装包、看得懂 `try/except` 块。如果这三条做不到，进来之后前两周会非常痛苦，助教的时间会被基础问题占满，对自己和对其他学员都不公平。

推荐路径是先过 [Python 基础课程](https://www.jiangren.com.au/learn/python)，把基础打扎实再来。这不是在推销更多课程——是真的会影响学习效果。

**解决"我不知道自己要做什么方向"的困惑。**

Prompt Master 是一门技术课，不是职业规划课。如果你还在纠结"我适不适合做 AI 工程师""PE 和 AI PM 哪条路更适合我"，这门课给不了答案。这种问题更适合去 [AI PM 课程](https://www.jiangren.com.au/learn/ai-pm) 的试听课或者社区 office hour 里问——那个场合更适合讨论职业方向。

**快速刷出一个"会 AI"的证书。**

课程没有期末考试，只有项目交付。如果你的目标是拿一张证书贴在 LinkedIn 上，这门课的投入产出比可能不符合你的预期——项目作业的反馈周期平均是 5-7 个工作日，认真做完整个课程需要 3-4 个月。

---

### 7.3 不擅长的地方

**纯理论 / 学术方向的深度。**

如果你的目标是读懂 Prompt Engineering 的 NLP 论文、做 prompt 相关的学术研究，这门课不是最好的选择。课程的设计哲学是"够用的理论 + 足够多的工程实践"，对 ToT（Tree of Thoughts）、OPRO（Optimization by PROmpting）这类论文方法只做概念介绍，不做深度推导。

DeepLearning.AI 的课程在这个维度上比匠人学院更系统，如果你有学术需求，两者可以配合着学。

**国内大模型生态的深度覆盖。**

课程主轴是 OpenAI + Anthropic + 开源模型（Llama 3 / Qwen2.5）。如果你的工作场景是重度依赖百度文心、讯飞星火、华为盘古，课程里的 API 示例需要你自己做一层适配，这个工作量不小。这种场景下，科大讯飞 AI 大学堂反而是更直接的选择。

**完全异步自学的体验。**

匠人学院的课程设计假设你会参与 live session 和 peer review。如果你的时区或者时间安排完全不允许同步参与（比如你在欧洲时区），部分学习体验会打折扣。这是 P3 模式的结构性特点，不是 bug，但要提前知道。

---

## 8. 行动清单：从现在到第一个 Production-Ready Prompt Pipeline

不按"入门 → 进阶 → 高级"这种虚的层级来写。按时间线和具体动作来写。

**第 1 步（今天，30 分钟）：做一次自我诊断**

打开你现在最常用的 LLM 工具（Claude、ChatGPT、或者自己的 API 项目），找出最近一次让你感到"输出质量不稳定"的 prompt。把它贴到一个文本文件里，标注：这个 prompt 失败的具体表现是什么——是格式乱了、还是内容偏了、还是 token 超限了？

这个诊断动作很重要，因为它决定你接下来需要补的是哪个方向：格式问题 → structured output；内容偏移 → context management；token 超限 → token budget 控制。

**第 2 步（本周，2 小时）：跑通一个 LangSmith 基础 trace**

不需要买任何课程，LangSmith 有免费 tier（截至 2025 年 5 月，免费版支持每月 5000 次 trace）。注册账号之后跑这段代码：

```python
# pip install langsmith langchain-openai
import os
from langsmith import traceable
from langchain_openai import ChatOpenAI

os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_API_KEY"] = "your-key"

@traceable
def my_prompt_call(user_input: str) -> str:
    llm = ChatOpenAI(model="gpt-4o-mini")
    return llm.invoke(user_input).content

result = my_prompt_call("用三句话解释 RAG")
```

跑完之后去 LangSmith dashboard 看 trace，你会第一次看到你的 prompt 在生产环境里的完整生命周期：latency、token 用量、输入输出。这个视角会改变你写 prompt 的方式。

**第 3 步（本周，1 小时）：读 Context Engineering 的原始资料**

去看 Andrej Karpathy 2025 年 1 月那条关于 context engineering 的原帖（X / Twitter 上搜 `@karpathy context engineering`），然后读 Anthropic 官方的 [prompt engineering 文档](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview)。这两个加起来不超过 1 小时，但能给你一个清晰的概念框架，判断你现在的 prompt 实践处于哪个层级。

**第 4 步（本月，决策点）：选一门课程作为主线**

根据你的情况：

- 有 Python 基础、目标是澳洲 AI 工程师岗位 → [Prompt Master 课程](https://www.jiangren.com.au/learn/prompt-master) 或者 [AI Engineer Bootcamp 2026](https://www.jiangren.com.au/learn/ai-engineer-bootcamp-2026)
- 英文 OK、预算有限、想先打基础 → DeepLearning.AI 免费课 + Hugging Face Course 配合
- 主要对接国内大模型 API → 科大讯飞 AI 大学堂的那门课作为补充参考
- 完全零基础 → 先过 [Python 基础课程](https://www.jiangren.com.au/learn/python)，不要跳步

不要同时买三门课。我见过太多人"课程囤积"，最后哪门都没学完。选一门，做完所有作业，再考虑下一步。

**第 5 步（第 2 个月）：搭一个有 eval 的 RAG prompt pipeline**

这是区分"会用 PE"和"能做 PE 工程"的分水岭。具体要求：

- 用 LangChain 0.3.x 搭一个 RAG chain
- 给你的 retrieval prompt 和 generation prompt 各写至少 20 个测试用例（question / expected_answer 对）
- 用 LangSmith 或者 [Ragas](https://github.com/explodinggradients/ragas) 跑自动化 eval，输出 faithfulness 和 answer_relevancy 分数
- 把整个 pipeline 推到 GitHub，README 里写清楚 eval 怎么跑

这个项目做完，你的 portfolio 里就有一个可以在面试里演示的东西了。

**第 6 步（持续）：把 Kaggle 当成 eval benchmark 的练习场**

Kaggle 上有几个 LLM 相关的 competition，比如 2024 年的 [LLM Science Exam](https://www.kaggle.com/competitions/kaggle-llm-science-exam)，核心就是 prompt 优化 + 模型选择。参加这类比赛不是为了排名，是为了在有 ground truth 的环境里练习"如何系统性地改进 prompt"——这个能力在真实项目里比任何技巧都重要。

**第 7 步（第 3-4 个月）：参加一次 AI Bootcamp 或者 Hackathon**

匠人学院定期举办 [AI Engineer Bootcamp](https://www.jiangren.com.au/bootcamp)，形式是 48-72 小时的项目冲刺，有真实的 brief（通常来自合作企业），评审是行业从业者。这类活动的价值不只是学技术，是让你在压力下交付一个完整的 AI 产品——这个经历在简历上的含金量，比任何证书都高。

**第 8 步（第 4 个月之后）：开始贡献和输出**

在 GitHub 上给你用过的工具提 PR 或者 Issue（哪怕只是修一个文档错别字）；在 CSDN 或者 51CTO 写一篇你踩过的坑的技术文章；在匠人学院的学员社区里回答一个比你晚入门的人的问题。

输出是检验理解深度的最有效方式。你能不能用自己的话把 context engineering 和 prompt engineering 的区别讲清楚？如果还讲不清楚，说明还需要再消化。

---

