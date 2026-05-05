# 小红书内容工厂（xhs-content-factory）

> AI 驱动的小红书内容生产工作区。从选题到打分跑完整 pipeline，最后自动生成 marketing-tasks 任务卡给员工手动发布。

## 路径红线 — 绝不放 curriculum/

```
✅ 正确:  ~/Documents/sites/jr-academy-ai/omni-report/xhs-content-factory/...
❌ 错误:  ~/Documents/sites/jr-academy-ai/curriculum/xhs-content/...
❌ 错误:  ~/Documents/sites/jr-academy-ai/xhs-content/...      (已弃)
```

`curriculum/` 是 Bootcamp 课程 source of truth（独立 submodule + 独立部署），绝不能混入小红书运营产出。已为此被骂过 + 修复一次（main repo `5aafd408`）。

## 目录结构

```
omni-report/xhs-content-factory/
├── README.md                            # 本文件
├── topics/                              # xhs-topic-picker 输出
│   └── {YYYY-MM-DD}.json                # 9 个候选 / 当日选题池
├── drafts/                              # 内容生产工作区
│   └── {YYYY-MM-DD}/                    # 按日期归档
│       └── {topic-id-padded}-{account-slug}/   # 1 任务 = 1 目录
│           ├── manifest.json            # 元信息（topic_id / account / status / score）
│           ├── 01-topic.json            # 从 topics/ 复制过来的候选条目
│           ├── 02-draft.md              # xhs-draft 3 切角初稿
│           ├── 03-final.md              # 员工选定切角 + 微调后的终稿
│           ├── 04-review.md             # xhs-review 违禁词 + AI 率审
│           ├── 05-score.md              # xhs-score 9 维度打分
│           └── posters/
│               ├── prompts.md           # xhs-poster 出的 GPT-Image-2 prompts（手动模式）
│               ├── cover-A.png ... C.png        # 封面 3 版 A/B 测
│               ├── content-01-*.png ... 04      # 内容图（数据/截图/对比/CTA）
│               └── cost-log.json        # auto 模式才写（成本累计）
└── published/                           # 真实发布数据归档
    └── {YYYY-MM-DD}/
        └── {topic-id-padded}-{account-slug}.json
```

## 完整工作流

```
1. xhs-topic-picker   → topics/{date}.json (9 候选)
2. 员工选 1 条 + 1 账号 → mkdir drafts/{date}/{topic-id}-{account}/ + 复制 01-topic.json
3. xhs-draft          → 02-draft.md (3 切角)
4. 员工选切角 + 调   → 03-final.md
5. xhs-review        → 04-review.md (违禁词扫 + AI 率改)
6. xhs-poster        → posters/prompts.md (默认手动；--auto 直出 PNG)
7. xhs-score         → 05-score.md (9 维度打分)
8. ⭐ 自动生成 marketing-tasks/active/xhs-{date}-{topic-slug}-{account-slug}.md
   (无论分数高低都生成；员工根据分数自己决定要不要发)
9. 员工手动发布 → 回填 published/{date}/{topic-id}-{account}.json + 更新任务卡 ## 发布记录
```

## 11 账号 slug 对照表

| 账号 | slug | 归属 |
|---|---|---|
| 澳洲匠人学院 | `aozhoujiangren` | Summer |
| Rain姐说求职 | `rain-jie` | Summer |
| 澳洲实习猿 | `aozhou-shixiyuan` | Summer |
| Kiki的分享日记 | `kiki-fenxiang` | Summer |
| Amelia在悉尼 | `amelia` | Lily |
| momo在澳洲 | `momo` | Lily |
| JR 匠人学院 | `jr-brand` | Lily |
| UQ 课代表 | `uq-kedaibiao` | KIKI |
| UNSW 课代表 | `unsw-kedaibiao` | KIKI |
| 墨大课代表 | `mudai-kedaibiao` | KIKI |
| 素人号 | `suren` | KIKI |

## topic-id 命名规则

`topics/{date}.json` 里 candidates[0..8] 对应 ID `001` 到 `009`（3 位补零）。
工作目录命名：`{topic-id}-{account-slug}`，如 `001-uq-kedaibiao` / `003-amelia`。

同一 topic 派给多账号 = 多个目录（`001-rain-jie` + `001-amelia` 各做差异化切角）。

## topic-slug 生成规则（marketing-tasks 文件名用）

`xhs-{date}-{topic-slug}-{account-slug}.md` 文件名里的 `topic-slug` 必须按下面 3 态规则生成（不准让模型瞎猜）：

| `01-topic.json.title` 类型 | 规则 | 例子 |
|---|---|---|
| **全英文** | 抽 3-5 个核心词，全小写 + 连字符；停用词（the/a/and/of/in）一律删；数字保留 | `Best AI Bootcamp Sydney 2026` → `best-ai-bootcamp-sydney-2026` |
| **全中文** | 数字保留；专有名词（UQ/UNSW/AI 等）保留小写英文形式；其余中文取**单字汉语拼音首字母**串起来；总长 ≤ 25 chars | `UQ Sem 1 期末 30 天倒计时` → `uq-sem1-30tian-daojishi`<br>`AI 求职我犯过 5 个错` → `ai-qiuzhi-5-cuo` |
| **中英混** | 英文部分按全英规则保留；中文部分按全中规则转拼音；中英之间用连字符分隔 | `投 50 家拿 3 个面试 我做对了 5 件事` → `tou-50-jia-3-mianshi-5-shi`<br>`Cover letter 怎么写第一段` → `cover-letter-zenme-xie-1-duan` |

**通用约束**：
- 总长 ≤ 30 chars（含连字符）
- 不出 emoji / 标点 / 全角字符
- 不出"私信 / 加微信 / 副业"等敏感词（即使 title 里有也要在 slug 里去掉）
- 重名冲突时尾部追加 `-v2` / `-v3`

**生成时机**：xhs-score skill 跑完后写 marketing-tasks 任务卡时生成（不在 manifest.json 里固化，因为 title 改了 slug 也要改）。但同一篇文章重跑要保持 slug 稳定 — 重跑时优先读已存在的 marketing-tasks 卡看用过哪个 slug，没有再生成。

## manifest.json 字段约定

每个 `drafts/{date}/{topic-id}-{account-slug}/` 目录必须有 `manifest.json`，schema：

```json
{
  "topic_id": "001",                    // 必填，3 位补零
  "topic_slug": "ai-qiuzhi-5-cuo",      // 必填，按上面规则生成（生成 marketing-tasks 卡前可空）
  "account": "Rain姐说求职",            // 必填，账号中文名（routing-table 查 assignee 用这个）
  "account_slug": "rain-jie",           // 必填，11 账号 slug 对照表里的英文 slug
  "owner": "Summer",                    // 必填，归属 manager 名
  "owner_email": "summer@jiangren.com.au", // 必填，从 routing-table.json redbookAccountRouting 查
  "date": "2026-05-05",                 // 必填，工作日期（即父目录日期）

  "selected_angle": "C-干货版",          // 02-draft 跑完后填（A-痛点版 / B-故事版 / C-干货版）
  "selected_cover": null,               // posters 出图后员工选 A/B/C 中一个填这里

  "status": "draft|reviewed|scored|published|archived",  // 必填，反映当前 pipeline 阶段

  "pipeline": {                         // 各步时间戳（ISO 8601 with TZ），跑过哪步填哪步
    "topic_at": "2026-05-05T10:00:00+10:00",
    "draft_at": null,
    "final_at": null,
    "review_at": null,
    "poster_at": null,
    "score_at": null,
    "task_card_at": null
  },

  "files": {                            // 必填，5 件套相对路径（未生成的填 null）
    "topic": "01-topic.json",
    "draft": "02-draft.md",
    "final": "03-final.md",
    "review": "04-review.md",
    "score": "05-score.md",
    "poster_prompts": "posters/prompts.md"
  },

  "marketing_task_card": null,          // xhs-score 跑完后填生成的任务卡相对路径
  "score_total": null                   // xhs-score 跑完后填总分 0-100
}
```

**status 状态机**：

```
draft     ←  xhs-draft 跑完
reviewed  ←  xhs-review 跑完
scored    ←  xhs-score 跑完 + marketing-tasks 卡生成
published ←  员工填了 published/{date}/{topic-id}-{account}.json
archived  ←  发布 7 天后归档（手工或定时 routine）
```

## marketing-tasks 任务卡接口

xhs-score 跑完后，必须自动生成 `omni-report/marketing-tasks/active/xhs-{date}-{topic-slug}-{account-slug}.md`：

- frontmatter 字段同 GEO fan-out 规范（id/title/category=social-redbook/module=redbook-daily/assignee/reviewer/status/priority/platforms/dueDate/tags/sourceMeta）
- `status: ready-to-publish`（无论分数；让员工看分自决）
- `## 描述` 列：选定切角 / 核心红线 / 配图清单
- `## Checklist`：法务自查 / 出图 / 评论区埋点 / 发布 / 数据回填
- `## 草稿` 直接塞 `03-final.md` 全文（员工 copy-paste 用）
- `## 配图` 列出 posters/ 下的图片路径
- `## 评分` 嵌入 05-score.md 总分 + 各维度分（让员工知道这条质量）
- `## 发布记录` 留空待回填

## 工作流红线

- 落盘前先 `Bash ls` 确认父目录存在；不存在就 `mkdir -p`
- 不准把任何小红书产出落进 `curriculum/`（独立 submodule，会污染）
- 同一 topic 多账号要分开目录，不要在一个目录里塞多账号文件
- `published/` 只回填真实发过的，没发的留空 — 用于复盘 predicted_tier 准确度
