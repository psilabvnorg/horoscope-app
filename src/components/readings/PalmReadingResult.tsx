import { ChevronLeft, Moon, Heart, Activity, Briefcase } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PalmReadingResultProps {
    onBack: () => void;
}

export function PalmReadingResult({ onBack }: PalmReadingResultProps) {
    const getCurrentDate = () => {
        const date = new Date();
        return date.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
        });
    };

    const readings = [
        {
            icon: Moon,
            title: 'YOUR DAY',
            subtitle: getCurrentDate(),
            progress: null,
            progressLabel: null,
            content: `Don't be afraid to take a leap of faith and follow your heart today. Sometimes the best decisions are the ones that scare us a little. Trust your instincts and don't be afraid to take risks.

Even if you don't get the results you want right away, you will learn valuable lessons that will help you in the future. Don't be discouraged if things don't go as planned. Keep pushing forward and you will eventually reach your goals.`
        },
        {
            icon: Heart,
            title: 'LOVE',
            subtitle: null,
            progress: 92,
            progressLabel: '92% success',
            content: `This is a great day to express your feelings to someone special. If you've been holding back, now is the time to let them know how you feel. Your charm and charisma are at an all-time high today.

Continue to be open and honest with your partner. Communication is key to a healthy relationship. If you're single, don't be afraid to put yourself out there. You never know who you might meet.`
        },
        {
            icon: Activity,
            title: 'HEALTH',
            subtitle: null,
            progress: 88,
            progressLabel: '88% success',
            content: `Your energy levels are high today, making it a great time to start a new exercise routine or try a new healthy recipe. Listen to your body and give it what it needs.

Take time to rest and recharge when needed. Don't push yourself too hard. Balance is key to maintaining good health. Consider meditation or yoga to help reduce stress and improve mental clarity.`
        },
        {
            icon: Briefcase,
            title: 'LIFE / CAREER',
            subtitle: null,
            progress: 90,
            progressLabel: '90% success',
            content: `Your hard work is about to pay off. Stay focused on your goals and don't let distractions get in the way. This is a great time to take on new challenges and showcase your skills.

New opportunities may arise today. Be open to change and don't be afraid to step outside your comfort zone. Your dedication and perseverance will lead to success.`
        }
    ];

    return (
        <div className="flex flex-col h-full bg-[#050510] text-white overflow-hidden">
            {/* Header */}
            <header className="flex items-center justify-between px-4 py-4">
                <button
                    onClick={onBack}
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
                >
                    <ChevronLeft className="w-4 h-4 text-white" />
                </button>
                
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium tracking-[0.15em] uppercase">Palm Reading</span>
                </div>
                
                {/* Hand icon */}
                <div className="w-10 h-12">
                    <svg viewBox="0 0 40 48" fill="none" className="w-full h-full">
                        <path d="M12 32 Q10 24 12 16 L14 10 Q15 8 17 9 L18 18 
                                 L19 7 Q20 5 22 6 L23 18
                                 L24 6 Q25 4 27 5 L28 18
                                 L29 8 Q31 6 32 8 L30 18 Q32 24 30 32
                                 Q28 38 20 40 Q12 38 12 32Z" 
                              fill="none" stroke="#a78bfa" strokeWidth="1.5"/>
                        <path d="M14 22 Q20 20 26 23" stroke="#a78bfa" strokeWidth="0.5" opacity="0.6"/>
                        <path d="M14 26 Q20 24 26 26" stroke="#a78bfa" strokeWidth="0.5" opacity="0.6"/>
                    </svg>
                </div>
            </header>

            {/* Tabs */}
            <div className="flex mx-4 mb-4">
                <button className="flex-1 py-2 text-xs tracking-widest text-white border-b border-violet-500">
                    Today's Result
                </button>
                <button className="flex-1 py-2 text-xs tracking-widest text-white/40 border-b border-white/10">
                    History
                </button>
            </div>

            <ScrollArea className="flex-1">
                <div className="px-4 space-y-4 pb-32">
                    {readings.map((reading, index) => (
                        <div
                            key={index}
                            className="rounded-2xl border border-violet-500/40 bg-[#0a0a18] p-5 space-y-4"
                        >
                            {/* Icon */}
                            <div className="flex justify-center">
                                <div className="w-12 h-12 rounded-full border border-violet-500/30 flex items-center justify-center">
                                    <reading.icon className="w-5 h-5 text-violet-400" />
                                </div>
                            </div>

                            {/* Title */}
                            <div className="text-center">
                                <h2 className="text-base font-medium tracking-[0.2em] uppercase text-white">{reading.title}</h2>
                                {reading.subtitle && (
                                    <p className="text-xs text-white/40 mt-1">{reading.subtitle}</p>
                                )}
                            </div>

                            {/* Progress bar */}
                            {reading.progress && (
                                <div className="space-y-2">
                                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-gradient-to-r from-violet-600 to-violet-400 rounded-full"
                                            style={{ width: `${reading.progress}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-violet-400 text-center">{reading.progressLabel}</p>
                                </div>
                            )}

                            {/* Content */}
                            <p className="text-xs text-white/60 leading-relaxed whitespace-pre-line">
                                {reading.content}
                            </p>
                        </div>
                    ))}
                </div>
            </ScrollArea>

            {/* Back to Home button */}
            <div className="absolute bottom-24 left-4 right-4">
                <button
                    onClick={onBack}
                    className="w-full py-3.5 rounded-full border border-violet-500/50 bg-violet-600/20 text-white font-medium text-sm uppercase tracking-widest hover:bg-violet-600/30 transition-colors"
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
}
