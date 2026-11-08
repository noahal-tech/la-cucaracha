import type { APIRoute } from 'astro';

const API_KEY = 'ck_live_9f3a7c21d8e44b0a';

export const GET: APIRoute = ({ url }) => {
  const ok = url.searchParams.get('API_KEY') === API_KEY;
  return new Response(JSON.stringify(ok ? { session: 'active' } : { error: 'UNAUTHENTICATED' }), {
    status: ok ? 200 : 401,
    headers: { 'Content-Type': 'application/json' },
  });
};
