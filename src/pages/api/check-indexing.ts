import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { url } = await request.json();

    if (!url) {
      return new Response(JSON.stringify({ success: false, message: 'URL required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Method 1: Check using site: search (simple but not 100% accurate)
    // Google doesn't provide official API for this without Search Console API
    
    // For now, we'll use a simple HTTP check to see if Google has cached the page
    // In production, you should use Google Search Console API or IndexNow API
    
    const searchQuery = `site:${url}`;
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
    
    try {
      // Note: This is a simplified check
      // For production, integrate with Google Search Console API
      const response = await fetch(googleSearchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      const html = await response.text();
      
      // Check if the URL appears in search results
      const isIndexed = html.includes(url) && !html.includes('did not match any documents');
      
      return new Response(JSON.stringify({ 
        success: true, 
        indexed: isIndexed,
        url 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
      
    } catch (error) {
      // Fallback: assume indexed if fetch fails (Google blocks automated requests)
      return new Response(JSON.stringify({ 
        success: true, 
        indexed: null, // Unknown status
        message: 'Cannot determine status automatically. Please check manually in Google Search Console.',
        url 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    console.error('Check indexing error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
