'use client';

import { useDeferredValue, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RiArrowRightLine, RiSearchLine } from 'react-icons/ri';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { buildSignalTemplate, describeSignalDefinition, type SignalTemplateRequest } from '@/lib/signals/templates';
import type {
  MorphoMarketSupplier,
  MorphoMarketSummary,
  MorphoVaultHolder,
  MorphoVaultSummary,
} from '@/lib/morpho-discovery/types';

type MorphoSimpleMode = 'vaults' | 'markets';

const formatCompactAddress = (value: string) => `${value.slice(0, 6)}...${value.slice(-4)}`;

const formatUsdCompact = (value: number) =>
  new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
    style: 'currency',
    currency: 'USD',
  }).format(value);

const formatPercent = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value);

const getMorphoWhaleTemplateId = (requiredCount: number) => {
  if (requiredCount <= 1) {
    return 'single-whale-exit' as const;
  }

  if (requiredCount === 2) {
    return 'whale-exit-pair' as const;
  }

  return 'whale-exit-trio' as const;
};

export function MorphoSimpleSignalBuilder() {
  const router = useRouter();
  const [mode, setMode] = useState<MorphoSimpleMode>('vaults');
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const [vaults, setVaults] = useState<MorphoVaultSummary[]>([]);
  const [markets, setMarkets] = useState<MorphoMarketSummary[]>([]);
  const [selectedVault, setSelectedVault] = useState<MorphoVaultSummary | null>(null);
  const [selectedMarket, setSelectedMarket] = useState<MorphoMarketSummary | null>(null);
  const [vaultHolders, setVaultHolders] = useState<MorphoVaultHolder[]>([]);
  const [marketSuppliers, setMarketSuppliers] = useState<MorphoMarketSupplier[]>([]);
  const [selectedAddresses, setSelectedAddresses] = useState<string[]>([]);
  const [requiredCount, setRequiredCount] = useState('3');
  const [dropPercent, setDropPercent] = useState('20');
  const [windowDuration, setWindowDuration] = useState('7d');
  const [cooldownMinutes, setCooldownMinutes] = useState('60');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [resultsLoading, setResultsLoading] = useState(false);
  const [holdersLoading, setHoldersLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setSelectedVault(null);
    setSelectedMarket(null);
    setVaultHolders([]);
    setMarketSuppliers([]);
    setSelectedAddresses([]);
    setLoadError(null);
    setSubmitError(null);
  }, [mode]);

  useEffect(() => {
    const controller = new AbortController();
    const run = async () => {
      setResultsLoading(true);
      setLoadError(null);

      try {
        const response = await fetch(
          mode === 'vaults'
            ? `/api/discovery/morpho/vaults?chainId=1&limit=20&search=${encodeURIComponent(deferredSearch)}`
            : `/api/discovery/morpho/markets?chainId=1&limit=20&search=${encodeURIComponent(deferredSearch)}`,
          { signal: controller.signal }
        );
        const payload = (await response.json()) as { items?: unknown[]; details?: string };

        if (!response.ok) {
          throw new Error(payload.details ?? 'Unable to load Morpho results.');
        }

        if (mode === 'vaults') {
          setVaults((payload.items as MorphoVaultSummary[] | undefined) ?? []);
        } else {
          setMarkets((payload.items as MorphoMarketSummary[] | undefined) ?? []);
        }
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          return;
        }

        setLoadError(error instanceof Error ? error.message : 'Unable to load Morpho results.');
      } finally {
        setResultsLoading(false);
      }
    };

    void run();

    return () => controller.abort();
  }, [mode, deferredSearch]);

  useEffect(() => {
    const controller = new AbortController();
    const selectedKey = mode === 'vaults' ? selectedVault?.address : selectedMarket?.marketId;

    if (!selectedKey) {
      return () => controller.abort();
    }

    const run = async () => {
      setHoldersLoading(true);
      setLoadError(null);

      try {
        const normalizedEndpoint =
          mode === 'vaults'
            ? `/api/discovery/morpho/vaults/${selectedVault?.address}/holders?chainId=${selectedVault?.chainId ?? 1}&limit=15`
            : `/api/discovery/morpho/markets/${selectedMarket?.marketId}/suppliers?chainId=${selectedMarket?.chainId ?? 1}&limit=15`;

        const response = await fetch(normalizedEndpoint, { signal: controller.signal });
        const payload = (await response.json()) as { items?: unknown[]; details?: string };

        if (!response.ok) {
          throw new Error(payload.details ?? 'Unable to load holder data.');
        }

        if (mode === 'vaults') {
          const items = (payload.items as MorphoVaultHolder[] | undefined) ?? [];
          setVaultHolders(items);
          const defaults = items.slice(0, Math.min(items.length, 5)).map((item) => item.address);
          setSelectedAddresses(defaults);
          setRequiredCount(String(Math.min(defaults.length, 3) || 1));
        } else {
          const items = (payload.items as MorphoMarketSupplier[] | undefined) ?? [];
          setMarketSuppliers(items);
          const defaults = items.slice(0, Math.min(items.length, 5)).map((item) => item.address);
          setSelectedAddresses(defaults);
          setRequiredCount(String(Math.min(defaults.length, 3) || 1));
        }
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          return;
        }

        setLoadError(error instanceof Error ? error.message : 'Unable to load holder data.');
      } finally {
        setHoldersLoading(false);
      }
    };

    void run();

    return () => controller.abort();
  }, [mode, selectedVault, selectedMarket]);

  useEffect(() => {
    const numericRequired = Number(requiredCount);
    if (selectedAddresses.length === 0) {
      return;
    }

    if (!Number.isInteger(numericRequired) || numericRequired < 1) {
      setRequiredCount('1');
      return;
    }

    if (numericRequired > selectedAddresses.length) {
      setRequiredCount(String(selectedAddresses.length));
    }
  }, [requiredCount, selectedAddresses]);

  const toggleAddress = (address: string) => {
    setSelectedAddresses((current) =>
      current.includes(address) ? current.filter((item) => item !== address) : [...current, address]
    );
  };

  const currentChainId = selectedVault?.chainId ?? selectedMarket?.chainId ?? 1;

  const previewInput: SignalTemplateRequest =
    mode === 'vaults'
      ? {
          templateId: 'erc4626-withdraw-percent-watch',
          vaultContract: selectedVault?.address ?? '',
          ownerAddresses: selectedAddresses,
          chainId: currentChainId,
          requiredCount: Number(requiredCount),
          dropPercent: Number(dropPercent),
          windowDuration,
          cooldownMinutes: Number(cooldownMinutes),
          name,
          description,
        }
      : {
          templateId: getMorphoWhaleTemplateId(Number(requiredCount)),
          marketId: selectedMarket?.marketId ?? '',
          whaleAddresses: selectedAddresses,
          chainId: currentChainId,
          requiredCount: Number(requiredCount),
          dropPercent: Number(dropPercent),
          windowDuration,
          cooldownMinutes: Number(cooldownMinutes),
          name,
          description,
        };

  let previewError: string | null = null;
  let previewPayload: ReturnType<typeof buildSignalTemplate> | null = null;
  let previewDefinition: string | null = null;

  try {
    previewPayload = buildSignalTemplate(previewInput);
    previewDefinition = JSON.stringify(
      {
        name: previewPayload.name,
        description: previewPayload.description,
        definition: previewPayload.definition,
        delivery: previewPayload.delivery,
        cooldown_minutes: previewPayload.cooldown_minutes,
      },
      null,
      2
    );
  } catch (error) {
    previewError = error instanceof Error ? error.message : 'Unable to build signal preview.';
  }

  const handleCreate = async () => {
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/signals/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(previewInput),
      });

      const payload = (await response.json().catch(() => null)) as
        | { id?: string; details?: string; payload?: { error?: string } }
        | null;

      if (!response.ok || !payload?.id) {
        throw new Error(payload?.details ?? payload?.payload?.error ?? 'Unable to create signal.');
      }

      router.push(`/signals/${payload.id}`);
      router.refresh();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to create signal.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const collection = mode === 'vaults' ? vaults : markets;
  const selectionCount = selectedAddresses.length;
  const selectedEntitySummary =
    mode === 'vaults'
      ? selectedVault
        ? `${selectedVault.name} · ${selectedVault.assetSymbol}`
        : 'No vault selected'
      : selectedMarket
        ? `${selectedMarket.loanAssetSymbol}/${selectedMarket.collateralAssetSymbol}`
        : 'No market selected';

  return (
    <div className="space-y-6">
      <section className="rounded-[16px] border border-border bg-surface p-6 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.3em] text-secondary">Simple Mode</p>
          <h1 className="mt-3 font-zen text-3xl sm:text-4xl">Create from Morpho data</h1>
          <p className="mt-3 text-secondary">
            Search Morpho markets or vaults, pull the largest current holders from the official Morpho API, and create a signal by clicking instead of copying addresses by hand.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="space-y-6">
          <Card className="space-y-5">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-secondary">Source</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setMode('vaults')}
                  className={`rounded-sm border px-3 py-2 text-sm transition-colors ${
                    mode === 'vaults'
                      ? 'border-[#1f2328] bg-[#1f2328]/4 text-foreground'
                      : 'border-border text-secondary hover:bg-hovered hover:text-foreground'
                  }`}
                >
                  Morpho vault holders
                </button>
                <button
                  type="button"
                  onClick={() => setMode('markets')}
                  className={`rounded-sm border px-3 py-2 text-sm transition-colors ${
                    mode === 'markets'
                      ? 'border-[#1f2328] bg-[#1f2328]/4 text-foreground'
                      : 'border-border text-secondary hover:bg-hovered hover:text-foreground'
                  }`}
                >
                  Morpho market suppliers
                </button>
              </div>
            </div>

            <label className="flex flex-col gap-2 text-sm text-secondary">
              Search
              <div className="relative">
                <RiSearchLine className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={mode === 'vaults' ? 'Search vault name, symbol, asset, or address' : 'Search market asset pair or market id'}
                  className="w-full rounded-sm border border-border bg-transparent py-2 pl-9 pr-3 text-sm text-foreground"
                />
              </div>
            </label>

            {resultsLoading ? <p className="text-sm text-secondary">Loading Morpho data...</p> : null}
            {loadError ? <p className="text-sm text-red-500">{loadError}</p> : null}

            <div className="grid gap-3">
              {mode === 'vaults'
                ? collection.map((item) => {
                    const vault = item as MorphoVaultSummary;
                    const active = selectedVault?.address === vault.address;

                    return (
                      <button
                        key={vault.address}
                        type="button"
                        onClick={() => setSelectedVault(vault)}
                        className={`rounded-sm border px-4 py-3 text-left transition-colors ${
                          active
                            ? 'border-[#1f2328] bg-background text-foreground'
                            : 'border-border bg-background/70 text-secondary hover:bg-hovered hover:text-foreground'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm text-foreground">{vault.name}</p>
                            <p className="mt-1 text-xs text-secondary">
                              {vault.symbol} · {vault.assetSymbol} · {formatCompactAddress(vault.address)}
                            </p>
                          </div>
                          <p className="text-xs text-secondary">{formatUsdCompact(vault.totalAssetsUsd)}</p>
                        </div>
                      </button>
                    );
                  })
                : collection.map((item) => {
                    const market = item as MorphoMarketSummary;
                    const active = selectedMarket?.marketId === market.marketId;

                    return (
                      <button
                        key={market.marketId}
                        type="button"
                        onClick={() => setSelectedMarket(market)}
                        className={`rounded-sm border px-4 py-3 text-left transition-colors ${
                          active
                            ? 'border-[#1f2328] bg-background text-foreground'
                            : 'border-border bg-background/70 text-secondary hover:bg-hovered hover:text-foreground'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm text-foreground">
                              {market.loanAssetSymbol}/{market.collateralAssetSymbol}
                            </p>
                            <p className="mt-1 text-xs text-secondary font-mono">{market.marketId}</p>
                          </div>
                          <div className="text-right text-xs text-secondary">
                            <p>{formatUsdCompact(market.supplyAssetsUsd)}</p>
                            <p>{formatPercent(market.utilization)}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
            </div>
          </Card>

          <Card className="space-y-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-secondary">Selection</p>
                <h2 className="mt-2 font-zen text-2xl">{selectedEntitySummary}</h2>
              </div>
              {holdersLoading ? <p className="text-sm text-secondary">Loading holders...</p> : null}
            </div>

            <div className="space-y-2">
              {(mode === 'vaults' ? vaultHolders : marketSuppliers).map((item) => {
                const address = item.address;
                const active = selectedAddresses.includes(address);
                const secondary =
                  mode === 'vaults'
                    ? `${(item as MorphoVaultHolder).shares} shares`
                    : `${formatUsdCompact((item as MorphoMarketSupplier).supplyAssetsUsd)} supplied`;

                return (
                  <label
                    key={address}
                    className={`flex cursor-pointer items-center justify-between gap-3 rounded-sm border px-3 py-2 text-sm ${
                      active ? 'border-[#1f2328] bg-background text-foreground' : 'border-border bg-background/70 text-secondary'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={active}
                        onChange={() => toggleAddress(address)}
                        className="h-4 w-4 rounded-sm border-border"
                      />
                      <div>
                        <p className="font-mono text-sm">{address}</p>
                        <p className="text-xs text-secondary">{secondary}</p>
                      </div>
                    </div>
                    <RiArrowRightLine className="h-4 w-4 text-secondary" />
                  </label>
                );
              })}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm text-secondary">
                Required addresses
                <input
                  type="number"
                  min="1"
                  value={requiredCount}
                  onChange={(event) => setRequiredCount(event.target.value)}
                  className="rounded-sm border border-border bg-transparent px-3 py-2 text-sm text-foreground"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm text-secondary">
                Share / supply drop (%)
                <input
                  type="number"
                  min="1"
                  value={dropPercent}
                  onChange={(event) => setDropPercent(event.target.value)}
                  className="rounded-sm border border-border bg-transparent px-3 py-2 text-sm text-foreground"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm text-secondary">
                Window
                <input
                  type="text"
                  value={windowDuration}
                  onChange={(event) => setWindowDuration(event.target.value)}
                  className="rounded-sm border border-border bg-transparent px-3 py-2 text-sm text-foreground"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm text-secondary">
                Cooldown (minutes)
                <input
                  type="number"
                  min="0"
                  value={cooldownMinutes}
                  onChange={(event) => setCooldownMinutes(event.target.value)}
                  className="rounded-sm border border-border bg-transparent px-3 py-2 text-sm text-foreground"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm text-secondary sm:col-span-2">
                Signal name
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Optional custom name"
                  className="rounded-sm border border-border bg-transparent px-3 py-2 text-sm text-foreground"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm text-secondary sm:col-span-2">
                Description
                <input
                  type="text"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Optional description shown in Sentinel"
                  className="rounded-sm border border-border bg-transparent px-3 py-2 text-sm text-foreground"
                />
              </label>
            </div>

            {submitError ? <p className="text-sm text-red-500">{submitError}</p> : null}

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={handleCreate}
                disabled={Boolean(previewError) || isSubmitting || selectionCount === 0 || !selectedEntitySummary}
              >
                {isSubmitting ? 'Creating signal...' : 'Create signal from Morpho data'}
              </Button>
              <Button variant="secondary" type="button" onClick={() => router.push('/signals/new/advanced')}>
                Open advanced mode
              </Button>
            </div>
          </Card>
        </div>

        <Card className="space-y-5">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-secondary">Preview</p>
            <h2 className="mt-2 font-zen text-2xl">
              {mode === 'vaults' ? 'Morpho vault holders' : 'Morpho market suppliers'}
            </h2>
            <p className="mt-2 text-sm text-secondary">
              {mode === 'vaults'
                ? 'Creates an ERC-4626 share-withdrawal signal from Morpho vault data.'
                : 'Creates a Morpho supplier-exit signal from market position data.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-sm border border-border/80 bg-background/50 p-3">
              <p className="text-xs uppercase tracking-[0.25em] text-secondary">Selected</p>
              <p className="mt-2 break-all font-zen text-xl">{selectionCount}</p>
            </div>
            <div className="rounded-sm border border-border/80 bg-background/50 p-3">
              <p className="text-xs uppercase tracking-[0.25em] text-secondary">Required</p>
              <p className="mt-2 break-all font-zen text-xl">{requiredCount || '0'}</p>
            </div>
            <div className="rounded-sm border border-border/80 bg-background/50 p-3">
              <p className="text-xs uppercase tracking-[0.25em] text-secondary">Drop %</p>
              <p className="mt-2 break-all font-zen text-xl">{dropPercent ? `${dropPercent}%` : '—'}</p>
            </div>
            <div className="rounded-sm border border-border/80 bg-background/50 p-3">
              <p className="text-xs uppercase tracking-[0.25em] text-secondary">Window</p>
              <p className="mt-2 break-all font-zen text-xl">{windowDuration || '—'}</p>
            </div>
          </div>

          {!previewError && previewPayload && previewDefinition ? (
            <>
              <div className="rounded-sm border border-border/80 bg-background/50 p-4">
                <p className="text-sm text-secondary">{describeSignalDefinition(previewPayload.definition)}</p>
              </div>
              <CodeBlock
                code={previewDefinition}
                language="json"
                filename="signal-preview.json"
                tone="dark"
                showLineNumbers
              />
            </>
          ) : (
            <div className="rounded-sm border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-400">
              {previewError ?? 'Select a Morpho vault or market to generate a preview.'}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
