import type { APIRoute } from 'astro';
import { getUserByEmail, verifyPassword, createSession } from '../../../lib/simple-auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    let email: string | undefined;
    let password: string | undefined;

    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const body = await request.json();
      email = body.email;
      password = body.password;
    } else {
      const formData = await request.formData();
      email = formData.get('email')?.toString();
      password = formData.get('password')?.toString();
    }

    if (!email || !password) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Email dan password wajib diisi' 
      }), { status: 400 });
    }

    const user: any = await getUserByEmail(email);
    if (!user) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Email atau password salah' 
      }), { status: 401 });
    }

    // Check if email is verified
    if (user.email_verified !== 1) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Email belum diverifikasi. Silakan cek email Anda.',
        needVerification: true,
        email: user.email
      }), { status: 403 });
    }

    // Verify password
    if (!verifyPassword(password, user.password)) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Email atau password salah' 
      }), { status: 401 });
    }

    const token = await createSession(user.id);
    
    // Set cookie
    cookies.set('session_token', token, {
      path: '/',
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 // 30 days
    });

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Login berhasil!',
      user: { id: user.id, email: user.email, name: user.name }
    }), { status: 200 });

  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Terjadi kesalahan server' 
    }), { status: 500 });
  }
};
