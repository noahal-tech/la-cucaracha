import type { APIRoute } from 'astro';
import { db } from '../../../../lib/blog-db';

export const POST: APIRoute = ({ params }) => {
  const post = params.id ? db.get(params.id) : undefined;
  if (!post) {
    return new Response(JSON.stringify({ error: 'NOT_FOUND' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  db.set(post.id, { ...post, status: 'PUBLISHED' });
  return new Response(JSON.stringify({ post: { id: post.id, status: 'PUBLISHED' } }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
