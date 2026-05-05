#!/usr/bin/env bun
/**
 * Growth Playbook Routine → Marketing Tasks 集成
 *
 * 读 growth-playbook/{date}.md 最新一份的 ## 玩法 ①-⑤ 5 个 section，
 * 每个玩法 → 1 个 .md 任务到 marketing-tasks/active/
 *
 * 用法：
 *   bun run scripts/growth-playbook-to-tasks.ts
 *   bun run scripts/growth-playbook-to-tasks.ts growth-playbook/2026-05-04.md
 *
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * ⛔ 已禁用（2026-05-05 by user request）
 *
 * 原因：当前阶段不希望 growth-playbook routine 自动产任务。报告本身可继续由
 * routine 跑（growth-playbook/{date}.md），但不再自动转任务卡 — 5 个增长玩法
 * 走人工筛选后再决定要不要做成具体任务。
 *
 * 重新启用：把下面的 process.exit(0) 删除即可。
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

console.error('[disabled] growth-playbook-to-tasks 已禁用 — 见文件顶部注释');
process.exit(0);

import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as crypto from 'node:crypto';

const ROOT = path.resolve(import.meta.dir, '..');
const REPORTS_DIR = path.join(ROOT, 'growth-playbook');
const TASKS_DIR = path.join(ROOT, 'marketing-tasks', 'active');

interface Playbook {
	num: number; // 1..5
	heading: string; // 完整 H2 标题
	title: string;   // **xxx** 部分
	body: string;    // 完整 section 正文（含表格 + 落地步骤）
	thisWeek: boolean; // 「本周做？」字段是否 ✅
}

const NUM_GLYPHS: Record<string, number> = {
	'①': 1, '②': 2, '③': 3, '④': 4, '⑤': 5
};

async function main() {
	const reportPath = await pickReportFile();
	if (!reportPath) {
		console.error('No growth-playbook report found.');
		process.exit(1);
	}

	const reportName = path.basename(reportPath, '.md');
	const reportRel = path.relative(ROOT, reportPath);
	console.log(`Reading: ${reportRel}`);

	const raw = await fs.readFile(reportPath, 'utf-8');
	const items = parsePlaybooks(raw);

	if (items.length === 0) {
		console.warn('No 玩法 sections found.');
		process.exit(0);
	}

	console.log(`Parsed ${items.length} playbooks.`);

	let written = 0;
	let skipped = 0;

	for (const item of items) {
		const filename = deriveFilename(reportName, item);
		const targetPath = path.join(TASKS_DIR, filename);

		try {
			await fs.access(targetPath);
			console.log(`  ⊘ Skip ${filename} (already exists)`);
			skipped++;
			continue;
		} catch {}

		const md = renderTaskMd(item, reportName, reportRel);
		await fs.mkdir(path.dirname(targetPath), { recursive: true });
		await fs.writeFile(targetPath, md, 'utf-8');
		console.log(`  ✓ Wrote ${filename}`);
		written++;
	}

	console.log(`\nDone: written=${written}, skipped=${skipped}, total=${items.length}`);
}

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
		entries = await fs.readdir(REPORTS_DIR);
	} catch {
		return null;
	}
	const mdFiles = entries.filter(e => /^\d{4}-\d{2}-\d{2}\.md$/.test(e));
	if (mdFiles.length === 0) return null;
	mdFiles.sort().reverse();
	return path.join(REPORTS_DIR, mdFiles[0]);
}

/**
 * 解析 ## 玩法 ① **xxx** ... ## 玩法 ②
 * 「这周不推的玩法」section 不解析
 */
function parsePlaybooks(markdown: string): Playbook[] {
	const items: Playbook[] = [];
	const lines = markdown.split('\n');

	let current: { num: number; heading: string; title: string; lines: string[] } | null = null;

	const flush = () => {
		if (current) {
			const body = current.lines.join('\n').trim();
			const thisWeek = /\|\s*\*\*本周做？\*\*\s*\|\s*✅/.test(body);
			items.push({
				num: current.num,
				heading: current.heading,
				title: current.title,
				body,
				thisWeek
			});
			current = null;
		}
	};

	for (const line of lines) {
		const m = line.match(/^##\s+玩法\s+([①②③④⑤])\s*(.*)$/);
		if (m) {
			flush();
			const num = NUM_GLYPHS[m[1]];
			const rest = m[2];
			const titleMatch = rest.match(/\*\*(.+?)\*\*/);
			const title = titleMatch ? titleMatch[1].trim() : rest.split(/[（(]/)[0].trim();
			current = { num, heading: line.replace(/^##\s+/, '').trim(), title, lines: [] };
			continue;
		}
		// 终止符：不再属于玩法 section 的 H2
		if (line.match(/^##\s+/) && current) {
			flush();
			continue;
		}
		if (current) {
			current.lines.push(line);
		}
	}
	flush();

	return items;
}

function deriveFilename(reportDate: string, item: Playbook): string {
	const slug = item.title
		.replace(/[`*\[\]()<>"]/g, '')
		.replace(/\s+/g, '-')
		.replace(/[^\w\-一-鿿]/g, '')
		.toLowerCase()
		.slice(0, 40)
		.replace(/-+$/, '');
	return `growth-${reportDate}-${String(item.num).padStart(2, '0')}-${slug || 'play'}.md`;
}

function renderTaskMd(item: Playbook, reportDate: string, reportRel: string): string {
	const reportItemHash = crypto
		.createHash('sha1')
		.update(`growth::${reportDate}::${item.num}::${item.title.slice(0, 60)}`)
		.digest('hex')
		.slice(0, 12);

	// 优先级：本周推荐 = p0；前 3 条 p1；其余 p2
	const priority = item.thisWeek ? 'p0' : item.num <= 3 ? 'p1' : 'p2';

	// Module 推断（growth = 多平台运营）
	const text = item.body.toLowerCase();
	let module = 'ad-hoc-task';
	if (text.includes('prompt lab') || text.includes('lab')) {
		module = 'campaign-plan';
	} else if (text.includes('hackathon') || text.includes('挑战赛')) {
		module = 'campaign-plan';
	} else if (text.includes('小红书') && text.includes('koc')) {
		module = 'redbook-hot-topic';
	} else if (text.includes('节日') || text.includes('母亲节') || text.includes('父亲节')) {
		module = 'campaign-plan';
	} else if (text.includes('裂变') || text.includes('分享')) {
		module = 'campaign-plan';
	} else if (text.includes('转化') || text.includes('漏斗') || text.includes('funnel')) {
		module = 'campaign-plan';
	}

	const title = item.title.slice(0, 100).trim();
	const now = new Date().toISOString();

	const frontmatter = [
		'---',
		`id: ${'0'.repeat(24)}`,
		`title: ${escapeYamlString(title)}`,
		`category: growth-hack`,
		`module: ${module}`,
		`source: routine-growth-playbook`,
		`sourceMeta:`,
		`  reportPath: ${escapeYamlString(reportRel)}`,
		`  reportSection: 玩法 #${item.num}`,
		`  reportItemHash: ${reportItemHash}`,
		`assignee: hello@jiangren.com.au`,
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
		`  - growth-playbook`,
		...(item.thisWeek ? ['  - this-week'] : []),
		`createdBy: hello@jiangren.com.au`,
		`createdAt: ${now}`,
		`updatedAt: ${now}`,
		`derivedFrom: null`,
		'---',
		''
	].join('\n');

	const body = [
		'## 描述',
		'',
		`**${item.heading}**`,
		'',
		item.body,
		'',
		'## Checklist',
		'',
		'- [ ] 确认本周是否启动 + 分配 owner / 跨部门资源',
		'- [ ] 完成落地步骤 D0-D7（见上文）',
		'- [ ] 验收预估指标（生成量 / 分享量 / 注册转化）',
		'- [ ] 复盘 ROI + 写到下一周 growth-playbook 学习',
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
		`  > 由 \`omni-report/scripts/growth-playbook-to-tasks.ts\` 自动从 growth playbook 玩法 #${item.num} 生成。`,
		''
	].join('\n');

	return frontmatter + body;
}

function escapeYamlString(s: string): string {
	if (/[:#\n'"@`*&|<>%]/.test(s)) {
		return `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
	}
	return s;
}

main().catch(err => {
	console.error('Failed:', err);
	process.exit(1);
});
