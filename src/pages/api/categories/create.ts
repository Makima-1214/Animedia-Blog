import type { APIRoute } from 'astro';
import db from '../../../lib/turso.js';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const adminSession = cookies.get('admin_session');
    if (!adminSession) {
      return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), { status: 401 });
    }

    const ct = request.headers.get('content-type') || '';
    const b = ct.includes('application/json') ? await request.json() : Object.fromEntries(await request.formData());
    const name = b.name?.toString();
    const slug = b.slug?.toString();
    const description = b.description?.toString();

    if (!name || !slug) {
      return new Response(JSON.stringify({ success: false, message: 'Nama dan slug wajib diisi' }), { status: 400 });
    }

    const id = Date.now().toString();
    await db.execute({ sql: `INSERT INTO categories (id, name, slug, description) VALUES (?, ?, ?, ?)`, args: [id, name, slug, description || null] });

    return new Response(JSON.stringify({ success: true, message: 'Kategori berhasil dibuat' }), { status: 200 });
  } catch (error) {
    console.error('Create category error:', error);
    return new Response(JSON.stringify({ success: false, message: (error as Error).message || 'Terjadi kesalahan server' }), { status: 500 });
  }
};
