import { useState, useEffect, useCallback, useMemo } from 'react';
import type { UserProfile, TarotReading } from '@/types';
import { useTarot } from '@/hooks/useTarot';
import { getEnhancedMeaning } from '@/hooks/useTarotMeanings';
import { buildTarotContext } from '@/lib/llm';
import { TarotCardComponent } from './TarotCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, History, MessageCircle, ChevronRight } from 'lucide-react';
import { ChatInterface } from '../common/ChatInterface';

interface TarotPageProps {
  profile: UserProfile;
  readingType?: string;
  selectedCardIds?: number[];
}

export function TarotPage({ profile, readingType, selectedCardIds }: TarotPageProps) {
  const {
    dailyReading,
    history,
    getDailyCard,
    getThreeCardSpread,
    getPastPresentFuture,
    getRelationshipReading,
    getCardById,
  } = useTarot();

  const [activeTab, setActiveTab] = useState('daily');
  const [currentReading, setCurrentReading] = useState<TarotReading | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [_expandedCard, _setExpandedCard] = useState<number | null>(null);

  useEffect(() => {
    if (selectedCardIds && readingType && readingType !== 'meanings') {
      const cards = selectedCardIds.map(id => ({
        card: getCardById(id)!,
        position: readingType === 'near-future' ? 'The Path' : 'Position',
        reversed: Math.random() > 0.7
      }));

      const reading: TarotReading = {
        id: `custom-${Date.now()}`,
        type: readingType as any,
        cards,
        interpretation: 'Your custom reading is being channeled...',
        date: new Date().toISOString()
      };
      setCurrentReading(reading);
      setActiveTab(readingType === 'near-future' ? 'three' : 'daily');
    } else if (readingType === 'meanings') {
      setActiveTab('library');
    } else if (readingType === 'daily') {
      const reading = getDailyCard(profile.sign);
      setCurrentReading(reading);
      setActiveTab('daily');
    } else if (!dailyReading) {
      const reading = getDailyCard(profile.sign);
      setCurrentReading(reading);
    } else {
      setCurrentReading(dailyReading);
    }
  }, [dailyReading, getDailyCard, profile.sign, readingType, selectedCardIds, getCardById]);

  const handleThreeCard = useCallback(() => {
    const reading = getThreeCardSpread(profile.sign);
    setCurrentReading(reading);
  }, [getThreeCardSpread, profile.sign]);

  const handlePastPresentFuture = useCallback(() => {
    const reading = getPastPresentFuture(profile.sign);
    setCurrentReading(reading);
  }, [getPastPresentFuture, profile.sign]);

  const handleRelationship = useCallback(() => {
    if (profile.partnerSign) {
      const reading = getRelationshipReading(profile.sign, profile.partnerSign);
      setCurrentReading(reading);
    }
  }, [getRelationshipReading, profile.sign, profile.partnerSign]);

  // Build enhanced context for chat with current tarot reading
  const tarotChatContext = useMemo(() => {
    if (!currentReading) return undefined;
    return {
      tarotCards: buildTarotContext(currentReading.cards),
    };
  }, [currentReading]);

  const renderCardSpread = () => {
    if (!currentReading) return null;

    const isSingle = currentReading.cards.length === 1;

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Cards display */}
        <div className={`flex items-center justify-center gap-6 flex-wrap py-4`}>
          {currentReading.cards.map((cardData, index) => (
            <div key={index} className="flex flex-col items-center gap-4">
              <TarotCardComponent
                card={cardData.card}
                reversed={cardData.reversed}
                revealed={true}
                size={isSingle ? 'lg' : 'md'}
              />
              <div className="text-center space-y-1">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-400">{cardData.position}</div>
                <div className="text-sm font-bold text-white">
                  {cardData.card.name} {cardData.reversed && <span className="text-rose-500">(R)</span>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Meaning Sections */}
        <div className="space-y-6">
          {currentReading.cards.map((cardData, index) => {
            const enhancedMeaning = getEnhancedMeaning(cardData.card);

            return (
              <div key={index} className="glass-card p-6 rounded-[2rem] space-y-4 border border-violet-500/20">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 text-violet-400">
                    <Sparkles className="w-3 h-3" />
                    {cardData.position}: {cardData.card.name}
                  </h4>
                  {cardData.card.arcana === 'major' && (
                    <span className="text-[8px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-bold uppercase tracking-wider">
                      Major Arcana
                    </span>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/40">Basic Meaning</p>
                    <p className="text-sm text-white/80 leading-relaxed font-medium">
                      {cardData.reversed ? cardData.card.meaning.reversed : cardData.card.meaning.upright}
                    </p>
                  </div>

                  {enhancedMeaning && (
                    <div className="space-y-2 pt-2 border-t border-white/5">
                      <p className="text-[9px] font-black uppercase tracking-widest text-violet-400/60">Enhanced Wisdom</p>
                      <p className="text-sm text-white/70 leading-relaxed italic">
                        "{enhancedMeaning}"
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {cardData.card.keywords.map((keyword, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-muted-foreground rounded-full"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderLibrary = () => {
    // We would need to import all cards here, but useTarot provides some.
    // In a real app we'd fetch all 78. For now let's use what's in data.
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-black uppercase tracking-widest italic">Arcane Library</h3>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-1">Explore all 78 card meanings</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* This is a simplified library view */}
          {history.length > 0 ? (
            history.flatMap(r => r.cards).map((c, i) => (
              <div
                key={i}
                className="glass-card p-4 rounded-2xl border border-white/5 text-center cursor-pointer hover:border-violet-500/30 transition-colors"
                onClick={() => {
                  setCurrentReading({
                    id: 'library-preview',
                    type: 'daily',
                    cards: [c],
                    interpretation: '',
                    date: new Date().toISOString()
                  });
                  setActiveTab('daily');
                }}
              >
                <div className="text-2xl mb-2">
                  {c.card.arcana === 'major' ? '🔮' : '💧'}
                </div>
                <div className="text-xs font-bold text-white truncate">{c.card.name}</div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-12 text-white/40 italic text-sm">
              Perform a reading to unlock cards in your record...
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header handled by App.tsx if shown in ReadingsHub */}

      {/* Chat overlay */}
      {showChat && (
        <div className="absolute inset-x-0 bottom-0 z-50 bg-background/95 backdrop-blur-3xl border-t border-white/10 h-[70%]">
          <ChatInterface
            profile={profile}
            context="tarot"
            onClose={() => setShowChat(false)}
            enhancedContext={tarotChatContext}
          />
        </div>
      )}

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-8 pb-20 max-w-md mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-5 w-full bg-white/5 border border-white/5 rounded-full p-1 h-12">
              <TabsTrigger value="daily" className="rounded-full data-[state=active]:bg-violet-600 data-[state=active]:text-white text-[9px] uppercase font-bold tracking-widest">
                Card
              </TabsTrigger>
              <TabsTrigger value="three" className="rounded-full data-[state=active]:bg-violet-600 data-[state=active]:text-white text-[9px] uppercase font-bold tracking-widest">
                Spread
              </TabsTrigger>
              <TabsTrigger value="ppf" className="rounded-full data-[state=active]:bg-violet-600 data-[state=active]:text-white text-[9px] uppercase font-bold tracking-widest">
                PPF
              </TabsTrigger>
              <TabsTrigger value="relationship" disabled={!profile.partnerSign} className="rounded-full data-[state=active]:bg-violet-600 data-[state=active]:text-white text-[9px] uppercase font-bold tracking-widest">
                Love
              </TabsTrigger>
              <TabsTrigger value="library" className="rounded-full data-[state=active]:bg-violet-600 data-[state=active]:text-white text-[9px] uppercase font-bold tracking-widest">
                Library
              </TabsTrigger>
            </TabsList>

            <div className="mt-8">
              <TabsContent value="library" className="mt-0 focus-visible:outline-none">
                {renderLibrary()}
              </TabsContent>
              <TabsContent value="daily" className="mt-0 focus-visible:outline-none">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-black uppercase tracking-widest italic">Today's Pulse</h3>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-1">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                {renderCardSpread()}
              </TabsContent>

              <TabsContent value="three" className="mt-0 focus-visible:outline-none">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-black uppercase tracking-widest italic">Three-Card Grid</h3>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-1">Mind, Body, Spirit</p>
                </div>
                {!currentReading || currentReading.type !== 'three-card' ? (
                  <div className="text-center py-12">
                    <Button onClick={handleThreeCard} className="rounded-full px-10 py-8 bg-gradient-to-br from-violet-600 to-indigo-700 hover:scale-105 transition-transform shadow-xl shadow-violet-500/20 uppercase tracking-[0.2em] font-black text-xs">
                      Channel Spread
                    </Button>
                  </div>
                ) : renderCardSpread()}
              </TabsContent>

              <TabsContent value="ppf" className="mt-0 focus-visible:outline-none">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-black uppercase tracking-widest italic">Temporal Arc</h3>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-1">Past, Present, Future</p>
                </div>
                {!currentReading || currentReading.type !== 'past-present-future' ? (
                  <div className="text-center py-12">
                    <Button onClick={handlePastPresentFuture} className="rounded-full px-10 py-8 bg-gradient-to-br from-violet-600 to-indigo-700 hover:scale-105 transition-transform shadow-xl shadow-violet-500/20 uppercase tracking-[0.2em] font-black text-xs">
                      Trace Arc
                    </Button>
                  </div>
                ) : renderCardSpread()}
              </TabsContent>

              <TabsContent value="relationship" className="mt-0 focus-visible:outline-none">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-black uppercase tracking-widest italic">Sacred Bond</h3>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-1">
                    {profile.partnerSign ? `${profile.sign} & ${profile.partnerSign}` : 'Link souls in profile'}
                  </p>
                </div>
                {profile.partnerSign && (!currentReading || currentReading.type !== 'relationship') ? (
                  <div className="text-center py-12">
                    <Button onClick={handleRelationship} className="rounded-full px-10 py-8 bg-gradient-to-br from-violet-600 to-indigo-700 hover:scale-105 transition-transform shadow-xl shadow-violet-500/20 uppercase tracking-[0.2em] font-black text-xs">
                      Reveal Bond
                    </Button>
                  </div>
                ) : profile.partnerSign ? renderCardSpread() : null}
              </TabsContent>
            </div>
          </Tabs>

          {/* History */}
          {history.length > 0 && (
            <section className="mt-12 space-y-4">
              <div className="flex justify-between items-center px-2">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                  <History className="w-3 h-3 text-violet-400" />
                  Arcane Records
                </h4>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="space-y-3">
                {history.slice(0, 3).map((reading) => (
                  <div
                    key={reading.id}
                    className="glass-card p-4 rounded-3xl cursor-pointer hover:bg-white/5 transition-colors border border-white/5 flex items-center justify-between group"
                    onClick={() => {
                      setCurrentReading(reading);
                      setActiveTab(reading.type === 'three-card' ? 'three' : reading.type === 'past-present-future' ? 'ppf' : reading.type === 'relationship' ? 'relationship' : 'daily');
                    }}
                  >
                    <div className="space-y-1">
                      <div className="text-[10px] font-black text-violet-400 uppercase tracking-widest">{reading.type.replace('-', ' ')}</div>
                      <div className="text-xs font-bold text-white/60 group-hover:text-white transition-colors">
                        {reading.cards.map(c => c.card.name).join(', ')}
                      </div>
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">
                      {new Date(reading.date).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="fixed bottom-24 right-6 z-50">
            <Button
              className="w-12 h-12 rounded-full border border-white/10 glass shadow-lg p-0"
              onClick={() => setShowChat(true)}
            >
              <MessageCircle className="w-5 h-5 text-violet-400" />
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
