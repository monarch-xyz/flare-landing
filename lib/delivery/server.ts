const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

const normalizeBaseUrl = (value: string) => {
  const withScheme = /^[a-z][a-z\d+\-.]*:\/\//i.test(value) ? value : `http://${value}`;
  return trimTrailingSlash(new URL(withScheme).toString());
};

const inferDeliveryBaseUrl = () => {
  const megabatApiBase = process.env.MEGABAT_API_BASE_URL ?? 'http://localhost:3000/api/v1';
  return normalizeBaseUrl(megabatApiBase).replace(/\/api\/v1$/, '');
};

export const getDeliveryBaseUrl = () =>
  normalizeBaseUrl(process.env.DELIVERY_BASE_URL ?? inferDeliveryBaseUrl());

export const getDeliveryWebhookUrl = () => `${getDeliveryBaseUrl()}/webhook/deliver`;
