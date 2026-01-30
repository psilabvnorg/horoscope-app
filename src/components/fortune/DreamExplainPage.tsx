import { useState, useRef } from 'react';
import type { UserProfile } from '@/types';
import { ChevronLeft, X } from 'lucide-react';
import { generateResponse, buildSystemPrompt } from '@/lib/llm';

interface DreamExplainPageProps {
  profile: UserProfile;
  onBack: () => void;
}

export function DreamExplainPage({ profile, onBack }: DreamExplainPageProps) {
  const [dreamText, setDreamText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dreamResult, setDreamResult] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleRevealDream = async () => {
    if (!dreamText.trim()) return;
    
    setIsAnalyzing(true);
    abortControllerRef.current = new AbortController();

    try {
      const systemPrompt = buildSystemPrompt('dream', profile, 
        'Provide a mystical dream interpretation in 3-4 paragraphs. Be insightful and warm.');

      const response = await generateResponse(
        systemPrompt,
        `Please interpret this dream:\n"${dreamText}"`,
        abortControllerRef.current.signal
      );

      let result = response.content;
      
      if (!result || response.error) {
        result = "Your dream carries deep symbolism from the subconscious realm. The images you've described suggest a period of transformation and self-discovery. Trust in the messages your inner self is sending you through these nocturnal visions.";
      }

      setDreamResult(result);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      console.error('Dream analysis error:', err);
      setDreamResult("The mystical connection was interrupted. Your dream holds powerful symbolism - the images suggest transformation and inner growth. Trust your intuition as you navigate the messages from your subconscious mind.");
    } finally {
      setIsAnalyzing(false);
      abortControllerRef.current = null;
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsAnalyzing(false);
  };

  // Analyzing Screen
  if (isAnalyzing) {
    return (
      <div className="flex flex-col min-h-screen h-full bg-[#0a0a20] text-white relative overflow-hidden">
        {/* Stop Button - Top Left */}
        <button 
          onClick={handleStop}
          className="absolute top-6 left-4 z-20 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Background - Night sky with stars */}
        <div className="absolute inset-0">
          {/* Stars */}
          <div className="absolute inset-0">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                style={{
                  left: `${(i * 17) % 100}%`,
                  top: `${(i * 23) % 60}%`,
                  opacity: 0.3 + (i % 5) * 0.15,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
          
          {/* Mountains silhouette */}
          <div className="absolute top-[15%] left-0 right-0 h-32">
            <svg viewBox="0 0 400 100" className="w-full h-full" preserveAspectRatio="none">
              <path
                d="M0,100 L50,60 L100,80 L150,40 L200,70 L250,30 L300,60 L350,50 L400,80 L400,100 Z"
                fill="rgba(30, 40, 80, 0.5)"
              />
            </svg>
          </div>

          {/* Clouds at top */}
          <div className="absolute top-[20%] left-0 right-0 opacity-30">
            <div className="flex justify-around">
              <div className="w-32 h-8 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent rounded-full blur-sm" />
              <div className="w-24 h-6 bg-gradient-to-r from-transparent via-blue-300/20 to-transparent rounded-full blur-sm" />
            </div>
          </div>
        </div>

        {/* Grid floor */}
        <div className="absolute top-[35%] left-0 right-0 bottom-[30%] overflow-hidden" style={{ perspective: '500px' }}>
          <div 
            className="absolute inset-0"
            style={{ 
              transform: 'rotateX(60deg)',
              transformOrigin: 'center top',
            }}
          >
            {/* Grid lines */}
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Horizontal lines */}
              {[...Array(15)].map((_, i) => (
                <line
                  key={`h${i}`}
                  x1="0"
                  y1={i * 7}
                  x2="100"
                  y2={i * 7}
                  stroke="rgba(100, 150, 255, 0.3)"
                  strokeWidth="0.3"
                />
              ))}
              {/* Vertical lines */}
              {[...Array(20)].map((_, i) => (
                <line
                  key={`v${i}`}
                  x1={i * 5}
                  y1="0"
                  x2={i * 5}
                  y2="100"
                  stroke="rgba(100, 150, 255, 0.3)"
                  strokeWidth="0.3"
                />
              ))}
            </svg>
          </div>
        </div>

        {/* Floating person silhouette with glow */}
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-cyan-400/30 blur-3xl rounded-full scale-150" />
          
          {/* Person silhouette - lying down */}
          <svg viewBox="0 0 200 60" className="w-64 h-20 relative z-10">
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            {/* Body */}
            <ellipse cx="100" cy="30" rx="70" ry="15" fill="white" filter="url(#glow)" />
            {/* Head */}
            <circle cx="170" cy="28" r="12" fill="white" filter="url(#glow)" />
            {/* Legs */}
            <ellipse cx="35" cy="32" rx="20" ry="8" fill="white" filter="url(#glow)" />
          </svg>
        </div>

        {/* Shadow/reflection person */}
        <div className="absolute top-[32%] left-1/2 -translate-x-1/2 opacity-30">
          <svg viewBox="0 0 200 60" className="w-48 h-16">
            <ellipse cx="100" cy="30" rx="60" ry="12" fill="rgba(80, 120, 180, 0.5)" />
            <circle cx="160" cy="28" r="10" fill="rgba(80, 120, 180, 0.5)" />
          </svg>
        </div>

        {/* Analyzing text */}
        <div className="absolute top-[60%] left-0 right-0 text-center">
          <h2 className="text-2xl font-light tracking-wide text-white/90">Analysing your dream</h2>
          
          {/* Loading dots */}
          <div className="flex justify-center gap-2 mt-4">
            <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>

        {/* Clouds at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-48">
          <div className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t from-[#1a1a3e]/80 to-transparent" />
          <div className="absolute bottom-10 left-[10%] w-40 h-20 bg-gradient-to-t from-gray-300/20 to-transparent rounded-full blur-xl" />
          <div className="absolute bottom-5 right-[15%] w-48 h-24 bg-gradient-to-t from-gray-400/25 to-transparent rounded-full blur-xl" />
          <div className="absolute bottom-0 left-[30%] w-32 h-16 bg-gradient-to-t from-gray-300/15 to-transparent rounded-full blur-lg" />
        </div>
      </div>
    );
  }

  // Result Screen
  if (dreamResult) {
    return (
      <div className="flex flex-col min-h-screen h-full bg-[#0a0a12] text-white overflow-y-auto">
        {/* Header */}
        <header className="p-4 pt-6 flex items-center gap-3">
          <button 
            onClick={() => {
              setDreamResult(null);
              setDreamText('');
            }}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-light tracking-[0.15em] uppercase">Dream Interpretation</h1>
        </header>

        {/* Result Content */}
        <div className="flex-1 px-4 pb-24">
          <div className="bg-[#1c1c2e]/80 backdrop-blur-sm rounded-3xl p-6 mt-4">
            <h2 className="text-purple-400 text-lg font-medium mb-4">Your Dream</h2>
            <p className="text-white/60 text-sm italic mb-6">"{dreamText}"</p>
            
            <h2 className="text-purple-400 text-lg font-medium mb-4">Luna's Interpretation</h2>
            <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">{dreamResult}</p>
          </div>

          {/* New Dream Button */}
          <button
            onClick={() => {
              setDreamResult(null);
              setDreamText('');
            }}
            className="w-full mt-6 py-4 rounded-full border border-purple-500/30 text-purple-400 font-medium tracking-wider uppercase hover:bg-purple-500/10 transition-all"
          >
            Interpret Another Dream
          </button>
        </div>
      </div>
    );
  }

  // Input Screen
  return (
    <div className="flex flex-col min-h-screen h-full bg-black text-white overflow-hidden relative">
      {/* Header - positioned absolute */}
      <header className="absolute top-0 left-0 right-0 p-4 pt-6 flex items-center gap-3 z-20">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-light tracking-[0.15em] uppercase">Dream Explain</h1>
      </header>

      {/* Full screen galaxy triangle image */}
      <div className="flex-1 relative min-h-[400px]">
        <img 
          src="/figma/asset/Frame 107.png" 
          alt="Galaxy Triangle"
          className="absolute inset-0 w-full h-full object-cover object-top"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
        
        {/* Fallback - inverted triangle with galaxy - always visible */}
        <div className="absolute inset-0 flex flex-col items-center justify-start pt-20">
          <svg viewBox="0 0 200 280" className="w-full max-w-sm h-auto" style={{ minHeight: '300px' }}>
            <defs>
              <linearGradient id="galaxyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1a1a3e" />
                <stop offset="20%" stopColor="#2d2b5e" />
                <stop offset="40%" stopColor="#4a3728" />
                <stop offset="60%" stopColor="#c9a456" />
                <stop offset="80%" stopColor="#3d2d5a" />
                <stop offset="100%" stopColor="#0a0a12" />
              </linearGradient>
              <clipPath id="triClip">
                <polygon points="100,0 200,0 100,260 0,0" />
              </clipPath>
            </defs>
            {/* Triangle pointing down */}
            <polygon 
              points="0,0 200,0 100,260" 
              fill="url(#galaxyGrad)"
            />
            {/* Static stars inside triangle */}
            <g clipPath="url(#triClip)">
              <circle cx="50" cy="30" r="0.8" fill="rgba(150, 200, 255, 0.8)" />
              <circle cx="150" cy="25" r="0.6" fill="rgba(180, 220, 255, 0.7)" />
              <circle cx="80" cy="50" r="1" fill="rgba(100, 180, 255, 0.9)" />
              <circle cx="120" cy="45" r="0.7" fill="rgba(200, 230, 255, 0.6)" />
              <circle cx="60" cy="80" r="0.9" fill="rgba(150, 200, 255, 0.8)" />
              <circle cx="140" cy="75" r="0.5" fill="rgba(180, 220, 255, 0.7)" />
              <circle cx="100" cy="60" r="1.1" fill="rgba(120, 190, 255, 0.9)" />
              <circle cx="70" cy="110" r="0.8" fill="rgba(160, 210, 255, 0.7)" />
              <circle cx="130" cy="100" r="0.6" fill="rgba(140, 200, 255, 0.8)" />
              <circle cx="90" cy="140" r="0.7" fill="rgba(170, 215, 255, 0.6)" />
              <circle cx="110" cy="130" r="0.9" fill="rgba(130, 195, 255, 0.8)" />
              <circle cx="85" cy="170" r="0.5" fill="rgba(155, 205, 255, 0.7)" />
              <circle cx="115" cy="160" r="0.8" fill="rgba(145, 200, 255, 0.6)" />
              <circle cx="100" cy="190" r="0.6" fill="rgba(165, 210, 255, 0.5)" />
              {/* Center golden glow */}
              <ellipse cx="100" cy="120" rx="30" ry="20" fill="rgba(255, 200, 100, 0.25)" />
              <ellipse cx="100" cy="120" rx="15" ry="10" fill="rgba(255, 220, 150, 0.4)" />
              <ellipse cx="100" cy="120" rx="5" ry="3" fill="rgba(255, 240, 200, 0.6)" />
            </g>
          </svg>
        </div>

        {/* Dark gradient at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black via-black/90 to-transparent" />
      </div>

      {/* Bottom Section - Input and Button */}
      <div className="relative z-10 px-4 pb-24 bg-black">
        {/* Dream Input Card - dark translucent */}
        <div className="bg-[#1c1c2e]/90 backdrop-blur-sm rounded-3xl p-5 mb-4">
          <textarea
            value={dreamText}
            onChange={(e) => setDreamText(e.target.value)}
            placeholder="I was a massive dinosaur with rat nose and ant like lips that was commenting on social media..."
            className="w-full bg-transparent text-white/80 placeholder-white/50 resize-none focus:outline-none text-[15px] leading-relaxed min-h-[100px] font-light"
            rows={4}
          />
        </div>

        {/* Reveal Button and Circle */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleRevealDream}
            disabled={!dreamText.trim()}
            className="flex-1 py-4 rounded-full bg-gradient-to-r from-[#a8a4d4] to-[#c4c0e8] text-[#1a1a2e] font-semibold tracking-[0.12em] uppercase transition-all hover:from-[#b8b4e4] hover:to-[#d4d0f8] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Reveal Dream
          </button>
          
          {/* Circle indicator - double ring */}
          <div className="w-14 h-14 rounded-full border-2 border-white/30 flex items-center justify-center flex-shrink-0">
            <div className="w-10 h-10 rounded-full border-2 border-white/20" />
          </div>
        </div>
      </div>
    </div>
  );
}
