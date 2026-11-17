import { Children } from 'react';
import Link from 'next/link';
import { DocTabs } from './DocTabs';
import { DocIcon } from './DocIcon';
import { DocsSearch } from './DocsSearch';
import { getDocPages } from '@/lib/doc-pages';
import { resolveDocLink } from '@/lib/doc-links';

export const elements = (children) => Children.toArray(children).filter(child => typeof child !== 'string' || child.trim());
export function DocLink({ href = '', children, ...props }) {
  if (!href) return <a {...props}>{children}</a>;
  href = resolveDocLink(href);
  return href.startsWith('/') ? <Link href={href} {...props}>{children}</Link> : <a href={href} target="_blank" rel="noreferrer" {...props}>{children}</a>;
}
export async function HomeHero({ eyebrow, title, subtitle, children }) {
  const items = elements(children);
  const pages = await getDocPages();
  return <section className="home-hero home-container">
    <div className="home-hero-copy"><div><p className="home-eyebrow">{eyebrow}</p><h1>{title}</h1><p className="home-subtitle">{subtitle}</p></div>
      <DocsSearch pages={pages} className="home-search" />
      <div className="home-quick-links">{items.slice(0, 3)}</div>
    </div>
    <DocTabs labels={['Python', 'TypeScript', 'Go', 'Java', 'Ruby', 'PHP', 'C#', 'cURL', 'CLI']} variant="home-code" copyable>{items.slice(3)}</DocTabs>
  </section>;
}
export const HomeQuickChip = ({ icon, href, children }) => <DocLink className="home-quick-link" href={href}><DocIcon name={icon}/><span>{children}</span></DocLink>;
export const HomeSection = ({ children }) => <section className="home-section home-container">{children}</section>;
export const HomeSectionHeader = ({ label, title, description }) => <header className="home-section-heading"><p className="home-eyebrow">{label}</p><h2>{title}</h2>{description && <p>{description}</p>}</header>;
export const HomePlatformCards = ({ children }) => <div className="home-platform-grid">{children}</div>;
export const HomePlatformCard = ({ title, description, pictogram, children }) => <article className="home-platform-card"><div className="home-platform-art"><img src={`/docs/images/home/${pictogram}.svg`} alt="" width="96" height="96" /></div><div className="home-platform-copy"><h3>{title}</h3><p>{description}</p><div className="home-platform-links">{children}</div></div></article>;
export const HomeCardLink = ({ icon, href, children }) => <DocLink className="home-card-link" href={href}><DocIcon name={icon}/><span>{children}</span></DocLink>;
export const HomePartnerLinks = ({ label, children }) => <div className="home-partners" aria-label={label}>{children}</div>;
export const HomeCloudPartnerLink = ({ href, children }) => <DocLink className="home-partner" href={href}><DocIcon name="cloud"/><span>{children}</span><span aria-hidden="true">↗</span></DocLink>;
export function HomeJourney({ children }) {
  const tabs = elements(children);
  return <DocTabs labels={tabs.map(tab => tab.props.label)} variant="home-journey">{tabs}</DocTabs>;
}
export const HomeJourneyTab = ({ children }) => <div className="home-journey-timeline">{children}</div>;
export const HomeJourneyStep = ({ title, children }) => <section className="home-journey-step"><h3>{title}</h3><div>{children}</div></section>;
export const HomeJourneyLink = ({ icon, href, children }) => <DocLink className="home-journey-link" href={href}><DocIcon name={icon}/><span>{children}</span><span aria-hidden="true">↗</span></DocLink>;
const modelArt = { fable: ['head', '#7fa6e2'], opus: ['cursor', '#e49b7e'], sonnet: ['bubble', '#eeece5'], haiku: ['bird', '#bfd1c9'] };
export function ModelCard({ name, href, family, tags = [], description, badge = '新' }) {
  if (typeof tags === 'string') { try { tags = JSON.parse(tags); } catch { tags = []; } }
  const [image, color] = modelArt[family] || modelArt.opus;
  return <DocLink className="model-card" href={href}><div className="model-art" style={{backgroundColor:color}}><img src={`/docs/images/home/${image}.svg`} alt="" width="56" height="56"/></div><div className="model-copy"><h3>{name}{badge && <span className="model-badge">{badge}</span>}</h3><div className="model-tags">{tags.map(tag => <span key={tag}>{tag}</span>)}</div><p>{description}</p></div></DocLink>;
}
export const ModelCards = ({children}) => <div className="model-grid">{children}</div>;
