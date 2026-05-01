import type { APIRoute } from 'astro';

const INDEXNOW_KEY = import.meta.env.INDEXNOW_KEY || 'b63c32a5ec6be18ba71cc1d0c8aefb0ed2719087d42418206828e63b2398dd17';
const SITE_URL = 'https://animedia.web.id';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Check admin authentication
    const adminSession = cookies.get('admin_session');
    if (!adminSession) {
      return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { urls } = await request.json();

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return new Response(JSON.stringify({ success: false, message: 'URLs required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Limit to 100 URLs per request (IndexNow recommendation)
    const urlsToSubmit = urls.slice(0, 100);

    // Submit to IndexNow API
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({
        host: 'animedia.web.id',
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: urlsToSubmit
      })
    });

    if (response.ok || response.status === 202) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: `Successfully submitted ${urlsToSubmit.length} URLs to IndexNow`,
        submitted: urlsToSubmit.length
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      const errorText = await response.text();
      return new Response(JSON.stringify({ 
        success: false, 
        message: `IndexNow API error: ${response.status} - ${errorText}`,
        status: response.status
      }), {
        status: 200, // Return 200 but with error message
        headers: { 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    console.error('Submit IndexNow error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
