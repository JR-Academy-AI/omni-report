# JR Academy URLs Registry — INDEX (Tier 1)

> **目的**：写文章 / 内容引用 JR 内部链接前**先 grep 这里**，避免幻觉编造不存在的 URL。
> **范围**：高频引用的核心入口 + hub 页 + 主力课程。**长尾页面**（73 个 program-course / 345 个 certification / 63 个 roadmap / 上千 blog）拆到旁边的 category 文件按需 grep，不在本 INDEX 里。
> **数据源**：`https://jiangren.com.au/sitemap.xml` 23 个 sub-sitemap，最近一次刷新见 README。
> **铁律**：本文件没有的 URL 一律不准引用。需要 long-tail 见 `program-course.md` / `certifications.md` / `roadmaps.md` 等。还查不到 → 用占位 + `<!-- TODO -->` 注释，**不准编**。

---

## 域名 + 路由规则

- **中文站**: `https://jiangren.com.au` (默认，无前缀)
- **英文站**: `https://jiangren.com.au/en/...` (所有 path 加 `/en` 前缀)
- 不要写 `www.jiangren.com.au`（虽然能访问，但官方不带 www）
- 不要写 `http://`，永远 https

## GitHub Organizations（已确认）

- `https://github.com/JR-Academy-AI` — 公司主 GitHub org（CLAUDE.md 提及，hosts pbl-service 等）
- ⚠️ 不准引用 `github.com/jiangrenacademy / jiangren-academy / jr-academy` — 这些都不是公司自己的（前两个 404，第三个归属未确认）

## 主入口 / 顶级 hub 页

- `/learn` — 学习入口
- `/certifications` — 认证考试入口
- `/program-course` — 课程入口
- `/roadmaps` — 学习路线图入口
- `/free-resources` — 免费资源入口
- `/cheat-sheets` — 速查卡入口
- `/blog` — 博客入口
- `/wiki` — Wiki 入口
- `/job-interview` — 面经
- `/jobs` — 岗位（部分子页 robots disallow，引用前看 robots.txt）
- `/instructors` — 讲师
- `/mentors` — 导师
- `/handbook` — 手册
- `/events` — 活动

## /learn — 16 个学习方向 hub（核心，写文章最常引）

| Slug | URL | 主题 |
|---|---|---|
| ai-builder | `/learn/ai-builder` | AI 应用构建（Bolt/Lovable/v0/Cursor/Claude Code） |
| ai-content | `/learn/ai-content` | AI 内容创作（文案/图片/视频/多模态） |
| ai-data-analysis | `/learn/ai-data-analysis` | AI 数据分析 |
| ai-engineer | `/learn/ai-engineer` | AI Engineer 完整路线 |
| ai-finance | `/learn/ai-finance` | AI + 金融 |
| ai-image | `/learn/ai-image` | AI 图像生成（Midjourney / SD） |
| ai-office | `/learn/ai-office` | AI + 办公 |
| ai-pm | `/learn/ai-pm` | AI 产品经理 |
| context-engineering | `/learn/context-engineering` | Context Engineering（Karpathy 命名） |
| frontend | `/learn/frontend` | 前端工程 |
| git-lab | `/learn/git-lab` | Git 实践 |
| hermes-agent | `/learn/hermes-agent` | Hermes Agent |
| openclaw | `/learn/openclaw` | OpenClaw |
| prompt-master | `/learn/prompt-master` | Prompt Engineering |
| python | `/learn/python` | Python |
| vibe-coding | `/learn/vibe-coding` | Vibe Coding（Cursor / Claude Code 工作流） |

> 每个 direction 下还有 chapter 子页（如 `/learn/ai-builder/vc-claude-code-skills`），完整 chapter list 见 `learn-chapters.md`。

## /tools — 4 个工具

- `/tools/enrollment-checklist` — 大学选课 checklist
- `/tools/job-hunter` — 求职匠 Job Hunter
- `/tools/prompt-templates` — Prompt 模板库
- `/tools/uni-course` — 大学课程数据库

## /program-course — 主力 bootcamp（高频引用，~10 个）

| Slug | URL | 说明 |
|---|---|---|
| ai-engineer | `/program-course/ai-engineer` | AI Engineer Bootcamp 主入口 |
| ai-engineer-bootcamp | `/program-course/ai-engineer-bootcamp` | AI Engineer Bootcamp 详情页 |
| ai-engineer-rag | `/program-course/ai-engineer-rag` | AI Engineer / RAG 模块 |
| ai-engineer-rag-agent | `/program-course/ai-engineer-rag-agent` | AI Engineer / RAG + Agent 模块 |
| ai-essentials-bootcamp | `/program-course/ai-essentials-bootcamp` | AI Essentials Bootcamp |
| ai-adoption-bootcamp | `/program-course/ai-adoption-bootcamp` | AI Adoption Bootcamp |
| ai-builder | `/program-course/ai-builder` | AI Builder Bootcamp |
| ai-agent | `/program-course/ai-agent` | AI Agent 课程 |
| ai-no-code | `/program-course/ai-no-code` | AI No-Code |
| algorithm-bootcamp | `/program-course/algorithm-bootcamp` | 算法 Bootcamp |

> 完整 73 个 program-course slug 见 `program-course.md`（按需 grep）。

## /certifications — 主流认证（高频引用，~10 个）

| Slug | URL | 备注 |
|---|---|---|
| aws-clf-c02 | `/certifications/exam/aws-clf-c02` | AWS Cloud Practitioner |
| aws-saa-c03 | `/certifications/exam/aws-saa-c03` | AWS Solutions Architect Associate |
| aws-aif-c01 | `/certifications/exam/aws-aif-c01` | AWS AI Practitioner |
| aws-mla-c01 | `/certifications/exam/aws-mla-c01` | AWS ML Engineer Associate |
| az-900 | `/certifications/exam/az-900` | Azure Fundamentals |
| az-104 | `/certifications/exam/az-104` | Azure Administrator |
| ai-900 | `/certifications/exam/ai-900` | Azure AI Fundamentals |
| ai-102 | `/certifications/exam/ai-102` | Azure AI Engineer |
| comptia-security-plus | `/certifications/exam/comptia-security-plus` | CompTIA Security+ |
| cisco-ccna | `/certifications/exam/cisco-ccna` | Cisco CCNA |

> 完整 345 个 cert slug 见 `certifications.md`（按需 grep）。
> ⚠️ Cert 公开 wiki 页是 `/certifications/{slug}` 不带 `/exam`；付费产品页才是 `/certifications/exam/{slug}`。

## /roadmaps — 主力 roadmap（高频引用，~5 个）

| Slug | URL |
|---|---|
| 2026ai-learning-roadmap | `/roadmaps/2026ai-learning-roadmap` |
| ai-engineering | `/roadmaps/ai-engineering` |
| ai-coding | `/roadmaps/ai-coding` |
| backend-developer-roadmap | `/roadmaps/backend-developer-roadmap` |
| aws-roadmap | `/roadmaps/aws-roadmap` |

> 完整 63 个 roadmap slug 见 `roadmaps.md`（按需 grep）。

## 社交 + 外部（待你确认补全）

<!-- TODO(lightman): 确认 + 补全公司公开社交账号 URL —— 不准编 -->
- LinkedIn 个人主页（Lightman）：?
- LinkedIn 公司页：?
- 公众号：匠人学院
- 小红书账号矩阵 11 个：?
- B 站：?
- YouTube：?

## robots.txt 禁止区（生成内容时不要引用，避免推荐已 disallow 的 URL）

- `/account` `/admin` `/ai-chat` `/apply` `/checkin` `/coachingSessions` `/event-orders`
- `/job-interview/create|manage|preview` `/lottery` `/mailCampaigns/unsubscribe`
- `/membership/success` `/my-roadmaps` `/notifications` `/oauth/authorize` `/onboarding`
- `/orders` `/roadmap-editor` `/showcase/submit` `/study` `/user/` `/zoom`
- `/business/` `/vendor-portal/` `/cart` `/payment` `/ai-jobs` `/ai-jobs/*`

## 使用规则（写 skill 必读）

1. **写文章前先 grep 本 INDEX**：`grep "你想引用的 keyword" omni-report/jr-urls-registry/INDEX.md`
2. **找不到** → 看是否需要 long-tail：`grep "..." omni-report/jr-urls-registry/program-course.md`（按 category 文件依次找）
3. **还找不到** → 用占位 + `<!-- TODO: 验证 URL 后补上 -->` 注释，**不准编**
4. **GitHub URL** → 只用 `github.com/JR-Academy-AI`，其他形式（jiangrenacademy / jr-academy / jiangren-academy）一律拒绝
5. **更新规则** → 网站新增页面后跑 `omni-report/jr-urls-registry/refresh.sh`（见 README.md）重建本 registry，不要手动编辑长尾文件

## 维护

- **最近刷新**：2026-05-07
- **数据源**：jiangren.com.au/sitemap.xml + 23 sub-sitemaps
- **下次刷新建议**：每月 1 次或新增大范围内容后
- 详情见 `README.md`
