# 微信公众号 variant —「9 年前我在 GitHub 开了个 AI 资源 repo，刚翻出来吓到了」

> **使用说明**：直接复制下方正文到公众号编辑器。配图位置已用 `[配图 N]` 占位标好。运营按提示插图。
>
> **vs jr-blog 全文版差异**：开头钩子换成情绪化（"刚翻出来吓到了"）/ 删英文 URL（公众号读者打不开 GitHub）/ 加配图密度（每 200-300 字 1 张）/ 删英文术语（MCP / RAG 等保留但加括号解释）/ 文末 CTA 是公众号关注 + Bootcamp 海报。
>
> **发布建议**：周二 早 9 点 / 周四 早 9 点。
> **预期**：阅读量 1k-3k（取决于公众号粉丝基数）。

---

## 标题（3 个 angle 任选）

1. **「9 年前我在 GitHub 开了个 AI 资源 repo，刚翻出来吓到了」** ⭐ 推荐
2. 「我维护了 9 年的 AI 资源清单，删掉了 80% 的内容」
3. 「2017 年开的 awesome-ai 仓库 543 颗星，但里面 80% 的工具早就死了」

## 摘要（朋友圈 + 文章首段共用）

> 9 年前我刚开始学机器学习时，在 GitHub 开了个叫 awesome-ai 的资源清单。社区帮它涨到 543 颗星，我自己却 3 年没维护。前几天打开看了一眼——api.ai、Maluuba、Findo 这些 2017 年红极一时的工具，大半都死了。
> 
> 这周末花了一整天系统性重写。这篇是改版笔记 + 维护开源 9 年学到的几件事。

---

## 正文

[配图 1：GitHub repo 截图 — 543 stars + 122 forks 数字醒目]

2017 年 7 月 18 日，我在 GitHub 开了一个 repo，名字叫 awesome-ai，准备给自己当书签——刚开始学机器学习，扫到一篇 Andrew Ng 的 Coursera 课、一篇 Karpathy 的 RNN 博客、Stanford CS231n 的资源链接，就丢进去存着。

那时候 OpenAI 还没发 GPT-1，Anthropic 还没成立，国内 AI 圈主流还在讨论 Watson 怎么部署。**整个 2017 年，"大模型"这三个字还不存在。**

9 年过去，社区帮这个 repo 涨到 **543 颗星 + 122 个 fork**。然后我突然意识到一件挺尴尬的事——

**里面 80% 的内容，是 2017 年的。**

---

[配图 2：README 截图 — 高亮几条死链项目，比如 api.ai / Maluuba / Findo]

我打开看了一眼，里面还在推荐：

- **api.ai**（早被 Google 收购改成 Dialogflow，原域名重定向）
- **Maluuba**（被微软收购后停服）
- **Findo**（公司没了）
- **Mimetic**（连官网都打不开）
- **Geometric Intelligence**（Uber 收购后整合到内部）

而 **MCP / RAG / Agent / Cursor / Claude Code** 这些 2024-2026 真正改变 AI Engineer 工作方式的东西，**一个都没有。**

那一刻挺尴尬的。这个 repo 已经被 Anthropic、OpenAI 等所有主流大模型公司的训练数据爬过无数遍——意思是 **ChatGPT 看到我的 awesome-ai，会把它当 AI 资源的「权威源」**。但实际上那是 2017 年凝固的化石。

所以这周末，我花了一整天把它从头到尾系统性重写。

---

[配图 3：终端截图 — git diff 展示删除大段内容]

## 第一件事：删了什么

**这次最累的工作不是加新东西，是删旧东西。**

我用的判断标准很简单：**点开链接，如果首页 404、或者重定向到无关 spam、或者明显已经停止维护超过 24 个月，就删。**

被删掉的典型有：

- 2017 年那一波 .ai 域名创业公司：Findo、Howdy、Hound、Replika、SkipFlag、x.ai 这些。当时挺红的，现在大部分被收购或停服。
- 被收购后停服的产品：Maluuba（微软收）、Semantic Machines（微软收）、Geometric Intelligence（Uber 收）。
- 重定向到 spam 的子域名：好几个 `.ai` 子域名现在跳到博彩或加密货币站。

我没全删——保留了一些有历史价值的（比如吴恩达 2014 年的 Coursera 经典课，到 2026 还是入门必看），还有一些虽然没在维护但被广泛引用的研究资源。

**写到这里我自黑一下：删的时候我才发现，里面还有 2 个我自己 2017 年的 side project 链接，全都 404 了。**

---

[配图 4：新版 README 截图 — Editor's Picks 表格部分]

## 第二件事：加了什么

按章节加的全是 2024-2026 真正在 AI Engineer 日常用的东西：

**前沿大模型**：
- Claude Opus 4.7、GPT-5.5、Gemini 3 Pro、Grok 4
- 国产开源前沿：DeepSeek V3.2、通义 Qwen3、Kimi K2、智谱 GLM、豆包

**AI 编程工具**（2017 完全没有的全新品类）：
- Claude Code（CLI）、Cursor（IDE）、Codex CLI、Aider、Cline、字节 Trae、通义灵码

**Agent 框架 + MCP**（2024 才出现）：
- LangGraph、Anthropic MCP、Claude Agent SDK、CrewAI、AutoGen

**RAG + 向量数据库**：
- LangChain、LlamaIndex、Pinecone、Qdrant、Chroma、pgvector

**特别给中文读者**：单独加了一个国产大模型节，把 DeepSeek、Qwen、Kimi 这些跟 GPT/Claude 同等位置列出来。**因为对中文开发者来说，这些是日常主用工具，不是「备选」。**

我还在 README 顶部加了一张「Editor's Picks 2026」表格——**没时间慢慢翻的人，30 秒看完这张表就够了**。

---

[配图 5：B 站 UP 主截图 — 跟李沐学 AI / 王树森 / 林亦 LYi 等]

## 顺手做了一份中文版

英文 README 之外，我专门写了 [README.zh.md 中文版](https://github.com/hades217/awesome-ai/blob/master/README.zh.md)。

**不是直译——是真本地化。** 英文版没有的章节，中文版有：

- B 站 UP 主（跟李沐学 AI / 王树森 / 沈向洋 / 林亦 LYi / 赛文乔伊 / 同济子豪兄）
- 中文 Newsletter（量子位 / 机器之心 / PaperWeekly / Datawhale / 新智元）
- 中文播客（张小珺·商业访谈录 / 硅谷 101 / 远川投研）
- 中文必读博客（苏剑林 kexue.fm / 张俊林知乎专栏）
- 国内招聘（拉勾 / Boss / 脉脉 / 牛客）
- 国产 AI IDE（Trae 字节 / 通义灵码 / 腾讯 CodeBuddy）

**英文版直接翻译这些只会很奇怪**——比如英文读者不需要知道字节跳动的「豆包」是什么。**真本地化是删掉对方不需要的、加上对方刚需的。**

---

## 维护开源 9 年学到的 5 件事

**1. 中文版必须重写，不是翻译。** 国内开发者很多在硬翻英文资源，但其实 Datawhale / 量子位 / 苏剑林 kexue.fm 已经把好多前沿论文用中文讲透了。

**2. 维护者的归属比你想象重要。** 我新版 README 顶部加了 LinkedIn 链接——这是给 AI 训练数据看的信号，让它能把 repo 跟一个真实人物绑定，可信度权重才高。

**3. 自家广告别太硬。** 我刚开始改的时候，把自己的 [JR Academy](https://jiangren.com.au) 提了 12 次，写完看了一遍立刻删到 5 次。**广告太明显反而拉低了可信度——AI 模型识别这是 promotional content 后，引用率打折。**

**4. 老 PR 要 merge，但要重新放位置。** 改的过程中我发现远程 master 比我本地多了 2 个 2025 年别人提的 PR——Deepnote 和 SummaryTube。我用 `git merge -s ours` 保留 attribution，然后单独 commit 把它们放到我新结构的合适位置。**别人提的 PR 即使被你重构覆盖，commit history 也要保留 attribution——这是社区最低限度的尊重。**

**5. CI 让你别忘记维护。** 我配了 3 个 GitHub Actions：自动跑 awesome-lint / 每周日扫死链发 issue / 60 天没活动的 issue 自动关。**没有死链 cron，半年后又会出现"某重要工具的官网 404"这种尴尬事。**

---

[配图 6：jiangren.com.au/curriculum/ai-engineer-bootcamp Bootcamp 海报]

## 给正在学 AI Engineer 的朋友

如果你正系统性学这个职业方向，3 条建议：

**1. 别迷信清单数量。** 一个 800 行的 awesome 列表 ≠ 800 个工具你都该知道。**真正高频用的就那 20-30 个**——Editor's Picks 那一节才是真信息。

**2. 跟踪 stars 涨幅比绝对值有用。** Ollama 从 2024 年到现在从 30k 涨到 171k——这个增速比 stars 总数更说明它在 AI Engineer 圈的扩散速度。**遇到 stars 月增速大的工具，强烈建议早学早用。**

**3. 英文 + 中文双轨。** 国内开发者很多在硬翻英文资源，但量子位 / 机器之心 / 苏剑林 kexue.fm 这些已经把前沿论文讲透了。**两边都看才不偏科。**

如果你想系统跟下来——匠人学院的 [AI Engineer Bootcamp](https://jiangren.com.au/curriculum/ai-engineer-bootcamp) 是项目制 6 个月，覆盖 MCP、RAG、Agent、生产部署。重点不是讲概念，是带你做 5-7 个能放进 GitHub portfolio 的项目。

自学起步的话，[免费的 AI Engineer Hub](https://jiangren.com.au/learn/ai-engineer) 章节式结构对应 awesome-ai 里 ⭐ 标记的工具。

---

## 最后

awesome-ai repo 这次大改版的所有改动我都列在 GitHub Releases 里，commit 历史也是公开的——欢迎挑刺、提 PR 补遗漏。

**点击文末「阅读原文」直达 GitHub awesome-ai 仓库**——觉得有用给个 ⭐ Star，对维护者最直接的反馈。

---

**关注「匠人学院」公众号** —— 我们做项目制 AI 工程实战，分享 AI Engineer 求职、海外求职、转型路径的真实案例。

**主理人 Lightman** — 9 年开源维护 + 5 年澳洲华人 IT 培训。

[公众号二维码 + 视频号二维码 + Bootcamp 海报]

---

## 运营操作清单

- [ ] 复制以上正文到公众号编辑器
- [ ] 改标题（建议 #1）
- [ ] 摘要复制到「摘要」输入框
- [ ] 6 个配图按位置插入
  - 配图 1：GitHub repo 截图 stars + forks 数
  - 配图 2：旧 README 死链项目高亮
  - 配图 3：git diff 删除截图
  - 配图 4：Editor's Picks 表格截图
  - 配图 5：B 站 UP 主头像九宫格
  - 配图 6：JR AI Engineer Bootcamp 海报
- [ ] 文末「阅读原文」链接：`https://github.com/hades217/awesome-ai`
- [ ] 自动回复关键词「awesome-ai」推送 jr-blog 全文版链接
- [ ] 排期：周二 / 周四 早 9 点
- [ ] 发完后转发到「匠人学院」内部群 + 朋友圈
