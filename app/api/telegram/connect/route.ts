import { NextResponse } from 'next/server';
import { getAuthenticatedContext } from '@/lib/auth/session';
import { connectDeliveryLink, DeliveryError } from '@/lib/delivery/server';
import { ensureProfileWithSentinelApiKey } from '@/lib/supabase/profiles';
import {
  buildTelegramLinkCookieValue,
  getTelegramLinkCookieOptions,
  TELEGRAM_LINK_COOKIE,
} from '@/lib/telegram/link-state';

interface TelegramConnectPayload {
  token: string;
}

const handleConnect = async (payload: TelegramConnectPayload) => {
  if (!payload?.token) {
    return NextResponse.json({ error: 'missing_token' }, { status: 400 });
  }

  const auth = await getAuthenticatedContext();
  if (!auth) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    const provisioning = await ensureProfileWithSentinelApiKey({ user: auth.user });
    const deliveryResponse = await connectDeliveryLink({
      token: payload.token,
      appUserId: provisioning.sentinelUserId,
    });
    const linkedAt = new Date().toISOString();
    const response = NextResponse.json({
      ok: true,
      app_user_id: provisioning.sentinelUserId,
      linked_at: linkedAt,
      delivery: deliveryResponse,
    });
    response.cookies.set(
      TELEGRAM_LINK_COOKIE,
      buildTelegramLinkCookieValue(auth.user, linkedAt),
      getTelegramLinkCookieOptions()
    );

    return response;
  } catch (error) {
    if (error instanceof DeliveryError) {
      return NextResponse.json(
        {
          error: 'telegram_connect_failed',
          details: error.message,
          delivery: error.payload,
        },
        { status: error.status }
      );
    }

    return NextResponse.json(
      {
        error: 'telegram_connect_failed',
        details: error instanceof Error ? error.message : 'unknown_error',
      },
      { status: 500 }
    );
  }
};

export async function POST(request: Request) {
  let payload: TelegramConnectPayload;
  try {
    payload = (await request.json()) as TelegramConnectPayload;
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  return handleConnect(payload);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');

  return handleConnect({
    token: token ?? '',
  });
}
