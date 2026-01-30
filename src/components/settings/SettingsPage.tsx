import { useState, useRef, useEffect } from 'react';
import type { UserProfile, ZodiacSign } from '@/types';
import { getZodiacSign } from '@/types';
import { 
  User, 
  Calendar, 
  Heart, 
  Trash2, 
  ChevronRight,
  Sparkles,
  X,
  Star
} from 'lucide-react';

interface SettingsPageProps {
  profile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onClearHistory: () => void;
  onDeleteAccount: () => void;
  onRemovePartner: () => void;
}

const zodiacSymbols: Record<ZodiacSign, string> = {
  aries: '♈', taurus: '♉', gemini: '♊', cancer: '♋',
  leo: '♌', virgo: '♍', libra: '♎', scorpio: '♏',
  sagittarius: '♐', capricorn: '♑', aquarius: '♒', pisces: '♓'
};

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function SettingsPage({ 
  profile, 
  onUpdateProfile, 
  onClearHistory, 
  onDeleteAccount,
  onRemovePartner 
}: SettingsPageProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState<'clear' | 'delete' | null>(null);
  
  // Date picker state
  const [birthDay, setBirthDay] = useState(1);
  const [birthMonth, setBirthMonth] = useState(1);
  const [birthYear, setBirthYear] = useState(2000);

  const handleSave = () => {
    if (editingField === 'name' && tempValue) {
      onUpdateProfile({ [editingField]: tempValue });
    } else if (editingField === 'birthday' || editingField === 'partnerBirthday') {
      const dateStr = `${birthYear}-${String(birthMonth).padStart(2, '0')}-${String(birthDay).padStart(2, '0')}`;
      onUpdateProfile({ [editingField]: dateStr });
    }
    setEditingField(null);
    setTempValue('');
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Not set';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const openDateEditor = (field: string, dateStr?: string) => {
    setEditingField(field);
    if (dateStr) {
      const date = new Date(dateStr);
      setBirthDay(date.getDate());
      setBirthMonth(date.getMonth() + 1);
      setBirthYear(date.getFullYear());
    } else {
      setBirthDay(15);
      setBirthMonth(6);
      setBirthYear(1995);
    }
  };

  // Get preview zodiac sign based on current selection
  const getPreviewSign = () => {
    const dateStr = `${birthYear}-${String(birthMonth).padStart(2, '0')}-${String(birthDay).padStart(2, '0')}`;
    return getZodiacSign(dateStr);
  };

  // Edit Dialog
  const renderEditDialog = () => {
    if (!editingField) return null;

    const titles: Record<string, string> = {
      name: 'Edit Name',
      birthday: 'Date of Birth',
      partnerBirthday: 'Partner Birthday',
    };

    const isDateField = editingField === 'birthday' || editingField === 'partnerBirthday';

    if (isDateField) {
      const previewSign = getPreviewSign();
      const currentYear = new Date().getFullYear();
      
      return (
        <div className="fixed inset-0 z-50 flex flex-col bg-black">
          {/* Header */}
          <div className="px-4 pt-6 pb-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setEditingField(null)} 
                className="p-2 -ml-2 text-white/70 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
              <h1 className="text-white text-lg font-semibold tracking-wide uppercase">
                {titles[editingField]}
              </h1>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-400 text-center text-sm px-6">
            Date is important for determining sun sign, numerology and compatibility.
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
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/30">
                  <span className="text-4xl">{zodiacSymbols[previewSign]}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Date picker */}
          <div className="px-6 pb-4">
            <div className="flex justify-center gap-2 py-4">
              <ScrollPicker
                values={Array.from({ length: 31 }, (_, i) => i + 1)}
                selected={birthDay}
                onChange={setBirthDay}
                width="w-16"
              />
              <ScrollPicker
                values={MONTHS}
                selected={MONTHS[birthMonth - 1]}
                onChange={(v) => setBirthMonth(MONTHS.indexOf(v) + 1)}
                width="w-28"
              />
              <ScrollPicker
                values={Array.from({ length: 100 }, (_, i) => currentYear - i)}
                selected={birthYear}
                onChange={setBirthYear}
                width="w-20"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="px-6 pb-8 flex gap-3">
            <button
              onClick={() => setEditingField(null)}
              className="flex-1 py-4 rounded-full border border-gray-600 text-white font-semibold transition-all hover:bg-gray-800"
            >
              CANCEL
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-4 rounded-full bg-violet-300 text-black font-semibold transition-all hover:bg-violet-400"
            >
              SAVE
            </button>
          </div>
        </div>
      );
    }

    // Name edit dialog (simple text input)
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="w-full max-w-sm bg-[#1a1a2e] rounded-3xl p-6 border border-purple-500/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-white">{titles[editingField]}</h3>
            <button 
              onClick={() => setEditingField(null)}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <input
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            placeholder="Enter name"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50 mb-6"
          />
          
          <div className="flex gap-3">
            <button 
              onClick={() => setEditingField(null)}
              className="flex-1 py-3 rounded-full border border-white/20 text-white/70 font-medium"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="flex-1 py-3 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 text-white font-medium"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Confirm Dialog
  const renderConfirmDialog = () => {
    if (!showConfirmDialog) return null;

    const isClear = showConfirmDialog === 'clear';
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="w-full max-w-sm bg-[#1a1a2e] rounded-3xl p-6 border border-red-500/20">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">
              {isClear ? 'Clear History?' : 'Delete Account?'}
            </h3>
            <p className="text-sm text-white/50">
              {isClear 
                ? 'This will remove all your swipe history, readings, and accepted traits.'
                : 'This will permanently delete all your data. This cannot be undone.'
              }
            </p>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => setShowConfirmDialog(null)}
              className="flex-1 py-3 rounded-full border border-white/20 text-white/70 font-medium"
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                if (isClear) onClearHistory();
                else onDeleteAccount();
                setShowConfirmDialog(null);
              }}
              className="flex-1 py-3 rounded-full bg-gradient-to-r from-red-600 to-red-500 text-white font-medium"
            >
              {isClear ? 'Clear' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen h-full bg-[#0a0a12] text-white overflow-y-auto pb-24">
      {/* Header */}
      <header className="p-4 pt-6">
        <h1 className="text-2xl font-light tracking-[0.15em] uppercase text-purple-400">Profile</h1>
        <p className="text-sm text-white/40 mt-1">Manage your cosmic identity</p>
      </header>

      {/* Profile Avatar Section */}
      <div className="px-4 mt-4">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1a] border border-purple-500/20 p-6">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-transparent" />
          
          <div className="relative flex items-center gap-4">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-3xl shadow-lg shadow-purple-500/30">
              {zodiacSymbols[profile.sign]}
            </div>
            
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-white">{profile.name}</h2>
              <p className="text-purple-400 capitalize flex items-center gap-2 mt-1">
                <span className="text-lg">{zodiacSymbols[profile.sign]}</span>
                {profile.sign}
              </p>
              <p className="text-white/40 text-sm mt-1">{formatDate(profile.birthday)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-4 mt-6">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#1a1a2e]/80 rounded-2xl p-4 text-center border border-purple-500/10">
            <div className="text-2xl font-bold text-purple-400">{profile.swipeCount}</div>
            <div className="text-xs text-white/40 mt-1">Traits Swiped</div>
          </div>
          <div className="bg-[#1a1a2e]/80 rounded-2xl p-4 text-center border border-green-500/10">
            <div className="text-2xl font-bold text-green-400">{profile.acceptedTraits.length}</div>
            <div className="text-xs text-white/40 mt-1">Accepted</div>
          </div>
          <div className="bg-[#1a1a2e]/80 rounded-2xl p-4 text-center border border-red-500/10">
            <div className="text-2xl font-bold text-red-400">{profile.rejectedTraits.length}</div>
            <div className="text-xs text-white/40 mt-1">Rejected</div>
          </div>
        </div>
      </div>

      {/* Profile Settings */}
      <div className="px-4 mt-8">
        <h3 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-4 px-1">Profile Settings</h3>
        
        <div className="space-y-3">
          {/* Name */}
          <button 
            onClick={() => { setEditingField('name'); setTempValue(profile.name); }}
            className="w-full flex items-center justify-between p-4 bg-[#1a1a2e]/60 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <User className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-left">
                <div className="text-xs text-white/40">Name</div>
                <div className="text-white font-medium">{profile.name}</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-white/30" />
          </button>

          {/* Birthday */}
          <button 
            onClick={() => openDateEditor('birthday', profile.birthday)}
            className="w-full flex items-center justify-between p-4 bg-[#1a1a2e]/60 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-left">
                <div className="text-xs text-white/40">Birthday</div>
                <div className="text-white font-medium">{formatDate(profile.birthday)}</div>
                <div className="text-xs text-purple-400 capitalize">{profile.sign}</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-white/30" />
          </button>

          {/* Gender */}
          <div className="p-4 bg-[#1a1a2e]/60 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-xs text-white/40">Gender</div>
            </div>
            <div className="flex gap-2">
              {(['female', 'male', 'other'] as const).map((gender) => (
                <button
                  key={gender}
                  onClick={() => onUpdateProfile({ gender })}
                  className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
                    profile.gender === gender
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/5 text-white/50 hover:bg-white/10'
                  }`}
                >
                  {gender.charAt(0).toUpperCase() + gender.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Partner Section */}
      <div className="px-4 mt-8">
        <h3 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-4 px-1">Partner</h3>
        
        {profile.partnerSign ? (
          <div className="space-y-3">
            <button 
              onClick={() => openDateEditor('partnerBirthday', profile.partnerBirthday)}
              className="w-full flex items-center justify-between p-4 bg-[#1a1a2e]/60 rounded-2xl border border-white/5 hover:border-pink-500/30 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-pink-400" />
                </div>
                <div className="text-left">
                  <div className="text-xs text-white/40">Partner's Birthday</div>
                  <div className="text-white font-medium">{formatDate(profile.partnerBirthday || '')}</div>
                  <div className="text-xs text-pink-400 capitalize flex items-center gap-1">
                    <span>{zodiacSymbols[profile.partnerSign]}</span>
                    {profile.partnerSign}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/30" />
            </button>
            
            <button 
              onClick={onRemovePartner}
              className="w-full py-3 rounded-full border border-pink-500/30 text-pink-400 font-medium hover:bg-pink-500/10 transition-all flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4" />
              Remove Partner
            </button>
          </div>
        ) : (
          <div className="p-6 bg-[#1a1a2e]/60 rounded-2xl border border-white/5 text-center">
            <div className="w-16 h-16 rounded-full bg-pink-500/10 flex items-center justify-center mx-auto mb-3">
              <Heart className="w-8 h-8 text-pink-400/50" />
            </div>
            <p className="text-white/40 text-sm mb-4">No partner added yet</p>
            <button 
              onClick={() => openDateEditor('partnerBirthday', undefined)}
              className="px-6 py-2 rounded-full border border-pink-500/30 text-pink-400 font-medium hover:bg-pink-500/10 transition-all"
            >
              Add Partner
            </button>
          </div>
        )}
      </div>

      {/* Data Management */}
      <div className="px-4 mt-8">
        <h3 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-4 px-1">Data</h3>
        
        <div className="space-y-3">
          <button 
            onClick={() => setShowConfirmDialog('clear')}
            className="w-full flex items-center gap-3 p-4 bg-[#1a1a2e]/60 rounded-2xl border border-white/5 hover:border-yellow-500/30 transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-400" />
            </div>
            <span className="text-white/70">Clear History</span>
          </button>

          <button 
            onClick={() => setShowConfirmDialog('delete')}
            className="w-full flex items-center gap-3 p-4 bg-[#1a1a2e]/60 rounded-2xl border border-white/5 hover:border-red-500/30 transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-400" />
            </div>
            <span className="text-red-400">Delete Account</span>
          </button>
        </div>
      </div>

      {/* App Info */}
      <div className="px-4 mt-8 mb-8 text-center">
        <p className="text-white/20 text-xs">Mystic Horoscope v1.0</p>
        <p className="text-white/20 text-xs mt-1">Made with ✨ cosmic energy</p>
      </div>

      {renderEditDialog()}
      {renderConfirmDialog()}
    </div>
  );
}

// Scroll Picker Component
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
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedIndex = values.indexOf(selected);
  const itemHeight = 40;
  const visibleItems = 5;
  const containerHeight = itemHeight * visibleItems;

  useEffect(() => {
    if (containerRef.current) {
      const scrollTop = selectedIndex * itemHeight;
      containerRef.current.scrollTo({ top: scrollTop, behavior: 'smooth' });
    }
  }, [selectedIndex]);

  const handleScrollEnd = () => {
    if (containerRef.current) {
      const scrollTop = containerRef.current.scrollTop;
      const nearestIndex = Math.round(scrollTop / itemHeight);
      const clampedIndex = Math.max(0, Math.min(nearestIndex, values.length - 1));
      
      if (clampedIndex !== selectedIndex) {
        onChange(values[clampedIndex]);
      }
      
      containerRef.current.scrollTo({ 
        top: clampedIndex * itemHeight, 
        behavior: 'smooth' 
      });
    }
  };

  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleScroll = () => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(handleScrollEnd, 100);
  };

  return (
    <div className={`${width} relative`}>
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />
      
      <div 
        className="absolute inset-x-0 z-5 border-t border-b border-gray-600 pointer-events-none"
        style={{ top: `${itemHeight * 2}px`, height: `${itemHeight}px` }}
      />
      
      <div
        ref={containerRef}
        className="overflow-y-auto scrollbar-hide touch-pan-y"
        style={{ height: `${containerHeight}px` }}
        onScroll={handleScroll}
      >
        <div style={{ height: `${itemHeight * 2}px` }} />
        
        {values.map((val, i) => {
          const isSelected = i === selectedIndex;
          return (
            <div
              key={i}
              onClick={() => onChange(val)}
              className={`flex items-center justify-center cursor-pointer transition-all duration-150 ${
                isSelected ? 'text-white text-xl font-semibold' : 'text-gray-500 text-base'
              }`}
              style={{ height: `${itemHeight}px` }}
            >
              {format(val)}
            </div>
          );
        })}
        
        <div style={{ height: `${itemHeight * 2}px` }} />
      </div>
    </div>
  );
}
