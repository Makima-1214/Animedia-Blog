import type { APIRoute } from 'astro';
import db from '../../../lib/turso.js';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const adminSession = cookies.get('admin_session');
    if (!adminSession) {
      return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), { status: 401 });
    }

    const formData = await request.formData();
    const id = formData.get('id')?.toString();
    const title = formData.get('title')?.toString();
    const slug = formData.get('slug')?.toString();
    const excerpt = formData.get('excerpt')?.toString();
    const content = formData.get('content')?.toString();
    const coverImage = formData.get('coverImage')?.toString();
    const categoryId = formData.get('categoryId')?.toString();
    const status = formData.get('status')?.toString();
    const readTime = parseInt(formData.get('readTime')?.toString() || '5');

    if (!id || !title || !slug || !excerpt || !content || !categoryId) {
      return new Response(JSON.stringify({ success: false, message: 'Semua field wajib diisi' }), { status: 400 });
    }

    const publishedAt = status === 'published'
      ? (formData.get('published_at')?.toString() || new Date().toISOString())
      : null;

    await db.execute({
      sql: `UPDATE articles SET title=?, slug=?, excerpt=?, content=?, cover_image=?, category_id=?, status=?, read_time=?, published_at=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`,
      args: [title, slug, excerpt, content, coverImage || null, categoryId, status, readTime, publishedAt, id]
    });

    return new Response(JSON.stringify({ success: true, message: 'Artikel berhasil diupdate' }), { status: 200 });
  } catch (error) {
    console.error('Update article error:', error);
    return new Response(JSON.stringify({ success: false, message: (error as Error).message || 'Terjadi kesalahan server' }), { status: 500 });
  }
};
