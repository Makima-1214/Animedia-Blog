import type { APIRoute } from 'astro';
import { getAllArticles, getAllCategories, getAllTags } from '../lib/turso-helpers.js';

export const prerender = false;

const site = 'https://animedia.web.id';

export const GET: APIRoute = async () => {
  const [articles, categories, tags] = await Promise.all([
    getAllArticles(),
    getAllCategories(),
    getAllTags(),
  ]);

  const staticPages = [
    { url: `${site}/`, priority: '1.0', changefreq: 'daily' },
    { url: `${site}/artikel/`, priority: '0.9', changefreq: 'daily' },
  ];

  const urls = [
    ...staticPages.map(p => `
  <url>
    <loc>${p.url}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`),

    ...categories.map((cat: any) => `
  <url>
    <loc>${site}/kategori/${cat.slug}/</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`),

    ...tags.map((tag: any) => `
  <url>
    <loc>${site}/tag/${tag.slug}/</loc>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>`),

    ...articles.map((article: any) => {
      const lastmod = article.updated_at
        ? new Date(String(article.updated_at)).toISOString().split('T')[0]
        : new Date(String(article.published_at)).toISOString().split('T')[0];
      return `
  <url>
    <loc>${site}/artikel/${article.slug}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
    }),
  ].join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
