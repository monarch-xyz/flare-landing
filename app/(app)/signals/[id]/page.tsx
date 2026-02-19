import { Button } from '@/components/ui/Button';

const mockLogs = [
  {
    triggered_at: '2026-02-18T15:30:00Z',
    delivered: true,
    delivery_type: 'telegram',
    result: { condition_met: true, left_value: 150000, right_value: 200000, change_percent: -25 },
  },
  {
    triggered_at: '2026-02-17T12:10:00Z',
    delivered: true,
    delivery_type: 'telegram',
    result: { condition_met: true, left_value: 180000, right_value: 200000, change_percent: -10 },
  },
];

export default function SignalDetailPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-secondary mb-2">Signal</p>
          <h1 className="font-zen text-3xl sm:text-4xl font-semibold">Net Supply Drop</h1>
          <p className="text-secondary mt-2">Track supply drawdowns for a single market.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="secondary">Edit</Button>
          <Button>Simulate</Button>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-lg p-6">
        <h2 className="font-zen text-xl font-semibold mb-3">Signal Definition</h2>
        <pre className="text-sm leading-relaxed bg-[#0d1117] text-[#e6edf3] rounded-lg p-4 overflow-x-auto">
{`{
  "name": "Net Supply Drop",
  "chains": [1],
  "window": { "duration": "7d" },
  "condition": {
    "type": "condition",
    "operator": "lt",
    "left": { "type": "event", "event_type": "Supply", "filters": [], "field": "assets", "aggregation": "sum" },
    "right": { "type": "constant", "value": 0.2 }
  },
  "delivery": { "type": "telegram", "target": "123456789" }
}`}
        </pre>
      </div>

      <div className="bg-surface border border-border rounded-lg p-6">
        <h2 className="font-zen text-xl font-semibold mb-4">Recent Triggers</h2>
        <div className="space-y-4">
          {mockLogs.map((log) => (
            <div key={log.triggered_at} className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary">Triggered at</p>
                  <p className="text-foreground font-medium">{log.triggered_at}</p>
                </div>
                <span className="text-xs uppercase tracking-[0.3em] text-[#ff6b35]">{log.delivery_type}</span>
              </div>
              <pre className="text-xs mt-4 bg-[#0d1117] text-[#e6edf3] rounded-md p-3 overflow-x-auto">
                {JSON.stringify(log.result, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
