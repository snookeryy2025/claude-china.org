const paths = {
  play: 'm8 4 12 8-12 8Z',
  key: 'M14 10a5 5 0 1 0-3 4l-7 7H1v-3l7-7m7-5h.01',
  book: 'M12 5c-4-3-9-2-10-1v15c3-2 7-2 10 0m0-14c4-3 9-2 10-1v15c-3-2-7-2-10 0Z',
  code: 'm8 5-7 7 7 7m8-14 7 7-7 7m-3-17-3 20',
  cloud: 'M6 18a5 5 0 0 1-1-10 7 7 0 0 1 13-1 5.5 5.5 0 0 1 0 11Z',
  terminal: 'M3 3h18v18H3Zm3 4 4 4-4 4m7 1h5',
  brain: 'M12 4c-5-5-10 3-7 5-5 3-2 9 2 9 1 5 5 3 5 0m0-14c5-5 10 3 7 5 5 3 2 9-2 9-1 5-5 3-5 0Zm-5 4 5 4 5-4m-5 4v8',
  image: 'M3 3h18v18H3Zm1 15 6-7 4 4 3-3 4 6M8 7h.01',
  star: 'm12 2 3 6 7 1-5 5 1 8-6-4-6 4 1-8-5-5 7-1Z',
  settings: 'M12 3v3m0 12v3M3 12h3m12 0h3M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
  lock: 'M6 10V7a6 6 0 0 1 12 0v3M4 10h16v12H4Zm8 5v3',
  'graduation-cap': 'm1 8 11-6 11 6-11 6Zm4 3v7c4 4 10 4 14 0v-7m4-3v9',
};
export function DocIcon({ name = 'book' }) {
  const key = name.toLowerCase().replace('codebrackets', 'code').replace('code-brackets', 'code').replace('computer', 'terminal');
  return <svg className="doc-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[key] || paths.book}/></svg>;
}
