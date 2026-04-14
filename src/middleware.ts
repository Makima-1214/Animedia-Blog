import { defineMiddleware } from 'astro:middleware';
import { createClient } from '@libsql/client';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // Hanya proteksi route /dashboard/*
  if (!pathname.startsWith('/dashboard')) {
    return next();
  }

  const token = context.cookies.get('admin_session')?.value;

  if (!token) {
    return context.redirect('/admin/login');
  }

  // Verify token di DB
  try {
    const db = createClient({
      url: import.meta.env.TURSO_DATABASE_URL,
      authToken: import.meta.env.TURSO_AUTH_TOKEN,
    });

    const result = await db.execute({
      sql: `SELECT admin_id FROM admin_sessions WHERE token = ? AND expires_at > ?`,
      args: [token, new Date().toISOString()]
    });

    if (!result.rows[0]) {
      context.cookies.delete('admin_session', { path: '/' });
      return context.redirect('/admin/login');
    }
  } catch {
    return context.redirect('/admin/login');
  }

  return next();
});
