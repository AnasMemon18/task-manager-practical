import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, type LanguageCode } from '../i18n';

interface UseLanguageResult {
  currentLanguage: LanguageCode;
  availableLanguages: typeof SUPPORTED_LANGUAGES;
  changeLanguage: (code: LanguageCode) => void;
}

export function useLanguage(): UseLanguageResult {
  const { i18n } = useTranslation();

  function changeLanguage(code: LanguageCode): void {
    void i18n.changeLanguage(code);
  }

  return {
    currentLanguage: i18n.language as LanguageCode,
    availableLanguages: SUPPORTED_LANGUAGES,
    changeLanguage,
  };
}