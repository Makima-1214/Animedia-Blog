import type { APIRoute } from 'astro';
import db from '../../../lib/turso.js';
import { deleteSession } from '../../../lib/simple-auth';

export const POST: APIRoute = async ({ cookies }) => {
  const token = cookies.get('session_token')?.value;
  if (!token) {
    return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), { status: 401 });
  }

  try {
    // Get user from session
    const sessionResult = await db.execute({
      sql: 'SELECT user_id FROM sessions WHERE id = ?',
      args: [token]
    });
    const userId = sessionResult.rows[0]?.user_id;
    if (!userId) {
      return new Response(JSON.stringify({ success: false, message: 'Session tidak valid' }), { status: 401 });
    }

    // Delete all user data
    await db.execute({ sql: 'DELETE FROM sessions WHERE user_id = ?', args: [userId] });
    await db.execute({ sql: 'DELETE FROM comments WHERE author_email = (SELECT email FROM users WHERE id = ?)', args: [userId] });
    await db.execute({ sql: 'DELETE FROM users WHERE id = ?', args: [userId] });

    cookies.delete('session_token', { path: '/' });

    return new Response(JSON.stringify({ success: true, message: 'Akun berhasil dihapus' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: (error as Error).message }), { status: 500 });
  }
};
