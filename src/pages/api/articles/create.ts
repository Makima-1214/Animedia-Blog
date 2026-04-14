import type { APIRoute } from 'astro';
import db from '../../../lib/turso.js';
import { calculateReadTime, syncArticleTags } from '../../../lib/turso-helpers.js';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const adminSession = cookies.get('admin_session');
    if (!adminSession) {
      return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), { status: 401 });
    }

    const formData = await request.formData();
    const title = formData.get('title')?.toString();
    const slug = formData.get('slug')?.toString();
    const excerpt = formData.get('excerpt')?.toString();
    const content = formData.get('content')?.toString();
    const coverImage = formData.get('coverImage')?.toString();
    const categoryId = formData.get('categoryId')?.toString();
    const status = formData.get('status')?.toString() || 'draft';
    const tags = formData.get('tags')?.toString() || '';
    const readTime = calculateReadTime(content);

    if (!title || !slug || !excerpt || !content || !categoryId) {
      return new Response(JSON.stringify({ success: false, message: 'Semua field wajib diisi' }), { status: 400 });
    }

    const id = Date.now().toString();
    const publishedAt = status === 'published' ? new Date().toISOString() : null;

    await db.execute({
      sql: `INSERT INTO articles (id, title, slug, excerpt, content, cover_image, category_id, status, read_time, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [id, title, slug, excerpt, content, coverImage || null, categoryId, status, readTime, publishedAt]
    });

    if (tags.trim()) {
      const tagNames = tags.split(',').map((t: string) => t.trim()).filter((t: string) => t.length > 0);
      await syncArticleTags(id, tagNames);
    }

    return new Response(JSON.stringify({ success: true, message: 'Artikel berhasil dibuat', articleId: id }), { status: 200 });
  } catch (error) {
    console.error('Create article error:', error);
    return new Response(JSON.stringify({ success: false, message: (error as Error).message || 'Terjadi kesalahan server' }), { status: 500 });
  }
};
