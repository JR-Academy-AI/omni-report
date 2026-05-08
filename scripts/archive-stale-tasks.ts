#!/usr/bin/env -S npx tsx
/**
 * archive-stale-tasks.ts
 *
 * 防止 active/ 无限膨胀：
 *  - 14 天没人动且 checklist 没打勾 → 移到 archive/stale-{date}/
 *  - 30 天没人动且 status=draft → 强制 archive
 *  - 已 published（含 publications 数组里第一条 url 非空） → 移到 archive/published/
 *
 * 同时输出回收清单到 stderr，方便人工再 review。
 *
 * 调用：
 *   npx tsx scripts/archive-stale-tasks.ts [--dry-run] [--days N] [--source X]
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const ACTIVE_DIR = path.join(ROOT, 'marketing-tasks', 'active');
const ARCHIVE_DIR = path.join(ROOT, 'marketing-tasks', 'archive');

interface Args { dryRun: boolean; days: number; sourceFilter?: string }

function parseArgs(): Args {
	const a: Args = { dryRun: false, days: 14 };
	for (let i = 2; i < process.argv.length; i++) {
		const arg = process.argv[i];
		if (arg === '--dry-run') a.dryRun = true;
		else if (arg === '--days') a.days = parseInt(process.argv[++i], 10);
		else if (arg === '--source') a.sourceFilter = process.argv[++i];
	}
	return a;
}

interface CardMeta {
	file: string;
	source: string;
	status: string;
	updatedAt: Date | null;
	hasCheckedItems: boolean;
	hasPublishedUrl: boolean;
	staleDays: number;
}

function inspectCard(filePath: string): CardMeta {
	const raw = fs.readFileSync(filePath, 'utf-8');
	const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
	if (!fmMatch) {
		return {
			file: path.basename(filePath), source: 'unknown', status: 'unknown',
			updatedAt: null, hasCheckedItems: false, hasPublishedUrl: false, staleDays: 0
		};
	}
	const fm = fmMatch[1];
	const body = fmMatch[2];

	const get = (key: string) => {
		const m = fm.match(new RegExp(`^${key}:\\s*"?(.*?)"?$`, 'm'));
		return m ? m[1].trim() : '';
	};

	const updatedRaw = get('updatedAt');
	const updatedAt = updatedRaw ? new Date(updatedRaw) : null;
	const staleDays = updatedAt
		? Math.floor((Date.now() - updatedAt.getTime()) / (24 * 3600 * 1000))
		: 999;

	return {
		file: path.basename(filePath),
		source: get('source'),
		status: get('status'),
		updatedAt,
		hasCheckedItems: /\n- \[x\]/.test(body),
		hasPublishedUrl: /publishedUrl:\s*[^\s\n][^\n]*[a-z0-9]/.test(body) ||
		                 /\bpublications:\s*\n\s+- platform:[^\n]*\n\s+url:\s*https?:\/\//.test(body),
		staleDays,
	};
}

function main() {
	const args = parseArgs();

	if (!fs.existsSync(ACTIVE_DIR)) {
		console.error(`No active dir at ${ACTIVE_DIR}, exiting`);
		return;
	}

	const today = new Date().toISOString().slice(0, 10);
	const stalePath = path.join(ARCHIVE_DIR, `stale-${today}`);
	const publishedPath = path.join(ARCHIVE_DIR, 'published');

	const files = fs.readdirSync(ACTIVE_DIR).filter(f => f.endsWith('.md'));
	const moves: { from: string; to: string; reason: string; meta: CardMeta }[] = [];

	for (const f of files) {
		const meta = inspectCard(path.join(ACTIVE_DIR, f));
		if (args.sourceFilter && meta.source !== args.sourceFilter) continue;

		// Rule 1: published → archive/published/
		if (meta.hasPublishedUrl) {
			moves.push({
				from: path.join(ACTIVE_DIR, f),
				to: path.join(publishedPath, f),
				reason: 'has publishedUrl',
				meta,
			});
			continue;
		}

		// Rule 2: stale > N days, status still draft, no checklist progress
		if (meta.staleDays >= args.days && meta.status === 'draft' && !meta.hasCheckedItems) {
			moves.push({
				from: path.join(ACTIVE_DIR, f),
				to: path.join(stalePath, f),
				reason: `stale ${meta.staleDays}d, status=draft, no checklist progress`,
				meta,
			});
			continue;
		}

		// Rule 3: stale > 30 days regardless (force archive)
		if (meta.staleDays >= 30) {
			moves.push({
				from: path.join(ACTIVE_DIR, f),
				to: path.join(stalePath, f),
				reason: `stale ${meta.staleDays}d (>30, force archive)`,
				meta,
			});
		}
	}

	if (moves.length === 0) {
		console.log(`✓ No stale tasks to archive (checked ${files.length}, threshold=${args.days}d).`);
		return;
	}

	console.log(`${args.dryRun ? '[DRY-RUN] Would archive' : 'Archiving'} ${moves.length} stale tasks:`);
	for (const m of moves) {
		console.log(`  ${m.meta.staleDays}d | ${m.meta.source} | ${m.meta.file}`);
		console.log(`     reason: ${m.reason}`);
		if (!args.dryRun) {
			fs.mkdirSync(path.dirname(m.to), { recursive: true });
			fs.renameSync(m.from, m.to);
		}
	}

	// Summary by source
	const bySource: Record<string, number> = {};
	for (const m of moves) bySource[m.meta.source] = (bySource[m.meta.source] || 0) + 1;
	console.log('\nSummary by source:');
	for (const [s, n] of Object.entries(bySource)) console.log(`  ${s}: ${n}`);

	if (!args.dryRun) {
		console.log(`\n→ Move done. Run \`git add marketing-tasks/ && git commit -m "chore: archive ${moves.length} stale tasks"\` to commit.`);
	}
}

main();
