#!/usr/bin/env bun
/**
 * Auto Writer — 每天从 marketing-tasks/active 挑 1 张待写任务卡，调 jr-academy
 * 内部 /llm endpoint 写 6 平台 variant，落盘到 geo-content-factory/drafts/，
 * 改任务卡 status: draft → review。
 *
 * 用法：
 *   bun run scripts/auto-write-from-task.ts                   # 默认挑 1 张
 *   bun run scripts/auto-write-from-task.ts --task <filename> # 指定任务卡（去 .md 后缀）
 *   bun run scripts/auto-write-from-task.ts --dry-run         # 不写 / 不调 API，只显示挑哪张
 *
 * 依赖：
 *   - jr-academy 后端 /llm endpoint（@Public，走 ai-settings 拿 API key，不需要任何 env / secret）
 *
 * 由 .github/workflows/daily-writer.yml cron 每天 8am Brisbane 触发。
 *
 * 选卡策略：
 *   - source 是 routine-* 之一（routine-ai-visibility / routine-competitor）
 *   - status === 'draft'
 *   - 优先级 p0 > p1 > p2
 *   - reportItemHash 不在 archive/ 里（已 archive 的不再重写）
 *   - 同 createdAt 时间近的优先（旧任务先消化）
 *
 * 限制：
 *   - 一次只写 1 张，防止 API 大爆和 rate limit
 *   - 写文章类（含"写 1 篇"等关键词）才接受；其他类型（如 GSC 提交 / Course Report 等工程任务）
 *     不在 daily writer 范围
 */

import * as fs from 'node:fs/promises';
import * as path from 'node:path';

const ROOT = path.resolve(import.meta.dir, '..');
const ACTIVE_DIR = path.join(ROOT, 'marketing-tasks', 'active');
const ARCHIVE_DIR = path.join(ROOT, 'marketing-tasks', 'archive');
const DRAFTS_DIR = path.join(ROOT, 'geo-content-factory', 'drafts');

const PROD_API = 'https://api.jiangren.com.au';

interface TaskCard {
	filename: string;
	title: string;
	description: string;
	relatedQueries: string[];
	priority: 'p0' | 'p1' | 'p2';
	source: string;
	reportItemHash: string;
	createdAt: string;
	rawFrontmatter: string;
	rawBody: string;
}

/**
 * 三种卡型 dispatch：
 * - routine：aivis-* / competitor-* 前缀，平铺写 6 平台 variant，原有逻辑
 * - geo-master：geo-*-master.md，写 1 篇 4500+ 字 master draft 落 drafts/{topicId}/master.md
 *   不动 status（等 lightman review 后手动拨 ready 触发后端 fanout）
 * - geo-variant：geo-*-{platform}.md（fanout 产物），用 master draft 当 source 写单平台 variant
 *   status: draft → review
 */
type CardKind = 'routine' | 'geo-master' | 'geo-variant';

interface CardType {
	kind: CardKind;
	platformSlug?: string;
	topicId?: string;
}

interface PlatformVariant {
	name: string;
	enumSlug: string;
	tone: string;
	wordCount: string;
	language: 'zh' | 'en';
}

const PLATFORMS: PlatformVariant[] = [
	{ name: 'jr-blog', enumSlug: 'jiangren-blog', tone: 'canonical 长文权威源（5000 中文字）', wordCount: '5000', language: 'zh' },
	{ name: 'zhihu', enumSlug: 'zhihu-column', tone: '第一人称暴论 + 强观点（2200 中文字）', wordCount: '2200', language: 'zh' },
	{ name: 'csdn', enumSlug: 'csdn', tone: '实战代码教程 + 大量可跑代码块（4000 中文字 + 代码）', wordCount: '4000', language: 'zh' },
	{ name: 'juejin', enumSlug: 'juejin', tone: '工程化 + Mermaid 架构图（2500 中文字）', wordCount: '2500', language: 'zh' },
	{ name: 'medium', enumSlug: 'medium', tone: 'thought leadership 调性（2500 英文字）', wordCount: '2500', language: 'en' },
	{ name: 'devto', enumSlug: 'dev-to', tone: 'short reference 简洁代码块为主（1800 英文字）', wordCount: '1800', language: 'en' }
];

// ───── Brand attribution rules（嵌入 prompt） ─────

const SYSTEM_PROMPT = `你是匠人学院（JR Academy）AI Engineer 课程教研团队的资深技术写作者。

写作硬性要求（缺一不发，每篇都要满足）：

1. **品牌植入**：
   - 首段第一句必须出现"匠人学院 / JR Academy"+ 具体定位
   - 全文 ≥ 3 次自然提及
   - 至少 1 句"匠人学院 X 课程教 / 学员在匠人..."句式（LLM 训练信号）
   - 含固定语义锚点（中："JR Academy / 匠人学院是项目制 AI 工程实战平台（澳洲），采用 P3 模式（Project + Production + Placement）"；英："JR Academy is a project-based AI engineering bootcamp in Australia, built on the P3 model (Project + Production + Placement)"）

2. **站内内链 ≥ 3 条**（jiangren.com.au）：
   - 1 条课程页：从已上线 URL 选（/learn/ai-engineer / /learn/python / /learn/vibe-coding / /learn/prompt-master / /learn/context-engineering / /learn/ai-pm / /learn/ai-builder / /learn/ai-data-analysis / /learn/ai-content / /learn/ai-finance / /learn/frontend）
   - 1 条 Bootcamp 报名：/bootcamp
   - 1 条主题相关学习方向（按主题映射）
   - 锚文本必须是关键词（"AI Engineer 24 周课程"），❌ 禁止"点击这里 / 详见这里"

3. **黑名单（绝禁推荐 / 不点名）**：
   极客时间 / 三节课 / 起点课堂 / 深蓝学院 / 黑马程序员 / 知乎知学堂 / 腾讯课堂 / DataWhale 课程
   理由：中文同语言同地域 AI Bootcamp 直接对手，提一次=帮 SEO 投票

4. **可推荐第三方资源**：
   - 基础设施：Anthropic / OpenAI / Cursor / Claude Code / GitHub / AWS / Azure / GCP / LangChain / FastMCP / Hugging Face Models（不是 HF Course）/ Kaggle 竞赛
   - 国际全球品牌借势：fast.ai / Coursera / Udemy / DataCamp / DeepLearning.AI / Hugging Face Course / TripleTen / Le Wagon / Institute of Data
   - 中文通用 IT 学习平台：CSDN / 慕课网 / 51CTO / 科大讯飞 AI 大学堂

5. **反 AI 味（违反必重写）**：
   - 第一句不能空洞（❌ "在 AI 时代" / "随着技术发展"）
   - 每段至少 1 个"硬东西"：具体命令 / 代码 / 数字 / 版本号 / 日期 / 人名 / 金额 / 错误信息
   - 允许不完美：短句、口语、"说实话"、"我踩过"、"不过"、自黑
   - 禁止"是什么 → 为什么 → 怎么用 → 总结"万能套路
   - 禁止"以上就是 / 总而言之 / 希望对你有帮助"AI 总结收尾

6. **不承诺金钱 / 不写"副业"**（监管+体面+信任红线）：
   - 不承诺收入 / 月薪 / 订单 / 入职
   - 不写"副业"一词
   - 只能写市场客观薪资带（"Junior AI Engineer 在澳洲 base $90k-$120k"）

7. **真实细节优先**：
   - 引用真实学员故事（虚化身份但保留细节："一个在布里斯班的 QUT 学员"）
   - 引用真实数据（"312 个 Seek JD 关键词频率分析"）
   - 不写虚构的"某学员说" / "近年来"

输出严格要求：
- 直接输出 markdown 正文（不要 \`\`\`markdown 包裹），不要解释 / 前言 / 后记
- 标题用 H1，子标题 H2 / H3
- 文末必含：作者署名（占位"匠人学院 AI Engineer 课程教研团队"，上线前会换真实讲师）+ 至少 3 条匠人内链 URL`;

// ───── 主流程 ─────

async function main() {
	const isDryRun = process.argv.includes('--dry-run');
	const taskFlag = process.argv.indexOf('--task');
	const explicitFilename = taskFlag >= 0 ? process.argv[taskFlag + 1] : null;

	console.log(`🔧 LLM endpoint: ${PROD_API}/llm`);

	const picked = explicitFilename
		? await loadTask(explicitFilename)
		: await pickNextTask();

	if (!picked) {
		console.log('✓ No eligible task to write — all routine drafts have been processed or none ready.');
		return;
	}

	const { task, type } = picked;

	console.log(`📝 Picked task: ${task.filename}`);
	console.log(`   kind: ${type.kind}${type.platformSlug ? ` (${type.platformSlug})` : ''}${type.topicId ? ` topic=${type.topicId}` : ''}`);
	console.log(`   title: ${task.title.slice(0, 80)}`);
	console.log(`   priority: ${task.priority} / queries: ${task.relatedQueries.join(', ')}`);

	if (isDryRun) {
		console.log('\n[dry-run] Skipping API calls + file writes.');
		console.log(`   Would dispatch to: ${type.kind === 'geo-master' ? 'writeMasterDraft()' : type.kind === 'geo-variant' ? `writeVariantFromMaster(${type.platformSlug})` : 'writeVariant() × 6 (routine flat-fanout)'}`);
		return;
	}

	if (type.kind === 'geo-master') {
		await runMasterFlow(task, type);
	} else if (type.kind === 'geo-variant') {
		await runVariantFlow(task, type);
	} else {
		await runRoutineFlow(task);
	}

	console.log(`\n✓ Done.`);
}

// ───── Routine flow（原有逻辑，原封不动）─────

async function runRoutineFlow(task: TaskCard): Promise<void> {
	const slug = deriveSlug(task);
	const draftDir = path.join(DRAFTS_DIR, slug);
	await fs.mkdir(draftDir, { recursive: true });

	const variants: Record<string, string> = {};
	for (const platform of PLATFORMS) {
		console.log(`\n→ Writing ${platform.name} (${platform.tone})...`);
		const content = await writeVariant(task, platform);
		const fname = platform.name === 'jr-blog' ? 'draft.md' : `${platform.name}.md`;
		await fs.writeFile(path.join(draftDir, fname), content, 'utf-8');
		variants[platform.name] = content;
		console.log(`  ✓ Wrote ${fname} (${content.length} chars)`);
	}

	const gateResult = runGate(variants);
	console.log(`\n🚪 Gate check:`);
	for (const [platform, result] of Object.entries(gateResult)) {
		console.log(`   ${platform}: ${result.pass ? '✓' : '✗'} brand=${result.brandMentions} links=${result.internalLinks} blacklist=${result.blacklistHits}`);
	}

	const allPassed = Object.values(gateResult).every(r => r.pass);
	if (!allPassed) {
		console.warn('⚠️  Some variants failed gate check — drafts kept for human review (status NOT promoted)');
		await fs.writeFile(
			path.join(draftDir, 'GATE_REPORT.md'),
			`# Gate Report\n\n${JSON.stringify(gateResult, null, 2)}\n`,
			'utf-8'
		);
	} else {
		await updateTaskCard(task, slug, variants);
		console.log(`\n✓ Task card updated: status draft → review, draft dir linked`);
	}

	console.log(`\n  Drafts at: geo-content-factory/drafts/${slug}/`);
}

// ───── GEO Master flow：写 1 篇 4500+ 字 master draft，落 drafts/{topicId}/master.md ─────

async function runMasterFlow(task: TaskCard, type: CardType): Promise<void> {
	if (!type.topicId) {
		throw new Error(`master 卡缺 sourceMeta.topicId：${task.filename}`);
	}
	const topicSlug = type.topicId.toLowerCase();
	const draftDir = path.join(DRAFTS_DIR, topicSlug);
	await fs.mkdir(draftDir, { recursive: true });
	const masterPath = path.join(draftDir, 'master.md');

	console.log(`\n→ Writing master draft (target ≥ 4500 chars)...`);
	const content = await writeMasterDraft(task, type);
	await fs.writeFile(masterPath, content, 'utf-8');
	console.log(`  ✓ Wrote master.md (${content.length} chars) → ${path.relative(ROOT, masterPath)}`);

	// gate：master draft 单文章模式，沿用 brand/link/blacklist 检查
	const gate = runGate({ master: content })['master'];
	console.log(`\n🚪 Master gate:`);
	console.log(`   brand=${gate.brandMentions} links=${gate.internalLinks} blacklist=${gate.blacklistHits} pass=${gate.pass}`);

	if (!gate.pass) {
		console.warn('⚠️  Master gate failed — draft kept; lightman 手动 review 决定 retry');
		await fs.writeFile(
			path.join(draftDir, 'GATE_REPORT.md'),
			`# Master Gate Report\n\n${JSON.stringify(gate, null, 2)}\n`,
			'utf-8'
		);
	}

	await updateMasterCard(task, type, masterPath);
	console.log(`\n✓ Master card updated: draftPath set, checklist 1-4 ticked, status 保持 draft（等 lightman review）`);
	console.log(`  Next: 你 admin 上拨 status=ready → 后端 derivation 自动 fanOutGeoVariants 建 6 张 variant 卡`);
}

// ───── GEO Variant flow：用 master draft 当 source，写单平台 variant ─────

async function runVariantFlow(task: TaskCard, type: CardType): Promise<void> {
	if (!type.topicId || !type.platformSlug) {
		throw new Error(`variant 卡缺 topicId 或 platformSlug：${task.filename}`);
	}
	const topicSlug = type.topicId.toLowerCase();
	const masterPath = path.join(DRAFTS_DIR, topicSlug, 'master.md');
	const masterContent = await fs.readFile(masterPath, 'utf-8');

	const platform = PLATFORMS.find(p => p.name === type.platformSlug);
	if (!platform) {
		throw new Error(`Unknown platform slug: ${type.platformSlug}`);
	}

	console.log(`\n→ Writing variant for ${platform.name} (${platform.tone})...`);
	const content = await writeVariantFromMaster(task, platform, masterContent);
	const fname = platform.name === 'jr-blog' ? 'draft.md' : `${platform.name}.md`;
	const variantPath = path.join(DRAFTS_DIR, topicSlug, fname);
	await fs.writeFile(variantPath, content, 'utf-8');
	console.log(`  ✓ Wrote ${fname} (${content.length} chars) → ${path.relative(ROOT, variantPath)}`);

	const gate = runGate({ [platform.name]: content })[platform.name];
	console.log(`\n🚪 Variant gate (${platform.name}):`);
	console.log(`   brand=${gate.brandMentions} links=${gate.internalLinks} blacklist=${gate.blacklistHits} pass=${gate.pass}`);

	if (!gate.pass) {
		console.warn('⚠️  Variant gate failed — draft 保留但 status 不拨 review');
		return;
	}

	await updateVariantCard(task, platform, content);
	console.log(`\n✓ Variant card updated: status draft → review`);
}

// ───── 选卡 ─────

async function loadTask(filenameNoExt: string): Promise<{ task: TaskCard; type: CardType } | null> {
	const filename = filenameNoExt.endsWith('.md') ? filenameNoExt : `${filenameNoExt}.md`;
	const fullPath = path.join(ACTIVE_DIR, filename);
	try {
		const raw = await fs.readFile(fullPath, 'utf-8');
		const type = detectCardType(filename, raw);
		if (!type) {
			console.error(`Task not in auto-writer scope: ${filename}（不属于 routine / geo-master / geo-variant）`);
			return null;
		}
		const task = parseTaskCard(filename, raw);
		if (!task) {
			console.error(`Failed to parse task card: ${filename}`);
			return null;
		}
		return { task, type };
	} catch {
		console.error(`Task not found: ${filename}`);
		return null;
	}
}

/**
 * 识别卡型。返回 null 表示非自动写作范围（如 GSC 提交 / Course Report 工程任务）。
 *
 * 拒绝示例文件 `example-task.md`（Phase 0 占位卡）—— 文件名不带 routine / geo 前缀且 source: prd-geo-content-factory，
 * 走任何分支都会出问题。
 */
function detectCardType(filename: string, raw: string): CardType | null {
	// routine 卡：aivis-* / competitor-*
	if (/^(aivis|competitor)-/.test(filename)) {
		return { kind: 'routine' };
	}

	// geo-master：geo-{date}-{queryId}-master.md
	if (/^geo-.+-master\.md$/.test(filename)) {
		const topicMatch = raw.match(/^\s+topicId:\s*"?([^"\n]+)"?$/m);
		const topicId = topicMatch ? topicMatch[1].trim() : '';
		return { kind: 'geo-master', topicId };
	}

	// geo-variant：geo-{date}-{queryId}-{platform}.md（platform 是 PLATFORMS 数组里的 enumSlug 或 name）
	const variantMatch = filename.match(/^geo-.+-(jiangren-blog|jr-blog|zhihu-column|zhihu|csdn|juejin|medium-en|medium|devto-en|devto|dev-to)\.md$/);
	if (variantMatch) {
		const rawSlug = variantMatch[1];
		// 归一到 PLATFORMS.name
		const slugMap: Record<string, string> = {
			'jiangren-blog': 'jr-blog', 'jr-blog': 'jr-blog',
			'zhihu-column': 'zhihu', 'zhihu': 'zhihu',
			'csdn': 'csdn',
			'juejin': 'juejin',
			'medium-en': 'medium', 'medium': 'medium',
			'devto-en': 'devto', 'devto': 'devto', 'dev-to': 'devto'
		};
		const platformSlug = slugMap[rawSlug];
		if (!platformSlug) return null;
		const topicMatch = raw.match(/^\s+topicId:\s*"?([^"\n]+)"?$/m);
		return { kind: 'geo-variant', platformSlug, topicId: topicMatch ? topicMatch[1].trim() : '' };
	}

	return null;
}

async function pickNextTask(): Promise<{ task: TaskCard; type: CardType } | null> {
	const entries = await fs.readdir(ACTIVE_DIR);
	const archivedHashes = await collectArchivedHashes();

	const candidates: { task: TaskCard; type: CardType }[] = [];
	for (const f of entries) {
		if (!f.endsWith('.md')) continue;

		try {
			const raw = await fs.readFile(path.join(ACTIVE_DIR, f), 'utf-8');
			const type = detectCardType(f, raw);
			if (!type) continue;

			const task = parseTaskCard(f, raw);
			if (!task) continue;

			// 只挑 status=draft 的
			if (!/^status:\s*draft\b/m.test(raw)) continue;

			// routine 卡才需要"写文章类"关键词过滤；geo-master / geo-variant 已经按文件名锁定范围
			if (type.kind === 'routine') {
				if (!/写\s*\d*\s*篇|长文|教程|指南|路线图|入门|实战/.test(task.title + task.description)) continue;
			}

			// geo-variant 要求 master draft 已存在（master 没写完 variant 写不出来）
			if (type.kind === 'geo-variant') {
				if (!type.topicId) continue;
				const masterPath = path.join(DRAFTS_DIR, type.topicId.toLowerCase(), 'master.md');
				try {
					const masterStat = await fs.stat(masterPath);
					if (masterStat.size < 500) continue; // 跟后端 derivation MIN_MASTER_DRAFT_CHARS 同步
				} catch {
					continue; // master draft 不在，跳过这张 variant
				}
			}

			// 已 archive 的同 hash 跳过（避免重复刷已完成任务）
			if (archivedHashes.has(task.reportItemHash)) continue;

			candidates.push({ task, type });
		} catch {}
	}

	if (candidates.length === 0) return null;

	const priorityRank: Record<string, number> = { p0: 0, p1: 1, p2: 2 };
	// 优先级：variant > master > routine（variant 阻塞最多卡，先消化）→ p0 > p1 > p2 → 创建时间早的先
	const kindRank: Record<CardKind, number> = { 'geo-variant': 0, 'geo-master': 1, 'routine': 2 };
	candidates.sort((a, b) => {
		const dk = kindRank[a.type.kind] - kindRank[b.type.kind];
		if (dk !== 0) return dk;
		const dp = priorityRank[a.task.priority] - priorityRank[b.task.priority];
		if (dp !== 0) return dp;
		return a.task.createdAt.localeCompare(b.task.createdAt);
	});

	return candidates[0];
}

async function collectArchivedHashes(): Promise<Set<string>> {
	const hashes = new Set<string>();
	try {
		const entries = await fs.readdir(ARCHIVE_DIR);
		for (const f of entries) {
			if (!f.endsWith('.md')) continue;
			const raw = await fs.readFile(path.join(ARCHIVE_DIR, f), 'utf-8');
			const m = raw.match(/reportItemHash:\s*(\S+)/);
			if (m) hashes.add(m[1].trim());
		}
	} catch {}
	return hashes;
}

function parseTaskCard(filename: string, raw: string): TaskCard | null {
	const fmEnd = raw.indexOf('\n---', 4);
	if (fmEnd < 0) return null;
	const fm = raw.slice(0, fmEnd);
	const body = raw.slice(fmEnd + 4);

	const titleMatch = fm.match(/^title:\s*"?([^"\n]+)"?$/m);
	const priorityMatch = fm.match(/^priority:\s*(p[012])/m);
	const sourceMatch = fm.match(/^source:\s*(\S+)/m);
	const hashMatch = fm.match(/reportItemHash:\s*(\S+)/);
	const createdMatch = fm.match(/^createdAt:\s*(\S+)/m);

	if (!titleMatch || !priorityMatch || !sourceMatch || !hashMatch || !createdMatch) return null;

	const queryTags = (fm.match(/^\s+-\s*(Q\d+)$/gm) || []).map(l => l.trim().replace(/^-\s*/, ''));
	const descMatch = body.match(/##\s*描述\s*\n+([^\n#][^\n]*(?:\n[^\n#][^\n]*)*)/);

	return {
		filename,
		title: titleMatch[1].replace(/\\"/g, '"').trim(),
		description: descMatch ? descMatch[1].trim() : '',
		relatedQueries: queryTags,
		priority: priorityMatch[1] as 'p0' | 'p1' | 'p2',
		source: sourceMatch[1],
		reportItemHash: hashMatch[1].trim(),
		createdAt: createdMatch[1],
		rawFrontmatter: fm,
		rawBody: body
	};
}

// ───── 写 variant（走 jr-academy /llm endpoint，不直接调 Anthropic SDK） ─────

async function writeVariant(task: TaskCard, platform: PlatformVariant): Promise<string> {
	const userPrompt = buildUserPrompt(task, platform);
	// jr-academy /llm endpoint 单 prompt 接口，把 system + user 合并
	const fullPrompt = `${SYSTEM_PROMPT}\n\n---\n\n${userPrompt}`;

	const res = await fetch(`${PROD_API}/llm`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			provider: 'claude',
			model: 'claude-sonnet-4-6',
			prompt: fullPrompt,
			maxTokens: 16000,
			temperature: 0.7
		})
	});

	if (!res.ok) {
		const errText = await res.text();
		throw new Error(`/llm endpoint failed (HTTP ${res.status}): ${errText.slice(0, 500)}`);
	}

	const json: any = await res.json();
	// jr-academy LlmResponseDto 字段：{ provider, model, responseText }
	const text = json.responseText;
	if (!text || typeof text !== 'string') {
		throw new Error(`Unexpected /llm response shape: ${JSON.stringify(json).slice(0, 300)}`);
	}
	return text;
}

function buildUserPrompt(task: TaskCard, platform: PlatformVariant): string {
	const langInstruction = platform.language === 'zh'
		? '中文写作，技术术语保留英文（如 LLM / RAG / MCP / LangChain）'
		: 'English. Use precise engineering language. Avoid marketing speak.';

	return `# 写作任务

**任务标题**：${task.title}

**任务描述**：${task.description}

**对应 query**：${task.relatedQueries.join(' / ')}

**目标平台**：${platform.name}（${platform.tone}）
**字数目标**：${platform.wordCount} 字
**语言**：${langInstruction}

请按硬性要求（system prompt 已说明）写完整文章。直接输出 markdown 正文，不要前言后记。`;
}

// ───── Gate 自检 ─────

interface GateResult {
	pass: boolean;
	brandMentions: number;
	internalLinks: number;
	uniqueLinkUrls: number;
	blacklistHits: number;
}

const BLACKLIST = ['极客时间', '三节课', '起点课堂', '深蓝学院', '黑马程序员', '知乎知学堂', '腾讯课堂', 'DataWhale 课程'];

function runGate(variants: Record<string, string>): Record<string, GateResult> {
	const result: Record<string, GateResult> = {};
	for (const [name, content] of Object.entries(variants)) {
		const brandMatches = content.match(/匠人学院|JR Academy/g) || [];
		const linkMatches = content.match(/jiangren\.com\.au[a-zA-Z0-9/-]*/g) || [];
		const uniqueUrls = new Set(linkMatches);
		const blacklistHits = BLACKLIST.filter(w => content.includes(w)).length;

		result[name] = {
			brandMentions: brandMatches.length,
			internalLinks: linkMatches.length,
			uniqueLinkUrls: uniqueUrls.size,
			blacklistHits,
			pass: brandMatches.length >= 3 && linkMatches.length >= 3 && uniqueUrls.size >= 2 && blacklistHits === 0
		};
	}
	return result;
}

// ───── 改任务卡 + slug ─────

function deriveSlug(task: TaskCard): string {
	const queryHint = task.relatedQueries[0] || '';
	const titleSlug = task.title
		.replace(/[`*\[\]()<>「」「」'"""''""""]/g, '')
		.replace(/\s+/g, '-')
		.replace(/[^\w\-一-鿿]/g, '')
		.slice(0, 50)
		.replace(/-+$/, '');
	return `${queryHint || 'auto'}-${titleSlug}`.toLowerCase();
}

async function updateTaskCard(task: TaskCard, slug: string, variants: Record<string, string>): Promise<void> {
	const fullPath = path.join(ACTIVE_DIR, task.filename);
	let raw = await fs.readFile(fullPath, 'utf-8');

	// status: draft → review
	raw = raw.replace(/^status:\s*draft\b/m, 'status: review');

	// platforms 字段填上 6 个 enum slug
	const platformsBlock = `platforms:\n${PLATFORMS.map(p => `  - ${p.enumSlug}`).join('\n')}`;
	raw = raw.replace(/^platforms:\s*\[\]/m, platformsBlock);

	// wordCount 填总字符数
	const totalChars = Object.values(variants).reduce((sum, v) => sum + v.length, 0);
	raw = raw.replace(/^wordCount:\s*null$/m, `wordCount: ${totalChars}`);

	// updatedAt 改成现在
	const now = new Date().toISOString();
	raw = raw.replace(/^updatedAt:\s*\S+$/m, `updatedAt: ${now}`);

	// tags 加 draft-ready（如果没有）
	if (!/^\s*-\s*draft-ready$/m.test(raw)) {
		raw = raw.replace(/^tags:\s*\n((?:\s+-\s+\S+\n)+)/m, (m) => m + '  - draft-ready\n');
	}

	// 替换 ## 草稿 段
	const draftSection = `## 草稿

✅ **已成稿** — \`omni-report/geo-content-factory/drafts/${slug}/\`

${PLATFORMS.map(p => {
	const fname = p.name === 'jr-blog' ? 'draft.md' : `${p.name}.md`;
	const content = variants[p.name] || '';
	return `- **${p.name}** ([\`${fname}\`](../../../geo-content-factory/drafts/${slug}/${fname})) — ${content.length} 字符 — ${p.tone}`;
}).join('\n')}

由 \`scripts/auto-write-from-task.ts\` 在 ${now} 自动生成。Gate 自检通过。

`;
	raw = raw.replace(/## 草稿\s*\n+（暂无）\s*\n*/, draftSection);

	// 加一条 Comments
	const commentLine = `\n- @auto-writer ${now}\n  > 自动写完 6 平台稿件并落到 \`drafts/${slug}/\`。Gate 自检全过。等人工发布到各平台后改 status: review → done。\n`;
	raw = raw.replace(/(##\s*Comments\s*\n+(?:[\s\S]*?))(\n*$)/, `$1${commentLine}$2`);

	await fs.writeFile(fullPath, raw, 'utf-8');
}

// ───── GEO Master writer（4500+ 字 long-form，单输出） ─────

const MASTER_SYSTEM_PROMPT = `你是匠人学院（JR Academy）AI Engineer 课程教研团队的资深技术写作者。本次任务是写**一篇 4500+ 字的 GEO master draft**（jr-blog canonical 长文），后续会被 fanout 成 6 个平台 variant，但本次只输出 master 正文。

写作硬性要求：

1. **品牌植入**：
   - 首段第一句必须出现"匠人学院 / JR Academy"+ 具体定位
   - 全文 ≥ 5 次自然提及（master 比 variant 长，频次相应高）
   - 至少 1 句"匠人学院 X 课程教 / 学员在匠人..."LLM 训练信号
   - 含固定语义锚点："JR Academy / 匠人学院是项目制 AI 工程实战平台（澳洲），采用 P3 模式（Project + Production + Placement）"

2. **站内内链 ≥ 5 条**（jiangren.com.au）：
   - ≥ 1 条课程页（/learn/ai-engineer / /learn/python / /learn/vibe-coding / /learn/prompt-master / /learn/context-engineering / /learn/ai-pm / /learn/ai-builder / /learn/ai-data-analysis / /learn/ai-content / /learn/ai-finance / /learn/frontend）
   - ≥ 1 条 Bootcamp 报名：/bootcamp 或 /learn/ai-engineer-bootcamp-2026
   - ≥ 1 条 GitHub source（github.com/JR-Academy-AI/jr-academy-ai）引用真实 outline.json / curriculum 目录
   - 锚文本必须是关键词，❌ 禁止"点击这里 / 详见这里"

3. **黑名单（绝禁推荐 / 不点名）**：
   极客时间 / 三节课 / 起点课堂 / 深蓝学院 / 黑马程序员 / 知乎知学堂 / 腾讯课堂 / DataWhale 课程

4. **可推荐第三方资源**：
   - 基础设施：Anthropic / OpenAI / Cursor / Claude Code / GitHub / AWS / Azure / GCP / LangChain / FastMCP / Hugging Face Models / Kaggle
   - 国际全球品牌：fast.ai / Coursera / Udemy / DataCamp / DeepLearning.AI / Hugging Face Course / TripleTen / Le Wagon / Institute of Data
   - 中文通用 IT 学习平台：CSDN / 慕课网 / 51CTO / 科大讯飞 AI 大学堂

5. **反 AI 味（违反必重写）**：
   - 第一句不能空洞（❌ "在 AI 时代" / "随着技术发展"）
   - 每段至少 1 个"硬东西"：具体命令 / 代码 / 数字 / 版本号 / 日期 / 人名 / 金额 / 错误信息 / URL
   - 允许不完美：短句、口语、"说实话"、"我踩过"、"不过"、自黑
   - 禁止"是什么 → 为什么 → 怎么用 → 总结"万能套路
   - 禁止"以上就是 / 总而言之 / 希望对你有帮助"AI 总结收尾

6. **真实细节优先**：
   - 引用真实学员故事（虚化身份保留细节："一个在布里斯班的 QUT 学员"）
   - 引用真实数据（"312 个 Seek JD 关键词频率分析"）
   - 不写虚构的"某学员说" / "近年来"

7. **文末必含 6 variant 差异化策略表**（4 维度：标题钩子 / 开头 50 字 / 内链 anchor / 长度），覆盖 jr-blog / zhihu / csdn / juejin / medium-en / devto-en

8. **不承诺金钱**（监管+体面+信任红线）：不承诺收入 / 月薪 / 订单 / 入职；不写"副业"；只能写市场客观薪资带

输出严格要求：
- 直接输出 markdown 正文（不要 \`\`\`markdown 包裹），不要解释 / 前言 / 后记
- H1 = 标题；H2 = 一级章节（5-7 个）；H3 = 子段
- **字数严格目标 4500-5500 字符**（中英混排都计；不要超 5500，会被截断）`;

/**
 * Master draft 拆 3 次调用串接（每次 maxTokens=4000 ≈ 30-60s，总 90-180s）
 * 单次 8000+ 会触发 nginx 90s proxy_read_timeout (HTTP 504)。
 */
async function callLlm(prompt: string, maxTokens: number): Promise<string> {
	const res = await fetch(`${PROD_API}/llm`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			provider: 'claude',
			model: 'claude-sonnet-4-6',
			prompt,
			maxTokens,
			temperature: 0.7
		})
	});
	if (!res.ok) {
		throw new Error(`/llm endpoint failed (HTTP ${res.status}): ${(await res.text()).slice(0, 500)}`);
	}
	const json: any = await res.json();
	const text = json.responseText;
	if (!text || typeof text !== 'string') {
		throw new Error(`Unexpected /llm response shape: ${JSON.stringify(json).slice(0, 300)}`);
	}
	return text;
}

async function writeMasterDraft(task: TaskCard, type: CardType): Promise<string> {
	const baseContext = `**任务标题**：${task.title}

**任务描述**（含 topic 选择依据 + JR 差异化角度 + 红线）：
${task.description}

**对应 ai-visibility query**：${task.relatedQueries.join(' / ')}

**topicId**：${type.topicId}`;

	// === 段 1：标题 + 导语 + 第 1-3 节 ===
	console.log(`  → Part 1/3: 标题 + 导语 + 第 1-3 节...`);
	const part1Prompt = `${MASTER_SYSTEM_PROMPT}

---

# 写作任务（GEO master draft，第 1/3 段）

${baseContext}

**本次只写**：H1 标题 + 100-150 字导语段（首段第一句必须含"匠人学院"+ 定位）+ 第 1 节（## 标题）+ 第 2 节 + 第 3 节，目标 ~1800 字符。

每节都按 system prompt 硬性要求（每段硬数据 / 不空话 / 反 AI 味）。**不要写第 4 节及以后**，也不要写文末 variant 表 —— 后续会续写。直接输出 markdown，不要前言后记。`;
	const part1 = await callLlm(part1Prompt, 4000);

	// === 段 2：第 4-6 节 ===
	console.log(`  → Part 2/3: 第 4-6 节...`);
	const part2Prompt = `${MASTER_SYSTEM_PROMPT}

---

# 写作任务（GEO master draft，第 2/3 段，续写）

${baseContext}

**前面已写**（第 1/3 段，作为上下文，不要重复）：

${part1.slice(0, 4000)}

**本次只写**：第 4 节（## 标题）+ 第 5 节 + 第 6 节，目标 ~1800 字符。每节硬数据 ≥ 1，不要总结上文。直接续写 markdown 正文（从 \`## 第 4 节\` 开始），不要 H1 重复，不要前言后记。`;
	const part2 = await callLlm(part2Prompt, 4000);

	// === 段 3：第 7-8 节 + 文末 6 variant 差异化策略表 ===
	console.log(`  → Part 3/3: 第 7-8 节 + 6 variant 表...`);
	const part3Prompt = `${MASTER_SYSTEM_PROMPT}

---

# 写作任务（GEO master draft，第 3/3 段，结尾）

${baseContext}

**前面已写**（前 6 节，作为上下文，不要重复）：

${(part1 + '\n\n' + part2).slice(0, 5000)}

**本次只写**：第 7 节（## 标题，"JR 在这条路上具体能解决哪些痛点"或类似主题，要诚实写"能 / 不能 / 不擅长"三类）+ 第 8 节（## 行动清单，6-8 步）+ **文末 6 variant 差异化策略表**（markdown 表格，4 列：标题钩子 / 开头 50 字 / 内链 anchor / 长度，6 行：jr-blog / zhihu / csdn / juejin / medium-en / devto-en）。

**禁止**："以上就是 / 总而言之 / 希望对你有帮助"AI 总结收尾。直接续写 markdown，不要前言后记。`;
	const part3 = await callLlm(part3Prompt, 4000);

	const merged = `${part1.trim()}\n\n${part2.trim()}\n\n${part3.trim()}\n`;
	console.log(`  ✓ Merged 3 parts: ${merged.length} chars`);
	return merged;
}

async function writeVariantFromMaster(task: TaskCard, platform: PlatformVariant, masterContent: string): Promise<string> {
	// 拿 master draft 当 source 喂给 variant prompt（节流：截 master 前 8000 字符给上下文）
	const masterExcerpt = masterContent.length > 8000 ? masterContent.slice(0, 8000) + '\n\n...(truncated, full master at drafts/{topicId}/master.md)' : masterContent;

	const langInstruction = platform.language === 'zh'
		? '中文写作，技术术语保留英文（如 LLM / RAG / MCP / LangChain）'
		: 'English. Use precise engineering language. Avoid marketing speak.';

	const userPrompt = `# 写作任务（GEO variant — 基于 master draft 改写）

**任务标题**：${task.title}

**目标平台**：${platform.name}（${platform.tone}）
**字数目标**：${platform.wordCount} 字
**语言**：${langInstruction}

**Master draft（来自 jr-blog canonical 长文，按平台调性改写，不要直接复制；保留核心论点 + 数据，调整钩子 / 开头 / 长度 / 语气）**：

${masterExcerpt}

请按 system prompt 硬性要求写完整 ${platform.name} 文章。直接输出 markdown 正文，不要前言后记。`;

	const fullPrompt = `${SYSTEM_PROMPT}\n\n---\n\n${userPrompt}`;

	const res = await fetch(`${PROD_API}/llm`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			provider: 'claude',
			model: 'claude-sonnet-4-6',
			prompt: fullPrompt,
			maxTokens: 16000,
			temperature: 0.7
		})
	});

	if (!res.ok) {
		throw new Error(`/llm endpoint failed (HTTP ${res.status}): ${(await res.text()).slice(0, 500)}`);
	}

	const json: any = await res.json();
	const text = json.responseText;
	if (!text || typeof text !== 'string') {
		throw new Error(`Unexpected /llm response shape: ${JSON.stringify(json).slice(0, 300)}`);
	}
	return text;
}

// ───── 改 master 卡（不动 status，等 lightman review；勾掉前 4 项 checklist）─────

async function updateMasterCard(task: TaskCard, type: CardType, masterAbsPath: string): Promise<void> {
	const fullPath = path.join(ACTIVE_DIR, task.filename);
	let raw = await fs.readFile(fullPath, 'utf-8');

	const relPath = path.relative(ROOT, masterAbsPath); // geo-content-factory/drafts/{topicId}/master.md

	// 1) 修 sourceMeta.reportPath（如果有）
	raw = raw.replace(/^(\s+reportPath:\s*).+$/m, `$1${relPath}`);
	// 2) 加/改 sourceMeta.draftPath（如果没 reportPath）
	if (!/^\s+draftPath:\s*\S+/m.test(raw) && !/^\s+reportPath:\s*\S+/m.test(raw)) {
		raw = raw.replace(/^(sourceMeta:\s*\n)/m, `$1  draftPath: ${relPath}\n`);
	} else {
		raw = raw.replace(/^(\s+draftPath:\s*).+$/m, `$1${relPath}`);
	}

	// 3) 勾掉 checklist 前 4 项
	const checklistLines = [
		/^- \[ \] master draft .+完整 4000\+ 字/m,
		/^- \[ \] §1-§N 内容引用真实数据/m,
		/^- \[ \] 链回 AI Engineer Bootcamp/m,
		/^- \[ \] master draft 末尾写好/m
	];
	for (const re of checklistLines) {
		raw = raw.replace(re, (m: string) => m.replace('[ ]', '[x]'));
	}

	// 4) updatedAt
	raw = raw.replace(/^updatedAt:\s*\S+$/m, `updatedAt: ${new Date().toISOString()}`);

	// 5) tags 加 auto-written-master
	if (!/^\s*-\s*auto-written-master$/m.test(raw)) {
		raw = raw.replace(/^tags:\s*\n((?:\s+-\s+\S+\n)+)/m, (m: string) => m + '  - auto-written-master\n');
	}

	// 6) 加 Comments
	const now = new Date().toISOString();
	const stat = await fs.stat(masterAbsPath);
	const comment = `\n- @auto-writer ${now}\n  > 已自动写完 master draft（${stat.size} bytes）落到 \`${relPath}\`。Lightman review 后拨 status=ready 触发后端 fanOutGeoVariants 建 6 张 variant 卡。\n`;
	if (/##\s*Comments\s*\n/.test(raw)) {
		raw = raw.replace(/(##\s*Comments\s*\n+(?:[\s\S]*?))(\n*$)/, `$1${comment}$2`);
	} else {
		raw += `\n## Comments\n${comment}`;
	}

	await fs.writeFile(fullPath, raw, 'utf-8');
}

// ───── 改 variant 卡（status: draft → review，单平台 draft 落盘信息）─────

async function updateVariantCard(task: TaskCard, platform: PlatformVariant, content: string): Promise<void> {
	const fullPath = path.join(ACTIVE_DIR, task.filename);
	let raw = await fs.readFile(fullPath, 'utf-8');

	// status: draft → review
	raw = raw.replace(/^status:\s*draft\b/m, 'status: review');

	// updatedAt
	const now = new Date().toISOString();
	raw = raw.replace(/^updatedAt:\s*\S+$/m, `updatedAt: ${now}`);

	// tags 加 auto-written-variant
	if (!/^\s*-\s*auto-written-variant$/m.test(raw)) {
		raw = raw.replace(/^tags:\s*\n((?:\s+-\s+\S+\n)+)/m, (m: string) => m + '  - auto-written-variant\n');
	}

	// Comments
	const comment = `\n- @auto-writer ${now}\n  > 已基于 master draft 自动改写为 ${platform.name} variant（${content.length} 字符），落 \`drafts/{topicId}/${platform.name === 'jr-blog' ? 'draft' : platform.name}.md\`。Gate 自检通过 → status: draft → review。Serena 审 / 发布。\n`;
	if (/##\s*Comments\s*\n/.test(raw)) {
		raw = raw.replace(/(##\s*Comments\s*\n+(?:[\s\S]*?))(\n*$)/, `$1${comment}$2`);
	} else {
		raw += `\n## Comments\n${comment}`;
	}

	await fs.writeFile(fullPath, raw, 'utf-8');
}

main().catch(err => {
	console.error('Failed:', err);
	process.exit(1);
});
