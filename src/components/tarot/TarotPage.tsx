import { useState, useEffect, useCallback } from 'react';
import type { UserProfile, TarotReading } from '@/types';
import { useTarot } from '@/hooks/useTarot';
import { TarotCardComponent } from './TarotCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, History, Calendar, LayoutGrid, Clock, MessageCircle } from 'lucide-react';
import { ChatInterface } from '../common/ChatInterface';

interface TarotPageProps {
  profile: UserProfile;
}

export function TarotPage({ profile }: TarotPageProps) {
  const {
    dailyReading,
    history,
    getDailyCard,
    getThreeCardSpread,
    getPastPresentFuture,
    getRelationshipReading,
  } = useTarot();

  const [activeTab, setActiveTab] = useState('daily');
  const [currentReading, setCurrentReading] = useState<TarotReading | null>(null);
  const [showChat, setShowChat] = useState(false);

  // Load daily card on mount
  useEffect(() => {
    if (!dailyReading) {
      const reading = getDailyCard(profile.sign);
      setCurrentReading(reading);
    } else {
      setCurrentReading(dailyReading);
    }
  }, [dailyReading, getDailyCard, profile.sign]);

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

  const renderCardSpread = () => {
    if (!currentReading) return null;

    const isSingle = currentReading.cards.length === 1;

    return (
      <div className="space-y-6">
        {/* Cards display */}
        <div className={`flex ${isSingle ? 'justify-center' : 'justify-center gap-4'} flex-wrap`}>
          {currentReading.cards.map((cardData, index) => (
            <div key={index} className="flex flex-col items-center">
              <TarotCardComponent
                card={cardData.card}
                reversed={cardData.reversed}
                revealed={true}
                size={isSingle ? 'lg' : 'md'}
              />
              <div className="mt-3 text-center">
                <div className="font-medium text-sm">{cardData.position}</div>
                <div className="text-xs text-muted-foreground">
                  {cardData.card.name} {cardData.reversed && '(Reversed)'}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Interpretation */}
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-500" />
            Interpretation
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {currentReading.interpretation}
          </p>
        </div>

        {/* Keywords */}
        <div className="flex flex-wrap gap-2">
          {currentReading.cards.map((c, i) => 
            c.card.keywords.map((keyword, j) => (
              <span 
                key={`${i}-${j}`}
                className="px-2 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-full text-xs"
              >
                {keyword}
              </span>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h2 className="text-lg font-semibold">Tarot Readings</h2>
          <p className="text-sm text-muted-foreground">Discover wisdom through the cards</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowChat(!showChat)}
          className="gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          Ask
        </Button>
      </div>

      {/* Chat overlay */}
      {showChat && (
        <div className="absolute inset-x-0 bottom-0 z-50 bg-background border-t shadow-lg">
          <ChatInterface
            profile={profile}
            context="tarot"
            onClose={() => setShowChat(false)}
          />
        </div>
      )}

      <ScrollArea className="flex-1">
        <div className="p-4 max-w-2xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="daily">
                <Calendar className="w-4 h-4 mr-1" />
                Daily
              </TabsTrigger>
              <TabsTrigger value="three">
                <LayoutGrid className="w-4 h-4 mr-1" />
                3-Card
              </TabsTrigger>
              <TabsTrigger value="ppf">
                <Clock className="w-4 h-4 mr-1" />
                PPF
              </TabsTrigger>
              <TabsTrigger value="relationship" disabled={!profile.partnerSign}>
                <Sparkles className="w-4 h-4 mr-1" />
                Love
              </TabsTrigger>
            </TabsList>

            <TabsContent value="daily" className="mt-4">
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold">Your Daily Card</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              </div>
              {renderCardSpread()}
            </TabsContent>

            <TabsContent value="three" className="mt-4">
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold">Three-Card Spread</h3>
                <p className="text-sm text-muted-foreground">Past, Present, Future</p>
              </div>
              {!currentReading || currentReading.type !== 'three-card' ? (
                <div className="text-center py-8">
                  <Button onClick={handleThreeCard} className="gap-2">
                    <Sparkles className="w-4 h-4" />
                    Draw Cards
                  </Button>
                </div>
              ) : renderCardSpread()}
            </TabsContent>

            <TabsContent value="ppf" className="mt-4">
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold">Past, Present, Future</h3>
                <p className="text-sm text-muted-foreground">Your journey through time</p>
              </div>
              {!currentReading || currentReading.type !== 'past-present-future' ? (
                <div className="text-center py-8">
                  <Button onClick={handlePastPresentFuture} className="gap-2">
                    <Sparkles className="w-4 h-4" />
                    Draw Cards
                  </Button>
                </div>
              ) : renderCardSpread()}
            </TabsContent>

            <TabsContent value="relationship" className="mt-4">
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold">Relationship Reading</h3>
                <p className="text-sm text-muted-foreground">
                  {profile.partnerSign ? `For ${profile.sign} & ${profile.partnerSign}` : 'Add a partner to unlock'}
                </p>
              </div>
              {profile.partnerSign && (!currentReading || currentReading.type !== 'relationship') ? (
                <div className="text-center py-8">
                  <Button onClick={handleRelationship} className="gap-2">
                    <Sparkles className="w-4 h-4" />
                    Draw Cards
                  </Button>
                </div>
              ) : profile.partnerSign ? renderCardSpread() : null}
            </TabsContent>
          </Tabs>

          {/* History */}
          {history.length > 0 && (
            <div className="mt-8">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <History className="w-4 h-4" />
                Recent Readings
              </h4>
              <div className="space-y-2">
                {history.slice(0, 5).map((reading) => (
                  <div 
                    key={reading.id}
                    className="p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => setCurrentReading(reading)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium capitalize">{reading.type.replace('-', ' ')}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(reading.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {reading.cards.map(c => c.card.name).join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
