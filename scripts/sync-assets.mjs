import fs from 'node:fs/promises';
import path from 'node:path';

const docsRoot = path.resolve('docs');
const publicRoot = path.resolve('public');
const origin = 'https://platform.claude.com';
const mediaOrigin = 'https://media.platform.claude.com';
const supported = /\.(?:svg|png|jpe?g|gif|webp|avif|mp4|webm|mov|mp3|wav|pdf)(?:\?.*)?$/i;
const assets = new Map();
const docFiles = [];
const codeFence = /(^|\n)(```|~~~)[^\n]*\n[\s\S]*?\n\2[^\n]*(?=\n|$)/g;

function outsideCode(source, transform) {
  let output = '';
  let cursor = 0;
  for (const match of source.matchAll(codeFence)) {
    const start = match.index + match[1].length;
    output += transform(source.slice(cursor, start));
    output += source.slice(start, match.index + match[0].length);
    cursor = match.index + match[0].length;
  }
  return output + transform(source.slice(cursor));
}

async function walk(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(file);
    else if (/^index\.mdx?$/.test(entry.name)) docFiles.push(file);
  }
}
await walk(docsRoot);

for (const file of docFiles) {
  const source = await fs.readFile(file, 'utf8');
  // Collect only rendered markdown images and HTML media sources, never URLs in code examples.
  const refs = [];
  outsideCode(source, (text) => {
    refs.push(...[...text.matchAll(/!\[[^\]]*\]\(([^)\s]+)(?:\s+[^)]*)?\)/g)].map((match) => match[1].replace(/^<|>$/g, '')));
    refs.push(...[...text.matchAll(/<(?:source|img|video|audio)\b[^>]*\b(?:src|poster)=["']([^"']+)["']/gi)].map((match) => match[1]));
    // MDX components (for example <Card image="...">) use image props rather than HTML src.
    refs.push(...[...text.matchAll(/\b(?:image|imageDark|src|poster)=["'](https:\/\/(?:platform\.claude\.com|media\.platform\.claude\.com)\/docs\/[^"']+)["']/gi)].map((match) => match[1]));
    return '';
  });
  for (const reference of refs) {
    if (reference.startsWith('/docs/')) assets.set(reference, reference);
    else if (/^https:\/\/(?:platform\.claude\.com|media\.platform\.claude\.com)\/docs\//i.test(reference) && supported.test(reference)) {
      const pathname = new URL(reference).pathname;
      assets.set(reference, pathname);
    }
  }
}

async function awaitExists(file) { try { await fs.access(file); return true; } catch { return false; } }
const queue = [];
const queuedLocals = new Set();
for (const [source, local] of assets) {
  if (!(await awaitExists(path.join(publicRoot, local.replace(/^\//, '')))) && !queuedLocals.has(local)) {
    const remoteUrl = /^https?:/.test(source) ? source : `${origin}${local}`;
    queue.push([remoteUrl, local]);
    queuedLocals.add(local);
  }
}
const failures = [];
const available = new Set();
let done = 0;
for (const local of assets.values()) {
  if (await awaitExists(path.join(publicRoot, local.replace(/^\//, '')))) available.add(local);
}
async function worker() {
  while (queue.length) {
    const [url, local] = queue.shift();
    try {
      const response = await fetch(url, { headers: { 'user-agent': 'ClaudeDocsMirror/1.0' } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const destination = path.join(publicRoot, local.replace(/^\//, ''));
      await fs.mkdir(path.dirname(destination), { recursive: true });
      await fs.writeFile(destination, new Uint8Array(await response.arrayBuffer()));
      available.add(local);
      done++;
      console.log(`已同步 ${done}/${queue.length + done}: ${local}`);
    } catch (error) { failures.push({ url, message: error.message }); }
  }
}
await Promise.all(Array.from({ length: 6 }, worker));

for (const file of docFiles) {
  let source = await fs.readFile(file, 'utf8');
  // Rewrite actual rendered media references. Code examples are intentionally left untouched.
  const localFor = (url) => new URL(url).pathname;
  const updated = outsideCode(source, (text) => text.replace(/!\[([^\]]*)\]\((https:\/\/(?:platform\.claude\.com|media\.platform\.claude\.com)\/docs\/[^)\s]+)([^)]*)\)/g, (_all, alt, url, tail) => available.has(localFor(url)) ? `![${alt}](${localFor(url)}${tail})` : _all)
      .replace(/(<(?:source|img|video|audio)\b[^>]*\b(?:src|poster)=)["'](https:\/\/(?:platform\.claude\.com|media\.platform\.claude\.com)\/docs\/[^"']+)["']/gi, (_all, before, url) => available.has(localFor(url)) ? `${before}"${localFor(url)}"` : _all)
      .replace(/(\b(?:image|imageDark|src|poster)=)["'](https:\/\/(?:platform\.claude\.com|media\.platform\.claude\.com)\/docs\/[^"']+)["']/gi, (_all, before, url) => available.has(localFor(url)) ? `${before}"${localFor(url)}"` : _all));
  if (updated !== source) await fs.writeFile(file, updated);
}

console.log(`资源引用 ${assets.size} 个，下载 ${done} 个，失败 ${failures.length} 个。`);
for (const failure of failures.slice(0, 25)) console.warn(`${failure.url} — ${failure.message}`);
if (failures.length) process.exitCode = 1;
