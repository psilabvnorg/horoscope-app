import { useState } from 'react';
import { ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface BirthChartReadingProps {
    onBack: () => void;
}

type TabType = 'daily' | 'weekly' | 'year';

interface TransitCard {
    id: string;
    planet1: string;
    aspect: string;
    planet2: string;
    planet1Color: string;
    planet2Color: string;
    description: string;
    image1: string;
    image2: string;
}

const shortTermTransits: TransitCard[] = [
    {
        id: '1',
        planet1: 'Sun',
        aspect: 'Trine',
        planet2: 'Your Jupiter',
        planet1Color: '#f59e0b',
        planet2Color: '#f59e0b',
        description: 'During this Sun trine your natal Jupiter transit, expect an abundance of opportunities and...',
        image1: 'sun',
        image2: 'jupiter',
    },
    {
        id: '2',
        planet1: 'Moon',
        aspect: 'Square',
        planet2: 'Your Mercury',
        planet1Color: '#94a3b8',
        planet2Color: '#f59e0b',
        description: 'When the Moon squares your natal Mercury, you may find a conflict between your emotions and...',
        image1: 'moon',
        image2: 'mercury',
    },
    {
        id: '3',
        planet1: 'Mercury',
        aspect: 'Conjunction',
        planet2: 'Your Moon',
        planet1Color: '#f59e0b',
        planet2Color: '#94a3b8',
        description: 'With Mercury in the planet of communication, in conjunction with your natal Moon, you can...',
        image1: 'mercury',
        image2: 'moon',
    },
];

const longTermTransits: TransitCard[] = [
    {
        id: '4',
        planet1: 'Mercury',
        aspect: 'Sextile',
        planet2: 'Your Mercury',
        planet1Color: '#f59e0b',
        planet2Color: '#f59e0b',
        description: 'With Mercury, the planet of communication, in conjunction with your natal Moon, you can...',
        image1: 'mercury',
        image2: 'mercury',
    },
    {
        id: '5',
        planet1: 'Mars',
        aspect: 'Sextile',
        planet2: 'Your Sun',
        planet1Color: '#ef4444',
        planet2Color: '#f59e0b',
        description: 'With Mercury, the planet of communication, in conjunction with your natal Moon, you can...',
        image1: 'mars',
        image2: 'sun',
    },
    {
        id: '6',
        planet1: 'Mars',
        aspect: 'Trine',
        planet2: 'Your Moon',
        planet1Color: '#ef4444',
        planet2Color: '#94a3b8',
        description: 'With Mercury, the planet of communication, in conjunction with your natal Moon, you can...',
        image1: 'mars',
        image2: 'moon',
    },
];

// Generate dates for the date picker
const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = -3; i <= 3; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push({
            day: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
            date: date.getDate(),
            isToday: i === 0,
        });
    }
    return dates;
};

export function BirthChartReading({ onBack }: BirthChartReadingProps) {
    const [activeTab, setActiveTab] = useState<TabType>('daily');
    const [selectedDate, setSelectedDate] = useState(3); // Index of today
    const [isExpanded, setIsExpanded] = useState(false);
    const dates = generateDates();

    const renderPlanetImage = (planet: string, size: number = 60) => {
        const planetStyles: Record<string, { gradient: string; rings?: boolean; spots?: boolean }> = {
            sun: { gradient: 'from-yellow-400 via-orange-500 to-red-600', spots: true },
            jupiter: { gradient: 'from-amber-300 via-orange-400 to-amber-600', spots: true },
            moon: { gradient: 'from-gray-300 via-gray-400 to-gray-500' },
            mercury: { gradient: 'from-amber-400 via-orange-500 to-red-500' },
            mars: { gradient: 'from-red-500 via-red-600 to-red-800' },
        };

        const style = planetStyles[planet] || planetStyles.sun;

        return (
            <div className="relative" style={{ width: size, height: size }}>
                <div
                    className={`w-full h-full rounded-full bg-gradient-to-br ${style.gradient} shadow-lg`}
                    style={{
                        boxShadow: `0 0 ${size / 3}px ${size / 6}px rgba(251, 191, 36, 0.2)`,
                    }}
                >
                    {style.spots && (
                        <>
                            <div className="absolute top-1/4 left-1/3 w-2 h-1 bg-black/20 rounded-full" />
                            <div className="absolute top-1/2 right-1/4 w-3 h-1.5 bg-black/15 rounded-full" />
                        </>
                    )}
                </div>
            </div>
        );
    };

    const TransitCardComponent = ({ transit }: { transit: TransitCard }) => (
        <div className="rounded-2xl overflow-hidden bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1a] border border-white/10 mb-4">
            {/* Planet images */}
            <div className="relative h-32 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />
                <div className="flex items-center gap-4 relative z-10">
                    {renderPlanetImage(transit.image1, 70)}
                    {renderPlanetImage(transit.image2, 70)}
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-amber-400 font-medium">{transit.planet1} {transit.aspect}</span>
                    <span className="text-amber-400 font-medium">{transit.planet2}</span>
                </div>
                <p className="text-white/60 text-sm leading-relaxed mb-3">
                    {transit.description}
                </p>
                <button className="text-amber-400 text-sm flex items-center gap-1 hover:text-amber-300 transition-colors">
                    + Read more
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-[#050510] text-white overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 pt-6">
                <button
                    onClick={onBack}
                    className="flex items-center gap-1 text-violet-400 hover:text-violet-300 transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <h1 className="text-sm font-semibold tracking-[0.15em] uppercase">Birth Chart</h1>
                <div className="w-10" />
            </div>

            {/* Tabs */}
            <div className="flex justify-center gap-2 px-4 mb-4">
                {(['daily', 'weekly', 'year'] as TabType[]).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider transition-all ${
                            activeTab === tab
                                ? 'bg-violet-500/30 text-violet-300 border border-violet-500/50'
                                : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10'
                        }`}
                    >
                        {tab === 'year' ? 'Year Chart' : tab}
                    </button>
                ))}
            </div>

            {/* Date Picker */}
            <div className="flex justify-center gap-2 px-4 mb-4">
                {dates.map((d, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedDate(index)}
                        className={`flex flex-col items-center px-3 py-2 rounded-xl transition-all ${
                            selectedDate === index
                                ? 'bg-violet-500/30 border border-violet-500/50'
                                : 'bg-white/5 border border-white/10 hover:bg-white/10'
                        }`}
                    >
                        <span className="text-[10px] text-white/50 uppercase">{d.day}</span>
                        <span className={`text-sm font-medium ${selectedDate === index ? 'text-violet-300' : 'text-white/70'}`}>
                            {d.date}
                        </span>
                    </button>
                ))}
            </div>

            <ScrollArea className="flex-1 px-4">
                {/* Why should you care section */}
                <div className="mb-6">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10"
                    >
                        <span className="text-white/70 text-sm">Why should you care about</span>
                        {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-white/50" />
                        ) : (
                            <ChevronDown className="w-4 h-4 text-white/50" />
                        )}
                    </button>
                    {isExpanded && (
                        <div className="mt-2 p-4 rounded-xl bg-white/5 border border-white/10">
                            <p className="text-white/60 text-sm leading-relaxed">
                                Transits reveal how current planetary movements interact with your birth chart, 
                                offering insights into opportunities, challenges, and personal growth periods. 
                                Understanding these cosmic influences helps you navigate life with greater awareness.
                            </p>
                        </div>
                    )}
                </div>

                {/* Short Term Transits */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold tracking-wider uppercase text-white/90 mb-4">
                        Your Short Term Transits
                    </h2>
                    {shortTermTransits.map((transit) => (
                        <TransitCardComponent key={transit.id} transit={transit} />
                    ))}
                </div>

                {/* Long Term Transits */}
                <div className="pb-24">
                    <h2 className="text-lg font-semibold tracking-wider uppercase text-white/90 mb-4">
                        Your Long Term Transits
                    </h2>
                    {longTermTransits.map((transit) => (
                        <TransitCardComponent key={transit.id} transit={transit} />
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
