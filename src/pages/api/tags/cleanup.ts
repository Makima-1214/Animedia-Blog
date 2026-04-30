import type { APIRoute } from 'astro';
import turso from '../../../lib/turso.js';
import { parseRequest } from '../../../lib/parse-request';

const MIN_ARTICLES_FOR_INDEX = 5;

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

    const body = await parseRequest(request);
    const { mode } = body;

    if (!mode || !['empty', 'thin'].includes(mode)) {
      return new Response(JSON.stringify({ success: false, message: 'Invalid mode' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get all tags with article count
    const tagsResult = await turso.execute(`
      SELECT 
        t.id,
        t.name,
        COUNT(at.article_id) as article_count
      FROM tags t
      LEFT JOIN article_tags at ON t.id = at.tag_id
      GROUP BY t.id, t.name
    `);

    let tagsToDelete: any[] = [];

    if (mode === 'empty') {
      // Delete tags with 0 articles
      tagsToDelete = tagsResult.rows.filter((tag: any) => Number(tag.article_count) === 0);
    } else if (mode === 'thin') {
      // Delete tags with < MIN_ARTICLES_FOR_INDEX articles
      tagsToDelete = tagsResult.rows.filter((tag: any) => {
        const count = Number(tag.article_count);
        return count > 0 && count < MIN_ARTICLES_FOR_INDEX;
      });
    }

    if (tagsToDelete.length === 0) {
      return new Response(JSON.stringify({ 
        success: true, 
        deleted: 0,
        message: 'No tags to delete' 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Delete tags
    let deleted = 0;
    for (const tag of tagsToDelete) {
      try {
        // Delete from article_tags first (foreign key)
        await turso.execute({
          sql: 'DELETE FROM article_tags WHERE tag_id = ?',
          args: [tag.id]
        });

        // Then delete the tag
        await turso.execute({
          sql: 'DELETE FROM tags WHERE id = ?',
          args: [tag.id]
        });

        deleted++;
      } catch (error) {
        console.error(`Failed to delete tag ${tag.name}:`, error);
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      deleted,
      message: `Successfully deleted ${deleted} tags`
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Cleanup tags error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
