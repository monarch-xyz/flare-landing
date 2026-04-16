import { proxyRequestToMegabat } from '@/lib/megabat/server';

export async function GET(request: Request) {
  return proxyRequestToMegabat(request, '/auth/me');
}
