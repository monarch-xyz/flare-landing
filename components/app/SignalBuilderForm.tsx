'use client';

import { useState } from 'react';
import { RiAlarmWarningLine, RiWaterFlashLine, RiPulseLine, RiExchangeDollarLine, RiUserSearchLine } from 'react-icons/ri';
import { SignalPresetCard } from '@/components/app/SignalPresetCard';
import { Button } from '@/components/ui/Button';

const presetOptions = [
  {
    id: 'net-supply-drop',
    title: 'Net Supply Drop',
    description: 'Alert when net supply falls under a threshold for a market.',
    icon: <RiAlarmWarningLine className="w-5 h-5" />,
  },
  {
    id: 'high-utilization',
    title: 'High Utilization',
    description: 'Notify when utilization exceeds a threshold.',
    icon: <RiWaterFlashLine className="w-5 h-5" />,
  },
  {
    id: 'liquidation-spike',
    title: 'Liquidation Spike',
    description: 'Alert on unusual liquidation volume spikes.',
    icon: <RiPulseLine className="w-5 h-5" />,
  },
  {
    id: 'position-change',
    title: 'Position Change',
    description: 'Track wallet position changes by percent.',
    icon: <RiExchangeDollarLine className="w-5 h-5" />,
  },
  {
    id: 'whale-exit',
    title: 'Whale Exit',
    description: 'Detect top holder exits across markets.',
    icon: <RiUserSearchLine className="w-5 h-5" />,
  },
];

export function SignalBuilderForm() {
  const [selectedPreset, setSelectedPreset] = useState(presetOptions[0].id);

  return (
    <div className="space-y-6">
      <div className="bg-surface border border-border rounded-lg p-4">
        <p className="text-xs uppercase tracking-[0.3em] text-secondary mb-2">Signal preset</p>
        <div className="flex flex-wrap gap-2">
          {presetOptions.map((option) => (
            <button
              key={option.id}
              className={`px-3 py-2 rounded-md text-sm border transition-colors ${
                selectedPreset === option.id
                  ? 'border-[#ff6b35] text-[#ff6b35] bg-[#ff6b35]/10'
                  : 'border-border text-secondary hover:text-foreground hover:bg-hovered'
              }`}
              onClick={() => setSelectedPreset(option.id)}
              type="button"
            >
              {option.title}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {presetOptions.map((option) => (
          <div key={option.id} className={selectedPreset === option.id ? 'block' : 'hidden'}>
            <SignalPresetCard title={option.title} description={option.description} icon={option.icon}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex flex-col gap-2 text-sm text-secondary">
                  Market
                  <input
                    type="text"
                    placeholder="0xmarket..."
                    className="rounded-md border border-border bg-transparent px-3 py-2 text-sm"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-secondary">
                  Threshold (%)
                  <input
                    type="number"
                    placeholder="20"
                    className="rounded-md border border-border bg-transparent px-3 py-2 text-sm"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-secondary">
                  Window
                  <select className="rounded-md border border-border bg-transparent px-3 py-2 text-sm">
                    <option value="1h">1h</option>
                    <option value="24h">24h</option>
                    <option value="7d">7d</option>
                  </select>
                </label>
                <label className="flex flex-col gap-2 text-sm text-secondary">
                  Delivery
                  <select className="rounded-md border border-border bg-transparent px-3 py-2 text-sm">
                    <option value="telegram">Telegram</option>
                    <option value="discord">Discord</option>
                    <option value="webhook">Webhook</option>
                  </select>
                </label>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex flex-col gap-2 text-sm text-secondary">
                  Delivery target
                  <input
                    type="text"
                    placeholder="@channel or webhook URL"
                    className="rounded-md border border-border bg-transparent px-3 py-2 text-sm"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-secondary">
                  Chain IDs
                  <input
                    type="text"
                    placeholder="1, 8453"
                    className="rounded-md border border-border bg-transparent px-3 py-2 text-sm"
                  />
                </label>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Button>Save signal</Button>
                <Button variant="secondary">Simulate</Button>
              </div>
            </SignalPresetCard>
          </div>
        ))}
      </div>
    </div>
  );
}
