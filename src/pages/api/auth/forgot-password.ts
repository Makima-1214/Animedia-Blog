import type { APIRoute } from 'astro';
import { getUserByEmail, saveResetCode } from '../../../lib/simple-auth';
import { generateVerificationCode } from '../../../lib/email';
import nodemailer from 'nodemailer';

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const email = formData.get('email')?.toString();

    if (!email) {
      return new Response(JSON.stringify({ success: false, message: 'Email wajib diisi' }), { status: 400 });
    }

    const user: any = await getUserByEmail(email);
    if (!user) {
      return new Response(JSON.stringify({ success: true, message: 'Jika email terdaftar, kode reset password telah dikirim' }), { status: 200 });
    }

    const code = generateVerificationCode();
    await saveResetCode(email, code);

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user: import.meta.env.EMAIL_USER, pass: import.meta.env.EMAIL_PASSWORD }
    });

    try {
      await transporter.sendMail({
        from: '"Animedia" <noreply@animedia.com>',
        to: email,
        subject: 'Reset Password - Animedia',
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
            <div style="background:linear-gradient(135deg,#7c3aed,#2563eb);color:white;padding:30px;text-align:center;border-radius:8px 8px 0 0">
              <h1>🔐 Reset Password</h1>
            </div>
            <div style="background:#f9fafb;padding:30px;border-radius:0 0 8px 8px">
              <h2>Halo, ${user.name}!</h2>
              <p>Gunakan kode berikut untuk membuat password baru:</p>
              <div style="background:white;border:2px dashed #7c3aed;padding:20px;text-align:center;font-size:32px;font-weight:bold;letter-spacing:8px;margin:20px 0;border-radius:8px;color:#7c3aed">${code}</div>
              <p><strong>Kode berlaku 15 menit.</strong></p>
              <p style="background:#fef3c7;border-left:4px solid #f59e0b;padding:12px;border-radius:4px">⚠️ Jika Anda tidak meminta reset password, abaikan email ini.</p>
            </div>
            <p style="text-align:center;color:#666;font-size:12px">&copy; ${new Date().getFullYear()} Animedia. All rights reserved.</p>
          </div>
        `
      });
    } catch {
      return new Response(JSON.stringify({ success: false, message: 'Gagal mengirim email. Silakan coba lagi.' }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true, message: 'Kode reset password telah dikirim ke email Anda', email }), { status: 200 });

  } catch (error) {
    console.error('Forgot password error:', error);
    return new Response(JSON.stringify({ success: false, message: 'Terjadi kesalahan server' }), { status: 500 });
  }
};
