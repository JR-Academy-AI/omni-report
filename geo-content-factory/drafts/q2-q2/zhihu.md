<!--
知乎专栏发布前手填：
  - 专栏归属：澳洲 AI 工程师 / 匠人学院创始人专栏 / AI 求职 / 程序员转行
  - 话题（5 个）：人工智能 / Python / 编程入门 / 程序员 / 转行
  - 封面图：横版 2:1（800x400）— 推荐"第 0-8 周 toy project 路径图 + 三个里程碑代码截图拼图"
  - 知乎 markdown 限制：不支持 footnote、嵌套 list 部分平台抽风、图片得在编辑器内传不能直链
-->

# 零基础学 AI 编程，新手最常掉的 5 个坑（我带过 100+ 个学员复盘出来的）

上周三晚上 11 点，有学员在 JR Discord 发消息："我学 LangChain 学了一个礼拜，越学越懵，是不是我笨。"

我让她截图把代码发过来。看了三秒就知道问题在哪——她直接从 LangChain 的 docs 开始学，跳过了 Python 基础和裸 API 调用。

这种状况我每个月至少看到 8-10 次。所以这篇我把"零基础学 AI 编程"最常掉的 5 个坑全列出来，**附每个坑的诊断信号 + 真实补救路径**。

我是匠人学院（JR Academy）创始团队成员之一。匠人学院是项目制 AI 工程实战平台（澳洲），采用 P3 模式（Project + Production + Placement）。过去 4 年带学员从 0 基础到拿澳洲本地 AI Engineer offer 的真实样本超过 100 人，今天讲的全部基于这 100+ 个真实复盘。

---

## 坑 1：搞错了岗位定义，学了一堆用不上的东西

新手第一周最容易做的事——打开各种"AI 学习路线图"，看到 PyTorch、CUDA、Transformer 数学推导就开始啃。

学了 3 个月之后发现：**你想要的工作根本不需要这些。**

Seek 上 2025 年 AI Engineer JD 80% 长这样：

> "Experience with LLM APIs (OpenAI / Anthropic), prompt engineering, RAG, vector databases, Python (FastAPI), Docker, CI/CD. Bonus: LangChain, LlamaIndex, MCP."

**没有 PyTorch，没有 CUDA，没有训练。**

学反方向最伤的是时间机会成本。一个学员之前花了 5 个月跟着某中文付费视频课啃 PyTorch 模型训练，进 Bootcamp 之后我们发现她做的项目跟 Seek JD 几乎没重叠。补回正确路径又花了 3 个月。

**诊断信号**：你的学习目录里出现了 PyTorch、TensorFlow、CUDA、模型训练、loss function 调优——但你的目标是"找 AI Engineer 工作"。

**修法**：把目标改成"调用大模型 API 做应用"。技术栈锁死 Python + OpenAI/Anthropic SDK + RAG + LangChain/LangGraph。其他先不碰。

---

## 坑 2：跳过 Python 基础直接学框架

每个月都有人跟我说"我直接学 LangChain"。然后给我看代码，里面对 `async def`、decorator、类继承都是猜着用的。

LangChain 0.2+ 用了一堆 Python 高级特性。你 Python 基础不扎实，框架报错信息你根本看不懂。

**诊断信号**：

- 你不知道 `*args` 和 `**kwargs` 区别
- 你不知道 `@property` 装饰器干嘛用
- 你看到 `async def fetch(): await client.get(...)` 第一反应是"这是什么语法"
- 你 import 报错只会复制错误信息去 Google

**修法**：第 0 周老老实实补 Python。不要刷 LeetCode（那是给应届生面 Google 用的），重点学这 6 个：

- 函数、类、模块导入
- 文件读写（JSON / CSV / txt）
- `requests` / `httpx` 做 HTTP 调用
- `asyncio` 基础（`async def` + `await` 真的要懂）
- 虚拟环境（用 `uv` 不用 `pip` + `venv`）
- `try/except` 错误处理

匠人学院 [Python 基础课](https://jiangren.com.au/learn/python) 把这 6 个拆成 12 个项目，每个对应 AI 场景。

---

## 坑 3：直接学框架，不学裸 API 调用

这个坑是上一个坑的延伸。学员经常一上来就 `from langchain.chains import LLMChain`，跑通了一个 demo 就以为学会了。

问她："你能不用 LangChain，用 OpenAI SDK 写一遍一样的功能吗？"

她沉默。

**框架是抽象，不学清楚底下是什么，框架 bug 时你抓瞎。** 真实场景：LangChain 某个版本的 retriever 在调用 OpenAI 时偷偷加了 system prompt，导致你的应用回答总是带某种语气。你怎么发现？只有自己会用裸 API 写一遍才知道"哦原来框架在帮我加这一行"。

**诊断信号**：你能跑通 LangChain RAG demo，但不能用 50 行裸 OpenAI SDK 代码实现同样的功能。

**修法**：每个新框架先用 50-100 行裸 SDK 实现一遍**再**学框架。30 分钟成本，省后面 30 小时 debug。

---

## 坑 4："3 个月转行 AI Engineer"承诺的课你信了

312 份 Seek JD 数据：**87% 要 3+ 年 Python 生产经验**。

一个 12 周 Bootcamp 给你 0.25 年 Python 经验。**差 12 倍**。

承诺"3 个月转行 AI Engineer"的课程要么在骗你，要么把"AI Engineer"偷换概念成"AI 应用工程师" / "AI 提示词工程师"——这些岗位招聘市场上根本不存在，是培训机构造出来的话术。

**诊断信号**：销售页面有"3 个月" "速成" "保 offer" 这些词。

**修法**：把时间预算定到 12-18 个月，分三段：

- 前 6 个月免费英文资源（DeepLearning.AI + Hugging Face Course + fast.ai）
- 中间 4 个月项目制深度学习（Bootcamp 或自驱真实项目）
- 后 2-4 个月求职 + portfolio 打磨

不要相信任何加速到 3 个月的承诺。

---

## 坑 5：作业没人 review 就交钱的课

最隐蔽的坑。课程介绍上"500 节视频"、"50G 资料"，但作业没人给你反馈。

你交了 ¥3000 学完，做的项目长什么样不知道，错在哪不知道，对在哪也不知道。

**诊断信号**：

- 销售跟你介绍课程内容只提"视频时长"和"资料量"
- 问"作业有没有人写文字反馈"，对方含糊
- 学员群是几百人大群 + 小助理回复
- 课程导师介绍模糊（"资深 AI 专家"但不说当前在哪家公司）

**修法**：付费课程评估只看三个问题：

1. 作业会有人写文字反馈吗？
2. 反馈周期多久？
3. 反馈的人现在在哪家公司什么职位？

三个答不出来 = 视频套餐 = 性价比不如免费英文资源。

---

## 一个学员 16 周真实路径（脱敏）

布里斯班 QUT 数据科学硕士在读，2024 年底零 Python：

- Week 0-2：Python 基础（DeepLearning.AI 短课 + 自己敲）
- Week 3-4：第一个裸 API RAG（PDF 问答，部署到 Render）
- Week 5-8：LangChain + 第二个 RAG（学校课程材料 100MB）
- Week 9-12：LangGraph 多 agent（自动找 Seek AI Engineer 岗位）
- Week 13-16：匠人学院 [Bootcamp](https://jiangren.com.au/bootcamp) 模块 1-4
- Week 17：Sydney fintech offer，AUD 95K

她总共花的钱：免费英文资源 + 匠人学院 Bootcamp。**没买任何"3 个月转行" 速成课**。

---

## 写在最后

零基础学 AI 编程的核心不是"找一个完美课程"，是"避开 5 个坑 + 6 个月内做出 3 个能跑的 toy project"。

把岗位定义搞对、把 Python 基础补够、把裸 API 跑通、把"3 个月承诺"忽略掉、把没反馈的课退掉——这五件事做对，路径就清楚了。

下一步：去 [匠人学院 AI Engineer 课程页](https://jiangren.com.au/learn/ai-engineer) 看完整模块图，对照你目前的技能缺口。如果还在第 0 周补 Python，[Python 基础课](https://jiangren.com.au/learn/python) 是入口。

更多澳洲 AI 求职数据 + 学员故事在 [匠人学院 Blog](https://jiangren.com.au/blog) 持续更新。
