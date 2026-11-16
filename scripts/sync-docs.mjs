import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const origin = 'https://platform.claude.com';
const docsRoot = path.resolve('docs');
const stagingRoot = path.resolve('.docs-sync-staging');
const indexCandidates = [`${origin}/docs/sitemap.xml`, `${origin}/docs/zh-CN/llms.txt`, `${origin}/llms.txt`];

async function getText(url) {
  const response = await fetch(url, { headers: { 'user-agent': 'ClaudeDocsMirror/1.0' } });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.text();
}

let indexText;
let indexUrl;
let pages = [];
for (const url of indexCandidates) {
  try {
    const candidate = await getText(url);
    const targets = [...candidate.matchAll(/https:\/\/platform\.claude\.com\/docs\/zh-CN\/[A-Za-z0-9_\-/]+/g)].map(([pageUrl]) => `${pageUrl}.md`);
    const markdownTargets = [...candidate.matchAll(/https:\/\/platform\.claude\.com\/docs\/(?:en|zh-CN)\/[^\s)]+?\.md/g)].map(([pageUrl]) => pageUrl);
    const candidatePages = [...new Set((targets.length ? targets : markdownTargets.map((pageUrl) => pageUrl.replace('/docs/en/', '/docs/zh-CN/'))))];
    if (!candidatePages.length) throw new Error('索引内容不包含 Markdown 页面');
    indexText = candidate;
    indexUrl = url;
    pages = candidatePages;
    break;
  } catch (error) {
    console.warn(`索引不可用：${error.message}`);
  }
}
if (!pages.length) throw new Error('无法读取官方文档索引，请检查网络后重试。');

await fs.mkdir(stagingRoot, { recursive: true });

const queue = [...pages];
const completed = [];
const failures = [];
const concurrency = 8;
async function worker() {
  while (queue.length) {
    const url = queue.shift();
    try {
      const markdown = await getText(url);
      const relative = new URL(url).pathname.replace('/docs/zh-CN/', '').replace(/\.md$/, '/index.mdx');
      const destination = path.join(stagingRoot, relative);
      const normalized = markdown
        .replace(/^source:\s*.*(?:\r?\n|$)/gm, '')
        .replaceAll('https://platform.claude.com/docs/zh-CN/', '/docs/')
        .replace(/(\/docs\/[\w\-/]+)\.md(?=[)#])/g, '$1');
      await fs.mkdir(path.dirname(destination), { recursive: true });
      await fs.writeFile(destination, normalized);
      completed.push(relative);
      if (completed.length % 25 === 0) console.log(`已同步 ${completed.length}/${pages.length}`);
    } catch (error) { failures.push({ url, message: error.message }); }
  }
}
await Promise.all(Array.from({ length: concurrency }, worker));
await fs.writeFile(path.join(stagingRoot, 'index.json'), JSON.stringify({ language: 'zh-CN', pages: completed.sort(), updatedAt: new Date().toISOString() }, null, 2) + '\n');
console.log(`完成：${completed.length} 页成功，${failures.length} 页未能获取。`);
if (failures.length) {
  console.warn('未同步页面示例：');
  for (const failure of failures.slice(0, 20)) console.warn(`${failure.url} — ${failure.message}`);
}
if (!completed.length || failures.length) {
  process.exitCode = 1;
} else {
  // Only replace the live docs tree after every page has downloaded successfully.
  const keep = new Set([...completed, 'index.json']);
  async function removeStale(dir, parts = []) {
    let entries;
    try { entries = await fs.readdir(dir, { withFileTypes: true }); } catch { return; }
    for (const entry of entries) {
      const relative = [...parts, entry.name].join('/');
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) await removeStale(fullPath, [...parts, entry.name]);
      else if ((entry.name === 'index.mdx' || entry.name === 'index.md' || entry.name === 'index.json') && !keep.has(relative)) await fs.rm(fullPath);
    }
  }
  await removeStale(docsRoot);
  async function copyStaged(dir, parts = []) {
    let entries;
    try { entries = await fs.readdir(dir, { withFileTypes: true }); } catch { return; }
    for (const entry of entries) {
      const relativeParts = [...parts, entry.name];
      const source = path.join(dir, entry.name);
      const destination = path.join(docsRoot, ...relativeParts);
      if (entry.isDirectory()) { await fs.mkdir(destination, { recursive: true }); await copyStaged(source, relativeParts); }
      else { await fs.mkdir(path.dirname(destination), { recursive: true }); await fs.copyFile(source, destination); }
    }
  }
  await copyStaged(stagingRoot);
}
