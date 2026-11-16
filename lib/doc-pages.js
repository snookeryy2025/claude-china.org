import fs from 'node:fs/promises';
import path from 'node:path';

async function walk(dir, base = '') {
  let entries;
  try { entries = await fs.readdir(dir, { withFileTypes: true }); } catch { return []; }
  const pages = [];
  for (const entry of entries) {
    if (entry.isDirectory()) pages.push(...await walk(path.join(dir, entry.name), base ? `${base}/${entry.name}` : entry.name));
    else if (/^index\.(md|mdx)$/.test(entry.name)) {
      const source = await fs.readFile(path.join(dir, entry.name), 'utf8');
      const title = source.match(/^title:\s*["']?(.+?)["']?\s*$/m)?.[1] || base.split('/').at(-1) || '文档首页';
      pages.push({ slug: base, title: title.replace(/^['"]|['"]$/g, ''), href: `/docs/${base}` });
    }
  }
  return pages;
}

export function getDocPages() {
  return walk(path.join(process.cwd(), 'docs'));
}
