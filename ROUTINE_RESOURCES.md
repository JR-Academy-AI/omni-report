# Routine 可消费资源清单

> **目的**：给 daily-assignments routine（以及未来所有 omni-report routine）做"资源弹药库"地图——routine 跑的时候知道有哪些数据源可拉、有哪些已有产出可消费、有哪些 ID 需要引用。
>
> **维护**：每发现一个新资源就追加一行（按区域归类），不要等到全部完整。**先保存比完美重要**。
>
> **状态**：扫描中（v0.1 — 2026-04-26）

---

## 1. omni-report 自身（直接消费层）

### 1.1 已上线的 routine 报告

| 路径 | 状态 | 产出节奏 | 文件大小（参考） | 备注 |
|------|------|---------|----------------|------|
| `seo-reports/{YYYY-MM-DD}.md` | ✅ 上线（1 day data） | 每日 06:00 AEST | TBD | sitemap 健康度，技术修复 — daily-assignments 不强消费 |
| `competitor-reports/{YYYY-MM-DD}.md` | ✅ 上线（1 day data 2026-04-25） | 每周日 20:00 AEST | ~13 KB / 报 | 23 家竞品 × 5 维度 — 周一 daily-assignments 消费 |
| `marketing-topics/{YYYY-MM-DD}.md` | ✅ 上线（1 day data 2026-04-25） | 每周一 + 周三 08:00 AEST | TBD | 5 讲座 + 3 活动 + 2-3 联名 + 长尾 — 当日 daily-assignments 消费 |
| `ai-visibility/{YYYY-MM-DD}.md` | ⚠️ PRD 已写但**还没跑过**（0 day data） | 每周三 09:00 AEST | TBD | 20 query GEO 测试 — 周三 daily-assignments 消费 |
| `growth-playbook/{YYYY-MM-DD}.md` | ⚠️ PRD 已写但**还没跑过**（0 day data） | 每周二 07:00 AEST | TBD | 5 增长玩法 — 周二 daily-assignments 消费 |
| `daily-assignments/{YYYY-MM-DD}.md` | 📋 PRD 起草中 | 每工作日 10:30 CST | TBD | **本 routine 自己** |

### 1.2 omni-report 内的脚本

| 路径 | 用途 |
|------|------|
| `scripts/seo-healthcheck.ts` | SEO sitemap 抓取脚本（唯一已存在的脚本，其他 routine 都是 prompt-only） |

> **结论**：omni-report 数据源**当前非常薄**——有 1-3 天历史，3 个 routine 还没跑过。daily-assignments 启动时要 graceful fallback，读不到当日报告就用上一份或退化为静态周期任务。

---

## 2. jr-wiki（最大的内容源）

### 2.1 AI 日报（routine 输入级金矿）

| 路径 | 内容 | 频率 |
|------|------|------|
| `jr-wiki/src/data/ai-daily/{YYYY-MM-DD}.json` | 当日 AI 行业新闻（结构化） | 每日 |
| `jr-wiki/dist/data/ai-daily/` | build 输出（同上） | 同步 |
| `jr-wiki/dist/ai-news-posters/{YYYY-MM-DD}/` | 当日海报 PNG（小红书可用） | 每日 |

**已有数据**：04-21 / 04-23 / 04-24 / 04-25 共 4 天 AI 日报；海报 04-09 ~ 04-25 共 9 天。

**daily-assignments 用法**：
- → `@Bella` 视频号选题：把当日 AI 日报头条改编成 30s 短视频
- → `@Summer` / `@Lily` 笔记选题：当日 AI 日报里挑 1-2 条做小红书改写

### 2.2 大学新闻（按校归类）

| 路径 | 内容 |
|------|------|
| `jr-wiki/src/data/uni-news/{unsw\|uq\|usyd\|uts\|uwa}/` | 5 大学新闻（按校）|

**daily-assignments 用法**：
- → `@KIKI-CD` 校园号选题：UQ课代表 / UNSW课代表 / 墨大课代表 拿对口大学的当日新闻
- → `@KIKI-BNE`（布里斯班实习）：UQ 当地新闻可直接做对接 / 调研

### 2.3 jr-wiki content（已上线长期内容）

| 路径 | 内容 |
|------|------|
| `jr-wiki/src/content/articles/` | 文章 |
| `jr-wiki/src/content/help/` | 帮助文档 |
| `jr-wiki/src/content/stories/` | 故事（学员故事？品牌故事？） |
| `jr-wiki/src/content/universities/` | 大学结构化页面 |
| `jr-wiki/src/content/wiki/` | wiki 主体 |

### 2.4 jr-wiki 脚本（可调用）

| 路径 | 用途 |
|------|------|
| `jr-wiki/scripts/daily-schedule-healthcheck.ts` | 定时任务健康度（routine 自检用） |
| `jr-wiki/scripts/render-ai-news-posters.mjs` | 渲染当日海报 |
| `jr-wiki/.claude/skills/ai-news-poster.md` | AI 海报 skill 定义 |

---

## 3. curriculum（课程内容池 — 16 个 bootcamp + 海报 prompt 库）

### 3.1 课程仓库（16 个 bootcamp / course）

```
有 outline.json（13 个，可直接消费）：
  ai-adoption-bootcamp / ai-builder / ai-copilot
  ai-engineer-bootcamp / ai-engineer-rag / ai-essentials-bootcamp
  ai-programming / business-analyst / full-stack-developer-interview
  it-career-support / openclaw-workshop / qa
  techscrum-devops / web-code-bootcamp-or-learn-to-code-1

无 outline（视频项目，3 个）：
  video-ai-engineer / video-ai-pm
```

每个 bootcamp 在 `curriculum/{slug}/public/` 下有：
- `outline.json` — 唯一数据源（含 Training/Phase/Lesson 配置）
- `outline.html` / `curriculum.html` / `phase0~N.html` — 学生端页面
- `internal.html` — 内部管理页

### 3.2 海报 Prompt 库（image-prompts，v9 已上线）

| 路径 | 内容 |
|------|------|
| `curriculum/image-prompts/index.json` | v9 主索引（gpt-image-2 模型 + taxonomy 中英 / 角色 / 平台） |
| `curriculum/image-prompts/_shared/gpt-image-2-guide.md` | gpt-image-2 模型规范 |
| `curriculum/image-prompts/{bootcamp}/{xhs,wechat-cover,hero}/{role}.md` | 按 bootcamp × 平台 × 角色细分的 prompt（中英双语） |

已铺：ai-adoption / ai-builder / ai-engineer / ai-essentials / ai-programming / business-analyst / it-career-support / techscrum-devops / web-code-bootcamp（9 个 bootcamp 的图 prompt 库）

**daily-assignments 用法**：
- → `@Summer` / `@Lily` / `@KIKI-CD`：拿对口 bootcamp 的 xhs prompt 直接出图发笔记
- → `@Bella` 视频号：拿 bootcamp `outline.json` 里的爆点做视频脚本
- → `@Beta` 学员社群：当周 bootcamp milestone（开营 / 闭营 / Demo Day）触发社群活动

### 3.3 文档与脚本

- `curriculum/CLAUDE.md` — 给运营 / 非技术的操作指南
- `curriculum/WORKFLOW.md` — 通用工作流
- `curriculum/BOOTCAMP_AUTOMATION_STATUS.md` — 全局状态 + 缺口分析
- `curriculum/OUTLINE_JSON_FORMAT.md` — outline.json 格式规范
- `curriculum/RESOURCES_PM_BA.md` — PM/BA 资源汇总
- `curriculum/scripts/render-mp-posters.mjs` — 公众号海报渲染

**待补充**：每个 bootcamp 当前 cohort 状态 + 下一个 cohort 开营时间（需查 jr-academy backend）

---

## 3.5 skills-data（**最大数据池** — 13 类，~13k+ 文件）

> Skills Data Manager (`tools/skills-data-manager`, localhost:5188) 管理的本地数据池——这是 production 数据的"上游缓存 / 真值"。daily-assignments routine 可以**直接读这里的 JSON**，不需要走 API。

### 3.5.1 数量盘点（按文件数）

| 类别 | 路径 | 文件数 | 用途 |
|------|------|-------:|------|
| **interview-guides** | `skills-data/interview-guides/` | **7357** | 面试指南（按公司细分） |
| **companies** | `skills-data/companies/` | **1470** | 公司信息（含技术栈、薪资、招聘趋势） |
| **certification-quizzes** | `skills-data/certification-quizzes/` | **1253** | 证书题库（AWS/Azure/GCP/CompTIA/Salesforce 等 90+ 证书） |
| **interview-processes** | `skills-data/interview-processes/` | **1128** | 面试流程（按公司） |
| **uni-courses** | `skills-data/uni-courses/` | **677** | 大学课程（按校：adelaide / anu / monash / umelb / unsw / uq） |
| **university-info** | `skills-data/university-info/` | **423**（35 大学） | 大学信息（profile / 学费 / 就业 / academic calendar） |
| **interview-questions** | `skills-data/interview-questions/` | **432** | 面试题（按公司 / 职位） |
| **geeksforgeeks-interview-experiences** | `skills-data/geeksforgeeks-interview-experiences/` | **341** | GeeksForGeeks 面试经验 |
| **videos** | `skills-data/videos/` | **327** | 教学视频元数据 |
| **interviewbit-markdown-all** | `skills-data/interviewbit-markdown-all/` | **294** | InterviewBit 题目 markdown |
| **labs** | `skills-data/labs/` | **132** | 互动实验室（frontend / python / lesson labs） |
| **training-outlines** | `skills-data/training-outlines/` | **109** | **109 个 bootcamp / 课程大纲！** |
| **roadmaps** | `skills-data/roadmaps/` | **43** | 学习路径图 |
| **wikis** | `skills-data/wikis/` | **37** | wiki 元数据 |
| **wikis-content** | `skills-data/wikis-content/` | **25** | wiki 内容 |
| **course-translations** | `skills-data/course-translations/` | **5** | 课程翻译 |
| **intellipaat** | `skills-data/intellipaat/` | **4** | Intellipaat 课程数据 |
| **kanban-tasks** | `skills-data/kanban-tasks/` | **2** | Kanban 任务（用途待查） |

**累计 ~13,200 文件**——每一类都是 daily-assignments 能挖的金矿。

### 3.5.2 重点子集（routine 高频消费）

| 子集 | 备注 |
|------|------|
| **109 个 bootcamp / 课程大纲** | `training-outlines/*.json`，含 ai-engineer / ai-builder / aws / azure / devops / data-analyst / cyber-security / blockchain / ccna / cfa 等 |
| **35 大学 info** | adelaide / anu / auckland / cuhk / deakin / griffith / hku / hkust / monash / mq / ntu-sg / nus / otago / qut / rmit / smu / sunway / taylors / ucsi / ukm / um / umelb / unsw / uow + 更多 |
| **6 大学 courses 数据** | adelaide / anu / monash / umelb / unsw / uq — 每校 100+ 课程 |
| **certification-quizzes 90+ 证书** | aws-saa-c03 / aws-sap-c02 / az-104 / az-204 / az-305 / az-500 / ai-100 / ai-102 / ai-900 / adm-201 / aws-aif-c01 / aws-mla-c01 / 等等 |
| **1470 家公司** | 含技术栈、薪资、招聘趋势、visa sponsorship — 求职号绝佳素材 |
| **132 labs** | frontend / python / lesson 互动实验 |
| **43 roadmaps** | 含 2026ai-learning-roadmap / agent-system-overview / ai-and-data-scientist / android-developer 等 |

### 3.5.3 Skills Data Manager 服务（API + UI）

| 路径 | 用途 |
|------|------|
| `tools/skills-data-manager/server/index.ts` | Hono 后端（localhost:5188） |
| `tools/skills-data-manager/server/bootcamp/` | bootcamp 模块（13 个文件：api / cleanup / create / diff / generate / hydrate-ids / outline / prod-state / production / quiz / sync / types） |
| `tools/skills-data-manager/server/classroom-deck/` | classroom deck 模块 |
| `tools/skills-data-manager/server/{courses,cron-runner,cron-store,duplicates,gaps,migrate,pending,scanner,search,settings,upload-runner}.ts` | 其他模块 |

**API 端点（已知）**：
- `GET /api/health` — 健康检查
- `GET /api/stats` — 统计
- `GET /api/domains` — 列所有数据域
- `GET /api/domains/:id/tree` — 域内文件树
- `GET /api/domains/:id/file/*` — 读文件
- `GET /api/pending` / `GET /api/pending/:domain` — 待处理
- `GET /api/search` — 跨域搜索
- `GET /api/gaps/:domain` — 缺口分析
- `GET /api/upload/:domain/stream` — 上传流（推送 production）
- `POST /api/sync/:domain/refresh` — 从 production 拉数据

**daily-assignments 用法**：
- 不需要走 API，直接读 `skills-data/*/` 下的 JSON 文件
- 但 Phase 2 可以用 `/api/search` 跨域搜索（如"找所有跟 AWS SAA 相关的资料"）

---

## 4. jr-academy backend（销售 / CRM / Bootcamp / 邮件 / 推荐）

> 后端 modules 路径：`jr-academy/src/modules/`

### 4.1 营销 / 销售 / CRM 相关 module

| Module | 用途 | daily-assignments 用法 |
|--------|------|----------------------|
| `customerLead` | 客户线索全周期管理（含 audit / leadSource / services / validation） | → `@Neomi` 周报：上周线索来源分布 |
| `leads` | （另一个 leads 模块，可能是 legacy） | 待确认与 customerLead 关系 |
| `sales` | 销售流程 | → `@Neomi` 周报基础 |
| `mailCampaign` | 邮件营销 campaign 管理 | → `@Ada` 邮件 push 计划 |
| `email` | 邮件发送底层 | 同上 |
| `referral` | 推荐机制 | → `@Beta` 学员转介绍触达 |
| `job-referral-post` | 工作内推帖子 | → `@Summer` 求职号选题（最新内推岗） |
| `coachingSessionOrder` | 1v1 教练课订单 | → `@Beta` 学员升级建议 |
| `order` | 订单 | → `@Neomi` 周报 |
| `leaderboard` | 排行榜（学员） | → `@Beta` 社群活动素材 |

### 4.2 Bootcamp / 课程 / 教务 module

| Module | 用途 | daily-assignments 用法 |
|--------|------|----------------------|
| `training` | Training/Bootcamp 主体 | → `@Beta` 当前 cohort 状态 |
| `program` | Program（课程） | 同上 |
| `pre-course-community` | 课前社区 | → `@Beta` 课前学员触达 |
| `teacher-training` | 讲师培训 | → `@Melody`（HR-only，本 routine 跳过） |
| `uni-course` | 大学课程 | → `@KIKI-CD` 校园号选题 |
| `uni-course-onboarding` | 大学课程 onboarding | 同上 |
| `free-resource` | 免费资源管理 | → `@Lily` 资源类长尾内容 |

> **API 调用方式**：本 routine 不直接调 backend API（避免 token / auth 复杂度）。Phase 1 通过读 `skills-data/*` 文件 + omni-report 报告替代；Phase 2 再考虑加 read-only API access。

---

## 5. jr-academy-web-zh（已上线内容）

| 路径 | 内容 |
|------|------|
| `src/app/[locale]/blog/` | 公开 blog 页面（zh + en） |
| `src/app/blog-sitemap.xml/` | blog sitemap 生成 |
| `src/app/career-coaching-sitemap.xml/` | career-coaching sitemap |
| `src/app/career-impact-map-sitemap.xml/` | career impact map sitemap |
| `src/app/free-resources-sitemap.xml/` | free-resources sitemap |

**daily-assignments 用法**：
- → `@Lily` 公众号长文兜底（已下架的 → `@TBD-content`）：从 blog sitemap 找待补的长尾词
- → `@Ada` 站内 banner / 落地页 调整：基于 ai-visibility 的"补内容建议"

---

## 6. Notion 集成（MCP 已配置）

| Hub Page ID | 用途 | 哪个 routine 写 |
|-------------|------|----------------|
| `34ddd76b576d8068abbed825956db0c6` | 「教育产品 → 竞品周报」hub | competitor-reports |
| `34ddd76b576d80c69e1ac4b65668658b` | 「Marketing周调查热点」hub | marketing-topics / growth-playbook / ai-visibility 共用 |

**写法约定**（来自 PRD_COMPETITOR_WEEKLY §6）：
- Notion MCP 只写**极简摘要页**（≤1k tokens：TL;DR + 关键动态 + 建议 + GitHub 全文链接）
- 全文存仓库 `omni-report/{report-type}/{date}.md`，Notion 不全量同步（避免 stream idle timeout）

**daily-assignments 建议**：
- 复用 `34ddd76b576d80c69e1ac4b65668658b`（marketing 系列 hub）下新建子页 "📅 每日工作分配"
- 写「今日 Top 3 + 各人条数 + 关键 TBD + GitHub 全文链接」

---

## 7. chrome-extension-job-hunter（求职岗位数据源）

**API 端点（Chrome 插件实际在调）**：
- `/account/me` — 用户身份
- `/ai-tutor/alumni/check` — 校友身份核验
- `/ai-tutor/balance` — credit 余额
- `/ai-tutor/job-tracker` — 求职岗位追踪
- `/ai-tutor/linkedin-profile` — LinkedIn 资料解析
- `/ai-tutor/message/stream` — 流式对话

**daily-assignments 用法**：
- 不直接调（auth 复杂）
- 但 Phase 0 数据管道（changelog 04-25）已经把岗位分析存到 MongoDB `SavedJobAnalysis`，前端读 `/jobs/analyzed`
- → `@Summer` Rain姐说求职：拿当周新增 isPublic=true 岗位做笔记选题
- → `@Bella` 视频号：拿 hot 排序 9 张卡片做 30s 视频

---

## 8. .claude/skills 集合（**62 + 20 = 82 个 skill**）

### 8.1 主仓库 skills（jr-academy-ai/.claude/skills/）— 62 个

按用途归类：

**课程 / Bootcamp 创作（11 个）**
bootcamp-curriculum-creator / bootcamp-description-enhancer / bootcamp-learning-material-generator / bootcamp-plan / bootcamp-research / bootcamp-sync / career-bootcamp / curriculum-review / expand-outline / lesson-design / training-outline-optimizer

**学习方向 / 学习内容（5 个）**
learn-direction-creator / learn-content-enhancer / learning-journey / industry-case / classroom-deck-builder

**Lab 创作（4 个）**
aws-lab-enhancer / azure-lab-creator / frontend-lab-enhancer / llm-lab-creator / python-lab-creator / vibe-coding-lab-creator / lab-access-control

**Cert / Quiz（5 个）**
cert-metadata-enhancer / cert-wiki-author / certification-content-enhancer / examtopics-image-extractor / examtopics-scraper / practice-cert-generator

**面试 / 公司情报（5 个）**
company-intelligence-enhancer / interview-content-generator / interview-question-generator / interview-question-import / real-interview-question-scraper

**Roadmap / 内容导入（3 个）**
roadmap-creator / content-importer / platform-resources

**大学相关（5 个）**
uni-checklist-fixer / uni-course-architect / uni-course-data-enhancer / uni-course-data-importer / uni-info-scraper

**SEO / GEO / 站点（3 个）**
eeat-optimizer / seo-optimizer / site-404-checker

**翻译 / i18n（3 个）**
course-translator / en-to-zh-translator / zh-to-en-learn-translator / i18n-migration

**Daily / 求职 / 内容产出（3 个）**
daily-jobs / blog-longform-writer / saiwen-qiaoyi-style / wushi-caijing-style

**S3 / 工具（5 个）**
s3-file-downloader / s3-file-uploader / s3-image-uploader / s3-image-viewer

**其他（5 个）**
ai-content-detector / ai-settings-manager / remotion-best-practices / unit-test / skills-factory

### 8.2 jr-wiki/.claude/skills/ — 20 个

ai-content-detector / ai-content-pipeline / ai-daily-news / ai-news-poster / content-audit / list-content / preview / publish / weekly-book-expand / weekly-holidays / weekly-interview-book / weekly-tool-book / uni-events / uni-news-poster / add-article / add-book / add-chapter / add-help / add-story / edit-chapter

**daily-assignments 用法**：
- 自身**不一定要写成 skill**——它就是个 routine，不是命令式 skill
- 但可以**引用**部分 skill 作为内部"工具调用"（如 `ai-content-detector` 验证产出非 AI 味）
- 内容产出端的 skill（`ai-news-poster` / `weekly-tool-book` 等）是上游，不是下游

---

## 9. 已运行 cron / routine（claude.ai/code/routines）

| Routine ID | 名称 | 频率 | Cron / 时间 | 产出位置 |
|-----------|------|------|------------|---------|
| `trig_013pfieJXDDCa9rQktNxFoKx` | omni-report 竞品周报 | 每周 | 周日 20:00 AEST (Brisbane) | `omni-report/competitor-reports/` |
| `trig_01TEN2PD5Cc5BVYTk7HvGPsU` | daily-jobs ai-engineer-bootcamp | 每日 | 07:30 AEST | `curriculum/ai-engineer-bootcamp/public/jobs/` |
| `trig_014XpCmJ1bx7NZADj4cLxCiU` | daily-jobs ai-essentials-bootcamp | 每日 | 07:35 AEST | `curriculum/ai-essentials-bootcamp/public/jobs/` |
| `trig_011bwd21mFwZ3AmsYrRpYPUA` | daily-jobs ai-engineer-rag | 每日 | 07:40 AEST | `curriculum/ai-engineer-rag/public/jobs/` |
| `trig_01976Vr2oEnbzJftnUuijQuV` | jr-wiki 大学新闻 | 每日 | TBD | `jr-wiki/src/data/uni-news/` |
| `trig_01M5icearZnuv1Sn13xVzfmu` | jr-wiki 大学活动周报 | 每周 | 周日 09:00 AEST | `jr-wiki/src/data/uni-events/` |
| `trig_01PQKR5mwZJTFicbozs8xHNC` | jr-wiki self-healing 健康度 | 每日 | 13:00 AEST | jr-wiki self-heal commit |
| `trig_01RE1vvo4ypgTz1VEH7iUEun` | jr-wiki AI 日报 | 每日 | 12:00 AEST 前 | `jr-wiki/src/data/ai-daily/` |
| `trig_01WfH7keSyiLp31Km3MonNYm` | jr-wiki 巫师财经式 AI 深度文 | 每 3 天 | 10:00 AEST | `jr-wiki/src/content/articles/` |

**daily-assignments routine 启动后将成为第 10 个**（每工作日 10:30 CST）。

> **omni-report 还有 4 个 routine 缺 ID**：marketing-topics / ai-visibility / growth-playbook / seo-healthcheck — 需要去 claude.ai/code/routines 后台查 trig ID 补这里。

---

## 10. survey / SigmaQ（mock test 数据）

**位置**：`/Users/lightman/Documents/sites/jr-academy-ai/survey/`（独立 Express + React + MongoDB，iframe 嵌入 jr-academy）

**daily-assignments 用法**：
- → `@Beta` 学员反馈：survey 出题 / 学员答题数据 → 推断学员痛点
- 当前 Phase 1 不接入（需要 SSO + DB 访问），Phase 3 闭环时考虑

---

## 11. tools/skills-data-manager（数据管道操作台）

**位置**：`tools/skills-data-manager/`（Hono 后端 + Vite 前端，localhost:5188）

**已知文档**：
- `BOOTCAMP_GUIDE.md` — bootcamp 同步指南（踩坑记录）
- `SCHEMA_REFERENCE.md` — Training/Program/Lesson Schema 权威参考
- `BOOTCAMP_PROD_STATE_PRD.md` — 同步状态 PRD

**daily-assignments 用法**：
- 不直接调 — 但当 routine 需要"对比 local vs production 课程数据"时，可以读 `skills-data/*/` 下的 JSON 文件（Skills Data Manager 用同一份）

---

## 12. 关键观察更新

### 12.1 daily-assignments 启动时**素材池其实非常充裕**

不止 omni-report 自身 4 份薄报告：
- jr-wiki AI 日报（每日）+ 5 大学新闻 + 9 天 AI 海报存量 + 39 篇 articles
- skills-data 13 类 ~13,200 文件
- curriculum 16 个 bootcamp + 9 个 bootcamp 海报 prompt 库
- 9 个已运行 routine 持续产出新数据

### 12.2 用 jr-wiki 的产出做 daily-assignments 输入是**最稳定**的

jr-wiki 的 5 个 routine（uni-news / uni-events / ai-daily / wushi-caijing 深度文 / self-healing）每天稳定产出。omni-report 自己的 routine 周节奏，jr-wiki 是日节奏，daily-assignments 跑日 routine 配 jr-wiki 输入更天然。

### 12.3 营销系统**已经在跑大量自动化**

- 9 个 routine 在 claude.ai/code/routines 已上线
- 60+ skill 在主仓库 + 20 个在 jr-wiki
- 13k+ 数据文件已结构化
- → daily-assignments 不是从零开始，而是**「最后一公里」**：把已有产出消化成具体人头 todo

---

## 5. 关键观察

### 5.1 数据源**当前非常薄**

omni-report 自身 1-3 天历史，3 个 routine 还没跑过 → daily-assignments 在 Phase 1 启动时**主要靠 jr-wiki AI 日报和大学新闻支撑**。

### 5.2 jr-wiki 是"最大金矿"

AI 日报（每天 1 份结构化新闻）+ 5 大学新闻 + AI 日报海报 — 这些是 daily-assignments **最稳定可消费**的数据源。

### 5.3 课程产品 / 销售 / CRM 数据需要**通过 jr-academy backend API 拿**

不是直接读文件，要通过 API。意味着 daily-assignments routine 需要 backend access token 或绕过去（如运营手工提供数据）。Phase 1 先不依赖。

### 5.4 各个 routine 的输出**没有统一 schema**

每个 routine 输出 markdown，daily-assignments 必须做 markdown 解析（不是结构化 JSON）。这是 trade-off：写 prompt 简单，但解析容易错。Phase 1 接受用 LLM 做"软解析"（让 Claude 自己读懂报告）；Phase 2 可以让上游 routine 输出 frontmatter 或 JSON sidecar。

---

## 6. 维护

- 每发现新资源 → 追加到对应 §
- 资源失效（如 routine 停跑） → 标 `❌ 停用`
- 文件大小 / 频率有变化 → 更新对应行
