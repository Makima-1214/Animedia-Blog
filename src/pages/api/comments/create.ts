import type { APIRoute } from 'astro';
import db from '../../../lib/turso.js';
import { getSession } from '../../../lib/simple-auth';

// Simple rate limiter: max 5 komentar per IP per menit
const commentRateLimit = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = commentRateLimit.get(ip);
  if (!record || now > record.resetAt) {
    commentRateLimit.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  if (record.count >= 5) return true;
  record.count++;
  return false;
}

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Rate limit
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
    if (isRateLimited(ip)) {
      return new Response(JSON.stringify({ success: false, message: 'Terlalu banyak komentar. Tunggu sebentar.' }), { status: 429 });
    }

    // Harus login
    const token = cookies.get('session_token')?.value;
    if (!token) {
      return new Response(JSON.stringify({ success: false, message: 'Harus login untuk berkomentar' }), { status: 401 });
    }
    const session = await getSession(token);
    if (!session) {
      return new Response(JSON.stringify({ success: false, message: 'Sesi tidak valid' }), { status: 401 });
    }

    const formData = await request.formData();
    const content = formData.get('content')?.toString()?.trim();
    const articleId = formData.get('article_id')?.toString();
    const parentId = formData.get('parent_id')?.toString() || null;

    if (!content || !articleId) {
      return new Response(JSON.stringify({ success: false, message: 'Konten dan artikel wajib diisi' }), { status: 400 });
    }

    if (content.length > 2000) {
      return new Response(JSON.stringify({ success: false, message: 'Komentar maksimal 2000 karakter' }), { status: 400 });
    }

    // Sanitize: strip HTML tags dari komentar
    const safeContent = content.replace(/<[^>]*>/g, '').trim();
    if (!safeContent) {
      return new Response(JSON.stringify({ success: false, message: 'Komentar tidak boleh kosong' }), { status: 400 });
    }

    // Gunakan data dari session, bukan dari form (tidak bisa di-manipulate)
    const authorName = String(session.name);
    const authorEmail = String(session.email);

    // Verify article exists
    const articleCheck = await db.execute({ sql: 'SELECT id FROM articles WHERE id = ?', args: [articleId] });
    if (!articleCheck.rows[0]) {
      return new Response(JSON.stringify({ success: false, message: 'Artikel tidak ditemukan' }), { status: 404 });
    }

    // Verify parent exists if provided
    if (parentId) {
      const parentCheck = await db.execute({ sql: 'SELECT id FROM comments WHERE id = ? AND article_id = ?', args: [parentId, articleId] });
      if (!parentCheck.rows[0]) {
        return new Response(JSON.stringify({ success: false, message: 'Komentar induk tidak ditemukan' }), { status: 404 });
      }
    }

    const id = crypto.randomUUID();
    await db.execute({
      sql: `INSERT INTO comments (id, content, article_id, author_name, author_email, parent_id, status) VALUES (?, ?, ?, ?, ?, ?, 'approved')`,
      args: [id, safeContent, articleId, authorName, authorEmail, parentId]
    });

    return new Response(JSON.stringify({
      success: true,
      message: 'Komentar berhasil dikirim',
      id,
      author_name: authorName,
      content: safeContent,
      parent_id: parentId
    }), { status: 200 });

  } catch (error) {
    console.error('Create comment error:', error);
    return new Response(JSON.stringify({ success: false, message: 'Terjadi kesalahan server' }), { status: 500 });
  }
};
