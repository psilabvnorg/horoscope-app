import { useState } from 'react';
import type { TarotCard as TarotCardType } from '@/types';
import { Sparkles } from 'lucide-react';

interface TarotCardProps {
  card: TarotCardType;
  reversed?: boolean;
  revealed?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export function TarotCardComponent({
  card,
  reversed = false,
  revealed = false,
  onClick,
  size = 'md'
}: TarotCardProps) {
  const [isFlipped, setIsFlipped] = useState(revealed);

  const handleClick = () => {
    if (!isFlipped) {
      setIsFlipped(true);
    }
    onClick?.();
  };

  const sizeClasses = {
    sm: 'w-24 h-40',
    md: 'w-36 h-56',
    lg: 'w-48 h-80',
  };

  return (
    <div
      className={`relative ${sizeClasses[size]} cursor-pointer perspective-1000 group`}
      onClick={handleClick}
    >
      <div
        className={`relative w-full h-full transition-all duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : 'hover:scale-105'
          }`}
        style={{
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Card back */}
        <div
          className="absolute inset-0 backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="w-full h-full rounded-2xl bg-gradient-to-br from-violet-900 via-purple-900 to-black shadow-2xl flex items-center justify-center border border-white/10 overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.3)_0%,transparent_70%)] animate-pulse" />
            <div className="w-full h-full p-4 relative z-10">
              <div className="w-full h-full border border-violet-500/20 rounded-xl flex items-center justify-center bg-black/20">
                <div className="text-center">
                  <Sparkles className="w-8 h-8 text-violet-400 mx-auto mb-2 filter drop-shadow-[0_0_8px_rgba(167,139,250,0.5)]" />
                  <div className="text-violet-300 text-[10px] font-black tracking-[0.3em]">HOROS</div>
                </div>
              </div>
            </div>
            {/* Corner decals */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-violet-500/40 rounded-tl-lg" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-violet-500/40 rounded-tr-lg" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-violet-500/40 rounded-bl-lg" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-violet-500/40 rounded-br-lg" />
          </div>
        </div>

        {/* Card front */}
        <div
          className="absolute inset-0 backface-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div
            className={`w-full h-full rounded-2xl glass-card shadow-2xl overflow-hidden border border-white/10 flex flex-col`}
            style={{ transform: reversed ? 'rotate(180deg)' : 'none' }}
          >
            {/* Card contents */}
            <div className="h-3/5 relative overflow-hidden flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent" />
              <div className="text-6xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                {card.arcana === 'major' ? '🔮' :
                  card.suit === 'cups' ? '💧' :
                    card.suit === 'pentacles' ? '💰' :
                      card.suit === 'swords' ? '⚔️' : '🔥'}
              </div>
            </div>

            <div className="flex-1 p-3 flex flex-col justify-center text-center bg-black/40 border-t border-white/5">
              <div className="text-[8px] font-black text-violet-400 uppercase tracking-widest leading-none mb-1">
                {card.arcana === 'major' ? 'Major Arcana' : `${card.suit}`}
              </div>
              <div className="font-bold text-sm tracking-tight text-white line-clamp-2">
                {card.name}
              </div>
              {reversed && (
                <div className="text-[8px] font-black text-rose-500 mt-1 uppercase tracking-widest">Reversed</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
