import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { LanguageSwitcher } from '../common/LanguageSwitcher';

beforeEach(async () => {
  await i18n.init({
    lng: 'en',
    fallbackLng: 'en',
    resources: {
      en: { 
        common: { 
          language: 'Language',
          english: 'English',
          vietnamese: 'Vietnamese',
          korean: 'Korean',
          japanese: 'Japanese'
        } 
      },
    },
  });
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
);

describe('LanguageSwitcher', () => {
  it('should render all language buttons', () => {
    render(<LanguageSwitcher />, { wrapper });
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(4); // EN, VI, KO, JA
  });

  it('should display current language as active', () => {
    render(<LanguageSwitcher />, { wrapper });
    const enButton = screen.getByTitle('English');
    expect(enButton).toHaveTextContent('🇺🇸');
    expect(enButton).toHaveTextContent('EN');
  });

  it('should change language on button click', async () => {
    const user = userEvent.setup();
    render(<LanguageSwitcher />, { wrapper });
    
    const viButton = screen.getByTitle('Tiếng Việt');
    await user.click(viButton);
    
    expect(i18n.language).toBe('vi');
  });

  it('should render all language flags', () => {
    render(<LanguageSwitcher />, { wrapper });
    expect(screen.getByText('🇺🇸')).toBeInTheDocument();
    expect(screen.getByText('🇻🇳')).toBeInTheDocument();
    expect(screen.getByText('🇰🇷')).toBeInTheDocument();
    expect(screen.getByText('🇯🇵')).toBeInTheDocument();
  });
});
