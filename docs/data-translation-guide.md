# Data Translation Guide

This guide explains how to translate the main data files (zodiac, tarot, love compatibility) into multiple languages.

## Overview

The app uses translated data files to provide localized content for zodiac descriptions, tarot meanings, and love compatibility readings. When users switch languages, the app automatically loads the appropriate translated data.

## Quick Start

### Translate All Data Files

```bash
npm run translate:data
```

This translates all data files to all supported languages (Vietnamese, Korean, Japanese).

### Translate Specific Languages

```bash
# Single language
npm run translate:data:vi
npm run translate:data:ko
npm run translate:data:ja

# Multiple languages
node script/translate-data.js --lang vi,ko

# Specific files
node script/translate-data.js --files zodiac.json,tarot.json

# Combine options
node script/translate-data.js --lang vi --files zodiac.json
```

## Data Files

The following data files can be translated:

- `src/data/zodiac.json` - Zodiac sign descriptions
- `src/data/tarot.json` - Tarot card meanings (Major Arcana and suits)
- `src/data/love.json` - Love compatibility between zodiac signs

## Translation Output

Translated files are saved in:
```
src/data/translations/
├── vi/
│   ├── zodiac.json
│   ├── tarot.json
│   └── love.json
├── ko/
│   ├── zodiac.json
│   ├── tarot.json
│   └── love.json
└── ja/
    ├── zodiac.json
    ├── tarot.json
    └── love.json
```

## Smart Batching

The script automatically handles large data files by:
- **Analyzing file size** and splitting into optimal batches
- **Respecting LLM context limits** (default: 8000 chars per batch)
- **Maintaining performance** (minimum 3 entries, maximum 20 entries per batch)
- **Preserving structure** (keeps related data together)
- **Handling failures gracefully** (continues with remaining batches if one fails)

Example output:
```
📝 Translating tarot.json to Vietnamese...
   File size: 28.45 KB (29132 chars)
   Split into 4 batch(es) for optimal translation
   Batch 1/4: 7.2 KB...
   ✅ Batch 1/4 completed
   Batch 2/4: 6.8 KB...
   ✅ Batch 2/4 completed
   ...
```

## Using Translated Data

The app uses the `useTranslatedData` hook to automatically load the correct language:

```typescript
import { useZodiacData, useTarotData, useLoveData } from '@/hooks/useTranslatedData';

function MyComponent() {
  const zodiacData = useZodiacData();
  const tarotData = useTarotData();
  const loveData = useLoveData();

  return (
    <div>
      <p>{zodiacData.Aries}</p>
      <p>{tarotData['MAJOR ARCANA']['The Fool']}</p>
      <p>{loveData.Aries.Taurus}</p>
    </div>
  );
}
```

When the user switches language:
1. The hook detects the language change
2. Loads the translated data file for that language
3. Falls back to English if translation not available
4. Caches loaded translations for performance

## Configuration

### Environment Variables (.env)

```env
# LLM Provider (ollama or azure)
VITE_LLM_PROVIDER=ollama

# Ollama Configuration
VITE_OLLAMA_URL=http://172.18.96.1:11434
VITE_OLLAMA_MODEL=deepseek-r1:8b

# Azure OpenAI Configuration (if using Azure)
VITE_AZURE_OPENAI_ENDPOINT=your-endpoint
VITE_AZURE_OPENAI_API_KEY=your-key
VITE_AZURE_OPENAI_DEPLOYMENT=gpt-4
```

### Batching Configuration

Adjust in `script/translate-data.js`:

```javascript
batching: {
  maxCharsPerBatch: 8000,    // Adjust based on LLM context window
  minEntriesPerBatch: 3,     // Avoid too many small requests
  maxEntriesPerBatch: 20,    // Balance size and manageability
}
```

**Recommendations by LLM context window:**
- **8K tokens**: 6000-8000 chars per batch
- **32K tokens**: 15000-20000 chars per batch
- **128K+ tokens**: 30000-50000 chars per batch

## Adding New Languages

1. Edit `script/translate-data.js`:
```javascript
const config = {
  targetLanguages: ['vi', 'ko', 'ja', 'es'], // Add 'es'
};

const languageNames = {
  vi: 'Vietnamese',
  ko: 'Korean',
  ja: 'Japanese',
  es: 'Spanish', // Add Spanish
};
```

2. Add zodiac translations to glossary:
```javascript
const zodiacGlossary = {
  'Aries': { vi: 'Bạch Dương', ko: '양자리', ja: '牡羊座', es: 'Aries' },
  // ... add for all signs
};
```

3. Run translation:
```bash
npm run translate:data
```

## Updating Components

### Before:
```typescript
import zodiacData from '@/data/zodiac.json';

function ZodiacDetail() {
  const description = zodiacData[sign];
}
```

### After:
```typescript
import { useZodiacData } from '@/hooks/useTranslatedData';

function ZodiacDetail() {
  const zodiacData = useZodiacData();
  const description = zodiacData[sign];
}
```

## Translation Quality

The script ensures:
- Accurate astrological terminology
- Culturally appropriate expressions
- Consistent zodiac sign names
- Preserved spiritual/mystical tone
- Natural, native-sounding translations

## Troubleshooting

### Translation fails
- Check your LLM is running (Ollama) or API key is valid (Azure)
- Verify network connectivity
- Check console for error messages

### Missing translations
- App automatically falls back to English
- Check if files exist in `src/data/translations/{lang}/`
- Re-run the translation script

### Incorrect translations
- Edit translated JSON files directly
- Or update glossary in `script/translate-data.js` and re-run

## Best Practices

1. **Version Control**: Commit translated files to git
2. **Review**: Manually review translations for accuracy
3. **Consistency**: Use same LLM model for all translations
4. **Backup**: Keep backups before re-running translations
5. **Testing**: Test each language after translation
6. **Monthly Updates**: Run translations monthly to keep content fresh
