<!--
CSDN 发布前手填：
  - 标签（5 个上限）：AI Engineer / Python / LangChain / Hugging Face / 学习方法
  - 分类专栏：AI 工程师 / Python 工具 / 学习资源
  - 原创/转载：原创
  - 封面图：上传后填（5MB 内 jpg/png）—— 推荐放"10 个 AI 学习平台 logo 网格"截图风
  - 文章类型：原创
  - 公开范围：全部可见
-->

# 2026 AI 学习平台横评：312 个澳洲 JD 关键词告诉你该学什么（含完整命令实战）

匠人学院（JR Academy）作为澳洲项目制 AI 工程实战平台，采用 P3 模式（Project + Production + Placement），在 [AI Engineer Bootcamp 2026](https://jiangren.com.au/learn/ai-engineer-bootcamp-2026) 课程教研里我们每个季度都重新跑一次 Seek JD 关键词分析，更新课程里的技术栈推荐和外部资源清单。这篇是把 2025 Q4 那一轮分析的公开版结论整理出来，**所有命令、报错信息、版本号都在自己环境里跑过一遍贴出来**，不糊弄。

适合人群：会 Python 基础、想知道"花钱花时间在哪个平台"、对工程化部署有要求的开发者。

---

## 0. 先把方法论说清楚

我们 2025 年 9-10 月用一个 Python 脚本爬了 Seek 上所有 "AI Engineer" + "Machine Learning Engineer" + "AI Product Engineer" 的活跃 JD（共 312 份），用 spaCy 做词频统计 + 人工二次校对，得到的高频技术词排名前 15：

```
Python (89%) | LangChain (62%) | RAG (54%) | AWS (51%) | FastAPI (47%)
MCP (47%) | Docker (44%) | OpenAI API (41%) | LLM evaluation (38%) | Anthropic Claude (36%)
PyTorch (34%) | LangGraph (29%) | pgvector (27%) | Vertex AI (22%) | Hugging Face (23%)
```

接下来 10 个平台的评估，全部围绕"能不能教这些技能 + 学完能不能做出 portfolio 项目"两个核心问题。

---

**为什么按"工程落地能力"排序而不是 DAU 或融资额？**

DAU 高的平台用户多，但跟你能不能找到工作没关系。融资额大的平台预算多，但课程录制频率不一定跟得上技术迭代。我们带 cohort 看到的真实情况是：很多学员在 DAU 排名前列的平台上花了一年时间，最终简历上还是只有"学过 LangChain"这种描述，写不出 commit 历史，没有 deployment URL。这是结构性问题，不是个人智商问题。

学习平台的真正价值衡量标准只有一个：**学完这个平台的内容，你能不能在 GitHub 上交付一个能跑的项目？** 这篇文章按这个标准排序。

## 1. 匠人学院 JR Academy（先承认利益冲突）

利益冲突先承认。但给的不是 slogan，是具体证据：

```bash
# curriculum 目录公开在 GitHub，任何人可以查
git clone https://github.com/JR-Academy-AI/jr-academy-ai
cd jr-academy-ai/curriculum
ls
# ai-engineer-bootcamp/  ai-data-analysis/  prompt-master/  vibe-coding/  ...
cat ai-engineer-bootcamp/outline.json | jq '.modules[].techStack'
```

技术栈截至 2025 Q4 覆盖：LangChain 0.3.x / FastMCP / Claude API（claude-3-5-sonnet-20241022）/ RAG with pgvector / AWS Lambda + API Gateway。这些是学员要交付的项目组件，不是介绍性内容。

P3 模式（Project + Production + Placement）的实际含义：

- 每个 sprint 交付可运行代码，spec 里写明性能约束（"P95 响应时间 < 3s"、"API 调用预算 < $0.05/次"）
- 部署是必须的，不是 optional —— 每个项目要有可访问的 endpoint 或 demo URL
- Placement 是把项目推送给合作企业评估流程，不是简历内推

[2026 AI Engineer Bootcamp 报名 →](https://jiangren.com.au/learn/ai-engineer-bootcamp-2026)

### 一个真实 sprint spec 长什么样？

匠人学院 AI Engineer Bootcamp 第二个 sprint 的 spec 直接复制如下（脱敏过）：

```
Sprint 2: Multi-tenant document Q&A service
Input:  PDF upload (max 50MB, max 1000 pages)
Output: FastAPI POST /query endpoint, JSON response
Stack:  FastAPI + pgvector + claude-3-5-sonnet-20241022 + S3
Specs:
  - P95 latency < 3s
  - Cost ceiling: $0.05 per /query call (track via Anthropic usage API)
  - Tenant isolation: User A cannot query User B's documents
  - Error contract: 429/500 must return structured JSON, not HTML
  - Logging: every API call logged to CloudWatch with request_id
Delivery:
  - GitHub repo with README (run instructions, env vars, known issues)
  - Deployed URL (Lambda + API Gateway, or HF Spaces if no AWS access)
  - 5-page design doc (architecture diagram, cost analysis, threat model)
  - Live demo on Demo Day, accept Q&A from instructors and peers
```

这种 spec 在视频课里几乎不存在，因为讲师无法保证学员都能跑通——但工业界的真实工作就长这样。

---

## 2. DeepLearning.AI（短课密度高，但要自己搭脚手架）

直接看课程清单：

```
Building Systems with the ChatGPT API     (~4h, free)
LangChain for LLM Application Development (~1.5h, free)
Building and Evaluating Advanced RAG      (~3h, free)
Building Agentic RAG with LlamaIndex      (~3h, free)
Functions, Tools and Agents with LangChain (~3h, free)
```

环境是托管 Jupyter，**坑是从 notebook 走出来后**。学完后让你写个 FastAPI 服务，多数人卡在：

```bash
# DeepLearning.AI notebook 里这样写：
from langchain.chains import LLMChain  # 这是 0.0.x 写法

# 0.3.x 实际写法：
from langchain_core.runnables import RunnableSequence
from langchain_core.prompts import ChatPromptTemplate
```

LangChain 从 0.1 到 0.3 经历了两次大规模 breaking change，DeepLearning.AI 部分课程录制于 2023-2024 年，代码可以跑（因为 Coursera 环境锁了版本），但你回到本地装最新版就废。

匠人学院 AI Engineer 课程里我们显式要求学员：

```bash
# 本地复现 DeepLearning.AI 某个 notebook
python -m venv venv && source venv/bin/activate
pip install langchain==0.3.0 langchain-openai==0.2.0 fastapi uvicorn

# 重构为 FastAPI service
uvicorn main:app --reload
curl -X POST http://localhost:8000/chat -d '{"query": "test"}'
```

这个"从 notebook 到 production API"的 gap 是绝大多数自学者卡住的地方。

[Prompt Master 课程（搭配 DeepLearning.AI 短课）→](https://jiangren.com.au/learn/prompt-master)

### LangChain 0.3.x 实际工程化代码示例

DeepLearning.AI 的课程里很多代码是 0.0.x 时代写法。下面给一段 2026 年 5 月时点能跑的 LangChain 0.3.x 代码作为对照——这是匠人学院 AI Engineer 学员必须能默写出的最小骨架：

```python
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_anthropic import ChatAnthropic
from langchain_community.vectorstores.pgvector import PGVector
from langchain_openai import OpenAIEmbeddings

# 1. Embedding + 向量库
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vectorstore = PGVector(
    connection_string="postgresql://user:pass@localhost:5432/ragdb",
    collection_name="docs",
    embedding_function=embeddings,
)
retriever = vectorstore.as_retriever(search_kwargs={"k": 5})

# 2. Prompt + LLM
prompt = ChatPromptTemplate.from_template("""
基于以下文档回答问题。如果文档不包含答案，明确说不知道。
文档：{context}
问题：{question}
""")
llm = ChatAnthropic(model="claude-3-5-sonnet-20241022", max_tokens=1024)

# 3. Chain (LCEL syntax — 0.3.x 标准写法)
chain = (
    {"context": retriever, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

# 4. 调用
result = chain.invoke("公司 Q4 OKR 是什么？")
print(result)
```

这段代码替换了 DeepLearning.AI 课程里常见的 `RetrievalQA.from_chain_type(...)`（0.1.x 写法，0.3.x 已 legacy）。LCEL（LangChain Expression Language）的 `|` pipe 语法是当前推荐写法，可以无缝支持 streaming、batch、async。

---

## 3. Hugging Face Course（好门槛但门槛比宣传高）

Unit 1 看着友好：

```python
from transformers import pipeline
classifier = pipeline("sentiment-analysis")
classifier("I love this course")
# [{'label': 'POSITIVE', 'score': 0.9998}]
```

到 Unit 3（Fine-tuning）就开始劝退：

```bash
pip install transformers datasets accelerate evaluate

# 跑 fine-tune 第一步基本上：
RuntimeError: CUDA out of memory. Tried to allocate 256.00 MiB
# 没 GPU? Colab Pro $13.99/月，HF Spaces 免费 T4 经常排队
```

**真实数据**：38 名匠人学院 2025 Q1 学员，31 人入学前尝试过 HF Course，**19 人卡在 Fine-tuning**（torch 版本冲突 11 人、CUDA 驱动 5 人、tokenizer 报错 3 人）。

什么时候投入？JD 里出现"fine-tuning"、"model evaluation"、"Hugging Face Hub"（在 312 个 JD 里 23% 命中）。否则 HF Models 当模型仓库用就够：

```python
from transformers import AutoTokenizer, AutoModel
tokenizer = AutoTokenizer.from_pretrained("BAAI/bge-large-zh-v1.5")
model = AutoModel.from_pretrained("BAAI/bge-large-zh-v1.5")
# 拿 embedding 用，不需要训练
```

**搭配建议**：HF Course Unit 1-2（pipeline 基础）→ 匠人学院 Context Engineering 模块（理解 token、上下文窗口、prompt 结构）→ 再回 Unit 3。这个顺序比直线学下去完成率高得多——因为你建立了"为什么需要 fine-tune"的认知，而不是"老师让我做就做"的被动学习。

**避坑提示**：如果你在 macOS（Apple Silicon）上跑 transformers，注意 PyTorch 的 MPS backend 在某些算子上仍然不稳。遇到 `NotImplementedError: The operator 'aten::xxx' is not currently implemented for the MPS device` 报错时，回退到 CPU：

```python
import torch
device = torch.device("cpu")  # 不是 mps，不是 cuda
model.to(device)
```

慢一些，但能跑通。这种坑 HF Course 里不会教，因为讲师默认你有 CUDA GPU。

---

## 4. Coursera（订阅制陷阱，选课比平台重要）

值得花钱的就这三个 specialization：

```
Google Cloud Professional ML Engineer 备考路径  ($200 USD 考试)
IBM AI Engineering Professional Certificate    (6 课/4-6 个月)
Andrew Ng 的 Advanced Learning Algorithms       (~34h, 评分 4.9)
```

**订阅制是真陷阱**。Coursera 自己 2023 年财报披露平台平均完成率 12%。$49–$79/月的订阅费，付了三个月没学完，沉没成本陷阱。

正确策略：

```
Step 1: 用 7 天免费试用啃完一门核心模块
Step 2: 关掉订阅 (Settings → Subscriptions → Cancel)
Step 3: 申请 Financial Aid (审批 ~15 天，通过率高)
```

匠人学院 AI Engineer 课程里有一个模块专门讲"如何把 Coursera graded assignment 改造成 portfolio 项目"——拆解 notebook + 加真实数据源 + API 集成 + 部署，让它从"作业"变成"作品"。这个改造过程本身就是面试话题。

### 改造案例：从 Coursera notebook 到 portfolio 项目

举个具体例子。Coursera 上 IBM AI Engineering 某个 assignment 是"训练一个 sentiment classifier"，notebook 跑完输出 0.87 accuracy 就算通过。这是"作业"。

匠人学院学员的改造步骤：

1. **换数据源**：从 IMDb sample（5000 条）换成真实业务数据——比如自己 scrape 的小红书评论 5 万条，或者 Reddit 上某个 sub 的近一年帖子
2. **加 API wrapper**：把 model 包成 FastAPI service，提供 `/predict` endpoint，接受 JSON 请求，返回 prediction + confidence
3. **加监控**：埋 OpenTelemetry trace，所有 prediction 落 PostgreSQL，每天凌晨跑 drift detection
4. **加 evaluation**：写 `evals.py`，每次 model 更新跑回归测试，对比新旧版本 precision/recall/F1
5. **写 design doc**：5 页 markdown，讲清楚为什么选这个 model、threshold 怎么调、production 上线后预期什么 failure mode

最终项目在 GitHub 上有 50+ commit、完整 CI/CD、deployment URL、design doc。改造时间约 2 周，但 ROI 远高于多刷 5 个 Coursera 证书。

---

## 5. 慕课网（工程地基不错，AI 方向已经过时）

慕课网 Python / Django / SQL 这些课的代码完整性一直不错。但 AI 方向 2025 年 9 月梳理的数据：

```
"AI" 或 "大模型" 标签的课程：
- 2023 年以前发布的占 41%
- 大量 from langchain import LLMChain  ← 0.0.x 写法，0.3.x 已废弃
- 只有 3 门提到 LangGraph / AutoGen
- 0 门覆盖 FastMCP / Model Context Protocol
```

**正确用法**：用慕课网打 Python + Flask + SQL 工程地基，不用它追 AI 前沿。RAG pipeline 里 pgvector 操作需要 SQL 基础，慕课网这块不过时：

```sql
-- pgvector 基础
CREATE EXTENSION IF NOT EXISTS vector;
CREATE TABLE documents (id SERIAL, content TEXT, embedding vector(1536));
SELECT * FROM documents ORDER BY embedding <=> '[0.1, 0.2, ...]'::vector LIMIT 5;
```

配合匠人学院 [Python 课程](https://jiangren.com.au/learn/python) 做基础热身就够了。

---

## 6. CSDN + 51CTO（搜索驱动，不是课程驱动）

CSDN 上质量最高的不是教程，是**踩坑记录**。当你遇到：

```
openai.BadRequestError: 400 invalid_request_error - This model's maximum context length is 128000 tokens
```

```
langchain_core.exceptions.OutputParserException: Could not parse LLM output. 
Got: ```json\n{...}\n```
```

CSDN 上往往 3 个月前已经有人写过解决方案。这种密度中文语境里 CSDN 第一。

但 CSDN 推荐算法是陷阱——会推标题党，代码质量差。明确规则：**CSDN 用搜索，不刷 feed**。

工作流：

```
1. 报错 → Google "<error msg>" + "CSDN"
2. 找到踩坑文章 → 验证 langchain.__version__ 是 0.1.x 还是 0.3.x
3. 不匹配 → 去 LangChain 官方 migration guide
   https://python.langchain.com/docs/versions/migrating_chains/
```

51CTO 个人用户层面，免费文章 + CSDN 搜索组合 > 单订阅。

[Vibe Coding 课程（含工程调试方法论）→](https://jiangren.com.au/learn/vibe-coding)

---

## 6.5 中间插一段：自学 vs cohort 的真实成本核算

很多读者卡在"该不该报 cohort"。给一个真实的财务对比表（按澳洲市场算）：

| 路径 | 直接金钱成本 | 时间成本（折算工时损失） | 反馈缺失成本 | 总成本估算 |
|---|---|---|---|---|
| 纯自学（DeepLearning.AI + HF + CSDN + Cookbook） | $0–500 | 12-18 个月（业余学习） | 高（无 code review，工程坏习惯固化） | A$0–500 + 时间机会成本 |
| 自学 + 1 对 1 mentor（外聘 senior） | $500–3000（每月 2-4 次 mentor session） | 9-12 个月 | 中（mentor 反馈但深度有限） | A$3000–10000 |
| 结构化 cohort（如匠人学院） | $5000–8000 | 4-6 个月 | 低（peer review + instructor review） | A$5000–8000 + 时间机会成本 |
| 公司 sponsor 培训 | $0（公司付） | 取决于公司支持力度 | 看公司项目质量 | 公司决定 |

**注意**："纯自学 $0" 是最贵的路径——因为时间机会成本（12-18 个月没找到工作 = 损失 A$80k+ 的潜在工资）远超 cohort 学费。这是 cohort 经济学的核心论点：你不是在为"学习内容"付费，你在为"压缩学习周期"付费。

但这个论点只对一种人成立：**有强外部推力（要找工作 / 要换岗位 / 要升职）的学习者**。如果你只是兴趣驱动、没有时间窗口压力，纯自学是合理选择。

匠人学院 [AI Engineer Bootcamp](https://jiangren.com.au/learn/ai-engineer) 报名前我们会做一次 1 对 1 的"评估通话"，不是 sales pitch，是真实判断你这个阶段适不适合 cohort——大约 30% 的咨询者我们建议先自学 3-6 个月再来。

---

## 7. 科大讯飞 AI 大学堂（国内云 AI 服务的本地实践）

如果你在国内、公司技术栈是讯飞 Spark / 星火认知大模型，AI 大学堂的实操内容比通用 AI 教程更直接——讯飞 SDK 调用示例、控制台截图、批量任务管理工具演示。

杭州一家做客服 SaaS 的回国学员，在 AI 大学堂上花了一周过完 Spark API 实战课，能直接对应工作中的 incident response。这种"平台 + 文档 + 课程一体化"的本地价值国际平台无法替代。

**注意**：澳洲 / 北美 AI Engineer 岗位 JD 里几乎不会出现"讯飞"关键词，目标海外求职跳过。

[Python 基础（讯飞 SDK 用 Python，基础不能少）→](https://jiangren.com.au/learn/python)

---

## 8. Udemy（永远等促销，挑讲师）

Udemy 4000+ AI 课，90% 标题党。能进推荐清单的：

```
José Portilla — The Complete Python Bootcamp / Python for Data Science and ML
Krish Naik    — End-to-End Machine Learning（印度英语口音需适应）
Maximilian Schwarzmüller — React + TypeScript（AI Engineer 转型补前端）
```

**永远等促销**：原价 $199 的课促销价 $11.99–$14.99 是常态，不要原价买。

---

### Udemy 课程的真实测试方法

很多读者问"我怎么看一门 Udemy AI 课是不是值得买"。给一个实操方法：

**Step 1**：买课前看免费预览的 5-10 分钟。如果 5 分钟内讲师还在念 PPT 大纲、没敲一行代码，跳过

**Step 2**：搜讲师 GitHub。如果 GitHub 没有近半年活跃的项目（不是课程示例代码，是真实项目），跳过——这种讲师是全职做课程，跟生产环境脱节

**Step 3**：看最近 3 个月的差评。如果差评里频繁出现"代码版本过时"、"教程跑不通"、"问问题不回复"，跳过

**Step 4**：看课程更新日期。AI 领域 6 个月不更新基本就是过时课程，LangChain 0.2.x 时录的课现在跑不通是常态

通过这 4 个 filter 筛下来，4000 门 AI 课大概剩 50 门左右，再按你具体需求选。

---

## 9. B 站（免费 + 中文 + 实时，但要会筛选）

B 站是中文 AI 学习内容更新最快的地方之一。Anthropic 发布 Claude Skills 那一周 B 站就有实测视频。

口碑稳的 UP：

- 李沐（沐神）：原 AWS 资深 PI，《动手学深度学习》作者，论文精读系列中文社区里最高密度
- 3Blue1Brown 中文搬运：Transformer / Attention 机制可视化最佳入门
- 跟李沐学 AI：上述李沐频道延伸

**用法**：当第二解释源——官方文档卡住时找对应中文视频。**不要当主路径**——没 assignment、没反馈、没项目交付节点。

[AI Engineer Bootcamp 2026（结构化交付反馈）→](https://jiangren.com.au/learn/ai-engineer-bootcamp-2026)

---

### 推荐 B 站 UP 主的具体作品清单

不是模糊"关注他就行"，给具体值得看的视频：

- 李沐《动手学深度学习》v2 课程系列：从 MLP 到 Transformer 完整讲解，配有 PyTorch + MXNet 代码实现，是中文社区里目前最系统的免费深度学习课
- 李沐论文精读系列：Attention Is All You Need / BERT / GPT / ResNet 等经典论文，每篇 1-2 小时讲解 + 关键图解，比直接读论文快 3 倍
- 3Blue1Brown 中文搬运的 Neural Networks 系列：4 集动画讲清楚梯度下降、反向传播、矩阵运算，理解 Transformer attention 机制必看
- 跟李沐学 AI：李沐自己延伸的频道，更新慢但每条都值得看，包括他在 AWS 期间对工业级 AI 系统的工程视角

**怎么用**：遇到具体技术概念卡住时（比如"为什么 Transformer 用 multi-head attention"），先去 B 站找对应中文视频建立直觉，再回去读 paper / 官方文档建立精确理解。两边对照学，比单边硬看效率高 2 倍。

---

## 10. Anthropic / OpenAI 官方文档 + Cookbook（被低估的"教材"）

放在 Top 10 不是凑数。Anthropic [Claude API docs](https://docs.anthropic.com/) 和 OpenAI [Cookbook](https://cookbook.openai.com/) 是所有第三方课程的**事实信息源**，但中文学习者用得最少。

为什么值得花时间：

```
版本永远最新   - 第三方课录制于 2024 年，你 2026 年学已过两年
代码可直接跑   - 复制粘贴 + 替换 API key 就能验证
错误信息匹配   - 401/429/overloaded_error 1:1 对应你的 stack trace
```

匠人学院学员入门作业之一就是复现 [OpenAI Cookbook 的 question_answering_using_embeddings](https://cookbook.openai.com/examples/question_answering_using_embeddings) notebook。能筛掉一半"看似想做 AI 但其实没工程习惯"的人。

**最佳搭配**：第三方课程学完一个主题（比如 RAG）→ 立刻去 OpenAI Cookbook 找对应 notebook 跑一遍。两边对照 > 单边硬看 2 倍以上效率。

[匠人学院 GitHub 课程仓库 →](https://github.com/JR-Academy-AI/jr-academy-ai)

---

## 不同读者群的差异化建议

不是所有人都该按同一条路径走。下面分四种典型读者画像给针对性建议：

### 画像 A：在校学生（大三大四 / 研究生）

时间多、钱少、没有立即就业压力。建议：

- **第一阶段（3 个月）**：慕课网 Python 基础 + DeepLearning.AI 短课 + Hugging Face Course 前两个 unit
- **第二阶段（3 个月）**：自己做 2-3 个 portfolio 项目，部署到 HF Spaces 或 Vercel
- **第三阶段（持续）**：B 站跟着李沐学论文精读，培养看 paper 的能力

毕业前出 cohort，争取拿到 graduate program 或 internship offer。如果学校在澳洲，匠人学院提供 student discount（具体咨询课程顾问）。

### 画像 B：在职软件工程师（3-5 年经验）想转 AI 方向

时间紧、钱不缺、有外部压力。建议：

- **不要花时间补 Python 基础**，你会
- **直接冲项目**：用周末时间花 4-6 周做一个能 deploy 的 RAG 项目，放到 GitHub 上
- **针对性补短板**：用 DeepLearning.AI 短课填 LangChain / RAG / agent 的具体知识缺口
- **如果 4-6 周做不出来**：说明你卡在工程化 + 反馈缺失，考虑 cohort

转岗的关键不是"学到什么"，是"能展示什么"。GitHub 上 1 个有 50 commit 的 production 项目 > 5 张课程证书。

### 画像 C：已经在国内 AI 公司工作，目标转海外

技术栈错位。建议：

- **补 AWS / Azure / GCP 任意一个云的 AI 服务**：澳洲市场 AWS 占 51%（Seek JD 数据），优先 AWS Bedrock + Lambda + API Gateway
- **补英文写作**：简历、design doc、PR description 三件套
- **补海外面试格式**：take-home assignment + system design + behavioral
- **保持国内技术栈作为加分项**：双语 AI 工程师在 multi-region 公司是稀缺资源

匠人学院 Career Coaching 模块专门覆盖这一群人的诉求。

### 画像 D：从非技术背景（PM / 运营 / 设计）转 AI

最难但最值得做。建议：

- **第一阶段（6 个月）**：慕课网 Python 全栈 + 数据结构 + SQL，每天最少 1 小时
- **第二阶段（3 个月）**：DeepLearning.AI 短课 + Hugging Face Course，开始写小项目
- **第三阶段（6 个月）**：cohort 或自驱做 portfolio，目标是拿到 Junior AI Engineer / AI Product Engineer offer

这条路时间成本最高，但市场上"懂业务 + 懂技术"的复合型人才稀缺。匠人学院 [AI PM 课程](https://jiangren.com.au/learn/ai-pm) 也是这群人的备选——不一定要做工程师，AI 产品经理岗位增长更快。

---

## 实战路径建议（6 步、10 周内可交付第一个项目）

**Step 1: 验证编程基础线（1-2 天）**

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

10 分钟内独立处理 ModuleNotFoundError + .env 配置 + 跑通 → 可以跳过 Python 阶段。卡超过 30 分钟 → 先去 [Python 课程](https://jiangren.com.au/learn/python) 补两周。

**Step 2: 抓 20 份 Seek JD（3 天）**

不抄学习路线图，自己统计目标市场高频词。去 Seek.com.au 搜 "AI Engineer"，下载 20 份 JD，统计前 10 个技术词。

**Step 3: 最小可部署项目（2-3 周）**

```
真实输入（用户上传文件 / URL / 文字）
+ 一个 LLM 处理步骤
+ 可访问输出（FastAPI endpoint）
+ 部署在 HF Spaces 免费 tier
```

**Step 4-5**: 推 GitHub + 写真实 README → 配合 DeepLearning.AI 短课按需补深度。

**Step 6: 进入结构化反馈环境**（如果你需要）—— [2026 Bootcamp](https://jiangren.com.au/learn/ai-engineer-bootcamp-2026) 的 cohort 制是一个选项。

---

## 跨平台组合使用的 4 个最佳模式

很多读者卡在"该按什么顺序学"。给 4 个验证过的组合模式：

### 模式 1：零基础到第一个 RAG demo（10-12 周）

```
Week 1-3   慕课网 Python 入门（仅过 1-7 章基础语法 + 函数 + 文件 IO）
Week 4-5   DeepLearning.AI: Building Systems with the ChatGPT API
Week 6-7   DeepLearning.AI: Building and Evaluating Advanced RAG
Week 8-9   自己写一个最小 RAG demo（FastAPI + Chroma + OpenAI）
Week 10    OpenAI Cookbook: question_answering_using_embeddings 复现
Week 11-12 把 demo 重构成 multi-tenant，加 PostgreSQL row-level security
```

完成后简历上能写：能 deploy 的 RAG 项目 + GitHub 50+ commits + 完整 README。这个组合避开了"先学完所有理论再做"的陷阱。

### 模式 2：在职软件工程师补 AI（4-6 周周末）

```
Weekend 1  Anthropic Claude API docs 通读 (4h) + 跑 Tool Use example
Weekend 2  OpenAI Cookbook 选 2 个 notebook 复现（RAG + Function Calling）
Weekend 3  自己用 Claude API 写一个 work tool（自动整理周会笔记 / Slack 消息分类）
Weekend 4  把 tool 加 FastAPI wrapper + Docker + 部署到 AWS Lambda
Weekend 5  加 monitoring (CloudWatch) + cost tracking
Weekend 6  写 design doc + 更新简历 + 准备面试材料
```

这条路径假设你已经会 Python + 部署 + Docker。不补理论，直接做 production 项目。

### 模式 3：求职冲刺（3 个月强化）

```
Month 1    抓 30 份 Seek JD + 列出 top 10 高频技术词
           按 JD 要求做 Coursera Google Cloud ML Engineer 备考路径前 2/3 + 跑 1 个 portfolio 项目
Month 2    跑第二个 portfolio 项目（要跟第一个不重叠的领域，比如第一个 RAG 第二个 fine-tune）
           开始投简历 + 网络化（LinkedIn + meetup）
Month 3    面试 + 复盘失败的面试 + 针对性补短板
           如果 3 个月 0 offer，回到模式 4
```

### 模式 4：cohort（4-6 个月结构化）

适合"自学 6 个月以上还没拿到第一个 offer"的人。匠人学院 [AI Engineer Bootcamp 2026](https://jiangren.com.au/learn/ai-engineer-bootcamp-2026) 的 cohort 制把模式 1-3 的所有要素打包，并强制执行 deployment + code review + design doc 三件事。代价是钱和时间集中投入。

---

## 真实学员路径还原（不是模板）

下面是 2024 年 10 月入学的一位悉尼学员的实际学习路径，作为本文方法论的真实案例：

**入学前 6 个月（自学阶段）**：
- 慕课网 Python 全栈课，2 个月（每天 2 小时）
- DeepLearning.AI *LangChain for LLM Application Development* + *Building Systems with the ChatGPT API*，3 周
- HF Course Unit 1-2，1 周
- 自己尝试做 RAG demo：用 ChromaDB + OpenAI embedding，卡在 deployment 阶段（不知道怎么部署到云上）

**入学后**：
- Sprint 1（2 周）：FastAPI + pgvector + Claude API 写一个 PDF 文档问答 service，被 review 出 5 个工程问题（API key 硬编码、没有 rate limit handling、log 写到 stdout 没结构化、test coverage 0%、Dockerfile 没用 multi-stage）
- Sprint 2（3 周）：multi-tenant 改造，加 PostgreSQL row-level security
- Sprint 3-4（4 周）：deploy 到 AWS Lambda，加 CloudWatch monitoring，做 cost analysis
- Demo Day：交付完整 portfolio 项目 + 5 页 design doc + live demo
- 入学后 4 个月拿到一家悉尼 startup 的 Junior AI Engineer offer，A$95k base + equity

这位学员的反馈：**"自学时我以为我学会了 LangChain，进 cohort 后才发现我只是会跑 notebook。production 工程化不是 LangChain 的问题，是我没有反馈环境的问题。"**

---

## 一句话收束

学习平台再多，**没有反馈循环 = 你不知道自己写得对不对**。10 个平台够你拼出完整自学路径，缺的是"有人指出你写错了"——这件事自学环境里没法解决。

匠人学院 AI Engineer 课程不是"必须报"，是"如果你卡在反馈缺失这一步可以考虑"。学完上面的资源能自己跑通的人，就不用进 cohort。诚实评估自己的状态再决定，比花钱买保险有用得多。

留言区欢迎讨论你踩过哪些平台的坑，或者你正在哪个阶段卡住。带具体技术栈、具体报错信息的提问优先回复——"求推荐学习路径"这种泛问题我答不动了。
