import { useMonthlyEnergy } from '@/hooks/useMonthlyEnergy';
import type { ZodiacSign, EnergyStatus } from '@/types';
import { Sparkles, AlertTriangle, Star } from 'lucide-react';

interface MonthlyEnergyProps {
  sign: ZodiacSign;
}

const statusConfig: Record<EnergyStatus, { icon: typeof Star; color: string; bgColor: string; label: string }> = {
  aligned: {
    icon: Star,
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    label: 'Aligned',
  },
  compatible: {
    icon: Sparkles,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    label: 'Compatible',
  },
  challenging: {
    icon: AlertTriangle,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/20',
    label: 'Challenging',
  },
};

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function MonthlyEnergy({ sign }: MonthlyEnergyProps) {
  const currentMonth = new Date().getMonth();
  const { status, description } = useMonthlyEnergy(sign);
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <section className="space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">
        {MONTH_NAMES[currentMonth]} Energy
      </h3>
      
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 space-y-4">
        {/* Status Badge */}
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full ${config.bgColor} flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${config.color}`} />
          </div>
          <div>
            <span className={`text-sm font-semibold ${config.color}`}>{config.label}</span>
            <p className="text-xs text-white/40 capitalize">{sign} • {MONTH_NAMES[currentMonth]} 2026</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-white/60 leading-relaxed">
          {description}
        </p>
      </div>
    </section>
  );
}
