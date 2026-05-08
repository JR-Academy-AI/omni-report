# JR URLs Registry — 维护手册

## 用途

写文章 / 内容 skill 引用 JR 内部链接前**先 grep 这里**，避免编造不存在的 URL（CLAUDE.md "禁止瞎编"硬规则）。

## 文件结构

| 文件 | 作用 | 数据源 |
|---|---|---|
| `INDEX.md` | 核心入口 + hub + 主力课程 + GitHub + 规则（人工维护） | 手动 |
| `static-routes.md` | **290 个 Next.js 静态路由**——sitemap 不收的入口页 / 工具 / 落地页都在 | `jr-academy-web-zh/src/app/[locale]/**/page.tsx` |
| `courses.md` | 42 个 program-course 带 title / 时长 / 等级 / 学费 | `skills-data/training-outlines/*.json` + sitemap 交叉 |
| `roadmaps.md` | 33 个 roadmap 带 title / difficulty / category / tags | `skills-data/roadmaps/*.json` + sitemap |
| `wikis.md` | 34 个 wiki 带 title / categories | `skills-data/wikis/*.json` |
| `certifications.md` | 345 个 cert exam URL | sitemap (`certification-sitemap.xml`) |
| `learn.md` | 16 directions + 477 chapter URL | `skills-data/learn-direction-access/*.json` + sitemap |
| `career-impact-map.md` | 30 个职业 impact map URL | sitemap (`career-impact-map-sitemap.xml`) |
| `long-tail.md` | blog / cheat-sheets / events 等长尾 (每段前 50 sample) | sitemap |

## 决策树（写文章引用 URL）

```
要引用一个 jiangren.com.au URL
    ↓
1. 先 grep INDEX.md（最快，人工精选）
    ↓ 没找到
2. 是入口页 / hub / 工具页？→ grep static-routes.md（290 条 Next.js 路由）
    ↓ 没找到
3. 是课程？→ grep courses.md（带 title / 时长 / 价格 metadata）
   是路线图？→ grep roadmaps.md
   是 cert？→ grep certifications.md
   是 wiki？→ grep wikis.md
   是 learn 章节？→ grep learn.md
   是岗位 impact？→ grep career-impact-map.md
    ↓ 没找到
4. 长尾（blog / events / cheat-sheets）→ grep long-tail.md（前 50 sample）
    ↓ 还没找到
5. 写占位 + <!-- TODO: 验证 URL 后补上 --> 注释。**不准编。**
```

## 跨 catalog 综合查询范例

```bash
# 找所有讲 RAG 的页（跨 6 个 catalog）
grep -li "RAG" omni-report/jr-urls-registry/{courses,roadmaps,wikis,learn,static-routes,career-impact-map}.md \
  | xargs grep -i "RAG"

# 找 ¥1000 以下入门课
grep -E "¥[1-9][0-9]{0,2} " omni-report/jr-urls-registry/courses.md

# 找 12 周以上 bootcamp
grep "12周\|16周\|24周" omni-report/jr-urls-registry/courses.md

# 找 AWS 系列认证
grep "aws-" omni-report/jr-urls-registry/certifications.md
```

## Refresh（重建 registry）

每月或大幅新增内容后跑：

```bash
cd /Users/lightman/Documents/sites/jr-academy-ai/omni-report/jr-urls-registry
bash refresh.sh
```

`refresh.sh` 干的事：
1. curl jiangren.com.au/sitemap.xml 拿 23 个 sub-sitemap 列表
2. 拉 program-course / certification / roadmap / learn 4 个 sub-sitemap
3. 重建 program-course.md / certifications.md / roadmaps.md / learn-chapters.md
4. **不动** INDEX.md（人工维护，里面有规则 + 主力推荐 + GitHub + 待你确认的社交账号）

## Tier 1 (INDEX.md) 何时手动更新

- 加新的学习方向 (/learn/{slug}) — 加进 INDEX.md 16-direction 表
- 加新的旗舰 bootcamp（高频引用）— 加进主力 bootcamp 表
- 新主流认证 上线 — 加进主力 cert 表
- 公司开了新 GitHub org / 社交账号 — 加进对应段
- 旧规则失效 / 新规则补充 — 改"使用规则"段

## 不准编规则（硬底线）

- ❌ 编 URL 路径（如 `/foo/bar` 实际不存在）
- ❌ 编 GitHub repo（`github.com/jiangrenacademy/rag-starter-2026` 这种）
- ❌ 编社交账号 handle
- ✅ 不确定就写占位 + TODO

## 历史

- **2026-05-07**：首次创建 registry。来自 GEO content 写作时发现 sub-agent 自己编 GitHub URL 的问题（`github.com/jiangrenacademy/rag-starter-2026` 等 4 处）。建立 registry 让未来 agent grep 即可，不用 WebFetch / 不会再编。
