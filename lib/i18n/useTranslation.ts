'use client';

import { useMemo, useEffect, useState } from 'react';
import translations from './translations';
import { defaultLanguage } from './languages';

export function useTranslation() {
  const [currentLang, setCurrentLang] = useState<string>(defaultLanguage);

  useEffect(() => {
    // Get language from localStorage or default
    const savedLang = localStorage.getItem('preferred-language') || defaultLanguage;
    setCurrentLang(savedLang);

    // Listen for language changes
    const handleStorageChange = () => {
      const lang = localStorage.getItem('preferred-language') || defaultLanguage;
      setCurrentLang(lang);
    };

    // Listen for custom language change event
    window.addEventListener('language-changed', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('language-changed', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const t = useMemo(() => {
    const langTranslations = translations[currentLang] || translations[defaultLanguage];
    
    return (key: string): string => {
      const keys = key.split('.');
      let value: any = langTranslations;
      
      for (const k of keys) {
        value = value?.[k];
      }
      
      return value || key;
    };
  }, [currentLang]);

  return { t, currentLang };
}

