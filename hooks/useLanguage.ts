'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '@/content/i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('es');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('language') as Language | null;
    if (stored && (stored === 'es' || stored === 'en')) {
      setLanguageState(stored);
    }
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  if (!mounted) {
    return null;
  }

  const value = { language, setLanguage };

  return React.createElement(
    LanguageContext.Provider,
    { value },
    children
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
