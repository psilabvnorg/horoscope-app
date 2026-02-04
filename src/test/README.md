# Test Suite

Comprehensive test coverage for the Horos astrology app.

## Quick Start

```bash
# Run all tests
npm test

# Run tests once (CI mode)
npm run test:run

# Open test UI
npm run test:ui
```

## Test Coverage Summary

### ✅ Utilities (5 tests)
- `cn()` class name merging utility

### ✅ Hooks (32 tests)
- **useLocalStorage** - Storage persistence and retrieval
- **useTarot** - Tarot reading generation and history
- **useI18n** - Internationalization helpers
- **useTranslatedData** - Dynamic data translation loading

### ✅ Components (4 tests)
- **LanguageSwitcher** - Language selection UI

## Total: 41 tests passing ✅

See [docs/testing-guide.md](../../docs/testing-guide.md) for detailed documentation.
