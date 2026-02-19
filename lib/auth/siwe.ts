import { SiweMessage } from 'siwe';

export interface BuildSiweMessageInput {
  address: string;
  nonce: string;
  chainId: number;
  domain?: string;
  uri?: string;
}

export const buildSiweMessage = ({
  address,
  nonce,
  chainId,
  domain = typeof window !== 'undefined' ? window.location.host : 'sentinel.monarch.xyz',
  uri = typeof window !== 'undefined' ? window.location.origin : 'https://sentinel.monarch.xyz',
}: BuildSiweMessageInput) => {
  const message = new SiweMessage({
    domain,
    address,
    statement: 'Sign in to Sentinel to manage signals.',
    uri,
    version: '1',
    chainId,
    nonce,
  });

  return message.prepareMessage();
};
