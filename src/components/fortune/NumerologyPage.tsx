import { useState } from 'react';
import type { UserProfile } from '@/types';
import { ChevronLeft, Calendar } from 'lucide-react';

interface NumerologyPageProps {
  profile: UserProfile;
  onBack: () => void;
}

export function NumerologyPage({ profile, onBack }: NumerologyPageProps) {
  const [fullName, setFullName] = useState(profile.name || '');
  const [birthDate, setBirthDate] = useState('');

  const handleReveal = () => {
    if (fullName && birthDate) {
      // TODO: Navigate to results page
      console.log('Revealing numbers for:', fullName, birthDate);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  // Numbers to display on the arc
  const arcNumbers = [
    { value: '7', x: 15, y: 55, opacity: 0.4 },
    { value: '17', x: 22, y: 38, opacity: 0.8 },
    { value: '13', x: 35, y: 58, opacity: 0.5 },
    { value: '22', x: 48, y: 18, opacity: 0.6 },
    { value: '14', x: 52, y: 45, opacity: 0.7 },
    { value: '8', x: 75, y: 20, opacity: 0.5 },
    { value: '11', x: 78, y: 48, opacity: 0.4 },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0a0a12] text-white overflow-hidden">
      {/* Header */}
      <header className="p-4 pt-6 flex items-center gap-3 relative z-10">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-light tracking-[0.15em] uppercase text-pink-500">Numerology</h1>
      </header>

      {/* Arc Visualization */}
      <div className="relative h-56 overflow-hidden">
        {/* Radial gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-pink-900/20 to-transparent" />
        
        {/* Arc lines */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 70" preserveAspectRatio="xMidYMax slice">
          {/* Outer arc */}
          <path
            d="M -10 70 Q 50 -20 110 70"
            fill="none"
            stroke="rgba(236, 72, 153, 0.2)"
            strokeWidth="0.3"
          />
          {/* Middle arc */}
          <path
            d="M 0 70 Q 50 0 100 70"
            fill="none"
            stroke="rgba(236, 72, 153, 0.15)"
            strokeWidth="0.2"
          />
          {/* Inner arc */}
          <path
            d="M 10 70 Q 50 15 90 70"
            fill="none"
            stroke="rgba(236, 72, 153, 0.1)"
            strokeWidth="0.2"
          />
          
          {/* Vertical lines */}
          {[20, 35, 50, 65, 80].map((x, i) => (
            <line
              key={i}
              x1={x}
              y1="70"
              x2={x + (x < 50 ? -5 : x > 50 ? 5 : 0)}
              y2="10"
              stroke="rgba(236, 72, 153, 0.1)"
              strokeWidth="0.2"
            />
          ))}
        </svg>

        {/* Numbers on the arc */}
        {arcNumbers.map((num, i) => (
          <span
            key={i}
            className="absolute text-pink-500 font-light"
            style={{
              left: `${num.x}%`,
              top: `${num.y}%`,
              opacity: num.opacity,
              fontSize: num.value.length > 1 ? '1.25rem' : '1rem',
            }}
          >
            {num.value}
          </span>
        ))}

        {/* Center glow/star */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-2 h-2 bg-pink-500 rounded-full shadow-[0_0_20px_8px_rgba(236,72,153,0.6)]" />
          {/* Cross sparkle */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-[1px] bg-gradient-to-r from-transparent via-pink-400 to-transparent" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-8 bg-gradient-to-b from-transparent via-pink-400 to-transparent" />
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 px-4 mt-8 space-y-4">
        {/* Name Input */}
        <div className="relative">
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full px-5 py-4 rounded-2xl bg-transparent border border-pink-500/30 text-white placeholder-pink-500/50 focus:outline-none focus:border-pink-500/60 transition-colors"
          />
        </div>

        {/* Date Input */}
        <div className="relative">
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl bg-transparent border border-pink-500/30 text-transparent focus:outline-none focus:border-pink-500/60 transition-colors [color-scheme:dark]"
            style={{ colorScheme: 'dark' }}
          />
          <div className="absolute inset-0 flex items-center justify-between px-5 pointer-events-none">
            <span className={birthDate ? 'text-white' : 'text-pink-500/50'}>
              {birthDate ? formatDate(birthDate) : 'Select your date of birth'}
            </span>
            <Calendar className="w-5 h-5 text-pink-500" />
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-4 pb-24">
        {/* Dots and Button */}
        <div className="flex items-center gap-3">
          {/* Left dots */}
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-pink-500/40" />
            <div className="w-2 h-2 rounded-full bg-pink-500/60" />
          </div>

          {/* Reveal Button */}
          <button
            onClick={handleReveal}
            disabled={!fullName || !birthDate}
            className="flex-1 py-4 rounded-full bg-gradient-to-r from-pink-600 to-pink-500 text-white font-medium tracking-[0.15em] uppercase transition-all hover:from-pink-500 hover:to-pink-400 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(236,72,153,0.3)]"
          >
            Reveal My Numbers
          </button>

          {/* Right dots */}
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-pink-500/60" />
            <div className="w-2 h-2 rounded-full bg-pink-500/40" />
          </div>
        </div>
      </div>
    </div>
  );
}
