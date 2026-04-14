import type { APIRoute } from 'astro';
import { generateVerificationCode, sendVerificationEmail } from '../../../lib/email';
import db from '../../../lib/turso.js';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email } = await request.json();

    if (!email) {
      return new Response(JSON.stringify({ success: false, message: 'Email wajib diisi' }), { status: 400 });
    }

    const result = await db.execute({ sql: 'SELECT * FROM users WHERE email = ?', args: [email] });
    const user: any = result.rows[0];

    if (!user) {
      return new Response(JSON.stringify({ success: false, message: 'User tidak ditemukan' }), { status: 404 });
    }

    if (user.email_verified === 1) {
      return new Response(JSON.stringify({ success: false, message: 'Email sudah diverifikasi' }), { status: 400 });
    }

    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await db.execute({
      sql: `UPDATE users SET verification_code = ?, verification_expires = ? WHERE id = ?`,
      args: [code, expiresAt.toISOString(), user.id]
    });

    const emailSent = await sendVerificationEmail(email, user.name, code);

    if (!emailSent) {
      return new Response(JSON.stringify({ success: false, message: 'Gagal mengirim email. Silakan coba lagi.' }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true, message: 'Kode verifikasi baru telah dikirim ke email Anda' }), { status: 200 });

  } catch (error) {
    console.error('Resend code error:', error);
    return new Response(JSON.stringify({ success: false, message: error instanceof Error ? error.message : 'Terjadi kesalahan server' }), { status: 500 });
  }
};
