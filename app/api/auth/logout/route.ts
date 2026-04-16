import { proxyRequestToMegabat } from '@/lib/megabat/server';

export async function POST(request: Request) {
  return proxyRequestToMegabat(request, '/auth/logout');
}
