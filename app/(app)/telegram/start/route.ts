import { NextRequest, NextResponse } from 'next/server';
import type { TelegramChallengeResponse } from '@/lib/auth/types';
import { getSessionCookie } from '@/lib/auth/constants';
import { buildLoginHref } from '@/lib/auth/redirect';
import { buildRequestUrl } from '@/lib/http/origin';
import { fetchIruka } from '@/lib/iruka/server';
import { buildTelegramPath, resolveTelegramReturnTo, TELEGRAM_RETURN_TO_PARAM } from '@/lib/telegram/setup-flow';

const redirectTo = (request: NextRequest, location: string) =>
  NextResponse.redirect(buildRequestUrl(request, location));

const buildLoginPath = (request: NextRequest) => {
  const returnTo = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  return buildLoginHref(returnTo);
};

export async function GET(request: NextRequest) {
  const returnTo = resolveTelegramReturnTo(request.nextUrl.searchParams.get(TELEGRAM_RETURN_TO_PARAM));

  if (!getSessionCookie(request.cookies)?.value) {
    return redirectTo(request, buildLoginPath(request));
  }

  try {
    const response = await fetchIruka('/me/integrations/telegram/challenge', {
      method: 'POST',
    });

    if (response.ok) {
      const payload = (await response.json()) as TelegramChallengeResponse;
      return NextResponse.redirect(payload.bot_deep_link);
    }

    if (response.status === 401) {
      return redirectTo(request, buildLoginPath(request));
    }
  } catch {
    // Fall through to challenge failure redirect.
  }

  return redirectTo(
    request,
    buildTelegramPath({
      status: 'challenge-failed',
      returnTo,
    })
  );
}
