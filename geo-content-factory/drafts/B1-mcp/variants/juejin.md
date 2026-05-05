# MCP 实战：5 个生产级 Server 串起来做 AI 求职助手

> **variant**: juejin · 掘金实战项目版
> **master**: ../master.md
> **platform**: 掘金
> **target word count**: 3000
> **status**: skeleton — 待填

---

## 差异化策略（vs master 4 维度）

| 维度 | 选择 | 理由 |
|---|---|---|
| 标题钩子 | 「实战：5 个 Server 串起来做 AI 求职助手」 | 掘金读者吃"实战项目" + 业务场景 |
| 开头 50 字 | 「项目背景：我想做一个能 ... 的工具」+ 架构图 | 掘金调性 = 项目导向 |
| 内链 anchor | Author 主页 + 课程入口 | 掘金讲究 author signal |
| 长度 | 3000（项目案例占主体）| 完整项目走完一遍 |
| 配图 | 架构图（Mermaid）+ 终端 + 截图 | 掘金读者吃 visual flow |
| 结尾 CTA | 关注作者 + 看完整源码 | 掘金粉丝关系胜过点赞 |

---

## 内容结构（待 AI / 员工从 master.md 改写）

**TBD** — 掘金风格：以"做一个 X"开题，完整跑一遍项目：

- [ ] 0 段：项目背景 — "我想做一个 AI 求职助手，能自动看 GitHub repo / 拉招聘网页 / 查我 Notion 笔记里的项目"
- [ ] 1 段：架构图（Mermaid）— 5 个 Server 串起来的工作流
- [ ] 2 段：MCP 协议简介（200 字）+ 跟 LangChain Tools 对比 1 段表
- [ ] 3 段：5 个 Server 配置（掘金更聚焦 github + filesystem + fetch + brave-search 4 个，加 1 个自定义）
- [ ] 4 段：实战：「问 Claude 帮我看 GitHub 上 anthropics 这周的 PR + 比对我 Notion 项目笔记 + 拉 SEEK 上 Sydney AI Engineer 岗，给我列 cover letter 草稿」— 完整对话 transcript（脱敏）
- [ ] 5 段：踩坑 + 经验
- [ ] 末尾：源码 link + 课程导流

## 发布配置

- 掘金账号：@JR Academy 或个人 dev 账号
- 标签：#MCP #Anthropic #AI编程 #Claude #LLM
- 自动化：⚠️ 半自动 Playwright（掘金反爬比 CSDN 松，可批量但建议每周 ≤ 2 篇）

## 写完后

跑 originality vs csdn（最易撞）：
- 掘金强调**项目实战**，CSDN 强调**协议 + 代码教程**
- 掘金的 5 个 server **不一样的组合**（去掉 postgres，加自定义 server）
- 掘金的真实工作流场景 vs CSDN 的逐个独立 server 介绍

如果跟 CSDN 相似度 > 70%，重写「项目背景」+「实战段」。

## 掘金平台坑

- ❌ 不接受全文转载标记（要原创）
- ✅ 支持 Mermaid 图表（Mermaid block 直接渲染）
- ✅ 代码块支持 highlight，几乎全语言识别
