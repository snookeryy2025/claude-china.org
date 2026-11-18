import './globals.css';
import Script from 'next/script';

export const metadata = {
  title: { default: 'Claude 中文使用教程', template: '%s · Claude 中文使用教程' },
  description: 'Claude 中文使用教程，提供 Claude 开发与使用文档。',
  metadataBase: new URL('https://claude-china.org'),
};

export default function RootLayout({ children }) {
  return <html lang="zh-CN"><body>{children}<footer className="site-disclaimer"><span>Claude 中文国内使用教程 </span><span>本网站为独立网站，与 Anthropic 官方不存在隶属或关联关系。</span></footer><Script id="baidu-tongji" strategy="afterInteractive">{`var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?9a31525892bf904f4724f4c58a398ece";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(hm, s);
})();`}</Script></body></html>;
}
