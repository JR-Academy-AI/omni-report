# omni-report

JR Academy 运营报告归档仓库。各类站点健康度 / SEO / 数据完整性 / 内容质量等定时跑出来的报告都落在这里。

## 目录

```
seo-reports/{YYYY-MM-DD}.md          每日 jiangren.com.au sitemap 健康度报告
competitor-reports/{YYYY-MM-DD}.md   每周日 23 家竞品 × 5 维度情报简报
scripts/                              生成报告的脚本
PRD_COMPETITOR_WEEKLY.md             竞品周报 PRD
```

## SEO Healthcheck

每天 AEST 06:00 由远程 routine 自动跑：

1. 拉 `https://jiangren.com.au/sitemap.xml` index → 递归展开 23 个子 sitemap
2. 并发 HEAD 请求所有 URL（concurrency=20, 10s timeout, 跟随 3xx）
3. 分类：200 / 3xx / 404 / 410 / 5xx / timeout / DNS-error
4. diff 昨天的报告 → 标 🆕 新坏 / 🔁 持续坏 / ✨ 已修复
5. 写 `seo-reports/{YYYY-MM-DD}.md`

本地手跑：

```bash
bun run scripts/seo-healthcheck.ts                # 用今天 AEST 日期
bun run scripts/seo-healthcheck.ts 2026-04-25     # 指定日期（写到该日期文件名）
```

## Competitor Weekly Research

每周日 20:00 AEST (Brisbane) 由远程 routine 自动跑：

1. **5 个 batch 渐进 commit**（防 stream idle timeout）：先写骨架 → Batch A 全球 → B 中文 → C 澳洲 → D Newsletter → E 求职 → finalize TL;DR + 建议
2. WebSearch 23 家竞品（全球 AI 学习平台 10 + 中文 AI 学习 6 + 澳洲 Bootcamp 4 + AI Newsletter 3）× 5 个维度（新课/定价/内容/行业/求职）
3. 反 AI 味格式硬规则（每条信息要有公司名 + 链接 + 日期/数字）
4. 写 `competitor-reports/{YYYY-MM-DD}.md`（约 6-7 个 commit 渐进 push）
5. Notion MCP 写**极简摘要页**（TL;DR + 关键动态 + 建议 + GitHub 全文链接，≤1k tokens）到 hub page `34ddd76b576d8068abbed825956db0c6`

完整规范见 [`PRD_COMPETITOR_WEEKLY.md`](./PRD_COMPETITOR_WEEKLY.md)。

Routine: https://claude.ai/code/routines/trig_013pfieJXDDCa9rQktNxFoKx

## 加新报告类型

新增报告类型时：

1. 在 `scripts/` 写 `{report-type}-healthcheck.ts`
2. 在仓库根新建 `{report-type}-reports/` 目录
3. 在 `package.json` 加 `"{report-type}": "bun run scripts/{report-type}-healthcheck.ts"`
4. 创建 RemoteTrigger routine（参考 SEO 那个）

每个报告类型独立目录，不混在一起。
