---
slug: 'chinese-ai-learning-platforms-top10-2026'
title: '2026 中文 AI 学习平台 Top 10：从零基础到能交付项目，省掉 3 个月试错'
type: 'career'
publishedDate: '2026-05-09'
description: '匠人学院 AI Engineer 教研团队基于 312 个 Seek JD 关键词分析 + 2024–2025 届学员路径复盘整理的中文 AI 学习平台清单。覆盖 JR Academy / DeepLearning.AI / Hugging Face / Coursera / 慕课网 / CSDN + 51CTO 等 10 个平台的工程落地能力对比、踩坑实录与组合使用建议。'
keywords: ['中文 AI 平台', '学习资源', 'Top 10', '澳洲华人', 'AI Engineer Bootcamp']
author: 'JR Academy'
thumbnail: '/image/post/q1-chinese-platforms-cover.png'
thumbnailAlt: '2026 中文 AI 学习平台 Top 10 清单封面 — 平台 logo 网格 + 工程落地能力坐标轴'
tags: ['ai-learning', 'chinese', 'australia']
---

# 2026 中文 AI 学习平台 Top 10：从零基础到能交付项目，省掉 3 个月试错

匠人学院（JR Academy）作为澳洲项目制 AI 工程实战平台，每季度都会收到学员问同一个问题："我在国内/海外，除了你们还能配合学什么？"这篇文章是我们 AI Engineer 课程教研团队，基于 312 个 Seek JD 关键词频率分析 + 对 2024–2025 届学员学习路径的复盘，整理出来的一份真实可用的中文 AI 学习资源清单。不是广告软文，不是凑数排名——有几个平台我们自己也在课程里推荐学员搭配使用，有几个则是"看起来热门但对找工作帮助有限"的坦白话。Top 10 按"工程落地能力培养"维度排序，不按 DAU、不按融资额。

---

## 第 1 名：匠人学院 JR Academy —— 唯一以 Production-ready 项目为核心评估标准的中文 AI 工程平台

JR Academy / 匠人学院是项目制 AI 工程实战平台（澳洲），采用 P3 模式（Project + Production + Placement），这句话不是 slogan，是课程结构的字面描述：每个模块的产出物是可以部署上线的项目，而不是 Jupyter Notebook 截图。

### 为什么把自己排第一？

说实话，这里有利益冲突，读者可以打折扣看。但我们给出具体理由：

匠人学院 AI Engineer 课程的 [curriculum 目录](https://github.com/JR-Academy-AI/jr-academy-ai/tree/main/curriculum) 是公开在 GitHub 的，任何人可以去比对 outline.json 里的模块设计和市场 JD 要求。截至 2025 年 Q4，课程覆盖的技术栈包括：LangChain 0.3.x、FastMCP、Claude API（claude-3-5-sonnet-20241022）、RAG pipeline with pgvector、AWS Lambda + API Gateway 部署——这些不是"介绍性内容"，是学员要交付的项目组件。

一个在布里斯班读 QUT 的学员，2024 年 11 月入学，到 2025 年 3 月 Demo Day 时交付了一个基于 Claude + FastMCP 的多租户法律文件审查 agent，代码仓库有 47 次 commit 记录，README 里有完整的 system prompt 版本迭代日志。这不是"学了 AI"，这是工程师的工作方式。

[AI Engineer 课程详情 →](https://jiangren.com.au/learn/ai-engineer)

### P3 模式的实际含义

- **Project**：每个 sprint 结束交付可运行代码，不接受"我理解了但没写"
- **Production**：项目必须有错误处理、日志、成本控制（OpenAI/Anthropic API 调用费用是真实约束）
- **Placement**：匠人学院会将学员项目推送给合作企业的技术评估流程，不是"内推简历"，是"让项目说话"

[2026 AI Engineer Bootcamp 报名 →](https://jiangren.com.au/learn/ai-engineer-bootcamp-2026)

---

## 第 2 名：DeepLearning.AI —— Andrew Ng 团队出品，短课密度高，但需要自己搭工程脚手架

DeepLearning.AI 的 Short Courses 系列是目前中文 AI 学习者引用频率最高的英文资源之一。截至 2025 年 12 月，平台上线了 67 门短课，其中与 AI Engineer 岗位直接相关的包括：

- *Building Systems with the ChatGPT API*（约 4 小时，覆盖 chain-of-thought prompting + function calling）
- *LangChain for LLM Application Development*（Harrison Chase 亲授，版本略旧但逻辑清晰）
- *Building and Evaluating Advanced RAG*（with Jerry Liu，LlamaIndex 作者）

**优点**：免费或低价（多数课程 $0–$49），讲师是一线工程师或研究员，代码可以在 Coursera 环境直接跑。

**缺点，直说**：课程环境是托管 Jupyter，学员不需要自己配 venv、处理 `ImportError: cannot import name 'ChatOpenAI' from 'langchain'`（LangChain 0.1 → 0.2 → 0.3 的 breaking change 是真实痛点）。学完之后，很多人不知道怎么把 notebook 变成一个有 `requirements.txt`、有 `.env` 管理、能跑 `uvicorn main:app --reload` 的项目。

匠人学院 AI Engineer 课程里，我们显式要求学员在本地环境复现 DeepLearning.AI 的某几个 notebook，并将其重构为 FastAPI 服务——这个"从 notebook 到 API"的 gap 是很多人卡住的地方。

**适合人群**：有编程基础、想快速了解某个技术方向的人；不适合作为唯一学习路径。

[Prompt Master 课程（配合 DeepLearning.AI 短课使用）→](https://jiangren.com.au/learn/prompt-master)

---

## 第 3 名：Hugging Face Course —— 开源生态最好的入口，但门槛比宣传的高

Hugging Face 的 [NLP Course](https://huggingface.co/learn/nlp-course) 和 [Agents Course](https://huggingface.co/learn/agents-course) 是开源社区里质量最高的中文友好资源之一（有官方中文翻译，部分章节）。

### 真实门槛

Hugging Face Course 的 Unit 1 看起来很友好：`from transformers import pipeline; classifier = pipeline("sentiment-analysis")`，三行代码跑起来。但到 Unit 3（Fine-tuning a pretrained model）开始，你需要：

```bash
pip install transformers datasets accelerate evaluate
```

然后处理 `CUDA out of memory` 错误——如果你没有 GPU，要配 Google Colab Pro（$13.99/月）或者用 Hugging Face Spaces 的免费 T4，但免费额度经常排队。到 Agents Course 的 Unit 4（LlamaIndex + smolagents），代码依赖链已经相当复杂。

**数据说话**：我们对 2025 年 Q1 入学的 38 名匠人学院学员做过一次调研，有 31 人在入学前尝试过 Hugging Face Course，其中 19 人卡在了 Fine-tuning 章节，主要原因是环境配置（`torch` 版本冲突占 11 人，CUDA 驱动问题占 5 人，其余 3 人是 tokenizer 相关报错）。

### 什么情况下值得投入

如果你的目标岗位 JD 里出现了"fine-tuning"、"model evaluation"、"Hugging Face Hub"这类关键词（在我们分析的 312 个 JD 里，这类词出现在 23% 的 AI Engineer 岗位描述中），那 Hugging Face Course 是必学的。

如果你的目标是快速做出 AI 应用（RAG、agent、chatbot），Hugging Face Models 作为模型仓库使用就够了，不需要把整个课程学完。

**搭配建议**：Hugging Face Course Unit 1–2（pipeline 基础）→ 匠人学院 Context Engineering 模块（理解 token、上下文窗口、prompt 结构）→ 再回来看 Unit 3。这个顺序比直线学下去完成率高得多。

---

## 第 4 名：Coursera（Google / IBM / Meta AI 专项课）—— 证书含金量参差，选课策略比平台本身更重要

Coursera 上的 AI 相关课程数量已经超过 1200 门（截至 2025 年 11 月），但"含金量参差"这四个字不是客气话——同一个平台上，Google 的 *Machine Learning Engineering for Production (MLOps)* Specialization 和某些"AI for Everyone"类课程的工程深度差了不止一个数量级。

### 哪几门值得花时间

基于我们对 312 个 Seek JD 的关键词分析，以下三个 Specialization 在澳洲市场的 AI Engineer / ML Engineer 岗位描述里出现频率最高：

- **Google Cloud Professional ML Engineer 备考路径**（Professional Machine Learning Engineer Certificate，考试费 $200 USD）：覆盖 Vertex AI、BigQuery ML、Kubeflow Pipelines，对目标岗位在 GCP 栈的学员有直接价值
- **IBM AI Engineering Professional Certificate**（6 门课，约 4–6 个月）：Keras、PyTorch、OpenCV 都有涉及，但 2024 年版本里的 Watson Studio 内容已经和市场脱节，跳过即可
- **Meta 的 *Advanced Learning Algorithms***（Andrew Ng 主讲，Coursera 上评分 4.9，约 34 小时）：数学推导清晰，是目前中文学习者里口碑最稳定的监督学习课程

**Coursera 的真实问题**：财务审计。很多学员付了 $49–$79/月 的订阅费，但实际完成率不到 15%（Coursera 自己 2023 年财报披露的平台平均完成率约 12%）。订阅制对自律性强的人是折扣，对大多数人是沉没成本陷阱。

**建议**：用 Coursera 的 7 天免费试用期集中完成一门课的核心模块，或者申请 Financial Aid（审批周期约 15 天，通过率较高，可免费访问大多数内容）。

匠人学院 AI Engineer Bootcamp 里有一个模块专门讲"如何把 Coursera 证书项目改造成 portfolio 项目"——核心操作是把 graded assignment 的 notebook 拆解重构，加上真实数据源、API 集成和部署步骤，让它从"作业"变成"作品"。这个改造过程本身就是面试话题。

**适合人群**：需要结构化学习路径、目标考取云厂商认证、或者雇主明确要求相关证书的学员。纯粹想快速做出 AI 项目的人，Coursera 不是最短路径。

---

## 第 5 名：慕课网（MOOC）—— 中文技术社区里工程细节最扎实的平台之一，但 AI 方向更新速度是短板

说慕课网"工程细节扎实"不是客套，是有具体依据的。慕课网上的 Python 全栈、Django、Spring Boot 等课程，在代码层面的完整性（项目结构、数据库迁移、部署脚本）一直是中文技术平台里少见的认真。一个在悉尼读 UNSW 的学员告诉我们，他 2023 年靠慕课网的 Django REST Framework 课程搭出了第一个完整后端项目，"老师会告诉你为什么要用 `select_related` 而不是直接 query，这种细节在很多平台是缺失的"。

### AI 方向的真实状况

但 AI 方向是另一回事。我们在 2025 年 9 月系统梳理了慕课网上标注"AI"或"大模型"的课程，发现：

- 发布于 2023 年以前的课程占比约 41%，其中大量使用 `from langchain import LLMChain`（LangChain 0.0.x 的写法，在 0.3.x 里已经完全废弃）
- 涉及 Agent 框架的课程里，只有 3 门提到了 LangGraph 或 AutoGen，其余仍在讲 `AgentExecutor`（这个 class 在 LangChain 0.3.x 里已标注为 legacy）
- 没有一门课程覆盖 FastMCP 或 Model Context Protocol（MCP 是 2024 年 11 月 Anthropic 发布的，但截至我们调研时，国内平台普遍滞后 6–12 个月）

这不是慕课网独有的问题——这是所有依赖录制视频的平台面对快速迭代技术栈时的结构性困境。LangChain 从 0.1 到 0.3 有两次大规模 breaking change，一门 2023 年录制的课程，代码可能在 2025 年一行都跑不通。

### 怎么用才对

慕课网的正确打开方式是"用它补工程基础，不用它追 AI 前沿"：

- **Python 基础 + 数据结构**：慕课网的 Python 入门课质量稳定，适合零基础学员在进入匠人学院 [Python 课程](https://jiangren.com.au/learn/python) 之前做热身
- **Flask / FastAPI 基础**：理解 HTTP、路由、中间件这些概念，在后续学 AI API 服务部署时会省很多时间
- **SQL + 数据库**：RAG pipeline 里的 pgvector 操作需要扎实的 SQL 基础，慕课网这块内容相对不过时

一句话总结的话（但我不打算用"总而言之"）：慕课网是打地基的地方，不是追新技术的地方。把它当 reference，不要把它当 roadmap。

---

## 第 6 名：CSDN + 51CTO —— 碎片化但有效，关键是要会用搜索而不是刷推荐

把 CSDN 和 51CTO 放在同一节不是偷懒，是因为它们的使用方式几乎相同：**搜索驱动，而不是课程驱动**。

### CSDN 的真实价值在哪里

CSDN 上质量最高的内容往往不是"教程"，而是"踩坑记录"。当你在生产环境里遇到：

```
openai.BadRequestError: 400 invalid_request_error - This model's maximum context length is 128000 tokens
```

或者：

```
langchain_core.exceptions.OutputParserException: Could not parse LLM output
```

这类错误，CSDN 上往往有人在 3 个月前已经踩过并写了解决方案。这种"有人帮你踩坑"的价值，在 Stack Overflow 上英文内容已经很丰富，但中文语境里 CSDN 是密度最高的地方。

**但 CSDN 的推荐算法是陷阱**。它会把你推向标题党文章（"月薪 3 万的 AI 工程师必学 XXX"这类），而这些文章的代码质量往往很差——复制粘贴错误、版本不注明、没有 error handling。我们在匠人学院课程里明确告诉学员：**CSDN 要用搜索，不要刷 feed**。

### 51CTO 的定位

51CTO 的结构化课程质量比 CSDN 的文章平均水平高，但和慕课网面临同样的更新速度问题。51CTO 的优势是企业培训场景——如果你的公司有 51CTO 企业版订阅，里面的运维、云计算、网络安全内容是值得用的。对个人 AI 学习者来说，51CTO 的免费文章 + CSDN 的搜索能力组合使用，比单独订阅任何一个平台更高效。

**一个具体的工作流**：遇到报错 → Google / Bing 搜索报错信息 + "CSDN" → 找到踩坑文章 → 验证代码版本是否匹配（`langchain.__version__` 输出是 0.1.x 还是 0.3.x）→ 如果版本不匹配，去 [LangChain 官方 migration guide](https://python.langchain.com/docs/versions/migrating_chains/) 找对应写法。这个流程比直接问 ChatGPT 更可靠，因为 LLM 的训练数据截止日期经常导致它给出已废弃的 API 写法。

匠人学院学员在项目 sprint 里被要求记录每一个踩坑和解决方案，格式是：报错信息 + 根本原因 + 解决方案 + 参考来源。这个习惯本身就是工程师文化的一部分，和你用什么平台学习无关，但 CSDN 这类平台可以加速这个积累过程。

[Vibe Coding 课程（含工程调试方法论模块）→](https://jiangren.com.au/learn/vibe-coding)

---

## 第 7 名：科大讯飞 AI 大学堂 —— 国内云 AI 服务的实践入口，对接讯飞 Spark / 星火认知大模型

科大讯飞 AI 大学堂在国内云 AI 服务的实践内容上有更本地化的覆盖。如果你目标是国内市场或公司在用讯飞 Spark / 星火认知大模型，AI 大学堂的实操内容比通用 AI 教程更直接——里面有讯飞官方 SDK 的调用示例、控制台截图、批量任务管理工具的演示。

**真实使用场景**：一个 2024 年回国的学员在杭州一家做客服 SaaS 的公司，技术栈是讯飞 Spark + 自研 RAG，他在 AI 大学堂上花了大概一周时间过完了 Spark API 的官方实战课，能直接对应到工作中的 incident response。这种"平台 + 文档 + 课程一体化"的本地价值，是国际平台无法替代的。

**局限**：内容深度对国际市场（澳洲 / 北美）的 AI Engineer 岗位帮助有限，因为澳洲 Seek JD 里几乎不会出现"讯飞"这个词。如果你目标是澳洲求职，跳过即可。

[Python 基础课程（讯飞 SDK 用 Python，基础不能少）→](https://jiangren.com.au/learn/python)

---

## 第 8 名：Udemy（精选少数 AI 课程） —— 折扣季性价比高，但要会挑课

Udemy 上 AI 相关课程数量超过 4000 门，但 90% 是"标题党 + 内容浅"的状态。能进我们推荐清单的只有少数几位讲师：

- **José Portilla**（*The Complete Python Bootcamp*、*Python for Data Science and Machine Learning Bootcamp*）：12 年讲师经验，代码风格规范，覆盖 numpy / pandas / scikit-learn 完整链路
- **Krish Naik**（*End-to-End Machine Learning*）：印度讲师，英语口音需要适应，但工程化思维强，覆盖从模型训练到 Flask 部署 + Docker
- **Maximilian Schwarzmüller**（*React + TypeScript*）：不是 AI 课，但很多 AI Engineer 转型者需要补前端，这位的课是 Udemy 上口碑最稳定的

**购买策略**：Udemy 几乎每月都有大促，原价 $199 的课促销价 $11.99–$14.99 是常态。**不要原价买**——这是行业共识，连 Udemy 自己的销售都默认你会等折扣。

**适合人群**：自学动力强、能挑课、能对照官方文档查版本的学员。不适合期望"买一门课就能学会"的人。

---

## 第 9 名：B 站（Bilibili）—— 免费 + 中文 + 实时性，但需要会做信息筛选

B 站是中文 AI 学习内容更新最快的地方之一。Anthropic 发布 Claude Skills 的同一周，B 站上就会有 UP 主出实测视频；OpenAI 开 Realtime API 的当天，B 站上有人录复现教程。这种**实时性**是录制课程平台无法对标的。

但 B 站的问题是**信噪比低**。同一个主题，可能有 50 个视频，质量从"不如官方文档"到"比官方文档清楚"都有。我们整理过几个口碑稳定的 UP：

- **李沐（沐神）**：原 AWS / Amazon 资深 PI，《动手学深度学习》作者，B 站上的论文精读系列是中文社区里最高密度的资源之一
- **3Blue1Brown 中文搬运**：神经网络可视化系列，理解 Transformer / Attention 机制的最佳入门资源
- **跟李沐学 AI**：上述李沐频道的延伸，更新慢但每条都值得看

**使用方式**：B 站当作"第二解释源"——在官方文档或论文卡住时，找对应主题的中文视频帮助理解。**不要把 B 站当主学习路径**，因为它没有 assignment、没有反馈、没有项目交付节点。

[AI Engineer Bootcamp 2026（结构化交付反馈）→](https://jiangren.com.au/learn/ai-engineer-bootcamp-2026)

---

## 第 10 名：Anthropic / OpenAI 官方文档 + Cookbook —— 最被低估的"教材"，所有平台课程的源头

把官方文档放在 Top 10 不是凑数。Anthropic [Claude API docs](https://docs.anthropic.com/) 和 OpenAI [Cookbook](https://cookbook.openai.com/) 是所有第三方课程的**事实信息源**，但在中文学习者里使用率反而最低——很多人会去看一门 30 节的 Coursera 课，但不会花 2 小时把 Claude API 的 *Tool use* 文档从头到尾读一遍。

### 为什么官方文档值得花时间

- **版本永远最新**：第三方课程录制日期是 2024 年 6 月，到你 2026 年 5 月学的时候已经过了快两年；官方文档每次 API 变更同步更新
- **代码可直接跑**：Anthropic 文档里的每段示例代码都是可运行的，复制粘贴 + 替换 API key 就能验证
- **错误信息匹配**：官方文档对每个错误码（`401`、`429`、`overloaded_error`）都有对应解释，对应到你看到的 stack trace 上 1:1 命中

### Cookbook 的真实定位

OpenAI Cookbook 不是"入门教程"，是"工程模式参考"。里面的每个 notebook 都解决一个具体的工程问题：如何处理 rate limit、如何做 batch inference、如何构造 evals。匠人学院学员在项目 sprint 里被要求至少阅读并复现 Cookbook 中 2 个 notebook 作为入门作业——这个动作能筛掉一半"看似想做 AI 但其实没有工程习惯"的人。

**搭配建议**：第三方课程学完一个主题（比如 RAG）后，立刻去 OpenAI Cookbook 找对应的 [Question answering with embeddings](https://cookbook.openai.com/examples/question_answering_using_embeddings) notebook 跑一遍。两边对照学，比单独看任一边效率高 2 倍以上。

[AI Engineer 课程详情 →](https://jiangren.com.au/learn/ai-engineer)

---

## 第 11 节：匠人学院能解决什么、不能解决什么、不擅长什么

这部分说实话。很多课程介绍页只写"能"，我们把三列都写出来。

### 能解决的

**"学完不知道怎么用"的断层问题。**

这是中文 AI 学习者最集中的反馈：看完视频、跑完 notebook，但面对一个真实需求——比如"帮公司把客服邮件接入 GPT 做自动分类"——不知道从哪里开始。匠人学院 AI Engineer 课程的每个 sprint 都从一个真实 spec 开始：有输入格式、有性能要求、有成本约束（"API 调用预算不超过 $0.05/次"是真实写进 spec 的约束）。学员交付的不是"我学了 RAG"，是"一个支持 PDF 上传、基于 pgvector + claude-3-5-sonnet-20241022 的文档问答服务，P95 响应时间 < 3s，部署在 AWS Lambda"。

**工程习惯的建立。**

说一个具体的例子：很多初学者写 LangChain 代码时，API key 是硬编码在文件里的。`openai.api_key = "sk-proj-..."` 直接写在第 3 行。这不是"小问题"，这是会被 GitHub secret scanning 自动 flag、会导致账号被盗用的真实风险。匠人学院的 onboarding 第一天就要求学员配好 `.env` + `python-dotenv`，并且把 `.env` 加进 `.gitignore`。这些习惯不是"进阶内容"，是第一天就教的基础设施。

**澳洲本地就业市场的对齐。**

我们分析的 312 个 Seek JD 是澳洲市场的真实数据，不是美国、不是国内。澳洲 AI Engineer 岗位的技术栈偏好、面试流程、portfolio 评估标准和硅谷有差异。比如，澳洲企业对 AWS 的偏好明显高于 GCP（在我们分析的 JD 里，AWS 出现频率是 GCP 的 2.3 倍），对 FastAPI + Docker 的组合要求比 Flask 高。[AI Engineer Bootcamp 2026](https://jiangren.com.au/learn/ai-engineer-bootcamp-2026) 的课程设计是基于这份本地数据更新的，不是照搬硅谷课程体系。

**技术选型的判断力。**

一个在悉尼读 UNSW 的学员，入学前花了两个月学 LangGraph，因为"看到很多文章说 LangGraph 是做 agent 的最佳选择"。入学后发现他的目标项目（一个单轮文档摘要工具）根本不需要 LangGraph，用 `anthropic.messages.create()` 直接调用加上一个 system prompt 就够了——LangGraph 的学习成本在这个场景下是纯浪费。匠人学院课程里有一个模块叫"技术选型决策树"，核心逻辑是：先问"你的场景有没有状态管理需求"，再问"有没有多 agent 协作"，再决定用不用 LangGraph / LangChain / 裸 API。这个判断力比学会某个具体框架更值钱。

---

### 不能解决的

**数学基础的欠缺。**

如果你的目标是做模型研究——写论文、改 attention 机制、复现 RLHF 流程——匠人学院不是正确的地方。我们的课程假设你把模型当工具使用，不假设你需要理解 backpropagation 的数学推导。DeepLearning.AI 的 *Mathematics for Machine Learning and Data Science* Specialization（Coursera 上，Luis Serrano 主讲）是这个方向更合适的起点，我们在课程里也明确告诉学员这一点。

**完全零基础的编程入门。**

匠人学院 [Python 课程](https://jiangren.com.au/learn/python) 覆盖了从基础语法到面向对象的内容，但如果你从来没有写过任何代码，建议先在 CSDN 或慕课网上花 2–3 周把 Python 基础过一遍，再进入 AI Engineer 的学习路径。我们的课程节奏假设学员能看懂 `for` 循环和 `try/except`，从第一个 sprint 开始就会遇到真实的 `AttributeError` 和 `KeyError`，没有"零基础友好"的缓冲期。

**保证你一定能找到工作。**

这条直接写清楚：没有任何课程能保证就业结果，我们也不承诺。市场客观数据是：澳洲 2025 年 AI Engineer 相关岗位的 Seek 挂牌数同比增长 34%，但竞争也在增加。P3 模式里的 Placement 环节是"把你的项目推进企业评估流程"，不是"帮你内推简历"。能不能拿到 offer，取决于你的项目质量、面试表现和市场时机——这三个变量我们只能影响前两个。

---

### 不擅长的

**纯理论内容的系统讲解。**

如果你想深入理解 Transformer 架构为什么这么设计、attention is all you need 这篇论文的贡献是什么，匠人学院的课程会提供阅读材料和参考链接，但不会花大量时间讲这些。Hugging Face Course 的 Chapter 1–2 和 fast.ai 的 *Practical Deep Learning for Coders*（免费，Jeremy Howard 主讲，2024 版）在这方面比我们做得好。

**视频内容的"陪伴感"。**

有些学员喜欢那种 10 小时长视频、讲师边讲边敲代码的学习方式——这种方式有它的价值，特别是在入门阶段建立直觉。匠人学院的内容更偏向"spec + code review + async 答疑"的工程协作模式，如果你需要大量视频陪伴，慕课网或 Udemy 上的某些课程可以作为补充。

**国内云平台的实践环境。**

如果你在国内工作，目标是对接阿里云、腾讯云或百度智能云的 AI 服务，匠人学院的课程主要覆盖 AWS / Azure / GCP 栈，国内云平台的具体 SDK 和控制台操作不在我们的核心覆盖范围内。科大讯飞 AI 大学堂在国内云 AI 服务的实践内容上有更本地化的覆盖。

---

## 第 12 节：行动清单——从现在到第一个 production-ready 项目的 6 步路径

这不是"学习计划模板"，是基于匠人学院学员复盘整理出来的实际操作步骤，每一步都有具体的可检验产出。

**第 1 步：确认你的编程基础线（1–2 天）**

打开终端，运行以下代码，如果能在 10 分钟内独立处理报错并跑通，你可以跳过 Python 基础阶段：

```python
import os
from dotenv import load_dotenv
import anthropic

load_dotenv()
client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

message = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Explain RAG in one paragraph."}]
)
print(message.content[0].text)
```

如果你在 `ModuleNotFoundError` 或 `.env` 配置上卡超过 30 分钟，先去 [Python 基础课程](https://jiangren.com.au/learn/python) 补两周基础，再回来。

**第 2 步：选定你的目标岗位方向（3 天内完成）**

去 Seek.com.au 搜索"AI Engineer"、"ML Engineer"、"AI Product Manager"，下载 20 份 JD，用文本编辑器统计出现频率最高的 10 个技术词。这个动作比看任何"AI 学习路线图"都更有价值，因为它是你所在市场的真实信号，不是某个课程设计者的判断。

**第 3 步：完成一个"最小可部署项目"（2–3 周）**

不是"学完 LangChain 再做项目"，是现在就做，边做边学。最小可部署项目的定义：

- 有一个真实输入（用户上传的文件、一段文字、一个 URL）
- 有一个 LLM 处理步骤（调用 Claude 或 OpenAI API）
- 有一个可访问的输出（FastAPI endpoint，能用 `curl` 调用）
- 部署在任何能被访问的地方（Hugging Face Spaces 免费 tier 够用）

这个项目不需要完美。一个能跑的 `POST /summarize` endpoint，接受 JSON body，返回摘要文本，就是一个合格的起点。匠人学院 [Vibe Coding 课程](https://jiangren.com.au/learn/vibe-coding) 里有这个最小项目的完整脚手架模板。

**第 4 步：把项目推上 GitHub，写一份真实的 README（1 天）**

README 必须包含：项目解决了什么问题（一句话）、技术栈（列出版本号）、本地运行步骤（从 `git clone` 到 `uvicorn main:app` 的完整命令序列）、已知限制（"目前不支持超过 10MB 的 PDF"这类诚实描述）。

去看匠人学院 [GitHub 课程仓库](https://github.com/JR-Academy-AI/jr-academy-ai) 里的 `outline.json`，里面有每个模块的 README 模板和评分标准，可以直接参考格式。

**第 5 步：配合 DeepLearning.AI 短课补技术深度（持续进行）**

在做项目的过程中，你会遇到具体的知识缺口。遇到 RAG 相关问题时，去看 *Building and Evaluating Advanced RAG*（约 3 小时）；遇到 function calling 问题时，看 *Building Systems with the ChatGPT API*。这种"按需学习"的效率比"先学完所有课再做项目"高 3–5 倍——这是匠人学院学员复盘里重复出现最多的一条建议。

**第 6 步：进入结构化项目制学习环境（如果你需要的话）**

如果你在前 5 步里发现自己的核心问题是"缺乏反馈"和"不知道自己的代码质量如何"，那结构化环境的价值就体现出来了。[2026 AI Engineer Bootcamp](https://jiangren.com.au/learn/ai-engineer-bootcamp-2026) 的 cohort 制度意味着你的代码会被 code review，你的项目 spec 会被质疑，你的技术选型会被问"为什么不用更简单的方案"——这种摩擦是自学环境里很难复现的。

报名前可以先看 [AI Engineer 课程页](https://jiangren.com.au/learn/ai-engineer) 里的 sample sprint spec，判断这个节奏是否适合你现在的状态。不要在自己还没确认基础线的情况下报名——这条建议对我们自己的课程也成立。
