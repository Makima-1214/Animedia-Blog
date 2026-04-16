import type { APIRoute } from 'astro';
import db from '../../../lib/turso.js';

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!cookies.get('admin_session')) {
    return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), { status: 401 });
  }

  try {
    const formData = await request.formData();
    const id = formData.get('id')?.toString();

    if (!id) {
      return new Response(JSON.stringify({ success: false, message: 'ID pengguna tidak valid' }), { status: 400 });
    }

    // Hapus sessions, comments, lalu user
    await db.execute({ sql: 'DELETE FROM sessions WHERE user_id = ?', args: [id] });
    await db.execute({ sql: 'DELETE FROM comments WHERE author_email = (SELECT email FROM users WHERE id = ?)', args: [id] });
    await db.execute({ sql: 'DELETE FROM users WHERE id = ?', args: [id] });

    return new Response(JSON.stringify({ success: true, message: 'Pengguna berhasil dihapus' }));
  } catch (error) {
    console.error('Delete user error:', error);
    return new Response(JSON.stringify({ success: false, message: (error as Error).message }), { status: 500 });
  }
};
