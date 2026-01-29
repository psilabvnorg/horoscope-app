import { useState, useRef, useCallback } from 'react';
import type { TraitCard, SwipeDirection } from '@/types';
import { Check, X, Info } from 'lucide-react';

interface SwipeCardProps {
  trait: TraitCard;
  onSwipe: (direction: SwipeDirection) => void;
  isTop: boolean;
}

export function SwipeCard({ trait, onSwipe, isTop }: SwipeCardProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (!isTop) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    startPos.current = { x: clientX, y: clientY };
    setIsDragging(true);
  }, [isTop]);

  const handleTouchMove = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging || !isTop) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const deltaX = clientX - startPos.current.x;
    const deltaY = clientY - startPos.current.y;
    
    setPosition({ x: deltaX, y: deltaY });
    setRotation(deltaX * 0.05);
  }, [isDragging, isTop]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    const threshold = 100;
    const verticalThreshold = 80;
    
    if (position.x > threshold) {
      // Swipe right - accept
      onSwipe('right');
    } else if (position.x < -threshold) {
      // Swipe left - reject
      onSwipe('left');
    } else if (position.y < -verticalThreshold) {
      // Swipe up - very accurate
      onSwipe('up');
    } else {
      // Reset position
      setPosition({ x: 0, y: 0 });
      setRotation(0);
    }
  }, [position, onSwipe, isDragging]);

  const handleTap = useCallback(() => {
    if (!isDragging && Math.abs(position.x) < 5 && Math.abs(position.y) < 5) {
      setShowDetails(!showDetails);
    }
  }, [showDetails, isDragging, position]);

  const getSwipeIndicator = () => {
    if (position.x > 50) {
      return (
        <div className="absolute top-8 right-8 bg-green-500 text-white px-4 py-2 rounded-full font-bold text-lg transform rotate-12 border-2 border-white shadow-lg">
          <Check className="w-6 h-6 inline mr-1" />
          ME
        </div>
      );
    }
    if (position.x < -50) {
      return (
        <div className="absolute top-8 left-8 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-lg transform -rotate-12 border-2 border-white shadow-lg">
          <X className="w-6 h-6 inline mr-1" />
          NOT ME
        </div>
      );
    }
    if (position.y < -50) {
      return (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-violet-500 text-white px-4 py-2 rounded-full font-bold text-lg border-2 border-white shadow-lg">
          <Info className="w-6 h-6 inline mr-1" />
          VERY ACCURATE
        </div>
      );
    }
    return null;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      personality: 'from-amber-400 to-orange-500',
      love: 'from-rose-400 to-pink-500',
      career: 'from-blue-400 to-indigo-500',
      social: 'from-green-400 to-emerald-500',
      emotion: 'from-violet-400 to-purple-500',
      spiritual: 'from-cyan-400 to-teal-500',
      challenge: 'from-red-400 to-rose-500',
    };
    return colors[category] || 'from-gray-400 to-slate-500';
  };

  return (
    <div
      ref={cardRef}
      className={`absolute inset-0 touch-none select-none ${isTop ? 'z-10' : 'z-0'}`}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0) rotate(${rotation}deg)`,
        transition: isDragging ? 'none' : 'transform 0.3s ease-out',
      }}
      onMouseDown={handleTouchStart}
      onMouseMove={handleTouchMove}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleTap}
    >
      <div className="w-full h-full bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 relative">
        {/* Swipe indicator overlay */}
        {getSwipeIndicator()}
        
        {/* Card content */}
        <div className="h-full flex flex-col">
          {/* Header with category badge */}
          <div className={`bg-gradient-to-r ${getCategoryColor(trait.category)} p-6`}>
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-medium uppercase tracking-wider">
              {trait.category}
            </span>
          </div>
          
          {/* Main content */}
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="text-8xl mb-6">{trait.emoji}</div>
            <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              {trait.trait}
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              {trait.description}
            </p>
          </div>
          
          {/* Expanded details */}
          {showDetails && (
            <div className="absolute inset-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm p-8 flex flex-col items-center justify-center animate-in fade-in duration-200">
              <div className="text-6xl mb-4">{trait.emoji}</div>
              <h4 className="text-2xl font-bold mb-4">{trait.trait}</h4>
              <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
                {trait.description}
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>Swipe Right: "This describes me"</p>
                <p>Swipe Left: "Not me"</p>
                <p>Swipe Up: "Very accurate"</p>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowDetails(false); }}
                className="mt-6 px-6 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm"
              >
                Close
              </button>
            </div>
          )}
          
          {/* Action hints */}
          <div className="p-6 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex justify-between items-center text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <X className="w-4 h-4" />
                <span>Not me</span>
              </div>
              <div className="flex items-center gap-1">
                <Info className="w-4 h-4" />
                <span>Details</span>
              </div>
              <div className="flex items-center gap-1">
                <Check className="w-4 h-4" />
                <span>Me</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
