'use client';

import { useState, useEffect, useRef } from 'react';
import { Globe, Check } from 'lucide-react';
import { languages, type Language, defaultLanguage } from '@/lib/i18n/languages';

export function LanguageSelector() {
  const [currentLang, setCurrentLang] = useState<string>(defaultLanguage);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get language from localStorage or browser preference
    const savedLang = localStorage.getItem('preferred-language') || defaultLanguage;
    setCurrentLang(savedLang);

    // Set HTML lang attribute
    document.documentElement.lang = savedLang;
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLanguageChange = (langCode: string) => {
    setCurrentLang(langCode);
    localStorage.setItem('preferred-language', langCode);
    document.documentElement.lang = langCode;
    setIsOpen(false);

    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('language-changed', { detail: { lang: langCode } }));
    
    // Force a page reload to apply translations (temporary solution)
    // In a full implementation with React Context, this wouldn't be needed
    window.location.reload();
  };

  const currentLanguage = languages.find(l => l.code === currentLang) || languages[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-red-500/50 transition-all duration-300 text-gray-300 hover:text-white group"
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <Globe className="w-4 h-4 group-hover:text-red-400 transition-colors" />
        <span className="text-sm font-medium hidden sm:inline">{currentLanguage.flag} {currentLanguage.nativeName}</span>
        <span className="text-sm font-medium sm:hidden">{currentLanguage.flag}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 premium-card rounded-xl overflow-hidden border border-gray-800 shadow-2xl z-50">
          <div className="py-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full px-4 py-3 flex items-center justify-between text-left hover:bg-red-500/10 transition-colors ${
                  currentLang === lang.code ? 'bg-red-500/10' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{lang.flag}</span>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">{lang.nativeName}</span>
                    <span className="text-xs text-gray-400">{lang.name}</span>
                  </div>
                </div>
                {currentLang === lang.code && (
                  <Check className="w-4 h-4 text-red-400" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

