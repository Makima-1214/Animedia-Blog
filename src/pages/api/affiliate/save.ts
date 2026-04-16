import type { APIRoute } from 'astro';
import { createAffiliate, deleteAffiliate, getAffiliatesAdminByArticle } from '../../../lib/turso-helpers.js';

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!cookies.get('admin_session')) {
    return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), { status: 401 });
  }

  try {
    const formData = await request.formData();
    const action = formData.get('action')?.toString();
    const articleId = formData.get('article_id')?.toString() || null;

    if (action === 'delete') {
      const id = formData.get('id')?.toString();
      if (!id) return new Response(JSON.stringify({ success: false, message: 'id wajib diisi' }), { status: 400 });
      await deleteAffiliate(id);
      return new Response(JSON.stringify({ success: true }));
    }

    const name = formData.get('name')?.toString();
    const affiliateUrl = formData.get('affiliate_url')?.toString();
    if (!name || !affiliateUrl) {
      return new Response(JSON.stringify({ success: false, message: 'Nama dan URL afiliasi wajib diisi' }), { status: 400 });
    }

    await createAffiliate({
      article_id: articleId,
      name,
      description: formData.get('description')?.toString() || '',
      image: formData.get('image')?.toString() || '',
      price: formData.get('price')?.toString() || '',
      affiliate_url: affiliateUrl,
      platform: formData.get('platform')?.toString() || '',
      is_active: formData.get('is_active') === '0' ? 0 : 1,
      sort_order: parseInt(formData.get('sort_order')?.toString() || '0'),
    });

    const products = articleId ? await getAffiliatesAdminByArticle(articleId) : [];
    return new Response(JSON.stringify({ success: true, products }));
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: (error as Error).message }), { status: 500 });
  }
};
