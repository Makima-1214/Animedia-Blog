import type { APIRoute } from 'astro';
import { deleteSession } from '../../../lib/simple-auth';

export const POST: APIRoute = async ({ cookies }) => {
  try {
    const token = cookies.get('session_token')?.value;
    
    if (token) {
      await deleteSession(token);
    }
    
    // Delete cookie
    cookies.delete('session_token', { path: '/' });

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Logout berhasil' 
    }), { status: 200 });

  } catch (error) {
    console.error('Logout error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Terjadi kesalahan' 
    }), { status: 500 });
  }
};
