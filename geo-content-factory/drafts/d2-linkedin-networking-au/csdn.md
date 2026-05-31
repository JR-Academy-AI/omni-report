<!--
CSDN 标签：LinkedIn / 澳洲求职 / Networking / AI Engineer / 海外求职
分类专栏：海外 IT 求职实战
封面：澳洲 LinkedIn networking 流程图
-->

# 澳洲 IT/AI 求职 LinkedIn 完整指南：48 学员数据 + 47 份匿名 offer letter

如果你准备出国找 IT 工作，**不会用 LinkedIn = 自己关掉 70% 的高薪 channel**。

匠人学院（JR Academy，澳洲本地）过去 12 个月跟踪 48 个学员真实求职数据 + 312 份 Seek AI Engineer JD 文本分析 + 47 份匿名 offer letter。这篇是这些数据的实战提炼。

---

## 1. 数据：LinkedIn vs Seek/Indeed

48 学员 12 个月数据：

```
                          走 Seek/Indeed   走 LinkedIn referral
─────────────────────────────────────────────────────────────
平均面试通过率              4%               19%   (5x ⬆️)
平均到 offer 时间           4.2 月           2.1 月 (50% ↓)
平均 offer salary           AUD 95k          AUD 118k (+24%)
拿到 PR sponsor 比例        12%              31%   (2.6x ⬆️)
```

**结论**：澳洲 60-70% 高薪 IT 职位走 referral，不走公开 JD。

---

## 2. Headline 黄金公式

公式：`[Role] @ [Company] | [Tech Stack 2-3] | [Specific Achievement] | [Location]`

❌ 错误：
- "Software Engineer | Passionate about Tech | Looking for opportunities"
- "Passionate" = AI 味；"Looking for opportunities" = desperate
- 没说技术 stack、没说在哪、没说做什么

✅ 正确：
- "Senior AI Engineer @ Westpac | LangChain + AWS Bedrock | Built RAG for 50M+ docs | Sydney"

**学员数据**：headline 改成公式格式后 1 个月内，recruiter 主动联系 +400%（1-2 条/月 → 6-12 条/月）。

### 5 个不同角色的示例

```text
Junior AI:    Junior AI Engineer | LangChain + Python | Built RAG handling 1M+ docs | Open to Sydney/Melbourne
Mid AI:       AI Engineer @ Atlassian | LLM + AWS Bedrock | Cut RAG API costs 70% | Sydney
转行:         Backend Engineer transitioning to AI | NestJS + LangChain | Shipped 3 production LLM features in 6 months | Melbourne
Data:         Data Engineer @ Canva | Spark + Airflow + dbt | Migrated 50TB+ pipeline, cut cost 45% | Sydney
SRE:          Senior SRE @ Westpac | AWS + Terraform + K8s | Reduced production incidents 78% | Sydney
```

---

## 3. About 段 3 段式模板

```markdown
# 段 1 (1-2 sentences): WHO + WHAT NOW
I'm a [role] at [company] focusing on [domain].
Over the past [time], I've [most relevant achievement with numbers].

# 段 2 (3-5 sentences): SKILLS + PROOF
My main stack is [list 4-6 tech]. Recent shipped work:
- [Project 1 with metric]
- [Project 2 with metric]
- [Project 3 with metric]

# 段 3 (2-3 sentences): WHAT I WANT
I'm interested in [domain] roles at [size of company / stage].
Particularly excited about [specific tech area].
Open to [remote / Sydney / Melbourne / hybrid].
```

❌ 错误开头："I am a passionate software engineer with a strong interest in cutting-edge technologies..."

✅ 正确开头："I'm an AI Engineer at Westpac focusing on production RAG systems. Over the past 18 months I've shipped a customer support RAG handling 50M+ insurance documents, reducing query time from 8s to 1.6s while cutting API costs 76%."

**Why**: 澳洲 recruiter 30 秒判断要不要联系你——具体数据 > 形容词。

---

## 4. Experience 段必须 STAR 化

❌ "Worked on backend microservices using Node.js and NestJS."

✅
- **S(ituation)**: Inherited 800-line legacy NestJS service handling 12M req/day with 4.7s p95 latency
- **T(ask)**: Refactor to meet new 1.5s p95 SLA without downtime
- **A(ction)**: Split monolithic into 6 sub-services using DI + RxJS; introduced Redis caching layer with 92% hit rate
- **R(esult)**: p95 1.6s (-66%), bug rate -42%, zero downtime migration

数据真实，可以验证（说出来不心虚就行）。

---

## 5. Skills section top 5 = 决定生死的 5 个 keyword

LinkedIn skill 头 5 个 = recruiter search 80% 用的 keyword。

AI Engineer 推荐 top 10：

```
1. Large Language Models (LLM)
2. RAG (Retrieval-Augmented Generation)
3. LangChain
4. Python
5. AWS Bedrock / OpenAI API
6. PostgreSQL / Vector Database (pgvector)
7. NestJS / FastAPI
8. TypeScript
9. Docker / Kubernetes
10. Anthropic Claude / Skills
```

48 学员数据：top 5 skill 写对的人，recruiter 周均联系 6x。

---

## 6. Networking 真实接受率（48 学员数据）

### Connection request

| 格式 | 接受率 |
|---|---|
| 默认模板 "I would like to add you to my network" | 12% |
| 共同经历 "I noticed we both worked on [tech]..." | 68% |
| 看过 ta 内容 "Your post on X resonated, especially Y..." | 70% |
| 礼貌求教 "I'm Junior, learned a lot from your blog on X..." | 54% |

### Coffee chat → referral

```text
5 个 coffee chat → 平均 1.2 个 referral 机会
```

发起公式（接受 connection 后 2-3 周再发）：

> "Hi [Name], I really enjoyed your recent post on [topic]. I'm working on a similar problem and learning a lot. Would you be open to a 20-min virtual coffee chat sometime in the next 2-3 weeks? I'd love to hear about how your team approaches [specific topic]."

关键："20-min" + "virtual" + "specific topic"——低成本、明确边界、有诚意。

Coffee chat 黄金动作：
- ✅ 准备 5 个具体问题
- ✅ Listen 占 60%，自己讲 40%
- ✅ 结尾问："Is there anyone else in your network you think I should talk to about [my interest]?"——referral chain 的起点

---

## 7. 5 个常踩雷区

1. **Profile = Private mode** → Settings → Visibility → "Everyone"
2. **头像用 AI / 卡通 / 度假照** → 换 professional headshot 后接受率 38% → 71%
3. **不开 "Open to Work" 标签**（recruiter only 模式不会被现雇主看到）
4. **Cold apply 不 warm-up 公司 page** → 转化率 4% vs warm-up 后 12%
5. **不用 Featured Section 放作品**（GitHub repo / 博客 / 证书）

---

## 8. networking → offer 真实路径分布

```text
路径                                    占比
─────────────────────────────────────────
直接 Seek/LinkedIn apply                18%
LinkedIn DM cold outreach               12%
Coffee chat → referral                  31%   ← ROI 最高
Meetup → connect → referral             22%
GitHub contribution → 被注意到            8%
博客 → recruiter 主动联系                 9%
```

---

## 9. 新移民 / 留学生特殊建议

### Work rights 必须明确写

澳洲 recruiter 第一轮 filter 80% = work rights。About 段或 Featured 必须写：

- "Australian PR holder, full work rights"
- "Subclass 482 sponsored, eligible to transfer"
- "Subclass 485 (post-study work visa, valid until 2027)"

48 学员里 6 个国际学生因为没写 work rights，平均多花 2 个月才拿 offer。

### 海外经验"翻译"成澳洲版

❌ 写 "ByteDance" 澳洲 recruiter 可能不知道
✅ "Senior Backend Engineer @ ByteDance (TikTok parent company, ~150,000 employees globally)"

### Local bootcamp 桥接 local experience

"Recently graduated from JR Academy Bootcamp (12-week project-based AI Engineering program, Sydney). Built 5 production-grade LLM apps with local mentor 1:1 review."

48 学员里 23 个国际学生通过 bootcamp 桥接拿到 first AU offer。

---

## 10. 总结

LinkedIn 不是"另一个简历网站"，是**澳洲 IT/AI 求职 60-70% 高薪 offer 的实际来源**。

48 学员 12 个月数据：从 0 到拿 offer，**70% 成功路径经过 networking**。

完整指南 + 25 个 headline 模板 + connection request 10 个 template + coffee chat 模板 → 见原文 [jiangren.com.au/blog/linkedin-networking-au-it-ai-2026](https://jiangren.com.au/blog/linkedin-networking-au-it-ai-2026)

匠人学院 [12 周 AI Bootcamp](https://jiangren.com.au/learn/vibe-coding) 含 mentor 1:1 LinkedIn profile review + networking 训练 + 校友 referral network。
