import Link from 'next/link';
import { DocsSearch } from './DocsSearch';
import { getDocPages } from '@/lib/doc-pages';
import { getDocsSection, getNavigation, sectionLabel } from '@/lib/navigation';

export { getDocsSection, topSections } from '@/lib/navigation';
export async function DocsSidebar({ activeSlug }) {
  const pages = await getDocPages();
  const section = getDocsSection(activeSlug);
  const groups = getNavigation(section, pages);
  return <aside className="docs-sidebar">
    <DocsSearch pages={pages}/>
    <details className="sidebar-mobile-toggle"><summary>浏览{sectionLabel(section)}文档</summary><nav>{groups.map(group=><section key={group.label}><h2>{group.label}</h2>{group.pages.map(page=><Link key={page.slug} href={page.href} aria-current={activeSlug===page.slug?'page':undefined}>{page.title}</Link>)}</section>)}</nav></details>
    <nav className="sidebar-nav" aria-label={`${sectionLabel(section)}文档导航`}>
      {groups.filter(group => group.pages.length).map(group => <section className="sidebar-group" key={group.label}>
        <h2>{group.label}</h2>{group.pages.map(page => <Link key={page.slug} className={page.slug === activeSlug ? 'active' : ''} aria-current={page.slug === activeSlug?'page':undefined} href={page.href}>{page.title}</Link>)}
      </section>)}
    </nav>
  </aside>;
}
