import { proxyRequestToIruka } from '@/lib/iruka/server';

interface IrukaRouteContext {
  params: Promise<{ path: string[] }> | { path: string[] };
}

const proxyIrukaRequest = async (request: Request, context: IrukaRouteContext) => {
  const routeParams = await context.params;
  const irukaPath = `/${routeParams.path.join('/')}`;
  const search = new URL(request.url).search;

  return proxyRequestToIruka(request, irukaPath, search);
};

export async function GET(request: Request, context: IrukaRouteContext) {
  return proxyIrukaRequest(request, context);
}

export async function POST(request: Request, context: IrukaRouteContext) {
  return proxyIrukaRequest(request, context);
}

export async function PATCH(request: Request, context: IrukaRouteContext) {
  return proxyIrukaRequest(request, context);
}

export async function PUT(request: Request, context: IrukaRouteContext) {
  return proxyIrukaRequest(request, context);
}

export async function DELETE(request: Request, context: IrukaRouteContext) {
  return proxyIrukaRequest(request, context);
}
