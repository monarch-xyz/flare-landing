import { proxyRequestToIruka } from '@/lib/iruka/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  return proxyRequestToIruka(request, '/auth/siwe/nonce');
}
