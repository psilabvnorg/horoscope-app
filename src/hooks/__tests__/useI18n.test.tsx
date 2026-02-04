import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { useI18n, useI18nNamespace } from '../useI18n';

// Setup i18n for testing
beforeEach(async () => {
  await i18n.init({
    lng: 'en',
    fallbackLng: 'en',
    resources: {
      en: { common: { test: 'Test' } },
      vi: { common: { test: 'Kiểm tra' } },
      ko: { common: { test: '테스트' } },
      ja: { common: { test: 'テスト' } },
    },
  });
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
);

describe('useI18n', () => {
  it('should return current language', () => {
    const { result } = renderHook(() => useI18n(), { wrapper });
    expect(result.current.currentLanguage).toBe('en');
  });

  it('should change language', async () => {
    const { result } = renderHook(() => useI18n(), { wrapper });
    
    await act(async () => {
      await result.current.changeLanguage('vi');
    });

    expect(result.current.currentLanguage).toBe('vi');
  });

  it('should detect English language', () => {
    const { result } = renderHook(() => useI18n(), { wrapper });
    expect(result.current.isEnglish).toBe(true);
    expect(result.current.isVietnamese).toBe(false);
  });

  it('should detect Vietnamese language', async () => {
    const { result } = renderHook(() => useI18n(), { wrapper });
    
    await act(async () => {
      await result.current.changeLanguage('vi');
    });

    expect(result.current.isVietnamese).toBe(true);
    expect(result.current.isEnglish).toBe(false);
  });

  it('should return correct language name', () => {
    const { result } = renderHook(() => useI18n(), { wrapper });
    expect(result.current.getLanguageName()).toBe('English');
  });

  it('should return correct language flag', () => {
    const { result } = renderHook(() => useI18n(), { wrapper });
    expect(result.current.getLanguageFlag()).toBe('🇺🇸');
  });

  it('should return Korean language name and flag', async () => {
    const { result } = renderHook(() => useI18n(), { wrapper });
    
    await act(async () => {
      await result.current.changeLanguage('ko');
    });

    expect(result.current.getLanguageName()).toBe('한국어');
    expect(result.current.getLanguageFlag()).toBe('🇰🇷');
  });

  it('should return Japanese language name and flag', async () => {
    const { result } = renderHook(() => useI18n(), { wrapper });
    
    await act(async () => {
      await result.current.changeLanguage('ja');
    });

    expect(result.current.getLanguageName()).toBe('日本語');
    expect(result.current.getLanguageFlag()).toBe('🇯🇵');
  });
});

describe('useI18nNamespace', () => {
  it('should work with specific namespace', () => {
    const { result } = renderHook(() => useI18nNamespace('common'), { wrapper });
    expect(result.current.currentLanguage).toBe('en');
  });

  it('should change language in namespace hook', async () => {
    const { result } = renderHook(() => useI18nNamespace('tarot'), { wrapper });
    
    await act(async () => {
      await result.current.changeLanguage('ko');
    });

    expect(result.current.currentLanguage).toBe('ko');
  });
});
