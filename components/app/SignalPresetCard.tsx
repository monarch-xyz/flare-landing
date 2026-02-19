import { ReactNode } from 'react';
import { Card } from '@/components/ui/Card';

interface SignalPresetCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
}

export function SignalPresetCard({ title, description, icon, children }: SignalPresetCardProps) {
  return (
    <Card className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-md bg-[#ff6b35]/10 text-[#ff6b35] flex items-center justify-center">
          {icon}
        </div>
        <div>
          <h3 className="font-zen text-lg font-semibold mb-1">{title}</h3>
          <p className="text-sm text-secondary">{description}</p>
        </div>
      </div>
      {children}
    </Card>
  );
}
