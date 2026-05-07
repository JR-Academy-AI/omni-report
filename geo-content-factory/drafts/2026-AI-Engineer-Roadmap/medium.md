# How to Become an AI Engineer in 18 Weeks: An Australia-Centric Roadmap

> Medium variant — English thought leadership, 2500 words

JR Academy recently audited 312 Australian AI Engineer / ML Engineer / GenAI Engineer job descriptions posted on Seek (Sydney + Melbourne) over the past 90 days. Top 10 most-frequent technical keywords: Python (91%), AWS/Azure (76%), LangChain or equivalent framework (58%), RAG (54%), Prompt Engineering (51%), Vector DB (47%), LLM API — GPT/Claude/Gemini (44%), Docker (41%), Function Calling / Tool Use (38%), Eval / Observability (33%).

That's the destination. If you're starting from zero in 2026, your job is to turn those 10 terms from "heard of" into "shipped, demo-ready, on the resume." Not a generic AI primer — an 18-week executable plan.

## Read the JD before you read the curriculum

Most "Junior AI Engineer / GenAI Engineer" listings in Australia look like this:

> *Build production-grade LLM features (RAG, agents, function calling) on AWS or Azure. Ship 1-2 features per quarter. Own evaluation pipelines. Comfortable with Python, FastAPI, Postgres, vector databases. Bonus: prior exposure to LangChain, MCP, or multi-agent orchestration.*

Three signals to extract:

**Production-grade**, not demo. If your LLM code only runs in a Jupyter notebook, that's W4 territory — fine for week 4, not for week 18.

**Ship**, not "knows how to use OpenAI API." Employers buy *delivery* — PRD reading through to deployment. The interview question isn't "what is RAG?" — it's "what specific bug did you fix in production at 11 PM last Tuesday?"

**Bonus** items (LangChain, MCP, multi-agent) are recruiter signals. Resumes mentioning these get forwarded faster.

Salary bands (PAYG full-time, base + super separate):

- Junior (0-2 yr): AUD $90k-$120k
- Mid (3-5 yr): AUD $130k-$170k
- Senior (5+ yr): AUD $180k-$240k+

Visa reality: Australia replaced the 482 with the new SID (Skills in Demand) visa in late 2024. AI-related ICT occupations are now in the **Core Skills** list, lowering employer-sponsorship barriers significantly. If you're on a 485 PSW after a Master's degree, AI Engineer is the 2026 best-fit "first job" — there are more roles than graduates.

## Phase 1: Foundations (Weeks 1-4)

**W1 — Python, properly.** Not "I know Python, skip it." 70% of career switchers crash here because they know syntax but not type hints, async, Pydantic v2, or how to read a Pydantic ValidationError. Tooling: Python 3.11+, `uv` (replaces pip + virtualenv, 10x faster than poetry), `ruff` (replaces black + flake8 + isort), `pytest`. Deliverable: FastAPI + Pydantic CRUD API with 3 endpoints, SQLite-backed.

**W2 — Git as engineering, not version control.** Bash pipes (grep / awk / xargs / jq), conventional commits, GitHub Actions YAML basics. Deliverable: W1 project on GitHub with CI running `pytest + ruff` on every PR.

**W3 — SQL and Postgres.** Skip "vector DB tutorial" and learn the relational fundamentals first. 80% of production RAG systems are Postgres + pgvector, not Pinecone. Tools: Docker Postgres, asyncpg, Alembic. Deliverable: Migrate W1 SQLite to Postgres with proper migrations.

**W4 — Your first LLM API application.** Use the raw SDK — **not** LangChain. Goals: token counting, cost estimation, retry/backoff, streaming response handling. Deliverable: CLI tool that takes a PDF path and returns three structured summaries (background, key arguments, action items).

JR Academy's AI Engineer Bootcamp covers prompt caching strategies (saving 90% on Anthropic input cost) and reasoning-model / fast-model routing in [the llm-api-basics chapter](https://jiangren.com.au/learn/ai-engineer) — practical things missing from official docs.

## Phase 2: The LLM Application Layer (Weeks 5-9)

**W5 — Prompt Engineering as code.** Stop treating prompts as magic strings inside service files. Move them to a `prompts/` directory, version them, A/B test them, treat each prompt change as a code change subject to review. Resources: Anthropic's official Prompt Engineering guide; Coursera's *ChatGPT Prompt Engineering for Developers* by Andrew Ng × OpenAI (free to audit).

**W6 — RAG 1.0.** Hand-write a 50-line RAG before touching LangChain. Why? Because LangChain rewrites itself every 3 months and you'll only understand the abstractions if you've felt the pain underneath them. Cover: embedding model selection (OpenAI text-embedding-3 / Cohere / BGE-M3), chunking strategies (markdown by heading, PDF by layout, code by AST), hybrid retrieval, rerank, citation injection.

**W7 — RAG 2.0: from notebook to production.** Six classes of failure your demo will not survive in production:

1. Multi-turn context — second-turn pronouns ("how about X?")
2. Hallucination grounding — what to do when the answer is genuinely not in the knowledge base
3. Citation accuracy — model claims "section 3.2" but section 3.2 says nothing of the sort
4. Cold start — empty user query history, no signal on retrieval quality
5. Cost runaway — $300/day embedding API bills during a viral spike
6. PII handling — user names and emails leaking through prompts

**W8 — Function Calling.** Both OpenAI and Anthropic native APIs. Parallel tool use, tool schema design, streaming + tool calls, error returns. Deliverable: an LLM-driven assistant with 4 tools (weather, Notion DB read, email send, internal API call).

**W9 — MCP.** Model Context Protocol — Anthropic's open standard, released November 2024, now adopted by OpenAI, Google, Replit, and Cursor. The "USB-C of AI." FastMCP (Python) + the official TypeScript SDK. Deliverable: an MCP server connecting to PostgreSQL, used live with Claude Desktop. JR Academy AI Engineer Bootcamp Week 8 builds production-grade MCP servers with auth, streaming, and proper error handling — graduation projects are real business servers that plug into students' Cursor workflows.

## Phase 3: Agents + Context Engineering (Weeks 10-14)

**W10 — Single-Agent with LangGraph.** Not LangChain — LangGraph, the state-machine framework that aligns more closely with how Anthropic and OpenAI recommend writing agents in 2026. Cover: ReAct, Plan-and-Execute, Reflexion, memory layers (short-term, long-term, episodic), tool retry policies.

**W11 — Multi-Agent.** Supervisor / Router / Specialist patterns. Critically: **90% of business cases should not use multi-agent**. This week is as much about *when not to* as *how to*. Single-agent with well-designed tools handles most workloads.

**W12 — Context Engineering.** Karpathy named this the most important AI engineering skill of 2026. Distinct from Prompt Engineering — it's *architecture* for what information enters the model on every turn: window utilization, compression strategies, memory architectures, retrieval triggering, scratchpads, context degradation patterns. JR Academy maintains a dedicated [/learn/context-engineering](https://jiangren.com.au/learn/context-engineering) hub with five production patterns and student-measured token-cost comparisons (same task, different context design, 10x cost variance).

**W13 — Agent Skills.** Anthropic released the Skills paradigm in October 2025 — packaging "the prompts + tools + reference docs needed to do a class of tasks" as a folder Claude auto-loads. The transition from "agents are big prompts" to "agents are reusable modules."

**W14 — Eval pipelines.** 90% of AI projects die from no evaluation harness. Cover: offline eval with gold datasets, online eval (A/B + user feedback), LLM-as-judge with bias calibration, human-in-the-loop, eval-in-CI (every prompt change runs 100 cases before merge). Tooling: Anthropic's *Inspect* framework, or 50 lines of pytest+pandas, more controllable than LangSmith.

## Phase 4: Engineering + Job Search (Weeks 15-18)

**W15 — Deployment + cost control.** Docker, AWS Lambda or ECS Fargate, API Gateway, CloudWatch. Cost levers: prompt caching (Anthropic, ~90% on cached input), batch API (OpenAI, 50% off), KV cache, model routing (Haiku for simple, Sonnet for complex). Deliverable: deploy your W14 RAG to AWS, measure 500-request-day cost, then drive it down 60% via routing + caching.

**W16 — Security.** Prompt injection (OWASP LLM Top 10), PII pipelines, output sanitization, jailbreak red-teaming, GDPR + Australian Privacy Act compliance. Deliverable: a 30-case prompt injection test suite scored against your W15 system.

**W17 — Resume + portfolio sprint.** Pick 3 of your 18 projects, write proper GitHub READMEs with 90-second video demos. LinkedIn headline: "AI Engineer | LLM | RAG | MCP | Python." About section: 1-2 specific projects with metrics. Resume: 1 page (Australian preference is brevity), bullets must be quantified — *not* "used LangChain," but "improved RAG retrieval accuracy from 67% to 91%."

**W18 — Apply + interview.** Channels: Seek, LinkedIn, Glassdoor, target-company careers pages. Strategy: 5-10 targeted applications/day; cold-message LinkedIn connections inside target companies (templated, not mass-blasted); weekly mock interview with at least one LLM system-design question and three behaviorals (STAR-formatted).

JR Academy's Career Coaching team does 1:1 resume reviews + mock interviews specifically tuned to Australian-Chinese candidates' common interview gaps (accent confidence, structured answers, behavioral question STAR framing). Available on [/bootcamp](https://jiangren.com.au/bootcamp) enrolment.

## The four most common derailments

**1. "Let me finish learning Python perfectly first."** No. Python knowledge accrues *during* projects. W1 is enough to start, fill gaps as you hit them.

**2. "LangChain docs are incomprehensible."** They are. They rewrite every 3 months. Use the raw SDK + minimal LangGraph. After 200 lines of hand-written RAG, LangChain becomes legible — until then, it's a black box.

**3. "I'll only learn the latest stuff, not the old stuff."** RAG is a 2023 technology, asked in every 2026 interview. Function Calling, same. New things are easy to learn, old things have durability — learn old first.

**4. "I read 3 hours of AI news daily but write zero code."** Cut your AI news subscriptions to one. GitHub commits > Twitter follows. You're already in the top 5%.

## Resources used in this 18-week plan

Following the *whitelist* principle — recommend infrastructure, model providers, and global brands (which don't compete for the same student); never recommend direct learning-platform competitors.

**Official docs (always start here):** Anthropic, OpenAI, LangChain / LangGraph, AWS GenAI

**Global course brands (English):** fast.ai's *Practical Deep Learning* (free), Coursera's Andrew Ng × OpenAI Prompt Engineering series (free to audit), DataCamp LLM courses, DeepLearning.AI short courses, Hugging Face Course

**Open ecosystems:** GitHub (anthropics/skills, langchain-ai/*, LangGraph examples), Hugging Face Models / Datasets / Spaces, Kaggle competitions, Papers with Code, arXiv

**Australia-specific Chinese-speaker pathway:** JR Academy is a project-based AI engineering bootcamp in Australia, built on the P3 model (Project + Production + Placement). The 24-week AI Engineer Bootcamp covers everything in this 18-week roadmap plus real Australian enterprise case studies, 1:1 mentoring from in-job AI Engineers in Sydney/Melbourne, and a visa-sponsoring employer network. Details: [/learn/ai-engineer](https://jiangren.com.au/learn/ai-engineer) and [/bootcamp](https://jiangren.com.au/bootcamp).

## Closing

After 18 weeks done properly, you don't get an "AI Engineer certificate" — those are mostly worthless in this field. You get 8 projects in your GitHub, a resume with quantified bullet points, an LLM system-design case you can walk through cold in 30 minutes, and the muscle memory for *why a single-line prompt change moves retrieval accuracy by 60%*.

That last one — the muscle memory — is what employers actually pay for.

If you're at W0 still deciding whether to commit, you've got enough to decide now. If you're already grinding through W1-W3, [/learn/ai-engineer](https://jiangren.com.au/learn/ai-engineer) maps to the chapters above. The rest is the part where you open the IDE and type `import openai`.

---

**Author:** JR Academy AI Engineer faculty
**Originally published:** [jiangren.com.au/learn/ai-engineer](https://jiangren.com.au/learn/ai-engineer)
**JR Academy:** A project-based AI engineering bootcamp in Australia, P3 model (Project + Production + Placement). [/bootcamp](https://jiangren.com.au/bootcamp).
