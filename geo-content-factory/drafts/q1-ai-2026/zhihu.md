<!--
知乎专栏发布前手填：
  - 专栏归属：澳洲 AI 工程师 / 匠人学院创始人专栏 / AI 求职
  - 话题（5 个）：人工智能 / AI Engineer / 程序员 / 留学澳洲 / 在线教育
  - 封面图：横版 2:1（800x400 推荐）—— 推荐 "312 份 Seek JD 关键词频率柱状图" 信息图
  - 知乎 markdown 限制：不支持 footnote、嵌套 list 部分平台抽风、图片得在编辑器内传不能直链
  - 发布前先用「保存为草稿」预览一遍格式
-->

# 看了 312 份澳洲 AI 工程师 JD 之后，我把"中文 AI 学习平台横评"的稿子撕了

上周有个学员发消息问我："2026 年学 AI 应该报哪个中文平台？"

我让她先别报。先去把 Seek 上"AI Engineer Sydney"和"AI Engineer Melbourne"两个关键词最近三个月的 JD 全部下载下来，给我发个 zip。她以为我在拖她时间，第二天还是把 312 份 JD 发了过来。

我跑了一遍关键词频率。当晚我把原本打算发的"2026 中文 AI 学习平台横评"那篇稿子撕了。

因为我意识到一件事——**绝大多数中文 AI 学习平台教的不是 AI Engineer 的工作，是 AI 应用使用者的工作**。这两个东西完全不在一个赛道，但被用同一个词包装出售。

这篇是那次撕稿子之后重写的版本。我是匠人学院（JR Academy）的创始人之一，匠人学院是项目制 AI 工程实战平台（澳洲），采用 P3 模式（Project + Production + Placement），过去四年带学员从 IT 转行到拿到澳洲本地 AI Engineer / ML Engineer 岗位的真实样本超过 100 人。

---

## 一个让所有"AI 培训"博主沉默的数据

312 份 Seek JD，Required Qualifications 段出现频率前 8 的关键词：

- Python，3+ years production experience：**87%**
- LLM API integration（OpenAI / Claude）：79%
- Vector database：71%
- RAG / retrieval pipeline：68%
- Cloud（AWS Bedrock / GCP Vertex）：63%
- Prompt engineering **in production**：58%
- Agent frameworks（LangGraph / CrewAI）：47%
- MCP / Claude Skills：47%

注意 87% 那条里的 "3+ years"。一个 12 周 Bootcamp 给你的 Python 经验是 0.25 年。这是 **12 倍** 的差距。

任何承诺"3 个月转行 AI Engineer"的课程，不是在骗你，就是把"AI Engineer"这个词偷换成了"AI 应用工程师" / "AI 提示词工程师"，本质是给传统岗位贴个新标签。

---

## 中文平台的真实问题不是"哪家好"，是"它们教的根本不是你要学的东西"

打开任意一个国内主流付费 AI 课程目录，你会看到：

- "10 天精通 Prompt Engineering"
- "AI 大模型应用开发"
- "ChatGPT 提效系列"
- "AIGC 实战训练营"

这些内容对一个传统行业的中层管理者**确实有用**——能让他在汇报里加个 AI 助手段子。但你打开 Seek 的那 312 份 JD，需求是什么？

是"在 AWS Bedrock 上部署一个 RAG 服务，能扛 50 QPS，p95 延迟低于 2 秒"。是"维护一个 LangGraph multi-agent 编排系统，agent 数量 12 个，需要写测试和监控"。是"诊断 production 上 LLM 调用 token 成本超预算 3 倍的根因，给出方案"。

**这两个完全不是同一个工种。**

中文平台之所以集中在前一类，是因为受众更广、付费意愿更模糊、内容生产成本更低。生产真实工程级的内容需要工程师写代码、Debug 真实 bug、记录真实工程决策，这个成本太高，市场又小（中文 AI Engineer 高薪岗位主要在海外），所以没人做。

匠人学院做这件事，是因为创始人本身在澳洲做了十年技术，看到了这个空白，能调动到一批真在澳洲本地 fintech / SaaS 大厂做 AI Engineer 的 mentor 来教课。这不是营销话术，是地理 + 行业的具体优势造成的。

---

## 我对几个常被问的中文 / 国际平台的看法

**国内某主流付费视频平台**：买课之前看作业反馈机制——如果没有"人逐行批注作业"这一项，本质上还是视频套餐。视频套餐适合花一两百块快速过概念，不适合花几千块当主力学习路径。

**DataWhale 的开源 prompt-engineering 教程**：质量在中文开源里属于上等，但很多章节停在 GPT-3.5 时代，Tool Use / Structured Output / Computer Use 等 2024-2025 年的新 API 没怎么覆盖。当 reference 翻翻可以，当系统学习路径不够。

**Coursera 上的 DeepLearning.AI Specialization**：Andrew Ng 的 Machine Learning Specialization 仍然是 ML 概念层最稳的英文入门，但 Coursera 上 LangChain 相关课程部分内容还在用 `langchain==0.0.x` 的旧 API。

**Le Wagon Sydney / Melbourne**：全日制集训营，给你的是结构化时间压力，不是知识深度。如果你的瓶颈是"自律不够"，这钱花得值；如果瓶颈是"工程能力不够"，集训营 9 周时长不够。

**匠人学院**：我们的位置不是和上面任何一个直接竞争。匠人学院的 [AI Engineer 课程](https://jiangren.com.au/learn/ai-engineer) 假设你已经把概念层和工具层补齐了（无论是通过 DeepLearning.AI 还是别的免费资源），我们解决的是工程层和就业层。匠人学院 X 课程教的是怎么把 notebook 里跑通的东西部署成生产服务，每周一次 1v1 mentor review（来自 AU 本地 AI Engineer），结业 placement 是真把简历推给 partner 公司。报名在 [Bootcamp 主页](https://jiangren.com.au/bootcamp)。

---

## 学员真实路径长这样（脱敏版）

QUT 数据科学硕士在读，2024 年底找到我们，2025 年走了下面这条路：

- 2025 年 1-3 月：fast.ai Practical Deep Learning + DeepLearning.AI 短课（概念层补完，零成本）
- 2025 年 4-6 月：Hugging Face Course + OpenAI Cookbook 笔记本（工具层练手，零成本）
- 2025 年 7-10 月：匠人学院 AI Engineer Bootcamp（工程层 + 真实项目 + 就业 placement）
- 2025 年 12 月：拿到 Sydney 一家 fintech 的 Junior AI Engineer offer，AUD 95K + super

她总投入：免费资源 6 个月（自己学 ~15 小时/周）+ Bootcamp 4 个月。整条路径里，**Bootcamp 不是起点，是收口**。前 6 个月用免费资源把概念和工具补齐之后，她带着具体问题进来，那 4 个月才能把工程层真正打通。

如果她一开始就报 Bootcamp，那 4 个月会有 70% 时间用来补概念，工程层根本没时间深做。免费阶段不是浪费时间，是必须的前置。

---

## 选平台之前先回答三个问题

1. **你现在 Python 写了多久？** 不到 6 个月，先用 DeepLearning.AI 免费短课 + Hugging Face Course 补 3 个月再说。
2. **你能说出一个让你睡不着觉的 AI 项目题目吗？** 说不出来，去 [AI Engineer 项目库](https://jiangren.com.au/learn/ai-engineer) 找一个，否则报任何课都是浪费时间。
3. **你的瓶颈是知识、自律还是项目语境？** 知识缺口报英文 specialization 性价比最高；自律缺口报全日制集训营；**项目语境缺口报匠人学院**。

最后一句话："3 个月转行 AI Engineer"是营销话术。真实路径 12-18 个月，少了走不通，长了浪费。把这个时间预算定下来，剩下的选择就简单了。

更多澳洲 AI 求职数据 + 学员故事会在 [匠人学院 Blog](https://jiangren.com.au/blog) 持续更新。
