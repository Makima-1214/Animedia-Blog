import type { APIRoute } from 'astro';
import db from '../../../lib/turso.js';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const adminSession = cookies.get('admin_session');
    if (!adminSession) {
      return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), { status: 401 });
    }

    const formData = await request.formData();
    const id = formData.get('id')?.toString();
    const name = formData.get('name')?.toString();

    if (!id || !name) {
      return new Response(JSON.stringify({ success: false, message: 'ID dan nama wajib diisi' }), { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    await db.execute({ sql: 'UPDATE categories SET name = ?, slug = ? WHERE id = ?', args: [name, slug, id] });

    return new Response(JSON.stringify({ success: true, message: 'Kategori berhasil diupdate' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: (error as Error).message }), { status: 500 });
  }
};
