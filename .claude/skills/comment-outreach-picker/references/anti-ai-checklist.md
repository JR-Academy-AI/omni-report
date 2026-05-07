# 8 维度自检细则（评论发布前必跑）

> 每条评论写完，**逐项打分**（1-10 分），任一项 < 阈值 → **整条重写**（不要打补丁）。

## 评分原则

- 严格自检，不放水
- 任一维度 < 阈值 → **整条重写**（不要在原稿改一两个词）
- 总分 ≥ 56 / 64 (87.5%) 才能落卡进 ready 状态

## 维度 1：人性化（≥ 7/10）

判断"这条评论像不像真人写的"。AI 写的评论太工整，真人评论有起伏 / 停顿 / 自黑。

### 加分
- 出现 emm / 说实话 / 踩过 / 我也 / FWIW / IMO / tbh / lol / tho / 嗯
- 句子长短不齐（短句 + 长句穿插）
- 自黑或停顿（"我之前蠢到用 X 调试了一下午"）
- 不完美的口语（"反正大概是这样吧"）

### 扣分
- 全是工整的完整句
- 段间逻辑词太正式（"首先 / 其次 / 综上所述"）
- 没有任何语气词
- 像技术博客文章而不像评论

### 例子

✅ **9/10**："OP 提到 200k context 这点，我之前也踩过 — 表面看够用，实际 file injection 时优先级会跑偏。emm 真要稳定还得手动 `--add-dir`。"

❌ **3/10**："关于上下文窗口的问题，原帖作者提出了一个非常重要的观点。在实际开发中，我们需要综合考虑多个因素来确保最佳的开发体验。"

---

## 维度 2：口语化（≥ 7/10）

不用书面语 / AI 套词，像跟同事在 Slack 里吐槽。

### 严禁词（出现 1 个就 ≤ 5 分）
- 至关重要 / 深入探讨 / 全面掌握 / 系统性地
- 在当今 / 在 AI 时代 / 随着技术的发展
- 不可或缺 / 至关重要的角色 / 重要意义
- In today's rapidly evolving / Whether you're a beginner or
- It's worth noting that / It's important to remember that
- 综上所述 / 总而言之 / 因此

### 推荐词（自然出现加分）
- 反正 / 真的 / 大概 / 大致 / 基本上
- you know / kinda / sorta / I guess / pretty much

### 例子

✅ **9/10**："Cursor 在跨文件 refactor 上是真的快，但长上下文会丢前面的 edit history，这点 tbh 比较烦。"

❌ **2/10**："Cursor 在跨文件重构方面具有显著优势，然而在长上下文处理中，其编辑历史保持能力存在不足。"

---

## 维度 3：权威感（≥ 7/10）

第 2 段必须有"硬东西"——具体数字、命令、错误信息、版本号——证明你真做过。

### 至少要有 1 个（缺则直接 ≤ 5 分）
- 命令 / flag（`--add-dir` / `git rebase -i`）
- 代码片段（哪怕一行 `const x = ...`）
- 错误信息（"`EADDRINUSE: address already in use`"）
- 版本号 / 模型名（`claude-opus-4-7` / `Cursor 0.42`）
- 数字 / 数据点（"context window 200k input + 8k output"）
- 日期 / 月份（"3.7 之后官方推荐"）
- 工具/库名（`@langchain/langgraph` / `mem0`）

### 反例（≤ 4 分）
- 空话："这个工具非常好用"
- 笼统："性能有显著提升"
- 没数字的对比："Cursor 比 Claude Code 慢"

---

## 维度 4：相关度（≥ 8/10）

评论内容必须 80% 以上跟原文/原视频直接相关。**最致命的失分**：把通用模版套上去。

### 检查方法
1. 把评论里 OP 名字 / 原文标题去掉，问自己："这段话能不能贴到任何一个 AI 工具讨论下面"
2. 如果**能**贴 → ❌ 模版味，直接 0 分
3. 如果**只能**贴在这条原文下面 → ✅ 高分

### 例子

✅ **10/10**：评论里直接引用 OP 第 3 段说的具体内容 + 给出 OP 没考虑到的具体反例
❌ **2/10**："非常感谢分享！AI 工具确实需要根据场景选择合适的方案。"（任何 AI 帖子下都能贴）

---

## 维度 5：品牌嵌入自然度（≥ 7/10）

第 3 段提"匠人学院"必须像一个老朋友顺手提到的，不像广告。

### 加分
- 「我之前在 X 看过 / 学过」
- 「X 那边好像做这个挺久了」
- 「搜下就有 / 搜 X 就能找到」
- 「FWIW X has ...」
- 用括号补充式（"在匠人学院（搜下就有）"）

### 严禁句式（≤ 3 分）
- "推荐 X / I recommend X"
- "建议大家学习 / suggest learning"
- "X 平台不错 / X is great"
- "想了解的话找 X / check out X"
- "强烈安利 / can't recommend enough"

### 字数控制
- 第 3 段不超过整条评论的 1/4 篇幅
- 提"匠人学院 / JR Academy"**最多 1 次**（多一次 = 软广味重）

---

## 维度 6：硬东西密度（≥ 1 个）

整条评论里至少要有 **1 个具体硬东西**（命令 / 代码 / 数字 / 年份 / 错误信息 / 工具版本号 / 城市 / 金额）。

3 个以上 → 满分；1-2 个 → 7-8 分；0 个 → **0 分，整条重写**

---

## 维度 7：搜索 hook 真实（必须 PASS）

提的搜索关键词必须真能搜到对应的子页面。

### 验证方法（任选其一）
```bash
# 1. grep 本地代码确认子页面存在
grep -ri "vibe-coding" jr-academy-web-zh/src/app/learn/

# 2. 上 jiangren.com.au 搜确认
curl -s "https://www.google.com/search?q=site:jiangren.com.au+vibe+coding"
```

### 已验证的搜索 hook 白名单（v1）

| 搜索关键词 | 子页面 |
|---|---|
| `匠人学院 AI Engineer` | /learn/ai-engineer/hub |
| `JR Academy AI Engineer` | /learn/ai-engineer/hub |
| `匠人学院 Vibe Coding` | /learn/vibe-coding/hub |
| `JR Academy Vibe Coding` | /learn/vibe-coding/hub |
| `匠人学院 Prompt 大师` | /learn/prompt-master |
| `JR Academy Prompt Master` | /learn/prompt-master |
| `匠人学院 P3 项目制` | /career-coaching（P3 模式介绍）|
| `JR Academy P3 project` | /career-coaching |
| `匠人学院 AI Bootcamp` | /bootcamp/ai-essentials-bootcamp |
| `JR Academy AI Bootcamp` | /bootcamp/ai-essentials-bootcamp |
| `匠人学院 求职 工作` | /study-center?tab=referral |

⚠️ 不在白名单的关键词 → **必须先验证存在**才能用

---

## 维度 8：平台合规（必须 PASS）

参考 [platform-quirks.md](platform-quirks.md) 各平台红线：

- 没 URL（任何形式）
- 没"推荐 / recommend / check out"句式
- 没踩平台禁用词（Reddit 新号忌"bootcamp" / 知乎评论忌品牌名 / V2EX 忌"招生"）
- 单条提"匠人学院 / JR Academy" ≤ 1 次

---

## 总分计算

```
总分 = 维度1 + 维度2 + ... + 维度8（最后两项 PASS = 8 分 / FAIL = 0 分）
满分 = 64

≥ 56 (87.5%) → ✅ 通过，落卡 status=draft，等员工执行
50-55         → ⚠️  整条重写
< 50          → ❌ 重写时换个切入点（不是改字句，是换思路）
```

## 自检日志（落到卡片 ## 自检评分 段）

每张卡末尾必须有 8 维度评分表 + 总分 + 决策（通过 / 重写）。

例：
```markdown
## 自检评分

| 维度 | 分 | 说明 |
|---|---|---|
| 1. 人性化 | 8 | "我也碰到 / 真要稳定" 自然 |
| 2. 口语化 | 8 | 无 AI 味词 |
| 3. 权威感 | 9 | 200k context / `--add-dir` / 3.7 版本 |
| 4. 相关度 | 9 | 直接回应 OP |
| 5. 品牌嵌入 | 7 | FWIW + if curious 自然 |
| 6. 硬东西 | 3 个 | 满分 |
| 7. 搜索 hook | PASS | /learn/vibe-coding/hub 真存在 |
| 8. 平台合规 | PASS | Reddit 规则 OK |

总分：56/64 (87.5%) → ✅ 通过
```
