import Link from 'next/link';
import { SignalListItem } from '@/lib/types/signal';

interface SignalRowProps {
  signal: SignalListItem;
}

export function SignalRow({ signal }: SignalRowProps) {
  return (
    <div className="grid grid-cols-1 gap-4 border-b border-border/70 py-4 sm:grid-cols-[2fr_1fr_1fr_1fr]">
      <div>
        <Link
          href={`/app/signals/${signal.id}`}
          className="font-zen text-lg text-foreground hover:text-[#ff6b35] transition-colors no-underline"
        >
          {signal.name}
        </Link>
        <p className="text-sm text-secondary">ID: {signal.id}</p>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-secondary">Status</p>
        <p className={signal.is_active ? 'text-[#ff6b35]' : 'text-secondary'}>
          {signal.is_active ? 'Active' : 'Paused'}
        </p>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-secondary">Last Trigger</p>
        <p className="text-sm text-secondary">{signal.last_triggered || '—'}</p>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-secondary">Triggers</p>
        <p className="text-sm text-secondary">{signal.trigger_count ?? 0}</p>
      </div>
    </div>
  );
}
