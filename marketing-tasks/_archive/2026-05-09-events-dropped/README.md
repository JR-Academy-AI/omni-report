# 2026-05-09 — 线下 event 类 topic 卡批量 dropped

JR Academy 当前阶段不办线下活动（无 EA / 场地 / 物料预算 / ROI 不达标）。
routine-marketing-topics 自动产出的 `topic-*-event-*` 卡（workshop / hackathon / meetup / 夜谈 / 沙龙）一律 dropped，不再进派活池。

**被丢弃的 3 张**：
- `topic-2026-05-04-event-01` — Sydney Agent Governance 动手实验室
- `topic-2026-05-04-event-02` — Melbourne 开源模型 Hackathon
- `topic-2026-05-04-event-03` — Brisbane AI 转型夜谈 × 求职数据解读

**草稿内容保留**（已写好的落地页 / 招募文 / 1-on-1 followup 邮件模板等），
未来如果决定办某场再从这里 git mv 回 active/ 复用，不重复写。

**上游修复 TODO**：`omni-report/scripts/marketing-topics-to-tasks.ts` 应该
对 reportSection = "推荐线下活动" 的 item 默认落 `_drafts/events/` 而不是
直接进 `active/`，等市场团队人工拨到 active 才进派活池。
