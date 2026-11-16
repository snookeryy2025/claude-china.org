import fs from 'node:fs/promises';
import path from 'node:path';
import Link from 'next/link';
import matter from 'gray-matter';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import { DocsSidebar, getDocsSection, topSections } from '@/components/DocsSidebar';
import { CopyPage } from '@/components/CopyPage';
import { mdxComponents, RawMdxFallback } from '@/components/Mdx';

const docsDir = path.join(process.cwd(), 'docs');
const toFile = (slug) => path.join(docsDir, ...slug, 'index.mdx');

const navLabel = (slug) => {
  if (slug.startsWith('api/')) return 'API 参考';
  if (slug.startsWith('build-with-claude/')) return '使用 Claude 构建';
  if (slug.startsWith('agents-and-tools/') || slug.startsWith('managed-agents/')) return '智能体与工具';
  if (slug.startsWith('cli-sdks-libraries/')) return 'CLI、SDK 与库';
  if (slug.startsWith('manage-claude/')) return '管理 Claude';
  if (slug.startsWith('about-claude/models/') || slug.startsWith('models/')) return '模型与定价';
  return '入门';
};

const slugify = (text) => text.trim().toLowerCase().replace(/<[^>]+>/g, '').replace(/[`*_~]/g, '').replace(/[^\p{L}\p{N}\u4e00-\u9fff -]/gu, '').replace(/\s+/g, '-');

export async function generateStaticParams() {
  const out = [];
  async function visit(dir, parts = []) {
    let entries;
    try { entries = await fs.readdir(dir, { withFileTypes: true }); } catch { return; }
    if (parts.length > 0 && entries.some((entry) => entry.isFile() && /^index\.(md|mdx)$/.test(entry.name))) out.push({ slug: parts });
    for (const entry of entries) if (entry.isDirectory()) await visit(path.join(dir, entry.name), [...parts, entry.name]);
  }
  await visit(docsDir);
  return out;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const file = toFile(slug);
  try { const { data } = matter(await fs.readFile(file, 'utf8')); return { title: data.title || slug.at(-1) }; } catch { return {}; }
}

export default async function DocPage({ params }) {
  const { slug } = await params;
  let source;
  try { source = await fs.readFile(toFile(slug), 'utf8'); } catch { return <main className="not-found"><h1>文档尚未同步</h1><p>此页面会在运行文档同步后显示。</p><Link href="/">返回文档首页</Link></main>; }
  const { content, data } = matter(source);
  const { content: clean } = matter(content.replace(/^source:\s*.*(?:\r?\n|$)/gm, ''));
  const headings = [...clean.matchAll(/^#{2,3}\s+(.+)$/gm)].map((match) => {
    const text = match[1].replace(/\[(.*?)\]\(.*?\)/g, '$1').replace(/[`*_~]/g, '').trim();
    return { text, id: slugify(text), level: match[0].startsWith('###') ? 3 : 2 };
  });
  let rendered;
  try {
    ({ content: rendered } = await compileMDX({ source: clean, components: mdxComponents, options: { mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] } } }));
  } catch {
    rendered = <RawMdxFallback source={clean} />;
  }
  const title = data.title || slug.at(-1);
  const isHome = slug.join('/') === 'home';
  const activeSection = getDocsSection(slug.join('/'));
  return <div className="docs-layout">
    <div className="site-top-disclaimer" role="note">本站为独立教程与指南网站，仅提供学习参考内容，不提供任何服务，与 Anthropic 官方不存在隶属或关联关系。</div>
    <header className="site-header">
      <Link className="site-brand" href="/"><span className="anthropic-mark">✳</span><span>Claude 中文使用教程</span></Link>
      <nav className="site-nav">{topSections.map((item) => <Link className={activeSection === item.key ? 'selected' : ''} href={item.href} key={item.key}>{item.label}</Link>)}</nav>
      <div className="site-actions"><Link href="/docs/api/overview"><span className="api-glyph">{'{}'}</span> API 参考</Link><span className="action-divider" /><span className="language">简体中文</span><a className="console-link" href="https://platform.claude.com/">▣ 控制台</a><a className="login-link" href="https://platform.claude.com/login">登录</a></div>
    </header>
    <div className="docs-body"><DocsSidebar activeSlug={slug.join('/')} /><main className="article-area">
      <div className={`article-grid${isHome ? ' home-grid' : ''}`}><article className={`prose${isHome ? ' home-prose' : ''}`}>{!isHome && <div className="breadcrumbs"><span>{navLabel(slug.join('/'))}</span><b>›</b><span>{slug.length > 1 ? slug.at(-2) : '入门'}</span></div>}<div className="article-heading-row"><div><h1>{title}</h1>{data.description && <p className="lead">{data.description}</p>}</div>{!isHome && <CopyPage title={title} markdown={clean} />}</div>{rendered}{!isHome && <div className="article-end">文档内容持续同步更新</div>}</article>
        {!isHome && <aside className="toc"><div className="toc-title">本页内容</div>{headings.map((heading) => <a className={heading.level === 3 ? 'toc-child' : ''} href={`#${heading.id}`} key={`${heading.id}-${heading.text}`}>{heading.text}</a>)}</aside>}
      </div>
    </main></div>
  </div>;
}
