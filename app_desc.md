# Horos - Astrology & Tarot App

A comprehensive astrology application with swipe-based trait matching, tarot readings, couple compatibility analysis, and AI-powered fortune telling.

## Features

### 1. Swipe (Trait Matching)
- Swipe through personalized horoscope trait cards
- Right swipe: "This describes me" - saves trait
- Left swipe: "Not me" - rejects trait
- Up swipe: "Very accurate" - saves with higher interest
- Personalized deck based on accepted/rejected traits

### 2. Tarot
- Daily card reading (deterministic based on date & sign)
- Three-card spread (Past, Present, Future)
- Relationship tarot (if partner added)
- Reading history
- AI chat for interpretation

### 3. Couple Compatibility
- Compatibility score (0-100)
- Strengths and weaknesses analysis
- Daily relationship message
- 3-card relationship tarot spread
- AI chat for relationship advice

### 4. Fortune Teller
- Pre-generated fortunes for different topics:
  - Future
  - Love
  - Career
  - Money
  - Life
- Regenerate button for new fortunes
- AI chat for deeper insights

## Tech Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend**: Node.js + Express (optional, for Ollama proxy)
- **AI**: Ollama (local LLM) with deepseek-r1:8b model
- **Storage**: LocalStorage (offline-first)

## Project Structure

```
app/
├── src/
│   ├── components/
│   │   ├── onboarding/     # Onboarding flow
│   │   ├── swipe/          # Swipe card components
│   │   ├── tarot/          # Tarot reading components
│   │   ├── couple/         # Couple compatibility
│   │   ├── fortune/        # Fortune teller
│   │   ├── settings/       # Settings page
│   │   └── common/         # Shared components
│   ├── data/
│   │   ├── tarotCards.ts   # 78 tarot card definitions
│   │   ├── traits.ts       # Horoscope traits
│   │   └── horoscopeContent.ts # Content generators
│   ├── hooks/
│   │   ├── useLocalStorage.ts
│   │   ├── useUserProfile.ts
│   │   ├── useTarot.ts
│   │   └── useChat.ts
│   ├── types/
│   │   └── index.ts        # TypeScript types
│   └── App.tsx
├── server/
│   ├── index.js            # Express server with Ollama proxy
│   └── package.json
├── public/
│   └── tarot/              # Tarot card images
└── dist/                   # Build output
```

## Setup Instructions

### Frontend Only (Static)

1. Build the app:
```bash
cd app
npm install
npm run build
```

2. Serve the `dist` folder with any static server.

### With Backend (Ollama Integration)

1. Install Ollama: https://ollama.ai

2. Pull the deepseek model:
```bash
ollama pull deepseek-r1:8b
```

3. Start Ollama:
```bash
ollama serve
```

4. Install and start the backend:
```bash
cd app/server
npm install
npm start
```

5. Build and serve the frontend:
```bash
cd app
npm run build
# Serve dist folder
```

## Environment Variables

Create `.env` in the app root:
```
VITE_OLLAMA_URL=http://localhost:11434
```

## User Model

```typescript
{
  name: string;
  birthday: string;
  gender: 'male' | 'female' | 'other';
  sign: ZodiacSign;
  partnerBirthday?: string;
  partnerSign?: ZodiacSign;
  acceptedTraits: string[];
  rejectedTraits: string[];
  swipeCount: number;
  interests: Record<string, number>;
  createdAt: string;
}
```

## Swipe Semantics

| Action | Meaning | Effect |
|--------|---------|--------|
| Right | "This describes me" | Save trait + increase topic interest |
| Up | "Very accurate / want details" | Save trait + stronger interest |
| Left | "Not me" | Discard (add to rejectedTraits) |
| Tap | "View details" | No effect |

## API Endpoints (Backend)

- `GET /api/health` - Health check
- `POST /api/chat` - Ollama proxy
- `GET /api/ollama/status` - Check Ollama availability
- `GET /api/content/:type/:sign/:gender/:day` - Get horoscope content
- `GET /api/deck` - Get personalized trait deck
- `POST /api/swipe` - Record swipe action
- `GET /api/tarot/daily` - Get daily tarot card
- `GET /api/couple/:signA/:signB` - Get compatibility
- `GET /api/fortune/:topic` - Get fortune

## Non-Functional Requirements

- ✅ Offline first (LocalStorage)
- ✅ Cold start < 1s
- ✅ 60 FPS swipe animations
- ✅ Content < 10 MB
- ✅ Deterministic daily results
- ✅ No login required
- ✅ Privacy friendly
- ✅ Non-blocking UI

## License

MIT
