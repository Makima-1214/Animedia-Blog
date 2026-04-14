import type { APIRoute } from 'astro';
import db from '../../../lib/turso.js';

export const POST: APIRoute = async ({ request, cookies }) => {
  const token = cookies.get('admin_session')?.value;
  if (!token) {
    return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), { status: 401 });
  }

  // Verify admin session
  const session = await db.execute({
    sql: 'SELECT admin_id FROM admin_sessions WHERE token = ? AND expires_at > ?',
    args: [token, new Date().toISOString()]
  });
  if (!session.rows[0]) {
    return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), { status: 401 });
  }

  try {
    const formData = await request.formData();
    const id = formData.get('id')?.toString();
    if (!id) {
      return new Response(JSON.stringify({ success: false, message: 'ID tidak valid' }), { status: 400 });
    }

    // Hapus sessions, comments, lalu user
    await db.execute({ sql: 'DELETE FROM sessions WHERE user_id = ?', args: [id] });
    await db.execute({
      sql: 'DELETE FROM comments WHERE author_email = (SELECT email FROM users WHERE id = ?)',
      args: [id]
    });
    await db.execute({ sql: 'DELETE FROM users WHERE id = ?', args: [id] });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: (error as Error).message }), { status: 500 });
  }
};
