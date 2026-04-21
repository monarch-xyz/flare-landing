import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth/session';
import { buildSignalTemplate, SignalTemplateError, type SignalTemplateRequest } from '@/lib/signals/templates';
import { requestIruka, IrukaRequestError } from '@/lib/iruka/user-server';
import { getTelegramLinkStatus } from '@/lib/telegram/link-state';
import type { CreateSignalRequest, SignalRecord } from '@/lib/types/signal';

const extractNestedDetails = (payload: unknown): string | null => {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const record = payload as Record<string, unknown>;
  const direct =
    (typeof record.details === 'string' ? record.details : undefined) ??
    (typeof record.message === 'string' ? record.message : undefined) ??
    (typeof record.error === 'string' ? record.error : undefined);

  if (direct && !direct.startsWith('Iruka request failed')) {
    return direct;
  }

  for (const value of Object.values(record)) {
    const nested = extractNestedDetails(value);
    if (nested) {
      return nested;
    }
  }

  return direct ?? null;
};

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const telegramStatus = await getTelegramLinkStatus();
  if (!telegramStatus.linked) {
    return NextResponse.json(
      {
        error: 'telegram_required',
        details: 'Connect Telegram before creating a template signal.',
      },
      { status: 403 }
    );
  }

  let payload: SignalTemplateRequest;
  try {
    payload = (await request.json()) as SignalTemplateRequest;
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  try {
    const templatePayload = buildSignalTemplate(payload);
    const createSignalPayload: CreateSignalRequest = templatePayload;

    const signal = await requestIruka<SignalRecord>('/signals', {
      method: 'POST',
      body: JSON.stringify(createSignalPayload),
    });

    return NextResponse.json(signal, { status: 201 });
  } catch (error) {
    if (error instanceof SignalTemplateError) {
      return NextResponse.json(
        {
          error: 'invalid_template_input',
          details: error.message,
        },
        { status: 400 }
      );
    }

    if (error instanceof IrukaRequestError) {
      return NextResponse.json(
        {
          error: 'iruka_create_failed',
          details: extractNestedDetails(error.payload) ?? error.message,
          payload: error.payload,
        },
        { status: error.status }
      );
    }

    return NextResponse.json(
      {
        error: 'template_create_failed',
        details: error instanceof Error ? error.message : 'unknown_error',
      },
      { status: 500 }
    );
  }
}
