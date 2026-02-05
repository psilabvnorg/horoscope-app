# Horos - Astrology & Mystical Guidance App
## Product Requirements Document (PRD)

A modern astrology application featuring personalized horoscopes, tarot readings, love compatibility, and AI-powered mystical guidance.

---

## 📋 Table of Contents
1. [User Stories](#user-stories)
2. [Page Descriptions & Navigation](#page-descriptions--navigation)
3. [UI Issues & Recommendations](#ui-issues--recommendations)
4. [Technical Architecture](#technical-architecture)
5. [Data Models](#data-models)

---

## 🎯 User Stories

### Epic 1: User Onboarding

#### US-1.1: First-Time App Launch
**As a** new user  
**I want to** see a beautiful loading screen when I first open the app  
**So that** I feel the mystical atmosphere immediately

**Acceptance Criteria:**
- Display animated cosmic background with twinkling stars
- Show app logo (violet circle with mystical symbol) with pulsing glow effect
- Auto-transition to welcome screen after 2.5 seconds
- No user interaction required

**Page:** Loading Screen  
**Navigation:** Auto → Welcome Screen

**UI Layout:**
```
┌─────────────────────────────┐
│                             │
│    ✨ ✨ ✨ ✨ ✨ ✨ ✨      │  ← Animated stars
│                             │
│       ┌─────────┐           │
│       │  ◐◯◑   │           │  ← Pulsing logo
│       │   ◯    │           │
│       │  ╰─╯   │           │
│       └─────────┘           │
│                             │
│    ✨ ✨ ✨ ✨ ✨ ✨ ✨      │
│                             │
└─────────────────────────────┘
```

---

#### US-1.2: Welcome Screen
**As a** new user  
**I want to** see a welcoming introduction to the app  
**So that** I understand what the app offers and feel invited to start

**Acceptance Criteria:**
- Display floating animated logo
- Show "WELCOME" title in elegant typography
- Display welcome message explaining app purpose
- Provide "GET STARTED" primary button (violet)
- Provide "Already have an account" secondary button (outline)
- Cosmic star background

**Page:** Welcome Screen  
**Navigation:** 
- "GET STARTED" → Language Selection
- "Already have account" → (Future: Login)

**UI Layout:**
```
┌─────────────────────────────┐
│                             │
│       ┌─────────┐           │
│       │  Logo   │           │  ← Floating animation
│       └─────────┘           │
│                             │
│         WELCOME             │  ← Large italic text
│                             │
│   Discover your cosmic      │
│   journey and unlock the    │
│   secrets of the stars      │
│                             │
│  ┌───────────────────────┐  │
│  │    GET STARTED        │  │  ← Primary button
│  └───────────────────────┘  │
│  ┌───────────────────────┐  │
│  │ Already have account  │  │  ← Secondary button
│  └───────────────────────┘  │
└─────────────────────────────┘
```

---

#### US-1.3: Language Selection
**As a** new user  
**I want to** select my preferred language  
**So that** I can use the app in my native language

**Acceptance Criteria:**
- Display globe illustration
- Show 4 language options: English 🇺🇸, Tiếng Việt 🇻🇳, 한국어 🇰🇷, 日本語 🇯🇵
- Highlight selected language with violet border and checkmark
- Language change takes effect immediately
- Progress bar shows step 1 of 7
- Back button returns to Welcome screen

**Page:** Onboarding - Language Step  
**Navigation:** 
- Back (←) → Welcome Screen
- "NEXT" → Name Step

**UI Layout:**
```
┌─────────────────────────────┐
│ ← SELECT LANGUAGE           │  ← Header with back
│ ▓▓░░░░░░░░░░░░░░░░░░░░░░░░ │  ← Progress (1/7)
├─────────────────────────────┤
│   Choose your language      │
│                             │
│      ┌─────────────┐        │
│      │   🌐 Globe  │        │  ← Illustration
│      └─────────────┘        │
│                             │
│ ┌─────────────────────────┐ │
│ │ 🇺🇸 English        ✓   │ │  ← Selected
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ 🇻🇳 Tiếng Việt         │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ 🇰🇷 한국어              │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ 🇯🇵 日本語              │ │
│ └─────────────────────────┘ │
│                             │
│  ┌───────────────────────┐  │
│  │        NEXT           │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
```

---

#### US-1.4: Enter Name
**As a** new user  
**I want to** enter my name  
**So that** the app can personalize my experience

**Acceptance Criteria:**
- Display mystical eye illustration
- Show text input field with placeholder
- "NEXT" button disabled until name entered
- Progress bar shows step 2 of 7
- Name is required (cannot skip)

**Page:** Onboarding - Name Step  
**Navigation:**
- Back (←) → Language Step
- "NEXT" → Birthday Step

**UI Layout:**
```
┌─────────────────────────────┐
│ ← ENTER THE NAME            │
│ ▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░ │  ← Progress (2/7)
├─────────────────────────────┤
│   Your name helps us        │
│   personalize readings      │
│                             │
│      ┌─────────────┐        │
│      │   👁️ Eye    │        │  ← Mystical eye
│      └─────────────┘        │
│                             │
│ ┌─────────────────────────┐ │
│ │ Enter your name...      │ │  ← Text input
│ └─────────────────────────┘ │
│                             │
│  ┌───────────────────────┐  │
│  │        NEXT           │  │  ← Disabled if empty
│  └───────────────────────┘  │
└─────────────────────────────┘
```

---

#### US-1.5: Enter Date of Birth
**As a** new user  
**I want to** enter my birthday  
**So that** the app can determine my zodiac sign

**Acceptance Criteria:**
- Display zodiac wheel illustration with user's sign in center
- Show scroll picker for Day, Month, Year
- Zodiac sign updates in real-time as date changes
- Progress bar shows step 3 of 7
- Can skip this step (uses default date)

**Page:** Onboarding - Birthday Step  
**Navigation:**
- Back (←) → Name Step
- "SKIP" → Time Step
- "NEXT" → Time Step

**UI Layout:**
```
┌─────────────────────────────┐
│ ← DATE OF BIRTH             │
│ ▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░ │  ← Progress (3/7)
├─────────────────────────────┤
│   Date determines your      │
│   sun sign and numerology   │
│                             │
│      ┌─────────────┐        │
│      │ ○ ○ ○ ○ ○ ○│        │  ← Zodiac wheel
│      │   ┌───┐    │        │
│      │   │ ♋ │    │        │  ← Current sign
│      │   └───┘    │        │
│      │ ○ ○ ○ ○ ○ ○│        │
│      └─────────────┘        │
│                             │
│   ┌────┐ ┌────────┐ ┌────┐  │
│   │ 20 │ │January │ │2000│  │  ← Scroll pickers
│   └────┘ └────────┘ └────┘  │
│                             │
│ ┌──────────┐ ┌────────────┐ │
│ │   SKIP   │ │    NEXT    │ │
│ └──────────┘ └────────────┘ │
└─────────────────────────────┘
```

---

#### US-1.6: Enter Time of Birth
**As a** new user  
**I want to** enter my birth time  
**So that** the app can calculate my ascendant sign

**Acceptance Criteria:**
- Display geometric star pattern illustration
- Show scroll picker for Hour, Minute, AM/PM
- Progress bar shows step 4 of 7
- Can skip with "I DON'T KNOW" button

**Page:** Onboarding - Time Step  
**Navigation:**
- Back (←) → Birthday Step
- "I DON'T KNOW" → Gender Step
- "NEXT" → Gender Step

---

#### US-1.7: Select Gender
**As a** new user  
**I want to** select my gender  
**So that** the app can provide relevant readings

**Acceptance Criteria:**
- Display hexagon avatar illustration
- Show 3 gender options: Male (♂), Female (♀), Other (⚥)
- Highlight selected option with violet border
- Progress bar shows step 5 of 7
- Can skip this step

**Page:** Onboarding - Gender Step  
**Navigation:**
- Back (←) → Time Step
- "SKIP" → Location Step
- "NEXT" → Location Step

---

#### US-1.8: Enter Birth Location
**As a** new user  
**I want to** enter my birth location  
**So that** the app can provide accurate astrological calculations

**Acceptance Criteria:**
- Display constellation ring illustration
- Show text input for city name
- Progress bar shows step 6 of 7
- Can skip with "I DON'T KNOW" button

**Page:** Onboarding - Location Step  
**Navigation:**
- Back (←) → Gender Step
- "I DON'T KNOW" → Relationship Step
- "NEXT" → Relationship Step

---

#### US-1.9: Select Relationship Status
**As a** new user  
**I want to** select my relationship status  
**So that** the app can provide relevant love readings

**Acceptance Criteria:**
- Display smiley with heart illustration
- Show 6 relationship options in 2x3 grid:
  - 👫 In Relationship
  - 🧑 Single
  - 💑 Married
  - 💍 Engaged
  - 💔 Divorced
  - 🕊️ Widow
- Progress bar shows step 7 of 7
- Can skip this step
- "CONFIRM" completes onboarding

**Page:** Onboarding - Relationship Step  
**Navigation:**
- Back (←) → Location Step
- "SKIP" → Home Page
- "CONFIRM" → Home Page

---

### Epic 2: Home & Horoscope

#### US-2.1: View Daily Horoscope
**As a** user  
**I want to** see my daily horoscope on the home page  
**So that** I can get guidance for my day

**Acceptance Criteria:**
- Display user name and birthday at top
- Show zodiac sign image with celestial wheel
- Display Sun, Moon, Ascendant, Element badges around zodiac
- Show zodiac sign name with info button
- Time range tabs: Today, Tomorrow, Week, Month
- Display personality profile section
- Show daily affirmation card with violet accent
- Display "Your Horoscope" text section with "Read More" link

**Page:** Home Page  
**Navigation:**
- Tab: Home (🌙) - Active
- Click zodiac sign → Zodiac Detail Modal
- Click "Read More" → (Future: Full horoscope)

**UI Layout:**
```
┌─────────────────────────────┐
│ HOROSCOPE              ☰   │  ← Header
├─────────────────────────────┤
│ TODAY  TOMORROW  WEEK MONTH │  ← Time tabs
├─────────────────────────────┤
│      Tiffany Watson         │
│      You • Jan 1, 1990      │
│                             │
│   ☀️Sun    ┌─────┐   🌙Moon │
│   Cancer   │ ♋  │  Aquarius │
│            └─────┘          │
│   ↑Asc     CANCER ⓘ  💧Elem │
│   Pisces              Water │
├─────────────────────────────┤
│ CANCER PROFILE              │
│ ┌─────────────────────────┐ │
│ │ "Cancers are nurturing  │ │
│ │  and emotionally..."    │ │
│ └─────────────────────────┘ │
├─────────────────────────────┤
│ ▌AFFIRMATION                │
│ │ Today I embrace my       │
│ │ intuitive nature...      │
├─────────────────────────────┤
│ YOUR HOROSCOPE              │
│ The stars align to bring   │
│ you clarity today...       │
│ Read More →                 │
└─────────────────────────────┘
```

---

#### US-2.2: View Monthly Energy Forecast
**As a** user  
**I want to** see my monthly energy forecast  
**So that** I can plan ahead for the month

**Acceptance Criteria:**
- Display "Monthly Energy" section header
- Show energy cards for different life areas (Love, Career, Health, etc.)
- Each card shows energy level indicator
- Scrollable horizontally if many cards

**Page:** Home Page (scroll down)  
**Navigation:** Part of Home Page scroll

---

#### US-2.3: View Daily Tips
**As a** user  
**I want to** see daily tips for love and warnings  
**So that** I can be prepared for the day

**Acceptance Criteria:**
- Display "Daily Tips for [Sign]" section
- Show Love tip card with heart icon
- Show Warning tip card with alert icon
- Cards are horizontally scrollable

**Page:** Home Page (scroll down)

---

#### US-2.4: View Today's Matches
**As a** user  
**I want to** see my compatible zodiac matches for today  
**So that** I know who I might connect with

**Acceptance Criteria:**
- Display "Today's Matches" section with rose color accent
- Show 2 zodiac signs as daily matches
- Each match shows zodiac symbol and name
- "View Compatibility" link under each match
- "Read More" button to see full compatibility

**Page:** Home Page (scroll down)  
**Navigation:**
- Click "View Compatibility" → Compatibility Modal
- Click "Read More" → Compatibility Modal

---

#### US-2.5: View Lunar Calendar
**As a** user  
**I want to** see the current moon phase and lunar calendar  
**So that** I can align my activities with lunar cycles

**Acceptance Criteria:**
- Display "Lunar Calendar" section
- Show current moon phase image and name
- Display date range for current phase
- Show "Moon in [Sign]" indicator
- Display moon phase timeline with 4 phases
- Show "Do" and "Don't" advice cards
- "Read More" button for full lunar guide

**Page:** Home Page (scroll down)

---

#### US-2.6: View Today's Features
**As a** user  
**I want to** see my lucky number, color, and time  
**So that** I can use them for guidance

**Acceptance Criteria:**
- Display "Today's Features" section
- Show 3 cards in grid:
  - Lucky Number (large number display)
  - Lucky Color (color swatch)
  - Lucky Time (morning and evening times)

**Page:** Home Page (scroll down)

---

#### US-2.7: View Zodiac Sign Details
**As a** user  
**I want to** see detailed information about my zodiac sign  
**So that** I can understand my personality better

**Acceptance Criteria:**
- Modal overlay with dark backdrop
- Display zodiac symbol and name
- Show "Personality Profile" section
- Display full zodiac description
- Close button (X) in top right

**Page:** Zodiac Detail Modal  
**Navigation:**
- Triggered from: Home Page zodiac info button
- Close (X) → Return to Home Page

---

### Epic 3: Readings

#### US-3.1: View Readings Menu
**As a** user  
**I want to** see all available reading types  
**So that** I can choose the reading I want

**Acceptance Criteria:**
- Display "READINGS" header
- Show 3 reading cards:
  - Palm Reading (hand illustration)
  - Birth Chart (zodiac symbols grid)
  - Tarot Cards (stacked cards illustration)
- Each card shows title and description
- Cards are tappable to navigate to reading

**Page:** Readings Page  
**Navigation:**
- Tab: Readings (📖) - Active
- Click "Palm Reading" → Palm Reading Intro
- Click "Birth Chart" → Birth Chart Reading
- Click "Tarot Cards" → Tarot Cards Page

**UI Layout:**
```
┌─────────────────────────────┐
│ READINGS                    │
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │   🖐️ Palm SVG           │ │
│ │                         │ │
│ │   Palm Reading          │ │
│ │   Read your palm lines  │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │   ♐ ♎                   │ │
│ │   ♒ ♍                   │ │
│ │   Birth Chart           │ │
│ │   Your astrological map │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │   🃏🃏🃏 Cards           │ │
│ │                         │ │
│ │   Tarot Cards           │ │
│ │   Discover your destiny │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

---

#### US-3.2: Palm Reading Introduction
**As a** user  
**I want to** see an introduction to palm reading  
**So that** I understand what the feature offers

**Acceptance Criteria:**
- Display moon and hand illustration with palm lines
- Show astrological symbols on palm (♏, ♄, ☉, ☿, ♃, ♂, ♈, ♀)
- Display palm line labels (Heart, Head, Destiny, Venus, Moon, Life, Fate)
- Show "PALM READING" title
- Display description text
- "READ NOW" button with dot indicators

**Page:** Palm Reading Intro  
**Navigation:**
- Back (←) → Readings Page
- "READ NOW" → Palm Reading Result

---

#### US-3.3: Palm Reading Result
**As a** user  
**I want to** get my palm reading analysis  
**So that** I can learn about my life path

**Acceptance Criteria:**
- Display palm reading analysis
- Show AI-generated interpretation
- Option to upload palm photo (future)
- Back button to return

**Page:** Palm Reading Result  
**Navigation:**
- Back (←) → Readings Page

---

#### US-3.4: Birth Chart Reading
**As a** user  
**I want to** see my astrological birth chart  
**So that** I can understand my cosmic blueprint

**Acceptance Criteria:**
- Display user's zodiac sign prominently
- Show birth chart analysis
- Display planetary positions
- AI-generated interpretation available

**Page:** Birth Chart Reading  
**Navigation:**
- Back (←) → Readings Page

---

#### US-3.5: Tarot Cards Menu
**As a** user  
**I want to** see all tarot reading options  
**So that** I can choose the type of reading I want

**Acceptance Criteria:**
- Display featured tarot card (Two of Cups style) with light rays
- Show 4 reading type cards in 2x2 grid:
  - Daily Tarot (star icon)
  - Near Future (crystal ball icon)
  - Love & Relations (skull with heart eyes)
  - Yes or No (palm icon)
- Show "Card Meanings" full-width button at bottom
- Back button in top left

**Page:** Tarot Cards Page  
**Navigation:**
- Back (←) → Readings Page
- "Daily Tarot" → Tarot Reading (auto-draw 1 card)
- "Near Future" → Card Selection (select 3 cards)
- "Love & Relations" → Card Selection (select 3 cards)
- "Yes or No" → Card Selection (select 1 card)
- "Card Meanings" → Card Library

**UI Layout:**
```
┌─────────────────────────────┐
│ ←      TAROT CARDS          │
├─────────────────────────────┤
│         ╱ ╲ ╱ ╲             │  ← Light rays
│        ╱   ╲   ╲            │
│       ┌─────────┐           │
│       │   II    │           │
│       │  🦁👼   │           │  ← Featured card
│       │ 🏆  🏆  │           │
│       │ 👩  👨  │           │
│       └─────────┘           │
├─────────────────────────────┤
│ ┌──────────┐ ┌──────────┐   │
│ │ ⭐       │ │ 🔮       │   │
│ │ Daily    │ │ Near     │   │
│ │ Tarot    │ │ Future   │   │
│ └──────────┘ └──────────┘   │
│ ┌──────────┐ ┌──────────┐   │
│ │ 💀❤️     │ │ 🖐️       │   │
│ │ Love &   │ │ Yes or   │   │
│ │ Relations│ │ No       │   │
│ └──────────┘ └──────────┘   │
│ ┌─────────────────────────┐ │
│ │ 🃏🃏 Card Meanings       │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

---

#### US-3.6: Select Tarot Cards
**As a** user  
**I want to** select cards from a spread deck  
**So that** I can get my personalized reading

**Acceptance Criteria:**
- Display 3 empty card slots at top
- Show progress indicator (1, 2, 3) with "X cards left" text
- Display fan of 8 face-down cards in arc
- Cards have mystical back design (triple moon, pentacle)
- Tapping card moves it to slot
- Selected cards become semi-transparent
- Auto-navigate to reading after 3 cards selected

**Page:** Tarot Card Selection  
**Navigation:**
- Back (←) → Tarot Cards Page
- Complete selection → Tarot Reading Page

**UI Layout:**
```
┌─────────────────────────────┐
│ ←      CARD SELECTION       │
├─────────────────────────────┤
│   ┌────┐ ┌────┐ ┌────┐      │
│   │    │ │ 🃏 │ │    │      │  ← Card slots
│   │    │ │    │ │    │      │
│   └────┘ └────┘ └────┘      │
│                             │
│      ○ ○ (2) ○    2 left    │  ← Progress
│                             │
│           ○                 │  ← Center guide
│                             │
│      🃏 🃏 🃏 🃏 🃏 🃏 🃏 🃏     │  ← Fan of cards
│        ╲ ╲ ╲ │ ╱ ╱ ╱        │     (arc layout)
│                             │
└─────────────────────────────┘
```

---

#### US-3.7: View Tarot Reading
**As a** user  
**I want to** see my tarot card reading interpretation  
**So that** I can receive guidance

**Acceptance Criteria:**
- Display selected cards face-up
- Show card names and positions
- Display AI-generated interpretation
- Chat interface for follow-up questions
- Back button to return

**Page:** Tarot Reading Page  
**Navigation:**
- Back (←) → Tarot Cards Page
- Chat available for questions

---

#### US-3.8: Browse Card Library
**As a** user  
**I want to** browse all tarot cards and their meanings  
**So that** I can learn about tarot

**Acceptance Criteria:**
- Display all 78 tarot cards in grid
- Filter by suit (Major Arcana, Wands, Cups, Swords, Pentacles)
- Tap card to see full meaning
- Show upright and reversed meanings
- Close button to return

**Page:** Card Library  
**Navigation:**
- Close (X) → Tarot Cards Page
- Tap card → Card Detail Modal

---

### Epic 4: Love & Compatibility

#### US-4.1: View Love Compatibility
**As a** user  
**I want to** check my compatibility with other zodiac signs  
**So that** I can understand my romantic connections

**Acceptance Criteria:**
- Display "LOVE & COMPATIBILITY" header
- Show user's zodiac sign with glow effect
- Display "+" symbol between signs
- Show partner's zodiac sign (default or selected)
- Display horizontal carousel of all 12 zodiac signs
- Each sign shows symbol, name, and date range
- Selected sign is highlighted and enlarged
- Navigation arrows and dot indicators
- "CHECK LOVE" button at bottom

**Page:** Love Page  
**Navigation:**
- Tab: Love (❤️) - Active
- Select zodiac sign → Updates partner sign
- "CHECK LOVE" → Compatibility Result Modal

**UI Layout:**
```
┌─────────────────────────────┐
│ ←    LOVE & COMPATIBILITY   │
├─────────────────────────────┤
│                             │
│   ┌─────────────────────┐   │
│   │  ┌───┐   +   ┌───┐  │   │
│   │  │ ♋ │       │ ♌ │  │   │  ← Your + Partner
│   │  └───┘       └───┘  │   │
│   │ Cancer      Leo     │   │
│   └─────────────────────┘   │
│                             │
│      SELECT A SIGN          │
│                             │
│  ← ♈ ♉ [♊] ♋ ♌ ♍ →        │  ← Carousel
│       Gemini                │
│    May 21 - Jun 20          │
│                             │
│      ○ ● ○                  │  ← Dots
│                             │
│  ┌───────────────────────┐  │
│  │      CHECK LOVE       │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
```

---

#### US-4.2: View Compatibility Result
**As a** user  
**I want to** see detailed compatibility analysis  
**So that** I can understand my relationship potential

**Acceptance Criteria:**
- Modal slides up from bottom (90% height)
- Display both zodiac signs with heart between
- Show "Love Guide" header with sparkle icon
- Display compatibility summary text
- Show chat interface for relationship questions
- Suggested questions as quick-tap buttons
- Text input for custom questions
- "Check Another" button to close and select new sign

**Page:** Compatibility Result Modal  
**Navigation:**
- Close (X) → Love Page
- "Check Another" → Love Page
- Send message → AI response in chat

**UI Layout:**
```
┌─────────────────────────────┐
│ ✨ Love Guide          X    │
│ Ask about your match        │
├─────────────────────────────┤
│   ┌───┐  ❤️  ┌───┐          │
│   │ ♋ │      │ ♌ │          │
│   └───┘      └───┘          │
│     Cancer & Leo            │
├─────────────────────────────┤
│ COMPATIBILITY               │
│ "Cancer and Leo share a     │
│  deep emotional bond..."    │
├─────────────────────────────┤
│ Ask anything about your     │
│ relationship...             │
│                             │
│ ┌─────────┐ ┌─────────────┐ │
│ │ Tips?   │ │ Challenges? │ │  ← Suggested
│ └─────────┘ └─────────────┘ │
│                             │
│ 👤: How can we communicate? │
│ ✨: Communication between   │
│     Cancer and Leo...       │
├─────────────────────────────┤
│ ┌─────────────────────┐ 📤  │
│ │ Ask a question...   │     │
│ └─────────────────────┘     │
│ ┌───────────────────────┐   │
│ │    Check Another      │   │
│ └───────────────────────┘   │
└─────────────────────────────┘
```

---

### Epic 5: Guidance (Fortune)

#### US-5.1: View Guidance Menu
**As a** user  
**I want to** see all guidance options  
**So that** I can choose the type of mystical guidance I need

**Acceptance Criteria:**
- Display "GUIDANCE" header in purple
- Show 3 guidance cards:
  - Crystal Ball (golden ball image, yellow theme)
  - Numerology (pink blob with number 3)
  - Dream Explain (galaxy triangle background)
- Each card shows title and description
- Cards are tappable

**Page:** Fortune/Guidance Page  
**Navigation:**
- Tab: Guidance (🔮) - Active
- "Crystal Ball" → Crystal Ball Page
- "Numerology" → Numerology Page
- "Dream Explain" → Dream Explain Page

**UI Layout:**
```
┌─────────────────────────────┐
│ GUIDANCE                    │  ← Purple header
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │   🔮 Crystal Ball       │ │  ← Yellow theme
│ │   Ask anything          │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │   (3) Numerology        │ │  ← Pink theme
│ │   Life path numbers     │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │   🔺 Dream Explain      │ │  ← Galaxy bg
│ │   Interpret your dreams │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

---

#### US-5.2: Crystal Ball Consultation
**As a** user  
**I want to** ask questions to the crystal ball  
**So that** I can receive mystical guidance

**Acceptance Criteria:**
- Display "CRYSTAL BALL" header with back button
- Show question category selector (Love, Career, Family, Self)
- Display 3 rows of scrolling prompt tags
- Show crystal ball image with golden glow
- Display "SEEK WISDOM" title
- Two action buttons: "START CHAT" and "SPEAK"
- Tapping tag or button opens chat interface

**Page:** Crystal Ball Page  
**Navigation:**
- Back (←) → Guidance Page
- Select category → Updates context
- Tap tag → Opens chat with that prompt
- "START CHAT" → Opens chat interface
- "SPEAK" → Opens chat (voice future)

**UI Layout:**
```
┌─────────────────────────────┐
│ ←    CRYSTAL BALL           │
├─────────────────────────────┤
│ QUESTION CATEGORY           │
│ ┌────┐ ┌──────┐ ┌──────┐    │
│ │Love│ │Career│ │Family│    │  ← Category pills
│ └────┘ └──────┘ └──────┘    │
│                             │
│ ← Illuminate path → Reveal  │  ← Scrolling tags
│ ← Summon stars → Channel    │     (animated)
│ ← Call spirits → Fortune    │
│                             │
│        ┌─────────┐          │
│        │   🔮    │          │  ← Crystal ball
│        │  ✨✨   │          │     with glow
│        └─────────┘          │
│                             │
│       SEEK WISDOM           │
│       Tap to ask            │
│                             │
│ ┌──────────┐ ┌────────────┐ │
│ │START CHAT│ │   SPEAK    │ │
│ └──────────┘ └────────────┘ │
└─────────────────────────────┘
```

---

#### US-5.3: Dream Interpretation
**As a** user  
**I want to** describe my dream and get an interpretation  
**So that** I can understand its meaning

**Acceptance Criteria:**
- Display "DREAM EXPLAIN" header with back button
- Show galaxy triangle illustration (inverted pyramid)
- Display text area for dream description
- "REVEAL DREAM" button with circle indicator
- Loading state shows floating person animation
- Result shows dream text and AI interpretation
- "Interpret Another" button to start over

**Page:** Dream Explain Page  
**Navigation:**
- Back (←) → Guidance Page
- "REVEAL DREAM" → Analyzing Screen → Result Screen
- "Interpret Another" → Reset to input screen

**UI Layout (Input):**
```
┌─────────────────────────────┐
│ ←    DREAM EXPLAIN          │
├─────────────────────────────┤
│                             │
│         ▼                   │
│        ╱ ╲                  │
│       ╱   ╲                 │  ← Galaxy triangle
│      ╱ ✨  ╲                │
│     ╱   ✨  ╲               │
│    ╱    ✨   ╲              │
│   ╱──────────╲             │
│                             │
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ I was a massive         │ │
│ │ dinosaur with rat       │ │  ← Text area
│ │ nose and ant lips...    │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────┐ ○   │
│ │   REVEAL DREAM      │ ○   │
│ └─────────────────────┘     │
└─────────────────────────────┘
```

**UI Layout (Analyzing):**
```
┌─────────────────────────────┐
│ X                           │  ← Stop button
├─────────────────────────────┤
│    ✨ ✨ ✨ ✨ ✨ ✨          │  ← Stars
│   ⛰️ ⛰️ ⛰️ ⛰️ ⛰️           │  ← Mountains
│                             │
│   ═══════════════════       │
│   ║ ║ ║ ║ ║ ║ ║ ║ ║        │  ← Grid floor
│   ═══════════════════       │
│                             │
│      ✨ 🧘 ✨                │  ← Floating person
│         (glow)              │
│                             │
│      Analysing Dream        │
│          • • •              │  ← Loading dots
│                             │
│   ☁️ ☁️ ☁️ ☁️ ☁️            │  ← Clouds
└─────────────────────────────┘
```

---

#### US-5.4: Numerology Reading
**As a** user  
**I want to** see my numerology reading  
**So that** I can understand my life path number

**Acceptance Criteria:**
- Calculate life path number from birthday
- Display number with meaning
- Show AI-generated interpretation
- Chat interface for questions

**Page:** Numerology Page  
**Navigation:**
- Back (←) → Guidance Page
- Chat available for questions

---

### Epic 6: Settings & Profile

#### US-6.1: View Profile Settings
**As a** user  
**I want to** view and edit my profile settings  
**So that** I can keep my information up to date

**Acceptance Criteria:**
- Display "PROFILE" header in purple
- Show profile card with:
  - Zodiac avatar (symbol in gradient circle)
  - User name
  - Zodiac sign with info button
  - Birthday
- Display stats section (3 cards):
  - Traits Swiped count
  - Accepted count (green)
  - Rejected count (red)
- Show "Profile Settings" section with editable fields:
  - Name (tap to edit)
  - Birthday (tap to open date picker)
  - Gender (3 toggle buttons)

**Page:** Settings Page  
**Navigation:**
- Tab: Profile (👤) - Active
- Tap Name → Edit Name Modal
- Tap Birthday → Date Picker Modal
- Tap Gender → Toggles selection
- Tap Zodiac info → Zodiac Info Modal

**UI Layout:**
```
┌─────────────────────────────┐
│ PROFILE                     │
│ Manage your cosmic identity │
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │  ┌───┐  Tiffany Watson  │ │
│ │  │ ♋ │  ♋ Cancer ⓘ     │ │  ← Profile card
│ │  └───┘  Jan 1, 1990     │ │
│ └─────────────────────────┘ │
├─────────────────────────────┤
│ ┌──────┐ ┌──────┐ ┌──────┐  │
│ │  15  │ │  10  │ │  5   │  │  ← Stats
│ │Swiped│ │Accept│ │Reject│  │
│ └──────┘ └──────┘ └──────┘  │
├─────────────────────────────┤
│ PROFILE SETTINGS            │
│ ┌─────────────────────────┐ │
│ │ 👤 Name                 │ │
│ │    Tiffany Watson    →  │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ 📅 Birthday             │ │
│ │    January 1, 1990   →  │ │
│ │    Cancer               │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ ✨ Gender               │ │
│ │ [Female] [Male] [Other] │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

---

#### US-6.2: Manage Partner
**As a** user  
**I want to** add or remove my partner's information  
**So that** I can get accurate compatibility readings

**Acceptance Criteria:**
- Display "Partner" section
- If no partner: Show empty state with "Add Partner" button
- If partner exists:
  - Show partner birthday with zodiac sign
  - "Remove Partner" button
- Tap to edit partner birthday

**Page:** Settings Page (scroll down)  
**Navigation:**
- "Add Partner" → Date Picker Modal
- Tap partner → Date Picker Modal
- "Remove Partner" → Removes partner data

---

#### US-6.3: Change Language
**As a** user  
**I want to** change the app language  
**So that** I can use the app in my preferred language

**Acceptance Criteria:**
- Display "Language" section
- Show 4 language options with flags:
  - 🇺🇸 English
  - 🇻🇳 Tiếng Việt
  - 🇰🇷 한국어
  - 🇯🇵 日本語
- Current language highlighted with violet border and dot
- Language changes immediately on selection

**Page:** Settings Page (scroll down)

---

#### US-6.4: Clear History
**As a** user  
**I want to** clear my reading history  
**So that** I can start fresh

**Acceptance Criteria:**
- Display "Data" section
- "Clear History" button with star icon
- Confirmation dialog before clearing
- Shows warning message about data loss

**Page:** Settings Page (scroll down)  
**Navigation:**
- "Clear History" → Confirmation Dialog
- "Clear" in dialog → Clears data, closes dialog
- "Cancel" → Closes dialog

---

#### US-6.5: Delete Account
**As a** user  
**I want to** delete my account and all data  
**So that** I can remove all my information

**Acceptance Criteria:**
- "Delete Account" button with trash icon (red)
- Confirmation dialog with warning
- Deletes all localStorage data
- Returns to onboarding flow

**Page:** Settings Page (scroll down)  
**Navigation:**
- "Delete Account" → Confirmation Dialog
- "Delete" in dialog → Clears all data → Onboarding
- "Cancel" → Closes dialog

---

## 📱 Bottom Navigation

**Always visible** (except during onboarding):

```
┌─────────────────────────────────────────┐
│  🌙      📖      ❤️      🔮      👤    │
│  Home   Readings  Love  Guidance Profile│
└─────────────────────────────────────────┘
```

**Tabs:**
1. **Home** (🌙) - Daily horoscope and zodiac info
2. **Readings** (📖) - Tarot, Palm, Birth Chart
3. **Love** (❤️) - Compatibility checker
4. **Guidance** (🔮) - Crystal Ball, Dreams, Numerology
5. **Profile** (👤) - Settings and account

**Behavior:**
- Active tab highlighted in violet with scale animation
- Tab labels in uppercase, small text
- Fixed at bottom with safe area padding
- Z-index 100 to stay above content
- Background: #1a1a2e with top border

---

## 🚨 UI Issues & Recommendations

### Critical Issues

#### Issue 1: Hardcoded Zodiac Data on Home Page
**Location:** `HomePage.tsx` lines 85-95  
**Problem:** Moon sign and Ascendant are hardcoded as "Aquarius" and "Pisces"  
**Impact:** All users see the same incorrect data regardless of their birth info  
**Recommendation:** Calculate actual moon sign and ascendant from birth date/time/location, or hide these fields until proper calculation is implemented

#### Issue 2: Missing Zodiac Images
**Location:** `LovePage.tsx` zodiacImages object  
**Problem:** References images at `/figma/asset/zodiac/[sign].png` that don't exist  
**Impact:** Fallback to text symbols works, but intended visual design is broken  
**Recommendation:** Add zodiac images to public folder or update to use existing Cancer image for all signs

#### Issue 3: Element Hardcoded
**Location:** `HomePage.tsx` line 93  
**Problem:** Element is hardcoded as "Water" for all users  
**Impact:** Incorrect element shown for non-water signs  
**Recommendation:** Calculate element from zodiac sign (Fire: Aries/Leo/Sagittarius, Earth: Taurus/Virgo/Capricorn, Air: Gemini/Libra/Aquarius, Water: Cancer/Scorpio/Pisces)

### High Priority Issues

#### Issue 4: Scroll Picker Accessibility
**Location:** `OnboardingFlow.tsx` ScrollPicker component  
**Problem:** No keyboard navigation or screen reader support  
**Impact:** Users with accessibility needs cannot use date/time pickers  
**Recommendation:** Add ARIA labels, keyboard navigation, and focus management

#### Issue 5: Missing Loading States
**Location:** Multiple pages  
**Problem:** No loading indicators when fetching AI responses  
**Impact:** Users don't know if app is working  
**Recommendation:** Add consistent loading spinners/skeletons across all AI-powered features

#### Issue 6: Chat History Not Persisted
**Location:** `useChat.ts`  
**Problem:** Chat messages are lost on page navigation  
**Impact:** Users lose conversation context  
**Recommendation:** Persist chat history to localStorage per feature context

### Medium Priority Issues

#### Issue 7: Tarot Card Images Limited
**Location:** `public/tarot/` folder  
**Problem:** Only 8 tarot card images exist (00-08)  
**Impact:** Most cards show placeholder or broken images  
**Recommendation:** Add all 78 tarot card images or use generated/placeholder designs

#### Issue 8: Voice Input Not Implemented
**Location:** `CrystalBallPage.tsx` handleSpeak function  
**Problem:** "SPEAK" button just opens chat, no voice recognition  
**Impact:** Feature appears broken to users  
**Recommendation:** Implement Web Speech API or remove button until ready

#### Issue 9: Partner Birthday Validation
**Location:** `SettingsPage.tsx`  
**Problem:** No validation that partner birthday is different from user's  
**Impact:** Users could accidentally set same birthday  
**Recommendation:** Add validation and warning message

### Low Priority Issues

#### Issue 10: Inconsistent Back Button Placement
**Location:** Various pages  
**Problem:** Back button sometimes in header, sometimes floating  
**Impact:** Minor UX inconsistency  
**Recommendation:** Standardize back button position across all pages

#### Issue 11: Missing Empty States
**Location:** Card Library, Chat interfaces  
**Problem:** No helpful empty states when no data  
**Impact:** Users see blank screens  
**Recommendation:** Add friendly empty state messages and illustrations

#### Issue 12: Animation Performance
**Location:** `CrystalBallPage.tsx` scrolling tags  
**Problem:** CSS animations may cause jank on low-end devices  
**Impact:** Poor performance on older phones  
**Recommendation:** Use `will-change` property and consider reducing animation complexity

---

## 🏗️ Technical Architecture

### Frontend Stack
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui + custom components
- **State Management:** React hooks + Context
- **Routing:** Client-side state-based (single page app)
- **i18n:** react-i18next (4 languages)
- **Storage:** LocalStorage (offline-first)

### Backend Stack
- **Server:** Node.js + Express (optional proxy)
- **Purpose:** Proxy for Ollama API (CORS bypass)
- **Port:** 3001
- **Endpoints:** `/api/generate` (POST)

### AI Integration
- **Primary:** Ollama (local LLM)
  - Model: deepseek-r1:8b or similar
  - URL: http://localhost:11434
- **Fallback:** Azure OpenAI
  - Configurable via environment variables

---

## 💾 Data Models

### User Profile
```typescript
interface UserProfile {
  name: string;
  birthday: string;           // YYYY-MM-DD
  birthTime?: string;         // HH:MM AM/PM
  birthLocation?: string;
  gender: 'male' | 'female' | 'other';
  sign: ZodiacSign;
  partnerBirthday?: string;
  partnerSign?: ZodiacSign;
  relationshipStatus?: string;
  acceptedTraits: string[];   // Hidden swipe feature
  rejectedTraits: string[];   // Hidden swipe feature
  swipeCount: number;         // Hidden swipe feature
  createdAt: string;
}
```

### Zodiac Sign
```typescript
type ZodiacSign = 
  | 'aries' | 'taurus' | 'gemini' | 'cancer'
  | 'leo' | 'virgo' | 'libra' | 'scorpio'
  | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces';
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

## 🔄 Navigation Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         APP LAUNCH                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  Loading Screen │
                    │   (2.5 sec)     │
                    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │ Welcome Screen  │
                    └─────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
    ┌─────────────────┐             ┌─────────────────┐
    │  GET STARTED    │             │ Already Account │
    └─────────────────┘             │   (Future)      │
              │                     └─────────────────┘
              ▼
    ┌─────────────────────────────────────────────────┐
    │              ONBOARDING FLOW                     │
    │  Language → Name → Birthday → Time → Gender     │
    │           → Location → Relationship             │
    └─────────────────────────────────────────────────┘
                              │
                              ▼
    ┌─────────────────────────────────────────────────┐
    │                  MAIN APP                        │
    │  ┌─────────────────────────────────────────┐    │
    │  │           BOTTOM NAVIGATION              │    │
    │  │  🌙 Home │ 📖 Read │ ❤️ Love │ 🔮 Guide │ 👤 │    │
    │  └─────────────────────────────────────────┘    │
    └─────────────────────────────────────────────────┘
              │         │         │         │         │
              ▼         ▼         ▼         ▼         ▼
         ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐
         │ HOME  │ │READING│ │ LOVE  │ │FORTUNE│ │PROFILE│
         └───────┘ └───────┘ └───────┘ └───────┘ └───────┘
              │         │         │         │         │
              │         │         │         │         │
              ▼         ▼         ▼         ▼         ▼
         ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐
         │Zodiac │ │ Palm  │ │Compat │ │Crystal│ │ Edit  │
         │Detail │ │ Tarot │ │Result │ │ Ball  │ │Profile│
         │Modal  │ │ Birth │ │Modal  │ │Dream  │ │Partner│
         └───────┘ │ Chart │ └───────┘ │Numero │ │Lang   │
                   └───────┘           └───────┘ └───────┘
```

---

## 🌍 Internationalization (i18n)

### Supported Languages
1. **English** (en) - Default
2. **Vietnamese** (vi)
3. **Korean** (ko)
4. **Japanese** (ja)

### Translation Files Structure
```
src/
├── locales/
│   ├── en/
│   │   ├── common.json      # UI text
│   │   ├── readings.json    # Readings page
│   │   ├── tarot.json       # Tarot feature
│   │   └── zodiac.json      # Zodiac names
│   ├── vi/
│   ├── ko/
│   └── ja/
└── data/
    └── translations/
        ├── vi/
        │   ├── zodiac.json  # Zodiac descriptions
        │   ├── tarot.json   # Card meanings
        │   └── love.json    # Compatibility text
        ├── ko/
        └── ja/
```

### Translation Coverage
- ✅ All UI text
- ✅ Zodiac descriptions
- ✅ Tarot card meanings
- ✅ Love compatibility texts
- ⚠️ AI responses (English only - AI generates in user's language when possible)

---

## 📄 License

MIT

---

*Last Updated: February 2026*
*Version: 1.0.0*
