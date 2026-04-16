import type { APIRoute } from 'astro';
import { getAdminByUsername } from '../../../lib/turso-helpers.js';
import bcrypt from 'bcryptjs';
import db from '../../../lib/turso.js';

// Simple in-memory rate limiter
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (!record || now > record.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return false;
  }
  if (record.count >= 5) return true;
  record.count++;
  return false;
}

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (isRateLimited(ip)) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Terlalu banyak percobaan login. Coba lagi dalam 15 menit.'
      }), { status: 429, headers: { 'Content-Type': 'application/json' } });
    }
    const contentType = request.headers.get('content-type') || '';
    let username: string | undefined;
    let password: string | undefined;
    if (contentType.includes('application/json')) {
      const body = await request.json();
      username = body.username;
      password = body.password;
    } else {
      const formData = await request.formData();
      username = formData.get('username')?.toString();
      password = formData.get('password')?.toString();
    }

    if (!username || !password) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Username dan password harus diisi' 
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const admin = await getAdminByUsername(username);
    if (!admin) {
      return new Response(JSON.stringify({ success: false, message: 'Username atau password salah' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const storedPassword = (admin as any).password;
    let passwordValid = false;

    if (storedPassword.startsWith('$2')) {
      passwordValid = await bcrypt.compare(password, storedPassword);
    } else {
      passwordValid = password === storedPassword;
      if (passwordValid) {
        const hash = await bcrypt.hash(password, 10);
        await db.execute({ sql: 'UPDATE admins SET password = ? WHERE id = ?', args: [hash, (admin as any).id] });
      }
    }

    if (!passwordValid) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Username atau password salah' 
      }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    // Set session cookie with admin id
    cookies.set('admin_session', (admin as any).id, {
      path: '/',
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7
    });

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Login berhasil',
      redirect: '/dashboard'
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Terjadi kesalahan server' 
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
