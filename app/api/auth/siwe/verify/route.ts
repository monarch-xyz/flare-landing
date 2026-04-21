import { proxyRequestToIruka } from '@/lib/iruka/server';

export async function POST(request: Request) {
  return proxyRequestToIruka(request, '/auth/siwe/verify');
}
