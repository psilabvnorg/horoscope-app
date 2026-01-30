import { useState, useRef, useCallback, useEffect } from 'react';
import type { TraitCard, SwipeDirection } from '@/types';
import { Check, X } from 'lucide-react';

interface SwipeCardProps {
  trait: TraitCard;
  onSwipe: (direction: SwipeDirection) => void;
  isTop: boolean;
  forcedDirection?: SwipeDirection | null;
}

export function SwipeCard({ trait, onSwipe, isTop, forcedDirection }: SwipeCardProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  // Handle button-triggered swipes
  useEffect(() => {
    if (forcedDirection && isTop) {
      if (forcedDirection === 'right') {
        setPosition({ x: 1000, y: 0 });
        setRotation(20);
      } else if (forcedDirection === 'left') {
        setPosition({ x: -1000, y: 0 });
        setRotation(-20);
      } else if (forcedDirection === 'up') {
        setPosition({ x: 0, y: -1000 });
        setRotation(0);
      }
    }
  }, [forcedDirection, isTop]);

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
      // Swipe Right - Animate off-screen
      setPosition({ x: 1000, y: position.y });
      setRotation(20);
      setTimeout(() => onSwipe('right'), 200);
    } else if (position.x < -threshold) {
      // Swipe Left - Animate off-screen
      setPosition({ x: -1000, y: position.y });
      setRotation(-20);
      setTimeout(() => onSwipe('left'), 200);
    } else if (position.y < -verticalThreshold) {
      // Swipe Up - Animate off-screen
      setPosition({ x: position.x, y: -1000 });
      setRotation(0);
      setTimeout(() => onSwipe('up'), 200);
    } else {
      setPosition({ x: 0, y: 0 });
      setRotation(0);
    }
  }, [position, onSwipe, isDragging]);

  const getSwipeIndicator = () => {
    const opacity = Math.min(Math.abs(position.x) / 100, 0.9);
    const verticalOpacity = Math.min(Math.abs(position.y) / 100, 0.9);

    if (position.x > 20) {
      return (
        <div
          className="absolute inset-0 bg-violet-500/10 flex items-center justify-center z-20 pointer-events-none transition-opacity rounded-3xl"
          style={{ opacity }}
        >
          <div className="bg-violet-400 text-black px-6 py-3 rounded-full font-semibold text-sm uppercase tracking-widest">
            This is me
          </div>
        </div>
      );
    }
    if (position.x < -20) {
      return (
        <div
          className="absolute inset-0 bg-gray-500/10 flex items-center justify-center z-20 pointer-events-none transition-opacity rounded-3xl"
          style={{ opacity }}
        >
          <div className="bg-gray-700 text-white px-6 py-3 rounded-full font-semibold text-sm uppercase tracking-widest border border-gray-600">
            Skip
          </div>
        </div>
      );
    }
    if (position.y < -20) {
      return (
        <div
          className="absolute inset-0 bg-violet-500/10 flex items-center justify-center z-20 pointer-events-none transition-opacity rounded-3xl"
          style={{ opacity: verticalOpacity }}
        >
          <div className="bg-violet-400 text-black px-6 py-3 rounded-full font-semibold text-sm uppercase tracking-widest">
            Very accurate
          </div>
        </div>
      );
    }
    return null;
  };

  const getCategoryTheme = (_category: string) => {
    // All categories use the same violet theme for consistency
    return { gradient: 'from-violet-600/20 to-violet-900/40', accent: 'text-violet-400' };
  };

  const theme = getCategoryTheme(trait.category);

  return (
    <div
      ref={cardRef}
      className={`absolute inset-0 touch-none select-none ${isTop ? 'z-10' : 'z-0'}`}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0) rotate(${rotation}deg)`,
        transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      }}
      onMouseDown={handleTouchStart}
      onMouseMove={handleTouchMove}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="w-full h-full rounded-3xl overflow-hidden border border-violet-500/20 bg-gray-900/80 relative shadow-[0_0_40px_rgba(139,92,246,0.1)]">
        {getSwipeIndicator()}

        <div className="h-full flex flex-col">
          {/* Header area with icon */}
          <div className={`h-2/5 bg-gradient-to-br ${theme.gradient} relative overflow-hidden flex items-center justify-center p-8`}>
            <div className="absolute inset-0 bg-black/30" />
            
            {/* Category badge */}
            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-gray-900/60 border border-violet-500/20">
              <span className="text-[10px] uppercase tracking-widest font-medium text-violet-400">
                {trait.category}
              </span>
            </div>

            {/* Glowing icon container */}
            <div className="relative">
              <div className="absolute inset-0 blur-2xl bg-violet-500/20 scale-150" />
              <div className="relative text-8xl">
                {trait.emoji}
              </div>
            </div>
          </div>

          {/* Content area */}
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4 bg-black">
            <p className="text-gray-400 text-sm leading-relaxed">
              {trait.description}
            </p>

            <h3 className="text-2xl font-semibold tracking-wide text-white">
              {trait.trait}
            </h3>

            <div className="pt-4 flex gap-16 text-[10px] uppercase tracking-widest font-medium text-gray-600">
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-xl border border-gray-800 flex items-center justify-center">
                  <X className="w-5 h-5" />
                </div>
                <span>Skip</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-violet-400 flex items-center justify-center">
                  <Check className="w-5 h-5 text-black" />
                </div>
                <span>Me</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
