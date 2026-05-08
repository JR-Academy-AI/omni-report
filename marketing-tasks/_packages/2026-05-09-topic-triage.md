# Topic Cards 分档报告 — 2026-05-09

**14 张** `routine-marketing-topics` 卡分成 4 类，每类不同执行路径。

| 类别 | 张数 | 谁来做 | 状态 |
|---|---:|---|---|
| A. Evergreen 长文（content-topic） | 3 | Claude 起草 / lightman 补真实数据 | 本次有产出 |
| B. Webinar 排期（campaign） | 5 | Aurora / Seren 排日历 + 主讲人 | 阻塞，待排期 |
| C. 线下活动（event-offline） | 3 | Event manager + offline-event-sop skill | 阻塞，待启动 |
| D. Partnership 外联（partnership） | 3 | lightman 亲自外联（已起草邮件） | 邮件已备好 |

---

## A. Evergreen 长文（3 张，Claude 直接起草）

### A1. `topic-...-evergreen-01-...开源大模型五选一完整测评`
- **Claude 出**: 文章骨架 + 章节大纲 + 测评维度表
- **lightman 补**: 实际跑 5 个模型（Gemma 4 / Kimi K2.6 / Mistral 128B / Muse Spark / DeepSeek V4）跑分数据
- **下一步**: 已写 outline 到卡的 `## 草稿` section（待 Claude 实际跑分后填表）

### A2. `topic-...-evergreen-02-澳洲-AI-转型-12-个月真实账单`
- **Claude 出**: 结构 + 5 个虚拟 persona 框架（学员 A-E 的 12 个月时间线模板）
- **lightman 补**: 5 个真实学员实际数字（学费、求职时长、offer 数字、薪资）
- **下一步**: outline 待 lightman 提供真实数据后人工填空

### A3. `topic-...-evergreen-03-Multi-Agent-5-种设计模式速查`
- **Claude 直接起草完**: 这是纯架构论述，不需要真实数据
- **下一步**: 草稿写到 `geo-content-factory/drafts/multi-agent-patterns/draft.md`（与 evergreen-03 卡 `## 草稿` 段落同步）

---

## B. Webinar 排期（5 张，阻塞 → marketing 排日历）

每张需要 Aurora / Seren 决定：
1. **日期 + 时间**（建议周三或周五晚 8 点澳洲时间 / 早 6 点国内）
2. **主讲人**（含外部嘉宾邀请意向）
3. **是否需 ppt 套模板**（lesson-design skill 可生成）

| 卡 | 优先级 | 推荐排期 | 主讲人推荐 |
|---|---|---|---|
| webinar-01 Enterprise Agent Governance | p0 | 5 月第 4 周 | lightman + Microsoft Agent 365 PM（外邀） |
| webinar-02 Q2 开源模型五选一 | p0 | 5 月第 3 周 | 教研组 + 1 学员现场跑分 |
| webinar-03 Multi-Agent LangGraph + Kimi | p1 | 6 月第 1 周 | lightman / 教研组 |
| webinar-04 DeepSeek V4 技术报告精读 | p1 | 6 月第 2 周 | 教研组 + DeepSeek 社区贡献者（外邀） |
| webinar-05 Microsoft / TAFE 入门后真实项目 | p2 | 6 月第 3 周 | TAFE 课程经理 + JR 教研组 |

**触发动作**: Aurora / Seren 在卡 frontmatter 把 status 从 `draft` 改成 `ready` + 加 `scheduledAt: <ISO>` 字段。Cron 接住后建相应 ppt + 报名页。

---

## C. 线下活动（3 张，阻塞 → 启动 offline-event-sop）

| 卡 | 城市 | 形式 | 阻塞点 |
|---|---|---|---|
| event-01 Agent Governance Workshop | Sydney | 2h workshop, 14 人 | 场地 + Agent 365 沙箱账号 |
| event-02 开源模型 Hackathon | TBD | 半天 hackathon, 20 人 | 场地 + 评委 + 奖品 |
| event-03 AI 转型夜谈 × 求职数据解读 | TBD | 沙龙 + 数据分享 | 场地 + 数据脱敏审 |

**触发动作**: Event manager 调 `offline-event-sop` skill 走 6 阶段流程；策划案要过 `offline-event-content-design` 8 框架审核。

---

## D. Partnership 外联（3 张，邮件已起草）

每张都需要 lightman 亲自发，运营不能代发（外部 stakeholder）。下方邮件草稿已写到对应卡的 `## 草稿` section，复制即可发。

| 卡 | 收件人 | 关键诉求 |
|---|---|---|
| partnership-01 LangChain Academy × JR | LangChain BD（partnerships@langchain.com） | 联合发布"中文 LangChain 完整学习路径"，互导生源 |
| partnership-02 Microsoft AU TAFE × JR | Microsoft AU Education Lead + TAFE QLD/NSW | "入门后接力"定位，从 TAFE 学员漏斗到 JR Bootcamp |
| partnership-03 量子位 × JR AIGC 峰会 | 量子位 BD（pr@qbitai.com） | 5/20 北京峰会前置数据投稿 + 现场 JR 展位 |

---

## 执行节奏建议（下周）

```
今天（2026-05-09）：
  A3 Multi-Agent 5 模式起草 → push   ← Claude 已完成
  D1-D3 partnership 邮件草稿 → push  ← Claude 已完成
  triage 报告（本文档）发给 marketing 周会

明天（2026-05-10）：
  A1 / A2 outline 推给 marketing，lightman 收集真实数据
  Aurora/Seren 在 marketing 周会排 webinar 5 张日历
  Event manager 启动 event-01 场地申请

下周内：
  lightman 发 D1-D3 三封 partnership 邮件
  webinar-01 + webinar-02 排好 → 起 ppt
```
