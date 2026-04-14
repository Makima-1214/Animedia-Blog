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
    const status = formData.get('status')?.toString();

    if (!id || !status) {
      return new Response(JSON.stringify({ success: false, message: 'ID dan status wajib diisi' }), { status: 400 });
    }

    await db.execute({ sql: 'UPDATE comments SET status = ? WHERE id = ?', args: [status, id] });

    return new Response(JSON.stringify({ success: true, message: 'Status komentar berhasil diupdate' }), { status: 200 });
  } catch (error) {
    console.error('Update comment error:', error);
    return new Response(JSON.stringify({ success: false, message: 'Terjadi kesalahan server' }), { status: 500 });
  }
};
