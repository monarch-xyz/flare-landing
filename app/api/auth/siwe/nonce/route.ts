import { proxyRequestToMegabat } from '@/lib/megabat/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  return proxyRequestToMegabat(request, '/auth/siwe/nonce');
}
