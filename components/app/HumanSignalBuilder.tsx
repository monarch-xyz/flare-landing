'use client';

import Link from 'next/link';
import { useState } from 'react';
import { RiArrowRightLine } from 'react-icons/ri';
import { CreateFlowHeader } from '@/components/app/CreateFlowHeader';
import { MorphoMarketSignalBuilder } from '@/components/app/MorphoMarketSignalBuilder';
import { VaultUseCaseBuilder } from '@/components/app/VaultUseCaseBuilder';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { HelpHint } from '@/components/ui/HelpHint';
import {
  ASSISTED_PROTOCOL_EXAMPLES,
  ASSISTED_VAULT_EXAMPLES,
  CUSTOM_SIGNAL_FALLBACK,
  HUMAN_SIGNAL_CATEGORIES,
  IRUKA_ONE_LINER,
  getHumanSignalCategory,
  type HumanSignalCategoryId,
} from '@/lib/signals/create-flow-catalog';
import { CUSTOM_TEMPLATE_PATH } from '@/lib/telegram/setup-flow';
import type { SupportedVaultProtocolId } from '@/lib/vault-discovery/types';

export function HumanSignalBuilder() {
  const [category, setCategory] = useState<HumanSignalCategoryId>('vaults');
  const [selectedVaultProtocol, setSelectedVaultProtocol] = useState<SupportedVaultProtocolId>('morpho');
  const selectedCategory = getHumanSignalCategory(category);

  return (
    <div className="space-y-6">
      <CreateFlowHeader
        eyebrow="Human builder"
        title="Start from simple examples"
        summary={`${IRUKA_ONE_LINER} Pick a layer, then pick a source.`}
      />

      <div className="ui-panel p-4">
        <div className="flex items-center gap-2">
          <p className="ui-stat-label">Layer</p>
          <HelpHint text={selectedCategory.helpText} />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {HUMAN_SIGNAL_CATEGORIES.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setCategory(option.id)}
              data-active={category === option.id}
              className="ui-option px-3 py-2 text-sm"
            >
              {option.title}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {category === 'vaults'
          ? ASSISTED_VAULT_EXAMPLES.map((example) => {
              const isActive = example.id === selectedVaultProtocol;
              const isLive = example.status === 'live';

              return (
                <button
                  key={example.id}
                  type="button"
                  disabled={!isLive}
                  onClick={() => {
                    if (isLive) {
                      setSelectedVaultProtocol(example.id as SupportedVaultProtocolId);
                    }
                  }}
                  data-active={isActive}
                  className={`ui-option p-5 text-left ${!isLive ? 'cursor-not-allowed opacity-65' : ''}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="ui-stat-label">{example.badge}</p>
                      <h2 className="mt-3 font-display text-[1.65rem] leading-none text-foreground">{example.title}</h2>
                    </div>
                    <HelpHint text={example.helpText} align="right" />
                  </div>
                </button>
              );
            })
          : ASSISTED_PROTOCOL_EXAMPLES.map((example) => (
              <div key={example.id} className="ui-panel p-5 text-left">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="ui-stat-label">{example.badge}</p>
                    <h2 className="mt-3 font-display text-[1.65rem] leading-none text-foreground">{example.title}</h2>
                  </div>
                  <HelpHint text={example.helpText} align="right" />
                </div>
              </div>
            ))}
      </div>

      {category === 'vaults' ? (
        <VaultUseCaseBuilder protocol={selectedVaultProtocol} />
      ) : (
        <MorphoMarketSignalBuilder />
      )}

      <Card className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="ui-stat-label">Fallback</p>
          <div className="mt-2 flex items-center gap-2">
            <h2 className="font-display text-[1.7rem] leading-none text-foreground">{CUSTOM_SIGNAL_FALLBACK.title}</h2>
            <HelpHint text={CUSTOM_SIGNAL_FALLBACK.helpText} />
          </div>
        </div>
        <Link href={CUSTOM_TEMPLATE_PATH} className="no-underline">
          <Button variant="secondary" className="gap-2">
            {CUSTOM_SIGNAL_FALLBACK.cta}
            <RiArrowRightLine className="h-4 w-4" />
          </Button>
        </Link>
      </Card>
    </div>
  );
}
