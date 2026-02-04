import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../common/LanguageSwitcher';

/**
 * Demo page to test i18n translations
 * Add this to your app to see translations in action
 */
export function I18nDemo() {
  const { t } = useTranslation();
  const { t: tTarot } = useTranslation('tarot');
  const { t: tZodiac } = useTranslation('zodiac');
  const { t: tReadings } = useTranslation('readings');

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header with Language Switcher */}
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">{t('app.name')}</h1>
          <LanguageSwitcher />
        </div>

        <p className="text-xl text-purple-200">{t('app.tagline')}</p>

        {/* Navigation */}
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Navigation</h2>
          <div className="grid grid-cols-3 gap-4">
            <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded">
              {t('navigation.home')}
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded">
              {t('navigation.readings')}
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded">
              {t('navigation.tarot')}
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded">
              {t('navigation.fortune')}
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded">
              {t('navigation.love')}
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded">
              {t('navigation.settings')}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Actions</h2>
          <div className="flex flex-wrap gap-2">
            <button className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded text-sm">
              {t('actions.save')}
            </button>
            <button className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded text-sm">
              {t('actions.cancel')}
            </button>
            <button className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded text-sm">
              {t('actions.continue')}
            </button>
            <button className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded text-sm">
              {t('actions.submit')}
            </button>
          </div>
        </div>

        {/* With Variables */}
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">With Variables</h2>
          <p className="text-lg">{t('common.hello', { name: 'Alice' })}</p>
          <p className="text-lg">{t('common.greeting', { timeOfDay: t('time.morning'), name: 'Bob' })}</p>
        </div>

        {/* Tarot */}
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">{tTarot('title')}</h2>
          <p className="text-purple-200 mb-4">{tTarot('subtitle')}</p>
          <div className="space-y-2">
            <p>• {tTarot('dailyReading')}</p>
            <p>• {tTarot('threeCardSpread')}</p>
            <p>• {tTarot('selectCards')}</p>
          </div>
          <div className="mt-4 flex gap-4">
            <span className="bg-purple-700 px-3 py-1 rounded">{tTarot('spread.past')}</span>
            <span className="bg-purple-700 px-3 py-1 rounded">{tTarot('spread.present')}</span>
            <span className="bg-purple-700 px-3 py-1 rounded">{tTarot('spread.future')}</span>
          </div>
        </div>

        {/* Zodiac Signs */}
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">{tZodiac('title')}</h2>
          <div className="grid grid-cols-4 gap-2 text-sm">
            <span className="bg-red-600 px-2 py-1 rounded">{tZodiac('signs.aries')}</span>
            <span className="bg-green-600 px-2 py-1 rounded">{tZodiac('signs.taurus')}</span>
            <span className="bg-yellow-600 px-2 py-1 rounded">{tZodiac('signs.gemini')}</span>
            <span className="bg-blue-600 px-2 py-1 rounded">{tZodiac('signs.cancer')}</span>
            <span className="bg-orange-600 px-2 py-1 rounded">{tZodiac('signs.leo')}</span>
            <span className="bg-green-700 px-2 py-1 rounded">{tZodiac('signs.virgo')}</span>
            <span className="bg-pink-600 px-2 py-1 rounded">{tZodiac('signs.libra')}</span>
            <span className="bg-red-700 px-2 py-1 rounded">{tZodiac('signs.scorpio')}</span>
            <span className="bg-purple-600 px-2 py-1 rounded">{tZodiac('signs.sagittarius')}</span>
            <span className="bg-gray-600 px-2 py-1 rounded">{tZodiac('signs.capricorn')}</span>
            <span className="bg-cyan-600 px-2 py-1 rounded">{tZodiac('signs.aquarius')}</span>
            <span className="bg-blue-700 px-2 py-1 rounded">{tZodiac('signs.pisces')}</span>
          </div>
        </div>

        {/* Readings */}
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">{tReadings('title')}</h2>
          <div className="space-y-2">
            <p>🔮 {tReadings('birthChart.title')}</p>
            <p>✋ {tReadings('palmReading.title')}</p>
            <p>🔢 {tReadings('numerology.title')}</p>
            <p>💭 {tReadings('dreamExplain.title')}</p>
            <p>🔮 {tReadings('crystalBall.title')}</p>
          </div>
        </div>

        {/* Status Messages */}
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Status Messages</h2>
          <div className="space-y-2">
            <p className="text-yellow-300">⏳ {t('common.loading')}</p>
            <p className="text-red-300">❌ {t('common.error')}</p>
            <p className="text-green-300">✅ {t('common.success')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
