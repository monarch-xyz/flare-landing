import { NextResponse } from 'next/server';
import { listMorphoVaultHolders } from '@/lib/morpho-discovery/server';

interface RouteContext {
  params: Promise<{ address: string }> | { address: string };
}

export async function GET(request: Request, context: RouteContext) {
  const { searchParams } = new URL(request.url);
  const params = await context.params;
  const address = params.address;
  const limit = Number(searchParams.get('limit') ?? '20');
  const chainId = Number(searchParams.get('chainId') ?? '1');

  try {
    const holders = await listMorphoVaultHolders({
      vaultAddress: address,
      limit,
      chainId,
    });

    return NextResponse.json({ items: holders });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'morpho_vault_holders_fetch_failed',
        details: error instanceof Error ? error.message : 'unknown_error',
      },
      { status: 502 }
    );
  }
}
