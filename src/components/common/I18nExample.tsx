import { useTranslation } from 'react-i18next';

/**
 * Example component showing how to use i18n translations
 * 
 * Usage patterns:
 * 1. Basic translation: t('key')
 * 2. With namespace: t('tarot:title')
 * 3. With interpolation: t('common.hello', { name: 'John' })
 * 4. Nested keys: t('navigation.home')
 */
export function I18nExample() {
  const { t } = useTranslation();
  
  // You can also specify namespace
  const { t: tTarot } = useTranslation('tarot');
  const { t: tZodiac } = useTranslation('zodiac');

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">i18n Usage Examples</h2>
      
      {/* Basic translation */}
      <div>
        <p className="font-semibold">Basic:</p>
        <p>{t('navigation.home')}</p>
        <p>{t('actions.save')}</p>
      </div>

      {/* With interpolation */}
      <div>
        <p className="font-semibold">With variables:</p>
        <p>{t('common.hello', { name: 'User' })}</p>
        <p>{t('common.greeting', { timeOfDay: 'morning', name: 'Alice' })}</p>
      </div>

      {/* Different namespaces */}
      <div>
        <p className="font-semibold">Different namespaces:</p>
        <p>{tTarot('title')}</p>
        <p>{tZodiac('title')}</p>
        <p>{t('readings:birthChart.title')}</p>
      </div>

      {/* Nested objects */}
      <div>
        <p className="font-semibold">Nested keys:</p>
        <p>{t('settings.title')}</p>
        <p>{t('settings.language')}</p>
      </div>
    </div>
  );
}

/**
 * Quick reference for common patterns:
 * 
 * // In your components:
 * import { useTranslation } from 'react-i18next';
 * 
 * function MyComponent() {
 *   const { t } = useTranslation();
 *   // or with specific namespace:
 *   const { t } = useTranslation('tarot');
 *   
 *   return (
 *     <div>
 *       <h1>{t('title')}</h1>
 *       <p>{t('common.hello', { name: userName })}</p>
 *     </div>
 *   );
 * }
 * 
 * // Change language programmatically:
 * const { i18n } = useTranslation();
 * i18n.changeLanguage('vi'); // or 'ko', 'ja', 'en'
 * 
 * // Get current language:
 * const currentLang = i18n.language;
 */
