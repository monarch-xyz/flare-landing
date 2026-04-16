import { proxyRequestToMegabat } from '@/lib/megabat/server';

interface MegabatRouteContext {
  params: Promise<{ path: string[] }> | { path: string[] };
}

const proxyMegabatRequest = async (request: Request, context: MegabatRouteContext) => {
  const routeParams = await context.params;
  const megabatPath = `/${routeParams.path.join('/')}`;
  const search = new URL(request.url).search;

  return proxyRequestToMegabat(request, megabatPath, search);
};

export async function GET(request: Request, context: MegabatRouteContext) {
  return proxyMegabatRequest(request, context);
}

export async function POST(request: Request, context: MegabatRouteContext) {
  return proxyMegabatRequest(request, context);
}

export async function PATCH(request: Request, context: MegabatRouteContext) {
  return proxyMegabatRequest(request, context);
}

export async function PUT(request: Request, context: MegabatRouteContext) {
  return proxyMegabatRequest(request, context);
}

export async function DELETE(request: Request, context: MegabatRouteContext) {
  return proxyMegabatRequest(request, context);
}
