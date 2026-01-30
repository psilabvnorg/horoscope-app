import { zodiacData } from '@/data';
import type { ZodiacSign } from '@/types';
import { X } from 'lucide-react';

interface ZodiacDetailProps {
  sign: ZodiacSign;
  onClose: () => void;
}

const zodiacSymbols: Record<ZodiacSign, string> = {
  aries: '♈', taurus: '♉', gemini: '♊', cancer: '♋',
  leo: '♌', virgo: '♍', libra: '♎', scorpio: '♏',
  sagittarius: '♐', capricorn: '♑', aquarius: '♒', pisces: '♓'
};

const zodiacColors: Record<ZodiacSign, string> = {
  aries: 'from-red-500/30 to-orange-500/30',
  taurus: 'from-green-500/30 to-emerald-500/30',
  gemini: 'from-yellow-500/30 to-amber-500/30',
  cancer: 'from-blue-500/30 to-cyan-500/30',
  leo: 'from-orange-500/30 to-yellow-500/30',
  virgo: 'from-amber-500/30 to-yellow-500/30',
  libra: 'from-pink-500/30 to-rose-500/30',
  scorpio: 'from-red-600/30 to-purple-500/30',
  sagittarius: 'from-purple-500/30 to-indigo-500/30',
  capricorn: 'from-gray-500/30 to-slate-500/30',
  aquarius: 'from-cyan-500/30 to-blue-500/30',
  pisces: 'from-indigo-500/30 to-purple-500/30',
};

export function ZodiacDetail({ sign, onClose }: ZodiacDetailProps) {
  const signKey = sign.charAt(0).toUpperCase() + sign.slice(1) as keyof typeof zodiacData;
  const description = zodiacData[signKey] || 'Description not available.';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md max-h-[80vh] bg-[#1a1a2e] rounded-3xl border border-purple-500/20 overflow-hidden flex flex-col">
        {/* Header */}
        <div className={`p-6 bg-gradient-to-br ${zodiacColors[sign]} relative`}>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/30 flex items-center justify-center hover:bg-black/50 transition-all"
          >
            <X className="w-4 h-4 text-white" />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-4xl">
              {zodiacSymbols[sign]}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white capitalize">{sign}</h2>
              <p className="text-white/60 text-sm">Your Zodiac Sign</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-purple-400 mb-3">
            Personality Profile
          </h3>
          <p className="text-white/70 text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
