import type { APIRoute } from 'astro';
import db from '../../lib/turso.js';

const subscribeRateLimit = new Map<string, number>();

export const POST: APIRoute = async ({ request }) => {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
    const last = subscribeRateLimit.get(ip) || 0;
    if (Date.now() - last < 30_000) {
      return new Response(JSON.stringify({ success: false, message: 'Tunggu 30 detik sebelum mencoba lagi.' }), { status: 429 });
    }
    subscribeRateLimit.set(ip, Date.now());

    const formData = await request.formData();
    const email = formData.get('email')?.toString()?.trim().toLowerCase();

    if (!email) {
      return new Response(JSON.stringify({ success: false, message: 'Email wajib diisi' }), { status: 400 });
    }

    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ success: false, message: 'Format email tidak valid' }), { status: 400 });
    }

    const existing = await db.execute({ sql: 'SELECT id FROM subscribers WHERE email = ?', args: [email] });
    if (existing.rows[0]) {
      return new Response(JSON.stringify({ success: false, message: 'Email sudah terdaftar' }), { status: 400 });
    }

    const id = crypto.randomUUID();
    await db.execute({ sql: 'INSERT INTO subscribers (id, email, created_at) VALUES (?, ?, CURRENT_TIMESTAMP)', args: [id, email] });

    return new Response(JSON.stringify({ success: true, message: 'Terima kasih! Anda berhasil berlangganan newsletter kami.' }), { status: 200 });
  } catch (error) {
    console.error('Subscribe error:', error);
    return new Response(JSON.stringify({ success: false, message: 'Terjadi kesalahan server' }), { status: 500 });
  }
};
