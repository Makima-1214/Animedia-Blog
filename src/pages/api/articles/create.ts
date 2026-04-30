import type { APIRoute } from 'astro';
import db from '../../../lib/turso.js';
import { calculateReadTime, syncArticleTags } from '../../../lib/turso-helpers.js';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const adminSession = cookies.get('admin_session');
    if (!adminSession) {
      return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), { status: 401 });
    }

    const contentType = request.headers.get('content-type') || '';
    let title, slug, excerpt, content, coverImage, categoryId, status, tags, scheduledAt;
    if (contentType.includes('application/json')) {
      const body = await request.json();
      ({ title, slug, excerpt, content, coverImage, categoryId, status, tags, scheduledAt } = body);
      tags = tags || '';
      status = status || 'draft';
    } else {
      const formData = await request.formData();
      title = formData.get('title')?.toString();
      slug = formData.get('slug')?.toString();
      excerpt = formData.get('excerpt')?.toString();
      content = formData.get('content')?.toString();
      coverImage = formData.get('coverImage')?.toString();
      categoryId = formData.get('categoryId')?.toString();
      status = formData.get('status')?.toString() || 'draft';
      tags = formData.get('tags')?.toString() || '';
      scheduledAt = formData.get('scheduledAt')?.toString() || null;
    }
    const readTime = calculateReadTime(content);

    if (!title || !slug || !excerpt || !content || !categoryId) {
      return new Response(JSON.stringify({ success: false, message: 'Semua field wajib diisi' }), { status: 400 });
    }

    // Validate scheduled date
    if (status === 'scheduled' && !scheduledAt) {
      return new Response(JSON.stringify({ success: false, message: 'Tanggal publish wajib diisi untuk artikel terjadwal' }), { status: 400 });
    }

    const id = Date.now().toString();
    const publishedAt = status === 'published' ? new Date().toISOString() : null;

    await db.execute({
      sql: `INSERT INTO articles (id, title, slug, excerpt, content, cover_image, category_id, status, read_time, published_at, scheduled_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [id, title, slug, excerpt, content, coverImage || null, categoryId, status, readTime, publishedAt, scheduledAt]
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
