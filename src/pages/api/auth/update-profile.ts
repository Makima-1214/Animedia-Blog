import type { APIRoute } from 'astro';
import { getSession, hashPassword } from '../../../lib/simple-auth';
import db from '../../../lib/turso.js';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const token = cookies.get('session_token')?.value;
    if (!token) {
      return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), { status: 401 });
    }

    const session = await getSession(token);
    if (!session) {
      return new Response(JSON.stringify({ success: false, message: 'Session expired' }), { status: 401 });
    }

    const formData = await request.formData();
    const name = formData.get('name')?.toString();

    if (!name) {
      return new Response(JSON.stringify({ success: false, message: 'Nama wajib diisi' }), { status: 400 });
    }

    await db.execute({ sql: 'UPDATE users SET name = ? WHERE id = ?', args: [name, session.user_id] });

    return new Response(JSON.stringify({ success: true, message: 'Profil berhasil diperbarui' }), { status: 200 });
  } catch (error) {
    console.error('Update profile error:', error);
    return new Response(JSON.stringify({ success: false, message: error instanceof Error ? error.message : 'Terjadi kesalahan server' }), { status: 500 });
  }
};
