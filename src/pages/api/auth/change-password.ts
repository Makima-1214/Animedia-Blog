import type { APIRoute } from 'astro';
import { getSession, getUserByIdWithPassword, verifyPassword, resetPassword } from '../../../lib/simple-auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Check if user is logged in
    const token = cookies.get('session_token')?.value;
    if (!token) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Anda harus login terlebih dahulu' 
      }), { status: 401 });
    }

    const session = await getSession(token);
    if (!session) {
      return new Response(JSON.stringify({ success: false, message: 'Sesi tidak valid' }), { status: 401 });
    }

    const ct = request.headers.get('content-type') || '';
    let oldPassword: string | undefined;
    let newPassword: string | undefined;
    if (ct.includes('application/json')) {
      const body = await request.json();
      oldPassword = body.oldPassword;
      newPassword = body.newPassword;
    } else {
      const formData = await request.formData();
      oldPassword = formData.get('oldPassword')?.toString();
      newPassword = formData.get('newPassword')?.toString();
    }

    if (!oldPassword || !newPassword) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Semua field wajib diisi' 
      }), { status: 400 });
    }

    // Validate new password length
    if (newPassword.length < 6) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Password baru minimal 6 karakter' 
      }), { status: 400 });
    }

    const user: any = await getUserByIdWithPassword(session.user_id);
    if (!user) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'User tidak ditemukan' 
      }), { status: 404 });
    }

    // Verify old password
    if (!verifyPassword(oldPassword, user.password)) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Password lama salah' 
      }), { status: 401 });
    }

    await resetPassword(user.email, newPassword);

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Password berhasil diubah!'
    }), { status: 200 });

  } catch (error) {
    console.error('Change password error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Terjadi kesalahan server' 
    }), { status: 500 });
  }
};
