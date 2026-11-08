import type { APIRoute } from 'astro';

export const GET: APIRoute = () =>
  new Response(JSON.stringify({ tracked: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
