import { i18n } from '@/content/i18n';
import MenuSection from '@/components/MenuSection';
import menuEN from '@/content/menu.en.json';
import { groupMenuItems, sectionMetadata } from '@/lib/menuData';
import { getServerLanguage } from '@/lib/getServerLanguage';
import { fetchCartaData } from '@/lib/menuDataFetcher';
import type { ItemCarta } from '@/types/menu';

// Revalidate every 60 seconds (1 minute) for faster menu updates
export const revalidate = 60;

export default async function MenuPage({
  searchParams,
}: {
  searchParams: { lang?: string };
}) {
  const language = getServerLanguage(searchParams);
  const t = i18n[language];

  // For Spanish: fetch from Google Sheets CSV with JSON fallback
  // For English: use existing menu.en.json (no changes)
  const menuData =
    language === 'es'
      ? transformCartaToMenu(await fetchCartaData())
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
