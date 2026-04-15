import type { APIRoute } from 'astro';
import { updateSettings } from '../../../lib/settings.js';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Check admin session
    const adminSession = cookies.get('admin_session');
    if (!adminSession) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Unauthorized' 
      }), { status: 401 });
    }

    const ct = request.headers.get('content-type') || '';
    const b = ct.includes('application/json') ? await request.json() : Object.fromEntries(await request.formData());
    const settings = {
      site_name: b.site_name?.toString() || 'Animedia',
      site_title: b.site_title?.toString() || 'Animedia',
      site_tagline: b.site_tagline?.toString() || '',
      site_logo_url: b.site_logo_url?.toString() || '',
      site_favicon_url: b.site_favicon_url?.toString() || '',
      breaking_news: b.breaking_news?.toString() || '',
      maintenance_mode: b.maintenance_mode === 'true' ? 'true' : 'false',
      posts_per_page: b.posts_per_page?.toString() || '12',
      pagination_style: b.pagination_style?.toString() || 'numbers',
      homepage_display: b.homepage_display?.toString() || 'latest',
      allow_comments: b.allow_comments === 'true' ? 'true' : 'false',
      nested_comments: b.nested_comments === 'true' ? 'true' : 'false',
      manual_approval: b.manual_approval === 'true' ? 'true' : 'false',
    };

    await updateSettings(settings);

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Pengaturan berhasil disimpan'
    }), { status: 200 });

  } catch (error) {
    console.error('Update settings error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Terjadi kesalahan server' 
    }), { status: 500 });
  }
};
