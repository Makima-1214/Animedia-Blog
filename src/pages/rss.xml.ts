import type { APIRoute } from 'astro';
import { getAllArticles, getAllCategories } from '../lib/turso-helpers.js';

export const prerender = false;

const site = 'https://animedia.web.id';
const siteTitle = 'Animedia';
const siteDescription = 'Portal berita teknologi, game, anime, film, dan gadget terkini';

export const GET: APIRoute = async () => {
  try {
    const [articles, categories] = await Promise.all([
      getAllArticles(),
      getAllCategories(),
    ]);

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${siteTitle}</title>
    <link>${site}</link>
    <description>${siteDescription}</description>
    <language>id</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${site}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${site}/favicon.svg</url>
      <title>${siteTitle}</title>
      <link>${site}</link>
    </image>
    ${articles.slice(0, 50).map((article: any) => {
      const category = categories.find((c: any) => c.id === article.category_id);
      const pubDate = article.published_at 
        ? new Date(String(article.published_at)).toUTCString()
        : new Date().toUTCString();
      
      // Clean content for RSS (remove HTML tags for description)
      const cleanExcerpt = String(article.excerpt || '').replace(/<[^>]*>/g, '');
      
      return `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${site}/artikel/${article.slug}</link>
      <guid isPermaLink="true">${site}/artikel/${article.slug}</guid>
      <description><![CDATA[${cleanExcerpt}]]></description>
      <content:encoded><![CDATA[${article.content}]]></content:encoded>
      <pubDate>${pubDate}</pubDate>
      <dc:creator><![CDATA[Editor Animedia]]></dc:creator>
      ${category ? `<category><![CDATA[${category.name}]]></category>` : ''}
      ${article.cover_image ? `<enclosure url="${article.cover_image}" type="image/jpeg"/>` : ''}
    </item>`;
    }).join('')}
  </channel>
</rss>`;

    return new Response(rss, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('RSS generation error:', error);
    return new Response('Error generating RSS feed', { status: 500 });
  }
};
