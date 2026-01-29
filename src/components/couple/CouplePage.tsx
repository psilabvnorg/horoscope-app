import { useState, useEffect } from 'react';
import type { UserProfile, ZodiacSign } from '@/types';
import { generateCoupleCompatibility } from '@/data/horoscopeContent';
import { TarotCardComponent } from '../tarot/TarotCard';
import { useTarot } from '@/hooks/useTarot';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Heart, Sparkles, MessageCircle, Users, Star, AlertTriangle, Check } from 'lucide-react';
import { ChatInterface } from '../common/ChatInterface';

interface CouplePageProps {
  profile: UserProfile;
}

const zodiacEmojis: Record<ZodiacSign, string> = {
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
      <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-6">
        <div className="w-24 h-24 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
          <Heart className="w-12 h-12 text-rose-400" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">No Partner Added</h3>
          <p className="text-muted-foreground max-w-sm">
            Add your partner's birthday in settings to unlock couple compatibility readings
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h2 className="text-lg font-semibold">Couple Compatibility</h2>
          <p className="text-sm text-muted-foreground">
            {profile.sign} & {profile.partnerSign}
          </p>
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
            context="couple"
            onClose={() => setShowChat(false)}
          />
        </div>
      )}

      <ScrollArea className="flex-1">
        <div className="p-4 max-w-2xl mx-auto space-y-6">
          {/* Signs display */}
          <div className="flex items-center justify-center gap-4 py-4">
            <div className="text-center">
              <div className="text-6xl">{zodiacEmojis[profile.sign]}</div>
              <div className="text-sm font-medium capitalize mt-2">{profile.sign}</div>
            </div>
            <div className="text-4xl text-rose-400">
              <Heart className="w-8 h-8 fill-current" />
            </div>
            <div className="text-center">
              <div className="text-6xl">{zodiacEmojis[profile.partnerSign!]}</div>
              <div className="text-sm font-medium capitalize mt-2">{profile.partnerSign}</div>
            </div>
          </div>

          {/* Compatibility score */}
          {compatibility && (
            <div className="bg-gradient-to-br from-rose-50 to-violet-50 dark:from-rose-950/30 dark:to-violet-950/30 rounded-xl p-6">
              <div className="text-center mb-4">
                <span className="text-sm text-muted-foreground">Compatibility Score</span>
                <div className="text-5xl font-bold bg-gradient-to-r from-rose-500 to-violet-500 bg-clip-text text-transparent">
                  {compatibility.score}%
                </div>
              </div>
              <Progress 
                value={compatibility.score} 
                className="h-3"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>Challenging</span>
                <span>Perfect Match</span>
              </div>
            </div>
          )}

          {/* Daily message */}
          {compatibility && (
            <div className="bg-violet-100 dark:bg-violet-900/30 rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-500" />
                Today's Message
              </h4>
              <p className="text-sm text-violet-800 dark:text-violet-200">
                {compatibility.dailyMessage}
              </p>
            </div>
          )}

          {/* Strengths */}
          {compatibility && compatibility.strengths.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500" />
                Strengths
              </h4>
              <div className="space-y-2">
                {compatibility.strengths.map((strength, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg"
                  >
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{strength}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Weaknesses */}
          {compatibility && compatibility.weaknesses.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Areas to Work On
              </h4>
              <div className="space-y-2">
                {compatibility.weaknesses.map((weakness, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg"
                  >
                    <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    <span className="text-sm">{weakness}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tarot reading */}
          {tarotReading && (
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-violet-500" />
                Relationship Tarot
              </h4>
              <div className="flex justify-center gap-3 flex-wrap">
                {tarotReading.cards.map((cardData, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <TarotCardComponent
                      card={cardData.card}
                      reversed={cardData.reversed}
                      revealed={true}
                      size="sm"
                    />
                    <div className="mt-2 text-center">
                      <div className="text-xs font-medium">{cardData.position}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  {tarotReading.interpretation}
                </p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
