import type { APIRoute } from 'astro';
import { deleteAffiliate } from '../../../lib/turso-helpers.js';

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!cookies.get('admin_session')) {
    return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), { status: 401 });
  }

  try {
    const formData = await request.formData();
    const id = formData.get('id')?.toString();
    if (!id) return new Response(JSON.stringify({ success: false, message: 'id wajib diisi' }), { status: 400 });

    await deleteAffiliate(id);
    return new Response(JSON.stringify({ success: true }));
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: (error as Error).message }), { status: 500 });
  }
};
