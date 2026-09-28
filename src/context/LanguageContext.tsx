import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, TRANSLATIONS, TranslationDict } from '../utils/translations';

interface LanguageContextType {
  currentLang: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDict;
  isRtl: boolean;
  availableLanguages: { code: Language; name: string; native: string; flag: string }[];
}

const STORAGE_LANG_KEY = 'academic_app_lang_v2';

const AVAILABLE_LANGUAGES: { code: Language; name: string; native: string; flag: string }[] = [
  { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸' },
  { code: 'ur', name: 'Urdu', native: 'اردو', flag: '🇵🇰' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦' },
  { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', native: 'Deutsch', flag: '🇩🇪' },
];

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LANG_KEY) as Language;
      if (saved && TRANSLATIONS[saved]) return saved;
    } catch (_) {}
    return 'en';
  });

  const isRtl = currentLang === 'ar' || currentLang === 'ur';

  const setLanguage = (lang: Language) => {
    if (!TRANSLATIONS[lang]) return;
    setCurrentLang(lang);
    try {
      localStorage.setItem(STORAGE_LANG_KEY, lang);
    } catch (_) {}

    // Dispatch global custom event for any outside listeners
    window.dispatchEvent(new CustomEvent('academic:languagechange', { detail: { lang } }));
  };

  // Sync HTML lang and dir attributes
  useEffect(() => {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  }, [currentLang, isRtl]);

  // Global listener for language change events
  useEffect(() => {
    const handleGlobalLangChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ lang: Language }>;
      if (customEvent.detail && customEvent.detail.lang && customEvent.detail.lang !== currentLang) {
        setCurrentLang(customEvent.detail.lang);
      }
    };

    window.addEventListener('academic:languagechange', handleGlobalLangChange);
    return () => {
      window.removeEventListener('academic:languagechange', handleGlobalLangChange);
    };
  }, [currentLang]);

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  return (
    <LanguageContext.Provider
      value={{
        currentLang,
        setLanguage,
        t,
        isRtl,
        availableLanguages: AVAILABLE_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    // Graceful fallback if used outside provider
    return {
      currentLang: 'en',
      setLanguage: () => {},
      t: TRANSLATIONS.en,
      isRtl: false,
      availableLanguages: AVAILABLE_LANGUAGES,
    };
  }
  return context;
};
