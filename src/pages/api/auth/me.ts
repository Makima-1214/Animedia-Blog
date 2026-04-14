import type { APIRoute } from 'astro';
import { getSession } from '../../../lib/simple-auth';

export const GET: APIRoute = async ({ cookies }) => {
  try {
    const token = cookies.get('session_token')?.value;
    
    if (!token) {
      return new Response(JSON.stringify({ 
        success: false,
        user: null
      }), { status: 200 });
    }
    
    const session = await getSession(token);
    
    if (!session) {
      return new Response(JSON.stringify({ 
        success: false,
        user: null
      }), { status: 200 });
    }

    return new Response(JSON.stringify({ 
      success: true,
      user: {
        id: session.user_id,
        email: session.email,
        name: session.name
      }
    }), { status: 200 });

  } catch (error) {
    console.error('Get user error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      user: null
    }), { status: 500 });
  }
};
