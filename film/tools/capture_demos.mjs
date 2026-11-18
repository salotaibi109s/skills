// Capture REAL screenshots of the demo outputs for the film (no mock-ups).
// Usage: node film/tools/capture_demos.mjs   (from repo root)
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
import { spawn, execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const FILM = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(FILM, 'build', 'captures');
const TMP = path.join(FILM, 'build', 'pages');
mkdirSync(OUT, { recursive: true }); mkdirSync(TMP, { recursive: true });
const D = (p) => path.join(FILM, 'demos', p);
const url = (p) => pathToFileURL(p).href;

// Markdown docs -> styled pages
const docs = [
  ['04_projects_and_skills/hospital-policy-review/SKILL.md', 'skill_md', '~/.claude/skills/hospital-policy-review/SKILL.md'],
  ['04_projects_and_skills/outputs/report_NUR-031_medication_administration.md', 'skill_report2', 'outputs/report_NUR-031.md'],
  ['04_projects_and_skills/outputs/report_IPC-014_hand_hygiene.md', 'skill_report1', 'outputs/report_IPC-014.md'],
  ['04_projects_and_skills/marketing_project/PROJECT_INSTRUCTIONS.md', 'project_md', 'Project instructions'],
  ['05_delegation_folder_review/folder_review_report.md', 'review_md', 'folder_review_report.md'],
  ['06_web_research/market_research_report.md', 'research_md', 'market_research_report.md'],
  ['03_claude_code_orders/REQUIREMENTS.md', 'req_md', 'REQUIREMENTS.md'],
];
for (const [src, name, label] of docs)
  execFileSync('python3', [path.join(FILM, 'tools/md_to_html.py'), D(src), path.join(TMP, name + '.html'), label]);
execFileSync('python3', [path.join(FILM, 'tools/sheet_view.py'), D('01_data_analysis/operations_2026_synthetic.xlsx'), path.join(TMP, 'sheet.html')]);

// Wrap the artifact body in a skeleton for local viewing
import { readFileSync, writeFileSync } from 'node:fs';
writeFileSync(path.join(TMP, 'task_app.html'),
  '<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width">' +
  '<style>body{margin:0;font:14px system-ui}</style></head><body>' + readFileSync(D('02_artifact_task_app/task-app.html'), 'utf8') + '</body></html>');

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 2, colorScheme: 'dark' });
const page = await ctx.newPage();
const shot = async (name, opts = {}) => { await page.waitForTimeout(350); await page.screenshot({ path: path.join(OUT, name + '.png'), ...opts }); console.log('captured', name); };

for (const [, name] of docs) { await page.goto(url(path.join(TMP, name + '.html'))); await page.evaluate(() => document.fonts.ready); await shot(name, { fullPage: true }); }
await page.goto(url(path.join(TMP, 'sheet.html'))); await shot('sheet');
await page.goto(url(D('01_data_analysis/report.html'))); await page.evaluate(() => document.fonts.ready); await shot('analysis_report', { fullPage: true });

// Task app: real interactions
await page.setViewportSize({ width: 1280, height: 860 });
await page.goto(url(path.join(TMP, 'task_app.html'))); await page.waitForLoadState('networkidle');
await page.evaluate(() => { localStorage.clear(); }); await page.reload(); await page.waitForLoadState('networkidle');
await shot('task_01_initial');
await page.fill('#taskTitle', 'تصوير مشهد Artifacts في الفيلم');
await page.selectOption('#taskPri', 'high');
await shot('task_02_typing');
await page.click('.add'); await shot('task_03_added');
await page.locator('li', { hasText: 'تجهيز عرض اجتماع الأحد' }).locator('.check').check(); await shot('task_04_checked');
await page.click('.chip[data-f="high"]'); await shot('task_05_filter_high');
await page.click('.chip[data-f="all"]'); await page.click('#themeBtn'); await shot('task_06_light');
await page.setViewportSize({ width: 420, height: 860 }); await shot('task_07_mobile_light');
await page.click('#themeBtn'); await shot('task_08_mobile_dark');

// Orders system: start the real server and drive it
const srv = spawn('python3', ['-m', 'app.server'], { cwd: D('03_claude_code_orders') });
await new Promise(r => setTimeout(r, 1500));
await page.setViewportSize({ width: 1440, height: 860 });
await page.goto('http://127.0.0.1:8765/'); await shot('orders_01_login');
await page.fill('input[name=username]', 'admin'); await page.fill('input[name=password]', 'demo1234'); await shot('orders_02_login_filled');
await page.click('button'); await page.waitForLoadState('networkidle'); await shot('orders_03_dashboard');
await page.click('a[href="/orders"]'); await shot('orders_04_orders');
// real status change: order #3 (جديد) -> قيد التجهيز
const row = page.locator('tr', { hasText: '#3' }); await row.locator('select').selectOption('قيد التجهيز'); await row.locator('button').click();
await page.waitForLoadState('networkidle'); await shot('orders_05_status_changed');
await page.click('a[href="/customers"]'); await shot('orders_06_customers');
// try a forbidden transition via a crafted POST and capture the server's refusal
const resp = await page.request.post('http://127.0.0.1:8765/orders/status', { form: { id: '2', status: 'ملغي' }, maxRedirects: 0 });
await page.setContent(await resp.text()); await shot('orders_07_forbidden_transition');
srv.kill();
await browser.close();
