import { useState, useEffect } from 'react';
import type { UserProfile, ZodiacSign } from '@/types';
import { generateCoupleCompatibility } from '@/data/horoscopeContent';
import { TarotCardComponent } from '../tarot/TarotCard';
import { useTarot } from '@/hooks/useTarot';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Heart, Sparkles, MessageCircle, Star, AlertTriangle, ChevronRight } from 'lucide-react';
import { ChatInterface } from '../common/ChatInterface';

interface CouplePageProps {
  profile: UserProfile;
}

const zodiacSymbols: Record<ZodiacSign, string> = {
  aries: '♈', taurus: '♉', gemini: '♊', cancer: '♋',
  leo: '♌', virgo: '♍', libra: '♎', scorpio: '♏',
  sagittarius: '♐', capricorn: '♑', aquarius: '♒', pisces: '♓'
};

export function CouplePage({ profile }: CouplePageProps) {
  const [compatibility, setCompatibility] = useState<ReturnType<typeof generateCoupleCompatibility> | null>(null);
  const [showChat, setShowChat] = useState(false);
  const { getRelationshipReading } = useTarot();
  const [tarotReading, setTarotReading] = useState<ReturnType<typeof getRelationshipReading> | null>(null);

  useEffect(() => {
    if (profile.sign && profile.partnerSign) {
      const compat = generateCoupleCompatibility(profile.sign, profile.partnerSign);
      setCompatibility(compat);

      const reading = getRelationshipReading(profile.sign, profile.partnerSign);
      setTarotReading(reading);
    }
  }, [profile.sign, profile.partnerSign, getRelationshipReading]);

  const hasPartner = !!profile.partnerSign;

  if (!hasPartner) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-8 bg-background">
        <div className="w-32 h-32 rounded-full bg-violet-900/20 flex items-center justify-center shadow-2xl border border-white/5 relative">
          <div className="absolute inset-0 bg-violet-500/10 rounded-full blur-xl" />
          <Heart className="w-16 h-16 text-violet-400 relative z-10" />
        </div>
        <div className="space-y-4 max-w-xs">
          <h3 className="text-3xl font-black uppercase tracking-widest italic">Solitary Star</h3>
          <p className="text-muted-foreground text-sm font-medium leading-relaxed">
            Connect your stars with another. Add your partner's birthday in settings to explore your cosmic compatibility.
          </p>
        </div>
        <Button variant="outline" className="rounded-full px-8 py-6 border-white/10 bg-white/5 hover:bg-white/10 uppercase tracking-widest text-xs font-bold gap-2">
          <Star className="w-4 h-4" />
          Open Profile
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background text-foreground overflow-hidden">
      {/* Header */}
      <header className="p-4 border-b border-white/5 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold tracking-widest uppercase italic">Compatibility</h1>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
            {profile.sign} <span className="text-violet-500 mx-1">&</span> {profile.partnerSign}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowChat(!showChat)}
          className="rounded-full border-white/10 bg-white/5 hover:bg-white/10 gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="text-[10px] uppercase font-bold tracking-widest">Ask AI</span>
        </Button>
      </header>

      {/* Chat overlay */}
      {showChat && (
        <div className="absolute inset-x-0 bottom-0 z-50 bg-background/95 backdrop-blur-3xl border-t border-white/10 shadow-2xl h-[70%]">
          <ChatInterface
            profile={profile}
            context="couple"
            onClose={() => setShowChat(false)}
          />
        </div>
      )}

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-8 pb-20 max-w-md mx-auto">
          {/* Compatibility score visual */}
          <section className="relative py-12 flex flex-col items-center">
            <div className="absolute inset-0 bg-violet-600/10 rounded-full blur-[100px]" />

            <div className="flex items-center justify-center gap-6 relative">
              <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-24 rounded-full glass-card flex items-center justify-center text-5xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                  {zodiacSymbols[profile.sign]}
                </div>
                <span className="text-[10px] uppercase tracking-widest font-black text-white/40">{profile.sign}</span>
              </div>

              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-violet-500/20 flex flex-col items-center justify-center bg-black/40 shadow-inner relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-pink-500/10" />
                  <span className="text-4xl font-black text-white tracking-tighter relative z-10 leading-none">
                    {compatibility?.score}%
                  </span>
                  <span className="text-[8px] uppercase tracking-[0.2em] font-black text-violet-400 relative z-10 mt-1">Match</span>
                </div>
                <div className="absolute -top-2 -left-2 text-rose-500/50 animate-pulse">
                  <Heart className="w-6 h-6 fill-current" />
                </div>
              </div>

              <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-24 rounded-full glass-card flex items-center justify-center text-5xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                  {zodiacSymbols[profile.partnerSign!]}
                </div>
                <span className="text-[10px] uppercase tracking-widest font-black text-white/40">{profile.partnerSign}</span>
              </div>
            </div>
          </section>

          {/* Daily Insight */}
          <section className="glass-card p-6 rounded-[2rem] space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles className="w-12 h-12" />
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-violet-400">Daily Cosmic Insight</h3>
            <p className="text-lg font-bold leading-snug tracking-tight">
              "{compatibility?.dailyMessage}"
            </p>
          </section>

          {/* Analysis Tabs (Strengths/Weaknesses) */}
          <section className="grid grid-cols-2 gap-4">
            <div className="glass-card p-4 rounded-3xl space-y-3">
              <div className="flex items-center gap-2 text-green-400">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-[10px] font-black uppercase tracking-widest">Strengths</span>
              </div>
              <div className="space-y-2">
                {compatibility?.strengths.slice(0, 2).map((s, i) => (
                  <div key={i} className="text-[11px] leading-tight text-muted-foreground font-medium flex gap-2">
                    <span className="text-green-500">•</span> {s}
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-card p-4 rounded-3xl space-y-3">
              <div className="flex items-center gap-2 text-amber-400">
                <AlertTriangle className="w-4 h-4 fill-current" />
                <span className="text-[10px] font-black uppercase tracking-widest">Challenges</span>
              </div>
              <div className="space-y-2">
                {compatibility?.weaknesses.slice(0, 2).map((s, i) => (
                  <div key={i} className="text-[11px] leading-tight text-muted-foreground font-medium flex gap-2">
                    <span className="text-amber-500">•</span> {s}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Relationship Tarot Reading */}
          {tarotReading && (
            <section className="space-y-4">
              <div className="flex justify-between items-center px-2">
                <h3 className="text-sm font-bold uppercase tracking-widest italic">Sacred Bond Reading</h3>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex justify-center gap-4 py-4 overflow-x-auto scrollbar-hide">
                {tarotReading.cards.map((cardData, index) => (
                  <div key={index} className="flex flex-col items-center gap-3 min-w-[100px]">
                    <div className="scale-75 origin-center">
                      <TarotCardComponent
                        card={cardData.card}
                        reversed={cardData.reversed}
                        revealed={true}
                        size="sm"
                      />
                    </div>
                    <div className="text-center space-y-1">
                      <div className="text-[8px] font-black uppercase tracking-widest text-violet-400">{cardData.position}</div>
                      <div className="text-[10px] font-bold text-white max-w-[80px] truncate">{cardData.card.name}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="glass-card p-6 rounded-[2rem] bg-violet-950/20">
                <p className="text-xs text-muted-foreground leading-relaxed font-medium italic">
                  {tarotReading.interpretation}
                </p>
              </div>
            </section>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
