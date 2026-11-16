import Link from 'next/link';
import { DocsSearch } from '@/components/DocsSearch';
import { getDocPages } from '@/lib/doc-pages';

const groups = [
  { key: 'first-steps', label: '入门', test: (slug) => ['intro', 'get-api-key', 'get-started', 'manage-claude/authentication'].includes(slug), rank: (slug) => ['intro', 'get-api-key', 'get-started', 'manage-claude/authentication'].indexOf(slug) },
  { key: 'building-start', label: '使用 Claude 构建', test: (slug) => slug === 'build-with-claude/overview' || slug === 'build-with-claude/working-with-messages' },
  { key: 'building-models', label: '模型能力', test: (slug) => slug.startsWith('build-with-claude/') && /\/(vision|extended-thinking|thinking|effort|fast-mode|citations|structured-outputs|multilingual-support|pdf-support|files)$/.test(slug) },
  { key: 'building-prompts', label: '提示工程', test: (slug) => slug.startsWith('build-with-claude/prompt-engineering/') },
  { key: 'building-context', label: '上下文管理', test: (slug) => slug.startsWith('build-with-claude/context-') || slug.startsWith('build-with-claude/compaction') || slug.startsWith('build-with-claude/preserved-thinking/') || slug === 'build-with-claude/prompt-caching' },
  { key: 'building', label: '消息与功能', test: (slug) => slug.startsWith('build-with-claude/') },
  { key: 'skills', label: 'Agent Skills', test: (slug) => slug.startsWith('agents-and-tools/agent-skills/') },
  { key: 'tools', label: '工具使用', test: (slug) => slug.startsWith('agents-and-tools/tool-use/') },
  { key: 'agents', label: '智能体与 MCP', test: (slug) => slug.startsWith('agents-and-tools/') },
  { key: 'managed-agents', label: '托管智能体', test: (slug) => slug.startsWith('managed-agents/') },
  { key: 'api', label: 'API 参考', test: (slug) => slug.startsWith('api/') },
  { key: 'cli', label: 'SDK、CLI 与库', test: (slug) => slug.startsWith('cli-sdks-libraries/') },
  { key: 'manage', label: '管理 Claude', test: (slug) => slug.startsWith('manage-claude/') || slug.startsWith('workspaces/') },
  { key: 'models', label: '模型与定价', test: (slug) => slug.startsWith('about-claude/models/') || slug.startsWith('about-claude/pricing') || slug === 'models/overview' || slug.startsWith('models/') },
  { key: 'resources', label: '资源', test: (slug) => (slug.startsWith('about-claude/') && !slug.startsWith('about-claude/models/') && !slug.startsWith('about-claude/pricing')) || slug.startsWith('release-notes/') || slug.startsWith('test-and-evaluate/') },
];

export async function DocsSidebar({ activeSlug }) {
  const pages = (await getDocPages()).sort((a, b) => a.slug.localeCompare(b.slug, 'zh-CN'));
  const buckets = groups.map((group) => ({ ...group, pages: pages.filter((page) => group.test(page.slug)).sort((a, b) => group.rank ? group.rank(a.slug) - group.rank(b.slug) : a.slug.localeCompare(b.slug, 'zh-CN')) }));
  const used = new Set(buckets.flatMap((bucket) => bucket.pages.map((page) => page.slug)));
  const other = pages.filter((page) => !used.has(page.slug));
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
