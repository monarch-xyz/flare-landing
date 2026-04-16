import 'server-only';
import { fetchMegabat } from '@/lib/megabat/server';

export class MegabatRequestError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.name = 'MegabatRequestError';
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

export const requestMegabat = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
  const response = await fetchMegabat(path, init);

  const payload = await parseResponsePayload(response);
  if (!response.ok) {
    throw new MegabatRequestError(`Megabat request failed (${response.status})`, response.status, payload);
  }

  return payload as T;
};
