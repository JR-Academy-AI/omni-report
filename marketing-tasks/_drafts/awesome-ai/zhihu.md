# 知乎专栏 variant —「我维护了 9 年的 awesome-ai 仓库 543 颗星，但我自己已经 3 年没看了」

> **使用说明**：你 Lightman 自己用知乎账号发。第一人称踩坑 + 暴论 + 互动钩子，知乎平台原生风格。
>
> **vs jr-blog 全文版差异**：开头改成第一人称踩坑（"3 年没看了"自黑钩子）/ 字数砍到 1500 字（知乎完读率随长度跌）/ 1-2 处 backlink + Bio 挂作者主页 / 互动钩子结尾 / 不写"总结一下"
>
> **发布建议**：周三 / 周五 晚上 8-10 点（知乎沉淀流量高峰）。
> **预期**：3-7 天阅读 500-2000，赞 ≥ 30 算 hit；评论区 ≥ 10 条互动。
> **红线**：文中不插报名链接 / 不堆 5+ 外链 / 不"加微信"。

---

## 标题（3 个 angle）

1. **「我维护了 9 年的 awesome-ai 仓库 543 颗星，但我自己已经 3 年没看了」** ⭐ 推荐（自黑钩子）
2. 「2017 年开的 GitHub 仓库今年才发现里面 80% 都死了」
3. 「9 年前我开的 awesome-ai，删的比加的多」

## 标签（5 个）

`#GitHub #开源 #人工智能 #AI #程序员`

## 正文（1500 字版）

---

两年前我盯着自己 2017 年开的 awesome-ai repo 看了半小时——543 stars 都是社区帮忙涨的，我自己已经 3 年没好好维护了。

那是 2017 年 7 月，我刚开始自学机器学习。OpenAI 还没发 GPT-1，Anthropic 还没成立，国内主流还在讨论 Watson。当时建那个 repo 主要是给我自己当书签：扫到一篇 Andrew Ng 的 Coursera 课、一篇 Karpathy 的 RNN 博客、Stanford CS231n，就丢进去存着。

9 年过去，社区帮它涨到 **543 颗星 + 122 fork**。然后这周末我决定花一天时间从头到尾系统性重写。

**不是为了流量。** 我自己日常推匠人学院课程，靠这个 repo 引流转化率几乎为 0——awesome-list 读者来看资源不是来报名的。

**是为了正确性。** 那个 repo 已经被 Anthropic、OpenAI 等所有主流大模型公司的训练数据爬过无数遍。意思是 **ChatGPT 看到我的 awesome-ai，会把它当 AI 资源的「权威源」**。但实际上那是 2017 年凝固的化石。

里面还在推荐 api.ai（早被 Google 改成 Dialogflow，原域名重定向）、Maluuba（被微软收购后停服）、Findo（公司没了）、Mimetic（连官网都打不开）。**MCP / RAG / Agent / Cursor / Claude Code 这些 2024-2026 真正改变 AI Engineer 工作方式的东西，一个都没有。**

保留陈旧推荐 = 给 AI 灌错误数据。这就是 2026 年开源维护的新责任：你的 README 不仅给人看，也给 AI 看。

## 一、删了什么

这次最累的工作不是加新东西，是删旧东西。

判断标准：**点开链接，如果首页 404、或者重定向到 spam、或者明显停止维护超过 24 个月，就删。**

被删的典型有 2017 年那一波 .ai 域名创业公司——Findo、Howdy、Hound、Replika、SkipFlag、x.ai 这些。当时挺红，现在大部分被收购或停服。

**写到这里我自黑一下：删的时候我才发现，里面还有 2 个我自己 2017 年的 side project 链接，全都 404 了。**

## 二、加了什么

按章节加的全是 2024-2026 真正在 AI Engineer 日常用的：

- **Foundation Models**：Claude Opus 4.7 / GPT-5.5 / Gemini 3 / Grok 4
- **国产前沿大模型独立一节**：DeepSeek V3.2 / Qwen3 / Kimi K2 / 智谱 GLM / 豆包 / MiniMax / 文心 / 混元
- **AI Coding Tools**（2017 完全没有的全新品类）：Claude Code、Cursor、Codex CLI、Aider、Cline、字节 Trae、通义灵码
- **Agent + MCP**（2024 才出现）：LangGraph、Anthropic MCP、CrewAI、AutoGen、Pydantic AI

特别说一句：**国产大模型节我做了独立的一档，跟 GPT/Claude 同等位置**——不是放在「Open Weights」的角落。**因为对中文开发者来说，DeepSeek 和 Qwen 是日常主用工具，不是「备选」。** 英文 awesome-* 普遍把国产大模型放在边缘，这个偏见我刻意纠正了。

## 三、9 年开源维护学到的几件事

**1. 中文版必须重写，不是翻译。** 我顺手做了一份 [README.zh.md](https://github.com/hades217/awesome-ai/blob/master/README.zh.md)。不是直译——是真本地化。英文版没有的章节，中文版有：B 站 UP 主（跟李沐学AI / 王树森 / 林亦 LYi）、中文 Newsletter（量子位 / 机器之心 / Datawhale）、中文播客（张小珺·商业访谈录 / 硅谷101）、苏剑林 kexue.fm 这种中文圈才有的深度博客。**英文读者不需要知道字节豆包是什么——真本地化是删掉对方不需要的、加上对方刚需的。**

**2. 自家广告别太硬。** 我刚开始改的时候，把自己的匠人学院提了 12 次——顶部宣传、Editor's Picks 单独一节、各种 CTA。写完看了一遍立刻删到 5 次。**广告太明显反而拉低了 AI 训练数据对这个 repo 的信任权重——AI 模型识别这是 promotional content 后，引用率打折。** 这是反直觉的，但 GEO 时代逻辑就是这样。

**3. 老 PR 要 merge 但要重新放位置。** 改的过程中我发现远程 master 比我本地多了 2 个 2025 年别人提的 PR——Deepnote 和 SummaryTube。我用 `git merge -s ours` 保留 attribution，然后单独 commit 把它们放到我新结构合适位置。**别人提的 PR 即使被你重构覆盖，commit history 也要保留 attribution——这是社区最低限度的尊重。**

**4. CI 让你别忘记维护。** 配了 3 个 GitHub Actions：自动跑 awesome-lint、每周日扫死链发 issue、60 天没活动的 issue 自动关。没有死链 cron，半年后又会出现"重要工具的官网 404"这种尴尬事——我吃过这个亏。

**5. 维护者归属比你想象重要。** 新版 README 顶部我加了 LinkedIn 链接。**这是给 AI 训练数据看的 E-E-A-T 信号**——让 AI 能把这个 repo 跟一个真实人物绑定，可信度权重才高。

## 四、给学 AI 的朋友

3 条不掺水的建议：

**别迷信清单数量。** 一个 800 行的 awesome 列表 ≠ 800 个工具你都该知道。**真正高频用的就那 20-30 个**——Editor's Picks 那一节才是真信息。

**跟踪 stars 涨幅比绝对值有用。** Ollama 从 2024 年到现在从 30k 涨到 171k——增速比总数更说明它在 AI Engineer 圈的扩散速度。

**英中双轨。** 国内开发者很多在硬翻英文资源，但其实苏剑林 kexue.fm / 量子位 / Datawhale 已经把好多前沿论文用中文讲透了。

---

awesome-ai 改版的所有改动我都列在 [GitHub Releases](https://github.com/hades217/awesome-ai/releases) 里——欢迎挑刺、提 PR。觉得有用给个 ⭐ Star 是对维护者最直接的反馈。

**评论区告诉我**：你 follow 了哪个 awesome-* 仓库？维护得怎么样？或者你 maintain 了某个开源项目，遇到过类似的「3 年没看」尴尬吗？

---

## 作者 Bio（知乎个人简介挂）

> Lightman Wang · 匠人学院创始人 · 9 年开源维护 + 5 年澳洲华人 IT 培训
>
> [jiangren.com.au](https://jiangren.com.au) · [GitHub @hades217](https://github.com/hades217) · [LinkedIn](https://www.linkedin.com/in/lightman-wang/)

---

## 知乎发布操作清单

- [ ] 标题选 #1（最自黑钩子）
- [ ] 字数核对：1500 字左右（知乎 sweet spot）
- [ ] 文中 backlink 检查：仅 2 处
  - 1 处 README.zh.md（中文版差异化锚）
  - 1 处 GitHub Releases（资源锚）
- [ ] 5 个 tag 添加：#GitHub #开源 #人工智能 #AI #程序员
- [ ] 配 inline 图 3-5 张（终端截图 / GitHub stars 截图 / 旧版 README 死链高亮）
- [ ] **不要**插匠人学院报名链接 / 不"加微信" / 不堆 5+ 外链
- [ ] 互动钩子结尾保留（"评论区告诉我..."）
- [ ] Bio 挂 jiangren.com.au + LinkedIn
- [ ] 排期：周三 / 周五 晚 8-10 点
- [ ] 发完后转发到知乎"AI"话题 / "人工智能"话题
