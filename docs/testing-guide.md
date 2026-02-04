# Testing Guide

This project uses Vitest and React Testing Library for testing.

## Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Test Structure

Tests are located in `__tests__` folders next to the code they test:

```
src/
├── lib/
│   ├── utils.ts
│   └── __tests__/
│       └── utils.test.ts
├── hooks/
│   ├── useTarot.ts
│   └── __tests__/
│       └── useTarot.test.ts
└── components/
    ├── LanguageSwitcher.tsx
    └── __tests__/
        └── LanguageSwitcher.test.tsx
```

## Test Coverage

Current test suites:

### Utilities
- `src/lib/__tests__/utils.test.ts` - Tests for `cn()` utility function

### Hooks
- `src/hooks/__tests__/useLocalStorage.test.ts` - Local storage hook tests
- `src/hooks/__tests__/useTarot.test.ts` - Tarot reading logic tests
- `src/hooks/__tests__/useI18n.test.tsx` - i18n hook tests
- `src/hooks/__tests__/useTranslatedData.test.tsx` - Data translation tests

### Components
- `src/components/__tests__/LanguageSwitcher.test.tsx` - Language switcher component tests

## Writing Tests

### Basic Test Structure

```typescript
import { describe, it, expect } from 'vitest';

describe('MyFunction', () => {
  it('should do something', () => {
    const result = myFunction();
    expect(result).toBe(expected);
  });
});
```

### Testing Hooks

```typescript
import { renderHook, act } from '@testing-library/react';

describe('useMyHook', () => {
  it('should update state', () => {
    const { result } = renderHook(() => useMyHook());
    
    act(() => {
      result.current.updateValue('new value');
    });

    expect(result.current.value).toBe('new value');
  });
});
```

### Testing Components

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('MyComponent', () => {
  it('should render', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('should handle click', async () => {
    const user = userEvent.setup();
    render(<MyComponent />);
    
    await user.click(screen.getByRole('button'));
    expect(screen.getByText('Clicked')).toBeInTheDocument();
  });
});
```

### Testing i18n Components

```typescript
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';

const wrapper = ({ children }) => (
  <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
);

describe('MyI18nComponent', () => {
  it('should render translated text', () => {
    render(<MyI18nComponent />, { wrapper });
    expect(screen.getByText('Translated')).toBeInTheDocument();
  });
});
```

## Best Practices

1. **Test behavior, not implementation** - Focus on what the user sees and does
2. **Use descriptive test names** - `it('should update count when button is clicked')`
3. **Arrange-Act-Assert** - Set up, perform action, verify result
4. **Clean up after tests** - Use `beforeEach` and `afterEach` hooks
5. **Mock external dependencies** - Use `vi.mock()` for API calls, etc.
6. **Test edge cases** - Empty states, errors, boundary conditions
7. **Keep tests isolated** - Each test should be independent

## Mocking

### Mock modules

```typescript
vi.mock('../api', () => ({
  fetchData: vi.fn(() => Promise.resolve({ data: 'mocked' }))
}));
```

### Mock localStorage

```typescript
beforeEach(() => {
  localStorage.clear();
});
```

### Mock timers

```typescript
vi.useFakeTimers();
vi.advanceTimersByTime(1000);
vi.useRealTimers();
```

## Common Assertions

```typescript
// Equality
expect(value).toBe(expected);
expect(value).toEqual(expected);

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeUndefined();

// Numbers
expect(value).toBeGreaterThan(3);
expect(value).toBeLessThan(10);

// Arrays
expect(array).toHaveLength(3);
expect(array).toContain(item);

// Objects
expect(obj).toHaveProperty('key');
expect(obj).toMatchObject({ key: 'value' });

// DOM
expect(element).toBeInTheDocument();
expect(element).toHaveTextContent('text');
expect(element).toBeVisible();
```

## Debugging Tests

```typescript
// Print component tree
import { screen } from '@testing-library/react';
screen.debug();

// Print specific element
screen.debug(screen.getByRole('button'));

// Use console.log
console.log(result.current);
```

## CI/CD Integration

Add to your CI pipeline:

```yaml
- name: Run tests
  run: npm run test:run

- name: Check coverage
  run: npm run test:coverage
```

## Next Steps

To expand test coverage:

1. Add tests for remaining hooks (`useChat`, `useCompatibility`, `useMonthlyEnergy`)
2. Add tests for page components (`HomePage`, `TarotPage`, etc.)
3. Add integration tests for user flows
4. Add E2E tests with Playwright
5. Set up coverage thresholds in `vitest.config.ts`
