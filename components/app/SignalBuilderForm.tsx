'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  RiAlarmWarningLine,
  RiArrowDownLine,
  RiArrowUpLine,
  RiExchangeDollarLine,
  RiUserSearchLine,
} from 'react-icons/ri';
import { SignalPresetCard } from '@/components/app/SignalPresetCard';
import { Button } from '@/components/ui/Button';
import {
  SIGNAL_TEMPLATE_PRESETS,
  buildSignalTemplate,
  describeSignalDefinition,
  getTemplatePreset,
  parseWhaleAddresses,
  type SignalTemplateId,
  type SignalTemplateRequest,
} from '@/lib/signals/templates';
import { CodeBlock } from '@/components/ui/CodeBlock';

interface BuilderFormState {
  name: string;
  description: string;
  marketId: string;
  whaleAddresses: string;
  vaultContract: string;
  ownerAddresses: string;
  tokenContract: string;
  watchedAddress: string;
  chainId: string;
  requiredCount: string;
  dropPercent: string;
  amountThreshold: string;
  windowDuration: string;
  cooldownMinutes: string;
}

interface SignalBuilderFormProps {
  initialPreset?: SignalTemplateId;
  telegramLinked?: boolean;
}

const presetIcons: Record<SignalTemplateId, ReactNode> = {
  'whale-exit-trio': <RiAlarmWarningLine className="w-5 h-5" />,
  'whale-exit-pair': <RiExchangeDollarLine className="w-5 h-5" />,
  'single-whale-exit': <RiUserSearchLine className="w-5 h-5" />,
  'erc20-inflow-watch': <RiArrowDownLine className="w-5 h-5" />,
  'erc20-outflow-watch': <RiArrowUpLine className="w-5 h-5" />,
  'erc4626-withdraw-percent-watch': <RiExchangeDollarLine className="w-5 h-5" />,
};

const formatCompactAddress = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return '—';
  }

  if (trimmed.length <= 16) {
    return trimmed;
  }

  return `${trimmed.slice(0, 6)}...${trimmed.slice(-4)}`;
};

const buildDefaultState = (templateId: SignalTemplateId): BuilderFormState => {
  const preset = getTemplatePreset(templateId);

  return {
    name: '',
    description: '',
    marketId: '',
    whaleAddresses: '',
    vaultContract: '',
    ownerAddresses: '',
    tokenContract: '',
    watchedAddress: '',
    chainId: String(preset.defaults.chainId),
    requiredCount:
      preset.kind === 'morpho-whale' || preset.kind === 'erc4626-withdraw'
        ? String(preset.defaults.requiredCount)
        : '1',
    dropPercent:
      preset.kind === 'morpho-whale'
        ? String(preset.defaults.dropPercent)
        : preset.kind === 'erc4626-withdraw' && typeof preset.defaults.dropPercent === 'number'
          ? String(preset.defaults.dropPercent)
          : '20',
    amountThreshold: preset.kind === 'erc20-transfer' ? String(preset.defaults.amountThreshold) : '1000000',
    windowDuration: preset.defaults.windowDuration,
    cooldownMinutes: String(preset.defaults.cooldownMinutes),
  };
};

export function SignalBuilderForm({ initialPreset = 'whale-exit-trio', telegramLinked = false }: SignalBuilderFormProps) {
  const router = useRouter();
  const [selectedPreset, setSelectedPreset] = useState<SignalTemplateId>(initialPreset);
  const [formState, setFormState] = useState<BuilderFormState>(() => buildDefaultState(initialPreset));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormState(buildDefaultState(selectedPreset));
    setError(null);
  }, [selectedPreset]);

  const selectedPresetConfig = getTemplatePreset(selectedPreset);
  const isMorphoWhalePreset = selectedPresetConfig.kind === 'morpho-whale';
  const isErc20TransferPreset = selectedPresetConfig.kind === 'erc20-transfer';
  const isErc4626WithdrawPreset = selectedPresetConfig.kind === 'erc4626-withdraw';

  const updateField = (field: keyof BuilderFormState, value: string) => {
    setFormState((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const previewInput: SignalTemplateRequest =
    selectedPresetConfig.kind === 'morpho-whale'
      ? {
          templateId: selectedPresetConfig.id,
          marketId: formState.marketId,
          whaleAddresses: formState.whaleAddresses,
          chainId: Number(formState.chainId),
          requiredCount: Number(formState.requiredCount),
          dropPercent: Number(formState.dropPercent),
          windowDuration: formState.windowDuration,
          cooldownMinutes: Number(formState.cooldownMinutes),
          name: formState.name,
          description: formState.description,
        }
      : selectedPresetConfig.kind === 'erc20-transfer'
        ? {
            templateId: selectedPresetConfig.id,
            tokenContract: formState.tokenContract,
            watchedAddress: formState.watchedAddress,
            chainId: Number(formState.chainId),
            amountThreshold: Number(formState.amountThreshold),
            windowDuration: formState.windowDuration,
            cooldownMinutes: Number(formState.cooldownMinutes),
            name: formState.name,
            description: formState.description,
          }
        : {
            templateId: selectedPresetConfig.id,
            vaultContract: formState.vaultContract,
            ownerAddresses: formState.ownerAddresses,
            chainId: Number(formState.chainId),
            requiredCount: Number(formState.requiredCount),
            dropPercent: Number(formState.dropPercent),
            windowDuration: formState.windowDuration,
            cooldownMinutes: Number(formState.cooldownMinutes),
            name: formState.name,
            description: formState.description,
          };

  let previewError: string | null = null;
  let previewDefinition: string | null = null;
  let previewPayload: ReturnType<typeof buildSignalTemplate> | null = null;
  let parsedAddressCount = 0;

  try {
    if (selectedPresetConfig.kind === 'morpho-whale') {
      parsedAddressCount = parseWhaleAddresses(formState.whaleAddresses).length;
    } else if (selectedPresetConfig.kind === 'erc4626-withdraw') {
      parsedAddressCount = parseWhaleAddresses(formState.ownerAddresses).length;
    }

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
  } catch (previewBuildError) {
    previewError = previewBuildError instanceof Error ? previewBuildError.message : 'Unable to build template preview.';
  }

  const handleSubmit = async () => {
    if (!telegramLinked) {
      setError('Connect Telegram before creating a template signal.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/signals/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(previewInput),
      });

      const payload = (await response.json().catch(() => null)) as
        | { id?: string; details?: string; payload?: { error?: string; field?: string } }
        | null;

      if (!response.ok || !payload?.id) {
        throw new Error(payload?.details ?? payload?.payload?.error ?? 'Unable to create signal.');
      }

      router.push(`/signals/${payload.id}`);
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to create signal.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewTitle = isMorphoWhalePreset
    ? 'Morpho whale movement signal'
    : isErc4626WithdrawPreset
      ? 'ERC-4626 owner withdrawal % signal'
      : 'ERC-20 transfer raw-event signal';
  const previewDescription = isMorphoWhalePreset
    ? 'Enter a market plus the supplier wallets you want to watch. This UI creates a Sentinel `group` + `change` signal on the canonical `Morpho.Position.supplyShares` state alias.'
    : isErc4626WithdrawPreset
      ? 'Enter one vault plus the owner wallets you want to watch. This UI creates a Sentinel `group` + `change` signal on `ERC4626.Position.shares` using percentage decrease.'
      : 'Track gross ERC-20 Transfer volume into or out of one address with Sentinel’s `raw-events` preset. This is flow monitoring, not true net balance change.';

  const previewStats = isMorphoWhalePreset
    ? [
        { label: 'Tracked wallets', value: String(parsedAddressCount) },
        { label: 'Required movers', value: formState.requiredCount || '0' },
        { label: 'Drop %', value: formState.dropPercent ? `${formState.dropPercent}%` : '—' },
        { label: 'Window', value: formState.windowDuration || '—' },
      ]
    : isErc4626WithdrawPreset
      ? [
          { label: 'Vault', value: formatCompactAddress(formState.vaultContract) },
          { label: 'Tracked owners', value: String(parsedAddressCount) },
          { label: 'Required owners', value: formState.requiredCount || '0' },
          { label: 'Drop %', value: formState.dropPercent ? `${formState.dropPercent}%` : '—' },
        ]
      : [
          { label: 'Asset', value: formatCompactAddress(formState.tokenContract) },
          { label: 'Address', value: formatCompactAddress(formState.watchedAddress) },
          { label: 'Direction', value: isErc20TransferPreset && selectedPresetConfig.direction === 'inflow' ? 'Inflow' : 'Outflow' },
          { label: 'Threshold', value: formState.amountThreshold ? `${formState.amountThreshold} base` : '0' },
        ];

  return (
    <div className="space-y-6">
      <div className="rounded-md border border-border bg-surface p-4">
        <p className="text-xs uppercase tracking-[0.3em] text-secondary mb-2">Template</p>
        <div className="flex flex-wrap gap-2">
          {SIGNAL_TEMPLATE_PRESETS.map((option) => (
            <button
              key={option.id}
              className={`rounded-sm border px-3 py-2 text-sm transition-colors ${
                selectedPreset === option.id
                  ? 'border-[#1f2328] bg-[#1f2328]/4 text-foreground'
                  : 'border-border text-secondary hover:text-foreground hover:bg-hovered'
              }`}
              onClick={() => setSelectedPreset(option.id)}
              type="button"
            >
              {option.title}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-6">
        <SignalPresetCard title={selectedPresetConfig.title} description={selectedPresetConfig.description} icon={presetIcons[selectedPreset]}>
          <p className="text-xs uppercase tracking-[0.25em] text-secondary">{selectedPresetConfig.accent}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-2 text-sm text-secondary">
              Signal name
              <input
                type="text"
                value={formState.name}
                onChange={(event) => updateField('name', event.target.value)}
                placeholder="Optional custom name"
                className="rounded-sm border border-border bg-transparent px-3 py-2 text-sm text-foreground"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-secondary">
              Chain ID
              <input
                type="number"
                min="1"
                value={formState.chainId}
                onChange={(event) => updateField('chainId', event.target.value)}
                className="rounded-sm border border-border bg-transparent px-3 py-2 text-sm text-foreground"
              />
            </label>

            {isMorphoWhalePreset ? (
              <>
                <label className="flex flex-col gap-2 text-sm text-secondary">
                  Morpho market ID
                  <input
                    type="text"
                    value={formState.marketId}
                    onChange={(event) => updateField('marketId', event.target.value)}
                    placeholder="0xb8fc70e82bc5... or full Monarch URL"
                    className="rounded-sm border border-border bg-transparent px-3 py-2 text-sm text-foreground"
                  />
                  <span className="text-xs text-secondary">
                    Chain is set separately. If you paste a Monarch market URL, Sentinel extracts and stores only the final market id.
                  </span>
                </label>

                <label className="flex flex-col gap-2 text-sm text-secondary">
                  Wallets required
                  <input
                    type="number"
                    min="1"
                    value={formState.requiredCount}
                    onChange={(event) => updateField('requiredCount', event.target.value)}
                    className="rounded-sm border border-border bg-transparent px-3 py-2 text-sm text-foreground"
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm text-secondary">
                  Supply drop (%)
                  <input
                    type="number"
                    min="1"
                    value={formState.dropPercent}
                    onChange={(event) => updateField('dropPercent', event.target.value)}
                    className="rounded-sm border border-border bg-transparent px-3 py-2 text-sm text-foreground"
                  />
                </label>
              </>
            ) : isErc4626WithdrawPreset ? (
              <>
                <label className="flex flex-col gap-2 text-sm text-secondary">
                  Vault contract
                  <input
                    type="text"
                    value={formState.vaultContract}
                    onChange={(event) => updateField('vaultContract', event.target.value)}
                    placeholder="0x1111111111111111111111111111111111111111"
                    className="rounded-sm border border-border bg-transparent px-3 py-2 text-sm text-foreground font-mono"
                  />
                  <span className="text-xs text-secondary">
                    Sentinel reads `balanceOf(owner)` on this ERC-4626 vault through archive RPC.
                  </span>
                </label>

                <label className="flex flex-col gap-2 text-sm text-secondary">
                  Owners required
                  <input
                    type="number"
                    min="1"
                    value={formState.requiredCount}
                    onChange={(event) => updateField('requiredCount', event.target.value)}
                    className="rounded-sm border border-border bg-transparent px-3 py-2 text-sm text-foreground"
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm text-secondary">
                  Share drop (%)
                  <input
                    type="number"
                    min="1"
                    value={formState.dropPercent}
                    onChange={(event) => updateField('dropPercent', event.target.value)}
                    className="rounded-sm border border-border bg-transparent px-3 py-2 text-sm text-foreground"
                  />
                  <span className="text-xs text-secondary">
                    Triggers when each tracked owner reduces shares by at least this percentage over the window.
                  </span>
                </label>
              </>
            ) : (
              <>
                <label className="flex flex-col gap-2 text-sm text-secondary">
                  Token contract
                  <input
                    type="text"
                    value={formState.tokenContract}
                    onChange={(event) => updateField('tokenContract', event.target.value)}
                    placeholder="0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
                    className="rounded-sm border border-border bg-transparent px-3 py-2 text-sm text-foreground font-mono"
                  />
                  <span className="text-xs text-secondary">Use the ERC-20 contract that emits the `Transfer` logs you care about.</span>
                </label>

                <label className="flex flex-col gap-2 text-sm text-secondary">
                  Watched address
                  <input
                    type="text"
                    value={formState.watchedAddress}
                    onChange={(event) => updateField('watchedAddress', event.target.value)}
                    placeholder="0x1111111111111111111111111111111111111111"
                    className="rounded-sm border border-border bg-transparent px-3 py-2 text-sm text-foreground font-mono"
                  />
                  <span className="text-xs text-secondary">This can be a vault, router, treasury, adapter, or any wallet address.</span>
                </label>

                <label className="flex flex-col gap-2 text-sm text-secondary">
                  Transfer threshold (base units)
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={formState.amountThreshold}
                    onChange={(event) => updateField('amountThreshold', event.target.value)}
                    className="rounded-sm border border-border bg-transparent px-3 py-2 text-sm text-foreground"
                  />
                </label>
              </>
            )}

            <label className="flex flex-col gap-2 text-sm text-secondary">
              Window
              <input
                type="text"
                value={formState.windowDuration}
                onChange={(event) => updateField('windowDuration', event.target.value)}
                placeholder="24h"
                className="rounded-sm border border-border bg-transparent px-3 py-2 text-sm text-foreground"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-secondary">
              Cooldown (minutes)
              <input
                type="number"
                min="0"
                value={formState.cooldownMinutes}
                onChange={(event) => updateField('cooldownMinutes', event.target.value)}
                className="rounded-sm border border-border bg-transparent px-3 py-2 text-sm text-foreground"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-secondary sm:col-span-2">
              Description
              <input
                type="text"
                value={formState.description}
                onChange={(event) => updateField('description', event.target.value)}
                placeholder="Optional description shown in Sentinel"
                className="rounded-sm border border-border bg-transparent px-3 py-2 text-sm text-foreground"
              />
            </label>
          </div>

          {isMorphoWhalePreset ? (
            <label className="mt-4 flex flex-col gap-2 text-sm text-secondary">
              Wallet addresses
              <textarea
                value={formState.whaleAddresses}
                onChange={(event) => updateField('whaleAddresses', event.target.value)}
                placeholder={`0x1111111111111111111111111111111111111111\n0x2222222222222222222222222222222222222222\n0x3333333333333333333333333333333333333333`}
                rows={7}
                className="rounded-sm border border-border bg-transparent px-3 py-2 text-sm text-foreground font-mono"
              />
              <span className="text-xs text-secondary">
                One address per line or comma-separated. Use the suppliers you care about most.
              </span>
            </label>
          ) : isErc4626WithdrawPreset ? (
            <label className="mt-4 flex flex-col gap-2 text-sm text-secondary">
              Owner addresses
              <textarea
                value={formState.ownerAddresses}
                onChange={(event) => updateField('ownerAddresses', event.target.value)}
                placeholder={`0x1111111111111111111111111111111111111111\n0x2222222222222222222222222222222222222222\n0x3333333333333333333333333333333333333333`}
                rows={7}
                className="rounded-sm border border-border bg-transparent px-3 py-2 text-sm text-foreground font-mono"
              />
              <span className="text-xs text-secondary">
                One owner per line or comma-separated. Sentinel injects each owner into the group condition at evaluation time.
              </span>
            </label>
          ) : (
            <div className="mt-4 rounded-sm border border-border/80 bg-background/50 p-4 text-sm text-secondary">
              This template uses Sentinel’s `raw-events` ERC-20 transfer preset. Thresholds are compared against token base units, not formatted token decimals. It measures gross flow only, not true net balance change. The broader raw-event catalog also includes approvals, ERC-721 events, ERC-4626 deposits and withdrawals, swap presets, and `contract_event` for custom ABI signatures.
            </div>
          )}

          {!telegramLinked ? (
            <p className="text-sm text-secondary">Template signals use Telegram delivery. Connect Telegram before creating one.</p>
          ) : null}

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button onClick={handleSubmit} disabled={isSubmitting || Boolean(previewError) || !telegramLinked}>
              {isSubmitting ? 'Creating signal...' : telegramLinked ? 'Create signal from template' : 'Connect Telegram to create'}
            </Button>
            <Button variant="secondary" type="button" onClick={() => setFormState(buildDefaultState(selectedPreset))}>
              Reset fields
            </Button>
          </div>
        </SignalPresetCard>

        <div className="rounded-md border border-border bg-surface p-6 space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-secondary mb-2">Preview</p>
            <h3 className="font-zen text-xl">{previewTitle}</h3>
            <p className="text-sm text-secondary mt-2">{previewDescription}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {previewStats.map((stat) => (
              <div key={stat.label} className="rounded-sm border border-border/80 bg-background/50 p-3">
                <p className="text-xs uppercase tracking-[0.25em] text-secondary">{stat.label}</p>
                <p className="font-zen text-xl mt-2 break-all">{stat.value}</p>
              </div>
            ))}
          </div>

          {!previewError && previewDefinition && previewPayload ? (
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
              {previewError ?? 'Fill in the form to generate a template preview.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
