import { useState } from 'react';
import type { UserProfile } from '@/types';
import { CrystalBallPage } from './CrystalBallPage';
import { NumerologyPage } from './NumerologyPage';
import { DreamExplainPage } from './DreamExplainPage';

interface FortunePageProps {
  profile: UserProfile;
}

export function FortunePage({ profile }: FortunePageProps) {
  const [view, setView] = useState<'menu' | 'crystal-ball' | 'numerology' | 'dream'>('menu');

  const handleCardClick = (cardType: 'crystal-ball' | 'numerology' | 'dream-explain') => {
    if (cardType === 'crystal-ball') {
      setView('crystal-ball');
    } else if (cardType === 'numerology') {
      setView('numerology');
    } else if (cardType === 'dream-explain') {
      setView('dream');
    }
  };

  if (view === 'crystal-ball') {
    return <CrystalBallPage profile={profile} onBack={() => setView('menu')} />;
  }

  if (view === 'numerology') {
    return <NumerologyPage profile={profile} onBack={() => setView('menu')} />;
  }

  if (view === 'dream') {
    return <DreamExplainPage profile={profile} onBack={() => setView('menu')} />;
  }

  return (
    <div className="flex flex-col h-full bg-[#0a0a12] text-white overflow-y-auto pb-20">
      {/* Header */}
      <header className="p-4 pt-6">
        <h1 className="text-2xl font-light tracking-[0.15em] uppercase text-purple-400">Guidance</h1>
      </header>

      {/* Cards Container */}
      <div className="px-4 space-y-4 mt-2">
        {/* Crystal Ball Card */}
        <button
          onClick={() => handleCardClick('crystal-ball')}
          className="w-full text-left rounded-3xl overflow-hidden border border-yellow-600/30 bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1a] p-5 transition-all active:scale-[0.98]"
        >
          <div className="flex flex-col">
            {/* Crystal Ball Icon */}
            <div className="w-20 h-20 mb-4 relative">
              <div className="absolute inset-0 rounded-full bg-yellow-500/20 blur-xl" />
              <img 
                src="/figma/asset/Ball gif 1.png" 
                alt="Crystal Ball"
                className="w-full h-full object-contain relative z-10"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.innerHTML = `
                    <div class="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                      <div class="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-300/80 to-yellow-500/80 border-2 border-yellow-400/50"></div>
                    </div>
                  `;
                }}
              />
            </div>
            <h2 className="text-xl font-semibold text-yellow-400 mb-1">Crystal Ball</h2>
            <p className="text-sm text-white/60">Seek wisdom and ask any thing to learn</p>
          </div>
        </button>

        {/* Numerology Card */}
        <button
          onClick={() => handleCardClick('numerology')}
          className="w-full text-left rounded-3xl overflow-hidden border border-pink-500/30 bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1a] p-5 transition-all active:scale-[0.98]"
        >
          <div className="flex flex-col">
            {/* Numerology Icon - Pink blob with number 3 */}
            <div className="w-20 h-20 mb-4 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-pink-500/20 blur-xl rounded-full" />
              <div className="relative z-10 w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-600 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] flex items-center justify-center shadow-lg shadow-pink-500/30">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-pink-400 mb-1">Numerology</h2>
            <p className="text-sm text-pink-400/70">304 Reports delivered today</p>
          </div>
        </button>

        {/* Dream Explain Card */}
        <button
          onClick={() => handleCardClick('dream-explain')}
          className="w-full text-left rounded-3xl overflow-hidden border border-purple-500/20 bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1a] transition-all active:scale-[0.98] relative min-h-[200px]"
        >
          {/* Background Image */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a12] via-[#0a0a12]/60 to-transparent z-10" />
            <img 
              src="/figma/asset/Frame 107.png" 
              alt=""
              className="w-full h-full object-cover opacity-60"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            {/* Fallback gradient pyramid effect */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-0 h-0 border-l-[60px] border-r-[60px] border-b-[120px] border-l-transparent border-r-transparent border-b-purple-900/30 transform translate-y-4" />
            </div>
          </div>
          
          <div className="relative z-20 p-5 flex flex-col justify-end h-full min-h-[200px]">
            <h2 className="text-xl font-semibold text-purple-400 mb-1">Dream Explain</h2>
            <p className="text-sm text-white/60">Let Luna explain your dream</p>
          </div>
        </button>
      </div>
    </div>
  );
}
