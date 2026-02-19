import { ReactNode } from 'react';
import { Card } from '@/components/ui/Card';

interface StatCardProps {
  label: string;
  value: string;
  icon: ReactNode;
}

export function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <Card className="flex items-center justify-between gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-secondary mb-2">{label}</p>
        <p className="font-zen text-2xl font-semibold">{value}</p>
      </div>
      <div className="w-10 h-10 rounded-md bg-[#ff6b35]/10 text-[#ff6b35] flex items-center justify-center">
        {icon}
      </div>
    </Card>
  );
}
