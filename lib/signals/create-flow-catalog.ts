export type CreateSignalPersonaId = 'human' | 'agent';
export type HumanSignalCategoryId = 'vaults' | 'protocols';
export type AssistedVaultExampleId = 'morpho' | 'euler' | 'aave-v3';
export type AssistedProtocolExampleId = 'morpho-markets';

export interface CreateSignalPersonaOption {
  id: CreateSignalPersonaId;
  title: string;
  summary: string;
  helpText: string;
  eyebrow: string;
  cta: string;
}

export interface HumanSignalCategoryOption {
  id: HumanSignalCategoryId;
  title: string;
  summary: string;
  helpText: string;
}

export interface AssistedExampleOption<TId extends string> {
  id: TId;
  title: string;
  summary: string;
  helpText: string;
  badge: string;
  status: 'live' | 'coming-soon';
}

export interface AgentGuideResource {
  title: string;
  helpText: string;
  href: string;
}

export const MEGABAT_ONE_LINER = 'Megabat turns onchain conditions into managed alerts.';

export const CREATE_SIGNAL_PERSONAS: CreateSignalPersonaOption[] = [
  {
    id: 'human',
    eyebrow: "I'm a human",
    title: 'Guided builder',
    summary: 'Guided alerts',
    helpText:
      'Megabat builds the alert for you from guided vault and protocol surfaces. Today that includes Morpho vaults, Euler vaults, Morpho markets, and a custom fallback.',
    cta: 'Open human builder',
  },
  {
    id: 'agent',
    eyebrow: "I'm an agent",
    title: 'Docs and prompt',
    summary: 'Agent-authored alerts',
    helpText:
      'Megabat exposes docs, DSL, API routes, and a starter prompt so an agent can author the alert directly.',
    cta: 'Open agent guide',
  },
];

export const HUMAN_SIGNAL_CATEGORIES: HumanSignalCategoryOption[] = [
  {
    id: 'vaults',
    title: 'Vaults',
    summary: 'Vault alerts',
    helpText:
      'Pick a vault, pick holders, and let Megabat watch ERC-4626 share changes for you.',
  },
  {
    id: 'protocols',
    title: 'Protocols',
    summary: 'Protocol alerts',
    helpText:
      'Use protocol-specific indexed surfaces. Today that means Morpho markets, with room for more protocol builders later.',
  },
];

export const ASSISTED_VAULT_EXAMPLES: AssistedExampleOption<AssistedVaultExampleId>[] = [
  {
    id: 'morpho',
    title: 'Morpho',
    summary: 'Vault alert',
    helpText:
      'Search Morpho vaults, select holders, and let Megabat create the vault alert.',
    badge: 'Live now',
    status: 'live',
  },
  {
    id: 'euler',
    title: 'Euler',
    summary: 'Vault alert',
    helpText:
      'Search Euler Earn vaults, select holders, and let Megabat create the vault alert.',
    badge: 'Live now',
    status: 'live',
  },
  {
    id: 'aave-v3',
    title: 'Aave V3',
    summary: 'Later',
    helpText:
      'Reserved as a future assisted vault surface so the app hierarchy already has a place for broader vault coverage.',
    badge: 'Coming soon',
    status: 'coming-soon',
  },
];

export const ASSISTED_PROTOCOL_EXAMPLES: AssistedExampleOption<AssistedProtocolExampleId>[] = [
  {
    id: 'morpho-markets',
    title: 'Morpho markets',
    summary: 'Protocol alert',
    helpText:
      'Use backend-indexed Morpho markets to select suppliers and let Megabat watch for coordinated exits.',
    badge: 'Live now',
    status: 'live',
  },
];

export const CUSTOM_SIGNAL_FALLBACK = {
  title: 'Custom inputs',
  summary: 'Manual fallback',
  helpText:
    "Use this when the guided flow doesn't expose the exact vault, market, token, or address set you need yet, but you still want Megabat to manage the alert.",
  cta: 'Open custom builder',
};

export const AGENT_GUIDE_RESOURCES: AgentGuideResource[] = [
  {
    title: 'App docs',
    helpText: 'Structured docs for state metrics, raw events, delivery, and route shapes.',
    href: '/docs',
  },
  {
    title: 'DSL reference',
    helpText: 'Canonical DSL syntax and condition structure for agent-authored signals.',
    href: 'https://github.com/monarch-xyz/megabat/blob/main/docs/DSL.md',
  },
  {
    title: 'API reference',
    helpText: 'Signal creation payloads, auth, and delivery behavior for direct agent integration.',
    href: 'https://github.com/monarch-xyz/megabat/blob/main/docs/API.md',
  },
];

export const getCreateSignalPersona = (id: CreateSignalPersonaId) => {
  const option = CREATE_SIGNAL_PERSONAS.find((item) => item.id === id);
  if (!option) {
    throw new Error(`Unknown create-signal persona: ${id}`);
  }

  return option;
};

export const getHumanSignalCategory = (id: HumanSignalCategoryId) => {
  const option = HUMAN_SIGNAL_CATEGORIES.find((item) => item.id === id);
  if (!option) {
    throw new Error(`Unknown human signal category: ${id}`);
  }

  return option;
};
