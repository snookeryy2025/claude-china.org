import Link from 'next/link';
import { DocsSearch } from '@/components/DocsSearch';
import { getDocPages } from '@/lib/doc-pages';

const groups = [
  { key: 'first-steps', section: 'messages', label: '入门', test: (slug) => ['intro', 'get-api-key', 'get-started', 'manage-claude/authentication'].includes(slug), rank: (slug) => ['intro', 'get-api-key', 'get-started', 'manage-claude/authentication'].indexOf(slug) },
  { key: 'building-start', section: 'messages', label: '使用 Claude 构建', test: (slug) => slug === 'build-with-claude/overview' || slug === 'build-with-claude/working-with-messages' },
  { key: 'building-models', section: 'messages', label: '模型能力', test: (slug) => slug.startsWith('build-with-claude/') && /\/(vision|extended-thinking|thinking|effort|fast-mode|citations|structured-outputs|multilingual-support|pdf-support|files)$/.test(slug) },
  { key: 'building-prompts', section: 'messages', label: '提示工程', test: (slug) => slug.startsWith('build-with-claude/prompt-engineering/') },
  { key: 'building-context', section: 'messages', label: '上下文管理', test: (slug) => slug.startsWith('build-with-claude/context-') || slug.startsWith('build-with-claude/compaction') || slug.startsWith('build-with-claude/preserved-thinking/') || slug === 'build-with-claude/prompt-caching' },
  { key: 'building', section: 'messages', label: '消息与功能', test: (slug) => slug.startsWith('build-with-claude/') },
  { key: 'api', section: 'messages', label: 'API 参考', test: (slug) => slug.startsWith('api/') },
  { key: 'tools', section: 'messages', label: '工具使用', test: (slug) => slug.startsWith('agents-and-tools/tool-use/') },
  { key: 'agents', section: 'messages', label: '智能体与 MCP', test: (slug) => slug.startsWith('agents-and-tools/mcp-') || slug.startsWith('agents-and-tools/remote-mcp-') },
  { key: 'managed-agents', section: 'managed', label: '托管智能体', test: (slug) => slug.startsWith('managed-agents/') },
  { key: 'manage', section: 'manage', label: '管理 Claude', test: (slug) => slug.startsWith('manage-claude/') || slug.startsWith('workspaces/') },
  { key: 'models', section: 'resources', label: '模型与定价', test: (slug) => slug.startsWith('about-claude/models/') || slug.startsWith('about-claude/pricing') || slug === 'models/overview' || slug.startsWith('models/') },
  { key: 'cli', section: 'resources', label: 'SDK、CLI 与库', test: (slug) => slug.startsWith('cli-sdks-libraries/') },
  { key: 'skills', section: 'resources', label: 'Agent Skills', test: (slug) => slug.startsWith('agents-and-tools/agent-skills/') },
  { key: 'resources', section: 'resources', label: '资源与发布说明', test: (slug) => (slug.startsWith('about-claude/') && !slug.startsWith('about-claude/models/') && !slug.startsWith('about-claude/pricing')) || slug.startsWith('release-notes/') || slug.startsWith('test-and-evaluate/') },
];

export const topSections = [
  { key: 'messages', label: '消息 API', href: '/docs/intro' },
  { key: 'managed', label: '托管智能体', href: '/docs/managed-agents/overview' },
  { key: 'manage', label: '管理', href: '/docs/manage-claude/admin-api' },
  { key: 'resources', label: '资源', href: '/docs/about-claude/use-case-guides/overview' },
];

export function getDocsSection(slug) {
  if (slug.startsWith('managed-agents/')) return 'managed';
  if (slug.startsWith('manage-claude/') || slug.startsWith('workspaces/')) return 'manage';
  if (slug.startsWith('about-claude/') || slug.startsWith('models/') || slug.startsWith('cli-sdks-libraries/') || slug.startsWith('release-notes/') || slug.startsWith('test-and-evaluate/') || slug.startsWith('agents-and-tools/agent-skills/')) return 'resources';
  return 'messages';
}

export async function DocsSidebar({ activeSlug }) {
  const pages = await getDocPages();
  const section = getDocsSection(activeSlug);
  // A page belongs to the first matching section. The previous independent
  // filters rendered the same page in several sections (for example all
  // Build pages appeared again under “消息与功能”), which is unlike the
  // source documentation's single navigation tree.
  const used = new Set();
  const sectionGroups = groups.filter((group) => group.section === section);
  const buckets = sectionGroups.map((group) => {
    const matched = pages.filter((page) => !used.has(page.slug) && group.test(page.slug));
    matched.forEach((page) => used.add(page.slug));
    if (group.rank) matched.sort((a, b) => group.rank(a.slug) - group.rank(b.slug));
    return { ...group, pages: matched };
  });
  const other = pages.filter((page) => !used.has(page.slug) && getDocsSection(page.slug) === section);
  if (other.length) buckets.push({ key: 'other', label: '更多文档', pages: other });
  return <aside className="docs-sidebar">
    <DocsSearch pages={pages.map(({slug,title,href})=>({slug,title,href}))} />
    <Link className="sidebar-home" href="/docs/home">文档首页</Link>
    <nav className="sidebar-nav">
      {buckets.filter((bucket) => bucket.pages.length).map((bucket) => <section className="sidebar-group" key={bucket.key}>
        <h2>{bucket.label}</h2>
        {bucket.pages.map((page) => <Link key={page.slug} className={page.slug === activeSlug ? 'active' : ''} href={`/docs/${page.slug}`}>{page.title}</Link>)}
      </section>)}
    </nav>
    <div className="sidebar-bottom"><a href="https://platform.claude.com/docs/zh-CN/home">查看官方文档 ↗</a></div>
  </aside>;
}
