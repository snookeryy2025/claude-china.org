import { getSearchIndex } from '@/lib/search-index';

export async function GET(request) {
  const terms = (new URL(request.url).searchParams.get('q') || '').trim().toLowerCase().slice(0, 180).split(/\s+/).filter(Boolean);
  if (!terms.length) return Response.json([]);
  const pages = await getSearchIndex();
  const matches = pages.map(page => {
    let score = 0;
    for (const term of terms) {
      if (page.title.toLowerCase().includes(term)) score += 50;
      else if (page.slug.includes(term)) score += 25;
      else if (page.text.includes(term)) score += 1;
      else return null;
    }
    return {slug:page.slug, title:page.title, href:page.href, score};
  }).filter(Boolean).sort((a,b)=>b.score-a.score).slice(0,20);
  return Response.json(matches.map(({score,...page})=>page));
}
