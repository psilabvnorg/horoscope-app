# Migration Guide: Using New Refactored Components

This guide helps you migrate existing code to use the new refactored components and hooks.

## Table of Contents
1. [Button Migration](#button-migration)
2. [Chat Interface Migration](#chat-interface-migration)
3. [Modal Migration](#modal-migration)
4. [Page Header Migration](#page-header-migration)
5. [Data Loading Migration](#data-loading-migration)
6. [Zodiac Display Migration](#zodiac-display-migration)

---

## Button Migration

### Before
```tsx
<button className="px-12 py-4 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold uppercase tracking-widest transition-all hover:scale-105 shadow-lg shadow-violet-500/30">
  Start Reading
</button>
```

### After
```tsx
import { GradientButton } from '@/components/ui/gradient-button';

<GradientButton variant="violet" size="md">
  Start Reading
</GradientButton>
```

### Available Props
- `variant`: 'violet' | 'purple' | 'pink' | 'yellow' | 'rose'
- `size`: 'sm' | 'md' | 'lg'
- All standard button props (onClick, disabled, etc.)

---

## Chat Interface Migration

### Before (in TarotPage, LovePage, etc.)
```tsx
const [messages, setMessages] = useState<ChatMessage[]>([]);
const [chatInput, setChatInput] = useState('');
const [isLoading, setIsLoading] = useState(false);
const chatScrollRef = useRef<HTMLDivElement>(null);
const inputRef = useRef<HTMLInputElement>(null);

// 100+ lines of chat UI code...
```

### After
```tsx
import { ChatPanel } from '@/components/common/ChatPanel';
import { useChatUI } from '@/hooks/useChatUI';

const {
  messages,
  isLoading,
  input,
  setInput,
  handleSend,
  handleSuggestedQuestion,
} = useChatUI({
  context: 'tarot',
  enhancedContext: { tarotCards: buildTarotContext(cards) },
  profile,
  initialMessage,
});

// In render:
{showChat && (
  <ChatPanel
    messages={messages}
    isLoading={isLoading}
    input={input}
    onInputChange={setInput}
    onSend={handleSend}
    onClose={() => setShowChat(false)}
    suggestedQuestions={['Question 1', 'Question 2']}
    onSuggestedQuestion={handleSuggestedQuestion}
    theme="violet"
    title="Tarot Reading"
    subtitle="Ask about your cards"
  />
)}
```

### Available Themes
- `violet` - Default, good for tarot
- `purple` - Good for fortune/dreams
- `pink` - Good for love/relationships
- `yellow` - Good for crystal ball
- `rose` - Good for numerology

---

## Modal Migration

### Before
```tsx
{showModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
    <div className="relative w-full max-w-2xl bg-[#0a0a12] rounded-2xl border border-white/10">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="p-6">
        {/* Content */}
      </div>
    </div>
  </div>
)}
```

### After
```tsx
import { ModalPanel } from '@/components/common/ModalPanel';
import { Sparkles } from 'lucide-react';

<ModalPanel
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Reading Result"
  subtitle="Your personalized reading"
  icon={<Sparkles className="w-6 h-6" />}
  theme="violet"
  footer={
    <GradientButton onClick={handleAction}>
      Continue
    </GradientButton>
  }
>
  {/* Your content here */}
</ModalPanel>
```

---

## Page Header Migration

### Before
```tsx
<header className="p-4 pt-6 flex items-center gap-3">
  <button
    onClick={onBack}
    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
  >
    <ChevronLeft className="w-5 h-5" />
  </button>
  <h1 className="text-xl font-light tracking-[0.15em] uppercase">
    {title}
  </h1>
</header>
```

### After
```tsx
import { PageHeader } from '@/components/common/PageHeader';
import { Crystal } from 'lucide-react';

<PageHeader
  title="Crystal Ball"
  subtitle="Peer into your future"
  onBack={onBack}
  icon={<Crystal className="w-6 h-6" />}
  actions={
    <button onClick={handleSettings}>
      <Settings className="w-5 h-5" />
    </button>
  }
/>
```

---

## Data Loading Migration

### Before
```tsx
const [data, setData] = useState(defaultData);
const [loading, setLoading] = useState(false);

useEffect(() => {
  async function loadData() {
    setLoading(true);
    try {
      const result = await import(`./data/${lang}/${type}.json`);
      setData(result.default);
    } catch (error) {
      console.error(error);
      setData(defaultData);
    } finally {
      setLoading(false);
    }
  }
  loadData();
}, [lang, type]);
```

### After
```tsx
import { useAsyncData } from '@/hooks/useAsyncData';

const { data, loading, error } = useAsyncData({
  loader: () => import(`./data/${lang}/${type}.json`).then(m => m.default),
  fallback: defaultData,
  cacheKey: `${type}-${lang}`,
  dependencies: [lang, type],
});
```

### Benefits
- Automatic caching
- Better error handling
- Cleaner code
- Consistent pattern

---

## Zodiac Display Migration

### Before
```tsx
const zodiacColors = {
  aries: { primary: '#ef4444', glow: 'rgba(239, 68, 68, 0.4)' },
  // ... all signs
};

<div
  className="w-24 h-24 rounded-full flex items-center justify-center"
  style={{
    backgroundColor: zodiacColors[sign].primary,
    boxShadow: `0 0 20px ${zodiacColors[sign].glow}`,
  }}
>
  <span className="text-4xl text-white">♈</span>
</div>
<p className="text-white capitalize">{sign}</p>
<p className="text-white/60 text-xs">Mar 21 - Apr 19</p>
```

### After
```tsx
import { ZodiacSignCard } from '@/components/common/ZodiacSignCard';

<ZodiacSignCard
  sign="aries"
  size="md"
  showDateRange
  showSymbol
  interactive
  selected={selectedSign === 'aries'}
  onClick={() => setSelectedSign('aries')}
/>
```

### Available Props
- `size`: 'sm' | 'md' | 'lg'
- `showDateRange`: boolean - Show date range below sign
- `showSymbol`: boolean - Show zodiac symbol
- `interactive`: boolean - Enable hover effects
- `selected`: boolean - Show selection state
- `onClick`: () => void - Click handler

---

## Card Container Migration

### Before
```tsx
<div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
  {/* Content */}
</div>
```

### After
```tsx
import { Card } from '@/components/ui/card';

<Card variant="default">
  {/* Content */}
</Card>

// Or elevated variant
<Card variant="elevated">
  {/* Content */}
</Card>

// Or outlined variant
<Card variant="outlined">
  {/* Content */}
</Card>
```

---

## Import Shortcuts

Instead of importing from individual files, you can now use index imports:

```tsx
// Before
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GradientButton } from '@/components/ui/gradient-button';

// After
import { Button, Input, GradientButton } from '@/components/ui';
```

```tsx
// Before
import { useChat } from '@/hooks/useChat';
import { useChatUI } from '@/hooks/useChatUI';
import { useAsyncData } from '@/hooks/useAsyncData';

// After
import { useChat, useChatUI, useAsyncData } from '@/hooks';
```

```tsx
// Before
import { ChatPanel } from '@/components/common/ChatPanel';
import { ModalPanel } from '@/components/common/ModalPanel';
import { PageHeader } from '@/components/common/PageHeader';

// After
import { ChatPanel, ModalPanel, PageHeader } from '@/components/common';
```

---

## Testing Your Migration

After migrating, verify:

1. **Visual Appearance**: Components should look identical
2. **Functionality**: All interactions work as before
3. **Performance**: No performance regressions
4. **Type Safety**: No TypeScript errors

Run these commands:
```bash
# Check for TypeScript errors
npm run type-check

# Run tests
npm test

# Build to verify everything compiles
npm run build
```

---

## Need Help?

If you encounter issues during migration:

1. Check the component's TypeScript interface for available props
2. Look at existing usage in refactored components
3. Refer to the refactoring-summary.md for more context
4. Check the original component implementation for comparison

## Common Issues

### Issue: Chat not showing messages
**Solution**: Make sure you're passing the `profile` prop to `useChatUI`

### Issue: Button not styled correctly
**Solution**: Check that you're using the correct `variant` prop value

### Issue: Modal not closing
**Solution**: Ensure `isOpen` state is properly managed and `onClose` updates it

### Issue: Data not loading
**Solution**: Verify the `loader` function in `useAsyncData` returns a Promise
