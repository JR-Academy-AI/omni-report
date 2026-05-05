# MCP 协议三层 + 50 行 Python 代码：从 0 到自己的第一个 Server

> **variant**: csdn · CSDN 代码密集版
> **master**: ../master.md
> **platform**: CSDN
> **target word count**: 3000
> **status**: skeleton — 待填

---

## 差异化策略（vs master 4 维度）

| 维度 | 选择 | 理由 |
|---|---|---|
| 标题钩子 | 「MCP 协议三层 + 50 行 Python 代码」 | CSDN 读者吃技术名词 + 代码量数字 |
| 开头 50 字 | 直接 "运行结果：..." 截图 + 1 句话总览 | CSDN 习惯先看代码 |
| 内链 anchor | GitHub repo（fork 一份代码）+ 课程入口 | CSDN 重视开源代码引用 |
| 长度 | 3000（代码占 40% 篇幅）| CSDN 读者扫代码 > 读文字 |
| 配图 | 终端截图 + 代码截图 + 报错截图 | CSDN 文章习惯有"复现现场" |
| 结尾 CTA | star GitHub + 关注作者 | CSDN 用 star 衡量价值 |

---

## 内容结构（待 AI / 员工从 master.md 改写）

**TBD** — CSDN 风格：代码先行，文字解释后置：

- [ ] 0 段：截图「Claude Desktop 调用我的 MCP Server 实测」（视觉钩子）
- [ ] 1 段：MCP 是什么（200 字精简版，强调"协议 ≠ 框架"）
- [ ] 2 段：50 行 Python 代码（master §2 的 github_server.py）— 完整放出
- [ ] 3 段：claude_desktop_config.json 完整 JSON（macOS / Windows / Linux 三段）— 直接给可复制
- [ ] 4 段：5 个官方 server 配置 JSON 全列出（master §4 的 5 个配置块）
- [ ] 5 段：3 个调试坑（master §5）— 每个坑有「错误信息 + 解决命令」格式
- [ ] 末尾：链回 GitHub + 课程

## 发布配置

- CSDN 专栏：JR_Academy / 个人账号
- 标签：#MCP #Anthropic Claude #Python #AI Agent #Function Calling
- 自动化：⚠️ 半自动 Playwright（CSDN 风控严，建议人工发避免账号风险）

## 写完后

跑 originality vs jr-blog / zhihu / juejin（CSDN 跟掘金最容易撞车——风格都偏 dev）。

**关键差异化点**（vs 掘金）：
- CSDN 多放命令行截图，掘金多放图标 / Mermaid 图
- CSDN 标题更"教程"，掘金更"实战"
- CSDN 内链多到 GitHub repo，掘金多到 Author 主页

## CSDN 平台坑（必看）

- ❌ H1 不要超过 1 个（CSDN 编辑器自动加文章 title 是 H1）
- ❌ 外链多了会被识别成营销文降权（每篇 ≤ 5 个外链）
- ❌ 代码块语言标错（py 不识别，要用 python）影响高亮
