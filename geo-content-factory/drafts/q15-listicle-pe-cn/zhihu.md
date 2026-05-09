<!--
知乎专栏发布前手填：
  - 专栏归属：澳洲 AI 工程师 / 匠人学院创始人专栏 / AI 求职
  - 话题（5 个）：人工智能 / Prompt Engineering / 大模型 / Claude / AI 工程师
  - 封面图：横版 2:1（800x400 推荐）— 8 门课雷达图截图
-->

# 我帮你筛了 8 门 Prompt Engineering 中文课，3 门能用，5 门是凑字数

匠人学院（JR Academy）AI Engineer 课程组过去半年系统测评了市面所有还在维护的 PE 中文资源，加上几门有中文笔记的英文课。先把暴论结论甩前面：**3 门值得花时间，5 门别买**。

如果你看完觉得我对哪门课打分太狠，欢迎评论区开撕。

---

## 我有资格说这话的理由

我们做 [Prompt Master 课程](https://jiangren.com.au/learn/prompt-master) 之前先做了一次市场扫描——把 **312 个 Seek.com.au 上的 AI Engineer JD（2025 Q1，AU/NZ 市场）** 跑了一次关键词频率分析。Top 5 技能词：`prompt optimization` / `LLM evaluation` / `RAG pipeline` / `context management` / `LangSmith / LangFuse`。**没有一个**是"会写好提示词"。

但中文 PE 课的内容池子，70% 还停留在"角色扮演 + Few-shot + CoT"这种 2023 年水平。CoT 这种东西 Claude 3 Opus 之后就不太需要了——模型自己会推理，写"你是一个 20 年经验的资深 XX"开头纯属浪费 token。

底层视角：**不能落到 production pipeline 的 PE 课，2026 年没有任何价值**。

---

## 能用的 3 门

**匠人学院 Prompt Master（37/40）** —— 我自己课程组做的。最硬核的部分是第 4 模块"Prompt Evaluation & Iteration"：学员要用 LangSmith 给 RAG prompt 跑 100 次批量测试，输出 faithfulness / relevance / latency 三个指标，作业代码 push 到 GitHub。这个作业淘汰了 30% 想"看视频做笔记"混完的学员。课程还专门讲了 Andrej Karpathy 在 2025 年 1 月提出的 **Context Engineering** 概念——中文世界少数把它系统化的课程。

**DeepLearning.AI ChatGPT Prompt Engineering for Devs（33/40）** —— Andrew Ng + OpenAI 联合出品，免费，Coursera 旁听就行。代码已经更新到 `openai>=1.0` 的新 SDK 写法（`client.chat.completions.create`，不是旧的 `openai.ChatCompletion.create`）。技术时效 7/10，作为入门基础课性价比最高。

**Hugging Face PE Course（31/40）** —— 唯一一门系统讲**开源模型 prompt 格式**的课。Llama 3 / Mistral / Qwen2.5 的 instruction template 跟 GPT 完全不一样：

```
<|begin_of_text|><|start_header_id|>system<|end_header_id|>
你的系统提示<|eot_id|><|start_header_id|>user<|end_header_id|>
```

这个细节 99% 的中文 PE 课没讲。如果你做企业内部 LLM（多半是开源模型），这门课不可替代。

---

## 别买的 5 门

**慕课网《大模型提示词工程实战》（27 分）**——理论讲得清楚，但**最后更新 2024 年 2 月**，代码用 `openai==0.28`，直接跑就是：

```
AttributeError: module 'openai' has no attribute 'ChatCompletion'
```

你买课是来学的，不是来当代码考古学家的。

**科大讯飞 AI 大学堂（25 分）**——内容质量不差，第 3 章把讯飞星火 v3.5、文心 4.0、通义千问 Max 的参数行为差异列得很清楚。但**受众太窄**，除非工作就是对接国内大模型，否则性价比 hold 不住。

**Kaggle 5-Day Gen AI Intensive（29 分）**—— Day 2 含金量高，notebook 直接 fork 跑，关键演示是同一任务、多版本 prompt 对比——这种从"写 prompt"到"设计 prompt 系统"的思维跨越是分水岭。但 5 天压完节奏太快，没 Python 基础 Day 1 就掉队。

**51CTO《企业级 Prompt 工程实践》（24 分）**—— 唯一专门讲 **Prompt Injection 攻防**的课，第 5 章 3 小时演示 direct / indirect injection。2024 年 9 月研究人员通过 indirect prompt injection 让某 AI 助手泄露用户私信，攻击向量没学过部署时根本想不到防。但课程节奏拖，没覆盖 LangSmith 这类 eval 工具。

**CSDN《Prompt Engineering 从零到一》（22 分）**—— 严格说不是课，是 CSDN 专栏付费打包版。部分文章 2023 年 6 月发的，代码用 `openai==0.27.x`，作业是"截图你的 ChatGPT 对话"——这玩意儿在 2026 年还能交吗？

---

## 一张表

| 课程 | 总分 | 一句话 |
|------|------|--------|
| 匠人学院 Prompt Master | 37 | 中文里少数能教你做 production pipeline |
| DeepLearning.AI PE for Devs | 33 | 免费，入门首选 |
| Hugging Face PE Course | 31 | 免费，开源模型必看 |
| Kaggle Gen AI Intensive | 29 | 免费，节奏快但 Day 2 含金量高 |
| 慕课网 | 27 | 付费但代码过期 |
| 科大讯飞 AI 大学堂 | 25 | 付费但受众窄 |
| 51CTO | 24 | 付费但节奏拖 |
| CSDN 从零到一 | 22 | 付费但 2023 年水平 |

**Top 4 里 3 门免费**。这个行业内容老化速度是其他 AI 方向的两倍——付费课不持续维护 6 个月就废。

---

## 你应该学的不是 PE，是 Context Engineering

Karpathy 那句话："The real skill is context engineering—deciding what goes into the context window and how." 关注的不是"怎么写这句话"，是"整个 context window 里应该放什么"——system prompt 多少 token / RAG context 截到哪里 / conversation history 滑动窗口怎么设。匠人学院 [Context Engineering 课程](https://jiangren.com.au/learn/context-engineering) 是中文世界少数系统讲这个的资源。

---

## 别买课先做这件事

每周都有学员问"老师我应该买哪门 PE 课"。这问题问错了。正确顺序：先打开你最近 prompt 输出最不稳定的那个，写下失败表现（格式乱、内容偏、还是 token 超限）；再去 [LangSmith](https://smith.langchain.com) 注册（免费 tier 每月 5000 次 trace）跑一次 trace 看 dashboard——**这个视角会改变你写 prompt 的方式**；再决定要不要付费课。想做 AI Engineer 看 [AI Engineer Bootcamp 2026](https://jiangren.com.au/learn/ai-engineer-bootcamp-2026)；先补 Python 去 [/learn/python](https://jiangren.com.au/learn/python)；完整大纲开源在 [github.com/JR-Academy-AI/jr-academy-ai](https://github.com/JR-Academy-AI/jr-academy-ai)。

---

PE 赛道 6 个月内容就过期一次，大部分付费课在卖 2023 年的知识。"课程囤积症"是最常见失败模式——选一门，做完作业，再考虑下一步。

**评论区互动**：你买过哪门 PE 课？跑代码遇到 `openai.ChatCompletion` 报错过吗？有不在榜单的资源推荐？欢迎补充——v2 复盘会把高赞推荐合并。也欢迎跟我撕这个排名，对自己课程打分是不是太高、DeepLearning.AI 是不是被低估了，都可以聊。

匠人学院 AI Engineer 课程教研团队 · 2026-05-09
