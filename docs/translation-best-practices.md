# Translation Best Practices

## Overview
This document outlines the scalable approach for managing translations in the application.

## Architecture

### 1. Translation File Structure
```
src/locales/
├── en/           # English (default)
│   ├── common.json
│   ├── readings.json
│   ├── tarot.json
│   └── zodiac.json
├── ja/           # Japanese
├── ko/           # Korean
└── vi/           # Vietnamese
```

### 2. Translation Key Naming Convention

Use hierarchical keys with dot notation:

```json
{
  "section": {
    "subsection": {
      "key": "Translation text"
    }
  }
}
```

**Examples:**
- `home.affirmation` - Top-level section
- `readings.palmReadingResult.title` - Nested structure
- `actions.readMore` - Common actions

### 3. Component Usage

#### Import and Setup
```tsx
import { useTranslation } from 'react-i18next';

export function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('section.title')}</h1>
      <p>{t('section.description')}</p>
    </div>
  );
}
```

#### With Variables
```tsx
// In locale file:
{
  "greeting": "Hello, {{name}}!",
  "dailyTips": "Daily tips for {{sign}}"
}

// In component:
<p>{t('greeting', { name: userName })}</p>
<h2>{t('dailyTips', { sign: userSign })}</h2>
```

## Scalable Workflow

### Step 1: Add English Keys First
Always add new translation keys to `src/locales/en/*.json` first:

```json
{
  "newFeature": {
    "title": "New Feature",
    "description": "Description of the feature"
  }
}
```

### Step 2: Use in Components
Replace hardcoded strings with translation keys:

```tsx
// ❌ Bad
<h1>New Feature</h1>
<p>Description of the feature</p>

// ✅ Good
<h1>{t('newFeature.title')}</h1>
<p>{t('newFeature.description')}</p>
```

### Step 3: Translate to Other Languages
Use the translation scripts to generate translations:

```bash
# Translate UI strings
node script/translate-i18n.js

# Translate data files
node script/translate-data.js
```

### Step 4: Verify Translations
Check translations are working:
1. Switch language in the app
2. Verify all text is translated
3. Check for missing keys in console

## Finding Untranslated Strings

Run the detection script:

```bash
node script/find-untranslated.js
```

This will scan all components and report potential hardcoded strings.

## Common Patterns

### 1. Lists and Arrays
```tsx
const items = [
  { label: t('item.first'), value: 1 },
  { label: t('item.second'), value: 2 },
];
```

### 2. Conditional Text
```tsx
<p>{isActive ? t('status.active') : t('status.inactive')}</p>
```

### 3. Pluralization
```json
{
  "cards": "{{count}} card",
  "cards_plural": "{{count}} cards"
}
```

```tsx
<p>{t('cards', { count: cardCount })}</p>
```

### 4. Date Formatting
Use i18n date formatting for locale-aware dates:

```tsx
const date = new Date();
const formattedDate = date.toLocaleDateString(i18n.language, {
  month: 'long',
  day: 'numeric',
  year: 'numeric'
});
```

## Translation File Organization

### common.json
- App-wide strings
- Navigation
- Common actions (save, cancel, etc.)
- Time-related terms
- Generic UI elements

### Feature-specific files (readings.json, tarot.json, etc.)
- Feature-specific terminology
- Feature UI text
- Feature-specific actions

## Best Practices

### ✅ DO:
- Use descriptive key names
- Group related translations
- Keep translations in appropriate files
- Use variables for dynamic content
- Test all language switches
- Keep translation keys consistent across languages

### ❌ DON'T:
- Hardcode English text in components
- Use generic key names like `text1`, `label2`
- Mix different features in the same translation section
- Translate technical terms (API keys, code, etc.)
- Forget to add keys to all language files

## Maintenance

### Adding New Languages
1. Create new language folder: `src/locales/[lang]/`
2. Copy structure from `en/` folder
3. Translate all JSON files
4. Add language to `src/i18n/config.ts`
5. Test language switching

### Updating Existing Translations
1. Update English version first
2. Run translation scripts
3. Review auto-translated content
4. Manually adjust if needed

## Tools

### Translation Scripts
- `script/translate-i18n.js` - Translate UI strings
- `script/translate-data.js` - Translate data files
- `script/find-untranslated.js` - Find hardcoded strings

### Verification
```bash
# Check for missing translation keys
npm run check-translations

# Find untranslated strings
node script/find-untranslated.js
```

## Troubleshooting

### Missing Translation Keys
If you see a translation key instead of text:
1. Check if key exists in locale file
2. Verify correct namespace
3. Check for typos in key name
4. Ensure language file is loaded

### Text Not Updating
1. Clear browser cache
2. Restart dev server
3. Check i18n configuration
4. Verify language is properly set

## Examples

### Complete Component Example
```tsx
import { useTranslation } from 'react-i18next';

export function ReadingsPage() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('readings.title')}</h1>
      <p>{t('readings.subtitle')}</p>
      
      <button onClick={handleClick}>
        {t('actions.readMore')}
      </button>
      
      <div>
        {items.map(item => (
          <div key={item.id}>
            <h3>{t(`readings.${item.type}.title`)}</h3>
            <p>{t(`readings.${item.type}.description`)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Summary

This scalable approach ensures:
- ✅ Consistent translation management
- ✅ Easy maintenance and updates
- ✅ Automated translation workflows
- ✅ Quick detection of untranslated content
- ✅ Clear organization and structure
