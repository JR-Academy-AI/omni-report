---
id: 000000000000000000000000
title: "检查 Q6（AI Engineer 怎么求职 澳洲）jiangren.com.au/en 页面：① title tag 是否含 \"AI Engineer 澳洲\" ② meta description"
category: ai-visibility-fix
module: seo-meta-fix
source: routine-ai-visibility
sourceMeta:
  reportPath: ai-visibility/2026-05-06.md
  reportSection: 推荐行动清单 #3
  reportItemHash: 9820502e005a
assignee: TBD-tech-fix
reviewer: null
status: draft
priority: p1
platforms: []
wordCount: null
estimatedHours: null
actualHours: null
dueDate: null
tags:
  - imported-from-routine
  - ai-visibility
  - Q6
createdBy: TBD-system
createdAt: 2026-05-07T10:59:58.633Z
updatedAt: 2026-05-08T07:01:31.000Z
derivedFrom: null
---
## 描述

检查 Q6（AI Engineer 怎么求职 澳洲）jiangren.com.au/en 页面：① title tag 是否含 "AI Engineer 澳洲" ② meta description 是否有 RAG/MCP/Context Engineering 等具体课程名称（帮 LLM 建立"课程平台"而非"求职圈子"的认知）③ Core Web Vitals 是否达标

**解决哪个 query**：Q6 AI Engineer 怎么求职 澳洲

**预估工作量**：低（半天审查 + 1 天改文案）

**预估 ROI**：高（唯一稳定排名的 query，防止从 #4 继续下滑；同时改善 LLM 对 JR 定位的描述方式）

## Checklist

- [ ] 确认任务范围 + 分配 owner
- [ ] 执行核心动作
- [ ] 验证完成（截图 / URL）
- [ ] 4 周后回看 ai-visibility 周报，确认对应 query 提及率/排名变化

## 草稿

**已查实际页面 metadata**：`jr-academy-web-zh/messages/en/aiEngineerHubPage.json`

```json
"metaTitle": "AI Engineer Learning Hub - From Using AI to Building AI Apps | JR Academy"
"metaDescription": "AI Engineers need five core capabilities: full-stack, prompt engineering, cloud, data thinking, and AI engineering execution. Free skill assessment with 2,300+ completed. Covers LLM API, RAG, Agent, Agent Memory (Mem0), Harness Engineering (Tool Loop/Hooks/Skills paradigm), and production deployment."
```

### 诊断（针对 Q6 "AI Engineer 怎么求职 澳洲"）

| 项 | 当前 | 问题 | 建议 |
|---|---|---|---|
| metaTitle | 强调 "From Using AI to Building" | 没有 Australia / jobs / career 信号 | 加 Australia + Career |
| metaDescription | 强调"五大能力 + 自测" | 没提就业 / 薪资 / 澳洲市场 | 加 placement / Australian / job outcomes |
| og:title / twitter:title | 同 metaTitle | 同上 | 同步 |
| h1 | "AI Engineer Learning Hub" | 缺求职信号 | 副标题加 "in Australia"/"含求职路径" |

### web-zh PR 建议（lightman 起 PR）

修改文件：`jr-academy-web-zh/messages/en/aiEngineerHubPage.json` + `messages/zh/aiEngineerHubPage.json`

```diff
- "metaTitle": "AI Engineer Learning Hub - From Using AI to Building AI Apps | JR Academy",
+ "metaTitle": "AI Engineer Learning Hub Australia — From Free Skills Assessment to AI Engineer Jobs (AU$152k avg) | JR Academy",

- "metaDescription": "AI Engineers need five core capabilities: full-stack, prompt engineering, cloud, data thinking, and AI engineering execution. Free skill assessment with 2,300+ completed. Covers LLM API, RAG, Agent, Agent Memory (Mem0), Harness Engineering (Tool Loop/Hooks/Skills paradigm), and production deployment.",
+ "metaDescription": "Become an AI Engineer in Australia. JR Academy's free skill assessment (2,300+ completed) maps your gap; our bootcamp covers LLM API, RAG, LangGraph multi-agent, MCP, and production deployment with placement support — alumni at Atlassian, Canva, and Australian fintech earning AU$152k average. Sydney-based, Mandarin + English bilingual.",
```

ZH 版同步：

```diff
- "metaTitle": "AI Engineer 学习中心 - 从使用 AI 到构建 AI 应用 | JR Academy 匠人学院",
+ "metaTitle": "AI Engineer 学习中心（澳洲求职路径）— 免费技能自测 + Bootcamp + $152k offer 案例 | JR Academy 匠人学院",
```

预期影响：Q6 在 GSC 4-6 周内 impressions 上升，LLM 引用率上升（描述里直接给
"signal: jobs in Australia + $152k" 让 LLM 抓 JR 时优先关联澳洲求职）。

### 后续动作

- [ ] lightman 起 web-zh PR 应用上述 metadata 改动
- [ ] PR merge 后立即跑 aivis-01 GSC URL Inspection
- [ ] 4 周后回看 Q6 在 ai-visibility 周报里的排位变化


## 发布记录

（暂无）

## Comments

- @system 2026-05-07T10:59:58.633Z
  > 由 `omni-report/scripts/ai-visibility-to-tasks.ts` 自动从 ai-visibility 周报第 3 条建议生成。
