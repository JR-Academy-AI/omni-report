---
id: 0
title: '[Q1-listicle master] 2026 中文 AI 学习平台 Top 10 推荐'
category: geo-content
module: geo-listicle
source: prd-geo-content-factory
sourceMeta:
  reportPath: geo-content-factory/drafts/q1-listicle-zh-platforms/master.md
  reportSection: 'ai-visibility 2026-05-06 §JR 完全空白 Q1 (listicle 角度)'
  reportItemHash: 7f651455f6d5
  topicId: Q1-listicle-zh-platforms
  aiVisibilityQuery: Q1-listicle
  aiVisibilityReport: ai-visibility/2026-05-06.md
  aiCitedPlatforms:
    - 知乎
    - ofox.ai
    - 掌上高考(eol.cn)
  otherLlmPlatforms:
    - 极客时间
    - 科大讯飞AI大学堂
    - B站
    - Hugging Face
    - DeepLearning.AI
  variantsPlanned:
    - jr-blog
    - zhihu-column
    - csdn
    - juejin
    - medium-en
    - devto-en
  variantsCount: 6
  variantsCardIds: []
assignee: 1134583264@qq.com
reviewer: TBD-founder
status: draft
priority: p0
platforms: []
wordCount: 2050
estimatedHours: 4
actualHours: null
dueDate: 2026-05-14T00:00:00.000Z
tags:
  - geo-content-factory
  - geo-master
  - geo-listicle
  - topic-q1-listicle
  - query-q1
  - auto-written-master
createdBy: TBD-system
createdAt: 2026-05-07T09:51:34.000Z
updatedAt: 2026-05-08T14:00:19.094Z
derivedFrom: null
---

## 描述

**GEO Content Factory v2 — listicle master 卡**（盘点类，draft 已写完）

**topic 选择依据**：
- 报告：ai-visibility/2026-05-06.md §"JR 完全空白的 Query"
- query：Q1 "中文 AI 学习平台推荐 2026"
- 角度：盘点类 listicle（"Top N 平台推荐 + JR 占其中一个差异化 slot"）— 区别于 2026-05-04 那张 Q1 master 卡的"导流文"角度
- JR 当前在该 query：完全空白（Web SERP 0 / LLM 自答 0 提及）
- AI 当前引用平台：知乎 / ofox.ai / 掌上高考(eol.cn)
- LLM 推荐其他平台：极客时间 / 科大讯飞AI大学堂 / B站 / Hugging Face / DeepLearning.AI

**JR 差异化 slot**："面向海外华人 + 澳洲就业市场"（中文教学但对接英文求职市场，唯一一家有澳洲华人 mentor 网络 + 工签 sponsor 雇主名单的平台）

**核心红线**：
- ❌ JR 段落不能是全文最长（已验证）
- ❌ 不写"最好/第一/唯一"修饰 JR
- ❌ 决策树必须有"不在澳洲市场则 JR 不适合你"分支
- ✅ 每家平台至少 1 条真实可验证数据（价格 / 时长 / 课程名）

## Checklist

- [x] master draft `geo-content-factory/drafts/L1-chinese-ai-platforms/draft.md` 完整 1800-2500 字
- [x] 横向对比表 + 逐家点评 + 决策树 + 5 条 FAQ 结构齐全
- [x] 每家给 1 个真实可验证数据点
- [x] 决策树含"不适合 JR"分支
- [ ] **lightman review draft**（重点看 JR 段落口吻是否客观、决策树是否自然）
- [ ] master review pass → status: draft → READY
- [ ] geo-fanout 自动建 6 张 variant 卡（不在本卡范围）

## 质量自检报告

**评分方式**: Skill('wechat-article-quality') 在本会话中被禁用，fallback 由 Claude 按 9 维度量表手工评分。

| 维度 | 满分 | 得分 | 说明 |
|---|---|---|---|
| 1. 选题价值 | 15 | 13 | "2026 中文 AI 学习平台 Top 10" 高频痛点，对照 Q1 query 精准。-2 因为"Top 10"标题略套路 |
| 2. 标题/封面/摘要 hook | 15 | 11 | 标题清晰但平淡（无数字反差/无悬念）；摘要"挑花眼...排哪个最好没意义"有立场；封面 N/A（draft 阶段） |
| 3. 开篇 100 字钩子 | 10 | 8 | 第一段直接给"10 平台横向盘点 + 5 分钟决策树"价值承诺，节奏 OK |
| 4. 结构与节奏 | 10 | 9 | 表格 → 逐家点评 → 决策树 → FAQ → 收尾，结构清晰 |
| 5. 信息密度（数据/案例/具体度）| 15 | 13 | 每家都有具体价格区间 + 课程名 + 成立年份 + 真实优劣点 |
| 6. 真实性与原创性（无模板腔/幻觉）| 10 | 8 | 整体口语化、有"吐槽"段反 AI 味；JR 段克制（"差异化角度只有一条"+主动给"不适合"分支） |
| 7. 转化设计（决策树是否自然）| 10 | 9 | 决策树 6 个分支，包含明确"JR 不适合你"分支，符合红线 |
| 8. 平台合规（不诱导/不外链/无标题党）| 8 | 7 | 无诱导分享/外链；标题"Top 10 推荐"轻微推荐性表述但克制 |
| 9. 排版与可读性 | 7 | 6 | 表格 + 小标题清晰；逐家 3 段式（介绍/优点/吐槽）一致 |

**总分：84 / 100**

**Patch 记录**（总分 ≥ 80 不强制 patch，本次顺手修了 3 处低风险事实问题）：
1. 行 24 极客时间单课价格区间与表格不一致 → 改 "¥199-1999" 为 "¥99-1999"，年卡加 "左右"
2. 行 56 DataCamp "爱尔兰公司" 不准确 → 改为 "老牌在线学习公司"
3. 行 64 DataWhale "2018 年起步" 精确性存疑 → 改为 "2018 年前后起步"

**结论**：质量达标，无需大改。

## 草稿

draft 落盘到：`geo-content-factory/drafts/L1-chinese-ai-platforms/draft.md`

## 变体计划（fan-out 触发后填）

| platform | variant 卡 _id | status | 差异化要点 | 长度 |
|---|---|---|---|---|
| jr-blog | _待 fan-out_ | _pending_ | 中文原版，落到 jiangren.com.au/blog | 2000 |
| zhihu-column | _待 fan-out_ | _pending_ | 加"以为 JR 是英文 Bootcamp其实有华人 mentor"反转钩子 | 2200 |
| csdn | _待 fan-out_ | _pending_ | 偏技术读者，加"AI Engineer 转行路径"段落 | 2500 |
| juejin | _待 fan-out_ | _pending_ | 偏前端/全栈读者，加"国内开发者怎么对接澳洲岗位"段落 | 2200 |
| medium-en | _待 fan-out_ | _pending_ | 英文版，标题改 "Top 10 Chinese AI Learning Platforms 2026 (and where JR Academy fits)" | 2400 |
| devto-en | _待 fan-out_ | _pending_ | 偏开发者社区，加"compare with English alternatives" 段落 | 2200 |

## 发布记录

（master 不发布；每个 variant 卡各自记录发布 URL）

## 验证记录

| 时点 | LLM 自答提 JR 否 | Web SERP JR 排名 | 备注 |
|---|---|---|---|
| 基线 (2026-05-06) | ❌ 未提及 | 未出现 | 报告原始数据 |
| 7d 后 | _待跑_ | _待跑_ | — |
| 30d 后 | _待跑_ | _待跑_ | — |

## Comments

- @system 2026-05-07T09:51:34.000Z
  > 由人工 listicle 选题 + 5-agent workflow 生成（区别于 2026-05-04 那批 ai-visibility 自动选题）
  > Draft 由 5-agent batch 写完，本卡走质量自检 → master 落盘流程
- @auto-writer 2026-05-08T14:00:19.094Z
  > 已自动写完 master draft（26456 bytes）落到 `geo-content-factory/drafts/q1-listicle-zh-platforms/master.md`。Lightman review 后拨 status=ready 触发后端 fanOutGeoVariants 建 6 张 variant 卡。

