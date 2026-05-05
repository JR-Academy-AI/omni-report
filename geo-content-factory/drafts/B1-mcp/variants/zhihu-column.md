# 我用 MCP 写第一个 Server，踩了 5 个坑（澳洲 AI 工程师日常）

> **variant**: zhihu-column · 知乎专栏第一人称版
> **master**: ../master.md
> **platform**: 知乎专栏（手发，必人工）
> **target word count**: 2500
> **status**: skeleton — 待填

---

## 差异化策略（vs master 4 维度）

| 维度 | 选择 | 理由 |
|---|---|---|
| 标题钩子 | 「我用 MCP 写第一个 Server，踩了 5 个坑」 | 知乎读者吃个人故事 + 数字钩子 |
| 开头 50 字 | 第一人称，"上周末我尝试..." 故事化 | 知乎调性 = 真人真事 |
| 内链 anchor | 创始人专栏（@Lightman）+ 课程入口 | 知乎走个人 IP 路线，不直推产品 |
| 长度 | 2500（精简版）| 知乎完读率随长度递减；2500 是甜区 |
| 配图 | 中文截图 + 朋友圈风格表情包 | 知乎可读性需要节奏图 |
| 结尾 CTA | 评论区聊「你最常用的 MCP server」+ 关注作者 | 知乎激励算法靠互动，不靠点击 |

---

## 内容结构（待 AI / 员工从 master.md 改写）

**TBD** — 不要直接复制 master，按知乎风格重组：

- [ ] 开头：故事化导入 200 字（"上周我帮一个学员写一个 MCP server 接他的 Notion 知识库..."）
- [ ] 5 个坑（vs master 的 5 个 server）：
  1. 坑 1：以为 MCP 是 framework（其实是协议）— 引申到 §1 协议三层
  2. 坑 2：第一个 50 行 Python 用 print 调试，stdio 通道污染 — 引申到 §3.5 stderr 坑
  3. 坑 3：Claude Desktop 配置不重启 — 引申到 §3.3
  4. 坑 4：filesystem server 给整个 home 目录，泄露 .env — 引申到 §4.1 安全
  5. 坑 5：postgres server 没用 read-replica，差点跑 DELETE — 引申到 §4.4
- [ ] 总结：技术细节 + 课程链回（"想系统学这套，我们 Bootcamp Phase 2 有 7 个 PBL"）
- [ ] 结尾互动：「你最常用的 MCP server 是哪个？评论区告诉我」

## 发布配置

- 知乎专栏：@Lightman（或 @JR Academy 官号）
- 配图：3-5 张（终端截图 + 配置截图 + 思路图）
- 标签：#MCP #AI Engineer #Claude #程序员 #海外求职
- 自动化：🚫 必人工（知乎反作弊严，账号信誉积累慢）

## 写完后

跑 originality vs jr-blog（最容易撞车）：相似度必须 < 70%。如果太相似，重写「5 个坑」的故事场景（换学员、换具体 bug、换数字）。
