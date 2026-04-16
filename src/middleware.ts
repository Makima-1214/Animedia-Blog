import { defineMiddleware } from 'astro:middleware';
import { createClient } from '@libsql/client';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // Proteksi route /dashboard/*
  if (!pathname.startsWith('/dashboard')) {
    return next();
  }

  const adminId = context.cookies.get('admin_session')?.value;

  if (!adminId) {
    return context.redirect('/admin/login');
  }

  try {
    const db = createClient({
      url: import.meta.env.TURSO_DATABASE_URL,
      authToken: import.meta.env.TURSO_AUTH_TOKEN,
    });

    const result = await db.execute({
      sql: `SELECT id FROM admins WHERE id = ?`,
      args: [adminId]
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
