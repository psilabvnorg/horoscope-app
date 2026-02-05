import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { ZodiacSign } from '@/types';
import { useZodiacCalendarData } from '@/hooks/useTranslatedData';

interface BirthChartReadingProps {
    onBack: () => void;
    userSign?: ZodiacSign;
}

type TabType = 'daily' | 'weekly' | 'year';

interface TransitCard {
    id: string;
    planet1Key: string;
    aspectKey: string;
    planet2Key: string;
    planet1Color: string;
    planet2Color: string;
    descriptionKey: string;
    image1: string;
    image2: string;
}

interface MonthEnergy {
    month: string;
    status: 'aligned' | 'compatible' | 'challenging';
    description: string;
    element: string;
    sign: string;
}

const shortTermTransits: TransitCard[] = [
    {
        id: '1',
        planet1Key: 'sun',
        aspectKey: 'trine',
        planet2Key: 'yourJupiter',
        planet1Color: '#f59e0b',
        planet2Color: '#f59e0b',
        descriptionKey: 'birthChart.transits.short1',
        image1: 'sun',
        image2: 'jupiter',
    },
    {
        id: '2',
        planet1Key: 'moon',
        aspectKey: 'square',
        planet2Key: 'yourMercury',
        planet1Color: '#94a3b8',
        planet2Color: '#f59e0b',
        descriptionKey: 'birthChart.transits.short2',
        image1: 'moon',
        image2: 'mercury',
    },
    {
        id: '3',
        planet1Key: 'mercury',
        aspectKey: 'conjunction',
        planet2Key: 'yourMoon',
        planet1Color: '#f59e0b',
        planet2Color: '#94a3b8',
        descriptionKey: 'birthChart.transits.short3',
        image1: 'mercury',
        image2: 'moon',
    },
];

const longTermTransits: TransitCard[] = [
    {
        id: '4',
        planet1Key: 'mercury',
        aspectKey: 'sextile',
        planet2Key: 'yourMercury',
        planet1Color: '#f59e0b',
        planet2Color: '#f59e0b',
        descriptionKey: 'birthChart.transits.long1',
        image1: 'mercury',
        image2: 'mercury',
    },
    {
        id: '5',
        planet1Key: 'mars',
        aspectKey: 'sextile',
        planet2Key: 'yourSun',
        planet1Color: '#ef4444',
        planet2Color: '#f59e0b',
        descriptionKey: 'birthChart.transits.long2',
        image1: 'mars',
        image2: 'sun',
    },
    {
        id: '6',
        planet1Key: 'mars',
        aspectKey: 'trine',
        planet2Key: 'yourMoon',
        planet1Color: '#ef4444',
        planet2Color: '#94a3b8',
        descriptionKey: 'birthChart.transits.long3',
        image1: 'mars',
        image2: 'moon',
    },
];

// Generate dates for the date picker
const generateDates = (locale: string) => {
    const dates = [];
    const today = new Date();
    for (let i = -3; i <= 3; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push({
            day: date.toLocaleDateString(locale, { weekday: 'short' }).toUpperCase(),
            date: date.getDate(),
            isToday: i === 0,
        });
    }
    return dates;
};

// Parse zodiac calendar data
const parseZodiacCalendar = (sign: string, locale: string, zodiacCalendar: Record<string, Record<string, string>>): MonthEnergy[] => {
    const signData = zodiacCalendar[sign];
    if (!signData) return [];

    const dataMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthFormatter = new Intl.DateTimeFormat(locale, { month: 'short' });
    
    return dataMonths.map((month, index) => {
        const data = signData[month];
        if (!data) return { month: monthFormatter.format(new Date(2020, index, 1)), status: 'compatible' as const, description: '', element: '', sign: '' };
        const parts = data.split(' – ');
        const status = parts[0] as 'aligned' | 'compatible' | 'challenging';
        const rest = parts[1] || '';
        
        // Extract element and sign from parentheses
        const elementMatch = rest.match(/\(([^)]+)\)/);
        const element = elementMatch ? elementMatch[1] : '';
        const description = rest.replace(/\([^)]+\)\s*/, '');
        
        return {
            month: monthFormatter.format(new Date(2020, index, 1)),
            status,
            description,
            element,
            sign: element
        };
    });
};

export function BirthChartReading({ onBack, userSign = 'aries' }: BirthChartReadingProps) {
    const { t, i18n } = useTranslation();
    const zodiacCalendar = useZodiacCalendarData();
    const [activeTab, setActiveTab] = useState<TabType>('year');
    const [selectedDate, setSelectedDate] = useState(3); // Index of today
    const [isExpanded, setIsExpanded] = useState(false);
    const dates = generateDates(i18n.language);
    const capitalizedSign = userSign.charAt(0).toUpperCase() + userSign.slice(1);
    const yearEnergyData = parseZodiacCalendar(capitalizedSign, i18n.language, zodiacCalendar);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'aligned':
                return { bg: 'bg-green-500/20', border: 'border-green-500/40', text: 'text-green-400' };
            case 'compatible':
                return { bg: 'bg-blue-500/20', border: 'border-blue-500/40', text: 'text-blue-400' };
            case 'challenging':
                return { bg: 'bg-orange-500/20', border: 'border-orange-500/40', text: 'text-orange-400' };
            default:
                return { bg: 'bg-gray-500/20', border: 'border-gray-500/40', text: 'text-gray-400' };
        }
    };

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
                    <span className="text-amber-400 font-medium">
                        {t(`birthChart.planets.${transit.planet1Key}`)} {t(`birthChart.aspects.${transit.aspectKey}`)}
                    </span>
                    <span className="text-amber-400 font-medium">{t(`birthChart.planets.${transit.planet2Key}`)}</span>
                </div>
                <p className="text-white/60 text-sm leading-relaxed mb-3">
                    {t(transit.descriptionKey)}
                </p>
                <button className="text-amber-400 text-sm flex items-center gap-1 hover:text-amber-300 transition-colors">
                    + {t('birthChart.readMore')}
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-[#050510] text-white overflow-hidden">
            {/* Fixed Back Button */}
            <button
                onClick={onBack}
                className="fixed top-6 left-4 z-50 flex items-center gap-1 text-violet-400 hover:text-violet-300 transition-colors"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Fixed Header Section */}
            <div className="flex-shrink-0 bg-[#050510] border-b border-white/10">
                {/* Header */}
                <div className="flex items-center justify-center px-4 py-4 pt-6">
                    <h1 className="text-sm font-semibold tracking-[0.15em] uppercase">{t('readings.birthChart')}</h1>
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
                            {tab === 'year' ? t('birthChart.yearChart') : t(`birthChart.tabs.${tab}`)}
                        </button>
                    ))}
                </div>

                {/* Date Picker - Only show for daily/weekly */}
                {activeTab !== 'year' && (
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
                )}

                {/* Year Calendar - Only show for year tab */}
                {activeTab === 'year' && (
                    <div className="px-4 pb-4">
                        <div className="grid grid-cols-3 gap-2">
                            {yearEnergyData.map((monthData, index) => {
                                const colors = getStatusColor(monthData.status);
                                return (
                                    <div
                                        key={index}
                                        className={`p-3 rounded-xl ${colors.bg} border ${colors.border} transition-all hover:scale-105`}
                                    >
                                        <div className="text-center">
                                            <div className="text-xs font-bold uppercase tracking-wider text-white/90 mb-1">
                                                {monthData.month}
                                            </div>
                                            <div className={`text-[10px] font-semibold uppercase ${colors.text}`}>
                                                {t(`birthChart.status.${monthData.status}`)}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            <ScrollArea className="flex-1 px-4">
                {activeTab === 'year' ? (
                    /* Year View - Monthly Energy Details */
                    <div className="pb-24 pt-4">
                        <h2 className="text-lg font-semibold tracking-wider uppercase text-white/90 mb-4">
                            {t('birthChart.energyCalendar', { sign: t(`zodiac:signs.${userSign}`) })}
                        </h2>
                        {yearEnergyData.map((monthData, index) => {
                            const colors = getStatusColor(monthData.status);
                            return (
                                <div key={index} className="mb-4 rounded-2xl overflow-hidden bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1a] border border-white/10">
                                    <div className={`p-4 ${colors.bg} border-b ${colors.border}`}>
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-base font-bold uppercase tracking-wider text-white">
                                                {monthData.month}
                                            </h3>
                                            <span className={`text-xs font-semibold uppercase px-3 py-1 rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}>
                                                {t(`birthChart.status.${monthData.status}`)}
                                            </span>
                                        </div>
                                        {monthData.element && (
                                            <div className="mt-2 text-xs text-white/60">
                                                <span className="font-semibold">{monthData.element}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <p className="text-white/70 text-sm leading-relaxed">
                                            {monthData.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* Daily/Weekly View - Transits */
                    <>
                        {/* Why should you care section */}
                        <div className="mb-6 mt-4">
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10"
                            >
                                <span className="text-white/70 text-sm">{t('birthChart.whyCare')}</span>
                                {isExpanded ? (
                                    <ChevronUp className="w-4 h-4 text-white/50" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 text-white/50" />
                                )}
                            </button>
                            {isExpanded && (
                                <div className="mt-2 p-4 rounded-xl bg-white/5 border border-white/10">
                                    <p className="text-white/60 text-sm leading-relaxed">
                                        {t('birthChart.whyCareDesc')}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Short Term Transits */}
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold tracking-wider uppercase text-white/90 mb-4">
                                {t('birthChart.shortTerm')}
                            </h2>
                            {shortTermTransits.map((transit) => (
                                <TransitCardComponent key={transit.id} transit={transit} />
                            ))}
                        </div>

                        {/* Long Term Transits */}
                        <div className="pb-24">
                            <h2 className="text-lg font-semibold tracking-wider uppercase text-white/90 mb-4">
                                {t('birthChart.longTerm')}
                            </h2>
                            {longTermTransits.map((transit) => (
                                <TransitCardComponent key={transit.id} transit={transit} />
                            ))}
                        </div>
                    </>
                )}
            </ScrollArea>
        </div>
    );
}
