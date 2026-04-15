import type { APIRoute } from 'astro';
import db from '../../../lib/turso.js';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const adminSession = cookies.get('admin_session');
    if (!adminSession) {
      return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), { status: 401 });
    }

    const contentType = request.headers.get('content-type') || '';
    let id, title, slug, excerpt, content, coverImage, categoryId, status, readTime, published_at;
    if (contentType.includes('application/json')) {
      const body = await request.json();
      ({ id, title, slug, excerpt, content, coverImage, categoryId, status, published_at } = body);
      readTime = parseInt(body.readTime || '5');
    } else {
      const formData = await request.formData();
      id = formData.get('id')?.toString();
      title = formData.get('title')?.toString();
      slug = formData.get('slug')?.toString();
      excerpt = formData.get('excerpt')?.toString();
      content = formData.get('content')?.toString();
      coverImage = formData.get('coverImage')?.toString();
      categoryId = formData.get('categoryId')?.toString();
      status = formData.get('status')?.toString();
      readTime = parseInt(formData.get('readTime')?.toString() || '5');
      published_at = formData.get('published_at')?.toString();
    }

    if (!id || !title || !slug || !excerpt || !content || !categoryId) {
      return new Response(JSON.stringify({ success: false, message: 'Semua field wajib diisi' }), { status: 400 });
    }

    const publishedAt = status === 'published'
      ? (published_at || new Date().toISOString())
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
