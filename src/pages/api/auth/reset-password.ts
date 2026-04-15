import type { APIRoute } from 'astro';
import { verifyResetCode, resetPassword } from '../../../lib/simple-auth';

export const POST: APIRoute = async ({ request }) => {
  try {
    const contentType = request.headers.get('content-type') || '';
    let email: string | undefined;
    let code: string | undefined;
    let newPassword: string | undefined;
    if (contentType.includes('application/json')) {
      const body = await request.json();
      email = body.email;
      code = body.code;
      newPassword = body.password;
    } else {
      const formData = await request.formData();
      email = formData.get('email')?.toString();
      code = formData.get('code')?.toString();
      newPassword = formData.get('password')?.toString();
    }

    if (!email || !code || !newPassword) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Semua field wajib diisi' 
      }), { status: 400 });
    }

    // Validate password length
    if (newPassword.length < 6) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Password minimal 6 karakter' 
      }), { status: 400 });
    }

    const user = await verifyResetCode(email, code);
    if (!user) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Kode tidak valid atau sudah kadaluarsa' 
      }), { status: 400 });
    }

    await resetPassword(email, newPassword);

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Password berhasil direset! Silakan login dengan password baru Anda.'
    }), { status: 200 });

  } catch (error) {
    console.error('Reset password error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Terjadi kesalahan server' 
    }), { status: 500 });
  }
};
