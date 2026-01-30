'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { i18n } from '@/content/i18n';
import MenuSection from '@/components/MenuSection';
import wineES from '@/content/wine.es.json';
import wineEN from '@/content/wine.en.json';

export default function WinePage() {
  const { language } = useLanguage();
  const t = i18n[language];
  const wineData = language === 'es' ? wineES : wineEN;

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-stone-900 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
            {t.winePage.title}
          </h1>
          <p className="text-xl text-stone-300 max-w-2xl mx-auto">
            {t.winePage.subtitle}
          </p>
        </div>
      </section>

      {/* Wine Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <MenuSection categories={wineData.categories} />
      </section>
    </div>
  );
}
