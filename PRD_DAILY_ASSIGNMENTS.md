# JR Academy 每日工作分配 — PRD

> **状态**：起草中（v0.1）— 2026-04-26
> **依赖**：`omni-report/TEAM.md`（团队路由表）

---

## 1. 背景与目标

### 1.1 为什么要做

JR Academy 当前 marketing 团队跨 3 城运作（成都 6 全职 + 1 实习 / 墨尔本 1 casual + 1 实习 / 布里斯班 1 实习），加上 omni-report 的 4 个 routine 每周产出大量"建议/选题/玩法/行动项"，但**这些条目落到具体人头的步骤完全靠人工**：

- 站会上运营要花 30-60 分钟从 4 份报告里挑活、对人、分配 — 每周重复 2-3 次
- 时区 / casual 工作日 / 实习深度限制 — 容易派给非工作日的人或灌爆 casual 同事
- 实习生（Bella / KIKI-BNE / Han）需要明确 todo 才能开工，没派活就空转
- 报告积压：周日的 competitor 周报到周一才被消费 → 时效性损失

omni-report 已经把"识别要做什么"自动化了，差最后一公里 — **把待办池切给具体人**。

### 1.2 目标

每个工作日**成都时间 10:30**（保证当日所有上游 routine 已跑完）自动产出一份 `daily-assignments/{YYYY-MM-DD}.md`，让站会拿起来直接开工：

- 10 人 active 每人当日 3-5 条具体可执行 todo（实习生节奏减半）
- 自动遵守 `TEAM.md` 路由规则：Seren 周四+周五才主动派、Bella 视频号上下游、KIKI-BNE/Han 派支持性任务为主
- 时区感知：今天哪几个人在线（成都全职默认在线 / Seren 只周四+周五 / 实习生待用户标注）
- 无 owner 的条目（@TBD-xxx）单独列出，运营在站会上人工讨论
- 海外实习生非工作日的待派条目挂"待办池"，等他们上线那天再派

### 1.3 非目标

- ❌ **不替代站会** — 这是站会的输入，不是替代品；运营仍要复核 / 调整 / 拍板
- ❌ **不自动 push 到个人 IM** — 不发微信 / Slack / 邮件给本人。落地到 GitHub + Notion，本人自己看
- ❌ **不自动验收任务完成度** — Phase 1 只派活，不追踪
- ❌ **不分配以下人**（按 TEAM.md 严格执行）：
  - `@Aurora`（暂停）
  - `@Melody`（HR only）
  - `@Amelia / @Rain / @Angela`（一线销售，常规跟进不适合 routine 派）
- ❌ **不重写 TEAM.md** — 路由规则改动必须先改 TEAM.md，本 routine 只读不写

---

## 2. 输入数据源

### 2.1 必备输入（Phase 1）

| 来源 | 抓什么 | 频率 | 备注 |
|------|--------|------|------|
| `competitor-reports/` 最近一份 | TL;DR + §4 行业动态 + §6 建议 | 周日 20:00 产出 | 周一最新鲜，周二-周日逐渐过时 |
| `marketing-topics/` 最近一份 | 5 讲座 + 3 活动 + 2-3 联名 + 2-3 长尾 | 周一+周三 08:00 产出 | 周一/周三当日最新鲜 |
| `growth-playbook/` 最近一份 | 5 玩法 idea | 周二 07:00 产出 | 周二最新鲜 |
| `ai-visibility/` 最近一份 | 行动清单（补内容 / 修 meta / 增 mention） | 周三 09:00 产出 | 周三最新鲜 |
| `TEAM.md`（本仓） | 路由规则 + 8 人 + 3 实习 + 4 TBD | 静态 | 团队变动时手工更新 |

### 2.2 可选输入（Phase 2 + 才加）

| 来源 | 备注 |
|------|------|
| `jr-wiki/posters/{YYYY-MM-DD}` | 当日大学新闻 / AI 日报海报 → Bella 视频号选题 |
| `curriculum/_research/*.md` | 课程研究 → 给新媒体三人组的内容素材 |
| Bootcamp 进度（`jr-academy/api`） | bootcamp 开营 / 闭营时间点 → 触发宣传任务 |
| CRM 数据（Neomi 周报需要） | 销售线索来源、转化漏斗 |
| 淘宝考证店铺数据 | Neomi 店铺日常 |

### 2.3 时间维度

- **"今天"按成都时间** (Asia/Shanghai, UTC+8)
- 文件命名 `daily-assignments/2026-04-27.md` = 成都的 2026-04-27
- "在线人员"判断：
  - 成都全职 6 + Bella：默认在线（除非用户后续标 Bella 工作日）
  - Seren：当日是周四 / 周五 → 在线；否则离线
  - KIKI-BNE / Han：工作日待用户标注；**未标注前默认每周 2 天在线，但具体哪天不确定 → 派给他们的活先列入"待办池"，运营手工触发**

---

## 3. 输出规范

### 3.1 文件路径

`daily-assignments/{YYYY-MM-DD}.md`（成都日期）

### 3.2 Markdown 结构

```markdown
# JR 团队每日工作分配 YYYY-MM-DD（周X）

> 生成时间：YYYY-MM-DD HH:MM CST
> 输入：competitor [date] / marketing-topics [date] / growth-playbook [date] / ai-visibility [date]
> 路由：[TEAM.md](../TEAM.md)

## 📊 今日就位人员

| 人 | 城市 | 状态 |
|---|---|---|
| Summer / Lily / KIKI-CD / Ada / Neomi / Beta | 📍 成都 | ✅ 在线 |
| Bella（实习） | 📍 成都 | ✅ 在线（待标注工作日，默认在线） |
| Seren | 📍 墨尔本 | ✅ 在线 / ⏸️ 离线（视当日是否周四/周五） |
| Han（实习） | 📍 墨尔本 | ⏸️ 待办池（工作日待标注） |
| KIKI-BNE（实习） | 📍 布里斯班 | ⏸️ 待办池（工作日待标注） |

## 🎯 今日 Top 3 优先级（运营关注）

1. 🔴 [事件] — [why important] — owner @X
2. 🔴 ...
3. 🟡 ...

---

## 👤 个人 todo

### @Summer (📍 成都，新媒体 — 求职 / 实习 / 主品牌)
- 🔴 [任务标题]
  - 来源：marketing-topics 2026-04-25 §🌱 长尾话题
  - 内容：撰写 1 条小红书笔记，主题"[X]"，钩子"[Y]"，配图方向"[Z]"，发"澳洲匠人学院"账号
  - 预估：1.5h

### @Lily (📍 成都，新媒体 — 人物号 / 主品牌副号)
- 🟡 ...

### @KIKI-CD (📍 成都，新媒体 — 校园)
- 🟢 ...

### @Bella (📍 成都，实习 — 视频号 + 转移资料)
- 🔴 视频号选题：把上周 @Summer 爆款笔记《[标题]》改编为 30s 短视频脚本
  - 来源：上下游链路（TEAM.md §1.4）
  - 预估：2h

### @Ada (📍 成都，运营)
### @Neomi (📍 成都，销售 ops + 淘宝)
### @Beta (📍 成都，教务 + 社群)

### @Seren (📍 墨尔本，casual 周四+周五) — [今日状态]
- 当日是周四/周五 → 列今日 todo
- 否则 → "本节空，活在『等 Seren 上线』待办池"

### @Han (📍 墨尔本，实习 2d/w) — [待办池]
- 列已识别但等他工作日才能派的活

### @KIKI-BNE (📍 布里斯班，实习 2d/w) — [待办池]

---

## 🚧 待人工讨论（无 owner）

> 这些条目 routine 识别出来但找不到合适的人，运营在站会决定 → 本节不为零，宁可有 3 条也不要省略。

- 🔴 `@TBD-product`: [课程 / 讲师 / 联名品牌决策类，待人工指派]
- 🟡 `@TBD-content`: [公众号 / 长文 / SEO，无人 owner]
- 🟢 `@TBD-tech`: [SEO 技术修复 / 站内结构 / sitemap，无人]
- 🟡 `@TBD-mkt`: [悉尼 / 其他城市线下活动，无对接人]

---

## 📌 等海外实习生上线再派（待办池）

- ⏳ 等 @Seren 周四 / 周五上线（当前是周一-周三 / 周末）
  - [待派条目 1]
  - [待派条目 2]
- ⏳ 等 @Han 工作日（待用户标注）
  - [待派条目]
- ⏳ 等 @KIKI-BNE 工作日（待用户标注）
  - [待派条目]

---

## 📈 数据 ping

- 上一日完成度：[N/A，Phase 2 才追踪]
- 当周累计派活：[X 条 / 10 人]
- TBD 条目积压：[Y 条] — 提醒运营尽快指派
```

### 3.3 反 AI 味格式（强制）

- ❌ "在当今...""综合性""值得关注""加强协同""把握机遇"
- ✅ 每条 todo 必须有：
  - **来源**（哪份报告的哪一段）
  - **具体内容**（动词 + 对象 + 平台 + 钩子 — "撰写 1 条 X 平台 Y 主题笔记，钩子 Z"，不是"做内容")
  - **预估工时**（让本人判断能否在当日完成）
- ✅ 优先级符号：🔴 今日必做 / 🟡 本周内 / 🟢 月内
- ✅ 实习生 todo 节奏减半（全职 3-5 条 / 实习生 1-3 条）
- ✅ Seren todo 必须考虑她 casual 节奏（单周 ≤ 2 个 deadline 任务）
- ❌ 派给已"禁用"的人（Aurora / Melody / Amelia / Rain / Angela）→ 立即丢弃或转 `@TBD-xxx`
- ❌ 裸用 `@KIKI` → 必须明确 `@KIKI-CD` 或 `@KIKI-BNE`

---

## 4. 技术方案

### 4.1 配置

| 项 | 值 |
|---|---|
| 触发 | Cron `30 2 * * 1-5`（UTC = 10:30 CST = 12:30 AEST winter / 13:30 AEDT summer） |
| 跑哪几天 | 周一-周五 |
| 时区基准 | Asia/Shanghai（输出文件命名用成都日期） |
| Routine 平台 | claude.ai/code/routines |
| 输出位置 | `omni-report/daily-assignments/{YYYY-MM-DD}.md`（git push） |
| Notion sync | hub page TBD（建议复用 marketing 系列 hub `34ddd76b576d80c69e1ac4b65668658b`，新建子页 "📅 每日工作分配"） |
| 输出语言 | 中文 |

> 选择 10:30 CST 的理由：所有上游 routine 在此时间前已跑完
> - SEO healthcheck 06:00 AEST = 04:00 CST ✅
> - marketing-topics 周一+三 08:00 AEST = 06:00 CST ✅
> - growth-playbook 周二 07:00 AEST = 05:00 CST ✅
> - ai-visibility 周三 09:00 AEST = 07:00 CST ✅
>
> 10:30 CST 也对应成都团队午饭前 — 派活刚好让团队午饭后开干。Seren 周四/周五对应墨尔本 12:30 AEST / 13:30 AEDT，她午饭后正好看到。

### 4.2 防 stream idle timeout（沿用现有 routine 教训）

每个 routine turn ≤ 1k tokens / 每个 tool call I/O ≤ 3k tokens / 每个 phase 完成立刻 commit + push。

**4 个 Phase 渐进 commit：**

```
Phase A (骨架)
  ├─ 读 TEAM.md 拿到当前路由 + 在线人员
  ├─ 算"今天"的成都日期 + 星期几（决定 Seren 是否在线）
  ├─ 列 daily-assignments/{date}.md 框架（含所有 section header + 空个人 todo）
  └─ commit "phase A: 骨架 {date}"

Phase B (上游消费)
  ├─ 读最近 7 天的 4 份 omni-report（competitor / marketing-topics / growth / ai-visibility）
  ├─ 提取所有 actionable items（建议 / 选题 / 玩法 / 行动项）
  ├─ 暂存到一个"待办池"列表（in-memory）
  ├─ 把池子按 TEAM.md §2 路由规则切成 10 个人 + 4 TBD
  └─ commit "phase B: 待办池切片"

Phase C (人头 todo)
  ├─ 按 §3.2 模板逐人填 3-5 条具体 todo（实习生 1-3 条）
  ├─ 每人写完追加进 .md → 立刻 commit "phase C: @<name> todo"
  ├─ 共 10 个 commit（每人一个）— 防中断丢失
  └─ 海外实习生 + Seren 非工作日 → 内容写到"等上线再派"章节

Phase D (TBD + ping + Notion)
  ├─ 写 🚧 待人工讨论 section（4 个 TBD 标签）
  ├─ 写 📈 数据 ping section
  ├─ 写 🎯 Top 3 优先级（基于个人 todo 里 🔴 标的，挑前 3）
  ├─ 最后 commit "phase D: 完成 {date}"
  ├─ Notion MCP 写极简摘要页（≤ 1k tokens — Top 3 + 各人条数 + 关键 TBD + GitHub 链接）
  └─ done
```

### 4.3 时间冲突 / 重叠 routine 处理

- **若上游 routine 延迟（如 marketing-topics 还没跑完）** → daily-assignments 仍按时跑，但读不到当日报告，使用上一份。在 §3.2 顶部"输入"区显式标注"marketing-topics 当日未产出，使用 [上次日期]"。
- **公共假期**（春节 / 国庆 / Christmas / Easter）→ Phase 1 不处理，工作日继续跑（运营当日可能不开站会，文件留档）。Phase 2 加 holiday calendar。

### 4.4 异常处理

- 4 份报告全部读不到 → 跑空架子 + 在 §3.2 顶部标"⚠️ 上游无报告，仅基于 TEAM.md 派静态周期任务（如 Neomi 销售周报）"
- TEAM.md 读不到 → fail fast（这是必须的）
- Notion sync 失败 → 不阻塞 git push，记 warning

---

## 5. 验收标准

### 5.1 跑通验收

- [ ] 工作日 10:30 CST 准时跑（首次手工触发验证）
- [ ] 4 份上游报告若都存在，全部被读到（看 Phase B 输出）
- [ ] 文件写到 `daily-assignments/2026-MM-DD.md`，git commit 成功
- [ ] Notion 极简摘要页同步成功

### 5.2 内容验收

- [ ] 10 个 active 人头 section 全部存在（即使是 "本节空" / 待办池）
- [ ] 每个全职在线同事 3-5 条 todo；实习生 1-3 条；Seren 按当日 online/offline 区分
- [ ] 🚧 TBD section 不为零（除非确实当日没有 TBD 条目，但概率小）
- [ ] 严格遵守 TEAM.md：禁用人没出现 / 裸 @KIKI 没出现
- [ ] 反 AI 味格式过关：随机抽 3 条 todo，每条都有 来源 + 具体内容 + 预估工时
- [ ] Top 3 优先级与个人 todo 里的 🔴 项一致

### 5.3 不接受

- ❌ "派活给 Aurora" / "派活给 Melody" / "派活给 Amelia"
- ❌ "@Summer 加强小红书运营" 这种空话
- ❌ 实习生派 6 条以上活（节奏不对）
- ❌ Seren 在周一/周二/周三 收到当日 deadline 任务

---

## 6. Roadmap

### Phase 1（先跑起来）— 目标 2026-04-30 上线

- 输入：4 个 omni-report 报告 + TEAM.md
- 输出：本地 .md + Notion 极简摘要
- 周一-周五 10:30 CST 跑
- 10 人 todo 全覆盖（实习生 / casual / 在线判断已实现）

### Phase 2（增强输入源）— 2026-05-15 前

- 加 jr-wiki 当日大学新闻 / AI 日报作为新媒体三人组 + Bella 的额外素材源
- 加 Bootcamp milestone（开营 / 闭营 / Demo Day）触发宣传任务
- Notion 拆每人一页（点开看自己 todo）— 否则总表太长

### Phase 3（闭环）— 2026-06 前

- 第二天 routine 读昨天的 todo + 实际产出（小红书爬数 / Notion 状态）→ 完成度反馈
- 数据驱动调整 TEAM.md 路由规则（哪个人活灌爆了 / 哪个人空闲）
- 加 IM push（仅给运营负责人，不直推个人）

---

## 7. 与其他 routine 的关系

```
周日 20:00 AEST (18:00 CST)
  └─ competitor-reports → 周一 daily-assignments 消费

每日 06:00 AEST (04:00 CST)
  └─ seo-healthcheck → daily-assignments 不消费（只是 @TBD-tech 列入 TBD section）

周一 + 周三 08:00 AEST (06:00 CST)
  └─ marketing-topics → 当日 daily-assignments 消费

周二 07:00 AEST (05:00 CST)
  └─ growth-playbook → 周二 daily-assignments 消费

周三 09:00 AEST (07:00 CST)
  └─ ai-visibility → 周三 daily-assignments 消费

工作日 10:30 CST (12:30 AEST / 13:30 AEDT)  ← daily-assignments 在此跑
```

daily-assignments 是 omni-report 的 "**消费层**"。omni-report 之前的 5 个 routine 都是"生产层"（生产建议 / 选题 / 玩法 / 行动项），daily-assignments 把这些消化成具体人头 todo。

---

## 8. 已知限制 / 待用户回答

| 项 | 当前状态 | 影响 |
|---|---------|------|
| Bella 工作日是哪 3 天 | 待标注，默认全周在线 | 可能在她非工作日派活 |
| KIKI-BNE 工作日是哪 2 天 | 待标注 | 派给她的活先放待办池，等她上线运营手工触发 |
| Han 工作日是哪 2 天 | 待标注 | 同上 |
| Han 与 Seren mentor 关系 | 待确认 | 影响"协助 Seren"还是"独立干活" |
| Notion hub page 用哪个 | 待用户选 | 默认建议 marketing 系列 hub `34ddd76b576d80c69e1ac4b65668658b` 下新建子页 |
| 公共假期日历（中国 + 澳洲） | Phase 1 不处理 | 假期当天仍跑，运营自行忽略 |

---

## 附录 A：相关文档

- [TEAM.md](./TEAM.md) — 团队路由表（必读）
- [README.md](./README.md) — omni-report 总入口
- [PRD_COMPETITOR_WEEKLY.md](./PRD_COMPETITOR_WEEKLY.md) — 上游：竞品周报
- [PRD_MARKETING_TOPICS.md](./PRD_MARKETING_TOPICS.md) — 上游：内容选题包
- [PRD_GROWTH_PLAYBOOK.md](./PRD_GROWTH_PLAYBOOK.md) — 上游：增长玩法
- [PRD_AI_VISIBILITY.md](./PRD_AI_VISIBILITY.md) — 上游：AI 可见度
