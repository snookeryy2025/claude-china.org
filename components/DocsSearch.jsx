'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

export function DocsSearch({ pages, className = '' }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState(null);
  const quickMatches = useMemo(() => {
    const term = query.trim().toLocaleLowerCase();
    if (!term) return [];
    return pages.filter((page) => `${page.title} ${page.slug}`.toLocaleLowerCase().includes(term)).slice(0, 12);
  }, [pages, query]);
  const matches = results || quickMatches;

  useEffect(() => {
    setResults(null);
    if (!open || !query.trim()) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {signal:controller.signal});
        if (response.ok) setResults(await response.json());
      } catch { /* Title matches remain available if the full-text request fails. */ }
    }, 150);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [query, open]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault(); setOpen(true); document.querySelector('#docs-search-input')?.focus();
      }
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return <>
    <button className={`sidebar-search ${className}`} type="button" onClick={() => { setOpen(true); setTimeout(() => document.querySelector('#docs-search-input')?.focus(), 0); }}>
      <span className="search-icon" aria-hidden="true">⌕</span><span>搜索文档</span><kbd>⌘</kbd><kbd>K</kbd>
    </button>
    {open && <div className="search-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
      <section className="search-dialog" role="dialog" aria-modal="true" aria-label="搜索文档">
        <div className="search-field"><span aria-hidden="true">⌕</span><input id="docs-search-input" autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`搜索 ${pages.length} 篇中文文档…`}/><kbd>ESC</kbd></div>
        {query.trim() ? <div className="search-results">{matches.length ? matches.map((page) => <Link key={page.slug} href={page.href} onClick={() => setOpen(false)}><span>{page.title}</span><small>{page.slug}</small></Link>) : <p>{results === null ? '正在搜索全文…' : '没有找到匹配的文档'}</p>}</div> : <p className="search-hint">搜索全部文档的标题、主题和正文内容</p>}
      </section>
    </div>}
  </>;
}
