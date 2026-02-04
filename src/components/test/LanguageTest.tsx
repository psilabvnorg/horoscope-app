import { useTranslation } from 'react-i18next';

/**
 * Simple test component to verify language switching works
 */
export function LanguageTest() {
  const { t, i18n } = useTranslation();

  return (
    <div className="p-4 space-y-4 bg-white/5 rounded-lg">
      <h2 className="text-xl font-bold">Language Test</h2>
      
      <div className="space-y-2">
        <p>Current Language: <strong>{i18n.language}</strong></p>
        <p>App Name: <strong>{t('app.name')}</strong></p>
        <p>Tagline: <strong>{t('app.tagline')}</strong></p>
        <p>Home: <strong>{t('navigation.home')}</strong></p>
        <p>Settings: <strong>{t('navigation.settings')}</strong></p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => i18n.changeLanguage('en')}
          className="px-4 py-2 bg-blue-500 rounded"
        >
          English
        </button>
        <button
          onClick={() => i18n.changeLanguage('vi')}
          className="px-4 py-2 bg-green-500 rounded"
        >
          Tiếng Việt
        </button>
        <button
          onClick={() => i18n.changeLanguage('ko')}
          className="px-4 py-2 bg-yellow-500 rounded"
        >
          한국어
        </button>
        <button
          onClick={() => i18n.changeLanguage('ja')}
          className="px-4 py-2 bg-red-500 rounded"
        >
          日本語
        </button>
      </div>
    </div>
  );
}
