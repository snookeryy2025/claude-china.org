import Link from 'next/link';
import { CodeBlock } from '@/components/CodeBlock';

const passthrough = ({
  children,
  // MDX-only props must not leak onto the rendered DOM element. `components`
  // is the runtime component map and is not serializable as a DOM prop.
  components: _components,
  continues: _continues,
  continued: _continued,
  last: _last,
  noDeepLinks: _noDeepLinks,
  stepNumber: _stepNumber,
  ...props
}) => <div {...props}>{children}</div>;
const card = ({ title, href, children }) => <article className="mdx-card"><h3>{href ? <a href={href}>{title}</a> : title}</h3><div>{children}</div></article>;
const homeHref = (href = '') => href.startsWith('/') ? href : href;
const HomeLink = ({ href = '', children, className = '', ...props }) => href.startsWith('/')
  ? <Link className={className} href={homeHref(href)} {...props}>{children}</Link>
  : <a className={className} href={href} target="_blank" rel="noreferrer" {...props}>{children}</a>;
const homePage = ({ children }) => <div className="mdx-home">{children}</div>;
const homeHero = ({ eyebrow, title, subtitle, children }) => <section className="mdx-home-hero">
  <div className="mdx-home-hero-copy"><p className="mdx-home-eyebrow">{eyebrow}</p><h1>{title}</h1><p className="mdx-home-subtitle">{subtitle}</p></div>
  <div className="mdx-home-hero-body">{children}</div>
</section>;
const homeQuickChip = ({ icon, href, children }) => <HomeLink className="mdx-home-chip" href={href}><span className="mdx-home-icon" aria-hidden="true">{icon === 'Key' ? '⌁' : icon === 'CodeBrackets' ? '{}' : '→'}</span>{children}<span aria-hidden="true">↗</span></HomeLink>;
const homeSection = ({ last: _last, children }) => <section className="mdx-home-section">{children}</section>;
const homeSectionHeader = ({ label, title, description }) => <header className="mdx-home-section-header"><p>{label}</p><h2>{title}</h2>{description && <span>{description}</span>}</header>;
const homePlatformCards = ({ children }) => <div className="mdx-home-platform-grid">{children}</div>;
const homePlatformCard = ({ title, description, pictogram, children }) => <article className="mdx-home-platform-card"><div className="mdx-home-pictogram" aria-hidden="true">{pictogram === 'clouds' ? '☁' : '⌘'}</div><h3>{title}</h3><p>{description}</p><div className="mdx-home-card-links">{children}</div></article>;
const homeCardLink = ({ icon: _icon, href, children }) => <HomeLink className="mdx-home-card-link" href={href}><span>{children}</span><span aria-hidden="true">↗</span></HomeLink>;
const homePartnerLinks = ({ label, children }) => <div className="mdx-home-partners"><span>{label}</span><div>{children}</div></div>;
const homeCloudPartnerLink = ({ icon: _icon, href, children }) => <HomeLink className="mdx-home-partner" href={href}>{children}<span aria-hidden="true">↗</span></HomeLink>;
const homeJourney = ({ children }) => <div className="mdx-home-journey">{children}</div>;
const homeJourneyTab = ({ label, children }) => <section className="mdx-home-journey-tab"><h3>{label}</h3><div>{children}</div></section>;
const homeJourneyStep = ({ title, children }) => <article className="mdx-home-journey-step"><h4>{title}</h4>{children}</article>;
const homeJourneyLink = ({ icon: _icon, href, children }) => <HomeLink className="mdx-home-journey-link" href={href}><span>{children}</span><span aria-hidden="true">↗</span></HomeLink>;
const baseComponents = {
  a: ({ href = '', children, ...props }) => href.startsWith('/') ? <Link href={href} {...props}>{children}</Link> : <a href={href} target="_blank" rel="noreferrer" {...props}>{children}</a>,
  pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
  blockquote: ({ children }) => <aside className="callout">{children}</aside>,
  table: ({ children }) => <div className="table-wrap"><table>{children}</table></div>,
  Accordion: passthrough, AccordionGroup: passthrough, Badge: passthrough,
  Card: card, CardGroup: ({ children }) => <div className="mdx-card-grid">{children}</div>,
  CodeGroup: ({ children }) => <div className="mdx-code-group">{children}</div>, CodeGroupItem: passthrough,
  HomePage: homePage, HomeHero: homeHero, HomeQuickChip: homeQuickChip, HomeSection: homeSection,
  HomeSectionHeader: homeSectionHeader, HomePlatformCards: homePlatformCards, HomePlatformCard: homePlatformCard,
  HomeCardLink: homeCardLink, HomePartnerLinks: homePartnerLinks, HomeCloudPartnerLink: homeCloudPartnerLink,
  HomeJourney: homeJourney, HomeJourneyTab: homeJourneyTab, HomeJourneyStep: homeJourneyStep, HomeJourneyLink: homeJourneyLink,
  Frame: passthrough, Info: ({ children }) => <aside className="callout info">{children}</aside>,
  Note: ({ children }) => <aside className="callout">{children}</aside>, Steps: passthrough,
  Step: ({ title, children }) => <section className="mdx-step"><h3>{title}</h3>{children}</section>,
  Tab: ({ title, label, children }) => <section className="mdx-tab"><h4>{title || label}</h4>{children}</section>,
  Tabs: ({ children }) => <div className="mdx-tabs">{children}</div>,
  Tip: ({ children }) => <aside className="callout tip">{children}</aside>,
  Warning: ({ children }) => <aside className="callout warning">{children}</aside>,
};

for (const name of ["Steps","Step","Tabs","Tab","Card","CardGroup","CodeGroup","SessionListPageResponse","Note","CodeGroupItem","File","Warning","MessageParam","String","EOF","Info","Tip","YAML","Response","Tool","Dictionary","MCPCallToolResultLike","JSON","Long","InputStream","Accordion","Frame","FileExplorer","REDACTED","Message","AccordionGroup","BetaMessageParam","Tweet","IEmbeddingGenerator","Faq","Article","Double","Inquiry","PROMPT","PatientQuery","Turn","List","EvalItem","Check","RawMessageStreamEvent","Throwable","T","BatchListPageAsync","StopReason","HomeQuickChip","MessageBatchIndividualResponse","TextBlockParam","REGION","KEY_ARN","COMPARTMENT_UUID","AWS_ACCOUNT_ID","KEY_ID","BetaMessage","ContentBlockParam","WORKSPACE_ID","ORGANIZATION_UUID","BetaRawMessageStreamEvent","MessageContentBlockSourceContent","ToolOutcome","ToolUseBlock","Record","Task","HashMap","In","Out","Callable","BetaContentBlockParam","TextBlock","AnthropicBeta","ToolUnion","BetaTextBlock","ToolResultBlockParam","ContactInfo","Book","BookList","Output","FamousNumber","JsonElement","LineItem","Invoice","Classification","APIError","APIResponse","MCPServersTable","BetaRequestMcpServerUrlDefinition","BetaToolUnion","BetaMcpToolListingBlock","McpBetaTool","Badge","BetaMessageContentParam","Boolean","Numerical","CategoryDefinition","Explanation","BatchAssessment","JsonNode","ContentBlock","UserMessageParam","BetaToolUseBlock","BetaTextBlockParam","Block","BetaToolResultBlockParamContent","APP_ID","IDENTITY_CLIENT_ID","TENANT_ID","RESOURCE_GROUP","CLUSTER_NAME","LOCATION","BetaInputTransformation","Map","HomePage","HomeHero","HomeSection","HomeSectionHeader","HomePlatformCards","HomePlatformCard","HomeCardLink","HomePartnerLinks","HomeCloudPartnerLink","HomeJourney","HomeJourneyTab","HomeJourneyStep","HomeJourneyLink","Action","JsonValue","Integer","BetaContentBlock","BetaBrowserToolsetOptions","BetaBrowserNavigateResult","BetaScreenshotResult","BetaComputerCursorPositionResult"]) { if (!baseComponents[name]) baseComponents[name] = passthrough; }

export const mdxComponents = new Proxy(baseComponents, { get(target, key) {
  if (key in target) return target[key];
  // The MDX runtime reads `components` as its component-map context. Returning
  // the fallback here turns that internal lookup into <div components={...}>,
  // which both leaks functions across the RSC boundary and emits invalid DOM.
  if (typeof key === 'symbol' || key === 'components') return undefined;
  return passthrough;
} });

export function RawMdxFallback({ source }) {
  return <pre className="raw-mdx-fallback">{source}</pre>;
}
