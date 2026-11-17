'use client';

import { Children, useId, useRef, useState } from 'react';

// Panels are rendered on the server; only selection and clipboard access run here.
export function DocTabs({ labels, children, variant = '', copyable = false }) {
  const panels = Children.toArray(children);
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const id = useId();
  const root = useRef(null);
  function select(index) { setActive(index); setCopied(false); }
  async function copy() {
    const panel = root.current?.querySelector('[role="tabpanel"]:not([hidden])');
    try {
      await navigator.clipboard.writeText(panel?.querySelector('pre')?.textContent || panel?.textContent || '');
      setCopied(true); setTimeout(() => setCopied(false), 1800);
    } catch { setCopied(false); }
  }
  return <div className={`doc-tabs ${variant}`} ref={root}>
    <div className="doc-tab-bar"><div role="tablist" aria-label={variant === 'home-journey' ? '开发者旅程' : '示例与平台'}>
      {labels.map((label, i) => <button type="button" role="tab" id={`${id}-tab-${i}`} aria-controls={`${id}-panel-${i}`} aria-selected={i === active} tabIndex={i === active ? 0 : -1} key={i} onClick={() => select(i)} onKeyDown={(event) => {
        let next;
        if (event.key === 'ArrowRight') next = (i + 1) % labels.length;
        if (event.key === 'ArrowLeft') next = (i + labels.length - 1) % labels.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = labels.length - 1;
        if (next !== undefined) { event.preventDefault(); select(next); root.current.querySelectorAll('[role="tab"]')[next]?.focus(); }
      }}>{label}</button>)}
    </div>{copyable && <button className="tab-copy" type="button" aria-label="复制当前示例代码" onClick={copy}>{copied ? '已复制' : '复制代码'}</button>}</div>
    {panels.map((panel, i) => <div role="tabpanel" tabIndex={0} id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={i !== active} key={i}>{panel}</div>)}
  </div>;
}
