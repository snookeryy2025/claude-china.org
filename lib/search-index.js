import fs from 'node:fs/promises';
import path from 'node:path';
import { getDocPages } from './doc-pages';
import mcpServers from './mcp-servers.json';

let index;
export function getSearchIndex() {
  index ||= getDocPages().then(pages => Promise.all(pages.map(async page => {
    const source = await fs.readFile(path.join(process.cwd(), 'docs', page.slug, 'index.mdx'), 'utf8');
    const body = source.replace(/^---[\s\S]*?---/, '').replace(/<[^>]+>/g, ' ').replace(/https?:\/\/[^\s)]+/g, '').replace(/\s+/g, ' ');
    const extra = page.slug === 'agents-and-tools/remote-mcp-servers' ? mcpServers.map(server=>`${server.name} ${server.description}`).join(' ') : '';
    return {...page, text:`${body} ${extra}`.toLowerCase()};
  })));
  return index;
}
