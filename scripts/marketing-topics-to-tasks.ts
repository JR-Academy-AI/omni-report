#!/usr/bin/env bun
/**
 * Marketing Topics Routine → Marketing Tasks 集成
 *
 * 读 marketing-topics/{date}.md 最新一份，解析 4 个 actionable section：
 *   - 🎤 推荐线上讲座（pipe table）
 *   - 🤝 推荐线下活动（pipe table）
 *   - 💡 联名机会（bullet list）
 *   - 🌱 长尾常青话题（bullet list）
 *
 * 不处理 🔥 本周外部热点（仅作背景信息，避免噪音）
 *
 * 用法：
 *   bun run scripts/marketing-topics-to-tasks.ts
 *   bun run scripts/marketing-topics-to-tasks.ts marketing-topics/2026-05-04.md
 *
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * ⛔ 已禁用（2026-05-05 by user request）
 *
 * 原因：当前阶段不希望 marketing-topics routine 自动产任务，topic 选定方式
 * 走人工评审 / 其他 pipeline（xhs-content-factory / 未来的 geo-content-factory）。
 * 报告本身仍由 routine 周一+周三跑（marketing-topics/{date}.md 还在产生），
 * 但不再自动转任务卡。
 *
 * 重新启用：把下面的 process.exit(0) 删除即可。
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

console.error('[disabled] marketing-topics-to-tasks 已禁用 — 见文件顶部注释');
process.exit(0);

import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as crypto from 'node:crypto';

const ROOT = path.resolve(import.meta.dir, '..');
const REPORTS_DIR = path.join(ROOT, 'marketing-topics');
const TASKS_DIR = path.join(ROOT, 'marketing-tasks', 'active');

type SectionKind = 'webinar' | 'event-execution' | 'partnership' | 'evergreen';

interface TopicItem {
	kind: SectionKind;
	num: number;
	title: string;
	body: string;
	urgency?: string;
}

const SECTION_HEADINGS: Record<SectionKind, RegExp> = {
	webinar: /^##\s+.*推荐线上讲座/,
	'event-execution': /^##\s+.*推荐线下活动/,
	partnership: /^##\s+.*联名机会/,
	evergreen: /^##\s+.*长尾常青话题/
};

async function main() {
	const reportPath = await pickReportFile();
	if (!reportPath) {
		console.error('No marketing-topics report found.');
		process.exit(1);
	}

	const reportName = path.basename(reportPath, '.md');
	const reportRel = path.relative(ROOT, reportPath);
	console.log(`Reading: ${reportRel}`);

	const raw = await fs.readFile(reportPath, 'utf-8');

	const items: TopicItem[] = [
		...parseTableSection(raw, 'webinar'),
		...parseTableSection(raw, 'event-execution'),
		...parseBulletSection(raw, 'partnership'),
		...parseBulletSection(raw, 'evergreen')
	];

	if (items.length === 0) {
		console.warn('No topic items found.');
		process.exit(0);
	}

	console.log(`Parsed ${items.length} topic items.`);

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
 * 提取一个 H2 section 的所有内容行（不含标题本身）
 */
function extractSection(markdown: string, headingRe: RegExp): string[] {
	const lines = markdown.split('\n');
	const out: string[] = [];
	let inSection = false;
	for (const line of lines) {
		if (headingRe.test(line)) {
			inSection = true;
			continue;
		}
		if (inSection && /^##\s+/.test(line)) break;
		if (inSection) out.push(line);
	}
	return out;
}

/**
 * 解析 pipe table section（讲座/活动）
 * 表头：| # | 标题 | 形式 | ...
 * 取 #1 = num, #2 = 标题, 其余作为 body 拼接
 */
function parseTableSection(markdown: string, kind: 'webinar' | 'event-execution'): TopicItem[] {
	const re = SECTION_HEADINGS[kind];
	const sectionLines = extractSection(markdown, re);
	const items: TopicItem[] = [];

	let headers: string[] = [];

	for (const line of sectionLines) {
		const m = line.match(/^\|\s*(.+)\s*\|$/);
		if (!m) continue;
		const cells = line.split('|').slice(1, -1).map(c => c.trim());
		if (cells.length < 3) continue;
		// 表头分隔行
		if (cells.every(c => /^-+$/.test(c))) continue;

		// 第一个数字行 = 数据行
		const numCell = cells[0];
		if (/^\d+$/.test(numCell)) {
			const num = parseInt(numCell, 10);
			const title = cleanCell(cells[1]);
			const bodyParts: string[] = [];
			if (headers.length >= cells.length) {
				for (let i = 2; i < cells.length; i++) {
					bodyParts.push(`**${headers[i]}**：${cells[i]}`);
				}
			} else {
				for (let i = 2; i < cells.length; i++) {
					bodyParts.push(cells[i]);
				}
			}
			const urgencyCell = cells[cells.length - 1];
			const urgency = /[🔴🟡🟢]|本周|2 周|月内/.test(urgencyCell) ? urgencyCell : undefined;
			items.push({
				kind,
				num,
				title,
				body: bodyParts.join('\n\n'),
				urgency
			});
		} else {
			// 非数字开头视为表头
			headers = cells;
		}
	}
	return items;
}

/**
 * 解析 bullet list section（联名/常青）
 * 行首：- **xxx** — yyy
 */
function parseBulletSection(markdown: string, kind: 'partnership' | 'evergreen'): TopicItem[] {
	const re = SECTION_HEADINGS[kind];
	const sectionLines = extractSection(markdown, re);
	const items: TopicItem[] = [];

	let current: { num: number; title: string; lines: string[] } | null = null;
	let counter = 0;

	const flush = () => {
		if (current) {
			items.push({
				kind,
				num: current.num,
				title: current.title,
				body: current.lines.join('\n').trim()
			});
			current = null;
		}
	};

	for (const line of sectionLines) {
		const m = line.match(/^-\s+\*\*(.+?)\*\*\s*(.*)$/);
		if (m) {
			flush();
			counter++;
			current = { num: counter, title: m[1].trim(), lines: [m[2].trim()] };
		} else if (current && line.trim().length > 0 && !/^-\s+/.test(line)) {
			current.lines.push(line);
		} else if (current && /^-\s+/.test(line)) {
			// 嵌套 bullet 也保留
			current.lines.push(line);
		}
	}
	flush();
	return items;
}

function cleanCell(s: string): string {
	return s.replace(/^\*\*|\*\*$/g, '').trim();
}

function deriveFilename(reportDate: string, item: TopicItem): string {
	const slug = item.title
		.replace(/[`*\[\]()<>"]/g, '')
		.replace(/\s+/g, '-')
		.replace(/[^\w\-一-鿿]/g, '')
		.toLowerCase()
		.slice(0, 40)
		.replace(/-+$/, '');
	const prefix: Record<SectionKind, string> = {
		webinar: 'webinar',
		'event-execution': 'event',
		partnership: 'partnership',
		evergreen: 'evergreen'
	}[item.kind];
	return `topic-${reportDate}-${prefix}-${String(item.num).padStart(2, '0')}-${slug || 'item'}.md`;
}

function renderTaskMd(item: TopicItem, reportDate: string, reportRel: string): string {
	const reportItemHash = crypto
		.createHash('sha1')
		.update(`topics::${reportDate}::${item.kind}::${item.num}::${item.title.slice(0, 60)}`)
		.digest('hex')
		.slice(0, 12);

	// 优先级：urgency 含 "本周"/"🔴" → p0；2 周 / 🟡 → p1；其他 → p2
	let priority = 'p2';
	if (item.urgency) {
		if (/🔴|本周/.test(item.urgency)) priority = 'p0';
		else if (/🟡|2\s*周/.test(item.urgency)) priority = 'p1';
	} else if (item.kind === 'partnership' && item.num === 1) {
		priority = 'p1';
	}

	const categoryMap: Record<SectionKind, string> = {
		webinar: 'campaign',
		'event-execution': 'event-offline',
		partnership: 'partnership',
		evergreen: 'content-topic'
	};

	const moduleMap: Record<SectionKind, string> = {
		webinar: 'ad-hoc-task',
		'event-execution': 'event-execution',
		partnership: 'partnership-negotiate',
		evergreen: 'content-topic'
	};

	const sectionLabelMap: Record<SectionKind, string> = {
		webinar: '推荐线上讲座',
		'event-execution': '推荐线下活动',
		partnership: '联名机会',
		evergreen: '长尾常青话题'
	};

	const title = item.title.slice(0, 100).trim();
	const now = new Date().toISOString();

	const checklistMap: Record<SectionKind, string[]> = {
		webinar: [
			'- [ ] 确认讲师 + 嘉宾档期',
			'- [ ] 准备 Demo + slides + 报名落地页',
			'- [ ] 各渠道预热推广（公众号 / 社群 / LinkedIn）',
			'- [ ] 直播执行 + 录播剪辑',
			'- [ ] 复盘报名转化 + 写到下周内容选题包'
		],
		'event-execution': [
			'- [ ] 确认场地 + 日期 + 报名表单',
			'- [ ] 嘉宾邀请 + 物料准备',
			'- [ ] 推广（小红书 / 微信社群 / Eventbrite）',
			'- [ ] 现场执行 + 拍照拍视频',
			'- [ ] 活动总结发 LinkedIn / 知乎'
		],
		partnership: [
			'- [ ] 确认联系人 + 发起渠道',
			'- [ ] 起草合作提案邮件 / DM',
			'- [ ] 跟进 + 协商条款',
			'- [ ] 签署 / 发布联合内容',
			'- [ ] 复盘 ROI'
		],
		evergreen: [
			'- [ ] 确认内容形式（视频 / 长文 / 图文）',
			'- [ ] 大纲 + 素材调研',
			'- [ ] 撰写 / 制作',
			'- [ ] 多平台发布（B 站 / 知乎 / 小红书）',
			'- [ ] 30 天后回看流量数据 + 二次推广'
		]
	};

	const frontmatter = [
		'---',
		`id: ${'0'.repeat(24)}`,
		`title: ${escapeYamlString(title)}`,
		`category: ${categoryMap[item.kind]}`,
		`module: ${moduleMap[item.kind]}`,
		`source: routine-marketing-topics`,
		`sourceMeta:`,
		`  reportPath: ${escapeYamlString(reportRel)}`,
		`  reportSection: ${sectionLabelMap[item.kind]} #${item.num}`,
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
		`  - marketing-topics`,
		`  - ${item.kind}`,
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
		`**${item.title}**`,
		'',
		item.body,
		'',
		...(item.urgency ? [`**紧迫度**：${item.urgency}`, ''] : []),
		'## Checklist',
		'',
		...checklistMap[item.kind],
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
		`  > 由 \`omni-report/scripts/marketing-topics-to-tasks.ts\` 自动从内容选题包「${sectionLabelMap[item.kind]} #${item.num}」生成。`,
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
