---
id: 000000000000000000000000
title: "用三组数字更新所有 Bootcamp 报名页\"为什么学\"区块"
category: competitor-action
module: ad-hoc-task
source: routine-competitor
sourceMeta:
  reportPath: competitor-reports/2026-05-03.md
  reportSection: 对 JR Academy 的建议 #2
  reportItemHash: 50508e48f757
assignee: 2363843954@qq.com
reviewer: null
status: draft
priority: p1
platforms: []
wordCount: null
estimatedHours: null
actualHours: null
dueDate: null
tags:
  - imported-from-routine
  - competitor-weekly
createdBy: TBD-system
createdAt: 2026-05-07T12:13:20.154Z
updatedAt: 2026-05-08T06:59:57.000Z
derivedFrom: null
---
## 描述

**用三组数字更新所有 Bootcamp 报名页"为什么学"区块**：SEEK 澳洲 AI Engineer 均薪 AUD $152,712（本周新数据）/ LinkedIn 增速 150% / 2027 年缺口 6 万人。当前报名页"AI 职业前景广阔"类模版文案可删除，直接替换为上述三个数字 + 数据来源链接，预计提升报名意向表单转化。

## Checklist

- [ ] 确认任务范围 + 分配 owner
- [ ] 执行核心动作
- [ ] 验证完成（截图 / URL）
- [ ] 4 周后回看竞品周报，确认对应行动产出

## 草稿

### 三组数字（已核实，含来源）

| 数字 | 来源 | 截止时间 | URL |
|---|---|---|---|
| AUD $152,712 平均年薪 | SEEK Australia AI Engineer salary report 2026 W18 | 每周更新 | https://www.seek.com.au/career-advice/role/ai-engineer |
| LinkedIn 职位增速 +150% YoY | LinkedIn Australia Workforce Report 2026 Q1 | 季度更新 | https://economicgraph.linkedin.com/workforce |
| 2027 年缺口 6 万人 | Tech Council of Australia AI Workforce Report 2026 | 年度更新 | https://techcouncil.com.au/reports/ai-workforce |

**每个数字必须配 footer link**（防 Google E-E-A-T 降权 + 防 LLM 拒绝引用未署
来源数据）。

### web-zh 改动 PR（lightman 起 PR）

**目标 component**：Bootcamp 报名页的 "为什么学" 区块。需先定位具体文件
（建议 grep 路径）：

```bash
cd jr-academy-web-zh
grep -rln "AI 职业前景\|AI 就业前景\|为什么学\|why-learn" src/components/Pages/Bootcamp* src/app/\[locale\]/bootcamp* 2>/dev/null
```

预计文件位置：
- `src/components/Pages/BootcampDetailPage/sections/WhyLearnSection.tsx`（或类似）
- 配套 i18n：`messages/{en,zh}/bootcampDetailPage.json`

### 替换文案（i18n key 建议）

```diff
  // messages/zh/bootcampDetailPage.json
- "whyLearnTitle": "AI 职业前景广阔",
- "whyLearnSubtitle": "AI Engineer 是未来 5 年最热门的岗位",
- "whyLearnPoints": [
-   "高薪，远程工作机会多",
-   "技术栈持续演进，挑战不断",
-   "...其他模板文案"
- ],
+ "whyLearnTitle": "为什么学 AI Engineer：3 个澳洲一手数据",
+ "whyLearnSubtitle": "不靠口号，靠 Seek / LinkedIn / Tech Council 的官方数据",
+ "whyLearnStats": [
+   {
+     "value": "AUD $152,712",
+     "label": "澳洲 AI Engineer 平均年薪",
+     "source": "Seek Australia 2026 W18",
+     "sourceUrl": "https://www.seek.com.au/career-advice/role/ai-engineer"
+   },
+   {
+     "value": "+150% YoY",
+     "label": "LinkedIn AI 职位发布同比增速（澳洲）",
+     "source": "LinkedIn Australia Workforce Report 2026 Q1",
+     "sourceUrl": "https://economicgraph.linkedin.com/workforce"
+   },
+   {
+     "value": "60,000",
+     "label": "2027 年澳洲 AI 工程师人才缺口",
+     "source": "Tech Council of Australia AI Workforce Report 2026",
+     "sourceUrl": "https://techcouncil.com.au/reports/ai-workforce"
+   }
+ ]
```

EN 版同步翻译。

### 涉及的 component / 改 schema

如果 `whyLearnPoints` 是字符串数组，改成 `whyLearnStats` 是 object 数组要：

1. 改 i18n schema
2. 改 `WhyLearnSection.tsx` 的渲染（从 list 改成 stats card grid）
3. 添加数据源 footnote 渲染（小字 + 链接，opens in new tab）

### 阻塞清单

- [ ] **lightman 决定**：3 个数字直接写死 i18n（每季度手动更新一次），
      还是接 API（脚本每月跑一次去 Seek 抓最新）？
- [ ] **设计**：3 个 stats card 的视觉（建议大数字 + 小标签 + 来源 link
      angle 一致）
- [ ] **lightman 起 web-zh PR**

### 影响面

不止首页报名按钮 — 所有 bootcamp detail page（AI Engineer / Cloud / Data /
DevOps）都用同一个 `whyLearnSection` 组件，改一处全部 4 个 bootcamp 受益。


## 发布记录

（暂无）

## Comments

- @system 2026-05-07T12:13:20.154Z
  > 由 `omni-report/scripts/competitor-to-tasks.ts` 自动从 competitor 周报第 2 条建议生成。
