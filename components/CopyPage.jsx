'use client';

import { useState } from 'react';

export function CopyPage({ markdown, title }) {
  const [menu, setMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true); setMenu(false); window.setTimeout(() => setCopied(false), 1800);
    } catch { setCopied(false); }
  };
  const openMarkdown = () => {
    const blob = new Blob([`# ${title}\n\n${markdown}`], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank', 'noopener,noreferrer');
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    setMenu(false);
  };
  return <div className="copy-page-wrap">
    <button className="copy-page" type="button" onClick={() => setMenu((value) => !value)} aria-expanded={menu}>
      <span aria-hidden="true">▢</span><span>{copied ? '已复制 Markdown' : '复制页面'}</span><span className="copy-chevron" aria-hidden="true">⌄</span>
    </button>
    {menu && <div className="copy-menu"><button type="button" onClick={copy}>▢&nbsp; 复制为 Markdown</button><button type="button" onClick={openMarkdown}>↗&nbsp; 打开 Markdown</button></div>}
  </div>;
}
