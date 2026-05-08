#!/usr/bin/env bun
/**
 * geo-card-master-create — V2 GEO Content Factory L2.master 建卡
 *
 * 读 geo-content-factory/{date}-week-plan.md（geo-topic-picker 的产物）→
 * 把每个 M{i} topic 转成 1 张 master .md 卡 →
 * 写到 marketing-tasks/active/geo-{today}-{queryId-slug}-master.md。
 *
 * watcher 看到新 .md → 写 MongoDB → admin UI 自动看见。
 *
 * 用法：
 *   bun run scripts/geo-card-master-create.ts                                  # 用最新 week-plan
 *   bun run scripts/geo-card-master-create.ts geo-content-factory/2026-05-04-week-plan.md
 *   bun run scripts/geo-card-master-create.ts --dry                            # 不落盘
 *
 * 下游：员工写完 master draft（落盘到 sourceMeta.reportPath）→ admin 把卡 status 拨到 READY
 *       → 后端 derivation service 看到 master + status=ready 触发 geo-fanout 建 N 张 variant 卡。
 */

import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as crypto from 'node:crypto';

const ROOT = path.resolve(import.meta.dir, '..');
const PLAN_DIR = path.join(ROOT, 'geo-content-factory');
const ACTIVE_TASKS_DIR = path.join(ROOT, 'marketing-tasks', 'active');

interface PlanTopic {
	queryId: string;
	queryText: string;
	citedPlatforms: string[];
	otherLlmPlatforms: string[];
	directReason: string;
	suggestedAction: string;
	variantsPlanned: string[];
}

interface PlanFile {
	reportName: string; // 2026-05-04
	reportRel: string; // ai-visibility/2026-05-04.md
	planRel: string; // geo-content-factory/2026-05-04-week-plan.md
	topics: PlanTopic[];
}

async function main() {
	const args = parseArgs(process.argv.slice(2));
	const planPath = await pickPlan(args.input);
	if (!planPath) {
		console.error('No week-plan found. Run geo-topic-picker.ts first.');
		process.exit(1);
	}

	const planRel = path.relative(ROOT, planPath);
	console.log(`Reading: ${planRel}`);
	const plan = parsePlan(await fs.readFile(planPath, 'utf-8'), planPath);

	if (plan.topics.length === 0) {
		console.warn('Plan has 0 topics; nothing to create.');
		process.exit(0);
	}

	const today = todayAEST();
	let written = 0;
	let skipped = 0;

	for (const topic of plan.topics) {
		const slug = deriveSlug(topic.queryText, topic.queryId);
		const qLower = topic.queryId.toLowerCase();
		const filename =
			slug === qLower
				? `geo-${today}-${qLower}-master.md`
				: `geo-${today}-${qLower}-${slug}-master.md`;
		const targetPath = path.join(ACTIVE_TASKS_DIR, filename);

		// 去重：同 queryId 的 master 卡已存在则跳过
		if (await fileExists(targetPath)) {
			console.log(`  ⊘ Skip ${filename} (already exists)`);
			skipped++;
			continue;
		}
		const collidingByQuery = await findExistingMasterByQuery(topic.queryId);
		if (collidingByQuery) {
			console.log(`  ⊘ Skip ${filename} (Q${topic.queryId} already claimed by ${collidingByQuery})`);
			skipped++;
			continue;
		}

		const md = renderMasterMd(topic, slug, plan, today);

		if (args.dry) {
			console.log(`\n--- DRY RUN: ${filename} ---\n`);
			console.log(md);
			continue;
		}

		await fs.mkdir(path.dirname(targetPath), { recursive: true });
		await fs.writeFile(targetPath, md, 'utf-8');
		console.log(`  ✓ Wrote ${filename}`);
		written++;
	}

	if (!args.dry) {
		console.log(`\nDone: written=${written}, skipped=${skipped}, total=${plan.topics.length}`);
		console.log('\nNext: 员工/AI 写 master draft → admin 把 master 卡 status 拨到 READY → backend 触发 fanout');
	}
}

function parseArgs(argv: string[]): { input?: string; dry: boolean } {
	let input: string | undefined;
	let dry = false;
	for (const a of argv) {
		if (a === '--dry') dry = true;
		else if (!a.startsWith('--')) input = a;
	}
	return { input, dry };
}

async function pickPlan(input?: string): Promise<string | null> {
	if (input) {
		const abs = path.isAbsolute(input) ? input : path.resolve(ROOT, input);
		await fs.access(abs).catch(() => {
			console.error(`File not found: ${abs}`);
			process.exit(1);
		});
		return abs;
	}
	let entries: string[];
	try {
		entries = await fs.readdir(PLAN_DIR);
	} catch {
		return null;
	}
	const mds = entries.filter(e => /^\d{4}-\d{2}-\d{2}-week-plan\.md$/.test(e));
	if (mds.length === 0) return null;
	mds.sort().reverse();
	return path.join(PLAN_DIR, mds[0]);
}

function parsePlan(raw: string, planPath: string): PlanFile {
	const planRel = path.relative(ROOT, planPath);
	const sourceMatch = raw.match(/Source:\s*`([^`]+)`/);
	const reportRel = sourceMatch ? sourceMatch[1] : '';
	const reportName = path.basename(reportRel, '.md') || path.basename(planPath, '-week-plan.md');

	const topics: PlanTopic[] = [];
	const lines = raw.split('\n');
	let cur: Partial<PlanTopic> | null = null;
	let collectingVariants = false;

	const flush = () => {
		if (cur && cur.queryId && cur.queryText) {
			topics.push({
				queryId: cur.queryId,
				queryText: cur.queryText,
				citedPlatforms: cur.citedPlatforms || [],
				otherLlmPlatforms: cur.otherLlmPlatforms || [],
				directReason: cur.directReason || '',
				suggestedAction: cur.suggestedAction || '',
				variantsPlanned: cur.variantsPlanned || []
			});
		}
		cur = null;
		collectingVariants = false;
	};

	for (const line of lines) {
		const headerMatch = line.match(/^##\s+M\d+:\s*\[(Q\d+)\]\s*(.+?)\s*$/);
		if (headerMatch) {
			flush();
			cur = {
				queryId: headerMatch[1],
				queryText: headerMatch[2],
				citedPlatforms: [],
				otherLlmPlatforms: [],
				variantsPlanned: []
			};
			continue;
		}
		if (!cur) continue;

		const fieldMatch = line.match(/^-\s+\*\*(.+?)\*\*:\s*(.+)$/);
		if (fieldMatch) {
			const key = fieldMatch[1];
			const val = fieldMatch[2];
			if (/AI 当前引用平台/.test(key)) {
				cur.citedPlatforms = splitInline(val);
			} else if (/LLM 自答推荐其他平台/.test(key)) {
				cur.otherLlmPlatforms = splitInline(val);
			} else if (/未提及直接原因/.test(key)) {
				cur.directReason = val.trim();
			} else if (/报告建议行动/.test(key)) {
				cur.suggestedAction = val.trim();
			}
			continue;
		}

		if (/^\*\*variantsPlanned\*\*/.test(line)) {
			collectingVariants = true;
			continue;
		}
		if (collectingVariants) {
			const v = line.match(/^-\s+([a-z0-9-]+)/i);
			if (v) {
				cur.variantsPlanned!.push(v[1].toLowerCase());
			} else if (line.trim() === '' && (cur.variantsPlanned!.length > 0)) {
				collectingVariants = false;
			}
		}
	}
	flush();

	return { reportName, reportRel, planRel, topics };
}

function splitInline(s: string): string[] {
	return s
		.replace(/\*\*/g, '')
		.split(/、|，|,|\s+\/\s+|\s+\+\s+/)
		.map(t => t.trim())
		.filter(t => t.length > 0 && t !== '—' && t !== '-');
}

function todayAEST(): string {
	return new Intl.DateTimeFormat('en-CA', {
		timeZone: 'Australia/Sydney',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	}).format(new Date());
}

function deriveSlug(queryText: string, queryId: string): string {
	// 只取 ASCII，保跨平台 / URL 友好；中文 query 退化用 queryId 小写
	const ascii = queryText
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
	if (ascii.length < 3) return queryId.toLowerCase();
	return ascii.slice(0, 30);
}

async function fileExists(p: string): Promise<boolean> {
	try {
		await fs.access(p);
		return true;
	} catch {
		return false;
	}
}

async function findExistingMasterByQuery(queryId: string): Promise<string | null> {
	let entries: string[];
	try {
		entries = await fs.readdir(ACTIVE_TASKS_DIR);
	} catch {
		return null;
	}
	for (const f of entries) {
		if (!/^geo-.*-master\.md$/.test(f)) continue;
		try {
			const raw = await fs.readFile(path.join(ACTIVE_TASKS_DIR, f), 'utf-8');
			if (new RegExp(`aiVisibilityQuery:\\s*${queryId}\\b`).test(raw)) return f;
		} catch {}
	}
	return null;
}

function renderMasterMd(topic: PlanTopic, slug: string, plan: PlanFile, today: string): string {
	const reportItemHash = crypto
		.createHash('sha1')
		.update(`geo-master::${plan.reportName}::${topic.queryId}::${topic.queryText}`)
		.digest('hex')
		.slice(0, 12);

	const dueDate = addDays(today, 7);
	const title = deriveTitle(topic);
	// 路径去重：当 slug 已经等于 queryId（短 ASCII fallback 场景），不要再拼一次造成 q9-q9 双重前缀
	const qLower = topic.queryId.toLowerCase();
	const dirSlug = slug === qLower ? qLower : `${qLower}-${slug}`;
	const draftPath = `geo-content-factory/drafts/${dirSlug}/master.md`;

	// frontmatter（手写 YAML 跟现有 dogfood master 卡风格一致）
	const fm: string[] = [
		'---',
		`id: ${'0'.repeat(24)}`,
		`title: ${yamlString(title)}`,
		`category: geo-content`,
		`module: geo-master`,
		`source: prd-geo-content-factory`,
		`sourceMeta:`,
		`  reportPath: ${draftPath}`,
		`  reportSection: ${yamlString(`ai-visibility ${plan.reportName} §JR 完全空白 ${topic.queryId}`)}`,
		`  reportItemHash: ${reportItemHash}`,
		`  topicId: ${slug === qLower ? topic.queryId : `${topic.queryId}-${slug}`}`,
		`  aiVisibilityQuery: ${topic.queryId}`,
		`  aiVisibilityReport: ${plan.reportRel}`,
		`  aiCitedPlatforms:`,
		...topic.citedPlatforms.map(p => `    - ${yamlString(p)}`),
		...(topic.otherLlmPlatforms.length > 0
			? [
					`  otherLlmPlatforms:`,
					...topic.otherLlmPlatforms.map(p => `    - ${yamlString(p)}`)
				]
			: []),
		`  variantsPlanned:`,
		...topic.variantsPlanned.map(p => `    - ${p}`),
		`  variantsCount: ${topic.variantsPlanned.length}`,
		`  variantsCardIds: []`,
		`assignee: TBD-mkt-content`,
		`reviewer: TBD-founder`,
		`status: draft`,
		`priority: p0`,
		`platforms: []`,
		`wordCount: 4000`,
		`estimatedHours: 8`,
		`actualHours: null`,
		`dueDate: ${dueDate}`,
		`tags:`,
		`  - geo-content-factory`,
		`  - geo-master`,
		`  - topic-${topic.queryId.toLowerCase()}`,
		`  - query-${topic.queryId.toLowerCase()}`,
		`createdBy: TBD-system`,
		`createdAt: ${new Date().toISOString()}`,
		`updatedAt: ${new Date().toISOString()}`,
		`derivedFrom: null`,
		'---',
		''
	];

	const body: string[] = [
		'## 描述',
		'',
		`**GEO Content Factory v2 — master 卡**（topic 总览，不直接发布）`,
		'',
		`**topic 选择依据**（基于 ai-visibility 真实数据）：`,
		`- 报告：${plan.reportRel} §"JR 完全空白的 Query"`,
		`- query：${topic.queryId} "${topic.queryText}"`,
		`- JR 当前在该 query：完全空白（Web SERP 0 / LLM 自答 0 提及）`,
		`- AI 当前引用平台：${topic.citedPlatforms.join(' / ') || '—'}`,
		...(topic.otherLlmPlatforms.length > 0
			? [`- LLM 推荐其他平台：${topic.otherLlmPlatforms.join(' / ')}`]
			: []),
		`- 未提及直接原因：${topic.directReason}`,
		`- 报告建议行动：${topic.suggestedAction}`,
		'',
		`**JR 差异化角度**：澳洲 AI Engineer 视角 + 链回 AI Engineer Bootcamp + PBL 项目（具体由写 master draft 时定）。`,
		'',
		`**核心红线**：`,
		`- ❌ 不编造 API / 不假装实测过未跑过的代码`,
		`- ❌ 不直翻官方文档（每个代码块/配置必须真跑过 + 注明真实命令）`,
		`- ❌ 不写空话（每段必有具体数字 / 命令 / URL / 安全提醒）`,
		`- ✅ master draft ≥ 4000 字 + 6 variant 4 维度差异化策略表`,
		'',
		`**master 卡职责（不发布）**：`,
		`- 写完整 master draft，落盘到 \`${draftPath}\``,
		`- 决定 ${topic.variantsPlanned.length} 个 variant 的差异化策略（标题钩子 / 开头 50 字 / 内链 anchor / 长度）`,
		`- ⚠ **拨 READY 前先把 assignee 改给真实负责人** — 一文一人全负责，fan-out 时所有 ${topic.variantsPlanned.length} 张 variant 卡都会跟随 master assignee 锁给同一个人。默认 \`TBD-mkt-content\` 只是占位（emailToUserId 看到 TBD-* 直接 return null = 无主），admin 必须从 staff-roster.md 选一个真实员工 email 指派。`,
		`- master review 通过 → status: draft → READY 触发 geo-fanout`,
		'',
		'## Checklist',
		'',
		`- [ ] master draft ${draftPath} 完整 4000+ 字`,
		`- [ ] §1-§N 内容引用真实数据 / 命令 / 配置（不编造）`,
		`- [ ] 链回 AI Engineer Bootcamp + PBL 段落`,
		`- [ ] master draft 末尾写好 ${topic.variantsPlanned.length} variant 4 维度差异化策略表`,
		`- [ ] **lightman review master draft**（重点看技术细节是否准确 + 课程链回是否切题）`,
		`- [ ] **assignee 改给真实负责人**（必须从 staff-roster.md 选一个，不能停在 TBD-mkt-content）`,
		`- [ ] master review pass → status: draft → READY`,
		`- [ ] geo-fanout 自动建 ${topic.variantsPlanned.length} 张 variant 卡（assignee 跟随 master，整组锁给同一个人）`,
		'',
		'## 草稿',
		'',
		`master draft 落盘到：\`${draftPath}\``,
		'',
		`（master 卡只索引 draft 路径，正文写在那边——admin UI 「📂 工作目录文件」面板会直接渲染）`,
		'',
		'## 变体计划（fan-out 触发后填）',
		'',
		`| platform | variant 卡 _id | status | 差异化要点 | 长度 |`,
		`|---|---|---|---|---|`,
		...topic.variantsPlanned.map(p => `| ${p} | _待 fan-out_ | _pending_ | _写 master 时填_ | _写 master 时填_ |`),
		'',
		'## 发布记录',
		'',
		'（master 不发布；每个 variant 卡各自记录发布 URL）',
		'',
		'## 验证记录',
		'',
		'发布 +7 天 / +30 天后 geo-7d-llm-recheck 跑该 query 写回这里：',
		'',
		`| 时点 | LLM 自答提 JR 否 | Web SERP JR 排名 | 备注 |`,
		`|---|---|---|---|`,
		`| 基线 (${plan.reportName}) | ❌ 未提及 | 未出现 | 报告原始数据 |`,
		`| 7d 后 | _待跑_ | _待跑_ | — |`,
		`| 30d 后 | _待跑_ | _待跑_ | — |`,
		'',
		'## Comments',
		'',
		`- @system ${new Date().toISOString()}`,
		`  > 由 \`omni-report/scripts/geo-card-master-create.ts\` 从周计划 \`${plan.planRel}\` 自动生成。`,
		`  > 数据源：${plan.reportRel} §"JR 完全空白的 Query" ${topic.queryId}。`,
		''
	];

	return [...fm, ...body].join('\n');
}

function deriveTitle(topic: PlanTopic): string {
	let t = topic.suggestedAction
		.replace(/^(立即\s*)?(写|发布|创建)\s*[1一]?\s*篇?\s*/, '')
		.trim();
	// 引号替换为空格再去重，避免吞掉中英文之间的间隔
	t = t.replace(/[「」""'']/g, ' ').replace(/\s+/g, ' ').trim();
	if (t.length === 0) t = topic.queryText;
	return `[${topic.queryId} master] ${t.slice(0, 80)}`;
}

function addDays(yyyymmdd: string, days: number): string {
	const d = new Date(`${yyyymmdd}T00:00:00+10:00`);
	d.setDate(d.getDate() + days);
	return new Intl.DateTimeFormat('en-CA', {
		timeZone: 'Australia/Sydney',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	}).format(d);
}

function yamlString(s: string): string {
	if (/[:#\n'"@`*&|<>%\[\]{}?,]/.test(s)) {
		return `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
	}
	return s;
}

main().catch(err => {
	console.error('Failed:', err);
	process.exit(1);
});
