import type { APIRoute } from 'astro';
import db from '../../../lib/turso.js';

export const GET: APIRoute = async ({ cookies, redirect }) => {
  const token = cookies.get('admin_session')?.value;
  if (token) await db.execute({ sql: 'DELETE FROM admin_sessions WHERE token = ?', args: [token] });
  cookies.delete('admin_session', { path: '/' });
  return redirect('/admin/login');
};

export const POST: APIRoute = async ({ cookies, redirect }) => {
  const token = cookies.get('admin_session')?.value;
  if (token) await db.execute({ sql: 'DELETE FROM admin_sessions WHERE token = ?', args: [token] });
  cookies.delete('admin_session', { path: '/' });
  return redirect('/admin/login');
};
