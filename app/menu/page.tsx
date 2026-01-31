'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { i18n } from '@/content/i18n';
import MenuSection from '@/components/MenuSection';
import menuEN from '@/content/menu.en.json';
import cartaItemsData from '@/data/carta_items.json';
import { groupMenuItems, sectionMetadata } from '@/lib/menuData';
import type { ItemCarta } from '@/types/menu';

export default function MenuPage() {
  const { language } = useLanguage();
  const t = i18n[language];

  // For Spanish: use new data model from carta_items.json
  // For English: use existing menu.en.json
  const menuData = language === 'es'
    ? transformCartaToMenu(cartaItemsData.items as ItemCarta[])
    : menuEN;

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

/**
 * Transforms Spanish carta data (ItemCarta[]) to the existing menu format
 * This adapter allows us to use the new Spanish schema while maintaining
 * backward compatibility with MenuSection component
 */
function transformCartaToMenu(items: ItemCarta[]) {
  const sections = groupMenuItems(items);

  return {
    categories: sections.map((section, index) => ({
      id: section.nombre.toLowerCase().replace(/\s+/g, '-'),
      name: section.nombre,
      description: sectionMetadata[section.nombre]?.descripcion,
      note: sectionMetadata[section.nombre]?.nota,
      items: section.items.map(item => ({
        id: `${section.nombre}-${item.orden}`,
        name: item.nombre,
        description: item.descripcion,
        price: item.precio,
        priceHalf: item.precio_media,
        priceFull: item.precio_entera,
        region: item.region
      }))
    }))
  };
}
