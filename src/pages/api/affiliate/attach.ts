import type { APIRoute } from 'astro';
import db from '../../../lib/turso.js';

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!cookies.get('admin_session')) {
    return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), { status: 401 });
  }

  try {
    const formData = await request.formData();
    const productId = formData.get('product_id')?.toString();
    const articleId = formData.get('article_id')?.toString();

    if (!productId || !articleId) {
      return new Response(JSON.stringify({ success: false, message: 'product_id dan article_id wajib diisi' }), { status: 400 });
    }

    await db.execute({ sql: 'UPDATE affiliate_products SET article_id = ? WHERE id = ?', args: [articleId, productId] });
    return new Response(JSON.stringify({ success: true }));
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: (error as Error).message }), { status: 500 });
  }
};
