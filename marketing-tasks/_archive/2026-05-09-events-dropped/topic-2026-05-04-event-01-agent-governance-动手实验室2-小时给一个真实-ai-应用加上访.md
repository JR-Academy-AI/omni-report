---
id: 0
title: Agent Governance 动手实验室：2 小时给一个真实 AI 应用加上访问控制
category: event-offline
module: event-execution
source: routine-marketing-topics
sourceMeta:
  reportPath: marketing-topics/2026-05-04.md
  reportSection: 推荐线下活动
  reportItemHash: 9baf10f74f15
assignee: huangdg755@gmail.com
reviewer: null
status: draft
priority: p2
platforms: []
wordCount: null
estimatedHours: null
actualHours: null
dueDate: null
tags:
  - imported-from-routine
  - marketing-topics
  - offline-event
createdBy: TBD-system
createdAt: 2026-05-05T02:08:43.464Z
updatedAt: 2026-05-05T02:08:43.464Z
derivedFrom: null
---
## 描述

**Agent Governance 动手实验室：2 小时给一个真实 AI 应用加上访问控制**

**形式**：线下 Workshop（2h，周六上午 10am，限 14 人，自备笔记本）

**城市**：Sydney

**简介**：报名时提交「你目前有哪个 AI 应用/Agent 想治理」一句话；现场统一用 Agent 365 沙箱账号，JR 讲师驻场指导完成：注册 Agent → 绑定身份策略 → 跑一条审计日志查询；每人离场有一份可带走的「自己项目的 governance 配置草稿」

**备注（配合哪个线上讲座）**：配合线上讲座 #1；活动笔记整理后发 LinkedIn 技术文章引流

## Checklist

- [ ] 确认场地 + 日期 + 报名表单
- [ ] 嘉宾邀请 + 物料准备
- [ ] 推广（小红书 / 微信社群 / Eventbrite）
- [ ] 现场执行 + 拍照拍视频
- [ ] 活动总结发 LinkedIn / 知乎

## 草稿

### 报名落地页文案（Eventbrite + jiangren.com.au/events/{slug}）

**主标题**：Agent Governance 动手实验室：2 小时给一个真实 AI 应用加上访问控制

**副标题**：限 14 人 · Sydney CBD · 周六上午 10am · 自带项目 + 笔记本 · 离场带走「自己项目的 governance 配置草稿」

**Hero 钩子**：

> 不是讲座、不是 demo——你带着自己手上的 AI 应用来，讲师带着 Agent 365 沙箱账号 + 配置模板等你。2 小时之后，你的项目多了一份能拿给 InfoSec 看的 governance 配置。

**事先要交的一句话（报名表单字段）**：

> 「你目前手上有哪个 AI 应用 / Agent 想治理？用 30 字描述（项目名 + 一句话功能 + 现在最让你睡不着的一个安全/合规问题）」

例：「内部知识库问答 Agent，调用客户合同 PDF，CEO 上周问'这个 Agent 能查到 HR 工资表吗'我答不上来。」

**讲师会做什么**：

- 提前 24h 读完所有报名问卷，给你预留对应模板
- 现场为每个项目准备一个 Agent 365 沙箱子账号
- 全程驻场答疑，每人保证至少 15 min 1-on-1 时间

**议程**（120 min）：

| 时长 | 内容 |
|------|------|
| 0-15 | 暖场：每人 30 秒说自己的项目和最大顾虑 |
| 15-40 | 跟着做：在 Agent 365 沙箱注册你的 Agent + 绑定身份策略 |
| 40-70 | 跟着做：写一条权限规则（基于角色/数据敏感级别）+ 测试 |
| 70-95 | 跟着做：触发一次审计事件 + 用 Audit Log Query 找回事件 |
| 95-115 | 1-on-1：讲师挨个看你写的配置 + 给针对性建议 |
| 115-120 | 拍合影 + 离场（带走个人配置草稿 + 模板包） |

**带走**：你自己项目的 governance 配置草稿（YAML） + 「Agent 365 配置模板包」（5 个常见场景）+ 与讲师 1-on-1 的针对性建议笔记

**适合谁**（报名筛选用）：

- ✅ 在公司或自己的项目里跑了至少 1 个 LLM Agent
- ✅ 已经被 / 即将被 security 或 compliance 同事问到「权限怎么管」
- ❌ 完全没碰过 Agent 的 — 这场不适合，建议先看线上讲座 #1
- ❌ 想拿来当 vendor 评估对比 — 我们只用 Agent 365 一家，不做横评

**报名费**：免费，但需要交 AUD $20 押金（活动结束当场退还/转给慈善），用于过滤 no-show

---

### 小红书招募文（开播前 7 天 + 3 天）

**T-7d**：

```
📍 Sydney 周六上午 10am 限 14 人

【Agent Governance 动手实验室】
2 小时 不讲概念 带你给真实项目加访问控制

🎯 不一样的地方：
- 你带自己手头的 AI 应用来
- 讲师提前看你问卷 给你预留模板
- 离场带走自己项目的 governance YAML

🎁 Agent 365 沙箱 + 5 套场景模板包

💰 押金 $20 现场退（防鸽子）
🔗 报名 → 评论扣「治理」给链接

#Sydney #AI工程师 #Agent #LLM #活动
```

**T-3d**：

```
还剩 3 个名额 ⏰

已报名同学的项目五花八门：
- 客服 RAG Agent
- 内部知识库问答
- 代码生成 IDE 插件
- 财务对账 Agent
- 用户行为分析 pipeline

讲师正在给每个项目准备模板
你这周想带哪个项目来？

最后 3 个名额 评论扣「报」给链接 🚀

#Sydney #AI #Agent
```

---

### 微信群定向推（Sydney 群）

```
@all
本周六 10am Sydney CBD 线下 Workshop
《Agent Governance 动手实验室》

⚠️ 跟我们以前线下不太一样：
- 限 14 人 已报 11 人
- 报名要先填问卷（你的项目 + 顾虑）
- 押金 $20 防鸽子（现场退）

适合：手上有 Agent 跑生产 / 被 security 问过权限的人
不适合：纯入门 / 来 networking 的（这场强度真的高）

报名 → [Eventbrite 链接]
```

---

### LinkedIn 招募（English）

**Title**：14 seats, Sydney, Saturday morning — bring an AI app, leave with a governance config

**Body**：

We're running a hands-on workshop on Saturday in Sydney CBD. 14 seats, 2 hours, BYO laptop and BYO project.

What's different from the usual "AI meetup":
- You submit a 30-word description of your real project ahead of time
- We pre-load an Agent 365 sandbox sub-account for each attendee
- 95 minutes of guided implementation, 20 minutes of 1-on-1 with the instructor
- You leave with a YAML governance config for your own project, not a generic demo

Who this is for: engineers / architects with at least one LLM agent in (or near) production, who've been asked "who can call this agent" by their InfoSec team.

Who this is NOT for: people new to LLMs (we have a free webinar for that — link in comments) or vendor evaluators (we only use Agent 365 here).

AUD $20 deposit (refunded on arrival) to keep no-shows out.

🔗 Register: [Eventbrite]

---

### 活动后输出物清单（Operations 用）

| 输出物 | 截止 | 责任人 |
|--------|------|--------|
| 现场照片（≥ 30 张） | 活动结束当晚 | EA |
| 短视频（30s × 3，发 B 站 / 小红书） | 活动后 +2 天 | 视频剪辑 |
| LinkedIn 技术长文（基于现场实操总结） | 活动后 +5 天 | 主讲讲师 |
| 知乎专栏文（中文版长文） | 活动后 +7 天 | 主讲讲师 |
| 14 位参与者的 1-on-1 followup 邮件（个人化） | 活动后 +3 天 | EA + 课程顾问 |

---

### 1-on-1 followup 邮件模板（活动后 3 天内发，按报名问卷个性化）

**Subject**：{{first_name}}, the YAML you wrote on Saturday + 3 things to do next

```
Hi {{first_name}},

Saturday was great — thanks for bringing the {{their_project}} project, that's exactly the kind of real-world case we wanted in the room.

Three things from the 1-on-1 we didn't have time to expand on:

1. {{specific_observation_about_their_yaml}}
   Quick fix: {{action}}

2. {{specific_question_they_asked_at_the_event}}
   Resource: {{link}}

3. The audit log query you tried at the end — Agent 365 has a "saved query" feature we didn't cover. {{one_sentence_explanation}}

If you want to keep going on this, the AI Engineer Bootcamp Cohort #14 starts {{date}} — there's a full 2-week module on production AI governance. Happy to set up a 15-min chat with our advisor if that's relevant.

Either way, hope to see you at the next one.

—— {{instructor_name}}
JR Academy
```

## 发布记录

（暂无）

## Comments

- @system 2026-05-05T02:08:43.464Z
  > 由 `omni-report/scripts/marketing-topics-to-tasks.ts` 自动从内容选题包「推荐线下活动 #1」生成。
