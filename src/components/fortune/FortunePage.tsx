import { useState, useEffect, useCallback } from 'react';
import type { UserProfile, Fortune } from '@/types';
import { generateFortune } from '@/data/horoscopeContent';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, RefreshCw, MessageCircle, Star, Heart, Briefcase, Coins, Compass } from 'lucide-react';
import { ChatInterface } from '../common/ChatInterface';

type FortuneTopic = 'future' | 'love' | 'career' | 'money' | 'life';

interface FortunePageProps {
  profile: UserProfile;
}

const topics: { id: FortuneTopic; label: string; icon: React.ElementType; color: string }[] = [
  { id: 'future', label: 'Future', icon: Star, color: 'text-violet-500' },
  { id: 'love', label: 'Love', icon: Heart, color: 'text-rose-500' },
  { id: 'career', label: 'Career', icon: Briefcase, color: 'text-blue-500' },
  { id: 'money', label: 'Money', icon: Coins, color: 'text-green-500' },
  { id: 'life', label: 'Life', icon: Compass, color: 'text-amber-500' },
];

export function FortunePage({ profile }: FortunePageProps) {
  const [selectedTopic, setSelectedTopic] = useState<FortuneTopic>('future');
  const [fortune, setFortune] = useState<Fortune | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [fortuneHistory, setFortuneHistory] = useState<Fortune[]>([]);

  const generateNewFortune = useCallback(() => {
    setIsGenerating(true);
    
    // Simulate a brief delay for effect
    setTimeout(() => {
      const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
      const newFortune = generateFortune(selectedTopic, profile.sign, dayOfYear + fortuneHistory.length);
      
      setFortune(newFortune);
      setFortuneHistory(prev => [newFortune, ...prev].slice(0, 20));
      setIsGenerating(false);
    }, 500);
  }, [selectedTopic, profile.sign, fortuneHistory.length]);

  // Generate initial fortune
  useEffect(() => {
    if (!fortune) {
      generateNewFortune();
    }
  }, [fortune, generateNewFortune]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h2 className="text-lg font-semibold">Fortune Teller</h2>
          <p className="text-sm text-muted-foreground">Discover what the stars reveal</p>
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
            context="fortune"
            onClose={() => setShowChat(false)}
          />
        </div>
      )}

      <ScrollArea className="flex-1">
        <div className="p-4 max-w-2xl mx-auto space-y-6">
          {/* Topic selector */}
          <div className="flex flex-wrap justify-center gap-2">
            {topics.map((topic) => {
              const Icon = topic.icon;
              return (
                <Button
                  key={topic.id}
                  variant={selectedTopic === topic.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setSelectedTopic(topic.id);
                    generateNewFortune();
                  }}
                  className={`gap-2 ${selectedTopic === topic.id ? 'bg-gradient-to-r from-violet-600 to-purple-600' : ''}`}
                >
                  <Icon className={`w-4 h-4 ${topic.color}`} />
                  {topic.label}
                </Button>
              );
            })}
          </div>

          {/* Fortune display */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-20" />
            <div className="relative bg-white dark:bg-gray-900 rounded-xl p-8 shadow-xl border border-violet-200 dark:border-violet-800">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center animate-pulse">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <p className="mt-4 text-muted-foreground">The universe is whispering...</p>
                </div>
              ) : fortune ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                      {(() => {
                        const topic = topics.find(t => t.id === selectedTopic);
                        const Icon = topic?.icon || Star;
                        return <Icon className="w-6 h-6 text-white" />;
                      })()}
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold capitalize mb-1">{selectedTopic} Fortune</h3>
                    <p className="text-xs text-muted-foreground">
                      For {profile.sign} • {new Date(fortune.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-center py-4">
                    <p className="text-lg leading-relaxed font-medium">
                      "{fortune.content}"
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={generateNewFortune}
                      className="gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      New Fortune
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* Fortune history */}
          {fortuneHistory.length > 1 && (
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-500" />
                Recent Fortunes
              </h4>
              <div className="space-y-2">
                {fortuneHistory.slice(1, 6).map((f, index) => {
                  const topic = topics.find(t => t.id === f.topic);
                  const Icon = topic?.icon || Star;
                  return (
                    <div 
                      key={index}
                      className="p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className={`w-4 h-4 ${topic?.color}`} />
                        <span className="text-sm font-medium capitalize">{f.topic}</span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {new Date(f.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {f.content}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
