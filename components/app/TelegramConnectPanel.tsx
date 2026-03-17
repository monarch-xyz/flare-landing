'use client';

import { FormEvent, useState } from 'react';
import { RiCheckboxCircleLine, RiSettings3Line, RiTelegram2Line } from 'react-icons/ri';
import { TelegramSetupGuide } from '@/components/app/TelegramSetupGuide';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { telegramBotLabel, telegramBotUrl } from '@/lib/telegram/config';

interface TelegramConnectResponse {
  ok?: boolean;
  app_user_id?: string;
  linked_at?: string;
  details?: string;
}

interface TelegramConnectPanelProps {
  initialStatus: {
    linked: boolean;
    linkedAt: string | null;
  };
}

const formatLinkedAt = (value: string | null) => {
  if (!value) {
    return null;
  }

  return new Date(value).toLocaleDateString();
};

export function TelegramConnectPanel({ initialStatus }: TelegramConnectPanelProps) {
  const [token, setToken] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [isLinked, setIsLinked] = useState(initialStatus.linked);
  const [linkedAt, setLinkedAt] = useState<string | null>(initialStatus.linkedAt);
  const [isEditing, setIsEditing] = useState(!initialStatus.linked);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    setMessage(null);

    try {
      const response = await fetch('/api/telegram/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const payload = (await response.json().catch(() => null)) as TelegramConnectResponse | null;
      if (!response.ok || !payload?.ok) {
        throw new Error(payload?.details ?? 'Unable to connect Telegram.');
      }

      setStatus('success');
      setIsLinked(true);
      setLinkedAt(payload.linked_at ?? new Date().toISOString());
      setIsEditing(false);
      setMessage(null);
      setToken('');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Unable to connect Telegram.');
    }
  };

  const linkedDate = formatLinkedAt(linkedAt);

  return (
    <Card className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-secondary">Telegram</p>
          <h2 className="mt-2 font-zen text-2xl">Telegram settings</h2>
          <p className="mt-2 text-sm text-secondary">
            {isLinked && !isEditing ? 'Telegram is ready.' : 'Link Telegram once to receive alerts.'}
          </p>
        </div>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-sm ${
            isLinked && !isEditing ? 'bg-emerald-500/10 text-emerald-600' : 'bg-[#229ED9]/10 text-[#229ED9]'
          }`}
        >
          {isLinked && !isEditing ? <RiCheckboxCircleLine className="h-5 w-5" /> : <RiSettings3Line className="h-5 w-5" />}
        </div>
      </div>

      {isLinked && !isEditing ? (
        <>
          <div className="rounded-sm border border-emerald-500/30 bg-emerald-500/5 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-foreground">Telegram is connected</p>
                <p className="mt-1 text-sm text-secondary">
                  {linkedDate
                    ? `Connected on ${linkedDate}. No further setup is needed here.`
                    : 'Telegram is ready for alerts.'}
                </p>
              </div>
              <RiCheckboxCircleLine className="mt-0.5 h-5 w-5 text-emerald-600" />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" variant="secondary" onClick={() => setIsEditing(true)}>
              Relink Telegram
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="rounded-sm border border-border/80 bg-background/50 p-3 text-sm text-secondary">
            Open {telegramBotLabel}, send <span className="font-mono text-foreground">/start</span>, then paste the pairing code here.
          </div>

          <a href={telegramBotUrl} target="_blank" rel="noreferrer" className="inline-flex w-fit no-underline">
            <Button type="button" variant="secondary" className="gap-2">
              Open {telegramBotLabel}
              <RiTelegram2Line className="h-4 w-4" />
            </Button>
          </a>

          <form className="space-y-3" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-2 text-sm text-secondary">
              Pairing code
              <input
                type="text"
                value={token}
                onChange={(event) => setToken(event.target.value)}
                placeholder="Paste the code from Telegram"
                className="rounded-sm border border-border bg-transparent px-3 py-2 text-sm text-foreground"
              />
            </label>
            <Button type="submit" disabled={!token || status === 'loading'}>
              {status === 'loading' ? 'Connecting Telegram...' : isLinked ? 'Save new Telegram link' : 'Connect Telegram'}
            </Button>
          </form>

          <div className="flex flex-wrap items-center gap-3">
            <TelegramSetupGuide triggerLabel="Need help" triggerVariant="ghost" />
          </div>
        </>
      )}

      {message && status === 'error' ? (
        <p className={status === 'error' ? 'text-sm text-red-500' : 'text-sm text-emerald-600'}>
          {message}
        </p>
      ) : null}
    </Card>
  );
}
