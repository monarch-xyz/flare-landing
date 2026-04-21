import { sanitizeReturnTo } from '@/lib/auth/redirect';

export const TELEGRAM_STATUS_PARAM = 'telegram';
export const TELEGRAM_RETURN_TO_PARAM = 'returnTo';
export const TELEGRAM_RETURN_TO_COOKIE = 'iruka_telegram_return_to';
export const DEFAULT_TEMPLATE_PATH = '/signals/new';
export const HUMAN_TEMPLATE_PATH = '/signals/new/human';
export const AGENT_TEMPLATE_PATH = '/signals/new/agent';
export const CUSTOM_TEMPLATE_PATH = '/signals/new/custom';
export const ADVANCED_TEMPLATE_PATH = CUSTOM_TEMPLATE_PATH;
export const SIMPLE_TEMPLATE_PATH = HUMAN_TEMPLATE_PATH;

export type TelegramFlowStatus = 'linked' | 'expired' | 'missing-token' | 'failed' | 'required';

export const resolveTelegramReturnTo = (value: string | null | undefined): string | null => sanitizeReturnTo(value);

export const buildTelegramPath = ({
  status,
  returnTo,
}: {
  status?: TelegramFlowStatus | null;
  returnTo?: string | null;
} = {}) => {
  const params = new URLSearchParams();
  const safeReturnTo = resolveTelegramReturnTo(returnTo);

  if (status) {
    params.set(TELEGRAM_STATUS_PARAM, status);
  }

  if (safeReturnTo) {
    params.set(TELEGRAM_RETURN_TO_PARAM, safeReturnTo);
  }

  const search = params.toString();

  return search ? `/telegram?${search}` : '/telegram';
};

export const buildTelegramStartPath = (returnTo?: string | null) => {
  const safeReturnTo = resolveTelegramReturnTo(returnTo);
  const params = new URLSearchParams();

  if (safeReturnTo) {
    params.set(TELEGRAM_RETURN_TO_PARAM, safeReturnTo);
  }

  const search = params.toString();

  return search ? `/telegram/start?${search}` : '/telegram/start';
};

export const buildTemplatePath = (preset?: string | null) => {
  const trimmedPreset = preset?.trim();
  if (!trimmedPreset) {
    return CUSTOM_TEMPLATE_PATH;
  }

  const params = new URLSearchParams({
    preset: trimmedPreset,
  });

  return `${CUSTOM_TEMPLATE_PATH}?${params.toString()}`;
};

export const buildTemplateEntryPath = (telegramLinked: boolean, returnTo: string = DEFAULT_TEMPLATE_PATH) => {
  const safeReturnTo = resolveTelegramReturnTo(returnTo) ?? DEFAULT_TEMPLATE_PATH;

  return telegramLinked
    ? safeReturnTo
    : buildTelegramPath({
        status: 'required',
        returnTo: safeReturnTo,
      });
};
