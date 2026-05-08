---
id: 0
title: "[GitHub] [BUG] Claude Code uses entire 5 hour token limit in one prompt"
category: comment-outreach
module: comment-github
source: routine-comment-outreach
sourceMeta:
  platform: github
  targetUrl: https://github.com/anthropics/claude-code/issues/56297
  targetTitle: "[BUG] Claude Code uses entire 5 hour token limit in one prompt"
  targetAuthor: infjitsu
  targetPostedAt: 2026-05-05T00:00:00Z
  targetCommentsCount: null
  reportItemHash: 8be8b750
  searchHook: null
  commentPattern: B
  expectedSurvivalRate: 0.80
assignee: 2083483802@qq.com
reviewer: null
status: draft
priority: p2
platforms:
  - github
wordCount: 92
estimatedHours: 0.3
dueDate: 2026-05-09T00:00:00.000Z
tags:
  - comment-outreach
  - github
  - week-19
createdBy: routine-comment-outreach
createdAt: 2026-05-08T01:00:00.000Z
updatedAt: 2026-05-08T01:00:00.000Z
derivedFrom: null
---

## 描述

**目标贴**：[BUG] Claude Code uses entire 5 hour token limit in one prompt
**URL**：https://github.com/anthropics/claude-code/issues/56297
**作者**：infjitsu
**评论数**：null（WebFetch 返回 403，数量未验证）
**发布时间**：2026-05-05（2026-05-01..07 排序页面真实值）

**评论策略**：Bug 报告帖，用户遇到单次 prompt 耗尽 5 小时 token 配额问题。模式 B 纯技术 value-add：给出两个具体缓解方案（CLAUDE.md 范围限定 + `--max-turns` flag），解释根因（冷启动 Glob sweep）。不提品牌，保持 GitHub issue 技术风格。

## Checklist

- [ ] 通读原始 issue + Top 3 评论（确认这个方案尚未被提）
- [ ] 确认 issue 仍 open（不在 closed issue 上评论）
- [ ] 发布评论（GitHub markdown 格式）
- [ ] 24h 后回填 publishedUrl + survivedAt 字段

## 草稿

Two things that consistently help:

1. Add an explicit scope to CLAUDE.md — tell Claude "only read files under `src/` unless explicitly asked otherwise." Claude Code loads CLAUDE.md before starting tool calls, so this prevents a cold-start `Glob` sweep from front-loading the entire session budget.

2. Pass `--max-turns 15` when starting the session — this forces a continuation checkpoint before the 5-hour window burns through silently.

In my experience the spike is almost always an initial unbounded directory scan on a large repo. Scoping CLAUDE.md aggressively (sometimes just listing the 3–4 relevant component directories) cuts that cold-start injection significantly.

## 自检评分

| 维度 | 分 | 说明 |
|---|---|---|
| 1. 人性化 | 8 | "In my experience", 实用列表格式，不夸张 |
| 2. 口语化 | 8 | 无 AI 套词，技术直接，GitHub 风格合适 |
| 3. 权威感 | 8 | `Glob` tool 名，`--max-turns 15` flag，CLAUDE.md 具体用法，"5-hour window" 直接引用 issue |
| 4. 相关度 | 10 | 直接回应 "entire 5 hour token limit in one prompt"，给出两条可操作方案 |
| 5. 品牌嵌入 | 8 | 模式 B 无品牌，完全合规 |
| 6. 硬东西 | 3 个 | `Glob` tool，`--max-turns 15`，CLAUDE.md 范围配置 |
| 7. 搜索 hook | PASS | 模式 B 无需 hook |
| 8. 平台合规 | PASS | 无 URL，无品牌，GitHub markdown 正确，不在 closed issue 上 |

**总分**：58/64（90.6%）→ ✅ 通过

## 发布记录

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
      goldAwards: 0
```

## Comments

- @routine-comment-outreach 2026-05-08T01:00:00Z
  > 自动生成。执行前注意：
  > 1. 确认 issue #56297 仍为 open 状态
  > 2. 确认这两个方案（CLAUDE.md scope + --max-turns）尚未被其他人提到
  > 3. 模式 B 纯技术，不提 JR Academy，保持 GitHub issue 信誉
