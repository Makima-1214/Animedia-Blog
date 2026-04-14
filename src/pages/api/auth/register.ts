import type { APIRoute } from 'astro';
import { createUser, getUserByEmail } from '../../../lib/simple-auth';
import { generateVerificationCode, sendVerificationEmail } from '../../../lib/email';
import db from '../../../lib/turso.js';

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();
    const name = formData.get('name')?.toString();

    if (!email || !password || !name) {
      return new Response(JSON.stringify({ success: false, message: 'Semua field wajib diisi' }), { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ success: false, message: 'Format email tidak valid' }), { status: 400 });
    }

    if (password.length < 8) {
      return new Response(JSON.stringify({ success: false, message: 'Password minimal 8 karakter' }), { status: 400 });
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return new Response(JSON.stringify({ success: false, message: 'Email sudah terdaftar' }), { status: 400 });
    }

    const user = await createUser(email, password, name);

    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await db.execute({
      sql: `UPDATE users SET verification_code = ?, verification_expires = ? WHERE id = ?`,
      args: [code, expiresAt.toISOString(), user.id]
    });

    const emailSent = await sendVerificationEmail(email, name, code);

    if (!emailSent) {
      return new Response(JSON.stringify({ success: false, message: 'Gagal mengirim email verifikasi. Silakan coba lagi.' }), { status: 500 });
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Registrasi berhasil! Silakan cek email Anda untuk kode verifikasi.',
      userId: user.id,
      email: user.email
    }), { status: 200 });

  } catch (error) {
    console.error('Register error:', error);
    return new Response(JSON.stringify({ success: false, message: error instanceof Error ? error.message : 'Terjadi kesalahan server' }), { status: 500 });
  }
};
