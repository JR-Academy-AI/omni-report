# JR Academy AI 搜索可见度周报（GEO Visibility）— PRD

## 1. 背景与目标

### 1.1 为什么要做

2026 年学习者找课程的路径已经在迁移：

- **传统路径（衰退中）**：Google 搜 "AI bootcamp Sydney" → 看 SERP 前 5 个网站
- **AI 路径（新主流）**：直接问 Claude / ChatGPT / Perplexity："我想转行做 AI Engineer，澳洲有什么靠谱 Bootcamp 推荐？" → AI 直接给答案

我们估算（基于 Stripe + 注册问卷）已有 ~50% 的潜在学员第一次接触 JR 不是通过 Google，而是 AI 助手。但 JR 现有 SEO 投入 100% 是面向 Google 的——meta tags、JSON-LD、sitemap、内链结构。**AI 引擎里我们被推荐的概率没人监测、没人优化。**

这是 GEO（Generative Engine Optimization）盲区。

### 1.2 目标

每周三 9:00 Brisbane 自动产出 AI 可见度周报：

- 用 20 个核心真实学员 query 测 AI 引擎是否会主动推荐 JR
- 识别"AI 内容空白"（query 完全没提我们 → 立刻补内容）
- 监测竞品在 AI 答案中的提及频率
- 周环比追踪进度

作为：

- 内容团队的"哪些主题该写深度文 / 该补落地页"决策依据
- SEO 团队从 Google SEO 转向 GEO 的执行清单
- CEO 决策"AI 时代品牌渗透率"的事实数据

### 1.3 非目标

- ❌ 不替代 Google Search Console 周报（不冲突）
- ❌ 不做单一 query 的实时监测（每周快照足够）
- ❌ 不直接改我们的内容/SEO（给清单，决策仍人做）
- ❌ v1 不抓 ChatGPT / Perplexity 真实结果（无 API 公开访问，v2 用第三方工具如 Profound / Goldfish AI）

---

## 2. 20 个核心 Query（v1 名单）

按真实学员问 AI 的 4 类问题分组。**Agent 不要自己改这个名单**，需要用户手动维护（PRD 改了 routine 也要 update）。

### A. 学习入门类（5 个）
1. `"中文 AI 学习平台推荐 2026"`
2. `"新手怎么学 AI 编程"`
3. `"best AI bootcamp for beginners 2026"`
4. `"免费学 AI Engineer 路线"`
5. `"AI 学习路线图 2026"`

### B. 求职导向类（5 个）
6. `"AI Engineer 怎么求职 澳洲"`
7. `"best AI bootcamp Sydney 2026"`
8. `"Australian coding bootcamp 2026"`
9. `"AI 转行 学什么课程"`
10. `"AI bootcamp with job placement"`

### C. 工具/技术类（5 个）
11. `"Cursor vs Claude Code 哪个好 2026"`
12. `"MCP 是什么 怎么学"`
13. `"Vibe Coding 教程 中文"`
14. `"Anthropic Claude Skills tutorial"`
15. `"Prompt Engineering 中文课程"`

### D. 平台/产品类（5 个）
16. `"AI 产品经理课程"`
17. `"AI Builder 怎么入门"`
18. `"AI Agent 实战课程 推荐"`
19. `"Context Engineering 怎么学"`
20. `"ChatGPT Claude 哪个适合学习"`

---

## 3. 怎么测（v1 双管齐下）

**v1 用 Claude Sonnet 4.6 自身 + WebSearch，无需第三方 API。**

每个 query 测两层：

### 层 A：Web Search（模拟用户搜 Google/Bing）
- Agent 用 WebSearch 跑这个 query
- 检查 search results 前 10 条里 JR 出现位置（jiangren.com.au / 任何 JR 子域名）
- 检查竞品出现位置（通往 AGI / 极客时间 / DeepLearning.AI / Coursera / Coder Academy 等）

### 层 B：LLM 自答（模拟用户问 Claude）
- Agent 自己作为 LLM，**假装一个真实学员**问这个 query
- "如果我（Claude Sonnet 4.6）现在回答这个学员，我会推荐哪些平台/课程？"
- 直接把自己的答案 paste 进报告，看自己会不会主动提到 JR
- ⚠️ 这是 Claude 自答，所以是 Anthropic 用户视角的代理；不代表 ChatGPT/Perplexity 行为，但**比完全不测好 10 倍**

### v2 升级路径（季度后）
- 接入 Perplexity API（有公开 API，付费）做交叉验证
- 接入 Profound / Goldfish AI 等 GEO 监测工具看 ChatGPT 真实表现

---

## 4. 输出规范

### 4.1 文件路径
```
ai-visibility/{YYYY-MM-DD}.md
```

### 4.2 Markdown 结构

```markdown
# AI 搜索可见度周报 YYYY-MM-DD

## 总览仪表盘
- JR 在 20 个 query 中被提及次数：N / 20（上周 M / 20）
- Web Search 平均排名：第 X 位（前 10 内）
- LLM 自答提及率：N% （上周 M%）
- **空白 query 数**（完全没提到我们）：K 个 ⚠️

## 1. JR 已被提及的 Query（亮点）
| Query | Web Search 排名 | LLM 自答是否提及 | 提及上下文 |
|---|---|---|---|

## 2. JR 完全空白的 Query（重点修复）
| Query | Top 3 被推荐的平台 | 我们没被提的可能原因 | 建议行动 |
|---|---|---|---|
| "AI 学习路线图 2026" | 通往 AGI / 极客时间 / DeepLearning.AI | 没有对应着陆页 | 写一篇 5000 字深度文 + 加 schema markup |

## 3. 竞品提及频率排行
| 竞品 | 被提次数 / 20 | 周环比 |
|---|---|---|
| 通往 AGI 之路 | 12 / 20 | +2 |
| 极客时间 | 9 / 20 | -1 |
| ...

## 4. 本周关键洞察（3 条以内）
1. **机会**：query "X" 我们 Web SEO 排第 8，LLM 也提到我们但表述模糊 → 优化 meta description + 写 hero 文案
2. **危险**：query "Y" 上周提及，本周消失 → 立即查页面是不是出问题
3. **空白**：3 个高价值 query 完全空白 → 优先补 1 个

## 5. 推荐行动清单（5 条以内，按 ROI 排）
| # | 行动 | 解决哪个 query | 预估工作量 | 预估 ROI |
|---|---|---|---|---|

## 附录：20 个 Query 完整测试结果
（每个 query 的 Web Search top 5 + LLM 自答全文）
```

### 4.3 反 AI 味格式
- 禁止 "在当今...""综合性""值得关注" 等空话
- 每条数据必须具体（"被提 12 / 20" 而不是 "频繁被提及"）
- 行动清单必须可执行（"写一篇 5000 字深度文" 而不是 "加强内容建设"）

---

## 5. 技术方案

### 5.1 配置

| 项 | 值 |
|---|---|
| Routine name | `JR AI Visibility Weekly` |
| Cron | `0 23 * * 2` UTC = **周三 9am Brisbane** |
| Repo | `https://github.com/JR-Academy-AI/omni-report` |
| Model | `claude-sonnet-4-6` |
| Tools | Bash / Read / Write / Edit / WebSearch |
| MCP | Notion（hub page TBD） |

### 5.2 Phase 设计（防 stream idle timeout）

20 个 query × 2 层测试 = 40 个数据点，比竞品周报还重。必须分批：

- **Phase 0**：读 PRD + 历史报告
- **Phase 1**：写空骨架 + commit
- **Phase 2**：4 batch（A/B/C/D 各 5 个 query）
  - 每 batch：Web search 5 个 query + 自答 5 个 query → Edit 报告对应 section → commit
- **Phase 3**：写总览 dashboard + 关键洞察 + 行动清单 → commit
- **Phase 4**：Notion 全文同步（一步法，参考竞品周报 Phase 4）

每 Phase 完成立即 commit + push。

---

## 6. 验收标准

第一份必须满足：

- [ ] 路径正确：`ai-visibility/YYYY-MM-DD.md`
- [ ] 20 个 query 全跑（每个有 Web Search + LLM 自答两层数据）
- [ ] 总览仪表盘有 4 个核心数字
- [ ] 至少 3 条具体洞察（带 query 名 + 行动）
- [ ] 至少 5 条行动清单（带 ROI 估算）
- [ ] 0 条 AI 味开场
- [ ] git push + Notion 全文双轨

---

## 7. Roadmap

| 版本 | 范围 | 时间 |
|---|---|---|
| **v1（本期）** | 20 query × 2 层 (Web Search + Claude 自答) | 现在做 |
| **v2** | 接 Perplexity API 做第三方交叉验证 | 跑 4-8 周后 |
| **v3** | 加入 ChatGPT / Gemini 真实抓取（用 Profound / Goldfish AI 等 GEO 工具） | 2026-Q3 |
| **v4** | 月度趋势分析 + 给 CEO 看的 GEO 战略仪表盘 | 2026-Q4 |

---

## 8. 与其他 routine 关系

```
                                                    (周三 9am)
        SEO Healthcheck（每日）  ──────┐               │
                                       ↓               ↓
       竞品周报（周日 8pm）  ──→  AI 可见度周报  ──→  内容/SEO 团队
                                       ↑
       内容选题包（周一 8am） ────────┘
```

**核心复用**：AI 可见度报告会**引用竞品周报里的竞品名单**判断"竞品被提及频率"。

---

## 附录 A：相关文档

- `PRD_COMPETITOR_WEEKLY.md` — 竞品周报 PRD（数据上游）
- `PRD_MARKETING_TOPICS.md` — 内容选题包 PRD（行动下游）
- `https://claude.ai/code/routines` — Routine 控制台
