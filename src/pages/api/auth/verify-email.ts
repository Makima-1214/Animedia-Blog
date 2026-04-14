import type { APIRoute } from 'astro';
import { createSession } from '../../../lib/simple-auth';
import { sendWelcomeEmail } from '../../../lib/email';
import db from '../../../lib/turso.js';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const formData = await request.formData();
    const email = formData.get('email')?.toString();
    const code = formData.get('code')?.toString();

    if (!email || !code) {
      return new Response(JSON.stringify({ success: false, message: 'Email dan kode verifikasi wajib diisi' }), { status: 400 });
    }

    const result = await db.execute({ sql: 'SELECT * FROM users WHERE email = ?', args: [email] });
    const user: any = result.rows[0];

    if (!user) {
      return new Response(JSON.stringify({ success: false, message: 'User tidak ditemukan' }), { status: 404 });
    }

    if (user.email_verified === 1) {
      return new Response(JSON.stringify({ success: false, message: 'Email sudah diverifikasi' }), { status: 400 });
    }

    if (user.verification_code !== code) {
      return new Response(JSON.stringify({ success: false, message: 'Kode verifikasi salah' }), { status: 400 });
    }

    if (new Date(user.verification_expires) < new Date()) {
      return new Response(JSON.stringify({ success: false, message: 'Kode verifikasi sudah kadaluarsa' }), { status: 400 });
    }

    await db.execute({
      sql: `UPDATE users SET email_verified = 1, verification_code = NULL, verification_expires = NULL WHERE id = ?`,
      args: [user.id]
    });

    const token = await createSession(user.id);

    cookies.set('session_token', token, {
      path: '/',
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60
    });

    await sendWelcomeEmail(user.email, user.name);

    return new Response(JSON.stringify({
      success: true,
      message: 'Email berhasil diverifikasi! Selamat datang di Animedia.',
      user: { id: user.id, email: user.email, name: user.name }
    }), { status: 200 });

  } catch (error) {
    console.error('Verify email error:', error);
    return new Response(JSON.stringify({ success: false, message: error instanceof Error ? error.message : 'Terjadi kesalahan server' }), { status: 500 });
  }
};
