'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { i18n } from '@/content/i18n';
import MenuSection from '@/components/MenuSection';
import menuES from '@/content/menu.es.json';
import menuEN from '@/content/menu.en.json';

export default function MenuPage() {
  const { language } = useLanguage();
  const t = i18n[language];
  const menuData = language === 'es' ? menuES : menuEN;

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-stone-900 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
            {t.menuPage.title}
          </h1>
          <p className="text-xl text-stone-300 max-w-2xl mx-auto">
            {t.menuPage.subtitle}
          </p>
        </div>
      </section>

      {/* Menu Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <MenuSection categories={menuData.categories} />
      </section>
    </div>
  );
}
