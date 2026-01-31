'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Language } from '@/content/i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('es');
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // On mount, check localStorage and URL params
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlLang = params.get('lang') as Language | null;

      if (urlLang && (urlLang === 'es' || urlLang === 'en')) {
        setLanguageState(urlLang);
        localStorage.setItem('language', urlLang);
      } else {
        const stored = localStorage.getItem('language') as Language | null;
        if (stored && (stored === 'es' || stored === 'en')) {
          setLanguageState(stored);
          // Optionally sync URL with stored preference
          const newParams = new URLSearchParams(window.location.search);
          newParams.set('lang', stored);
          router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
        }
      }
    }

    setMounted(true);
  }, [pathname, router]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);

    // Update URL parameter
    const params = new URLSearchParams(window.location.search);
    params.set('lang', lang);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
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
