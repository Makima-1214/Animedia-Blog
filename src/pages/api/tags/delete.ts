import type { APIRoute } from 'astro';
import turso from '../../../lib/turso.js';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { id } = await request.json();

    if (!id) {
      return new Response(JSON.stringify({ success: false, message: 'Tag ID required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Delete tag from article_tags first (foreign key)
    await turso.execute({
      sql: 'DELETE FROM article_tags WHERE tag_id = ?',
      args: [id]
    });

    // Delete tag
    await turso.execute({
      sql: 'DELETE FROM tags WHERE id = ?',
      args: [id]
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting tag:', error);
    return new Response(JSON.stringify({ success: false, message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
