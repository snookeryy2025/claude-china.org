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
  return (async () => {
    // The sync manifest follows the source site's navigation order. Keep that
    // order instead of sorting paths alphabetically, which makes the sidebar
    // drift away from the official information architecture.
    try {
      const manifest = JSON.parse(await fs.readFile(path.join(process.cwd(), 'docs', 'index.json'), 'utf8'));
      if (Array.isArray(manifest.pages) && manifest.pages.length) {
        const pages = [];
        for (const relative of manifest.pages) {
          if (!/^.+\/index\.(?:md|mdx)$/.test(relative)) continue;
          const file = path.join(process.cwd(), 'docs', relative);
          try {
            const source = await fs.readFile(file, 'utf8');
            const slug = relative.replace(/\/index\.(?:md|mdx)$/, '');
            const title = source.match(/^title:\s*["']?(.+?)["']?\s*$/m)?.[1] || slug.split('/').at(-1) || '文档首页';
            pages.push({ slug, title: title.replace(/^["']|["']$/g, ''), href: `/docs/${slug}` });
          } catch { /* stale manifest entry; skip it */ }
        }
        if (pages.length) return pages;
      }
    } catch { /* fall back to walking the tree */ }
    return walk(path.join(process.cwd(), 'docs'));
  })();
}
