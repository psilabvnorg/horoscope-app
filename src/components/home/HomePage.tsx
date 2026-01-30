import { useState } from 'react';
import type { UserProfile } from '@/types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Sparkles,
    Moon,
    Heart,
    Menu,
    ChevronRight,
    Sun,
    ArrowUp,
    Droplets,
    AlertTriangle
} from 'lucide-react';

interface HomePageProps {
    profile: UserProfile;
    onNavigateToSwipe?: () => void;
}

type TimeRange = 'today' | 'tomorrow' | 'week' | 'month';

export function HomePage({ profile, onNavigateToSwipe }: HomePageProps) {
    const [timeRange, setTimeRange] = useState<TimeRange>('today');

    return (
        <div className="flex flex-col h-full bg-[#0a0a0f] text-foreground overflow-hidden">
            {/* Top Header */}
            <header className="p-4 flex justify-between items-center">
                <h1 className="text-lg font-bold tracking-[0.2em] uppercase">Horoscope</h1>
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
                            {range}
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
                                You • {profile.birthday}
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
                                <span className="text-[8px] font-medium uppercase tracking-wider text-white/50">Sun</span>
                                <span className="text-[10px] font-semibold text-white uppercase">{profile.sign}</span>
                            </div>

                            {/* Moon - Top Right */}
                            <div className="absolute top-4 right-4 flex flex-col items-center gap-1 bg-white/5 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/10">
                                <Moon className="w-4 h-4 text-violet-400" />
                                <span className="text-[8px] font-medium uppercase tracking-wider text-white/50">Moon</span>
                                <span className="text-[10px] font-semibold text-white uppercase">Aquarius</span>
                            </div>

                            {/* Ascendant - Bottom Left */}
                            <div className="absolute bottom-8 left-4 flex flex-col items-center gap-1 bg-white/5 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/10">
                                <ArrowUp className="w-4 h-4 text-rose-400" />
                                <span className="text-[8px] font-medium uppercase tracking-wider text-white/50">Ascendant</span>
                                <span className="text-[10px] font-semibold text-white uppercase">Pisces</span>
                            </div>

                            {/* Element - Bottom Right */}
                            <div className="absolute bottom-8 right-4 flex flex-col items-center gap-1 bg-white/5 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/10">
                                <Droplets className="w-4 h-4 text-cyan-400" />
                                <span className="text-[8px] font-medium uppercase tracking-wider text-white/50">Element</span>
                                <span className="text-[10px] font-semibold text-white uppercase">Water</span>
                            </div>

                            {/* Sign label at bottom */}
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                                <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/60">{profile.sign}</span>
                            </div>
                        </div>
                    </section>

                    {/* Affirmation Card */}
                    <section className="bg-white rounded-2xl p-5 space-y-2 relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-violet-500" />
                        <h3 className="text-[11px] font-semibold uppercase tracking-widest text-black/60">Affirmation</h3>
                        <p className="text-base font-medium leading-snug text-black/90">
                            I can be a masterpiece and a work in progress at the same time.
                        </p>
                    </section>

                    {/* Daily Horoscope */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-semibold text-white/90">Your today's horoscope</h3>
                        <p className="text-sm text-white/50 leading-relaxed">
                            Today, you can see how your daily routine has changed your life. Your physical and mental health is directly related to your personal transformation. Making sure that you are taken care of - body and mind - should be part of your schedule. That is just...
                        </p>
                        <button className="text-[11px] text-violet-400 font-medium flex items-center gap-1">
                            Read more <ChevronRight className="w-3 h-3" />
                        </button>
                    </section>

                    {/* Daily Tips */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">
                            Daily tips for <span className="text-violet-400">{profile.sign}</span>
                        </h3>
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                            <div className="min-w-[180px] bg-white/5 backdrop-blur-sm p-4 rounded-2xl space-y-3 border border-white/10">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-lg bg-rose-500/20 flex items-center justify-center">
                                        <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                                    </div>
                                    <span className="text-[11px] font-semibold text-white">Love</span>
                                </div>
                                <p className="text-[11px] text-white/50 leading-relaxed">
                                    Remember, the brain is higher than the heart. Don't let your emotions cloud your judgement.
                                </p>
                            </div>
                            <div className="min-w-[180px] bg-white/5 backdrop-blur-sm p-4 rounded-2xl space-y-3 border border-white/10">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center">
                                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                                    </div>
                                    <span className="text-[11px] font-semibold text-white">Warning</span>
                                </div>
                                <p className="text-[11px] text-white/50 leading-relaxed">
                                    Before trusting people with all your heart, know who they are.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Today's Matches */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-rose-400 italic">Today's Matches</h3>
                        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-500/30 to-pink-500/30 flex items-center justify-center">
                                        <span className="text-2xl">😊</span>
                                    </div>
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <Sun className="w-2.5 h-2.5 text-amber-400" />
                                            <span className="text-[10px] font-semibold text-white">Leo</span>
                                        </div>
                                        <div className="flex items-center justify-center gap-1">
                                            <Moon className="w-2.5 h-2.5 text-violet-400" />
                                            <span className="text-[9px] text-white/40 uppercase">Cancer</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500/30 to-indigo-500/30 flex items-center justify-center">
                                        <span className="text-2xl">🥸</span>
                                    </div>
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <Sun className="w-2.5 h-2.5 text-amber-400" />
                                            <span className="text-[10px] font-semibold text-white">Pisces</span>
                                        </div>
                                        <div className="flex items-center justify-center gap-1">
                                            <Moon className="w-2.5 h-2.5 text-violet-400" />
                                            <span className="text-[9px] text-white/40 uppercase">Gemini</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <Button size="sm" className="rounded-full bg-rose-600 hover:bg-rose-700 font-semibold uppercase tracking-wider text-[10px] px-6 h-8">
                                    Read More
                                </Button>
                            </div>
                        </div>
                    </section>

                    {/* Lunar Calendar */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">Lunar Calendar</h3>
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
                                    <h4 className="text-lg font-semibold">Waxing Gibbous</h4>
                                    <p className="text-[10px] uppercase tracking-wider text-white/50">Sept 5 - Sept 24</p>
                                    <div className="flex items-center gap-1 pt-1">
                                        <Moon className="w-3 h-3 text-rose-400" />
                                        <span className="text-[10px] text-rose-400">Moon in Aquarius</span>
                                    </div>
                                </div>
                            </div>

                            {/* Moon Phase Timeline */}
                            <div className="flex justify-between items-center py-3 border-y border-white/10">
                                {['Sept 5', 'Sept 11', 'Sept 14', 'Sept 25'].map((date, i) => (
                                    <div key={i} className="flex flex-col items-center gap-2">
                                        <div className={`w-8 h-8 rounded-full ${i === 2 ? 'bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]' : 'bg-gradient-to-r from-white/80 to-transparent'}`} />
                                        <span className="text-[8px] uppercase tracking-wider text-white/40">{date}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Do / Don't */}
                            <div className="space-y-3">
                                <div className="flex gap-3 items-start bg-violet-500/10 p-3 rounded-xl">
                                    <span className="text-[10px] font-semibold text-violet-400">Do</span>
                                    <p className="text-[11px] text-white/60 leading-relaxed">
                                        A good time to change your image. All the most daring ideas will be successful.
                                    </p>
                                </div>
                                <div className="flex gap-3 items-start bg-rose-500/10 p-3 rounded-xl">
                                    <span className="text-[10px] font-semibold text-rose-400">Don't</span>
                                    <p className="text-[11px] text-white/60 leading-relaxed">
                                        Most likely, money with the moon in Aquarius will be wasted. Prudence in finance is not your strong point.
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
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">Today's features</h3>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl flex flex-col items-center justify-center gap-3 h-32 border border-white/10">
                                <span className="text-3xl font-bold text-white">29</span>
                                <span className="text-[8px] uppercase tracking-wider text-white/40">Lucky number</span>
                            </div>
                            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl flex flex-col items-center justify-center gap-3 h-32 border border-white/10 relative overflow-hidden">
                                <img 
                                    src="/figma/asset/Ellipse 9.png" 
                                    alt="Lucky Color" 
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <span className="text-[8px] uppercase tracking-wider text-white/40">Lucky color</span>
                            </div>
                            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl flex flex-col items-center justify-center gap-3 h-32 border border-white/10">
                                <div className="text-center">
                                    <p className="text-xs font-medium text-white">7:20 am</p>
                                    <p className="text-xs font-medium text-white">9:42 pm</p>
                                </div>
                                <span className="text-[8px] uppercase tracking-wider text-white/40">Lucky time</span>
                            </div>
                        </div>
                    </section>

                    {/* Floating Action Button for Swipe */}
                    <div className="fixed bottom-20 right-4 z-50">
                        <Button
                            className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 shadow-lg shadow-violet-500/20 p-0 hover:scale-110 active:scale-95 transition-all"
                            onClick={onNavigateToSwipe}
                        >
                            <Sparkles className="w-6 h-6 text-white" />
                        </Button>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}
