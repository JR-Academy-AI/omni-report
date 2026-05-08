# AI Visibility + Competitor 行动卡分档 — 2026-05-09

**8 张** 行动卡（5 aivis + 3 competitor）按"谁来做"分 3 类。

| 卡 | 类别 | 谁来做 | 本次产出 |
|---|---|---|---|
| aivis-01 提交 GSC URL Inspection | B | lightman 浏览器 | ↓ 步骤清单 |
| aivis-02 Course Report 档案页 | B | lightman 注册 + 邮件 | ↓ 邮件草稿 |
| aivis-03 /en 页面 metadata 检查 | A | Claude 已检查 | ↓ 具体修复建议 |
| aivis-04 AI Engineer Roadmap 5000 字 | A | Claude 起草 | ↓ outline + 触发方式 |
| aivis-05 MCP 入门教程 2000 字 | A | Claude 起草 | ↓ outline + 触发方式 |
| competitor-01 Enterprise Agent Governance 章节 | A | Claude + 教研组 | ↓ 章节 outline |
| competitor-02 三组数字更新报名页 | A | Claude | ↓ 具体改哪 + 改成什么 |
| competitor-03 Microsoft/TAFE 学员定向推 | C 合并 | 已并入 partnership-02 | ↓ 交叉引用 |

A 类（Claude 可做）= 5 张；B 类（lightman 浏览器）= 2 张；C 类（合并）= 1 张。

---

## B 类详细步骤

### aivis-01 提交 GSC URL Inspection

1. 打开 https://search.google.com/search-console
2. 选 property `jiangren.com.au`（如多 property，选 verified Domain property）
3. 顶部搜索框输入：`https://jiangren.com.au/learn/context-engineering`
4. 点 **Request Indexing** 按钮
5. 同时 inspect `https://jiangren.com.au/learn/context-engineering/`（带尾斜杠版本）确认两个 URL 一致
6. 验证 `uat.jiangren.com.au` robots.txt 含 `noindex`：
   ```
   curl https://uat.jiangren.com.au/robots.txt
   # 应包含 Disallow: / 或 X-Robots-Tag: noindex
   ```
7. 在卡 `## 发布记录` 段贴 GSC inspection 截图 + 当时 indexing 状态
8. 4 周后回看 ai-visibility 周报 Q19，确认 LLM 提及率 / 排名变化

### aivis-02 Course Report 档案页

1. 访问 https://www.coursereport.com → 顶栏 "For Schools" → 申请管理员账号
2. 注册邮箱建议用 `marketing@jiangren.com.au`（如不存在则 `lightman@jiangren.com.au`）
3. 提交学校信息（已做 → 跳到 4；没做 → 用下方模板）：

   ```
   School Name: JR Academy
   Website: https://jiangren.com.au
   Location: Sydney, Australia (additional: Melbourne, Brisbane, Adelaide)
   Founded: 2018
   Programs offered:
     - AI Engineer Bootcamp (16 weeks, full-time / part-time)
     - Cloud / DevOps Engineer Bootcamp
     - Data Engineer Bootcamp
   Tuition range: AUD 6,000 - 14,000
   Languages of instruction: Mandarin Chinese (with English-language modules)
   Accreditation: TEQSA-aligned curriculum
   Job placement support: Yes (P3 model: Project + Production + Placement)
   ```

4. 等 Course Report 审核（一般 3-5 工作日）
5. 通过后填档案页：上 logo / cohort 照片 / 学生评价 3 条 / outcome 数据
6. 卡 `## 发布记录` 段贴最终档案页 URL

---

## A 类详细执行

### aivis-03 /en 页面 metadata 检查（已查，需修）

**Q6 query**: "AI Engineer 怎么求职 澳洲"

需要落地的英文页面：`https://jiangren.com.au/en/learn/ai-engineer/hub` 或类似。
具体修复 PR 已写到对应卡 `## 草稿` section。

### aivis-04 AI Engineer Roadmap 5000 字长文

**结论**：长文 outline 在卡内，**触发 auto-writer cron 自动起草**（不要手写
5000 字，daily-writer.yml 已支持长文 chunked 3 段写法）。具体触发方式：

```
# 在 omni-report repo 跑：
npx tsx scripts/auto-write-from-task.ts \
  --task-file marketing-tasks/active/aivis-2026-05-06-04-写-1-篇2026-ai-engineer-完整学习路线图含澳洲求职路径长文50.md
```

或等明天的 daily-writer cron 自动接住（如果它支持 routine-ai-visibility 类型的卡）。

### aivis-05 MCP 入门教程 2000 字

同样走 auto-writer。outline + 测评条件已写到卡内。

### competitor-01 启动 Enterprise Agent Governance 章节

**结论**：这是 curriculum 修改，不是文章。需要 lightman + 教研组对齐。
章节 outline 已写到卡 `## 草稿`。

### competitor-02 三组数字更新报名页

**结论**：Claude 直接改 web-zh 报名页 component。具体哪三组数字 + 改在哪
（component 文件 + 行号）已写到卡 `## 草稿`。**这一项需要起一个 web-zh PR**，
不在 omni-report 范围内 → 后续 lightman 决定时机再触发。

### competitor-03 Microsoft/TAFE 定向推

**结论**：与 `topic-2026-05-04-partnership-02-microsoft-au-tafe...md` 重复。
已在 partnership-02 起草 Microsoft AU + TAFE 邮件。本卡 status 改 superseded
+ 加 comment 指向 partnership-02。
