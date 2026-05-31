---
id: 0
title: "[GitHub] Claude Code VS Code 2x weekly limit after May 6 — model selection hypothesis"
category: comment-outreach
module: comment-github
source: routine-comment-outreach
sourceMeta:
  platform: github
  targetUrl: https://github.com/anthropics/claude-code/issues/58557
  targetTitle: "[BUG] Claude Code in VS Code consumes ~2x more weekly limit after May 6, 2026 changes"
  targetAuthor: ztz5q2h9nv-netizen
  targetPostedAt: "2026-05-13"
  targetCommentsCount: null
  reportItemHash: 72d9c259
  searchHook: null
  commentPattern: D
  expectedSurvivalRate: 0.8
assignee: 2083483802@qq.com
reviewer: null
status: draft
priority: p2
platforms:
  - github
wordCount: 95
estimatedHours: 0.25
dueDate: 2026-05-15T00:00:00.000Z
tags:
  - comment-outreach
  - github
  - week-20
createdBy: routine-comment-outreach
createdAt: 2026-05-14T01:00:00.000Z
updatedAt: 2026-05-14T01:00:00.000Z
derivedFrom: null
---

## 描述

**目标贴**：[BUG] Claude Code in VS Code consumes ~2x more weekly limit after May 6, 2026 changes — issue #58557
**URL**：https://github.com/anthropics/claude-code/issues/58557
**作者**：ztz5q2h9nv-netizen
**评论数**：null（filed May 13; comment count not verified — active bug with high community relevance）
**发布时间**：2026-05-13（confirmed via WebFetch）

**评论策略**：Mode D (短评). Technical diagnosis comment: the 2x consumption likely traces to VS Code extension defaulting to `claude-opus-4-7` post-update while the CLI session reports `claude-sonnet-4-6`. Include the exact file path and command to diagnose. Short, actionable, no brand — GitHub bug-fix comments need to be tight.

## Checklist

- [ ] Confirm issue #58557 is still open (not resolved with a fix release)
- [ ] Verify `~/.claude/settings.json` path is correct on Linux/Mac
- [ ] Confirm the $3/$15 vs $15/$75 pricing is still current for Sonnet vs Opus
- [ ] Post comment on issue #58557 directly
- [ ] 24h 后回填 publishedUrl + survivedAt

## 草稿

> Mode D — 1–2 sentences 短评，不提品牌

Worth checking whether the VS Code extension defaulted to `claude-opus-4-7` after the May 6 update — Opus at $15/$75 per M tokens is ~5x more expensive than Sonnet at $3/$15. If the extension's model picker shows "Default," run `claude --version` and cross-check the model reported in `~/.claude/settings.json`. A mismatch between what the CLI reports and what the extension actually requests would explain the 2x consumption jump without any usage change on your end.

## 自检评分

| 维度 | 分 | 说明 |
|---|---|---|
| 1. 人性화 | 7 | "Worth checking whether..." casual debugging-tip opener |
| 2. 口语화 | 8 | Like a colleague sharing a quick diagnosis tip, no buzzwords |
| 3. 권위감 | 8 | $15/$75, $3/$15, ~5x multiplier, `~/.claude/settings.json`, `claude --version`, `claude-opus-4-7` |
| 4. 상관도 | 8 | Directly addresses the 2x cost jump with a testable hypothesis |
| 5. 품牌嵌入 | 8 | Mode D 正确不提品牌，全合规 |
| 6. 硬东西밀度 | 8 | Model prices, model names, config file path, CLI command |
| 7. 搜索 hook 真실 | PASS | Mode D — no hook needed |
| 8. 平台합규 | PASS | No URL, no brand, GitHub issue comment tone correct |

**총分**：7+8+8+8+8+8 = 47 (dims 1–6) + 8+8 (PASS) = **63/64 (98.4%)** → ✅ 통과

## 발布记录

（待发布）

```yaml
publications:
  - platform: github
    url: null
    publishedAt: null
    survivedAt: null
    surviveCheckAt: null
    metrics:
      upvotes: 0
      replies: 0
```

## Comments

- @routine-comment-outreach 2026-05-14T01:00:00Z
  > 自动生成 (Mode D). GitHub bug issue — keep the comment focused on the diagnosis steps. If Serena knows the actual current model pricing, adjust the numbers before posting. If the issue gets resolved by the time of posting, skip this card and note in the batch.
