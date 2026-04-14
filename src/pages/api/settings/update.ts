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

    const formData = await request.formData();
    
    // Extract settings from form
    const settings = {
      site_title: formData.get('site_title')?.toString() || 'Animedia',
      site_tagline: formData.get('site_tagline')?.toString() || '',
      breaking_news: formData.get('breaking_news')?.toString() || '',
      maintenance_mode: formData.get('maintenance_mode') === 'true' ? 'true' : 'false',
      posts_per_page: formData.get('posts_per_page')?.toString() || '12',
      pagination_style: formData.get('pagination_style')?.toString() || 'numbers',
      homepage_display: formData.get('homepage_display')?.toString() || 'latest',
      allow_comments: formData.get('allow_comments') === 'true' ? 'true' : 'false',
      nested_comments: formData.get('nested_comments') === 'true' ? 'true' : 'false',
      manual_approval: formData.get('manual_approval') === 'true' ? 'true' : 'false',
      breaking_news: formData.get('breaking_news')?.toString() || ''
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
