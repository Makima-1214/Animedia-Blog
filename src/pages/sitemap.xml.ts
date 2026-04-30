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

  const now = new Date().toISOString().split('T')[0];

  // Halaman statis dengan prioritas dan frekuensi update
  const staticPages = [
    { url: `${site}/`, priority: '1.0', changefreq: 'daily', lastmod: now },
    { url: `${site}/artikel`, priority: '0.9', changefreq: 'daily', lastmod: now },
    { url: `${site}/tentang`, priority: '0.8', changefreq: 'monthly', lastmod: now },
    { url: `${site}/kontak`, priority: '0.8', changefreq: 'monthly', lastmod: now },
    { url: `${site}/privasi`, priority: '0.6', changefreq: 'yearly', lastmod: now },
    { url: `${site}/disclaimer`, priority: '0.6', changefreq: 'yearly', lastmod: now },
    { url: `${site}/berlangganan`, priority: '0.7', changefreq: 'monthly', lastmod: now },
    { url: `${site}/toko`, priority: '0.8', changefreq: 'weekly', lastmod: now },
    { url: `${site}/login`, priority: '0.4', changefreq: 'yearly', lastmod: now },
    { url: `${site}/register`, priority: '0.4', changefreq: 'yearly', lastmod: now },
  ];

  const urls = [
    ...staticPages.map(p => `
  <url>
    <loc>${p.url}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`),

    ...categories.map((cat: any) => `
  <url>
    <loc>${site}/kategori/${cat.slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`),

    ...tags.map((tag: any) => `
  <url>
    <loc>${site}/tag/${tag.slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>`),

    ...articles.map((article: any) => {
      const lastmod = article.updated_at
        ? new Date(String(article.updated_at)).toISOString().split('T')[0]
        : new Date(String(article.published_at)).toISOString().split('T')[0];
      return `
  <url>
    <loc>${site}/artikel/${article.slug}</loc>
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
