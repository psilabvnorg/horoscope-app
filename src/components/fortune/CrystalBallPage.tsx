import { useState } from 'react';
import type { UserProfile } from '@/types';
import { ChevronLeft, MessageCircle, Mic } from 'lucide-react';
import { ChatInterface } from '../common/ChatInterface';
import type { PromptContext } from '@/lib/llm';

interface CrystalBallPageProps {
  profile: UserProfile;
  onBack: () => void;
}

const CHAT_CONTEXT: PromptContext = 'crystal-ball';

const promptTags = [
  'Illuminate My Path',
  'Reveal My Destiny',
  'Reveal My Fortune',
  'Call Upon the Spirits',
  'Summon the Stars',
  'Summon My Future',
  'Channel the Cosmos',
];

export function CrystalBallPage({ profile, onBack }: CrystalBallPageProps) {
  const [showChat, setShowChat] = useState(false);
  const [initialMessage, setInitialMessage] = useState<string | undefined>();

  const handleTagClick = (tag: string) => {
    setInitialMessage(tag);
    setShowChat(true);
  };

  const handleStartChat = () => {
    setInitialMessage(undefined);
    setShowChat(true);
  };

  const handleSpeak = () => {
    // Voice input functionality - for now just start chat
    setInitialMessage(undefined);
    setShowChat(true);
  };

  if (showChat) {
    return (
      <div className="flex flex-col h-full bg-[#0a0a12]">
        <ChatInterface
          profile={profile}
          context={CHAT_CONTEXT}
          onClose={() => setShowChat(false)}
          initialMessage={initialMessage}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#0a0a12] text-white overflow-hidden">
      {/* Header */}
      <header className="p-4 pt-6 flex items-center gap-3">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-light tracking-[0.15em] uppercase">Crystal Ball</h1>
      </header>

      {/* Scrolling Tags - Row 1 */}
      <div className="mt-4 overflow-hidden">
        <div className="flex gap-3 animate-scroll-left">
          {[...promptTags.slice(0, 5), ...promptTags.slice(0, 5)].map((tag, index) => (
            <button
              key={index}
              onClick={() => handleTagClick(tag)}
              className="flex-shrink-0 px-4 py-2 rounded-full border border-yellow-600/40 text-yellow-500/80 text-sm whitespace-nowrap hover:bg-yellow-600/10 transition-all"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Scrolling Tags - Row 2 */}
      <div className="mt-3 overflow-hidden">
        <div className="flex gap-3 animate-scroll-right">
          {[...promptTags.slice(3, 8), ...promptTags.slice(3, 8)].map((tag, index) => (
            <button
              key={index}
              onClick={() => handleTagClick(tag)}
              className="flex-shrink-0 px-4 py-2 rounded-full border border-yellow-600/40 text-yellow-500/80 text-sm whitespace-nowrap hover:bg-yellow-600/10 transition-all"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Scrolling Tags - Row 3 */}
      <div className="mt-3 overflow-hidden">
        <div className="flex gap-3 animate-scroll-left-slow">
          {[...promptTags.slice(5), ...promptTags.slice(0, 3), ...promptTags.slice(5)].map((tag, index) => (
            <button
              key={index}
              onClick={() => handleTagClick(tag)}
              className="flex-shrink-0 px-4 py-2 rounded-full border border-yellow-600/40 text-yellow-500/80 text-sm whitespace-nowrap hover:bg-yellow-600/10 transition-all"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Crystal Ball */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-yellow-500/20 blur-[80px] rounded-full scale-150" />
          
          {/* Crystal Ball Image */}
          <div className="relative w-56 h-56">
            <img 
              src="/figma/asset/Ball gif 1.png" 
              alt="Crystal Ball"
              className="w-full h-full object-contain drop-shadow-[0_0_40px_rgba(234,179,8,0.4)]"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                if (target.parentElement) {
                  target.parentElement.innerHTML = `
                    <div class="w-56 h-56 relative flex items-center justify-center">
                      <div class="absolute inset-4 rounded-full bg-gradient-to-br from-yellow-400/30 to-yellow-600/30 blur-xl"></div>
                      <div class="w-44 h-44 rounded-full bg-gradient-to-br from-yellow-900/40 to-yellow-950/60 border-4 border-yellow-500/50 flex items-center justify-center relative overflow-hidden">
                        <div class="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-transparent to-yellow-600/20"></div>
                        <div class="absolute top-4 left-6 w-8 h-4 bg-yellow-400/30 rounded-full blur-sm rotate-[-30deg]"></div>
                      </div>
                      <div class="absolute bottom-0 w-20 h-6 bg-gradient-to-t from-yellow-600 to-yellow-500 rounded-t-lg"></div>
                    </div>
                  `;
                }
              }}
            />
          </div>
        </div>

        {/* Text */}
        <h2 className="mt-8 text-xl font-semibold text-yellow-500 tracking-wide">SEEKING WISDOM?</h2>
        <p className="mt-2 text-white/50 text-sm">Tap to ask or speak directly</p>
      </div>

      {/* Bottom Buttons */}
      <div className="p-4 pb-24 flex gap-4">
        <button
          onClick={handleStartChat}
          className="flex-1 py-4 rounded-full border border-yellow-600/50 bg-yellow-900/20 flex items-center justify-center gap-2 hover:bg-yellow-900/30 transition-all active:scale-[0.98]"
        >
          <MessageCircle className="w-5 h-5 text-yellow-500" />
          <span className="text-yellow-500 font-medium tracking-wider text-sm">START A CHAT</span>
        </button>
        
        <button
          onClick={handleSpeak}
          className="flex-1 py-4 rounded-full border border-yellow-600/50 bg-yellow-900/20 flex items-center justify-center gap-2 hover:bg-yellow-900/30 transition-all active:scale-[0.98]"
        >
          <Mic className="w-5 h-5 text-yellow-500" />
          <span className="text-yellow-500 font-medium tracking-wider text-sm">SPEAK</span>
        </button>
      </div>

      {/* CSS for scrolling animation */}
      <style>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scroll-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-scroll-left {
          animation: scroll-left 20s linear infinite;
        }
        .animate-scroll-right {
          animation: scroll-right 25s linear infinite;
        }
        .animate-scroll-left-slow {
          animation: scroll-left 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
