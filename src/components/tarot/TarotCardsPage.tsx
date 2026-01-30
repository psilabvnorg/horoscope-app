import { ChevronLeft } from 'lucide-react';

interface TarotCardsPageProps {
  onBack: () => void;
  onSelectReading: (type: string) => void;
}

export function TarotCardsPage({ onBack, onSelectReading }: TarotCardsPageProps) {
  return (
    <div className="flex flex-col h-full bg-[#0a0a1a] text-white overflow-hidden">
      {/* Header */}
      <header className="p-4 pt-6 flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-light tracking-[0.15em] uppercase text-white/90">
          Tarot Cards
        </h1>
      </header>

      {/* Featured Card with Light Rays */}
      <div className="relative flex justify-center py-8">
        {/* Light rays background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px]">
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 w-1 h-64 bg-gradient-to-t from-transparent via-indigo-500/20 to-transparent"
                style={{
                  transform: `translate(-50%, -100%) rotate(${i * 15}deg)`,
                  transformOrigin: 'bottom center',
                }}
              />
            ))}
          </div>
          {/* Glow effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/30 rounded-full blur-3xl" />
        </div>

        {/* Featured Tarot Card */}
        <div className="relative z-10">
          <FeaturedTarotCard />
        </div>
      </div>

      {/* Reading Options Grid */}
      <div className="flex-1 px-4 pb-24 overflow-auto">
        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
          {/* Daily Tarot */}
          <button
            onClick={() => onSelectReading('daily')}
            className="bg-[#12122a] border border-indigo-500/30 rounded-2xl p-4 text-left hover:border-indigo-400/50 transition-all active:scale-[0.98]"
          >
            <div className="mb-8">
              <DailyTarotIcon />
            </div>
            <span className="text-sm font-medium text-white">Daily Tarot</span>
          </button>

          {/* Near Future */}
          <button
            onClick={() => onSelectReading('near-future')}
            className="bg-[#12122a] border border-indigo-500/30 rounded-2xl p-4 text-left hover:border-indigo-400/50 transition-all active:scale-[0.98]"
          >
            <div className="mb-8">
              <NearFutureIcon />
            </div>
            <span className="text-sm font-medium text-white">Near Future</span>
          </button>

          {/* Love & Relations */}
          <button
            onClick={() => onSelectReading('love')}
            className="bg-[#12122a] border border-indigo-500/30 rounded-2xl p-4 text-left hover:border-indigo-400/50 transition-all active:scale-[0.98]"
          >
            <div className="mb-8">
              <LoveIcon />
            </div>
            <span className="text-sm font-medium text-white">Love & Relations</span>
          </button>

          {/* Yes or No */}
          <button
            onClick={() => onSelectReading('yes-no')}
            className="bg-[#12122a] border border-indigo-500/30 rounded-2xl p-4 text-left hover:border-indigo-400/50 transition-all active:scale-[0.98]"
          >
            <div className="mb-8">
              <YesNoIcon />
            </div>
            <span className="text-sm font-medium text-white">Yes or No</span>
          </button>
        </div>

        {/* Card Meanings - Full Width */}
        <div className="max-w-md mx-auto mt-3">
          <button
            onClick={() => onSelectReading('meanings')}
            className="w-full bg-[#12122a] border border-indigo-500/30 rounded-2xl p-4 text-left hover:border-indigo-400/50 transition-all active:scale-[0.98] flex items-center gap-3"
          >
            <CardMeaningsIcon />
            <span className="text-sm font-medium text-white">Card Meanings</span>
          </button>
        </div>
      </div>
    </div>
  );
}


// Featured Tarot Card Component (Two of Cups style)
function FeaturedTarotCard() {
  return (
    <div className="w-52 h-72 rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/30 border border-indigo-400/30">
      <div className="w-full h-full bg-gradient-to-b from-sky-400 via-sky-300 to-emerald-400 relative">
        {/* Roman numeral */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-2xl font-serif text-slate-800">
          II
        </div>
        
        {/* Winged lion */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2">
          <svg width="80" height="40" viewBox="0 0 80 40" fill="none">
            {/* Wings */}
            <path d="M5 25 Q20 5 40 20 Q60 5 75 25" stroke="#d4a574" strokeWidth="3" fill="none"/>
            <path d="M10 28 Q25 12 40 22 Q55 12 70 28" stroke="#c9956c" strokeWidth="2" fill="none"/>
            {/* Lion head */}
            <circle cx="40" cy="28" r="10" fill="#d4a574"/>
            <circle cx="36" cy="26" r="2" fill="#333"/>
            <circle cx="44" cy="26" r="2" fill="#333"/>
            <path d="M38 32 Q40 34 42 32" stroke="#333" strokeWidth="1" fill="none"/>
          </svg>
        </div>

        {/* Caduceus */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2">
          <svg width="30" height="60" viewBox="0 0 30 60" fill="none">
            <line x1="15" y1="0" x2="15" y2="60" stroke="#2d5a4a" strokeWidth="2"/>
            <path d="M5 15 Q15 25 25 15 Q15 35 5 25 Q15 45 25 35 Q15 55 5 45" stroke="#2d5a4a" strokeWidth="2" fill="none"/>
          </svg>
        </div>

        {/* Sun glow */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-16 h-16 bg-yellow-300 rounded-full blur-md opacity-60" />

        {/* Two figures */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          {/* Woman figure */}
          <div className="w-16 h-24">
            <svg viewBox="0 0 64 96" fill="none" className="w-full h-full">
              {/* Hair */}
              <ellipse cx="32" cy="16" rx="12" ry="14" fill="#8b4513"/>
              {/* Face */}
              <circle cx="32" cy="18" r="8" fill="#f5deb3"/>
              {/* Dress */}
              <path d="M20 35 L32 30 L44 35 L48 90 L16 90 Z" fill="#ffd700"/>
              <path d="M24 35 L32 32 L40 35 L42 60 L22 60 Z" fill="#ffec8b"/>
            </svg>
          </div>
          
          {/* Cup in center */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <svg width="24" height="20" viewBox="0 0 24 20" fill="none">
              <path d="M4 0 L20 0 L18 16 L6 16 Z" fill="#ffd700" stroke="#daa520" strokeWidth="1"/>
              <ellipse cx="12" cy="2" rx="8" ry="2" fill="#ffec8b"/>
            </svg>
          </div>

          {/* Man figure */}
          <div className="w-16 h-24">
            <svg viewBox="0 0 64 96" fill="none" className="w-full h-full">
              {/* Hair */}
              <ellipse cx="32" cy="14" rx="10" ry="12" fill="#4a3728"/>
              {/* Face */}
              <circle cx="32" cy="16" r="8" fill="#f5deb3"/>
              {/* Outfit */}
              <path d="M20 32 L32 28 L44 32 L48 90 L16 90 Z" fill="#1e40af"/>
              <path d="M16 32 L20 32 L22 60 L14 60 Z" fill="#dc2626"/>
            </svg>
          </div>
        </div>

        {/* Ground */}
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-emerald-600 to-emerald-500" />
      </div>
    </div>
  );
}

// Icon Components
function DailyTarotIcon() {
  return (
    <div className="w-10 h-14 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 border border-indigo-400/50 p-1.5 shadow-lg">
      <div className="w-full h-full border border-indigo-300/40 rounded flex items-center justify-center">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L14.5 9H22L16 14L18.5 21L12 16L5.5 21L8 14L2 9H9.5L12 2Z" 
                fill="currentColor" className="text-indigo-300"/>
        </svg>
      </div>
    </div>
  );
}

function NearFutureIcon() {
  return (
    <div className="relative w-12 h-12">
      {/* Crystal ball */}
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 border border-indigo-300/50 flex items-center justify-center">
        <div className="w-6 h-6 rounded-full bg-indigo-300/30" />
      </div>
      {/* Sparkles */}
      <div className="absolute -top-1 -right-1 w-3 h-3">
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
          <path d="M12 2L13 8L19 9L13 10L12 16L11 10L5 9L11 8L12 2Z" fill="#a5b4fc"/>
        </svg>
      </div>
    </div>
  );
}

function LoveIcon() {
  return (
    <div className="w-10 h-10">
      <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
        {/* Skull shape */}
        <ellipse cx="20" cy="18" rx="14" ry="12" fill="#a78bfa"/>
        <ellipse cx="20" cy="24" rx="8" ry="6" fill="#a78bfa"/>
        {/* Eyes */}
        <ellipse cx="14" cy="16" rx="4" ry="5" fill="#1e1b4b"/>
        <ellipse cx="26" cy="16" rx="4" ry="5" fill="#1e1b4b"/>
        {/* Heart eyes */}
        <path d="M12 15 Q14 13 14 15 Q14 17 12 18 Q10 17 10 15 Q10 13 12 15Z" fill="#f472b6"/>
        <path d="M24 15 Q26 13 26 15 Q26 17 24 18 Q22 17 22 15 Q22 13 24 15Z" fill="#f472b6"/>
        {/* Nose */}
        <circle cx="20" cy="22" r="1.5" fill="#1e1b4b"/>
        {/* Teeth */}
        <rect x="15" y="28" width="3" height="4" fill="#e0e7ff" rx="0.5"/>
        <rect x="19" y="28" width="3" height="4" fill="#e0e7ff" rx="0.5"/>
        <rect x="23" y="28" width="3" height="4" fill="#e0e7ff" rx="0.5"/>
      </svg>
    </div>
  );
}

function YesNoIcon() {
  return (
    <div className="w-10 h-12">
      <svg viewBox="0 0 40 48" fill="none" className="w-full h-full">
        {/* Palm */}
        <path d="M20 48 L20 20" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round"/>
        {/* Fingers */}
        <path d="M12 20 L12 8" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round"/>
        <path d="M20 20 L20 4" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round"/>
        <path d="M28 20 L28 8" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round"/>
        <path d="M6 24 L6 16" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round"/>
        <path d="M34 24 L34 16" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round"/>
        {/* Palm base */}
        <ellipse cx="20" cy="32" rx="16" ry="12" stroke="#a78bfa" strokeWidth="2" fill="none"/>
      </svg>
    </div>
  );
}

function CardMeaningsIcon() {
  return (
    <div className="flex items-center gap-1">
      {/* Two cards */}
      <div className="w-8 h-11 rounded bg-gradient-to-br from-indigo-500 to-indigo-700 border border-indigo-400/50 p-1">
        <div className="w-full h-full border border-indigo-300/30 rounded flex items-center justify-center">
          <div className="w-3 h-3 rounded-full border border-indigo-300/50" />
        </div>
      </div>
      <div className="w-8 h-11 rounded bg-gradient-to-br from-indigo-500 to-indigo-700 border border-indigo-400/50 p-1 -ml-4 rotate-6">
        <div className="w-full h-full border border-indigo-300/30 rounded flex items-center justify-center">
          <div className="w-3 h-3 rounded-full border border-indigo-300/50" />
        </div>
      </div>
    </div>
  );
}
