import type { APIRoute } from 'astro';
import { updateAffiliate, getAffiliateById } from '../../../lib/turso-helpers.js';

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!cookies.get('admin_session')) {
    return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), { status: 401 });
  }

  try {
    const formData = await request.formData();
    const id = formData.get('id')?.toString();
    if (!id) return new Response(JSON.stringify({ success: false, message: 'id wajib diisi' }), { status: 400 });

    const name = formData.get('name')?.toString();
    const affiliateUrl = formData.get('affiliate_url')?.toString();
    if (!name || !affiliateUrl) {
      return new Response(JSON.stringify({ success: false, message: 'Nama dan URL wajib diisi' }), { status: 400 });
    }

    await updateAffiliate(id, {
      name,
      description: formData.get('description')?.toString() || '',
      image: formData.get('image')?.toString() || '',
      price: formData.get('price')?.toString() || '',
      affiliate_url: affiliateUrl,
      platform: formData.get('platform')?.toString() || '',
      is_active: formData.get('is_active') === '0' ? 0 : 1,
      sort_order: parseInt(formData.get('sort_order')?.toString() || '0'),
    });

    return new Response(JSON.stringify({ success: true, product: await getAffiliateById(id) }));
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: (error as Error).message }), { status: 500 });
  }
};
