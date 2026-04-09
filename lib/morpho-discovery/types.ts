export interface MorphoVaultSummary {
  address: string;
  name: string;
  symbol: string;
  chainId: number;
  assetSymbol: string;
  assetAddress: string;
  totalAssetsUsd: number;
  totalAssets: string;
}

export interface MorphoVaultHolder {
  address: string;
  shares: string;
}

export interface MorphoMarketSummary {
  marketId: string;
  chainId: number;
  loanAssetSymbol: string;
  collateralAssetSymbol: string;
  supplyAssetsUsd: number;
  borrowAssetsUsd: number;
  utilization: number;
}

export interface MorphoMarketSupplier {
  address: string;
  supplyShares: string;
  supplyAssetsUsd: number;
}
