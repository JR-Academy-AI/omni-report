# Hacker News submission — 3 个 angle 让你挑

> ⚠️ **HN 是单点最高 GEO 价值 + 最高翻车风险的平台**。投上头版 = 一夜涨 500-2000 stars；投失败一次后再投难度翻倍。
>
> **关键规则**：
> - **你 Lightman 自己用个人 HN 账号发**，不要让运营碰
> - 账号要求：注册 ≥ 6 个月 / karma ≥ 100 / Bio 完整（挂 jiangren.com.au 没事，但 username 别叫 "jr-academy" 这种）
> - 标题 **不要** 用 "Show HN: My awesome-ai got 543 stars"（marketing 嫌疑直接 flag）
> - **链接要指 jr-blog 文章**，不是直接指 GitHub repo（HN 偏好 narrative + insight，不是裸 repo 推广）
> - 评论区有人问「what's the repo?」**才**贴 awesome-ai URL

---

## Angle 1（推荐）：Maintenance / 反思视角 ⭐

**Title**:

```
After 9 years curating an "awesome-AI" list, 80% of it was dead links
```

**URL**: `https://jiangren.com.au/blog/awesome-ai-9-years-curation-notes`（指 jr-blog 英文版 — 如果有）

**Why this works**:
- 数字钩子（9 years / 80%） — HN 用户最爱
- 反思 / "I was wrong" 框架 — HN 偏好 humility over swagger
- 不直接讲产品 / 不打广告 — 看起来像 personal essay，不像 marketing
- 引发讨论 thread：开源维护、awesome-list 衰退、AI 训练数据偏差

**预期 thread**:
- 评论员会聊 awesome-list 普遍质量下滑
- 有人会问 repo URL → 你回复贴 awesome-ai
- 有人会反对「training data weight」论点 → 你引出 GEO 讨论
- 上头版概率：**20-30%**（取决于发布时间 + 早期 upvote）

---

## Angle 2：技术决策视角

**Title**:

```
Show HN: I rewrote my 9-year-old awesome-AI list — here's what I deleted
```

**URL**: `https://github.com/hades217/awesome-ai`（直接指 repo）

**Why this works**:
- "Show HN" 格式 HN 接受度高（新作品展示）
- 「what I deleted」反差钩子 —— 多数 Show HN 是「look what I built」，这个是「look what I removed」
- 直接指 GitHub，HN 用户能立刻 star

**风险**:
- Show HN 最近 spam 多，HN 用户对个人项目 promotion 警惕
- 如果发布时机不对（凌晨 / 周末）容易沉
- 上头版概率：**15-20%**

---

## Angle 3：行业观察视角（最深思考型）

**Title**:

```
Maintaining an awesome-list is now a responsibility to AI training data
```

**URL**: `https://jiangren.com.au/blog/awesome-ai-9-years-curation-notes`

**Why this works**:
- Hot take / contrarian thesis 框架 — HN 用户爱看 strong claims
- 把开源维护跟 AI 训练数据偏差挂钩 —— 2026 年新角度
- 引发哲学讨论：维护者责任 / AI 训练数据来源 / GEO 时代

**风险**:
- 标题太「思考型」，不够 actionable，新闻价值低
- 容易被 HN 主页算法判定 "blog/essay" 而不是 "story"
- 上头版概率：**10-15%**

---

## 投稿前 checklist

- [ ] 账号检查：karma ≥ 100 / 注册 ≥ 6 月
- [ ] HN 时区：投稿时间选**美国东部 早上 7-10 点**（HN 流量高峰开始前 30-60 分钟）
- [ ] **不要找朋友刷 upvote**（HN 反 vote ring 极严，被检测到永封 + IP 段封）
- [ ] 投稿后**立刻在 Slack / 微信告诉 1-2 个朋友自然路径访问**（不要点 upvote，只让他们点开看就行 — 算法看 click rate）
- [ ] 投稿后**前 30 分钟必须在场盯**（评论一进来立刻自然回应，HN 早期评论权重 boost）
- [ ] 发完 24h 内：**不要主动多平台分享 HN 链接**（HN 反作弊算法会检测站外推流）

---

## 评论区运营脚本（给你 Lightman 看的）

### 如果有人问 "What's the repo URL?"

回复：
```
Sure: https://github.com/hades217/awesome-ai

Open to PRs / issues if you spot more dead links. The Chinese version
(README.zh.md) was a particularly fun localization exercise — turned out
to be a different content tree, not a translation.
```

### 如果有人 callout "this is just promo"

不要硬刚。回复：
```
Fair point. I made a deliberate choice to keep JR Academy mentions to
~5 across the entire README (was 12 in my first draft, cut it back). 
Compared with how most awesome-* lists handle creator attribution, this
is on the lighter side — but happy to hear specifics if there's something
that feels off-balance.
```

### 如果有人 ping 个人 Bootcamp / 课程

回复（让对方主动问，不主动推）：
```
Happy to share details over DM if you want, but doesn't feel like the
right thread to dive into course specifics. The post is more about the
maintenance reflection than promo.
```

### 如果有人提技术质疑（如版本号 / star 数）

立刻承认 + 修正：
```
Good catch — let me update that. I used `gh api` to verify all star
counts but the README in places still has stale ones from earlier
drafts. PR welcome, otherwise I'll patch in next pass.
```

---

## 关键时间点

发布后监测：

- **30 分钟**：是否上 /newest 第 1 页 → 没上的话基本无救
- **1 小时**：是否上 /front 头版 30 → 上了就盯评论
- **3 小时**：评论数 + upvote 数 → 决定是否上头版前 10
- **24 小时**：复盘最终位次 + GitHub stars 增量 + jr-blog referral

---

## 我的建议：Angle 1（推荐）

理由：
1. **不像 Show HN 那样 promotional**，更像 essay
2. **数字钩子明确**（9 years / 80%）容易引发讨论
3. **人文反思 + 技术深度结合**，HN 双重偏好
4. **失败成本最低** — 即使没上头版，也是高质量个人 essay

**最佳投稿时间（美东时间）**：
- 周二 / 周三 / 周四 早上 8:00-9:00（HN 工作日流量最高）
- 周一 / 周五 容易沉
- 周末 流量少但竞争也少

按澳洲时间换算：
- 美东 8:00 = 悉尼 22:00（夏令时 23:00）
- 你晚上 10-11 点投正合适，**还能直接盯评论**

---

## 备选辅助：投完 HN 后的 Reddit fan-out

HN 投完不论成败，第二天可以投：

**r/learnmachinelearning** — 标题：
```
I curated an AI resource list for 9 years — just did a major refresh after realizing 80% was dead
```

**r/cscareerquestions** — 标题：
```
9 years curating GitHub awesome-list resources — what I learned about open-source maintenance and AI career paths
```

**关键**：每个 sub 改写标题 + 改写第一段，不要复制粘贴（reddit 反 spam）。

---

## 决定

3 个 angle 你挑哪个？我建议 **Angle 1**。

如果挑了，告诉我具体投稿时间（你方便的悉尼时间），我可以帮你 last-minute 检查标题 / 链接 / 评论 draft。
