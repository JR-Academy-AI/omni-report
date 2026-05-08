# 2026-05-08 Dedupe Archive

归档 5 张冗余卡。原因 + 替代关系：

## 重复对（routine 重复生成同一任务）

ai-visibility 报告每跑一次都生成"修这条 query"的卡，但 to-tasks routine 没做 idempotent 检查，导致 2026-05-04 报告 + 2026-05-06 报告产出**同一任务的两份卡**。-06 报告内容更完善（更新的 ROI 措辞 + 补充行动建议），保 -06，归档 -04。

| 归档卡（-04） | 替代为（-06，留 active） |
|---|---|
| `aivis-2026-05-04-01-...context-engineering.md` | `aivis-2026-05-06-01-...context-engineering.md` |
| `aivis-2026-05-04-03-...路线图.md` (status: draft) | `aivis-2026-05-06-04-...路线图.md` (status: review，进度更靠前) |
| `aivis-2026-05-04-04-...Q6求职.md` | `aivis-2026-05-06-03-...Q6求职.md` |
| `aivis-2026-05-04-05-...MCP入门.md` | `aivis-2026-05-06-05-...MCP入门.md` |

## 脏数据

| 归档卡 | 原因 |
|---|---|
| `adhoc-22323.md` | title=`22323`，明显手工测试 garbage 数据 |

## 上游修复（避免再发生）

`omni-report/scripts/ai-visibility-to-tasks.ts` 应该加 idempotent check：
- 看 `marketing-tasks/active/` 下是否已有同 `topicId` + 同 query 的卡（比对 `sourceMeta.reportItemHash` 或 query 文本）
- 已存在则只更新（status / ROI 文案 / due date），不重复创建

要恢复某张卡：`git mv marketing-tasks/_archive/2026-05-08-dedupe/<file> marketing-tasks/active/`
