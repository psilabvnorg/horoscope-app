# Translation Quick Reference

## Quick Start

### 1. Use Translation in Component
```tsx
import { useTranslation } from 'react-i18next';

export function MyComponent() {
  const { t } = useTranslation();
  
  return <h1>{t('section.key')}</h1>;
}
```

### 2. Add Translation Key
In `src/locales/en/common.json`:
```json
{
  "section": {
    "key": "Your text here"
  }
}
```

### 3. With Variables
```tsx
// In locale file:
{ "greeting": "Hello, {{name}}!" }

// In component:
<p>{t('greeting', { name: 'John' })}</p>
```

## File Organization

| File | Purpose |
|------|---------|
| `common.json` | App-wide UI, navigation, actions |
| `readings.json` | Readings feature |
| `tarot.json` | Tarot feature |
| `zodiac.json` | Zodiac data |

## Common Patterns

### Actions
```tsx
{t('actions.save')}
{t('actions.cancel')}
{t('actions.readMore')}
```

### Navigation
```tsx
{t('navigation.home')}
{t('navigation.readings')}
```

### Time
```tsx
{t('common.today')}
{t('common.tomorrow')}
```

## Tools

### Find Untranslated Strings
```bash
node script/find-untranslated.js
```

### Translate to Other Languages
```bash
node script/translate-i18n.js
```

## Key Naming

✅ **Good**
- `home.affirmation`
- `readings.palmReadingDesc`
- `actions.readMore`

❌ **Bad**
- `text1`
- `label`
- `homePageTitle`

## Checklist

- [ ] Added English key to locale file
- [ ] Used `t()` in component
- [ ] Tested language switching
- [ ] Ran detection script
- [ ] Updated other languages

## Common Issues

**Key not found?**
- Check spelling
- Verify file structure
- Restart dev server

**Text not updating?**
- Clear browser cache
- Check language setting
- Verify key exists

## Examples

### Simple Text
```tsx
<h1>{t('home.title')}</h1>
```

### With Variable
```tsx
<p>{t('home.dailyTips', { sign: userSign })}</p>
```

### Conditional
```tsx
{isActive ? t('status.active') : t('status.inactive')}
```

### In Array
```tsx
const items = [
  { label: t('item.first'), value: 1 },
  { label: t('item.second'), value: 2 }
];
```
