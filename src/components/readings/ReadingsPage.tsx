import type { UserProfile } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ReadingsPageProps {
    profile: UserProfile;
    onNavigate: (view: string) => void;
}

export function ReadingsPage({ onNavigate }: ReadingsPageProps) {
    return (
        <div className="flex flex-col h-full bg-black text-foreground overflow-hidden">
            <header className="p-4 pt-6">
                <h1 className="text-xl font-light tracking-[0.2em] uppercase text-white/90">Readings</h1>
            </header>

            <ScrollArea className="flex-1 px-4 py-4">
                <div className="space-y-4 max-w-md mx-auto pb-20">
                    {/* Palm Reading Card */}
                    <button
                        onClick={() => onNavigate('palm')}
                        className="w-full text-left rounded-2xl p-5 transition-all active:scale-[0.98] relative overflow-hidden group bg-[#0a0a1a] border border-indigo-500/30 hover:border-indigo-400/50"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-purple-900/10" />
                        
                        <div className="relative">
                            {/* Palm Icon */}
                            <div className="mb-4">
                                <svg width="80" height="100" viewBox="0 0 80 100" fill="none" className="opacity-80">
                                    <path d="M40 10 L40 35 M25 15 L25 40 M55 15 L55 40 M15 25 L15 50 M65 25 L65 50" 
                                          stroke="url(#palmGradient)" strokeWidth="3" strokeLinecap="round"/>
                                    <ellipse cx="40" cy="65" rx="30" ry="25" stroke="url(#palmGradient)" strokeWidth="2" fill="none"/>
                                    <circle cx="30" cy="60" r="3" fill="#8b5cf6" opacity="0.5"/>
                                    <circle cx="40" cy="55" r="3" fill="#8b5cf6" opacity="0.5"/>
                                    <circle cx="50" cy="60" r="3" fill="#8b5cf6" opacity="0.5"/>
                                    <path d="M25 70 Q40 80 55 70" stroke="#8b5cf6" strokeWidth="1" fill="none" opacity="0.5"/>
                                    <defs>
                                        <linearGradient id="palmGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#a78bfa"/>
                                            <stop offset="100%" stopColor="#6366f1"/>
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                            
                            <h2 className="text-lg font-semibold text-white mb-1">Palm Reading</h2>
                            <p className="text-sm text-white/50">Read your palm to know your fortune</p>
                        </div>
                    </button>

                    {/* Birth Chart Reading Card */}
                    <button
                        onClick={() => onNavigate('birth-chart')}
                        className="w-full text-left rounded-2xl p-5 transition-all active:scale-[0.98] relative overflow-hidden group bg-[#0a0a1a] border border-indigo-500/30 hover:border-indigo-400/50"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-purple-900/10" />
                        
                        <div className="relative">
                            {/* Zodiac Icons Grid */}
                            <div className="mb-4 grid grid-cols-2 gap-2 w-fit">
                                {/* Sagittarius */}
                                <div className="w-10 h-10 rounded-full bg-indigo-900/50 border border-indigo-500/40 flex items-center justify-center">
                                    <span className="text-indigo-300 text-lg">♐</span>
                                </div>
                                {/* Libra */}
                                <div className="w-10 h-10 rounded-full bg-indigo-900/50 border border-indigo-500/40 flex items-center justify-center">
                                    <span className="text-indigo-300 text-lg">♎</span>
                                </div>
                                {/* Aquarius */}
                                <div className="w-10 h-10 rounded-full bg-indigo-900/50 border border-indigo-500/40 flex items-center justify-center">
                                    <span className="text-indigo-300 text-lg">♒</span>
                                </div>
                                {/* Virgo */}
                                <div className="w-10 h-10 rounded-full bg-indigo-900/50 border border-indigo-500/40 flex items-center justify-center">
                                    <span className="text-indigo-300 text-lg">♍</span>
                                </div>
                            </div>
                            
                            <h2 className="text-lg font-semibold text-white mb-1">Birth Chart Reading</h2>
                            <p className="text-sm text-white/50">Learn more about your birth-chart</p>
                        </div>
                    </button>

                    {/* Tarot Card Reading */}
                    <button
                        onClick={() => onNavigate('tarot')}
                        className="w-full text-left rounded-2xl p-5 transition-all active:scale-[0.98] relative overflow-hidden group bg-[#0a0a1a] border border-indigo-500/30 hover:border-indigo-400/50"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-purple-900/10" />
                        
                        <div className="relative">
                            {/* Tarot Cards Stack */}
                            <div className="mb-4 relative h-24 w-24">
                                <div className="absolute left-0 top-2 w-14 h-20 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-700 border border-indigo-400/50 transform -rotate-12 shadow-lg">
                                    <div className="w-full h-full flex items-center justify-center">
                                        <div className="w-8 h-8 rounded-full border border-indigo-300/50 flex items-center justify-center">
                                            <span className="text-indigo-200 text-xs">✧</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute left-4 top-1 w-14 h-20 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 border border-indigo-400/50 transform rotate-0 shadow-lg">
                                    <div className="w-full h-full flex items-center justify-center">
                                        <div className="w-8 h-8 rounded-full border border-indigo-300/50 flex items-center justify-center">
                                            <span className="text-indigo-200 text-xs">☽</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute left-8 top-0 w-14 h-20 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-500 border border-indigo-300/50 transform rotate-12 shadow-lg">
                                    <div className="w-full h-full flex items-center justify-center">
                                        <div className="w-8 h-8 rounded-full border border-indigo-200/50 flex items-center justify-center">
                                            <span className="text-indigo-100 text-xs">⚶</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <h2 className="text-lg font-semibold text-white mb-1">Tarot Card Reading</h2>
                            <p className="text-sm text-white/50">Learn more about your birth-chart</p>
                        </div>
                    </button>
                </div>
            </ScrollArea>
        </div>
    );
}
