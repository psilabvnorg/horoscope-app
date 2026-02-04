import type { ZodiacSign } from '@/types';
import { ZODIAC_DATES } from '@/types';

interface ZodiacSignCardProps {
  sign: ZodiacSign;
  size?: 'sm' | 'md' | 'lg';
  showDateRange?: boolean;
  showSymbol?: boolean;
  interactive?: boolean;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

const zodiacColors: Record<ZodiacSign, { primary: string; glow: string }> = {
  aries: { primary: '#ef4444', glow: 'rgba(239, 68, 68, 0.4)' },
  taurus: { primary: '#22c55e', glow: 'rgba(34, 197, 94, 0.4)' },
  gemini: { primary: '#eab308', glow: 'rgba(234, 179, 8, 0.4)' },
  cancer: { primary: '#ef4444', glow: 'rgba(239, 68, 68, 0.4)' },
  leo: { primary: '#a855f7', glow: 'rgba(168, 85, 247, 0.4)' },
  virgo: { primary: '#d4a574', glow: 'rgba(212, 165, 116, 0.4)' },
  libra: { primary: '#ec4899', glow: 'rgba(236, 72, 153, 0.4)' },
  scorpio: { primary: '#ef4444', glow: 'rgba(239, 68, 68, 0.4)' },
  sagittarius: { primary: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.4)' },
  capricorn: { primary: '#6b7280', glow: 'rgba(107, 114, 128, 0.4)' },
  aquarius: { primary: '#06b6d4', glow: 'rgba(6, 182, 212, 0.4)' },
  pisces: { primary: '#3b82f6', glow: 'rgba(59, 130, 246, 0.4)' },
};

const zodiacSymbols: Record<ZodiacSign, string> = {
  aries: '♈',
  taurus: '♉',
  gemini: '♊',
  cancer: '♋',
  leo: '♌',
  virgo: '♍',
  libra: '♎',
  scorpio: '♏',
  sagittarius: '♐',
  capricorn: '♑',
  aquarius: '♒',
  pisces: '♓',
};

const sizes = {
  sm: { container: 'w-16 h-16', text: 'text-2xl', name: 'text-xs', date: 'text-[10px]' },
  md: { container: 'w-24 h-24', text: 'text-4xl', name: 'text-sm', date: 'text-xs' },
  lg: { container: 'w-32 h-32', text: 'text-5xl', name: 'text-base', date: 'text-sm' },
};

function getDateRange(sign: ZodiacSign): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const range = ZODIAC_DATES[sign];
  const startMonth = months[range.start[0] - 1];
  const endMonth = months[range.end[0] - 1];
  return `${range.start[1]} ${startMonth} - ${range.end[1]} ${endMonth}`;
}

export function ZodiacSignCard({
  sign,
  size = 'md',
  showDateRange = false,
  showSymbol = true,
  interactive = false,
  selected = false,
  onClick,
  className = '',
}: ZodiacSignCardProps) {
  const colors = zodiacColors[sign];
  const sizeClasses = sizes[size];
  const symbol = zodiacSymbols[sign];

  const containerClasses = `
    ${sizeClasses.container}
    rounded-full
    flex items-center justify-center
    transition-all duration-300
    ${interactive ? 'cursor-pointer hover:scale-110' : ''}
    ${selected ? 'ring-4 ring-white/50 scale-110' : ''}
    ${className}
  `;

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={containerClasses}
        style={{
          backgroundColor: colors.primary,
          boxShadow: selected ? `0 0 30px ${colors.glow}` : `0 0 20px ${colors.glow}`,
        }}
        onClick={onClick}
      >
        {showSymbol && (
          <span className={`${sizeClasses.text} text-white font-bold`}>
            {symbol}
          </span>
        )}
      </div>
      <div className="text-center">
        <p className={`${sizeClasses.name} text-white font-medium capitalize`}>
          {sign}
        </p>
        {showDateRange && (
          <p className={`${sizeClasses.date} text-white/60`}>
            {getDateRange(sign)}
          </p>
        )}
      </div>
    </div>
  );
}
