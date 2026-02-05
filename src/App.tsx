import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserProfile } from '@/hooks/useUserProfile';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { TarotPage } from '@/components/tarot/TarotPage';
import { TarotCardSelection } from '@/components/tarot/TarotCardSelection';
import { TarotCardsPage } from '@/components/tarot/TarotCardsPage';
import { CardLibrary } from '@/components/tarot/CardLibrary';
import { LovePage } from '@/components/love/LovePage';
import { FortunePage } from '@/components/fortune/FortunePage';
import { SettingsPage } from '@/components/settings/SettingsPage';
import { HomePageSimplified as HomePage } from '@/components/home/HomePageSimplified';
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
type ReadingView = 'menu' | 'tarot' | 'tarot-selection' | 'tarot-reading' | 'card-library' | 'palm' | 'palm-result' | 'birth-chart';

function App() {
  const { t } = useTranslation();
  const {
    profile,
    isOnboarded,
    completeOnboarding,
    updateProfile,
    clearHistory,
    deleteAccount,
    removePartner
  } = useUserProfile();

  const [activeTab, setActiveTab] = useState<Tab>('horoscope');
  const [readingView, setReadingView] = useState<ReadingView>('menu');
  const [selectedReadingType, setSelectedReadingType] = useState<string | null>(null);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);

  if (!isOnboarded) {
    return <OnboardingFlow onComplete={completeOnboarding} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'horoscope':
        return <HomePage profile={profile} />;
      case 'readings':
        if (readingView === 'tarot') return (
          <TarotCardsPage
            onBack={() => setReadingView('menu')}
            onSelectReading={(type) => {
              setSelectedReadingType(type);
              if (type === 'meanings') {
                setReadingView('card-library');
              } else if (type === 'daily') {
                setReadingView('tarot-reading');
              } else {
                setReadingView('tarot-selection');
              }
            }}
          />
        );
        if (readingView === 'card-library') return (
          <div className="h-full flex flex-col pt-safe bg-[#0a0a1a]">
            <CardLibrary
              onClose={() => setReadingView('tarot')}
            />
          </div>
        );
        if (readingView === 'tarot-selection') return (
          <TarotCardSelection
            onBack={() => setReadingView('tarot')}
            onComplete={(cards) => {
              setSelectedCards(cards);
              setReadingView('tarot-reading');
            }}
          />
        );
        if (readingView === 'tarot-reading') return (
          <div className="h-full flex flex-col pt-safe bg-[#0a0a1a]">
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#0a0a1a]">
              <button onClick={() => setReadingView('tarot')} className="text-xs uppercase tracking-widest text-muted-foreground hover:text-white transition-colors">← {t('actions.back')}</button>
              <h2 className="text-sm font-bold tracking-widest uppercase text-white">{t('tarot.title')}</h2>
              <div className="w-10" />
            </div>
            <div className="flex-1 overflow-auto bg-[#0a0a1a]">
              <TarotPage
                profile={profile}
                readingType={selectedReadingType || undefined}
                selectedCardIds={selectedCards.length > 0 ? selectedCards : undefined}
              />
            </div>
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
            userSign={profile.sign}
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
      default:
        return <HomePage profile={profile} />;
    }
  };

  const getTabLabel = (tab: Tab): string => {
    const labels: Record<Tab, string> = {
      horoscope: t('navigation.home'),
      readings: t('navigation.readings'),
      love: t('navigation.love'),
      guidance: t('navigation.fortune'),
      profile: t('navigation.settings'),
      swipe: t('navigation.swipe'),
    };
    return labels[tab];
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
          {(['horoscope', 'readings', 'love', 'guidance', 'profile'] as Tab[]).map((tab) => (
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
              <span className="text-[10px] uppercase tracking-tighter font-medium">{getTabLabel(tab)}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default App;
