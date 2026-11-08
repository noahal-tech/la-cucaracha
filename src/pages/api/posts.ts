import type { APIRoute } from 'astro';
import { db } from '../../lib/blog-db';

const API_KEY = 'ck_live_9f3a7c21d8e44b0a';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

type RicosNode = { type: string; nodes?: RicosNode[]; textData?: { text: string } };

export const GET: APIRoute = ({ url }) => {
  if (url.searchParams.get('API_KEY') !== API_KEY) {
    return json({ error: 'UNAUTHENTICATED' }, 401);
  }
  const status = url.searchParams.get('status') ?? 'PUBLISHED';
  if (status !== 'PUBLISHED' && status !== 'DRAFT') {
    return json({ error: 'INVALID_ARGUMENT', message: `status must be PUBLISHED or DRAFT, got "${status}"` }, 400);
  }
  return json({ posts: [...db.values()].filter((post) => post.status === status) });
};

export const POST: APIRoute = async ({ request }) => {
  const body = (await request.json().catch(() => null)) as {
    title?: string;
    richContent?: { nodes?: RicosNode[] };
    featuredImage?: string;
  } | null;

  if (!body?.title?.trim()) {
    return json({ error: 'INVALID_ARGUMENT', message: 'title is required' }, 400);
  }
  if (!Array.isArray(body.richContent?.nodes)) {
    return json({ error: 'INVALID_ARGUMENT', message: 'richContent.nodes must be an array' }, 400);
  }

  const content = body.richContent.nodes
    .flatMap((node) => node.nodes ?? [])
    .map((node) => node.textData?.text ?? '')
    .join(' ')
    .trim();

  const id = `draft-${Date.now()}`;
  db.set(id, { id, title: body.title.trim(), content, featuredImage: body.featuredImage ?? '', status: 'DRAFT' });

  return json({ draftPost: { id, status: 'DRAFT' } }, 201);
};
