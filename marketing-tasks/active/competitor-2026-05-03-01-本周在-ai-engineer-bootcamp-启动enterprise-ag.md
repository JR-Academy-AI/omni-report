---
id: 000000000000000000000000
title: "本周在 AI Engineer Bootcamp 启动\"Enterprise Agent Governance\"章节"
category: competitor-action
module: ad-hoc-task
source: routine-competitor
sourceMeta:
  reportPath: competitor-reports/2026-05-03.md
  reportSection: 对 JR Academy 的建议 #1
  reportItemHash: 93728ab0a563
assignee: 2838684082@qq.com
reviewer: null
status: draft
priority: p0
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

**本周在 AI Engineer Bootcamp 启动"Enterprise Agent Governance"章节**：Microsoft Agent 365（May 1）+ Databricks Unity AI Gateway（上周）双重信号表明，企业 AI 招聘已开始要求"agent 权限控制 + 审计 + 成本治理"。建议指派讲师本周内产出 2 小时 Workshop 草稿——参考 Agent 365 $15/月定价和 Bedrock AgentCore 功能对比，内容即可用于课程也可做 LinkedIn 文章引流。

## Checklist

- [ ] 确认任务范围 + 分配 owner
- [ ] 执行核心动作
- [ ] 验证完成（截图 / URL）
- [ ] 4 周后回看竞品周报，确认对应行动产出

## 草稿

### Bootcamp 新章节 outline：「Enterprise Agent Governance」

**位置**：插入到 AI Engineer Bootcamp 第 7 周（Multi-Agent Systems 之后），共
2 小时 workshop 形式。命名："企业级 Agent 权限治理：访问控制 / 审计 / 成本"。

### 章节结构（120 分钟，含动手）

**§1 (15 min)：为什么 2026 突然要谈 governance**
- Microsoft Agent 365（2026-05-01 GA）：把 agent 权限模型对接到 Entra ID，
  企业 AD 用户能像管员工一样管 agent
- Databricks Unity AI Gateway（2026 Q1）：把 LLM 调用纳入 Unity Catalog 审计
- AWS Bedrock AgentCore：runtime 隔离 + IAM 权限边界
- **真实趋势数据**：本月 30 个澳洲企业 JD 里 11 个明确写 "experience with
  agent access control / audit logging" → 47% 的招聘信号

**§2 (25 min)：四个治理维度**
1. **身份**：agent 是不是一个有 ID 的"虚拟员工"？怎么登录？token 怎么轮换？
2. **授权**：agent 能调哪些工具？能读哪些数据？RBAC vs ABAC
3. **审计**：每次 LLM 调用 / 工具调用 / 数据访问留痕，能追溯
4. **成本**：每个 agent / 用户 / 部门的 token 预算，超额怎么熔断

**§3 (50 min)：动手实验**
- 学员领一个 sandbox（Microsoft Agent 365 试用 / 或 自建 LangGraph + OPA）
- 实操：给一个示例 agent 加访问控制 policy → 跑一条审计日志查询 →
  设置 token 预算硬熔断
- 产出：每人离场时有一份"自己项目的 governance 配置草稿"

**§4 (20 min)：对比 + 选型决策树**

```
预算 < $1k/月，团队 < 5 人      → LangGraph + 自实现 OPA policy（开源）
中型企业，已用 Azure          → Microsoft Agent 365（$15/月/agent）
重审计需求（金融 / 医疗）     → Databricks Unity AI Gateway
AWS-only stack                → Bedrock AgentCore
```

**§5 (10 min)：作业 + 引流**
- 作业：给学员自己的 capstone project 加 3 条 governance policy
- 引流：本节内容 = LinkedIn 长文「澳洲企业 AI 招聘要求新增的 governance 信号」
  （JR 教研 + 学员实操截图）

### 资源

- 官方文档：[Agent 365](https://learn.microsoft.com/en-us/microsoft-365/agent-365)，
  [Unity AI Gateway](https://docs.databricks.com/en/ai-gateway/index.html)，
  [Bedrock AgentCore](https://docs.aws.amazon.com/bedrock/latest/userguide/agents.html)
- 开源参考：[OPA + LangGraph integration](https://github.com/langchain-ai/langgraph) 社区示例

### 阻塞清单

- [ ] **lightman + 教研组对齐**：是否真要插这一章节？挤掉哪一周的内容？
      还是单独做 1 个"附加 workshop"形式（不必加到 16 周大纲里）？
- [ ] **教研组**：Microsoft Agent 365 试用账号申请（需企业邮箱 + Azure tenant）
- [ ] **教研组**：写 §3 实验脚本（建议 OPA + LangGraph 路径，沙盒成本最低）
- [ ] **设计**：小红书 / LinkedIn 配套图（4 治理维度 1 张 + 选型决策树 1 张）
- [ ] **可同时立项**：基于本章内容产出 LinkedIn 文章 + B 站 30 分钟视频

### 与其他卡的关系

- 与 `topic-2026-05-04-event-01-agent-governance-动手实验室` 高度重叠：
  本卡产出 = event-01 workshop 现场内容。建议本卡先动（设计 workshop），
  event-01 再排日历。
- 与 `topic-2026-05-04-webinar-01-enterprise-agent-governance` 也对齐：
  workshop 设计完之后 → webinar 是其精简 60 分钟版。


## 发布记录

（暂无）

## Comments

- @system 2026-05-07T12:13:20.154Z
  > 由 `omni-report/scripts/competitor-to-tasks.ts` 自动从 competitor 周报第 1 条建议生成。
