'use client';

import { useState } from 'react';

function textContent(node) {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textContent).join('');
  if (node && typeof node === 'object' && 'props' in node) return textContent(node.props.children);
  return '';
}

export function CodeBlock({ children }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(textContent(children));
      setCopied(true); window.setTimeout(() => setCopied(false), 1800);
    } catch { setCopied(false); }
  };
  return <div className="code-frame"><div className="code-toolbar"><span>示例代码</span><button type="button" onClick={copy}>{copied ? '已复制' : '复制代码'}</button></div><pre>{children}</pre></div>;
}
