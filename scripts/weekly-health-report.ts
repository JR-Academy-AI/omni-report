#!/usr/bin/env -S npx tsx
/**
 * weekly-health-report.ts
 *
 * 每周一跑一次，落盘 marketing-tasks/_health/YYYY-MM-DD.md：
 *  - 上周新增 / 完成 / 积压
 *  - 按 source 分布
 *  - "stuck" 卡（>14 天没动且 status=draft）
 *  - draft 文件存在性 / draftPath 配错统计
 *
 * 调用：npx tsx scripts/weekly-health-report.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const ACTIVE_DIR = path.join(ROOT, 'marketing-tasks', 'active');
const ARCHIVE_DIR = path.join(ROOT, 'marketing-tasks', 'archive');
const HEALTH_DIR = path.join(ROOT, 'marketing-tasks', '_health');

interface CardSummary {
	file: string;
	source: string;
	status: string;
	priority: string;
	assignee: string;
	updatedAt: Date | null;
	createdAt: Date | null;
	hasCheckedItems: boolean;
	reportPath: string;
	draftExists: boolean;
}

function inspectCard(filePath: string): CardSummary {
	const raw = fs.readFileSync(filePath, 'utf-8');
	const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
	const fm = fmMatch?.[1] || '';
	const body = fmMatch?.[2] || '';

	const get = (k: string) => {
		const m = fm.match(new RegExp(`^${k}:\\s*"?(.*?)"?$`, 'm'));
		return m ? m[1].trim() : '';
	};
	const getNested = (k: string) => {
		const m = fm.match(new RegExp(`^\\s+${k}:\\s*"?(.*?)"?$`, 'm'));
		return m ? m[1].trim() : '';
	};

	const updatedRaw = get('updatedAt');
	const createdRaw = get('createdAt');
	const reportPath = getNested('reportPath') || getNested('draftPath');

	let draftExists = false;
	if (reportPath) {
		try {
			fs.accessSync(path.join(ROOT, reportPath));
			draftExists = true;
		} catch { /* missing */ }
	}

	return {
		file: path.basename(filePath),
		source: get('source'),
		status: get('status'),
		priority: get('priority'),
		assignee: get('assignee'),
		updatedAt: updatedRaw ? new Date(updatedRaw) : null,
		createdAt: createdRaw ? new Date(createdRaw) : null,
		hasCheckedItems: /\n- \[x\]/.test(body),
		reportPath,
		draftExists,
	};
}

function staleDays(d: Date | null): number {
	if (!d) return 999;
	return Math.floor((Date.now() - d.getTime()) / (24 * 3600 * 1000));
}

function gitLogLastWeek(): { added: string[]; modified: string[] } {
	try {
		const since = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString().slice(0, 10);
		const out = execSync(
			`git log --since="${since}" --name-status --pretty=format: -- marketing-tasks/active/`,
			{ cwd: ROOT, encoding: 'utf-8' }
		);
		const added: string[] = [];
		const modified: string[] = [];
		for (const line of out.split('\n')) {
			const m = line.match(/^([AM])\s+(.+)$/);
			if (!m) continue;
			const [, op, file] = m;
			if (op === 'A') added.push(file);
			else modified.push(file);
		}
		return { added: [...new Set(added)], modified: [...new Set(modified)] };
	} catch {
		return { added: [], modified: [] };
	}
}

function archivedLastWeek(): number {
	if (!fs.existsSync(ARCHIVE_DIR)) return 0;
	try {
		const since = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString().slice(0, 10);
		const out = execSync(
			`git log --since="${since}" --diff-filter=R --pretty=format: --name-only -- marketing-tasks/archive/`,
			{ cwd: ROOT, encoding: 'utf-8' }
		);
		return out.split('\n').filter(l => l.endsWith('.md')).length;
	} catch {
		return 0;
	}
}

function main() {
	if (!fs.existsSync(ACTIVE_DIR)) {
		console.error('No active dir');
		return;
	}

	const today = new Date().toISOString().slice(0, 10);
	const files = fs.readdirSync(ACTIVE_DIR).filter(f => f.endsWith('.md'));
	const cards = files.map(f => inspectCard(path.join(ACTIVE_DIR, f)));

	const bySource: Record<string, CardSummary[]> = {};
	for (const c of cards) (bySource[c.source] ||= []).push(c);

	const stuck = cards.filter(c => staleDays(c.updatedAt) >= 14 && c.status === 'draft' && !c.hasCheckedItems);
	const missingDrafts = cards.filter(c => c.reportPath && !c.draftExists);
	const noProgress = cards.filter(c => !c.hasCheckedItems && c.status === 'draft');

	const lastWeek = gitLogLastWeek();
	const archived = archivedLastWeek();

	const lines: string[] = [];
	lines.push(`# Marketing Tasks Health Report — ${today}`);
	lines.push('');
	lines.push(`**Active 总数**: ${cards.length}`);
	lines.push(`**上周新增**: ${lastWeek.added.length}`);
	lines.push(`**上周改动**: ${lastWeek.modified.length}`);
	lines.push(`**上周归档**: ${archived}`);
	lines.push('');
	lines.push('## 按 source 分布');
	lines.push('');
	lines.push('| Source | 数量 | 至少打勾 | 全部 stuck (>14d) |');
	lines.push('|---|---:|---:|---:|');
	for (const [src, list] of Object.entries(bySource)) {
		const checked = list.filter(c => c.hasCheckedItems).length;
		const sourceStuck = list.filter(c => staleDays(c.updatedAt) >= 14 && c.status === 'draft' && !c.hasCheckedItems).length;
		lines.push(`| ${src} | ${list.length} | ${checked} | ${sourceStuck} |`);
	}
	lines.push('');

	lines.push('## 🚨 Stuck 卡（>14 天没动 + status=draft + 无 checklist 进展）');
	lines.push('');
	if (stuck.length === 0) lines.push('（无）');
	else {
		for (const c of stuck.slice(0, 30)) {
			lines.push(`- [${staleDays(c.updatedAt)}d] **${c.assignee || 'TBD'}** | ${c.priority} | ${c.file}`);
		}
		if (stuck.length > 30) lines.push(`...（共 ${stuck.length} 张，截断显示前 30）`);
	}
	lines.push('');

	lines.push('## ⚠️ reportPath 写了但文件不存在');
	lines.push('');
	if (missingDrafts.length === 0) lines.push('（无）');
	else {
		for (const c of missingDrafts) {
			lines.push(`- ${c.file} → \`${c.reportPath}\`（不存在）`);
		}
	}
	lines.push('');

	lines.push('## 按 assignee 积压 Top 5');
	lines.push('');
	const byAssignee: Record<string, number> = {};
	for (const c of cards) byAssignee[c.assignee || 'TBD'] = (byAssignee[c.assignee || 'TBD'] || 0) + 1;
	const top5 = Object.entries(byAssignee).sort((a, b) => b[1] - a[1]).slice(0, 5);
	lines.push('| Assignee | 总卡数 |');
	lines.push('|---|---:|');
	for (const [a, n] of top5) lines.push(`| ${a} | ${n} |`);
	lines.push('');

	lines.push('## 建议动作');
	lines.push('');
	if (stuck.length > 30) {
		lines.push(`- 🚨 ${stuck.length} 张 stuck → 跑 \`npx tsx scripts/archive-stale-tasks.ts\` 归档老卡`);
	}
	if (cards.length > 100) {
		lines.push(`- ⚠️ active 已 ${cards.length} 张，建议暂停 routine 生成 1 周`);
	}
	if (missingDrafts.length > 0) {
		lines.push(`- ⚠️ ${missingDrafts.length} 张 reportPath 失效 → 跑 daily-writer 重起草 / 修路径`);
	}
	if (lines[lines.length - 1] === '') lines.push('（一切平稳）');

	if (!fs.existsSync(HEALTH_DIR)) fs.mkdirSync(HEALTH_DIR, { recursive: true });
	const outPath = path.join(HEALTH_DIR, `${today}.md`);
	fs.writeFileSync(outPath, lines.join('\n'), 'utf-8');
	console.log(`✓ Wrote health report: ${path.relative(ROOT, outPath)}`);
	console.log(`  active=${cards.length} stuck=${stuck.length} missingDrafts=${missingDrafts.length}`);
}

main();
