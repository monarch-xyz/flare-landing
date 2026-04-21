import 'server-only';
import { fetchIruka } from '@/lib/iruka/server';

export class IrukaRequestError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.name = 'IrukaRequestError';
    this.status = status;
    this.payload = payload;
  }
}

const parseResponsePayload = async (response: Response) => {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
};

export const requestIruka = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
  const response = await fetchIruka(path, init);

  const payload = await parseResponsePayload(response);
  if (!response.ok) {
    throw new IrukaRequestError(`Iruka request failed (${response.status})`, response.status, payload);
  }

  return payload as T;
};
