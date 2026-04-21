import 'server-only';

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getSessionCookie } from '@/lib/auth/constants';

const IRUKA_BASE_URL_FALLBACK = 'http://localhost:3000/api/v1';

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

const getConfiguredIrukaApiBaseUrl = () => {
  if (process.env.IRUKA_API_BASE_URL) {
    return process.env.IRUKA_API_BASE_URL;
  }

  const fallbackEntry = Object.entries(process.env).find(
    ([key, value]) =>
      key.endsWith('_API_BASE_URL') &&
      key !== 'DELIVERY_BASE_URL' &&
      key !== 'IRUKA_API_BASE_URL' &&
      !key.startsWith('NEXT_PUBLIC_') &&
      typeof value === 'string' &&
      value.length > 0
  );

  return fallbackEntry?.[1];
};

const normalizeIrukaBaseUrl = (value: string) => {
  const withScheme = /^[a-z][a-z\d+\-.]*:\/\//i.test(value) ? value : `http://${value}`;
  const url = new URL(withScheme);

  const normalizedPath = trimTrailingSlash(url.pathname);
  url.pathname =
    !normalizedPath || normalizedPath === '/' ? '/api/v1' : normalizedPath;

  return trimTrailingSlash(url.toString());
};

export const getIrukaApiBaseUrl = () =>
  normalizeIrukaBaseUrl(
    getConfiguredIrukaApiBaseUrl() ?? IRUKA_BASE_URL_FALLBACK
  );

export const buildIrukaApiUrl = (path: string, search: string = '') => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${getIrukaApiBaseUrl()}${normalizedPath}${search}`;
};

const getIrukaSessionCookieHeader = async () => {
  const cookieStore = await cookies();
  const sessionCookie = getSessionCookie(cookieStore);
  if (!sessionCookie?.value) {
    return null;
  }

  return `${sessionCookie.name}=${sessionCookie.value}`;
};

const buildIrukaAuthHeaders = async (headersInit?: HeadersInit) => {
  const headers = new Headers(headersInit);
  if (!headers.has('X-API-Key') && !headers.has('Authorization') && !headers.has('Cookie')) {
    const cookieHeader = await getIrukaSessionCookieHeader();
    if (cookieHeader) {
      headers.set('Cookie', cookieHeader);
    }
  }

  return headers;
};

export const fetchIruka = async (path: string, init: RequestInit = {}) => {
  const headers = await buildIrukaAuthHeaders(init.headers);

  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  return fetch(buildIrukaApiUrl(path), {
    ...init,
    headers,
    cache: 'no-store',
  });
};

const copyResponseHeaders = (from: Response, to: Headers) => {
  const contentType = from.headers.get('content-type');
  if (contentType) {
    to.set('content-type', contentType);
  }

  const cacheControl = from.headers.get('cache-control');
  if (cacheControl) {
    to.set('cache-control', cacheControl);
  }

  const setCookies =
    typeof from.headers.getSetCookie === 'function'
      ? from.headers.getSetCookie()
      : from.headers.get('set-cookie')
        ? [from.headers.get('set-cookie') as string]
        : [];

  for (const value of setCookies) {
    to.append('set-cookie', value);
  }
};

export const proxyRequestToIruka = async (request: Request, path: string, search = '') => {
  const headers = new Headers();

  const contentType = request.headers.get('content-type');
  if (contentType) {
    headers.set('content-type', contentType);
  }

  const accept = request.headers.get('accept');
  if (accept) {
    headers.set('accept', accept);
  }

  const authorization = request.headers.get('authorization');
  if (authorization) {
    headers.set('authorization', authorization);
  }

  const apiKey = request.headers.get('x-api-key');
  if (apiKey) {
    headers.set('x-api-key', apiKey);
  }

  const adminKey = request.headers.get('x-admin-key');
  if (adminKey) {
    headers.set('x-admin-key', adminKey);
  }

  const hasBody = request.method !== 'GET' && request.method !== 'HEAD';
  const body = hasBody ? await request.text() : undefined;

  const response = await fetchIruka(`${path}${search}`, {
    method: request.method,
    headers,
    body,
  });

  const nextHeaders = new Headers();
  copyResponseHeaders(response, nextHeaders);

  return new NextResponse(await response.text(), {
    status: response.status,
    headers: nextHeaders,
  });
};
