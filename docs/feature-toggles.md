# Feature Toggles

This document tracks features that can be easily enabled/disabled in the application.

## Swipe Card Feature

**Status**: Hidden (Disabled)  
**Last Updated**: 2026-02-04

### What Was Changed

The swipe card feature has been hidden from the UI:

1. **Bottom Navigation** - Removed "Swipe" tab from navigation bar
2. **HomePage** - Hidden floating action button (sparkles icon)
3. **App.tsx** - Removed swipe case from routing

### Files Modified

- `src/App.tsx`
  - Removed `SwipePage` import
  - Removed `handleSwipe` from useUserProfile destructuring
  - Removed 'swipe' from bottom navigation tabs array
  - Removed swipe case from renderContent switch
  - Removed `onNavigateToSwipe` prop from HomePage

- `src/components/home/HomePage.tsx`
  - Made floating action button conditional (only shows if `onNavigateToSwipe` prop is provided)

### Data Still Available

The swipe card data remains in the codebase:
- `src/data/traits.ts` - Contains all 55 trait cards
- `src/components/swipe/SwipePage.tsx` - Component still exists
- `src/hooks/useUserProfile.ts` - Still tracks accepted/rejected traits

### How to Re-enable

To re-enable the swipe card feature:

1. **Restore App.tsx imports**:
```tsx
import { SwipePage } from '@/components/swipe/SwipePage';
```

2. **Restore handleSwipe in useUserProfile**:
```tsx
const {
  profile,
  isOnboarded,
  completeOnboarding,
  handleSwipe,  // Add this back
  updateProfile,
  clearHistory,
  deleteAccount,
  removePartner
} = useUserProfile();
```

3. **Restore HomePage navigation prop**:
```tsx
case 'horoscope':
  return <HomePage profile={profile} onNavigateToSwipe={() => setActiveTab('swipe')} />;
```

4. **Restore swipe case in renderContent**:
```tsx
case 'swipe':
  return <SwipePage profile={profile} onSwipe={handleSwipe} />;
```

5. **Restore swipe in bottom navigation**:
```tsx
{(['horoscope', 'swipe', 'readings', 'love', 'guidance', 'profile'] as Tab[]).map((tab) => (
```

### Impact

- **User Experience**: Users will no longer see the swipe card feature
- **Data**: Existing user swipe data in localStorage is preserved
- **Code**: SwipePage component and trait data remain in codebase (not deleted)
- **Bundle Size**: Slightly reduced (~20KB) as SwipePage is no longer imported

### Notes

This is a soft disable - the feature can be quickly re-enabled by uncommenting/restoring the code. If you want to permanently remove the feature, you would need to:
- Delete `src/components/swipe/` directory
- Delete `src/data/traits.ts`
- Remove swipe-related code from `useUserProfile.ts`
- Remove swipe translations from locale files

---

## Other Features

### Feature Toggle Template

When hiding/showing other features, document them here using this template:

**Feature Name**: [Name]  
**Status**: [Enabled/Hidden]  
**Last Updated**: [Date]

**What Was Changed**:
- List of changes

**Files Modified**:
- List of files

**How to Re-enable/Disable**:
- Steps to toggle

---

## Best Practices

When hiding features:

1. **Soft Disable First**: Comment out or conditionally render rather than delete
2. **Document Changes**: Update this file with what was changed
3. **Preserve Data**: Keep data structures intact in case feature is re-enabled
4. **Test Build**: Always verify the app builds successfully after changes
5. **Check Dependencies**: Ensure no other features depend on the hidden feature
