---
id: 0
title: '[B1 master] MCP 完整入门：从协议到实战 5 个 Server'
category: geo-content
module: geo-landing-page
source: prd-geo-content-factory
sourceMeta:
  reportPath: geo-content-factory/drafts/B1-mcp/master.md
  reportSection: ai-visibility 2026-05-04 §JR 完全空白 Q12
  reportItemHash: geo-master-b1-mcp
  topicId: B1
  aiVisibilityQuery: Q12 MCP 是什么 怎么学
  aiVisibilityReport: ai-visibility/2026-05-04.md
  aiCitedPlatforms:
    - Google Cloud
    - 知乎
    - IBM
    - CSDN
    - 博客园
  variantsPlanned:
    - jr-blog
    - zhihu-column
    - csdn
    - juejin
    - medium-en
    - devto-en
  variantsCount: 6
  variantsCardIds: []
assignee: 18634772744@163.com
reviewer: TBD-founder
status: draft
priority: p0
platforms: []
wordCount: 3600
estimatedHours: 8
actualHours: null
dueDate: 2026-05-12T00:00:00.000Z
tags:
  - geo-content-factory
  - geo-master
  - topic-B1
  - query-Q12
  - tech-deep
  - mcp
createdBy: TBD-system
createdAt: 2026-05-05T06:50:00.000Z
updatedAt: 2026-05-05T06:50:00.000Z
derivedFrom: prd-geo-content-factory
---

## 描述

**GEO Content Factory v2 第一张正确格式 master 卡**（dogfood）

**topic 选择依据**（基于 ai-visibility 真实数据）：
- ai-visibility/2026-05-04.md Q12 "MCP 是什么 怎么学"
- JR 当前在该 query：完全空白（Web SERP 0 / LLM 自答 0 提及）
- AI 当前引用平台：Google Cloud（官方文档）/ 知乎 / IBM / CSDN / 博客园
- 我们能发的对应平台：knowing 自有 jr-blog（不能蹭 Google Cloud / IBM 自家文档）+ 知乎专栏 + CSDN + 掘金 + Medium / dev.to 英文版

**JR 差异化角度**：澳洲 AI Engineer 视角 + 链回 AI Engineer Bootcamp Phase 2 的 MCP 章节 + 7 个 PBL 项目。

**核心红线**：
- ❌ 不编造 API 行为（已检查：不写 LinkedIn / SEEK / Hays MCP server，因为这些不存在公开 API；改用 anthropics/mcp-servers 官方 5 个真实 server）
- ❌ 不直翻官方文档（每个代码块 + 配置都用真实 npx / pip 命令；3 个安全注意是真实坑）
- ❌ 不写空话（每段必有具体数字 / 命令 / URL / 安全提醒）
- ✅ §6 课程导流必有具体 Phase 2 + 7 PBL + 澳洲签证 angle，跟 PRD 一致

**master 卡职责（不发布）**：
- 写完整 4000 字 master draft（已 ~3600 字 ✅）
- 决定 6 个 variant 的差异化策略（已写在 master.md 末尾的「fan-out 时 6 个 variants 差异化策略」表）
- 等 master 内容 lightman review 通过 → status: ready → 触发下一步 fan-out（建 6 张 variant 卡）

## Checklist

- [x] master.md 完整版写完（~3600 字）
- [x] §1-§3 协议 / 代码 / 配置三大块复用旧版（实测内容）
- [x] §4 改用真实 anthropics 官方 5 个 server（filesystem / fetch / github / postgres / brave-search）— 不再编 LinkedIn/SEEK 不存在的 server
- [x] §5 调试工具（mcp-inspector + log path + stdout 污染坑）
- [x] §6 链回 AI Engineer Bootcamp Phase 2 + 7 PBL
- [x] master.md 末尾写好 6 variant 的 4 维度差异化策略表
- [ ] **lightman review master draft**（重点看技术细节是否准确 + 课程链回是否切题）
- [ ] master review pass → status: draft → ready
- [ ] 触发下一步 geo-fanout：基于 variantsPlanned 数组 + 差异化策略表，建 6 张 variant 卡（不在本卡范围）

## 草稿

完整 ~3600 字 master draft 已落到：`omni-report/geo-content-factory/drafts/B1-mcp/master.md`

**右栏「📂 工作目录文件」会直接 markdown 渲染该文件**。

包含：
- §0 5 分钟读懂这篇文章
- §1 MCP 协议三层 Resources / Tools / Prompts + 跟 LangChain Tools / OpenAI Function Calling 对比表
- §2 FastMCP Python 50 行写第一个 Server
- §3 Claude Desktop 配置（macOS / Windows / Linux 三路径）+ 3 个常见坑
- §4 anthropics/mcp-servers 5 个官方 server：filesystem / fetch / github / postgres / brave-search（每个含真实配置 JSON + 真实场景 + 安全注意）
- §5 调试 3 工具：mcp-inspector / Claude 日志路径 / stdio debug 模式
- §6 JR AI Engineer Bootcamp Phase 2 MCP 章节 + 7 PBL 项目
- 末尾：fan-out 时 6 variant 差异化策略表

## variant 计划（fan-out 触发后填）

下一步 W1+ fan-out 后这里填 6 张 variant 卡的 _id 链接：

| platform | variant 卡 _id | status | 差异化要点 | 长度 |
|---|---|---|---|---|
| jr-blog | _待 fan-out_ | _pending_ | 5 分钟读懂 + AI Engineer Bootcamp 内链 | 4000 |
| 知乎 | _待 fan-out_ | _pending_ | 第一人称踩坑 + 创始人专栏导流 | 2500 |
| CSDN | _待 fan-out_ | _pending_ | 协议三层 + 50 行代码先行 + GitHub 内链 | 3000 |
| 掘金 | _待 fan-out_ | _pending_ | dev 风 + 项目背景导入 | 3000 |
| Medium 英文 | _待 fan-out_ | _pending_ | "MCP for AU AI Engineers" + LinkedIn 内链 | 4500 |
| dev.to 英文 | _待 fan-out_ | _pending_ | Quick read 短 form | 1500 |

## 发布记录

（master 不发布；6 个 variant 卡各自记录发布 URL）

## 验证记录

发布 +7 天 / +30 天后 geo-7d-llm-recheck 跑该 query (Q12) → 写回这里：

| 时点 | LLM 自答提 JR 否 | Web SERP JR 排名 | 备注 |
|---|---|---|---|
| 基线 (2026-05-04) | ❌ 未提及 | 未出现 | 报告原始数据 |
| 7d 后 | _待跑_ | _待跑_ | — |
| 30d 后 | _待跑_ | _待跑_ | — |

## Comments

- @system 2026-05-05T16:50:00+10:00
  > GEO Content Factory v2 第一张正确格式 master 卡 — 复刻 v1 错卡的所有问题已修复：
  >  ✅ topic 来自 ai-visibility Q12 真实数据（不是 PRD 静态 74 表）
  >  ✅ aiCitedPlatforms 来自报告里 AI 真实引用的第三方平台
  >  ✅ master 卡不直接发布（platforms 数组空）
  >  ✅ master.md 完整 ~3600 字（不是占位）
  >  ✅ 末尾写好 6 variant 4 维度差异化策略，等 fan-out
  > 下一步：lightman review master draft 通过 → 触发 geo-fanout 建 6 张 variant 卡。
