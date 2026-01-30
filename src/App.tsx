import { useState } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { SwipePage } from '@/components/swipe/SwipePage';
import { TarotPage } from '@/components/tarot/TarotPage';
import { CouplePage } from '@/components/couple/CouplePage';
import { FortunePage } from '@/components/fortune/FortunePage';
import { SettingsPage } from '@/components/settings/SettingsPage';
import { 
  Sparkles, 
  Heart, 
  Star, 
  Settings,
  Layers
} from 'lucide-react';

type Tab = 'swipe' | 'tarot' | 'couple' | 'fortune' | 'settings';

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
  
  const [activeTab, setActiveTab] = useState<Tab>('swipe');

  if (!isOnboarded) {
    return <OnboardingFlow onComplete={completeOnboarding} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'swipe':
        return <SwipePage profile={profile} onSwipe={handleSwipe} />;
      case 'tarot':
        return <TarotPage profile={profile} />;
      case 'couple':
        return <CouplePage profile={profile} />;
      case 'fortune':
        return <FortunePage profile={profile} />;
      case 'settings':
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
        return <SwipePage profile={profile} onSwipe={handleSwipe} />;
    }
  };

  const getTabIcon = (tab: Tab) => {
    const icons = {
      swipe: Sparkles,
      tarot: Layers,
      couple: Heart,
      fortune: Star,
      settings: Settings,
    };
    const Icon = icons[tab];
    return <Icon className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main content */}
      <main className="flex-1 overflow-auto pb-16">
        {renderContent()}
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur-lg z-[100]">
        <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
          {(['swipe', 'tarot', 'couple', 'fortune', 'settings'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
                activeTab === tab 
                  ? 'text-violet-600' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {getTabIcon(tab)}
              <span className="text-xs capitalize">{tab}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default App;
