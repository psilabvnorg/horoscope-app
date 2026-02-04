# Horos - Astrology & Mystical Guidance App

A modern astrology application featuring personalized horoscopes, tarot readings, love compatibility, and AI-powered mystical guidance.

## 🎯 Core Features

### 1. Home (Horoscope)
**Purpose**: Daily personalized horoscope and astrological insights

**Features**:
- User zodiac profile with visual display
- Daily horoscope reading
- Personality profile based on zodiac sign
- Daily guidance (affirmation + love tip)
- Today's compatibility match
- Monthly energy forecast

**Data Sources**:
- `src/data/zodiac.json` - Zodiac descriptions
- `src/data/zodiac-star-calendar-2026.json` - Monthly forecasts
- `src/data/love.json` - Compatibility data

### 2. Readings
**Purpose**: Various mystical reading methods

**Sub-features**:
- **Tarot Cards**: Daily tarot, 3-card spreads, love readings, card library
- **Palm Reading**: Upload palm photo for AI analysis
- **Birth Chart**: Detailed astrological birth chart reading

**Data Sources**:
- `src/data/tarot.json` - Tarot card meanings
- `src/data/tarotCards.ts` - 78 card definitions with images

### 3. Love (Compatibility)
**Purpose**: Zodiac compatibility analysis

**Features**:
- Select partner's zodiac sign
- Compatibility score and description
- Relationship strengths/challenges
- AI chat for relationship advice

**Data Sources**:
- `src/data/love.json` - All zodiac pair compatibility texts

### 4. Guidance (Fortune)
**Purpose**: AI-powered mystical guidance

**Sub-features**:
- **Crystal Ball**: Ask questions, get mystical answers
- **Dream Interpretation**: Analyze dream meanings
- **Numerology**: Life path numbers and meanings

**AI Provider**: Ollama (local) or Azure OpenAI

### 5. Settings (Profile)
**Purpose**: User profile and app settings

**Features**:
- Edit profile (name, birthday, gender)
- Add/remove partner
- Language selection (EN, VI, KO, JA)
- Clear history
- Delete account

---

## 🏗️ Architecture

### Frontend Stack
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + custom components
- **State Management**: React hooks + Context
- **Routing**: Client-side (single page app)
- **i18n**: react-i18next (4 languages)
- **Storage**: LocalStorage (offline-first)

### Backend Stack
- **Server**: Node.js + Express (optional)
- **Purpose**: Proxy for Ollama API (CORS bypass)
- **Port**: 3001
- **Endpoints**: `/api/generate` (POST)

### AI Integration
- **Primary**: Ollama (local LLM)
  - Model: deepseek-r1:8b or similar
  - URL: http://localhost:11434
- **Fallback**: Azure OpenAI
  - Configurable via environment variables

---

## 📁 Project Structure

```
horos/
├── src/
│   ├── components/
│   │   ├── common/              # Reusable components
│   │   │   ├── ChatPanel.tsx    # Chat UI
│   │   │   ├── ModalPanel.tsx   # Modal overlay
│   │   │   ├── PageHeader.tsx   # Page header
│   │   │   └── ZodiacSignCard.tsx
│   │   ├── home/                # Home page
│   │   │   ├── HomePage.tsx
│   │   │   └── MonthlyEnergy.tsx
│   │   ├── readings/            # Readings pages
│   │   │   ├── ReadingsPage.tsx
│   │   │   ├── PalmReadingIntro.tsx
│   │   │   └── BirthChartReading.tsx
│   │   ├── tarot/               # Tarot components
│   │   │   ├── TarotPage.tsx
│   │   │   ├── TarotCard.tsx
│   │   │   └── CardLibrary.tsx
│   │   ├── love/                # Love compatibility
│   │   │   └── LovePage.tsx
│   │   ├── fortune/             # Fortune pages
│   │   │   ├── FortunePage.tsx
│   │   │   ├── CrystalBallPage.tsx
│   │   │   ├── DreamExplainPage.tsx
│   │   │   └── NumerologyPage.tsx
│   │   ├── settings/            # Settings
│   │   │   └── SettingsPage.tsx
│   │   ├── onboarding/          # First-time setup
│   │   │   └── OnboardingFlow.tsx
│   │   └── ui/                  # UI primitives
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       └── gradient-button.tsx
│   ├── hooks/
│   │   ├── useUserProfile.ts    # User data management
│   │   ├── useChat.ts           # AI chat logic
│   │   ├── useChatUI.ts         # Chat UI state
│   │   ├── useTarot.ts          # Tarot logic
│   │   ├── useTranslatedData.ts # i18n data loading
│   │   ├── useAsyncData.ts      # Generic data loading
│   │   └── useI18n.ts           # i18n utilities
│   ├── lib/
│   │   ├── llm/                 # AI integration
│   │   │   ├── service.ts       # API calls
│   │   │   ├── prompts.ts       # System prompts
│   │   │   └── config.ts        # LLM config
│   │   └── utils.ts             # Utilities
│   ├── data/
│   │   ├── zodiac.json          # Zodiac descriptions
│   │   ├── tarot.json           # Tarot meanings
│   │   ├── love.json            # Compatibility
│   │   ├── tarotCards.ts        # Card definitions
│   │   ├── traits.ts            # Personality traits (hidden)
│   │   └── translations/        # Translated data
│   │       ├── ja/
│   │       ├── ko/
│   │       └── vi/
│   ├── locales/                 # UI translations
│   │   ├── en/
│   │   ├── ja/
│   │   ├── ko/
│   │   └── vi/
│   ├── i18n/
│   │   └── config.ts            # i18n setup
│   ├── types/
│   │   └── index.ts             # TypeScript types
│   └── App.tsx                  # Main app component
├── server/
│   ├── index.js                 # Express server
│   └── package.json
├── docs/                        # Documentation
├── public/                      # Static assets
│   ├── tarot/                   # Tarot card images
│   └── figma/                   # Design assets
└── dist/                        # Build output
```

---

## 🔄 Backend Flow

### 1. Ollama Proxy Server (Optional)

**Purpose**: Bypass CORS restrictions when calling Ollama from browser

**Flow**:
```
Browser → Express Server → Ollama → Express → Browser
         (localhost:3001)   (localhost:11434)
```

**Endpoint**: `POST /api/generate`

**Request**:
```json
{
  "model": "deepseek-r1:8b",
  "prompt": "System: You are a mystical guide...\n\nUser: What does my future hold?\n\nAssistant:",
  "stream": false
}
```

**Response**:
```json
{
  "response": "The stars reveal...",
  "done": true
}
```

### 2. Direct Ollama (No Server)

**Flow**:
```
Browser → Ollama (localhost:11434)
```

**Configuration**: Set `VITE_OLLAMA_URL` in `.env`

### 3. Azure OpenAI (Alternative)

**Flow**:
```
Browser → Azure OpenAI API
```

**Configuration**: Set Azure credentials in `.env`

---

## 🎨 Frontend Design - Page by Page

### 1. Home Page (Horoscope)

**Route**: `/` (default tab)

**Layout**:
```
┌─────────────────────────┐
│      HOROSCOPE         │ ← Header
├─────────────────────────┤
│   Tiffany Watson       │ ← User name
│   Jan 1, 1990          │ ← Birthday
│                         │
│   [Zodiac Image]       │ ← Centered zodiac
│   [CANCER] [i]         │ ← Sign + info button
├─────────────────────────┤
│ YOUR PROFILE           │ ← Personality
│ "Description..."       │
├─────────────────────────┤
│ DAILY GUIDANCE         │ ← Combined section
│ ✨ Affirmation         │
│ ❤️  Love Tip           │
├─────────────────────────┤
│ TODAY'S HOROSCOPE      │ ← Main content
│ "Your horoscope..."    │
├─────────────────────────┤
│ 💕 TODAY'S MATCH       │ ← Compatibility
│ [Leo] Great match!     │
│ [View Compatibility]   │
├─────────────────────────┤
│ MONTHLY ENERGY         │ ← Forecast
│ [Energy cards]         │
└─────────────────────────┘
```

**Components Used**:
- `HomePageSimplified.tsx`
- `MonthlyEnergy.tsx`
- `ZodiacDetail.tsx` (modal)
- `Card` (UI component)
- `GradientButton` (UI component)

**Data Flow**:
1. Load user profile from localStorage
2. Load zodiac data (translated)
3. Load love compatibility data
4. Calculate today's match (deterministic)
5. Display monthly energy from calendar

**Interactions**:
- Click zodiac → Open detail modal
- Click match → Open compatibility modal
- Scroll to see all sections

---

### 2. Readings Page

**Route**: `/readings` tab

**Main Menu Layout**:
```
┌─────────────────────────┐
│      READINGS          │
├─────────────────────────┤
│ ┌───────────────────┐  │
│ │  🃏 Tarot Cards   │  │ ← Navigate to tarot
│ │  Discover insights│  │
│ └───────────────────┘  │
│ ┌───────────────────┐  │
│ │  🖐️ Palm Reading  │  │ ← Navigate to palm
│ │  Read your palm   │  │
│ └───────────────────┘  │
│ ┌───────────────────┐  │
│ │  ⭐ Birth Chart   │  │ ← Navigate to chart
│ │  Your birth chart │  │
│ └───────────────────┘  │
└─────────────────────────┘
```

#### 2a. Tarot Cards

**Sub-routes**:
- `/readings/tarot` - Reading type selection
- `/readings/tarot-selection` - Card selection
- `/readings/tarot-reading` - Reading result
- `/readings/card-library` - All cards

**Reading Flow**:
```
Select Type → Select Cards → View Reading → Chat
(Daily/Love)   (1 or 3)      (AI analysis)  (Ask questions)
```

**Components**:
- `TarotCardsPage.tsx` - Type selection
- `TarotCardSelection.tsx` - Card picker
- `TarotPage.tsx` - Reading display
- `CardLibrary.tsx` - Card reference
- `ChatPanel.tsx` - AI chat

**Data Flow**:
1. User selects reading type
2. System shuffles deck (deterministic for daily)
3. User selects cards or auto-draw
4. Display cards with meanings
5. AI generates interpretation
6. User can chat for more insights

#### 2b. Palm Reading

**Flow**:
```
Intro → Upload Photo → AI Analysis → Result
```

**Components**:
- `PalmReadingIntro.tsx`
- `PalmReadingResult.tsx`

#### 2c. Birth Chart

**Components**:
- `BirthChartReading.tsx`

**Data**: Uses user's birth date and zodiac sign

---

### 3. Love Page (Compatibility)

**Route**: `/love` tab

**Layout**:
```
┌─────────────────────────┐
│    LOVE & COMPATIBILITY │
├─────────────────────────┤
│   Your Sign: Cancer     │
│   [Cancer Symbol]       │
├─────────────────────────┤
│   Partner's Sign        │
│   [Select Zodiac]       │
│                         │
│ ♈ ♉ ♊ ♋ ♌ ♍           │ ← Zodiac grid
│ ♎ ♏ ♐ ♑ ♒ ♓           │
├─────────────────────────┤
│ COMPATIBILITY           │
│ Cancer + Leo            │
│ "You two share..."      │
│                         │
│ [Ask About Relationship]│
└─────────────────────────┘
```

**Components**:
- `LovePage.tsx`
- `ZodiacSignCard.tsx`
- `ChatPanel.tsx` (for questions)

**Data Flow**:
1. Display user's zodiac
2. Show zodiac selector for partner
3. Load compatibility text from `love.json`
4. Display compatibility analysis
5. Enable AI chat for relationship advice

**Interactions**:
- Select partner sign → Show compatibility
- Click chat → Open AI chat with context

---

### 4. Guidance Page (Fortune)

**Route**: `/guidance` tab

**Main Menu Layout**:
```
┌─────────────────────────┐
│      GUIDANCE          │
├─────────────────────────┤
│ ┌───────────────────┐  │
│ │  🔮 Crystal Ball  │  │
│ │  Ask anything     │  │
│ └───────────────────┘  │
│ ┌───────────────────┐  │
│ │  💭 Dream Explain │  │
│ │  Interpret dreams │  │
│ └───────────────────┘  │
│ ┌───────────────────┐  │
│ │  🔢 Numerology    │  │
│ │  Life path number │  │
│ └───────────────────┘  │
└─────────────────────────┘
```

#### 4a. Crystal Ball

**Layout**:
```
┌─────────────────────────┐
│  ← CRYSTAL BALL        │
├─────────────────────────┤
│   [Crystal Ball Image]  │
│                         │
│   Suggested Questions:  │
│   • What's my future?   │
│   • Will I find love?   │
│   • Career guidance?    │
│                         │
│   [Start Chat] [🎤]     │
└─────────────────────────┘
```

**Components**:
- `CrystalBallPage.tsx`
- `ChatInterface.tsx` (uses ChatPanel)

**Flow**:
1. Show crystal ball visual
2. Display suggested questions
3. User clicks or types question
4. AI responds with mystical guidance
5. Continuous chat conversation

#### 4b. Dream Interpretation

**Layout**:
```
┌─────────────────────────┐
│  ← DREAM EXPLAIN       │
├─────────────────────────┤
│   [Dream Image]         │
│                         │
│   Describe your dream:  │
│   ┌─────────────────┐  │
│   │                 │  │
│   │  [Text Area]    │  │
│   │                 │  │
│   └─────────────────┘  │
│                         │
│   [Reveal Dream Meaning]│
└─────────────────────────┘
```

**Components**:
- `DreamExplainPage.tsx`

**Flow**:
1. User types dream description
2. Click "Reveal"
3. AI analyzes and interprets
4. Display interpretation

#### 4c. Numerology

**Components**:
- `NumerologyPage.tsx`
- `ChatInterface.tsx`

**Flow**:
1. Calculate life path number from birthday
2. Display number meaning
3. Enable chat for deeper insights

---

### 5. Settings Page (Profile)

**Route**: `/profile` tab

**Layout**:
```
┌─────────────────────────┐
│      SETTINGS          │
├─────────────────────────┤
│ PROFILE                │
│ Name: [Tiffany Watson] │
│ Birthday: [Jan 1, 1990]│
│ Gender: [Female]       │
│ Zodiac: Cancer         │
│                         │
│ [Save Changes]         │
├─────────────────────────┤
│ PARTNER                │
│ Birthday: [Not set]    │
│ [Add Partner]          │
├─────────────────────────┤
│ LANGUAGE               │
│ ○ English              │
│ ○ Tiếng Việt          │
│ ○ 한국어               │
│ ○ 日本語               │
├─────────────────────────┤
│ DATA                   │
│ [Clear History]        │
│ [Delete Account]       │
└─────────────────────────┘
```

**Components**:
- `SettingsPage.tsx`
- `LanguageSwitcher.tsx`

**Data Flow**:
1. Load profile from localStorage
2. Display editable fields
3. Save changes to localStorage
4. Update app state
5. Trigger re-render with new data

---

## 📱 Bottom Navigation

**Always Visible** (except during onboarding):

```
┌─────────────────────────────────┐
│ 🌙    📖    ❤️    🔮    👤     │
│ Home  Read  Love  Guide Profile│
└─────────────────────────────────┘
```

**Tabs**:
1. **Home** (🌙) - Horoscope
2. **Readings** (📖) - Tarot, Palm, Birth Chart
3. **Love** (❤️) - Compatibility
4. **Guidance** (🔮) - Crystal Ball, Dreams, Numerology
5. **Profile** (👤) - Settings

---

## 💾 Data Models

### User Profile
```typescript
interface UserProfile {
  name: string;
  birthday: string;
  gender: 'male' | 'female' | 'other';
  sign: ZodiacSign;
  partnerBirthday?: string;
  partnerSign?: ZodiacSign;
  acceptedTraits: string[];      // Hidden feature
  rejectedTraits: string[];      // Hidden feature
  swipeCount: number;            // Hidden feature
  createdAt: string;
}
```

### Chat Message
```typescript
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}
```

### Tarot Card
```typescript
interface TarotCard {
  id: number;
  name: string;
  suit: 'major' | 'wands' | 'cups' | 'swords' | 'pentacles';
  upright: string;
  reversed: string;
  image: string;
}
```

---

## 🔐 Privacy & Storage

### LocalStorage Keys
- `user-profile` - User data
- `i18nextLng` - Selected language
- `tarot-history` - Past readings (optional)

### Privacy Features
- ✅ No login required
- ✅ No server-side storage
- ✅ All data stays on device
- ✅ No tracking or analytics
- ✅ Can delete all data anytime

---

## 🌍 Internationalization (i18n)

### Supported Languages
1. **English** (en) - Default
2. **Vietnamese** (vi)
3. **Korean** (ko)
4. **Japanese** (ja)

### Translation Files
- **UI**: `src/locales/{lang}/common.json`
- **Data**: `src/data/translations/{lang}/*.json`

### Translation Coverage
- ✅ All UI text
- ✅ Zodiac descriptions
- ✅ Tarot card meanings
- ✅ Love compatibility texts
- ⚠️ AI responses (English only, AI generates in English)

---

## ⚡ Performance

### Metrics
- **Cold start**: < 1s
- **Page transitions**: < 100ms
- **AI response**: 2-5s (depends on LLM)
- **Bundle size**: ~700KB (gzipped ~190KB)
- **Images**: Lazy loaded

### Optimizations
- Code splitting by route
- Lazy load images
- Cache translated data
- Memoize expensive calculations
- Virtual scrolling (where needed)

---

## 🚀 Deployment

### Build
```bash
npm run build
```

### Output
- `dist/` folder with static files
- Can deploy to any static host:
  - Netlify
  - Vercel
  - GitHub Pages
  - AWS S3 + CloudFront

### Environment Variables
```bash
VITE_LLM_PROVIDER=ollama          # or "azure"
VITE_OLLAMA_URL=http://localhost:11434
VITE_OLLAMA_MODEL=deepseek-r1:8b
VITE_AZURE_ENDPOINT=...           # if using Azure
VITE_AZURE_API_KEY=...            # if using Azure
```

---

## 🧪 Testing

### Test Coverage
- Unit tests for hooks
- Component tests for UI
- Integration tests for flows
- i18n tests for translations

### Run Tests
```bash
npm test              # Watch mode
npm run test:run      # Single run
npm run test:coverage # Coverage report
```

---

## 📚 Documentation

- `docs/app-description.md` - This file
- `docs/refactoring-summary.md` - Code improvements
- `docs/migration-guide.md` - Component usage
- `docs/homepage-simplification.md` - HomePage refactor
- `docs/testing-guide.md` - Testing docs
- `docs/translation-guide.md` - i18n guide

---

## 🎯 Future Enhancements

### Phase 1 (Current)
- ✅ Core horoscope features
- ✅ Tarot readings
- ✅ Love compatibility
- ✅ AI-powered guidance
- ✅ Multi-language support

### Phase 2 (Planned)
- [ ] Real moon sign calculation
- [ ] Real ascendant calculation
- [ ] Lunar calendar page
- [ ] Horoscope notifications
- [ ] Share horoscope feature

### Phase 3 (Future)
- [ ] User accounts (optional)
- [ ] Cloud sync
- [ ] Premium features
- [ ] More reading types
- [ ] Social features

---

## 📄 License

MIT
