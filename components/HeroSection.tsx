'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/useTranslation';

export function HeroSection() {
  const { t } = useTranslation();

  const title = t('hero.title');
  const subtitle = t('hero.subtitle');
  
  // Handle title formatting - keep "Keerthi Raj" in red for all languages
  const titleParts = title.split('Keerthi Raj');
  const hasKeerthiRaj = title.includes('Keerthi Raj');

  return (
    <div className="relative z-10 text-center">
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-8 leading-tight tracking-tight">
        {hasKeerthiRaj ? (
          <>
            <span className="text-white">{titleParts[0]}</span>
            <span className="bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">Keerthi Raj.</span>
            <br />
            <span className="bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
              {subtitle}
            </span>
          </>
        ) : (
          <>
            <span className="text-white">{titleParts[0]}</span>
            <br />
            <span className="bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
              {subtitle}
            </span>
          </>
        )}
      </h1>
      <p className="text-xl md:text-2xl text-white mb-12 font-medium max-w-2xl mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
        {t('hero.description')}
      </p>
      <div className="flex flex-wrap justify-center gap-4 mb-16">
        <Link
          href="/health-check"
          className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-red-700 px-10 py-4 text-base font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 premium-glow"
        >
          <span className="relative z-10">{t('hero.cta')}</span>
          <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </Link>
        <Link
          href="/about-coach"
          className="inline-flex items-center justify-center rounded-full border-2 border-gray-700 px-10 py-4 text-base font-semibold text-gray-200 hover:border-red-500/50 hover:text-red-400 transition-all duration-300 hover:bg-red-500/5 backdrop-blur-sm"
        >
          {t('hero.ctaSecondary') || 'Discover KR Fitness'}
        </Link>
      </div>
    </div>
  );
}

