import fs from 'node:fs/promises';
import path from 'node:path';
import Link from 'next/link';
import matter from 'gray-matter';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import remarkDocLiterals from '@/lib/remark-doc-literals';
import { notFound } from 'next/navigation';
import { DocsSidebar } from '@/components/DocsSidebar';
import { SiteHeader } from '@/components/SiteHeader';
import { FeatureSummary } from '@/components/FeatureSummary';
import { getDocPages } from '@/lib/doc-pages';
import { getDocsSection, getNavigation, sectionLabel, topSections, resourceSections } from '@/lib/navigation';
import { CopyPage } from '@/components/CopyPage';
import { mdxComponents } from '@/components/Mdx';
import officialHeadings from '@/lib/official-headings.json';

const docsDir = path.join(process.cwd(), 'docs');
const toFile = (slug) => path.join(docsDir, ...slug, 'index.mdx');

function plainText(node) { return node.value || (node.children || []).map(plainText).join(''); }
function collectHeadings(headings, slug) {
  return () => (tree) => {
    const ids = new Map();
    for (const heading of officialHeadings[slug] || []) {
      const text = heading.localText || heading.text;
      if (!ids.has(text)) ids.set(text, []);
      ids.get(text).push(heading.id);
    }
    function visit(node) {
      if (node.type === 'element' && node.tagName === 'h1') node.tagName = 'h2';
      if (node.type === 'element' && /^h[234]$/.test(node.tagName) && node.properties?.id) {
        const text = plainText(node);
        const officialId = ids.get(text)?.shift();
        node.properties.id = officialId || node.properties.id;
        if (node.tagName !== 'h4' && (officialId || !officialHeadings[slug]?.length)) headings.push({text, id:node.properties.id, level:Number(node.tagName[1])});
      }
      node.children?.forEach(visit);
    }
    visit(tree);
  };
}

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
  try { source = await fs.readFile(toFile(slug), 'utf8'); } catch { notFound(); }
  const { content, data } = matter(source);
  const title = data.title || slug.at(-1);
  // Some upstream exports repeat the frontmatter title as an H1 in the body.
  const clean = content.replace(/^source:\s*.*(?:\r?\n|$)/gm, '').replace(/^\s*# [^\n]+\n/, '');
  const headings = [];
  const { content: rendered } = await compileMDX({ source: clean, components: mdxComponents, options: { mdxOptions: { remarkPlugins: [remarkGfm, remarkDocLiterals], rehypePlugins: [rehypeSlug, collectHeadings(headings, slug.join('/')), [rehypeHighlight, {detect:false, ignoreMissing:true}]] } } });
  const isHome = slug.join('/') === 'home';
  const activeSection = getDocsSection(slug.join('/'));
  const pages = await getDocPages();
  const group = getNavigation(activeSection, pages).find(group=>group.pages.some(page=>page.slug === slug.join('/')));
  return <div className={`docs-layout${isHome ? ' docs-home-layout' : ''}`}>
    <SiteHeader activeSection={activeSection} home={isHome}/>
    {isHome ? <main className="home-main">{rendered}</main> : <div className="docs-body"><DocsSidebar activeSlug={slug.join('/')} /><main className="article-area">
      <div className="article-grid"><article className="prose">
        <div className="breadcrumbs"><Link href={[...topSections, ...resourceSections].find(section=>section.key===activeSection)?.href || '/docs/home'}>{sectionLabel(activeSection)}</Link>{group && <><span aria-hidden="true">›</span><span>{group.label}</span></>}</div>
        <div className="article-heading-row"><h1>{title}</h1><CopyPage title={title} markdown={clean}/></div>
        {data.description && <p className="lead">{data.description}</p>}
        {rendered}<div className="article-end">文档内容持续同步更新</div>
      </article>
      <aside className="toc-rail"><FeatureSummary metadata={data.featureMetadata}/><nav className="toc" aria-label="本页内容">{headings.map(heading=><a className={heading.level===3?'toc-child':''} href={`#${heading.id}`} key={heading.id}>{heading.text}</a>)}</nav></aside>
      </div>
    </main></div>}
  </div>;
}
