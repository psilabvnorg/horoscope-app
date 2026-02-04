# Horos - Astrology App

A comprehensive astrology application with swipe-based trait matching, tarot readings, couple compatibility analysis, and AI-powered fortune telling.

## Testing

The project includes comprehensive test coverage using Vitest and React Testing Library.

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Open test UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

See [docs/testing-guide.md](docs/testing-guide.md) for detailed testing documentation.

## Prerequisites

- Node.js (v18+)

## Setup

```bash
# Install frontend dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..
```

## Running the App

```bash
# Start the backend server (in one terminal)
cd server
npm start

# Start the frontend dev server (in another terminal)
npm run dev
```

## Build for Production

```bash
npm run build
npm run preview
```

## LLM Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
VITE_LLM_PROVIDER=ollama          # or "azure"
VITE_OLLAMA_URL=http://172.18.96.1:11434
VITE_OLLAMA_MODEL=deepseek-r1:8b
```

### System Prompts

Edit `src/lib/llm/prompts.ts` to customize AI personality for each page:

- `crystal-ball` - Crystal Ball oracle
- `dream` - Dream interpreter  
- `tarot` - Tarot reader
- `numerology` - Numerology expert
- `couple` - Relationship astrologer
- `fortune` - Fortune teller

User profile (name, zodiac, traits) is auto-injected into prompts.

## Internationalization (i18n)

The app supports 4 languages: English, Vietnamese, Korean, and Japanese.

### Quick Start

```bash
# Translate UI text
npm run translate

# Translate data files (zodiac, tarot, love)
npm run translate:data
```

### Documentation

- **UI Translation**: See [docs/i18n-guide.md](docs/i18n-guide.md)
- **Data Translation**: See [docs/data-translation-guide.md](docs/data-translation-guide.md)

## Data Files

Location: `src/data/`

| File | Description |
|------|-------------|
| `zodiac.json` | Personality descriptions for all 12 zodiac signs |
| `tarot.json` | Tarot card meanings (Major Arcana, Wands, Cups, Swords, Pentacles) |
| `love.json` | Zodiac compatibility descriptions for all sign pairings |
| `zodiac-star-calendar-2026.json` | Monthly energy forecasts by zodiac sign |

## Updating Data with LLM

Use `script/update-data.py` to update or fix data in the JSON files using an LLM.

```bash
python script/update-data.py
```

The script allows you to:
- Fix typos or errors in existing data
- Update descriptions with improved content
- Generate new entries using LLM assistance

## Documentation

- [App Description](docs/app-description.md) - Features and architecture
- [Design Specs](specs.md) - Figma design reference
- [i18n Guide](docs/i18n-guide.md) - UI translation guide
- [Data Translation Guide](docs/data-translation-guide.md) - Data file translation
- [i18n Integration Checklist](docs/i18n-integration-checklist.md) - Component integration steps
- [i18n Quick Start](docs/i18n-quickstart.md) - Quick reference

## Project Structure

```
├── src/
│   ├── components/        # React components
│   ├── data/              # JSON data files
│   ├── hooks/             # Custom React hooks
│   ├── i18n/              # i18n configuration
│   ├── lib/               # Utilities and LLM integration
│   ├── locales/           # UI translations (en, vi, ko, ja)
│   └── types/             # TypeScript types
├── server/                # Express backend (Ollama proxy)
├── script/                # Translation and data update scripts
├── docs/                  # Documentation
└── public/                # Static assets
```

## License

MIT
