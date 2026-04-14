import type { APIRoute } from 'astro';
import { getAllArticles, getAllCategories } from '../../../lib/turso-helpers.js';

export const GET: APIRoute = async () => {
  const articles = await getAllArticles();
  const categories = await getAllCategories();

  const data = articles.map((a: any) => ({
    id: a.id,
    title: a.title,
    slug: a.slug,
    excerpt: a.excerpt,
    category: categories.find((c: any) => c.id === a.category_id)?.name || '',
    cover_image: a.cover_image
  }));

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  });
};
