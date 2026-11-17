import servers from '@/lib/mcp-servers.json';
import { CodeBlock } from './CodeBlock';

export function McpServers() {
  return <div className="mcp-server-grid">{servers.map(server => <section className="mcp-server" key={server.name}>
    <h3><a href={server.href} target="_blank" rel="noreferrer">{server.name} <span aria-hidden="true">↗</span></a></h3>
    <p>{server.description}</p>
    {server.url ? <CodeBlock title="连接地址"><code>{server.url}</code></CodeBlock> : <p className="mcp-server-help">需要专属连接地址，请查看<a href={server.urlHelp?.[0] || server.href} target="_blank" rel="noreferrer">配置说明</a>。</p>}
  </section>)}</div>;
}
