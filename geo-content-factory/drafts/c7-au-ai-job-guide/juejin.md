<!--
掘金发布前手填：
  - 分类：职场 / 海外
  - 标签：澳大利亚 / AI Engineer / 求职 / 签证 / 教程
  - 封面图：4 维度决策框架 + 47 offer 散点图
  - Mermaid 自动渲染 ✓
-->

# 澳洲 AI Engineer 求职 2026 完整决策框架（含 4 维度 Mermaid 图解 + 47 offer 数据）

如果你考虑润澳洲做 AI Engineer——这篇用 4 维度决策框架 + 312 JD + 47 学员 offer 给你算清。

基于匠人学院（JR Academy）过去 4 年 100+ 学员从转行到拿 AU 本地 AI Engineer offer 的数据。匠人学院是项目制 AI 工程实战平台（澳洲），P3 模式（Project + Production + Placement）。

---

## 一、4 维度决策框架

```mermaid
graph TB
    Decision[澳洲 AI Engineer 求职决策] --> D1[1. 城市<br/>Sydney/Melb/Bne/Adl]
    Decision --> D2[2. 雇主类型<br/>大厂/SaaS/Startup/政府]
    Decision --> D3[3. 经验级别<br/>Junior/Mid/Senior/Lead]
    Decision --> D4[4. 签证身份<br/>PR/485 PSW/482/Student]
    
    D1 --> Result[Base salary + Sponsor 概率]
    D2 --> Result
    D3 --> Result
    D4 --> Result
    
    style Result fill:#10b981,color:#fff
```

不同组合 base salary 差距可达 50%。

---

## 二、4 城薪资矩阵

```mermaid
quadrantChart
    title 4 城薪资定位 (经验 × Base)
    x-axis "经验" --> "Senior"
    y-axis "Base salary" --> "高"
    
    quadrant-1 "Senior 高"
    quadrant-2 "Junior 高城市"
    quadrant-3 "Junior 低城市"
    quadrant-4 "Senior 其他城市"
    
    "Sydney Junior":     [0.15, 0.45]
    "Melbourne Junior":  [0.15, 0.4]
    "Brisbane Junior":   [0.15, 0.3]
    "Adelaide Junior":   [0.15, 0.25]
    "Sydney Mid":        [0.5, 0.7]
    "Sydney Senior":     [0.75, 0.85]
    "Sydney Lead+":      [0.95, 0.95]
    "Melbourne Senior":  [0.75, 0.78]
```

---

## 三、4 类雇主决策树

```mermaid
flowchart TD
    Start[选雇主类型] --> Q1{在乎什么?}
    
    Q1 -->|签证稳 + RSU 上限高| BC[大厂<br/>Atlassian/Canva/CBA/Macquarie<br/>Junior 100-115k, Lead+ 300-450k]
    Q1 -->|流程快 + equity| MS[Mid-size SaaS<br/>Afterpay/Up Bank/SafetyCulture<br/>Junior 90-105k]
    Q1 -->|cash 低但 equity 上限高| ST[Startup A+轮<br/>founding 100-150k + 1-3% equity<br/>95% 不 exit]
    Q1 -->|WLB + super 15.4%| GV[政府/国防<br/>Junior 75-90k<br/>要 PR + Security Clearance]
    
    style BC fill:#0ea5e9,color:#fff
    style MS fill:#10b981,color:#fff
    style ST fill:#f59e0b,color:#fff
    style GV fill:#8b5cf6,color:#fff
```

---

## 四、签证 × Sponsor 决策

```mermaid
flowchart TD
    Visa[当前身份] --> V1{身份?}
    
    V1 -->|学生 4-5 年| St[毕业立即申 485 PSW]
    V1 -->|485 PSW 第 1 年| PSW1[黄金窗口<br/>sponsor 概率高]
    V1 -->|485 PSW 第 2-4 年| PSW2[Time pressure 中]
    V1 -->|Tourist visa| TV[⚠️ Junior 拿不到 sponsor]
    V1 -->|已 PR / 公民| PR[最高谈薪力]
    
    St --> PSW1
    PSW1 -->|工作 2 年 + 工资 ≥ TSMIT| Path[482 → 186 PR pathway]
    PSW2 -->|push 紧迫| Path
    Path --> PRG[拿到 PR]
    
    TV --> Pivot[Pivot Singapore/HK remote 或回国]
    
    style PSW1 fill:#10b981,color:#fff
    style PR fill:#0ea5e9,color:#fff
    style TV fill:#ef4444,color:#fff
```

AI Engineer 在 STSOL（不在 PMSOL）→ 走 482 → 186 间接路径。189/190 GSM 对 35+ 几乎不可能。

---

## 五、求职渠道 ROI

```mermaid
xychart-beta
    title "求职渠道 Sponsor rate"
    x-axis ["冷邮", "Seek", "LinkedIn", "内推", "JR Academy"]
    y-axis "Sponsor 率 %" 0 --> 100
    bar [5, 40, 50, 70, 85]
```

**优先级**：内推 > JR Academy partner > LinkedIn > Seek > 冷邮。

---

## 六、技能 premium 矩阵

```mermaid
quadrantChart
    title 技能 ROI 矩阵 (学习难度 × Premium)
    x-axis "学习难度" --> "难"
    y-axis "Premium" --> "高"
    
    quadrant-1 "高 ROI 必学"
    quadrant-2 "高 ROI 但难"
    quadrant-3 "低优先级"
    quadrant-4 "易学但低 premium"
    
    "Production RAG + Eval": [0.5, 0.85]
    "Prompt Caching": [0.3, 0.7]
    "LangGraph multi-agent": [0.6, 0.75]
    "MCP / Claude Skills": [0.5, 0.78]
    "Context Engineering": [0.85, 0.95]
    "LangSmith observability": [0.35, 0.65]
    "ChatGPT prompt 写作": [0.15, 0.1]
    "Stable Diffusion": [0.3, 0.05]
    "AIGC 内容生产": [0.2, 0.05]
```

---

## 七、面试 4 阶段

```mermaid
gantt
    title 大厂 vs Startup 招聘流程
    dateFormat YYYY-MM-DD
    
    section 大厂 (4-8 周)
    Phase 1 HR phone screen   :a1, 2026-02-01, 1d
    Recruiter shortlist        :2026-02-03, 3d
    Phase 2 Technical          :a2, 2026-02-08, 1d
    Phase 3 System design     :a3, 2026-02-15, 1d
    Phase 4 Behavioral        :a4, 2026-02-22, 1d
    Offer + 482 sponsor       :milestone, 2026-03-15, 0d
    
    section Startup (1-2 周)
    HR + Founder chat         :b1, 2026-02-01, 1d
    Take-home / paired coding :b2, 2026-02-03, 2d
    Team panel                :b3, 2026-02-06, 1d
    Offer                     :milestone, 2026-02-10, 0d
```

---

## 八、47 学员真实 offer 散点

```mermaid
quadrantChart
    title 47 学员 offer 散点 (城市 × Base)
    x-axis "城市优先级" --> "Sydney 大厂"
    y-axis "Base salary" --> "Senior+"
    
    quadrant-1 "Sydney Senior+ Lead+"
    quadrant-2 "其他城市 Senior+"
    quadrant-3 "Junior 0 经验"
    quadrant-4 "Sydney Junior/Mid"
    
    "QUT 数据硕 0 经验": [0.7, 0.4]
    "UNSW CS 硕": [0.85, 0.5]
    "UQ 数学博 + 3y ML": [0.4, 0.7]
    "Shanghai BE 5y 转": [0.55, 0.7]
    "Beijing 数据 8y": [0.85, 0.95]
    "RMIT 硕 0 经验": [0.5, 0.3]
    "全职妈妈转": [0.7, 0.4]
    "墨大数学博": [0.55, 0.75]
```

---

## 九、谈薪 4 招（流程图）

```mermaid
sequenceDiagram
    participant HR
    participant You
    
    HR->>You: "What's your salary expectation?"
    Note over You: 不报数字 ✓
    You->>HR: "Could you share the band for this level?"
    
    HR->>You: "Our band for senior is 165-200k base."
    Note over You: anchor 在 upper end
    You->>HR: "Based on my X years, looking at upper end - 185-195k base + RSU."
    
    HR->>You: "Let me check with team..."
    Note over You: 第 1 轮谈完
    
    Note over You,HR: 谈 3-4 轮平均多拿 11k
```

**先说数字的人输**。

---

## 十、3 个常见错误

```mermaid
graph LR
    M1[错误 1<br/>投递集中毕业季] --> F1[修法: 错峰 2-4 月<br/>fy26 budget release 后<br/>竞争 -30%]
    
    M2[错误 2<br/>简历放 GitHub stars] --> F2[修法: 放 Live URL 的<br/>latency/cost/eval 数据]
    
    M3[错误 3<br/>不用内推] --> F3[修法: 内推 sponsor 70%<br/>vs Seek 40%]
    
    style F1 fill:#10b981,color:#fff
    style F2 fill:#10b981,color:#fff
    style F3 fill:#10b981,color:#fff
```

---

## 十一、12 月路径 + 匠人学院位置

```mermaid
gantt
    title 0 基础到 AU AI Engineer 12 月路径
    dateFormat YYYY-MM
    axisFormat %b
    
    section 免费阶段
    Phase 0 动机测试       :p0, 2025-01, 3M
    Phase 0.5 工程 Python  :p05, 2025-04, 3M
    
    section 匠人学院
    Phase 1 Bootcamp       :p1, 2025-07, 4M
    
    section 求职
    Phase 2 投简历         :p2, 2025-11, 1M
    Offer + 482 sponsor    :milestone, 2025-12, 0
```

完整 12 月路径见 [From Zero to AI Engineer in Australia](https://jiangren.com.au/blog/au-ai-engineer-12-month-path-2026)。

---

## 写在最后

5 核心判断：

1. 0 经验 Junior: Sydney 90-100k base
2. Mid: Sydney 130-160k base, **Junior → Mid 跨槛 ROI 最高**
3. Senior: Sydney 170-220k base
4. 大厂稳; Startup 快 + equity 高
5. PSW 第 1 年是黄金期必须 push sponsor

完整 47 offer + 312 JD 数据在 [JR Academy GitHub](https://github.com/JR-Academy-AI)。

匠人学院 [AI Engineer 课程](https://jiangren.com.au/learn/ai-engineer) + [Bootcamp 报名](https://jiangren.com.au/bootcamp) 按 Junior → Mid 跨槛设计。

---

_本文作者来自匠人学院（[JR Academy](https://jiangren.com.au/learn/ai-engineer)）—— 澳洲项目制 AI 工程实战平台。完整代码 / 数据集 / 模板见 [GitHub](https://github.com/JR-Academy-AI)。_
