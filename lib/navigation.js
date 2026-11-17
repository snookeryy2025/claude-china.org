import navigation from './official-navigation.json';

export const resourceSections = [
  { key: 'guides', label: '用例与指南', href: '/docs/about-claude/use-case-guides/overview' },
  { key: 'models', label: '模型与定价', href: '/docs/models/overview' },
  { key: 'sdks', label: 'SDK、CLI 与库', href: '/docs/cli-sdks-libraries/overview' },
  { key: 'api-skill', label: 'Claude API 技能', href: '/docs/agents-and-tools/agent-skills/claude-api-skill' },
  { key: 'releases', label: '发布说明', href: '/docs/release-notes/overview' },
];
export const topSections = [
  { key: 'messages', label: '消息 API', href: '/docs/intro' },
  { key: 'managed', label: '托管智能体', href: '/docs/managed-agents/overview' },
  { key: 'manage', label: '管理', href: '/docs/manage-claude/admin-api' },
];
const groupLabels = {
  'First steps':'入门', 'Building with Claude':'使用 Claude 构建', 'Model capabilities':'模型能力',
  Tools:'工具', 'Tool infrastructure':'工具基础设施', 'Context management':'上下文管理',
  'Working with files':'文件处理', Skills:'技能', 'Claude on cloud platforms':'云平台上的 Claude',
  'Define your agent':'定义智能体', 'Configure agent environment':'配置智能体环境',
  'Delegate work to your agent':'向智能体委派工作', 'Manage agent context':'管理智能体上下文',
  'Advanced orchestration':'高级编排', 'Self-hosted Managed Agents':'自托管智能体',
  Security:'安全', Reference:'参考', Organization:'组织管理', Authentication:'身份验证',
  Monitoring:'监控', 'Data & compliance':'数据与合规', 'Compliance API':'合规 API',
  'Use cases':'使用场景', 'Prompt engineering':'提示工程', 'Test and evaluate':'测试与评估',
  'Strengthen guardrails':'强化防护', Models:'模型', Guides:'指南', 'Lifecycle and reference':'生命周期与参考',
  'SDKs, CLI, and libraries':'SDK、CLI 与库', 'Client SDKs':'客户端 SDK',
  'Libraries and integrations':'库与集成', 'Claude API skill':'Claude API 技能',
  'Release notes':'发布说明', 'Migration guides':'迁移指南',
};
export function getDocsSection(slug) {
  if (slug === 'agents-and-tools/agent-skills/claude-api-skill') return 'api-skill';
  if (slug.startsWith('cli-sdks-libraries/')) return 'sdks';
  if (slug.startsWith('models/') || slug.startsWith('about-claude/models/') || ['about-claude/pricing', 'about-claude/model-deprecations', 'about-claude/api-credits-for-subscribers','resources/overview'].includes(slug) || slug.startsWith('release-notes/system-prompts/')) return 'models';
  if (slug.startsWith('release-notes/')) return 'releases';
  if (slug.startsWith('managed-agents/')) return 'managed';
  if (slug.startsWith('manage-claude/') || slug.startsWith('workspaces/')) return 'manage';
  if (slug.startsWith('about-claude/') || slug.startsWith('test-and-evaluate/') || slug.startsWith('build-with-claude/prompt-engineering/')) return 'guides';
  return 'messages';
}
export function sectionLabel(section) {
  return [...topSections,...resourceSections].find(item=>item.key === section)?.label || '文档';
}
export function getNavigation(section, pages) {
  const bySlug = new Map(pages.map(page => [page.slug, page]));
  const groups = (navigation[section] || []).map(group => ({ label:groupLabels[group.label] || group.label,
    pages:group.links.filter(link=>bySlug.has(link.slug)).map(link=>({...bySlug.get(link.slug), title:link.label})),
  }));
  // Keep the source navigation's curated entries. Every exported page remains
  // available by URL, through article links, and in global search.
  return groups;
}
