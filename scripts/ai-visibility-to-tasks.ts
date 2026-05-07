#!/usr/bin/env bun
/**
 * AI Visibility Routine → Marketing Tasks 集成
 *
 * 读 omni-report/ai-visibility/{date}.md 最新一份周报的 §推荐行动清单 table，
 * 把 5 条 actionable items 转成 .md 任务文件写到 marketing-tasks/active/。
 *
 * Watcher 自动同步到 MongoDB（jr-academy 后端的 FilesystemWatcherService 启用时）。
 *
 * 用法：
 *   cd omni-report && bun run scripts/ai-visibility-to-tasks.ts
 *   bun run scripts/ai-visibility-to-tasks.ts ai-visibility/2026-05-04.md  # 指定文件
 *
 * Phase 1 minimal — 仅处理 §推荐行动清单 表格。
 * Phase 2 升级：解析所有 actionable signals（Top 3 关键洞察 / 完全空白 query 等）。
 */

import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as crypto from 'node:crypto';

const ROOT = path.resolve(import.meta.dir, '..');
const AI_VIS_DIR = path.join(ROOT, 'ai-visibility');
const TASKS_DIR = path.join(ROOT, 'marketing-tasks', 'active');

interface ActionRow {
	num: number;
	action: string;
	relatedQueries: string;
	estimatedEffort: string;
	roi: string;
}

async function main() {
	// --backfill: 不生成新卡，只重算 active/aivis-* 现有卡的 reportItemHash 字段
	if (process.argv.includes('--backfill')) {
		await backfillHashes();
		return;
	}

	const reportPath = await pickReportFile();
	if (!reportPath) {
		console.error('No ai-visibility report found.');
		process.exit(1);
	}

	const reportName = path.basename(reportPath, '.md'); // e.g. "2026-05-04"
	const reportRel = path.relative(ROOT, reportPath);
	console.log(`Reading: ${reportRel}`);

	const raw = await fs.readFile(reportPath, 'utf-8');
	const rows = parseActionTable(raw);

	if (rows.length === 0) {
		console.warn('No action rows found in §推荐行动清单');
		process.exit(0);
	}

	console.log(`Parsed ${rows.length} actions.`);

	let written = 0;
	let skipped = 0;

	const existingHashes = await collectExistingHashes(TASKS_DIR);

	for (const row of rows) {
		const filename = deriveFilename(reportName, row);
		const targetPath = path.join(TASKS_DIR, filename);

		// 去重双闸：(1) 同文件名已存在，(2) 同 actionable hash 已存在（跨周报）
		const hash = computeReportItemHash(row);
		const existingByHash = existingHashes.get(hash);
		if (existingByHash) {
			console.log(`  ⊘ Skip ${filename} — same actionable hash already in ${existingByHash}`);
			skipped++;
			continue;
		}
		try {
			await fs.access(targetPath);
			console.log(`  ⊘ Skip ${filename} (filename exists)`);
			skipped++;
			continue;
		} catch {}

		const md = renderTaskMd(row, reportName, reportRel);
		await fs.mkdir(path.dirname(targetPath), { recursive: true });
		await fs.writeFile(targetPath, md, 'utf-8');
		existingHashes.set(hash, filename); // 同次跑也别重复写
		console.log(`  ✓ Wrote ${filename}`);
		written++;
	}

	console.log(`\nDone: written=${written}, skipped=${skipped}, total=${rows.length}`);
	console.log(`\n👉 启动 jr-academy backend (ENABLE_WATCHER=true bun run start) 看 MongoDB 自动同步`);
	console.log(`   或运行: cd ../jr-academy && bun run scripts/marketing-task-reindex.ts`);
}

/**
 * 找最新的 ai-visibility/{date}.md 文件
 * 命令行第一个参数指定时优先用它
 */
async function pickReportFile(): Promise<string | null> {
	const arg = process.argv[2];
	if (arg) {
		const abs = path.isAbsolute(arg) ? arg : path.resolve(ROOT, arg);
		try {
			await fs.access(abs);
			return abs;
		} catch {
			console.error(`File not found: ${abs}`);
			process.exit(1);
		}
	}

	let entries: string[];
	try {
		entries = await fs.readdir(AI_VIS_DIR);
	} catch {
		return null;
	}
	const mdFiles = entries.filter(e => e.endsWith('.md') && /^\d{4}-\d{2}-\d{2}\.md$/.test(e));
	if (mdFiles.length === 0) return null;
	mdFiles.sort().reverse(); // 按文件名（日期）倒序
	return path.join(AI_VIS_DIR, mdFiles[0]);
}

/**
 * 解析 §推荐行动清单 pipe table
 *
 * 表格格式：
 *   | # | 行动 | 解决哪个 query | 预估工作量 | 预估 ROI |
 *   | 1 | ... | ... | ... | ... |
 */
function parseActionTable(markdown: string): ActionRow[] {
	const rows: ActionRow[] = [];
	const lines = markdown.split('\n');

	let inSection = false;

	for (const line of lines) {
		if (line.match(/^##\s+.*推荐行动清单/)) {
			inSection = true;
			continue;
		}
		if (inSection && line.match(/^##\s+/)) {
			break; // 下一个 H2 section，停止
		}
		if (!inSection) continue;

		// 数据行：以 | <number> | 开头
		const m = line.match(/^\|\s*(\d+)\s*\|\s*(.+)$/);
		if (!m) continue;

		const cells = line
			.split('|')
			.slice(1, -1)
			.map(c => c.trim());

		if (cells.length < 5) continue;
		// 跳过表头分隔行 |---|---|---|---|---|
		if (cells.every(c => /^-+$/.test(c))) continue;

		const num = parseInt(cells[0], 10);
		if (isNaN(num)) continue;

		rows.push({
			num,
			action: cells[1],
			relatedQueries: cells[2],
			estimatedEffort: cells[3],
			roi: cells[4]
		});
	}

	return rows;
}

/**
 * 派生文件名：aivis-{date}-{num}-{slug}.md
 */
function deriveFilename(reportDate: string, row: ActionRow): string {
	const slug = row.action
		.replace(/[`*\[\]()<>]/g, '')
		.replace(/\s+/g, '-')
		.replace(/[^\w\-一-鿿]/g, '')
		.toLowerCase()
		.slice(0, 40)
		.replace(/-+$/, '');
	return `aivis-${reportDate}-${String(row.num).padStart(2, '0')}-${slug || 'action'}.md`;
}

/**
 * 渲染单条 actionable item → .md 任务（YAML frontmatter + 5 个固定 body section）
 *
 * 与 jr-academy MarkdownSyncService.serialize() 输出格式严格对齐
 */
/**
 * Hash 不带 reportDate — 同一 actionable 在不同周报里出现也算同一条，避免 dedupe 失效。
 *
 * normalizeAction: 去掉标点 / 空格 / markdown 标记 / 大小写差异，让两期周报对同一条建议
 * 的文字微调（如 "创建/完善" vs "创建 / 完善"、加引号、加 emoji）算出同一 hash。
 *
 * 历史教训: 第一版用 row.action.trim() 精确比对，05-04 跟 05-06 同根任务因文字微调
 * 生成 2 张重复卡，10 张里 5 对同根。
 */
function normalizeAction(action: string): string {
	return action
		.replace(/[`*_#\[\]()<>{}『』「」'"""''.,，。;；:：!！?？、\s ]/g, '')
		.replace(/[—\-\/\\|]/g, '')
		.toLowerCase();
}

function computeReportItemHash(row: ActionRow): string {
	const normalized = normalizeAction(row.action);
	return crypto
		.createHash('sha1')
		.update(`ai-visibility::${normalized}`)
		.digest('hex')
		.slice(0, 12);
}

/**
 * 扫 TASKS_DIR 现有 .md，提取 frontmatter.sourceMeta.reportItemHash → filename 反向索引
 */
async function collectExistingHashes(dir: string): Promise<Map<string, string>> {
	const map = new Map<string, string>();
	let entries: string[];
	try {
		entries = await fs.readdir(dir);
	} catch {
		return map;
	}
	for (const f of entries) {
		if (!f.endsWith('.md')) continue;
		try {
			const raw = await fs.readFile(path.join(dir, f), 'utf-8');
			const m = raw.match(/reportItemHash:\s*(\S+)/);
			if (m) map.set(m[1].trim(), f);
		} catch {}
	}
	return map;
}

function renderTaskMd(row: ActionRow, reportDate: string, reportRel: string): string {
	const reportItemHash = computeReportItemHash(row);

	// 优先级：第 1 条 P0，第 2-3 条 P1，其余 P2
	const priority = row.num === 1 ? 'p0' : row.num <= 3 ? 'p1' : 'p2';

	// Module 推断（简化规则）
	const action = row.action.toLowerCase();
	let module = 'ad-hoc-task';
	if (action.includes('gsc') || action.includes('search console') || action.includes('索引') || action.includes('noindex')) {
		module = 'seo-404-fix';
	} else if (action.includes('meta') || action.includes('title tag') || action.includes('cwv') || action.includes('core web vitals')) {
		module = 'seo-meta-fix';
	} else if (action.includes('csdn')) {
		module = 'geo-csdn';
	} else if (action.includes('知乎')) {
		module = 'geo-zhihu-column';
	} else if (action.includes('公众号') || action.includes('长文')) {
		module = 'weixin-longform';
	} else if (action.includes('博客') || action.includes('blog') || action.includes('文章') || action.includes('教程')) {
		module = 'geo-auto-publish';
	} else if (action.includes('course report') || action.includes('档案') || action.includes('评价')) {
		module = 'partnership-negotiate';
	}

	// 标题：取 action 的第一句（截断）
	const title = row.action.split(/[，。;；\n]/)[0].slice(0, 100).trim();

	// 提取 query IDs（如 Q19、Q3、Q7、Q8、Q10）
	const queryMatches = row.relatedQueries.match(/Q\d+/g) || [];
	const relatedQueries = queryMatches.length > 0 ? queryMatches : [];

	const now = new Date().toISOString();

	const frontmatter = [
		'---',
		`id: ${'0'.repeat(24)}`, // 占位 ObjectId，watcher 同步时后端会生成
		`title: ${escapeYamlString(title)}`,
		`category: ai-visibility-fix`,
		`module: ${module}`,
		`source: routine-ai-visibility`,
		`sourceMeta:`,
		`  reportPath: ${escapeYamlString(reportRel)}`,
		`  reportSection: 推荐行动清单 #${row.num}`,
		`  reportItemHash: ${reportItemHash}`,
		`assignee: TBD-mkt-content`,
		`reviewer: null`,
		`status: draft`,
		`priority: ${priority}`,
		`platforms: []`,
		`wordCount: null`,
		`estimatedHours: null`,
		`actualHours: null`,
		`dueDate: null`,
		`tags:`,
		`  - imported-from-routine`,
		`  - ai-visibility`,
		...relatedQueries.map(q => `  - ${q}`),
		`createdBy: TBD-system`,
		`createdAt: ${now}`,
		`updatedAt: ${now}`,
		`derivedFrom: null`,
		'---',
		''
	].join('\n');

	const body = [
		'## 描述',
		'',
		row.action,
		'',
		`**解决哪个 query**：${row.relatedQueries}`,
		'',
		`**预估工作量**：${row.estimatedEffort}`,
		'',
		`**预估 ROI**：${row.roi}`,
		'',
		'## Checklist',
		'',
		'- [ ] 确认任务范围 + 分配 owner',
		'- [ ] 执行核心动作',
		'- [ ] 验证完成（截图 / URL）',
		'- [ ] 4 周后回看 ai-visibility 周报，确认对应 query 提及率/排名变化',
		'',
		'## 草稿',
		'',
		'（暂无）',
		'',
		'## 发布记录',
		'',
		'（暂无）',
		'',
		'## Comments',
		'',
		`- @system ${now}`,
		`  > 由 \`omni-report/scripts/ai-visibility-to-tasks.ts\` 自动从 ai-visibility 周报第 ${row.num} 条建议生成。`,
		''
	].join('\n');

	return frontmatter + body;
}

function escapeYamlString(s: string): string {
	// 简化的 YAML 字符串转义：含 : 或 ' 或换行时用双引号
	if (/[:#\n'"@`*&|<>%]/.test(s)) {
		return `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
	}
	return s;
}

/**
 * Backfill: 重算 active/aivis-* 现有卡的 reportItemHash 字段，让旧算法（精确比对）
 * 切到新算法（normalized）一致。
 *
 * 流程：
 *   1. 扫 active/aivis-*.md
 *   2. 从 frontmatter 拿到 reportPath + reportSection
 *   3. 回去读 ai-visibility/{date}.md，按 #N 找回 row.action 原文
 *   4. 用新算法算 hash，sed 更新 reportItemHash 字段（保持其他内容不动）
 */
async function backfillHashes() {
	const entries = await fs.readdir(TASKS_DIR);
	const aivisFiles = entries.filter(f => f.startsWith('aivis-') && f.endsWith('.md'));

	console.log(`Backfill: scanning ${aivisFiles.length} aivis-* cards`);

	const reportCache = new Map<string, ActionRow[]>(); // reportPath → rows
	let updated = 0;
	let skipped = 0;
	let failed = 0;

	for (const f of aivisFiles) {
		const filePath = path.join(TASKS_DIR, f);
		const raw = await fs.readFile(filePath, 'utf-8');

		const reportPathMatch = raw.match(/reportPath:\s*(\S+)/);
		const reportSectionMatch = raw.match(/reportSection:\s*推荐行动清单 #(\d+)/);
		const oldHashMatch = raw.match(/reportItemHash:\s*(\S+)/);

		if (!reportPathMatch || !reportSectionMatch || !oldHashMatch) {
			console.warn(`  ⊘ ${f} — missing reportPath/reportSection/reportItemHash, skip`);
			skipped++;
			continue;
		}

		const reportRel = reportPathMatch[1].trim();
		const sectionNum = parseInt(reportSectionMatch[1], 10);
		const oldHash = oldHashMatch[1].trim();

		// 读 + 缓存对应 report 解析结果
		if (!reportCache.has(reportRel)) {
			try {
				const reportAbs = path.resolve(ROOT, reportRel);
				const reportRaw = await fs.readFile(reportAbs, 'utf-8');
				reportCache.set(reportRel, parseActionTable(reportRaw));
			} catch (err: any) {
				console.error(`  ✗ ${f} — cannot read report ${reportRel}: ${err.message}`);
				failed++;
				continue;
			}
		}

		const rows = reportCache.get(reportRel)!;
		const matchingRow = rows.find(r => r.num === sectionNum);
		if (!matchingRow) {
			console.warn(`  ⊘ ${f} — no row #${sectionNum} in ${reportRel}`);
			skipped++;
			continue;
		}

		const newHash = computeReportItemHash(matchingRow);
		if (newHash === oldHash) {
			skipped++;
			continue;
		}

		const updatedContent = raw.replace(
			/reportItemHash:\s*\S+/,
			`reportItemHash: ${newHash}`
		);
		await fs.writeFile(filePath, updatedContent, 'utf-8');
		console.log(`  ✓ ${f} — ${oldHash} → ${newHash}`);
		updated++;
	}

	console.log(`\nBackfill done: updated=${updated}, skipped=${skipped}, failed=${failed}`);
}

main().catch(err => {
	console.error('Failed:', err);
	process.exit(1);
});
