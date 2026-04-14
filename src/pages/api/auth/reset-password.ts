import type { APIRoute } from 'astro';
import { verifyResetCode, resetPassword } from '../../../lib/simple-auth';

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const email = formData.get('email')?.toString();
    const code = formData.get('code')?.toString();
    const newPassword = formData.get('password')?.toString();

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
