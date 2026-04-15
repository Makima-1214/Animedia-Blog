import type { APIRoute } from 'astro';
import { getAdminById, updateAdminProfile } from '../../../lib/turso-helpers.js';
import db from '../../../lib/turso.js';

export const POST: APIRoute = async ({ request, cookies }) => {
  const token = cookies.get('admin_session')?.value;
  if (!token) {
    return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), { status: 401 });
  }

  // Resolve token → admin_id
  const sessionResult = await db.execute({
    sql: `SELECT admin_id FROM admin_sessions WHERE token = ? AND expires_at > ?`,
    args: [token, new Date().toISOString()]
  });
  const adminId = sessionResult.rows[0]?.admin_id as string;
  if (!adminId) {
    return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), { status: 401 });
  }

  try {
    const ct = request.headers.get('content-type') || '';
    const b = ct.includes('application/json') ? await request.json() : Object.fromEntries(await request.formData());
    const name = b.name?.toString()?.trim();
    const avatar = b.avatar?.toString()?.trim() || '';

    if (!name) {
      return new Response(JSON.stringify({ success: false, message: 'Nama tidak boleh kosong' }), { status: 400 });
    }

    await updateAdminProfile(adminId, { name, avatar });
    const admin = await getAdminById(adminId);

    return new Response(JSON.stringify({ success: true, message: 'Profil berhasil diperbarui', admin }));
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: (error as Error).message }), { status: 500 });
  }
};
