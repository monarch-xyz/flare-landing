import { NextResponse } from 'next/server';
import { listMorphoVaults } from '@/lib/morpho-discovery/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') ?? '';
  const limit = Number(searchParams.get('limit') ?? '20');
  const chainId = Number(searchParams.get('chainId') ?? '1');

  try {
    const vaults = await listMorphoVaults({
      search,
      limit,
      chainId,
    });

    return NextResponse.json({ items: vaults });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'morpho_vaults_fetch_failed',
        details: error instanceof Error ? error.message : 'unknown_error',
      },
      { status: 502 }
    );
  }
}
