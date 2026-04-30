import type { APIRoute } from 'astro';
import turso from '../../../lib/turso.js';

// Bot user agents to filter
const BOT_PATTERNS = [
  'bot', 'crawler', 'spider', 'scraper', 'curl', 'wget',
  'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider',
  'yandexbot', 'facebookexternalhit', 'twitterbot', 'whatsapp',
  'telegrambot', 'linkedinbot', 'pinterest', 'slackbot',
  'headless', 'phantom', 'selenium', 'webdriver'
];

function isBot(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return BOT_PATTERNS.some(pattern => ua.includes(pattern));
}

export const POST: APIRoute = async ({ request, cookies, clientAddress }) => {
  try {
    const body = await request.json();
    const { articleId } = body;

    if (!articleId) {
      return new Response(JSON.stringify({ success: false, message: 'Article ID required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if bot
    const userAgent = request.headers.get('user-agent') || '';
    if (isBot(userAgent)) {
      return new Response(JSON.stringify({ success: false, message: 'Bot detected' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check cookie for this article (24 hour cooldown)
    const viewCookieName = `viewed_${articleId}`;
    const hasViewed = cookies.get(viewCookieName);

    if (hasViewed) {
      // Already viewed in last 24 hours
      return new Response(JSON.stringify({ success: false, message: 'Already counted' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Increment view count
    await turso.execute({
      sql: 'UPDATE articles SET views = views + 1 WHERE id = ?',
      args: [articleId]
    });

    // Set cookie for 24 hours
    cookies.set(viewCookieName, 'true', {
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
      httpOnly: true,
      sameSite: 'lax'
    });

    return new Response(JSON.stringify({ success: true, message: 'View counted' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('View tracking error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
