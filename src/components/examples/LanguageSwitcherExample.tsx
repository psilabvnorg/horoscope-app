import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import { Globe, Check } from 'lucide-react';

/**
 * OPTION 1: Simple Button Group (Recommended)
 * Clean and easy to use
 */
export function SimpleLanguageSwitcher() {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
  ];

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-5 h-5" />
      <div className="flex gap-2">
        {languages.map((lang) => (
          <Button
            key={lang.code}
            variant={i18n.language === lang.code ? 'default' : 'outline'}
            size="sm"
            onClick={() => i18n.changeLanguage(lang.code)}
          >
            {lang.flag} {lang.name}
          </Button>
        ))}
      </div>
    </div>
  );
}

/**
 * OPTION 2: Compact Flag Buttons
 * Space-saving design
 */
export function CompactLanguageSwitcher() {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', flag: '🇺🇸' },
    { code: 'vi', flag: '🇻🇳' },
    { code: 'ko', flag: '🇰🇷' },
    { code: 'ja', flag: '🇯🇵' },
  ];

  return (
    <div className="flex gap-1">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => i18n.changeLanguage(lang.code)}
          className={`
            text-2xl p-2 rounded transition-all
            ${i18n.language === lang.code 
              ? 'bg-purple-600 scale-110' 
              : 'hover:bg-gray-700 opacity-60 hover:opacity-100'
            }
          `}
          title={lang.code.toUpperCase()}
        >
          {lang.flag}
        </button>
      ))}
    </div>
  );
}

/**
 * OPTION 3: Dropdown Menu
 * Best for limited space
 */
export function DropdownLanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
  ];

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <Globe className="w-4 h-4" />
        {currentLang.flag} {currentLang.name}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                i18n.changeLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`
                w-full px-4 py-2 text-left flex items-center justify-between
                hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg
                ${i18n.language === lang.code ? 'bg-purple-600' : ''}
              `}
            >
              <span className="flex items-center gap-2">
                {lang.flag} {lang.name}
              </span>
              {i18n.language === lang.code && <Check className="w-4 h-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * OPTION 4: Settings Page Style
 * Radio buttons with descriptions
 */
export function SettingsLanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸', native: 'English' },
    { code: 'vi', name: 'Vietnamese', flag: '🇻🇳', native: 'Tiếng Việt' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷', native: '한국어' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵', native: '日本語' },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{t('settings.language')}</h3>
      <div className="space-y-2">
        {languages.map((lang) => (
          <label
            key={lang.code}
            className={`
              flex items-center gap-3 p-4 rounded-lg border cursor-pointer
              transition-all
              ${i18n.language === lang.code
                ? 'border-purple-500 bg-purple-500/10'
                : 'border-gray-700 hover:border-gray-600'
              }
            `}
          >
            <input
              type="radio"
              name="language"
              checked={i18n.language === lang.code}
              onChange={() => i18n.changeLanguage(lang.code)}
              className="w-4 h-4"
            />
            <span className="text-2xl">{lang.flag}</span>
            <div className="flex-1">
              <div className="font-medium">{lang.native}</div>
              <div className="text-sm text-gray-400">{lang.name}</div>
            </div>
            {i18n.language === lang.code && (
              <Check className="w-5 h-5 text-purple-500" />
            )}
          </label>
        ))}
      </div>
    </div>
  );
}

/**
 * OPTION 5: Programmatic Switch
 * Use anywhere in your code
 */
export function ProgrammaticExample() {
  const { i18n } = useTranslation();

  // Switch language programmatically
  const handleSomeAction = () => {
    // Example: Auto-detect user's browser language
    const browserLang = navigator.language.split('-')[0]; // 'en', 'vi', 'ko', 'ja'
    if (['en', 'vi', 'ko', 'ja'].includes(browserLang)) {
      i18n.changeLanguage(browserLang);
    }
  };

  return (
    <div className="space-y-4">
      <h3>Programmatic Language Switch</h3>
      
      {/* Direct buttons */}
      <div className="flex gap-2">
        <Button onClick={() => i18n.changeLanguage('en')}>English</Button>
        <Button onClick={() => i18n.changeLanguage('vi')}>Vietnamese</Button>
        <Button onClick={() => i18n.changeLanguage('ko')}>Korean</Button>
        <Button onClick={() => i18n.changeLanguage('ja')}>Japanese</Button>
      </div>

      {/* Auto-detect */}
      <Button onClick={handleSomeAction}>
        Auto-detect Browser Language
      </Button>

      {/* Current language */}
      <p>Current: {i18n.language}</p>
    </div>
  );
}

/**
 * OPTION 6: Mobile-Friendly Bottom Sheet
 * Great for mobile apps
 */
export function MobileLanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
  ];

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800"
      >
        <Globe className="w-5 h-5" />
        <span>{currentLang.flag} {currentLang.name}</span>
      </button>

      {/* Bottom Sheet */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
          <div className="w-full max-w-md bg-gray-900 rounded-t-2xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Select Language</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400">
                ✕
              </button>
            </div>

            <div className="space-y-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    i18n.changeLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 p-4 rounded-lg
                    ${i18n.language === lang.code
                      ? 'bg-purple-600'
                      : 'bg-gray-800 hover:bg-gray-700'
                    }
                  `}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="flex-1 text-left">{lang.name}</span>
                  {i18n.language === lang.code && <Check className="w-5 h-5" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Add missing React import
import React from 'react';
