import './globals.css';

export const metadata = {
  title: { default: 'Claude 中文使用教程', template: '%s · Claude 中文使用教程' },
  description: 'Claude 中文使用教程，提供 Claude 开发与使用文档。',
  metadataBase: new URL('https://claude-china.org'),
};

export default function RootLayout({ children }) {
  return <html lang="zh-CN"><body>{children}<footer className="site-disclaimer"><span>Claude 中文使用教程 · 内容以官方文档为准</span><span>本网站为独立网站，与 Claude 官方没有关系。</span></footer></body></html>;
}
