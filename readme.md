# Horos - Astrology App

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

## Data Files

Location: `D:\AI\horoscope\data` (or `./data` relative to project root)

This folder contains the core database files used by the app:

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
