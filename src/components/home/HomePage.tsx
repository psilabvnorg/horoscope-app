import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { UserProfile } from '@/types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MonthlyEnergy } from './MonthlyEnergy';
import { ZodiacDetail } from '@/components/zodiac/ZodiacDetail';
import { useZodiacData, useLoveData } from '@/hooks/useTranslatedData';
import { useDailyForecast } from '@/hooks/useDailyForecast';
import { ZODIAC_SIGNS, type ZodiacSign } from '@/types';
import { getCompatibilityText } from '@/hooks/useCompatibility';
import { X, Check, Ban } from 'lucide-react';
import {
    Sparkles,
    Moon,
    Heart,
    Menu,
    ChevronRight,
    Sun,
    ArrowUp,
    Droplets,
    AlertTriangle,
    Info,
    Briefcase,
    Smile,
    Zap
} from 'lucide-react';

interface HomePageProps {
    profile: UserProfile;
    onNavigateToSwipe?: () => void;
}

type TimeRange = 'today' | 'tomorrow' | 'week' | 'month';

export function HomePage({ profile, onNavigateToSwipe }: HomePageProps) {
    const { t } = useTranslation();
    const zodiacData = useZodiacData();
    const loveData = useLoveData();
    const { data: forecast, loading: forecastLoading } = useDailyForecast(profile.sign);
    const [timeRange, setTimeRange] = useState<TimeRange>('today');
    const [showZodiacDetail, setShowZodiacDetail] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState<ZodiacSign | null>(null);

    // Filter actions by type
    const doActions = forecast.actions.filter(a => a.type === 'do');
    const avoidActions = forecast.actions.filter(a => a.type === 'avoid');

    // Generate moon phase dates based on current date
    const getMoonPhaseDates = () => {
        const today = new Date();
        const dates = [];
        
        // Start date (6 days ago)
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 6);
        
        // Generate 4 dates with 6-day intervals
        for (let i = 0; i < 4; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + (i * 6));
            const month = date.toLocaleString('en-US', { month: 'short' });
            const day = date.getDate();
            dates.push({ dateStr: `${month} ${day}`, isToday: i === 1 });
        }
        
        return dates;
    };

    const moonPhaseDates = getMoonPhaseDates();

    // Get current moon phase date range
    const getMoonPhaseRange = () => {
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 5);
        const endDate = new Date(today);
        endDate.setDate(today.getDate() + 14);
        
        const formatDate = (date: Date) => {
            const month = date.toLocaleString('en-US', { month: 'short' });
            const day = date.getDate();
            return `${month} ${day}`;
        };
        
        return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    };

    const moonPhaseRange = getMoonPhaseRange();

    // Get current moon phase name based on day of month
    const getMoonPhaseName = () => {
        const today = new Date();
        const dayOfMonth = today.getDate();
        const phases = [
            t('home.moonPhases.newMoon'),
            t('home.moonPhases.waxingCrescent'), 
            t('home.moonPhases.firstQuarter'),
            t('home.moonPhases.waxingGibbous'),
            t('home.moonPhases.fullMoon'),
            t('home.moonPhases.waningGibbous'),
            t('home.moonPhases.lastQuarter'),
            t('home.moonPhases.waningCrescent')
        ];
        // Approximate 29.5 day lunar cycle
        const phaseIndex = Math.floor((dayOfMonth % 29.5) / 3.69);
        return phases[Math.min(phaseIndex, phases.length - 1)];
    };

    const currentMoonPhase = getMoonPhaseName();

    // Get current moon sign based on date
    const getMoonSign = () => {
        const today = new Date();
        const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
        const signs: ZodiacSign[] = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
        // Moon changes sign approximately every 2.5 days
        const signIndex = Math.floor((dayOfYear / 2.5) % 12);
        return signs[signIndex];
    };

    const currentMoonSign = getMoonSign();

    // Deterministic match selection based on date and user sign
    const getDailyMatches = () => {
        const today = new Date();
        const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
        const signIndex = ZODIAC_SIGNS.indexOf(profile.sign);

        // Use seed and signIndex to pick two different signs
        const firstMatchIndex = (seed + signIndex * 7) % ZODIAC_SIGNS.length;
        let secondMatchIndex = (seed + signIndex * 13 + 3) % ZODIAC_SIGNS.length;
        if (secondMatchIndex === firstMatchIndex) {
            secondMatchIndex = (secondMatchIndex + 1) % ZODIAC_SIGNS.length;
        }

        return [ZODIAC_SIGNS[firstMatchIndex], ZODIAC_SIGNS[secondMatchIndex]];
    };

    const dailyMatches = getDailyMatches();

    const zodiacSymbols: Record<ZodiacSign, string> = {
        aries: '♈', taurus: '♉', gemini: '♊', cancer: '♋',
        leo: '♌', virgo: '♍', libra: '♎', scorpio: '♏',
        sagittarius: '♐', capricorn: '♑', aquarius: '♒', pisces: '♓'
    };

    return (
        <div className="flex flex-col h-full bg-[#0a0a0f] text-foreground overflow-hidden">
            {/* Top Header */}
            <header className="p-4 flex justify-between items-center">
                <h1 className="text-lg font-bold tracking-[0.2em] uppercase">{t('home.horoscope')}</h1>
                <Menu className="w-5 h-5 text-white/70" />
            </header>

            {/* Time Range Tabs */}
            <nav className="px-4 py-2 overflow-x-auto scrollbar-hide">
                <div className="flex items-center gap-6 min-w-max">
                    {(['today', 'tomorrow', 'week', 'month'] as TimeRange[]).map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`text-[11px] uppercase font-semibold tracking-widest transition-all relative py-2 ${timeRange === range ? 'text-white' : 'text-white/40 hover:text-white/60'
                                }`}
                        >
                            {t(`common.${range}`)}
                            {timeRange === range && (
                                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-violet-500 rounded-full" />
                            )}
                        </button>
                    ))}
                </div>
            </nav>

            <ScrollArea className="flex-1">
                <div className="p-4 space-y-8 pb-24">
                    {/* User Profile Section */}
                    <section className="text-center space-y-6 relative py-4">
                        <div className="space-y-1 relative z-10">
                            <h2 className="text-xl font-semibold tracking-wide">{profile.name || 'Tiffany Watson'}</h2>
                            <p className="text-[11px] uppercase tracking-widest text-white/50">
                                {t('home.you')} • {profile.birthday}
                            </p>
                        </div>

                        {/* Celestial Profile Wheel */}
                        <div className="relative flex justify-center items-center h-[300px]">
                            {/* Background Glow */}
                            <div className="absolute w-[280px] h-[280px] rounded-full bg-gradient-radial from-rose-500/20 via-rose-900/10 to-transparent blur-xl" />

                            {/* Outer dotted circle */}
                            <div className="absolute w-[260px] h-[260px] rounded-full border border-dashed border-white/10" />

                            {/* Main Sign Image (Center) - Cancer Crab */}
                            <div className="relative z-10 flex flex-col items-center">
                                <img
                                    src="/figma/asset/Cancer0 1.png"
                                    alt="Cancer"
                                    className="w-40 h-40 object-contain filter drop-shadow-[0_0_30px_rgba(244,63,94,0.4)]"
                                />
                            </div>

                            {/* Orbiting Trait Cards */}
                            {/* Sun - Top Left */}
                            <div className="absolute top-4 left-4 flex flex-col items-center gap-1 bg-white/5 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/10">
                                <Sun className="w-4 h-4 text-amber-400" />
                                <span className="text-[8px] font-medium uppercase tracking-wider text-white/50">{t('home.sun')}</span>
                                <span className="text-[10px] font-semibold text-white uppercase">{profile.sign}</span>
                            </div>

                            {/* Moon - Top Right */}
                            <div className="absolute top-4 right-4 flex flex-col items-center gap-1 bg-white/5 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/10">
                                <Moon className="w-4 h-4 text-violet-400" />
                                <span className="text-[8px] font-medium uppercase tracking-wider text-white/50">{t('home.moon')}</span>
                                <span className="text-[10px] font-semibold text-white uppercase">Aquarius</span>
                            </div>

                            {/* Ascendant - Bottom Left */}
                            <div className="absolute bottom-8 left-4 flex flex-col items-center gap-1 bg-white/5 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/10">
                                <ArrowUp className="w-4 h-4 text-rose-400" />
                                <span className="text-[8px] font-medium uppercase tracking-wider text-white/50">{t('home.ascendant')}</span>
                                <span className="text-[10px] font-semibold text-white uppercase">Pisces</span>
                            </div>

                            {/* Element - Bottom Right */}
                            <div className="absolute bottom-8 right-4 flex flex-col items-center gap-1 bg-white/5 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/10">
                                <Droplets className="w-4 h-4 text-cyan-400" />
                                <span className="text-[8px] font-medium uppercase tracking-wider text-white/50">{t('home.element')}</span>
                                <span className="text-[10px] font-semibold text-white uppercase">{t('home.water')}</span>
                            </div>

                            {/* Sign label at bottom */}
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                                <button
                                    onClick={() => setShowZodiacDetail(true)}
                                    className="flex items-center gap-1 hover:text-purple-400 transition-colors"
                                >
                                    <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/60">{profile.sign}</span>
                                    <Info className="w-3 h-3 text-white/40" />
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Personality Profile */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">
                            {profile.sign} Profile
                        </h3>
                        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
                            <p className="text-sm text-white/60 leading-relaxed italic">
                                "{zodiacData[profile.sign.charAt(0).toUpperCase() + profile.sign.slice(1) as keyof typeof zodiacData]}"
                            </p>
                        </div>
                    </section>

                    {/* Affirmation Card */}
                    <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 space-y-2 relative overflow-hidden border border-white/10">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-violet-500" />
                        <h3 className="text-[11px] font-semibold uppercase tracking-widest text-white/60">{t('home.affirmation')}</h3>
                        <p className="text-base font-medium leading-snug text-white/90">
                            {t('home.affirmationText')}
                        </p>
                    </section>

                    {/* Daily Forecast Scores */}
                    {!forecastLoading && (forecast.scores.love !== null || forecast.scores.career !== null) && (
                        <section className="space-y-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">
                                {t('home.dailyScores', 'Daily Energy Scores')}
                            </h3>
                            <div className="grid grid-cols-4 gap-2">
                                {[
                                    { key: 'love', icon: Heart, color: 'rose', score: forecast.scores.love },
                                    { key: 'career', icon: Briefcase, color: 'amber', score: forecast.scores.career },
                                    { key: 'emotion', icon: Smile, color: 'violet', score: forecast.scores.emotion },
                                    { key: 'energy', icon: Zap, color: 'cyan', score: forecast.scores.energy },
                                ].map(({ key, icon: Icon, color, score }) => (
                                    <div key={key} className="bg-white/5 backdrop-blur-sm p-3 rounded-xl border border-white/10 flex flex-col items-center gap-2">
                                        <Icon className={`w-4 h-4 text-${color}-400`} />
                                        <div className="flex gap-0.5">
                                            {[1, 2, 3, 4, 5].map((i) => (
                                                <div
                                                    key={i}
                                                    className={`w-1.5 h-4 rounded-full ${i <= (score || 0) ? `bg-${color}-400` : 'bg-white/20'}`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-[8px] uppercase tracking-wider text-white/50">
                                            {t(`home.scores.${key}`, key)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Daily Actions - Do & Avoid */}
                    {!forecastLoading && (doActions.length > 0 || avoidActions.length > 0) && (
                        <section className="space-y-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">
                                {t('home.dailyActions', 'Today\'s Guidance')}
                            </h3>
                            <div className="space-y-3">
                                {doActions.length > 0 && (
                                    <div className="bg-emerald-500/10 backdrop-blur-sm rounded-xl p-4 border border-emerald-500/20">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                            </div>
                                            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                                                {t('home.do')}
                                            </span>
                                        </div>
                                        <ul className="space-y-2">
                                            {doActions.map((action, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-sm text-white/70">
                                                    <span className="text-emerald-400 mt-0.5">•</span>
                                                    {action.content}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {avoidActions.length > 0 && (
                                    <div className="bg-rose-500/10 backdrop-blur-sm rounded-xl p-4 border border-rose-500/20">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-6 h-6 rounded-full bg-rose-500/20 flex items-center justify-center">
                                                <Ban className="w-3.5 h-3.5 text-rose-400" />
                                            </div>
                                            <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">
                                                {t('home.avoid', 'Avoid')}
                                            </span>
                                        </div>
                                        <ul className="space-y-2">
                                            {avoidActions.map((action, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-sm text-white/70">
                                                    <span className="text-rose-400 mt-0.5">•</span>
                                                    {action.content}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {/* Daily Horoscope */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-semibold text-white/90">{t('home.yourHoroscope')}</h3>
                        <p className="text-sm text-white/50 leading-relaxed">
                            {t('home.horoscopeText')}
                        </p>
                        <button className="text-[11px] text-violet-400 font-medium flex items-center gap-1">
                            {t('actions.readMore')} <ChevronRight className="w-3 h-3" />
                        </button>
                    </section>



                    {/* Monthly Energy */}
                    <MonthlyEnergy sign={profile.sign} />

                    {/* Daily Tips */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">
                            {t('home.dailyTips', { sign: profile.sign })}
                        </h3>
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                            <div className="min-w-[180px] bg-white/5 backdrop-blur-sm p-4 rounded-2xl space-y-3 border border-white/10">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-lg bg-rose-500/20 flex items-center justify-center">
                                        <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                                    </div>
                                    <span className="text-[11px] font-semibold text-white">{t('home.love')}</span>
                                </div>
                                <p className="text-[11px] text-white/50 leading-relaxed">
                                    {t('home.loveTip')}
                                </p>
                            </div>
                            <div className="min-w-[180px] bg-white/5 backdrop-blur-sm p-4 rounded-2xl space-y-3 border border-white/10">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center">
                                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                                    </div>
                                    <span className="text-[11px] font-semibold text-white">{t('home.warning')}</span>
                                </div>
                                <p className="text-[11px] text-white/50 leading-relaxed">
                                    {t('home.warningTip')}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Today's Matches */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-rose-400 italic">{t('home.todaysMatches')}</h3>
                        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                {dailyMatches.map((matchSign, idx) => (
                                    <div key={matchSign} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5">
                                        <div className={`w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-br ${idx === 0 ? 'from-rose-500/30 to-pink-500/30' : 'from-violet-500/30 to-indigo-500/30'}`}>
                                            <span className="text-2xl">
                                                {zodiacSymbols[matchSign]}
                                            </span>
                                        </div>
                                        <div className="text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <Sun className="w-2.5 h-2.5 text-amber-400" />
                                                <span className="text-[10px] font-semibold text-white capitalize">{matchSign}</span>
                                            </div>
                                            <div className="flex items-center justify-center gap-1">
                                                <Button
                                                    variant="link"
                                                    className="h-auto p-0 text-[9px] text-white/40 uppercase hover:text-white/60"
                                                    onClick={() => setSelectedMatch(matchSign)}
                                                >
                                                    {t('actions.viewCompatibility')}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-center">
                                <Button
                                    size="sm"
                                    className="rounded-full bg-rose-600 hover:bg-rose-700 font-semibold uppercase tracking-wider text-[10px] px-6 h-8"
                                    onClick={() => setSelectedMatch(dailyMatches[0])}
                                >
                                    Read More
                                </Button>
                            </div>
                        </div>
                    </section>

                    {/* Lunar Calendar */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">{t('home.lunarCalendar')}</h3>
                        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 rounded-full overflow-hidden">
                                    <img
                                        src="/figma/asset/Ellipse 9.png"
                                        alt="Moon Phase"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-lg font-semibold text-white">{currentMoonPhase}</h4>
                                    <p className="text-[10px] uppercase tracking-wider text-white/50">{moonPhaseRange}</p>
                                    <div className="flex items-center gap-1 pt-1">
                                        <Moon className="w-3 h-3 text-rose-400" />
                                        <span className="text-[10px] text-rose-400 capitalize">{t('home.moonIn', { sign: currentMoonSign })}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Moon Phase Timeline */}
                            <div className="flex justify-between items-center py-3 border-y border-white/10">
                                {moonPhaseDates.map((phase, i) => (
                                    <div key={i} className="flex flex-col items-center gap-2">
                                        <div className={`w-8 h-8 rounded-full ${phase.isToday ? 'bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]' : 'bg-gradient-to-r from-white/80 to-transparent'}`} />
                                        <span className="text-[8px] uppercase tracking-wider text-white/40">{phase.dateStr}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Do / Don't */}
                            <div className="space-y-3">
                                <div className="flex gap-3 items-start bg-violet-500/10 p-3 rounded-xl">
                                    <span className="text-[10px] font-semibold text-violet-400">{t('home.do')}</span>
                                    <p className="text-[11px] text-white/60 leading-relaxed">
                                        {t('home.doAdvice')}
                                    </p>
                                </div>
                                <div className="flex gap-3 items-start bg-rose-500/10 p-3 rounded-xl">
                                    <span className="text-[10px] font-semibold text-rose-400">{t('home.dont')}</span>
                                    <p className="text-[11px] text-white/60 leading-relaxed">
                                        {t('home.dontAdvice')}
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <Button variant="outline" size="sm" className="rounded-full border-white/20 bg-transparent hover:bg-white/10 font-semibold uppercase tracking-wider text-[10px] px-6 h-8">
                                    Read More
                                </Button>
                            </div>
                        </div>
                    </section>

                    {/* Today's Features */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">{t('home.todaysFeatures')}</h3>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl flex flex-col items-center justify-center gap-3 h-32 border border-white/10">
                                <span className="text-3xl font-bold text-white">29</span>
                                <span className="text-[8px] uppercase tracking-wider text-white/40">{t('home.luckyNumber')}</span>
                            </div>
                            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl flex flex-col items-center justify-center gap-3 h-32 border border-white/10 relative overflow-hidden">
                                <img
                                    src="/figma/asset/Ellipse 9.png"
                                    alt="Lucky Color"
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <span className="text-[8px] uppercase tracking-wider text-white/40">{t('home.luckyColor')}</span>
                            </div>
                            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl flex flex-col items-center justify-center gap-3 h-32 border border-white/10">
                                <div className="text-center">
                                    <p className="text-xs font-medium text-white">7:20 am</p>
                                    <p className="text-xs font-medium text-white">9:42 pm</p>
                                </div>
                                <span className="text-[8px] uppercase tracking-wider text-white/40">{t('home.luckyTime')}</span>
                            </div>
                        </div>
                    </section>

                    {/* Floating Action Button for Swipe */}
                    {onNavigateToSwipe && (
                        <div className="fixed bottom-20 right-4 z-50">
                            <Button
                                className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 shadow-lg shadow-violet-500/20 p-0 hover:scale-110 active:scale-95 transition-all"
                                onClick={onNavigateToSwipe}
                            >
                                <Sparkles className="w-6 h-6 text-white" />
                            </Button>
                        </div>
                    )}
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
                                className="absolute top-4 right-4 text-white/40 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-rose-500/20 flex items-center justify-center text-2xl">
                                    ❤️
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-white uppercase tracking-wider">
                                        {profile.sign} + {selectedMatch}
                                    </h2>
                                    <p className="text-[10px] text-white/40 uppercase tracking-widest">{t('home.loveMatch')}</p>
                                </div>
                            </div>
                            <p className="text-white/70 text-sm leading-relaxed italic">
                                "{getCompatibilityText(profile.sign, selectedMatch, loveData)}"
                            </p>
                        </div>
                        <div className="p-4 bg-white/5 border-t border-white/5 flex justify-center">
                            <Button
                                variant="ghost"
                                className="text-xs uppercase tracking-widest text-white/60 hover:text-white hover:bg-transparent"
                                onClick={() => setSelectedMatch(null)}
                            >
                                {t('actions.close')}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
