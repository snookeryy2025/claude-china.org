import { existsSync } from 'node:fs';
import path from 'node:path';
import aliases from './doc-link-aliases.json';

export function resolveDocLink(href = '') {
  let normalized = href.replace(/^https:\/\/platform\.claude\.com\/docs\/(?:en|zh-CN)\//, '/docs/').replace(/^\/docs\/(?:en|zh-CN)\//, '/docs/');
  normalized = aliases[normalized] || normalized;
  if (!normalized.startsWith('/docs/')) return normalized;
  const slug = normalized.slice(6).split(/[?#]/)[0].replace(/\.md$/, '').replace(/\/$/, '');
  if (!slug || existsSync(path.join(process.cwd(), 'docs', slug, 'index.mdx'))) return normalized.replace(/\.md(?=[?#]|$)/, '');
  // The API reference has additional generated routes not exported as Markdown.
  return `https://platform.claude.com/docs/zh-CN/${normalized.slice(6)}`;
}
