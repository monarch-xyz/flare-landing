import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth/session';
import { buildSignalTemplate, SignalTemplateError, type SignalTemplateRequest } from '@/lib/signals/templates';
import { requestSentinel, SentinelRequestError } from '@/lib/sentinel/user-server';
import type { CreateSignalRequest, SignalRecord } from '@/lib/types/signal';

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
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

    const signal = await requestSentinel<SignalRecord>('/signals', {
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

    if (error instanceof SentinelRequestError) {
      return NextResponse.json(
        {
          error: 'sentinel_create_failed',
          details: error.message,
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
