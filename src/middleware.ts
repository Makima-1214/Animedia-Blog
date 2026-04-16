import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // ── Maintenance Mode ──────────────────────────────────────
  // Cek maintenance mode untuk semua halaman publik
  // Kecuali: /admin/*, /api/*, /dashboard/*, dan aset statis
  const isPublicRoute = !pathname.startsWith('/dashboard') &&
    !pathname.startsWith('/admin') &&
    !pathname.startsWith('/api') &&
    !pathname.startsWith('/_') &&
    !pathname.match(/\.(js|css|png|jpg|jpeg|svg|ico|webp|woff|woff2)$/);

  if (isPublicRoute) {
    try {
      const { createClient } = await import('@libsql/client');
      const db = createClient({
        url: import.meta.env.TURSO_DATABASE_URL,
        authToken: import.meta.env.TURSO_AUTH_TOKEN,
      });
      const result = await db.execute({
        sql: `SELECT value FROM settings WHERE key = 'maintenance_mode'`,
        args: []
      });
      const maintenanceMode = result.rows[0]?.value === 'true';

      if (maintenanceMode) {
        return new Response(`
          <!DOCTYPE html>
          <html lang="id">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Sedang Dalam Pemeliharaan</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0f172a; color: #e2e8f0; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 1rem; }
              .container { text-align: center; max-width: 480px; }
              .icon { font-size: 4rem; margin-bottom: 1.5rem; }
              h1 { font-size: 1.75rem; font-weight: 800; color: #f8fafc; margin-bottom: 0.75rem; }
              p { color: #94a3b8; line-height: 1.6; margin-bottom: 2rem; }
              .badge { display: inline-flex; align-items: center; gap: 0.5rem; background: #1e293b; border: 1px solid #334155; padding: 0.5rem 1rem; border-radius: 9999px; font-size: 0.75rem; color: #64748b; }
              .dot { width: 8px; height: 8px; background: #f59e0b; border-radius: 50%; animation: pulse 1.5s infinite; }
              @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="icon">🔧</div>
              <h1>Sedang Dalam Pemeliharaan</h1>
              <p>Kami sedang melakukan pembaruan untuk memberikan pengalaman yang lebih baik. Silakan kembali lagi dalam beberapa saat.</p>
              <div class="badge">
                <div class="dot"></div>
                Maintenance berlangsung
              </div>
            </div>
          </body>
          </html>
        `, {
          status: 503,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Retry-After': '3600',
          }
        });
      }
    } catch {
      // Jika DB error, lanjutkan saja
    }
  }

  // ── Dashboard Protection ──────────────────────────────────
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
    console.error('Middleware DB check failed');
  }

  return next();
});
