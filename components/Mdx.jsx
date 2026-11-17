import { CodeBlock } from '@/components/CodeBlock';

import { DocTabs } from './DocTabs';
import { DocIcon } from './DocIcon';
import * as Home from './Home';
import { McpServers } from './McpServers';

const passthrough = ({ children, id, className }) => <div id={id} className={className}>{children}</div>;
const card = ({ title, href, icon, children, id }) => <article className="mdx-card" id={id}>{href ? <Home.DocLink className="mdx-card-target" href={href}>{icon && <DocIcon name={icon}/>}<h3>{title}</h3><div>{children}</div></Home.DocLink> : <div className="mdx-card-target">{icon && <DocIcon name={icon}/>}<h3>{title}</h3><div>{children}</div></div>}</article>;
const getLabel = (child, i) => child.props?.title || child.props?.label || child.props?.filename || child.props?.children?.props?.className?.match(/\blanguage-([^\s]+)/)?.[1] || `示例 ${i + 1}`;
function tabs({ children }) {
  const items = Home.elements(children);
  return <DocTabs labels={items.map(getLabel)}>{items}</DocTabs>;
}
const accordion = ({title, children, defaultOpen, id}) => <details className="mdx-accordion" id={id} open={defaultOpen === true || defaultOpen === 'true' || undefined}><summary>{title}</summary><div>{children}</div></details>;
const baseComponents = {
  a: Home.DocLink,
  pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
  blockquote: ({ children }) => <aside className="callout">{children}</aside>,
  table: ({ children }) => <div className="table-wrap"><table>{children}</table></div>,
  Accordion: accordion, AccordionGroup: ({children}) => <div className="mdx-accordions">{children}</div>, Badge: ({children}) => <span className="mdx-badge">{children}</span>,
  Card: card, CardGroup: ({ children, cols = 2 }) => <div className="mdx-card-grid" style={{'--card-cols': cols}}>{children}</div>,
  CodeGroup: tabs, CodeGroupItem: passthrough,
  HomePage: ({children}) => <div className="docs-home">{children}</div>,
  HomeHero: Home.HomeHero, HomeQuickChip: Home.HomeQuickChip, HomeSection: Home.HomeSection,
  HomeSectionHeader: Home.HomeSectionHeader, HomePlatformCards: Home.HomePlatformCards, HomePlatformCard: Home.HomePlatformCard,
  HomeCardLink: Home.HomeCardLink, HomePartnerLinks: Home.HomePartnerLinks, HomeCloudPartnerLink: Home.HomeCloudPartnerLink,
  HomeJourney: Home.HomeJourney, HomeJourneyTab: Home.HomeJourneyTab, HomeJourneyStep: Home.HomeJourneyStep, HomeJourneyLink: Home.HomeJourneyLink,
  ModelCards: Home.ModelCards, ModelCard: Home.ModelCard,
  Frame: ({children, caption}) => <figure className="mdx-frame">{children}{caption && <figcaption>{caption}</figcaption>}</figure>, Info: ({ children }) => <aside className="callout info">{children}</aside>,
  Note: ({ children }) => <aside className="callout">{children}</aside>, Steps: ({children}) => <div className="mdx-steps">{children}</div>,
  Step: ({ title, children, id }) => <section className="mdx-step" id={id}><h3>{title}</h3>{children}</section>,
  Tab: ({ children }) => <div>{children}</div>,
  Tabs: tabs,
  Check: ({children}) => <aside className="callout tip">{children}</aside>,
  File: ({filename, children}) => <div className="mdx-file"><div className="mdx-file-name">{filename}</div>{children}</div>,
  FileExplorer: tabs,
  MCPServersTable: McpServers,
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
