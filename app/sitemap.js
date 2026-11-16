import { getDocPages } from '@/lib/doc-pages';

const siteUrl = 'https://claude-china.org';

export default async function sitemap() {
  const pages = await getDocPages();

  return [
    {
      url: siteUrl,
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...pages.map(({ href }) => ({
      url: new URL(href, siteUrl).toString(),
      changeFrequency: 'monthly',
      priority: href === '/docs/home' ? 0.9 : 0.7,
    })),
  ];
}
