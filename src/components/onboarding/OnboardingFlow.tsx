import React, { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: (data: {
    name: string;
    birthday: string;
    birthTime?: string;
    birthLocation?: string;
    gender: 'male' | 'female' | 'other';
    relationshipStatus?: string;
  }) => void;
}

type Step = 'loading' | 'welcome' | 'name' | 'birthday' | 'time' | 'gender' | 'location' | 'relationship';

const STEPS_ORDER: Step[] = ['name', 'birthday', 'time', 'gender', 'location', 'relationship'];

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState<Step>('loading');
  const [name, setName] = useState('');
  const [birthDay, setBirthDay] = useState(20);
  const [birthMonth, setBirthMonth] = useState(1);
  const [birthYear, setBirthYear] = useState(2000);
  const [birthHour, setBirthHour] = useState(5);
  const [birthMinute, setBirthMinute] = useState(41);
  const [birthPeriod, setBirthPeriod] = useState<'AM' | 'PM'>('AM');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | null>(null);
  const [birthLocation, setBirthLocation] = useState('');
  const [relationshipStatus, setRelationshipStatus] = useState<string | null>(null);

  // Auto-advance from loading screen
  useEffect(() => {
    if (step === 'loading') {
      const timer = setTimeout(() => setStep('welcome'), 2500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const currentStepIndex = STEPS_ORDER.indexOf(step);

  const handleBack = () => {
    if (step === 'name') {
      setStep('welcome');
    } else {
      const idx = STEPS_ORDER.indexOf(step);
      if (idx > 0) setStep(STEPS_ORDER[idx - 1]);
    }
  };

  const handleNext = () => {
    const idx = STEPS_ORDER.indexOf(step);
    if (idx < STEPS_ORDER.length - 1) {
      setStep(STEPS_ORDER[idx + 1]);
    }
  };

  const handleComplete = () => {
    const birthday = `${birthYear}-${String(birthMonth).padStart(2, '0')}-${String(birthDay).padStart(2, '0')}`;
    const birthTime = `${String(birthHour).padStart(2, '0')}:${String(birthMinute).padStart(2, '0')} ${birthPeriod}`;
    onComplete({
      name,
      birthday,
      birthTime,
      birthLocation: birthLocation || undefined,
      gender: gender || 'other',
      relationshipStatus: relationshipStatus || undefined,
    });
  };

  // Loading Screen
  if (step === 'loading') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        {/* Cosmic background */}
        <div className="absolute inset-0 bg-gradient-radial from-violet-900/30 via-transparent to-transparent" />
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                opacity: Math.random() * 0.7 + 0.3,
              }}
            />
          ))}
        </div>
        {/* Logo */}
        <div className="relative z-10 animate-pulse-glow">
          <div className="w-40 h-40 rounded-full bg-gradient-to-b from-violet-400 to-violet-600 flex items-center justify-center shadow-2xl shadow-violet-500/50">
            <div className="w-32 h-32 rounded-full bg-black flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-24 h-24">
                <circle cx="50" cy="30" r="8" fill="white" opacity="0.9" />
                <circle cx="50" cy="50" r="12" fill="white" />
                <path d="M30 70 Q50 90 70 70" stroke="white" strokeWidth="8" fill="none" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Welcome Screen
  if (step === 'welcome') {
    return (
      <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
        {/* Cosmic background */}
        <div className="absolute inset-0 bg-gradient-radial from-violet-900/20 via-transparent to-transparent" />
        <div className="absolute inset-0">
          {[...Array(80)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-0.5 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.2,
              }}
            />
          ))}
        </div>

        {/* Logo area */}
        <div className="flex-1 flex items-center justify-center pt-16">
          <div className="relative animate-float">
            <div className="w-48 h-48 rounded-full bg-gradient-to-b from-violet-400 to-violet-600 flex items-center justify-center shadow-2xl shadow-violet-500/40">
              <div className="w-40 h-40 rounded-full bg-black flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-28 h-28">
                  <circle cx="50" cy="30" r="8" fill="white" opacity="0.9" />
                  <circle cx="50" cy="50" r="12" fill="white" />
                  <path d="M30 70 Q50 90 70 70" stroke="white" strokeWidth="8" fill="none" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Welcome text and buttons */}
        <div className="px-6 pb-12 space-y-6 relative z-10">
          <div className="text-center space-y-3">
            <h1 className="text-5xl font-light text-white tracking-wider italic">WELCOME</h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              You are on the path to discovering yourself.
              <br />
              LunaFlame will help you live in harmony
              <br />
              with the Universe.
            </p>
          </div>

          <div className="space-y-3 pt-4">
            <button
              onClick={() => setStep('name')}
              className="w-full py-4 rounded-full bg-violet-200 text-black font-semibold text-lg transition-all hover:bg-violet-300 active:scale-98"
            >
              GET STARTED
            </button>
            <button className="w-full py-4 rounded-full border border-violet-500/50 text-violet-300 font-medium transition-all hover:bg-violet-500/10">
              Already have an account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step screens wrapper
  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-3">
          <button onClick={handleBack} className="p-2 -ml-2 text-white/70 hover:text-white">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-white text-lg font-semibold tracking-wide">
            {step === 'name' && 'ENTER THE NAME'}
            {step === 'birthday' && 'DATE OF BIRTH'}
            {step === 'time' && 'TIME OF BIRTH'}
            {step === 'gender' && 'ADD GENDER'}
            {step === 'location' && 'LOCATION OF BIRTH'}
            {step === 'relationship' && 'RELATIONSHIP STATUS'}
          </h1>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1.5 mt-4">
          {STEPS_ORDER.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i <= currentStepIndex ? 'bg-violet-400' : 'bg-gray-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {step === 'name' && (
          <NameStep name={name} setName={setName} onNext={handleNext} />
        )}
        {step === 'birthday' && (
          <BirthdayStep
            day={birthDay} setDay={setBirthDay}
            month={birthMonth} setMonth={setBirthMonth}
            year={birthYear} setYear={setBirthYear}
            onNext={handleNext} onSkip={handleNext}
          />
        )}
        {step === 'time' && (
          <TimeStep
            hour={birthHour} setHour={setBirthHour}
            minute={birthMinute} setMinute={setBirthMinute}
            period={birthPeriod} setPeriod={setBirthPeriod}
            onNext={handleNext} onSkip={handleNext}
          />
        )}
        {step === 'gender' && (
          <GenderStep gender={gender} setGender={setGender} onNext={handleNext} onSkip={handleNext} />
        )}
        {step === 'location' && (
          <LocationStep location={birthLocation} setLocation={setBirthLocation} onNext={handleNext} onSkip={handleNext} />
        )}
        {step === 'relationship' && (
          <RelationshipStep status={relationshipStatus} setStatus={setRelationshipStatus} onConfirm={handleComplete} onSkip={handleComplete} />
        )}
      </div>
    </div>
  );
}


// Name Step Component
function NameStep({ name, setName, onNext }: { name: string; setName: (v: string) => void; onNext: () => void }) {
  return (
    <div className="flex-1 flex flex-col animate-in fade-in duration-300">
      {/* Description */}
      <p className="text-gray-400 text-center text-sm px-6 mt-2">
        To make your journey more insightful, let's get to know you better.
      </p>

      {/* Eye illustration */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="relative w-full max-w-sm aspect-video">
          <div className="absolute inset-0 bg-gradient-to-b from-violet-600/30 to-transparent rounded-t-full" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-black" />
              </div>
            </div>
          </div>
          {/* Eye rays */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-8 bg-gradient-to-t from-violet-400 to-transparent"
              style={{
                left: '50%',
                top: '50%',
                transform: `rotate(${i * 30}deg) translateY(-60px)`,
                transformOrigin: 'bottom center',
              }}
            />
          ))}
        </div>
      </div>

      {/* Input and button */}
      <div className="px-6 pb-8 space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
          className="w-full px-5 py-4 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
          autoFocus
        />
        <button
          onClick={onNext}
          disabled={!name.trim()}
          className="w-full py-4 rounded-full bg-violet-300 text-black font-semibold text-lg transition-all hover:bg-violet-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          NEXT
        </button>
      </div>
    </div>
  );
}

// Birthday Step Component
function BirthdayStep({
  day, setDay, month, setMonth, year, setYear, onNext, onSkip
}: {
  day: number; setDay: (v: number) => void;
  month: number; setMonth: (v: number) => void;
  year: number; setYear: (v: number) => void;
  onNext: () => void; onSkip: () => void;
}) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex-1 flex flex-col animate-in fade-in duration-300">
      <p className="text-gray-400 text-center text-sm px-6 mt-2">
        Date is important for determining your sun sign, numerology and compatibility.
      </p>

      {/* Zodiac wheel illustration */}
      <div className="flex-1 flex items-center justify-center px-6 py-4">
        <div className="relative w-64 h-64">
          {/* Moon phases circle */}
          {[...Array(12)].map((_, i) => {
            const angle = (i * 30 - 90) * (Math.PI / 180);
            const x = 50 + 42 * Math.cos(angle);
            const y = 50 + 42 * Math.sin(angle);
            return (
              <div
                key={i}
                className="absolute w-6 h-6 rounded-full bg-gradient-to-br from-violet-300 to-violet-600"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              />
            );
          })}
          {/* Center zodiac */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
              <span className="text-4xl">♋</span>
            </div>
          </div>
        </div>
      </div>

      {/* Date picker */}
      <div className="px-6 pb-4">
        <div className="flex justify-center gap-2 py-4">
          <ScrollPicker
            values={Array.from({ length: 31 }, (_, i) => i + 1)}
            selected={day}
            onChange={setDay}
            width="w-16"
          />
          <ScrollPicker
            values={months}
            selected={months[month - 1]}
            onChange={(v) => setMonth(months.indexOf(v) + 1)}
            width="w-28"
          />
          <ScrollPicker
            values={Array.from({ length: 100 }, (_, i) => currentYear - i)}
            selected={year}
            onChange={setYear}
            width="w-20"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="px-6 pb-8 flex gap-3">
        <button
          onClick={onSkip}
          className="flex-1 py-4 rounded-full border border-gray-600 text-white font-semibold transition-all hover:bg-gray-800"
        >
          SKIP
        </button>
        <button
          onClick={onNext}
          className="flex-1 py-4 rounded-full bg-violet-300 text-black font-semibold transition-all hover:bg-violet-400"
        >
          NEXT
        </button>
      </div>
    </div>
  );
}


// Time Step Component
function TimeStep({
  hour, setHour, minute, setMinute, period, setPeriod, onNext, onSkip
}: {
  hour: number; setHour: (v: number) => void;
  minute: number; setMinute: (v: number) => void;
  period: 'AM' | 'PM'; setPeriod: (v: 'AM' | 'PM') => void;
  onNext: () => void; onSkip: () => void;
}) {
  return (
    <div className="flex-1 flex flex-col animate-in fade-in duration-300">
      <p className="text-gray-400 text-center text-sm px-6 mt-2">
        Time is important for determining your houses, rising sign, and exact moon position.
      </p>

      {/* Geometric star pattern */}
      <div className="flex-1 flex items-center justify-center px-6 py-4">
        <div className="relative w-64 h-64">
          {/* Outer circle with nodes */}
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="1" />
            {/* Inner geometric pattern */}
            <polygon
              points="100,30 145,75 145,125 100,170 55,125 55,75"
              fill="none"
              stroke="rgba(139, 92, 246, 0.5)"
              strokeWidth="1"
            />
            {/* Star lines */}
            {[0, 60, 120, 180, 240, 300].map((angle, i) => {
              const rad = (angle - 90) * (Math.PI / 180);
              const x1 = 100 + 30 * Math.cos(rad);
              const y1 = 100 + 30 * Math.sin(rad);
              const x2 = 100 + 75 * Math.cos(rad);
              const y2 = 100 + 75 * Math.sin(rad);
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(139, 92, 246, 0.4)" strokeWidth="1" />;
            })}
            {/* Nodes */}
            {[0, 60, 120, 180, 240, 300].map((angle, i) => {
              const rad = (angle - 90) * (Math.PI / 180);
              const x = 100 + 80 * Math.cos(rad);
              const y = 100 + 80 * Math.sin(rad);
              return <circle key={i} cx={x} cy={y} r="12" fill="rgba(139, 92, 246, 0.2)" stroke="rgba(139, 92, 246, 0.5)" strokeWidth="1" />;
            })}
          </svg>
        </div>
      </div>

      {/* Time picker */}
      <div className="px-6 pb-4">
        <div className="flex justify-center items-center gap-2 py-4">
          <ScrollPicker
            values={Array.from({ length: 12 }, (_, i) => i + 1)}
            selected={hour}
            onChange={setHour}
            width="w-16"
          />
          <span className="text-white text-2xl font-light">:</span>
          <ScrollPicker
            values={Array.from({ length: 60 }, (_, i) => i)}
            selected={minute}
            onChange={setMinute}
            width="w-16"
            format={(v) => String(v).padStart(2, '0')}
          />
          <ScrollPicker
            values={['AM', 'PM'] as const}
            selected={period}
            onChange={(v) => setPeriod(v as 'AM' | 'PM')}
            width="w-16"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="px-6 pb-8 flex gap-3">
        <button
          onClick={onSkip}
          className="flex-1 py-4 rounded-full border border-gray-600 text-white font-semibold transition-all hover:bg-gray-800"
        >
          I DON'T KNOW
        </button>
        <button
          onClick={onNext}
          className="flex-1 py-4 rounded-full bg-violet-300 text-black font-semibold transition-all hover:bg-violet-400"
        >
          NEXT
        </button>
      </div>
    </div>
  );
}

// Gender Step Component
function GenderStep({
  gender, setGender, onNext, onSkip
}: {
  gender: 'male' | 'female' | 'other' | null;
  setGender: (v: 'male' | 'female' | 'other') => void;
  onNext: () => void; onSkip: () => void;
}) {
  return (
    <div className="flex-1 flex flex-col animate-in fade-in duration-300">
      {/* Card with illustration */}
      <div className="mx-6 mt-2 p-6 rounded-2xl bg-gradient-to-b from-violet-900/40 to-violet-900/20 border border-violet-500/20">
        <p className="text-gray-300 text-center text-sm mb-6">
          It will reveal the balance of your masculine and feminine energy.
        </p>
        {/* Hexagon avatar */}
        <div className="flex justify-center">
          <div className="relative">
            <svg viewBox="0 0 100 100" className="w-32 h-32">
              <polygon
                points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
                fill="rgba(139, 92, 246, 0.1)"
                stroke="rgba(139, 92, 246, 0.5)"
                strokeWidth="2"
              />
              <circle cx="50" cy="40" r="12" fill="none" stroke="rgba(139, 92, 246, 0.6)" strokeWidth="2" />
              <path d="M30 75 Q50 55 70 75" fill="none" stroke="rgba(139, 92, 246, 0.6)" strokeWidth="2" />
            </svg>
            <div className="absolute inset-0 blur-xl bg-violet-500/20" />
          </div>
        </div>
      </div>

      {/* Gender options */}
      <div className="flex-1 px-6 py-6 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <GenderOption
            icon="♂"
            label="Male"
            selected={gender === 'male'}
            onClick={() => setGender('male')}
          />
          <GenderOption
            icon="♀"
            label="Female"
            selected={gender === 'female'}
            onClick={() => setGender('female')}
          />
        </div>
        <GenderOption
          icon="⚥"
          label="Other"
          selected={gender === 'other'}
          onClick={() => setGender('other')}
        />
      </div>

      {/* Buttons */}
      <div className="px-6 pb-8 flex gap-3">
        <button
          onClick={onSkip}
          className="flex-1 py-4 rounded-full border border-gray-600 text-white font-semibold transition-all hover:bg-gray-800"
        >
          SKIP
        </button>
        <button
          onClick={onNext}
          disabled={!gender}
          className="flex-1 py-4 rounded-full bg-violet-300 text-black font-semibold transition-all hover:bg-violet-400 disabled:opacity-50"
        >
          NEXT
        </button>
      </div>
    </div>
  );
}

function GenderOption({ icon, label, selected, onClick }: { icon: string; label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-xl border text-left transition-all ${
        selected
          ? 'border-violet-500 bg-violet-500/10'
          : 'border-gray-700 bg-gray-900 hover:border-gray-600'
      }`}
    >
      <span className="text-2xl text-violet-400">{icon}</span>
      <p className={`mt-2 font-medium ${selected ? 'text-white' : 'text-gray-400'}`}>{label}</p>
    </button>
  );
}


// Location Step Component
function LocationStep({
  location, setLocation, onNext, onSkip
}: {
  location: string; setLocation: (v: string) => void;
  onNext: () => void; onSkip: () => void;
}) {
  return (
    <div className="flex-1 flex flex-col animate-in fade-in duration-300">
      <p className="text-gray-400 text-center text-sm px-6 mt-2">
        We will analyse the position of stars and planets in your place of birth at the moment you were born.
      </p>

      {/* Constellation ring illustration */}
      <div className="flex-1 flex items-center justify-center px-6 py-4">
        <div className="relative w-64 h-64">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {/* Outer ring segments */}
            {[...Array(12)].map((_, i) => {
              const startAngle = i * 30 - 90;
              const endAngle = startAngle + 25;
              const startRad = startAngle * (Math.PI / 180);
              const endRad = endAngle * (Math.PI / 180);
              const r = 80;
              const x1 = 100 + r * Math.cos(startRad);
              const y1 = 100 + r * Math.sin(startRad);
              const x2 = 100 + r * Math.cos(endRad);
              const y2 = 100 + r * Math.sin(endRad);
              return (
                <path
                  key={i}
                  d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`}
                  fill="none"
                  stroke="rgba(139, 92, 246, 0.4)"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
              );
            })}
            {/* Inner constellation lines */}
            <line x1="60" y1="80" x2="90" y2="100" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="1" />
            <line x1="90" y1="100" x2="110" y2="90" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="1" />
            <line x1="110" y1="90" x2="140" y2="100" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="1" />
            <line x1="90" y1="100" x2="100" y2="130" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="1" />
            <line x1="100" y1="130" x2="120" y2="120" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="1" />
            {/* Stars */}
            {[[60, 80], [90, 100], [110, 90], [140, 100], [100, 130], [120, 120], [80, 60], [130, 70]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="2" fill="white" opacity="0.8" />
            ))}
          </svg>
        </div>
      </div>

      {/* Input and buttons */}
      <div className="px-6 pb-8 space-y-4">
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Type in city of birth"
          className="w-full px-5 py-4 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
        />
        <div className="flex gap-3">
          <button
            onClick={onSkip}
            className="flex-1 py-4 rounded-full border border-gray-600 text-white font-semibold transition-all hover:bg-gray-800"
          >
            I DON'T KNOW
          </button>
          <button
            onClick={onNext}
            className="flex-1 py-4 rounded-full bg-violet-300 text-black font-semibold transition-all hover:bg-violet-400"
          >
            NEXT
          </button>
        </div>
      </div>
    </div>
  );
}

// Relationship Step Component
function RelationshipStep({
  status, setStatus, onConfirm, onSkip
}: {
  status: string | null; setStatus: (v: string) => void;
  onConfirm: () => void; onSkip: () => void;
}) {
  const options = [
    { id: 'relationship', label: 'In a relationship', icon: '👫' },
    { id: 'single', label: 'Single', icon: '🧑' },
    { id: 'married', label: 'Married', icon: '💑' },
    { id: 'engaged', label: 'Engaged', icon: '💍' },
    { id: 'divorced', label: 'Divorced', icon: '💔' },
    { id: 'widow', label: 'Widow', icon: '🕊️' },
  ];

  return (
    <div className="flex-1 flex flex-col animate-in fade-in duration-300">
      {/* Card with illustration */}
      <div className="mx-6 mt-2 p-6 rounded-2xl bg-gradient-to-b from-violet-900/40 to-violet-900/20 border border-violet-500/20">
        <p className="text-gray-300 text-center text-sm mb-6">
          Your current status provides insights into your love life.
        </p>
        {/* Smiley with heart */}
        <div className="flex justify-center">
          <div className="relative">
            <svg viewBox="0 0 100 100" className="w-32 h-32">
              <circle cx="45" cy="50" r="35" fill="none" stroke="rgba(139, 92, 246, 0.5)" strokeWidth="2" />
              <circle cx="35" cy="45" r="3" fill="rgba(139, 92, 246, 0.6)" />
              <circle cx="55" cy="45" r="3" fill="rgba(139, 92, 246, 0.6)" />
              <path d="M32 58 Q45 68 58 58" fill="none" stroke="rgba(139, 92, 246, 0.6)" strokeWidth="2" strokeLinecap="round" />
              {/* Heart */}
              <path
                d="M75 45 C75 40 70 35 65 40 C60 35 55 40 55 45 C55 55 65 60 65 60 C65 60 75 55 75 45"
                fill="rgba(139, 92, 246, 0.4)"
                stroke="rgba(139, 92, 246, 0.6)"
                strokeWidth="1"
              />
            </svg>
            <div className="absolute inset-0 blur-xl bg-violet-500/20" />
          </div>
        </div>
      </div>

      {/* Relationship options */}
      <div className="flex-1 px-6 py-4 overflow-auto">
        <div className="grid grid-cols-2 gap-3">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setStatus(opt.id)}
              className={`p-4 rounded-xl border text-left transition-all ${
                status === opt.id
                  ? 'border-violet-500 bg-violet-500/10'
                  : 'border-gray-700 bg-gray-900 hover:border-gray-600'
              }`}
            >
              <span className="text-xl">{opt.icon}</span>
              <p className={`mt-2 text-sm font-medium ${status === opt.id ? 'text-white' : 'text-gray-400'}`}>
                {opt.label}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="px-6 pb-8 flex gap-3">
        <button
          onClick={onSkip}
          className="flex-1 py-4 rounded-full border border-gray-600 text-white font-semibold transition-all hover:bg-gray-800"
        >
          SKIP
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-4 rounded-full bg-violet-300 text-black font-semibold transition-all hover:bg-violet-400"
        >
          CONFIRM
        </button>
      </div>
    </div>
  );
}

// Scroll Picker Component with touch/swipe support
function ScrollPicker<T extends string | number>({
  values,
  selected,
  onChange,
  width = 'w-20',
  format = (v: T) => String(v),
}: {
  values: readonly T[];
  selected: T;
  onChange: (v: T) => void;
  width?: string;
  format?: (v: T) => string;
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const selectedIndex = values.indexOf(selected);
  const itemHeight = 40;
  const visibleItems = 5;
  const containerHeight = itemHeight * visibleItems;

  // Scroll to selected item on mount and when selected changes
  React.useEffect(() => {
    if (containerRef.current) {
      const scrollTop = selectedIndex * itemHeight;
      containerRef.current.scrollTo({ top: scrollTop, behavior: 'smooth' });
    }
  }, [selectedIndex]);

  // Handle scroll end to snap to nearest item
  const handleScrollEnd = () => {
    if (containerRef.current) {
      const scrollTop = containerRef.current.scrollTop;
      const nearestIndex = Math.round(scrollTop / itemHeight);
      const clampedIndex = Math.max(0, Math.min(nearestIndex, values.length - 1));
      
      if (clampedIndex !== selectedIndex) {
        onChange(values[clampedIndex]);
      }
      
      // Snap to position
      containerRef.current.scrollTo({ 
        top: clampedIndex * itemHeight, 
        behavior: 'smooth' 
      });
    }
  };

  // Debounced scroll handler
  const scrollTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleScroll = () => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(handleScrollEnd, 100);
  };

  return (
    <div className={`${width} relative`}>
      {/* Gradient overlays for fade effect */}
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />
      
      {/* Selection highlight */}
      <div 
        className="absolute inset-x-0 z-5 border-t border-b border-gray-600 pointer-events-none"
        style={{ 
          top: `${itemHeight * 2}px`, 
          height: `${itemHeight}px` 
        }}
      />
      
      {/* Scrollable container */}
      <div
        ref={containerRef}
        className="overflow-y-auto scrollbar-hide touch-pan-y"
        style={{ height: `${containerHeight}px` }}
        onScroll={handleScroll}
      >
        {/* Top padding */}
        <div style={{ height: `${itemHeight * 2}px` }} />
        
        {/* Items */}
        {values.map((val, i) => {
          const isSelected = i === selectedIndex;
          return (
            <div
              key={i}
              onClick={() => onChange(val)}
              className={`flex items-center justify-center cursor-pointer transition-all duration-150 ${
                isSelected
                  ? 'text-white text-xl font-semibold'
                  : 'text-gray-500 text-base'
              }`}
              style={{ height: `${itemHeight}px` }}
            >
              {format(val)}
            </div>
          );
        })}
        
        {/* Bottom padding */}
        <div style={{ height: `${itemHeight * 2}px` }} />
      </div>
    </div>
  );
}
