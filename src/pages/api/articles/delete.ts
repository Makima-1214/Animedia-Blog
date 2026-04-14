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

    if (!id) {
      return new Response(JSON.stringify({ success: false, message: 'ID artikel tidak valid' }), { status: 400 });
    }

    const article = await db.execute({ sql: 'SELECT id FROM articles WHERE id = ?', args: [id] });
    if (!article.rows[0]) {
      return new Response(JSON.stringify({ success: false, message: 'Artikel tidak ditemukan' }), { status: 404 });
    }

    await db.execute({ sql: 'DELETE FROM comments WHERE article_id = ?', args: [id] });
    await db.execute({ sql: 'DELETE FROM article_tags WHERE article_id = ?', args: [id] });
    await db.execute({ sql: 'DELETE FROM affiliate_products WHERE article_id = ?', args: [id] });
    await db.execute({ sql: 'DELETE FROM articles WHERE id = ?', args: [id] });

    return new Response(JSON.stringify({ success: true, message: 'Artikel berhasil dihapus' }), { status: 200 });
  } catch (error) {
    console.error('Delete article error:', error);
    return new Response(JSON.stringify({ success: false, message: error instanceof Error ? error.message : 'Terjadi kesalahan server' }), { status: 500 });
  }
};
