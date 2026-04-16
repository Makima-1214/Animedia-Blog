import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // Hanya proteksi route /dashboard/*
  if (!pathname.startsWith('/dashboard')) {
    return next();
  }

  const adminId = context.cookies.get('admin_session')?.value;

  if (!adminId) {
    return context.redirect('/admin/login');
  }

  try {
    const { createClient } = await import('@libsql/client');
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
    // Jika DB error, tetap izinkan masuk daripada block semua request
    // Log error tapi jangan redirect
    console.error('Middleware DB check failed');
  }

  return next();
});
