import { getToken } from 'next-auth/jwt';

export async function GET(request) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  return new Response(JSON.stringify({ token }, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
}
