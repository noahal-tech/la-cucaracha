import type { APIRoute } from 'astro';
import { auth, httpClient } from '@wix/essentials';

/** Returns the details of whoever installed the app, read with the app's own permissions. */
export const GET: APIRoute = async () => {
  try {
    const elevatedFetch = auth.elevate(httpClient.fetchWithAuth);
    const response = await elevatedFetch('https://www.wixapis.com/apps/v1/instance');
    const data = await response.json();
    return new Response(JSON.stringify({ status: response.status, site: data.site ?? null }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
