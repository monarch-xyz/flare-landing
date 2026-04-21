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
  domain = typeof window !== 'undefined' ? window.location.host : 'iruka.tech',
  uri = typeof window !== 'undefined' ? window.location.origin : 'https://iruka.tech',
}: BuildSiweMessageInput) => {
  const message = new SiweMessage({
    domain,
    address,
    statement: 'Sign in to Iruka to manage your signals.',
    uri,
    version: '1',
    chainId,
    nonce,
  });

  return message.prepareMessage();
};
