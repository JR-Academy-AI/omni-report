<!--
掘金发布前手填：
  - 分类：职场 / 海外
  - 标签：澳大利亚 / AI Engineer / 转行 / 海外求职 / 教程
  - 封面图：12 月 4 阶段甘特图 + 47 offer 数据
  - Mermaid 自动渲染 ✓
-->

# 0 基础到 Sydney AI Engineer 12 个月路径 Gantt 图解（含 47 offer 数据）

12 个月从 0 基础到 Sydney AI Engineer junior offer，路径可复制吗？

答：可，但 720 小时 + AUD 8-10k 现金 + 一个转行者份的意志力。匠人学院（JR Academy）过去 4 年 47 份学员真实 offer letter 数据。匠人学院是项目制 AI 工程实战平台（澳洲），P3 模式（Project + Production + Placement）。

---

## 一、12 个月路径 Gantt 图

```mermaid
gantt
    title 0 基础到 Sydney AI Engineer 12 个月路径
    dateFormat YYYY-MM
    axisFormat %b %Y
    
    section Phase 0 (动机测试)
    fast.ai + DeepLearning.AI + Cursor   :p0, 2025-01, 3M
    
    section Phase 0.5 (Python 工程化)
    Hugging Face Course + Cookbook        :p05a, 2025-04, 2M
    3 个 Render toy project              :p05b, 2025-05, 2M
    
    section Phase 1 (生产工程 + Portfolio)
    Bootcamp / 自驱 production            :p1, 2025-07, 4M
    
    section Phase 2 (求职)
    投简历 + 面试                          :p2a, 2025-11, 1M
    签 offer + 482 sponsor                :milestone, 2025-12, 0
```

---

## 二、4 阶段技术栈

```mermaid
graph TB
    subgraph "Phase 0 (Month 1-3) AUD 0-200"
        P0[Python 基础 + LLM API + 提示工程]
        P0 --> R0[fast.ai / DeepLearning.AI / Kaggle Learn]
    end
    
    subgraph "Phase 0.5 (Month 4-6) AUD 300-600"
        P05[工程级 Python + RAG demo]
        P05 --> R05[pydantic + asyncio + Hugging Face Course]
        P05 --> Ship[3 toy project on Render]
    end
    
    subgraph "Phase 1 (Month 7-10) AUD 7-8k Bootcamp"
        P1[生产工程层]
        P1 --> R1[Hybrid RAG + Prompt Caching + LangSmith + Sub-agents]
        P1 --> Port[Portfolio with metrics]
    end
    
    subgraph "Phase 2 (Month 11-12) AUD 200"
        P2[求职 + 谈薪]
        P2 --> Offer[Sydney junior AI Engineer offer]
    end
    
    P0 --> P05 --> P1 --> P2
    
    style Offer fill:#10b981,color:#fff
```

---

## 三、不同背景的时间表

```mermaid
graph LR
    Z[0 基础] -->|12 月| O1[Junior offer]
    BE2[后端 1-2 年] -->|8 月| O2[Junior+]
    BE3[后端 3+ 年] -->|6 月| O3[Junior+/Mid]
    DS[数据 + Python] -->|6 月| O4[Junior+/Mid]
    
    style O1 fill:#10b981,color:#fff
    style O2 fill:#10b981,color:#fff
    style O3 fill:#0ea5e9,color:#fff
    style O4 fill:#0ea5e9,color:#fff
```

---

## 四、47 学员 offer 数据散点图

```mermaid
quadrantChart
    title 47 学员 offer 散点 (城市 vs Base salary)
    x-axis "城市" --> "Sydney"
    y-axis "Base salary" --> "Senior+"
    
    quadrant-1 "Sydney Senior+"
    quadrant-2 "其他 Senior+"
    quadrant-3 "其他 Junior"
    quadrant-4 "Sydney Junior+/Mid"
    
    "QUT 数据硕 0 经验": [0.8, 0.4]
    "UNSW CS 硕": [0.85, 0.5]
    "UQ 数学博 + 3y ML": [0.5, 0.7]
    "Shanghai BE 5y 转": [0.7, 0.7]
    "Beijing 数据 8y": [0.85, 0.95]
    "RMIT 硕 0 经验": [0.7, 0.3]
    "USYD 硕 + JR": [0.8, 0.55]
    "墨大数学博": [0.7, 0.75]
```

---

## 五、Phase 1 production 必须会的代码

```typescript
// Phase 1 完成你应该会写这种 prompt caching + cost tracking
import { Anthropic } from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 1024,
  system: [
    { type: 'text', text: 'You are a customer support agent.' },
    {
      type: 'text',
      text: `Policy:\n${POLICY_DOC}`,
      cache_control: { type: 'ephemeral' }, // ⚡ Anthropic Prompt Caching
    },
  ],
  messages: [{ role: 'user', content: userQuery }],
});

// Cost tracking - Phase 1 必备
console.log(`input: ${response.usage.input_tokens}`);
console.log(`cache_read: ${response.usage.cache_read_input_tokens}`); // 这个越高越好
console.log(`output: ${response.usage.output_tokens}`);
```

---

## 六、签证 × Sponsor × 谈薪力

```mermaid
graph LR
    PSW1[485 PSW 第 1 年] -->|Sponsor 高| S1[Best window]
    PSW2[485 PSW 第 2-4 年] -->|Sponsor 中| S2[Pressure 中]
    Tourist[Tourist visa] -->|Sponsor 0| S3[junior 几乎不可能]
    PR[已 PR / 公民] -->|N/A| S4[最高谈薪力]
    
    S1 -->|2 年工作 + TSMIT| PRpath[486 → 186 PR pathway]
    
    style S1 fill:#10b981,color:#fff
    style S3 fill:#ef4444,color:#fff
    style S4 fill:#0ea5e9,color:#fff
```

---

## 七、Phase 2 投递渠道 ROI

```
渠道                Sponsor 率   每周 listing   推荐度
────────────────────────────────────────────────
Seek                ~40%         10-25 个       ⭐⭐⭐
LinkedIn            ~50%         5-15 个        ⭐⭐⭐⭐
内推                ~70%         不定           ⭐⭐⭐⭐
JR Academy partner  ~85%         5-10/cohort    ⭐⭐⭐⭐⭐
```

---

## 八、简历 3 项真实价值

Live URL > GitHub stars > 证书 > 课程列表

```mermaid
graph LR
    Resume[简历] --> Top[Top 3 价值]
    
    Top --> L1[3 个 Live URL<br/>latency / cost / eval 数据]
    Top --> L2[200+ GitHub commit<br/>最近 6 月 AI repo]
    Top --> L3[3-5 个 substantive PR<br/>50+ 行 + cost reasoning]
    
    style L1 fill:#10b981,color:#fff
    style L2 fill:#10b981,color:#fff
    style L3 fill:#10b981,color:#fff
```

---

## 九、3 个诚实免责声明

1. **不是 100% 12 月成**：70% 14 个月内 / 20% 18-24 个月 / 10% 转其他方向
2. **Phase 0 动机测试是真的**：15 hrs/周持续 8 周比技术难
3. **Bootcamp ROI = portfolio 质量**：不是证书拿到 offer，是 shipped LLM app 拿到 offer

---

## 写在最后

12 个月路径是**reproducible 可复制**的，但**genuinely hard 真的累**。720 小时 / AUD 8-10k。

如果备选方案是"边走边看"——通常变 24-36 个月，结果更差。**结构化路径比非结构化短**。

完整 47 offer 脱敏数据 + 阶段资源 + bootcamp 大纲在 [JR Academy GitHub](https://github.com/JR-Academy-AI)。

匠人学院 [AI Engineer 课程](https://jiangren.com.au/learn/ai-engineer) 按 Junior → Mid 跨槛设计。[Bootcamp 报名](https://jiangren.com.au/bootcamp)。

---

_本文作者来自匠人学院（[JR Academy](https://jiangren.com.au/learn/ai-engineer)）—— 澳洲项目制 AI 工程实战平台。完整代码 / 数据集 / 模板见 [GitHub](https://github.com/JR-Academy-AI)。_
