import Link from 'next/link';
import { topSections, resourceSections } from '@/lib/navigation';

export function SiteHeader({ activeSection, home }) {
  const isResource = resourceSections.some(item=>item.key===activeSection);
  return <>
    <div className="site-top-disclaimer" role="note">本站为独立教程与指南网站，仅提供学习参考内容，不提供任何服务，与 Anthropic 官方不存在隶属或关联关系。</div>
    <header className="site-header">
      <Link className="site-brand" href="/docs/home"><span className="anthropic-mark" aria-hidden="true">✳</span><span>Claude 中文使用教程</span></Link>
      <nav className="site-nav" aria-label="主导航">{topSections.map(item=><Link className={!home && activeSection === item.key?'selected':''} aria-current={!home && activeSection===item.key?'page':undefined} href={item.href} key={item.key}>{item.label}</Link>)}
        <details className={`resources-menu${!home && isResource?' selected':''}`}><summary>资源 <span aria-hidden="true">⌄</span></summary><div>{resourceSections.map(item=><Link key={item.key} className={!home && activeSection===item.key?'selected':''} href={item.href}>{item.label}</Link>)}</div></details>
      </nav>
      <div className="site-actions"><Link className="header-api" href="/docs/api/overview"><span aria-hidden="true">{'{ }'}</span> API 参考</Link><span className="action-divider"/><span className="language">简体中文</span><a className="console-link" href="https://platform.claude.com/" target="_blank" rel="noreferrer">▣ 控制台</a><a className="login-link" href="https://platform.claude.com/login" target="_blank" rel="noreferrer">登录</a></div>
    </header>
  </>;
}
