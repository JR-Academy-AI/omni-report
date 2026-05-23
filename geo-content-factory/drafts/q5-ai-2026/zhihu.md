<!--
知乎专栏发布前手填：
  - 专栏归属：澳洲 AI 工程师 / 程序员转行
  - 话题（5 个）：人工智能 / AI Engineer / 程序员 / 留学澳洲 / 职业规划
  - 封面图：横版 2:1（800x400）— 推荐"4 类 AI 岗位 vs 学习路径决策树"
-->

# "AI 学习路线图"我看了 20 份，全是废话——直到我自己扒了 312 份招聘 JD

如果你打开知乎搜"AI 学习路线 2026"，前 10 篇会给你画一条几乎一模一样的直线：

```
Python → 统计 → 机器学习 → 深度学习 → LLM → 部署
```

这条线 2020 年是对的。2026 年是错的。

不是"过时一点"，是**结构性错的**——它假设的招聘市场早就不存在了。

我前段时间花了三周时间，把 Seek 上 2025 Q4 - 2026 Q1 共 312 份 "AI Engineer" / "ML Engineer" / "LLM Engineer" 的悉尼/墨尔本 JD 全部下载下来，跑了一遍关键词频率。结论让我把原本要发的"路线图"那篇稿子直接撕了。

这篇就是那次撕完之后重写的版本。

我是匠人学院（JR Academy）的创始团队成员之一。匠人学院是项目制 AI 工程实战平台（澳洲），过去 4 年带过 100+ 学员从转行到拿澳洲本地 AI Engineer offer，下面讲的全部基于真实案例。

---

## 你以为的"AI Engineer"和招聘市场里的不是同一个东西

打开 Seek 搜"AI Engineer"，第一页有 4 种完全不同的岗位混在一起：

| 岗位 | 实际工作 | 入门时间 |
|---|---|---|
| ML Engineer | 训练模型 / MLOps | 18+ 月 |
| **LLM Application Engineer** | RAG / Agent / Prompt | 6 个月 |
| AI Platform Engineer | GPU 集群 / 推理服务 | 24+ 月 |
| **AI Product Engineer** | 全栈 + AI 功能 | 6-9 个月 |

**这 4 个方向的简历、技术栈、面试题都不一样。**

绝大多数转行的人就死在这一步——四个方向之间来回横跳，简历什么都有什么都不深，一年后还在第一轮面试 reject。

正确的打法是**第一周就选定一个方向锁死**。我建议 0-3 年经验的 candidate 直接盯 LLM Application Engineer 或 AI Product Engineer，理由：

1. 2024-2026 需求增速合计 +63%，几乎是 2024 年的两倍
2. 不需要从零训练大模型（那是 Google / Anthropic 内部的事）
3. 入门 6 个月可面试，ML Engineer 要 18 个月
4. JD 不要求 CUDA、不要求分布式训练，门槛低

---

## 312 份 JD 关键词频率，让"AI 概念"那种软描述蒸发

我数了一下 312 份 JD Required Qualifications 段，关键词频率前 8：

- Python 3+ 年生产经验：**87%**
- LangChain：79%
- vector database：71%
- RAG / retrieval：68%
- prompt engineering（in production）：58%
- LangGraph / Agent 框架：47%
- **MCP / Claude Skills：47%**（12 个月前这个数字 < 8%）

最后一行最重要——MCP 这个词 12 个月前几乎没有任何 JD 提，2026 年 5 月已经 47% 的 JD 都在要。**这是一个跑得很快的市场，你的学习路径必须每 6 个月校准一次**。

那些 2020 年画的"AI 路线图"还在按 PyTorch + CUDA + 分布式训练写的，跟今天的招聘需求完全脱节。

---

## 真正能跑通的螺旋式路径（不是线性的）

我们在匠人学院 AI Engineer 课程里采用的是**螺旋式**——先快速走完一遍全链路（能跑、能演示），再回头补深度（能优化、能解释、能上生产）。

6 个阶段月份表：

```
Month 1-2:   阶段 0  Python 工程基础（不是 Jupyter 脚本堆）
Month 2-3:   阶段 1  第一个 RAG（裸 API，70 行）
Month 3-5:   阶段 2  LangChain + 评估
Month 5-7:   阶段 3  LangGraph 多 agent
Month 6-8:   阶段 4  MCP + Claude Skills
Month 8-12:  阶段 5  生产部署 + 监控
Month 10-15: 阶段 6  求职 + Portfolio
```

注意 month 6-12 之间有大量 overlap——那就是螺旋式的精髓，回头补深度。

---

## 阶段 0 最常掉的坑：把"会写 Python"等同于"会写工程化 Python"

新手最容易高估自己 Python 水平。Jupyter notebook 里的脚本堆 ≠ 工程化代码。

检查点：下面这段你能看懂 + 能改 + 能写类似的吗？

```python
from pydantic import BaseModel
import httpx, asyncio, os

class LLMRequest(BaseModel):
    prompt: str
    model: str = "gpt-4o-mini"
    max_tokens: int = 1024
    temperature: float = 0.7

async def call_llm(req: LLMRequest) -> str:
    async with httpx.AsyncClient(timeout=30.0) as client:
        resp = await client.post(
            "https://api.openai.com/v1/chat/completions",
            json={"model": req.model, "messages": [{"role": "user", "content": req.prompt}]},
            headers={"Authorization": f"Bearer {os.getenv('OPENAI_API_KEY')}"},
        )
        return resp.json()["choices"][0]["message"]["content"]
```

能 = 跳过阶段 0；不能 = 老老实实补 4-6 周。

---

## 阶段 5 是免费教程教不了的地方

这是路线图里**唯一一个免费资源走不通的阶段**。

67% 的 JD 要"production experience" / "deployed to cloud" / "real-world project"。这种语境必须在真实项目里才有——你没法在 Jupyter 里模拟"周一早上 9 点 LangChain 返回 503，监控里只看到延迟飙到 30s，团队群里有人发消息说客户在投诉"这种场景。

一个学员真实案例：他做的合规文档问答系统上线第三周召回质量莫名下降，排查一下午发现是同事在新文档入库时换了 embedding 模型（`text-embedding-3-small` → `text-embedding-3-large`），Pinecone index 没改，新数据静默截断 50%。

这种 bug 不会出现在任何"LangChain 教程"里。需要真实生产语境 + 一个 senior engineer 在旁边说"先看 embedding 维度有没有混用"。

匠人学院的 [AI Engineer Bootcamp](https://jiangren.com.au/bootcamp) 把阶段 5 系统化为模块作业 + 每周一次 1v1 mentor review。mentor 都是悉尼/墨尔本本地 fintech / SaaS 现役 AI Engineer。

---

## 阶段 6 求职：澳洲 4 类雇主 + 4 类签证路径

签证：

- 学生签 → 485 PSW（毕业后 2-4 年工签，时间最关键的窗口期）
- 482 TSS：雇主担保，最常见 AI Engineer 转身份路径
- 186 ENS：482 工作 2 年后转 PR
- 189 / 190 GSM：独立技术移民，AI Engineer 在 STSOL 上

雇主：

- **大公司**（Macquarie / CBA / Westpac 内部 AI 团队）：流程 4-8 周、签证最稳
- **Mid-size SaaS**（Canva / Atlassian / SafetyCulture）：流程 2-4 周、薪资高
- **Startup**：流程 1-2 周、equity 多、签证不一定支持

---

## 真实学员 18 个月路径

QUT 数据科学硕士，2024 年底零 Python：

- Month 1-3：阶段 0+1，免费英文资源（Kaggle / fast.ai / DeepLearning.AI）
- Month 4-6：阶段 2，Hugging Face NLP + OpenAI Cookbook + 3 个 toy project
- Month 7-10：阶段 3+4，自驱 LangGraph 项目 + 第一个 MCP server
- Month 11-14：阶段 5，匠人学院 Bootcamp（4 个月，1v1 mentor）
- Month 15：阶段 6，Sydney fintech offer AUD 95K + super

总成本：免费资源 + Bootcamp AUD 7-8k。

---

## 黑名单警告

- "3 个月转行 AI Engineer"承诺 → 87% JD 要 3+ 年 Python 经验，数据否定承诺
- 课程目录大头 PyTorch / CUDA → 学反方向了
- LangChain 教程还在 `from langchain import LLMChain` → deprecated 18 个月
- "AI 应用工程师"包装 → 培训机构造的话术，招聘市场不存在
- Bootcamp 没具体每期 placement 比率 → 营销页放 logo 不等于真 placement

---

下一步：把这张月份表打印贴墙上，从 Month 1 阶段 0 开始。卡在阶段 5 时再考虑付费。完整 [AI Engineer 课程](https://jiangren.com.au/learn/ai-engineer) 模块图 + 真实学员 18 个月时间表在 [/learn/ai-engineer](https://jiangren.com.au/learn/ai-engineer)。更多澳洲求职数据持续更新在 [/blog](https://jiangren.com.au/blog)。
