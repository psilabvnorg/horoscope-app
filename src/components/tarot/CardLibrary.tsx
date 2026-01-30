import { useState } from 'react';
import { useTarot } from '@/hooks/useTarot';
import { TarotCardComponent } from './TarotCard';
import { X } from 'lucide-react';

interface CardLibraryProps {
  onClose: () => void;
}

export function CardLibrary({ onClose }: CardLibraryProps) {
  const { getCardById } = useTarot();
  const [selectedCard, setSelectedCard] = useState<any>(null);

  const handleCardClick = (id: number) => {
    const card = getCardById(id);
    if (card) {
      setSelectedCard(card);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a1a] text-white overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 p-4 bg-[#0a0a1a] border-b border-violet-500/20">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black uppercase tracking-widest italic bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Arcane Library
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-white/60 mt-2 text-center">Explore all 78 card meanings</p>
      </div>

      {/* Card Grid */}
      <div className="flex-1 p-4 space-y-8 pb-24">
        {/* Major Arcana Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="text-2xl">🔮</div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-violet-300">Major Arcana</h4>
            <div className="flex-1 h-px bg-gradient-to-r from-violet-500/50 to-transparent"></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 22 }, (_, i) => i).map((id) => {
              const card = getCardById(id);
              if (!card) return null;
              return (
                <button
                  key={id}
                  onClick={() => handleCardClick(id)}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-purple-900/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100"></div>
                  <div className="relative bg-[#0a0a1a] p-4 rounded-2xl border border-violet-500/20 group-hover:border-violet-400/40 transition-all group-hover:scale-105 backdrop-blur-sm">
                    <div className="text-3xl mb-2 filter drop-shadow-[0_0_8px_rgba(167,139,250,0.5)]">🔮</div>
                    <div className="text-[10px] font-black text-violet-300 truncate">{card.name}</div>
                    <div className="text-[8px] text-violet-400/60 uppercase tracking-wider mt-1">Major</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Wands Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="text-2xl">🔥</div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-orange-300">Wands</h4>
            <div className="flex-1 h-px bg-gradient-to-r from-orange-500/50 to-transparent"></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 14 }, (_, i) => i + 22).map((id) => {
              const card = getCardById(id);
              if (!card) return null;
              return (
                <button
                  key={id}
                  onClick={() => handleCardClick(id)}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 to-red-900/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100"></div>
                  <div className="relative bg-[#0a0a1a] p-4 rounded-2xl border border-orange-500/20 group-hover:border-orange-400/40 transition-all group-hover:scale-105 backdrop-blur-sm">
                    <div className="text-3xl mb-2 filter drop-shadow-[0_0_8px_rgba(251,146,60,0.5)]">🔥</div>
                    <div className="text-[10px] font-black text-orange-300 truncate">{card.name}</div>
                    <div className="text-[8px] text-orange-400/60 uppercase tracking-wider mt-1">Wands</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Cups Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="text-2xl">💧</div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-cyan-300">Cups</h4>
            <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/50 to-transparent"></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 14 }, (_, i) => i + 36).map((id) => {
              const card = getCardById(id);
              if (!card) return null;
              return (
                <button
                  key={id}
                  onClick={() => handleCardClick(id)}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 to-blue-900/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100"></div>
                  <div className="relative bg-[#0a0a1a] p-4 rounded-2xl border border-cyan-500/20 group-hover:border-cyan-400/40 transition-all group-hover:scale-105 backdrop-blur-sm">
                    <div className="text-3xl mb-2 filter drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">💧</div>
                    <div className="text-[10px] font-black text-cyan-300 truncate">{card.name}</div>
                    <div className="text-[8px] text-cyan-400/60 uppercase tracking-wider mt-1">Cups</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Swords Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="text-2xl">⚔️</div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-300">Swords</h4>
            <div className="flex-1 h-px bg-gradient-to-r from-slate-500/50 to-transparent"></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 14 }, (_, i) => i + 50).map((id) => {
              const card = getCardById(id);
              if (!card) return null;
              return (
                <button
                  key={id}
                  onClick={() => handleCardClick(id)}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-600/10 to-gray-900/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100"></div>
                  <div className="relative bg-[#0a0a1a] p-4 rounded-2xl border border-slate-500/20 group-hover:border-slate-400/40 transition-all group-hover:scale-105 backdrop-blur-sm">
                    <div className="text-3xl mb-2 filter drop-shadow-[0_0_8px_rgba(148,163,184,0.5)]">⚔️</div>
                    <div className="text-[10px] font-black text-slate-300 truncate">{card.name}</div>
                    <div className="text-[8px] text-slate-400/60 uppercase tracking-wider mt-1">Swords</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pentacles Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="text-2xl">💰</div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-amber-300">Pentacles</h4>
            <div className="flex-1 h-px bg-gradient-to-r from-amber-500/50 to-transparent"></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 14 }, (_, i) => i + 64).map((id) => {
              const card = getCardById(id);
              if (!card) return null;
              return (
                <button
                  key={id}
                  onClick={() => handleCardClick(id)}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-600/10 to-yellow-900/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100"></div>
                  <div className="relative bg-[#0a0a1a] p-4 rounded-2xl border border-amber-500/20 group-hover:border-amber-400/40 transition-all group-hover:scale-105 backdrop-blur-sm">
                    <div className="text-3xl mb-2 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">💰</div>
                    <div className="text-[10px] font-black text-amber-300 truncate">{card.name}</div>
                    <div className="text-[8px] text-amber-400/60 uppercase tracking-wider mt-1">Pentacles</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Card Detail Modal */}
      {selectedCard && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm">
          <div className="w-full max-h-[85vh] bg-[#0a0a1a] rounded-t-3xl border-t border-violet-500/20 overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-4 bg-gradient-to-br from-violet-500/20 to-purple-500/20 border-b border-violet-500/20 flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">{selectedCard.name}</h3>
                <button
                  onClick={() => setSelectedCard(null)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Card Display */}
              <div className="flex justify-center py-4">
                <TarotCardComponent
                  card={selectedCard}
                  reversed={false}
                  revealed={true}
                  size="lg"
                />
              </div>
            </div>

            {/* Card Details */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Keywords */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-violet-400 mb-2">Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCard.keywords.map((keyword: string, i: number) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-bold uppercase tracking-wider rounded-full"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* Upright Meaning */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-violet-400 mb-2">Upright Meaning</h4>
                <p className="text-sm text-white/80 leading-relaxed">{selectedCard.meaning.upright}</p>
              </div>

              {/* Reversed Meaning */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-2">Reversed Meaning</h4>
                <p className="text-sm text-white/80 leading-relaxed">{selectedCard.meaning.reversed}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
