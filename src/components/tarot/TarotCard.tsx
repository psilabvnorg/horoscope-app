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
      className={`relative ${sizeClasses[size]} cursor-pointer perspective-1000`}
      onClick={handleClick}
    >
      <div 
        className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
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
          <div className="w-full h-full rounded-xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 shadow-xl flex items-center justify-center border-2 border-violet-400/30">
            <div className="w-full h-full p-3">
              <div className="w-full h-full border border-violet-300/30 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Sparkles className="w-8 h-8 text-violet-200 mx-auto mb-2" />
                  <div className="text-violet-200 text-xs font-medium">HOROS</div>
                </div>
              </div>
            </div>
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
            className={`w-full h-full rounded-xl bg-white dark:bg-gray-900 shadow-xl overflow-hidden border-2 ${
              reversed ? 'border-red-300 dark:border-red-700' : 'border-violet-300 dark:border-violet-700'
            }`}
            style={{ transform: reversed ? 'rotate(180deg)' : 'none' }}
          >
            {/* Card image placeholder */}
            <div className="h-3/5 bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 flex items-center justify-center">
              <div className="text-4xl">
                {card.arcana === 'major' ? '🔮' : 
                 card.suit === 'cups' ? '💧' :
                 card.suit === 'pentacles' ? '💰' :
                 card.suit === 'swords' ? '⚔️' : '🔥'}
              </div>
            </div>
            
            {/* Card info */}
            <div className="h-2/5 p-2 flex flex-col justify-center">
              <div className="text-xs text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                {card.arcana === 'major' ? 'Major Arcana' : `${card.suit}`}
              </div>
              <div className="font-bold text-sm leading-tight mt-1">
                {card.name}
              </div>
              {reversed && (
                <div className="text-xs text-red-500 mt-1">Reversed</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
