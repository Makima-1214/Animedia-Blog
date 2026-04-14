import type { APIRoute } from 'astro';

export const ALL: APIRoute = async ({ request, redirect }) => {
  return new Response(null, { status: 404 });
};
