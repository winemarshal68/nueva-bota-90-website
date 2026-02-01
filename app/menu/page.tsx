import { i18n } from '@/content/i18n';
import MenuSection from '@/components/MenuSection';
import menuEN from '@/content/menu.en.json';
import { groupMenuItems, sectionMetadata } from '@/lib/menuData';
import { getServerLanguage } from '@/lib/getServerLanguage';
import { fetchCartaData } from '@/lib/menuDataFetcher';
import type { ItemCarta } from '@/types/menu';

// Force runtime rendering to prevent build-time prerender failures
export const dynamic = "force-dynamic";

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const language = getServerLanguage(resolvedSearchParams);
  const t = i18n[language];

  // For Spanish: fetch from Google Sheets CSV with JSON fallback
  // For English: use existing menu.en.json (no changes)
  let fetchError: string | undefined;
  let menuData;

  if (language === 'es') {
    const result = await fetchCartaData();
    if (result.error || result.data.length === 0) {
      fetchError = result.error;
      menuData = { categories: [] };
    } else {
      menuData = transformCartaToMenu(result.data);
    }
  } else {
    menuData = menuEN;
  }

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
        {fetchError ? (
          <div className="max-w-4xl mx-auto text-center py-12">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-8">
              <p className="text-lg text-stone-700">
                Menú temporalmente no disponible. Inténtalo de nuevo en unos minutos.
              </p>
            </div>
          </div>
        ) : (
          <MenuSection categories={menuData.categories} />
        )}
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
