import { ChevronLeft } from 'lucide-react';

interface PalmReadingIntroProps {
    onBack: () => void;
    onReadNow: () => void;
}

export function PalmReadingIntro({ onBack, onReadNow }: PalmReadingIntroProps) {
    return (
        <div className="flex flex-col h-full bg-[#050510] text-white overflow-hidden relative">
            {/* Back button */}
            <button
                onClick={onBack}
                className="absolute top-6 left-4 z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
            >
                <ChevronLeft className="w-5 h-5 text-white" />
            </button>

            {/* Main content */}
            <div className="flex-1 flex flex-col items-center pt-16 px-6">
                {/* Moon and Hand illustration */}
                <div className="relative flex flex-col items-center">
                    {/* Moon with dark circle background */}
                    <div className="relative mb-0">
                        <div className="w-28 h-28 rounded-full bg-[#0a0a18] flex items-center justify-center">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 opacity-80 shadow-lg" />
                        </div>
                    </div>
                    
                    {/* Hand SVG */}
                    <svg width="300" height="340" viewBox="0 0 300 340" fill="none" className="relative -mt-6">
                        {/* Glow rings around hand */}
                        <ellipse cx="150" cy="200" rx="130" ry="140" stroke="#4c1d95" strokeWidth="0.5" opacity="0.3" fill="none"/>
                        <ellipse cx="150" cy="200" rx="145" ry="155" stroke="#4c1d95" strokeWidth="0.3" opacity="0.2" fill="none"/>
                        
                        {/* Palm shape */}
                        <path d="M75 260 
                                 Q60 200 75 140
                                 L85 80 Q90 55 105 60 L108 130
                                 L115 50 Q120 25 140 30 L143 130
                                 L150 40 Q155 15 175 20 L172 130
                                 L180 50 Q185 25 205 30 L198 130
                                 L210 80 Q230 55 235 80 L220 140
                                 Q245 200 230 260
                                 Q210 320 150 330 Q90 320 75 260Z" 
                              fill="#c4b5fd" stroke="#ddd6fe" strokeWidth="1"/>
                        
                        {/* Palm lines */}
                        <path d="M95 190 Q150 165 205 195" stroke="#7c3aed" strokeWidth="1.5" fill="none" opacity="0.5"/>
                        <path d="M90 220 Q150 195 210 220" stroke="#7c3aed" strokeWidth="1.5" fill="none" opacity="0.5"/>
                        <path d="M100 250 Q150 235 200 255" stroke="#7c3aed" strokeWidth="1.5" fill="none" opacity="0.5"/>
                        <path d="M150 170 L150 270" stroke="#7c3aed" strokeWidth="1" fill="none" opacity="0.3"/>
                        
                        {/* Finger symbols */}
                        <text x="90" y="105" fill="#4c1d95" fontSize="14" fontFamily="serif">♏</text>
                        <text x="125" y="85" fill="#4c1d95" fontSize="14" fontFamily="serif">♄</text>
                        <text x="158" y="75" fill="#4c1d95" fontSize="14" fontFamily="serif">☉</text>
                        <text x="188" y="85" fill="#4c1d95" fontSize="14" fontFamily="serif">☿</text>
                        <text x="215" y="110" fill="#4c1d95" fontSize="12" fontFamily="serif">♃</text>
                        
                        {/* Left side symbols */}
                        <text x="78" y="160" fill="#4c1d95" fontSize="14" fontFamily="serif">♂</text>
                        <text x="65" y="200" fill="#4c1d95" fontSize="16" fontFamily="serif">♈</text>
                        
                        {/* Right side symbols */}
                        <text x="210" y="160" fill="#4c1d95" fontSize="10" fontFamily="serif">Life</text>
                        <text x="215" y="200" fill="#4c1d95" fontSize="10" fontFamily="serif">Fate</text>
                        <text x="218" y="240" fill="#4c1d95" fontSize="14" fontFamily="serif">♀</text>
                        
                        {/* Palm area labels */}
                        <text x="115" y="200" fill="#4c1d95" fontSize="9" fontFamily="serif">Heart</text>
                        <text x="165" y="195" fill="#4c1d95" fontSize="9" fontFamily="serif">Head</text>
                        <text x="120" y="235" fill="#4c1d95" fontSize="9" fontFamily="serif">Destiny</text>
                        <text x="165" y="240" fill="#4c1d95" fontSize="9" fontFamily="serif">Venus</text>
                        <text x="130" y="275" fill="#4c1d95" fontSize="9" fontFamily="serif">Moon</text>
                    </svg>
                </div>

                {/* Title and description */}
                <div className="text-center mt-2">
                    <h1 className="text-4xl font-bold text-white mb-3">Palm Reading</h1>
                    <p className="text-white/50 text-sm">Read your palm to know your fortune</p>
                </div>
            </div>

            {/* Bottom section with dots and button */}
            <div className="px-6 pb-8">
                <div className="flex items-center justify-center gap-3">
                    {/* Left dots */}
                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                        <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                    </div>
                    
                    {/* Read Now button */}
                    <button
                        onClick={onReadNow}
                        className="flex-1 max-w-[280px] py-4 rounded-full bg-violet-300 text-black font-semibold text-sm uppercase tracking-[0.2em] hover:bg-violet-200 transition-colors"
                    >
                        Read Now
                    </button>
                    
                    {/* Right dots */}
                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                        <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                    </div>
                </div>
            </div>
        </div>
    );
}
