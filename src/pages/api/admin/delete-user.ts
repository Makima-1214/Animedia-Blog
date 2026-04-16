import type { APIRoute } from 'astro';
import db from '../../../lib/turso.js';

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!cookies.get('admin_session')) {
    return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    let id: string | undefined;

    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const body = await request.json();
      id = body.id;
    } else {
      const formData = await request.formData();
      id = formData.get('id')?.toString();
    }

    if (!id) {
      return new Response(JSON.stringify({ success: false, message: 'ID pengguna tidak valid' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await db.execute({ sql: 'DELETE FROM sessions WHERE user_id = ?', args: [id] });
    await db.execute({ sql: 'DELETE FROM comments WHERE author_email = (SELECT email FROM users WHERE id = ?)', args: [id] });
    await db.execute({ sql: 'DELETE FROM users WHERE id = ?', args: [id] });

    return new Response(JSON.stringify({ success: true, message: 'Pengguna berhasil dihapus' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Delete user error:', error);
    return new Response(JSON.stringify({ success: false, message: (error as Error).message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
