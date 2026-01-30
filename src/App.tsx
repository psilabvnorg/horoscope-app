import { useState } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { SwipePage } from '@/components/swipe/SwipePage';
import { TarotPage } from '@/components/tarot/TarotPage';
import { TarotCardSelection } from '@/components/tarot/TarotCardSelection';
import { TarotCardsPage } from '@/components/tarot/TarotCardsPage';
import { LovePage } from '@/components/love/LovePage';
import { FortunePage } from '@/components/fortune/FortunePage';
import { SettingsPage } from '@/components/settings/SettingsPage';
import { HomePage } from '@/components/home/HomePage';
import { ReadingsPage } from '@/components/readings/ReadingsPage';
import { PalmReadingIntro } from '@/components/readings/PalmReadingIntro';
import { PalmReadingResult } from '@/components/readings/PalmReadingResult';
import { BirthChartReading } from '@/components/readings/BirthChartReading';
import {
  Moon,
  Settings2,
  Heart,
  Eye,
  User,
  Star
} from 'lucide-react';

type Tab = 'horoscope' | 'readings' | 'love' | 'guidance' | 'profile' | 'swipe';
type ReadingView = 'menu' | 'tarot' | 'tarot-selection' | 'tarot-reading' | 'palm' | 'palm-result' | 'birth-chart';

function App() {
  const {
    profile,
    isOnboarded,
    completeOnboarding,
    handleSwipe,
    updateProfile,
    clearHistory,
    deleteAccount,
    removePartner
  } = useUserProfile();

  const [activeTab, setActiveTab] = useState<Tab>('horoscope');
  const [readingView, setReadingView] = useState<ReadingView>('menu');

  if (!isOnboarded) {
    return <OnboardingFlow onComplete={completeOnboarding} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'horoscope':
        return <HomePage profile={profile} onNavigateToSwipe={() => setActiveTab('swipe')} />;
      case 'readings':
        if (readingView === 'tarot') return (
          <TarotCardsPage
            onBack={() => setReadingView('menu')}
            onSelectReading={(type) => {
              console.log('Selected reading type:', type);
              setReadingView('tarot-selection');
            }}
          />
        );
        if (readingView === 'tarot-selection') return (
          <TarotCardSelection
            onBack={() => setReadingView('tarot')}
            onComplete={(cards) => {
              console.log('Selected cards:', cards);
              setReadingView('tarot-reading');
            }}
          />
        );
        if (readingView === 'tarot-reading') return (
          <div className="h-full flex flex-col pt-safe">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <button onClick={() => setReadingView('tarot')} className="text-xs uppercase tracking-widest text-muted-foreground hover:text-white transition-colors">← Back</button>
              <h2 className="text-sm font-bold tracking-widest uppercase">Tarot</h2>
              <div className="w-10" />
            </div>
            <div className="flex-1 overflow-auto"><TarotPage profile={profile} /></div>
          </div>
        );
        if (readingView === 'palm') return (
          <PalmReadingIntro 
            onBack={() => setReadingView('menu')} 
            onReadNow={() => setReadingView('palm-result')} 
          />
        );
        if (readingView === 'palm-result') return (
          <PalmReadingResult 
            onBack={() => setReadingView('menu')} 
          />
        );
        if (readingView === 'birth-chart') return (
          <BirthChartReading 
            onBack={() => setReadingView('menu')} 
          />
        );
        return <ReadingsPage profile={profile} onNavigate={(view) => setReadingView(view as ReadingView)} />;
      case 'love':
        return <LovePage profile={profile} />;
      case 'guidance':
        return <FortunePage profile={profile} />;
      case 'profile':
        return (
          <SettingsPage
            profile={profile}
            onUpdateProfile={updateProfile}
            onClearHistory={clearHistory}
            onDeleteAccount={deleteAccount}
            onRemovePartner={removePartner}
          />
        );
      case 'swipe':
        return <SwipePage profile={profile} onSwipe={handleSwipe} />;
      default:
        return <HomePage profile={profile} />;
    }
  };

  const getTabIcon = (tab: Tab) => {
    const icons: Record<Tab, typeof Moon> = {
      horoscope: Moon,
      readings: Settings2,
      love: Heart,
      guidance: Eye,
      profile: User,
      swipe: Star,
    };
    const Icon = icons[tab];
    return <Icon className={`w-5 h-5 ${activeTab === tab ? 'filter drop-shadow-[0_0_5px_currentColor]' : ''}`} />;
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-violet-500/30">
      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-[#1a1a2e] z-[100] pb-safe">
        <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
          {(['horoscope', 'swipe', 'readings', 'love', 'guidance', 'profile'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                if (tab === 'readings') setReadingView('menu');
              }}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-all ${activeTab === tab
                ? 'text-violet-400 scale-110'
                : 'text-muted-foreground hover:text-white'
                }`}
            >
              {getTabIcon(tab)}
              <span className="text-[10px] uppercase tracking-tighter font-medium">{tab}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default App;
