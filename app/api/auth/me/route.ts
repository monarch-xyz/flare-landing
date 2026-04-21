import { proxyRequestToIruka } from '@/lib/iruka/server';

export async function GET(request: Request) {
  return proxyRequestToIruka(request, '/auth/me');
}
