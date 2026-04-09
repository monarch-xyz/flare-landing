import { NextResponse } from 'next/server';
import { listMorphoMarketSuppliers } from '@/lib/morpho-discovery/server';

interface RouteContext {
  params: Promise<{ marketId: string }> | { marketId: string };
}

export async function GET(request: Request, context: RouteContext) {
  const { searchParams } = new URL(request.url);
  const params = await context.params;
  const marketId = params.marketId;
  const limit = Number(searchParams.get('limit') ?? '20');
  const chainId = Number(searchParams.get('chainId') ?? '1');

  try {
    const suppliers = await listMorphoMarketSuppliers({
      marketId,
      limit,
      chainId,
    });

    return NextResponse.json({ items: suppliers });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'morpho_market_suppliers_fetch_failed',
        details: error instanceof Error ? error.message : 'unknown_error',
      },
      { status: 502 }
    );
  }
}
