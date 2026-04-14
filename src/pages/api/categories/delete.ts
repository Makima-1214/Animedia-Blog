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
      return new Response(JSON.stringify({ success: false, message: 'ID kategori tidak valid' }), { status: 400 });
    }

    await db.execute({ sql: 'DELETE FROM categories WHERE id = ?', args: [id] });

    return new Response(JSON.stringify({ success: true, message: 'Kategori berhasil dihapus' }), { status: 200 });
  } catch (error) {
    console.error('Delete category error:', error);
    return new Response(JSON.stringify({ success: false, message: 'Terjadi kesalahan server' }), { status: 500 });
  }
};
