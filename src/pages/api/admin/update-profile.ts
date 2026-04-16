import type { APIRoute } from 'astro';
import { getAdminById, updateAdminProfile } from '../../../lib/turso-helpers.js';

export const POST: APIRoute = async ({ request, cookies }) => {
  // Cookie admin_session berisi admin ID langsung (bukan token)
  const adminId = cookies.get('admin_session')?.value;
  if (!adminId) {
    return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), { status: 401 });
  }

  // Verifikasi admin exists
  const admin = await getAdminById(adminId);
  if (!admin) {
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
    const updatedAdmin = await getAdminById(adminId);

    return new Response(JSON.stringify({ success: true, message: 'Profil berhasil diperbarui', admin: updatedAdmin }));
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: (error as Error).message }), { status: 500 });
  }
};
