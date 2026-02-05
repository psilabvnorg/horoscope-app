import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { UserProfile } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GradientButton } from '@/components/ui/gradient-button';
import { Card } from '@/components/ui/card';
import { MonthlyEnergy } from './MonthlyEnergy';
import { ZodiacDetail } from '@/components/zodiac/ZodiacDetail';
import { useZodiacData, useLoveData, useElementBalanceData } from '@/hooks/useTranslatedData';
import { ZODIAC_SIGNS, type ZodiacSign, type ElementType } from '@/types';
import { getCompatibilityText } from '@/hooks/useCompatibility';
import { X, Heart, Sparkles, Info } from 'lucide-react';

interface HomePageProps {
    profile: UserProfile;
}

export function HomePageSimplified({ profile }: HomePageProps) {
    const { t } = useTranslation();
    const zodiacData = useZodiacData();
    const loveData = useLoveData();
    const elementBalanceData = useElementBalanceData();
    const [showZodiacDetail, setShowZodiacDetail] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState<ZodiacSign | null>(null);

    // Get today's best match (deterministic based on date)
    const getTodayMatch = (): ZodiacSign => {
        const today = new Date();
        const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
        const signIndex = ZODIAC_SIGNS.indexOf(profile.sign);
        const matchIndex = (seed + signIndex * 7) % ZODIAC_SIGNS.length;
        return ZODIAC_SIGNS[matchIndex];
    };

    const todayMatch = getTodayMatch();

    const zodiacSymbols: Record<ZodiacSign, string> = {
        aries: '♈', taurus: '♉', gemini: '♊', cancer: '♋',
        leo: '♌', virgo: '♍', libra: '♎', scorpio: '♏',
        sagittarius: '♐', capricorn: '♑', aquarius: '♒', pisces: '♓'
    };

    const signLabel = t(`zodiac:signs.${profile.sign}`);

    const elementIcons: Record<ElementType, string> = {
        fire: '🔥',
        earth: '🌿',
        air: '💨',
        water: '💧',
    };

    const elementKey = (Object.keys(elementBalanceData) as ElementType[])
        .find((key) => elementBalanceData[key]?.signs?.includes(profile.sign)) || 'fire';
    const elementInfo = elementBalanceData[elementKey];

    return (
        <div className="flex flex-col h-full bg-[#0a0a0f] text-foreground overflow-hidden">
            {/* Simple Header */}
            <header className="p-4 pt-6">
                <h1 className="text-2xl font-bold tracking-wide text-center">
                    {t('home.horoscope')}
                </h1>
            </header>

            <ScrollArea className="flex-1">
                <div className="p-4 space-y-6 pb-24">
                    {/* User Profile - Simplified */}
                    <section className="text-center space-y-4">
                        <div className="space-y-1">
                            <h2 className="text-xl font-semibold">{profile.name}</h2>
                            <p className="text-xs uppercase tracking-widest text-white/50">
                                {profile.birthday}
                            </p>
                        </div>

                        {/* Simplified Zodiac Display */}
                        <div className="relative flex justify-center items-center py-8">
                            {/* Glow effect */}
                            <div className="absolute w-48 h-48 rounded-full bg-gradient-radial from-violet-500/20 via-purple-900/10 to-transparent blur-2xl" />
                            
                            {/* Main zodiac image */}
                            <div className="relative z-10 flex flex-col items-center gap-4">
                                <img
                                    src="/figma/asset/Cancer0 1.png"
                                    alt={profile.sign}
                                    className="w-32 h-32 object-contain filter drop-shadow-[0_0_30px_rgba(168,85,247,0.4)]"
                                />
                                <button
                                    onClick={() => setShowZodiacDetail(true)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                                >
                                    <span className="text-sm font-semibold uppercase tracking-wider text-white">
                                        {signLabel}
                                    </span>
                                    <Info className="w-4 h-4 text-white/40" />
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Personality Profile */}
                    <Card variant="default">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-white/70 mb-3">
                            {t('home.yourProfile')}
                        </h3>
                        <p className="text-sm text-white/80 leading-relaxed italic">
                            "{zodiacData[profile.sign.charAt(0).toUpperCase() + profile.sign.slice(1) as keyof typeof zodiacData]}"
                        </p>
                    </Card>

                    {/* Daily Guidance - Combined Affirmation + Tips */}
                    <section className="space-y-3">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">
                            {t('home.dailyGuidance')}
                        </h3>
                        
                        {/* Affirmation */}
                        <Card variant="elevated" className="relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-violet-500" />
                            <div className="flex items-start gap-3">
                                <Sparkles className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-white/50 mb-1">
                                        {t('home.affirmation')}
                                    </p>
                                    <p className="text-sm font-medium text-white/90">
                                        {t('home.affirmationText')}
                                    </p>
                                </div>
                            </div>
                        </Card>

                        {/* Love Tip */}
                        <Card variant="default" className="relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500" />
                            <div className="flex items-start gap-3">
                                <Heart className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-white/50 mb-1">
                                        {t('home.love')}
                                    </p>
                                    <p className="text-sm text-white/80">
                                        {t('home.loveTip')}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </section>

                    {/* Daily Horoscope */}
                    <section className="space-y-3">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">
                            {t('home.todayHoroscope')}
                        </h3>
                        <Card variant="default">
                            <p className="text-sm text-white/80 leading-relaxed">
                                {t('home.horoscopeText')}
                            </p>
                        </Card>
                    </section>

                    {/* Element Balance */}
                    {elementInfo && (
                        <section className="space-y-3">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">
                                {t('home.elementBalance')}
                            </h3>
                            <Card variant="elevated" className="relative overflow-hidden">
                                <div className="absolute right-0 top-0 w-32 h-32 bg-violet-500/10 blur-3xl rounded-full" />
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-xl">
                                        {elementIcons[elementKey]}
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-white/50">
                                            {t('home.yourElement')}
                                        </p>
                                        <p className="text-lg font-semibold text-white">
                                            {t(`home.${elementKey}`)}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-sm text-white/70 leading-relaxed mt-3">
                                    {elementInfo.balance}
                                </p>
                                <p className="text-xs text-white/50 mt-2">
                                    {elementInfo.imbalance}
                                </p>
                                <div className="mt-3 space-y-2">
                                    <p className="text-[10px] uppercase tracking-widest text-white/50">
                                        {t('home.restoreBalance')}
                                    </p>
                                    {elementInfo.tips.map((tip, index) => (
                                        <div key={index} className="flex items-start gap-2 text-sm text-white/80">
                                            <span className="text-white/30">•</span>
                                            <span>{tip}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </section>
                    )}

                    {/* Today's Match - Simplified to 1 */}
                    <section className="space-y-3">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-rose-400">
                            💕 {t('home.todayMatch')}
                        </h3>
                        <Card variant="elevated" className="bg-gradient-to-br from-rose-500/10 to-pink-500/5">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-rose-500/30 to-pink-500/30 text-3xl">
                                    {zodiacSymbols[todayMatch]}
                                </div>
                                <div className="flex-1">
                                    <p className="text-lg font-semibold text-white capitalize mb-1">
                                        {t(`zodiac:signs.${todayMatch}`)}
                                    </p>
                                    <p className="text-xs text-white/60">
                                        {t('home.greatCompatibility')}
                                    </p>
                                </div>
                            </div>
                            <GradientButton
                                variant="pink"
                                size="sm"
                                onClick={() => setSelectedMatch(todayMatch)}
                                className="w-full mt-4"
                            >
                                {t('actions.viewCompatibility')}
                            </GradientButton>
                        </Card>
                    </section>

                    {/* Monthly Energy */}
                    <MonthlyEnergy sign={profile.sign} />
                </div>
            </ScrollArea>

            {/* Zodiac Detail Modal */}
            {showZodiacDetail && (
                <ZodiacDetail
                    sign={profile.sign}
                    onClose={() => setShowZodiacDetail(false)}
                />
            )}

            {/* Compatibility Detail Modal */}
            {selectedMatch && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
                    <div className="w-full max-w-sm bg-[#1a1a2e] rounded-3xl border border-rose-500/20 overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-6 bg-gradient-to-br from-rose-500/10 to-transparent relative">
                            <button
                                onClick={() => setSelectedMatch(null)}
                                className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-rose-500/20 flex items-center justify-center text-2xl">
                                    ❤️
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-white uppercase tracking-wider">
                                        {signLabel} + {t(`zodiac:signs.${selectedMatch}`)}
                                    </h2>
                                    <p className="text-xs text-white/40 uppercase tracking-widest">
                                        {t('home.loveMatch')}
                                    </p>
                                </div>
                            </div>
                            <p className="text-white/70 text-sm leading-relaxed italic">
                                "{getCompatibilityText(profile.sign, selectedMatch, loveData)}"
                            </p>
                        </div>
                        <div className="p-4 bg-white/5 border-t border-white/5 flex justify-center">
                            <button
                                className="text-xs uppercase tracking-widest text-white/60 hover:text-white transition-colors"
                                onClick={() => setSelectedMatch(null)}
                            >
                                {t('actions.close')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
