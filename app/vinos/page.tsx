import { i18n } from '@/content/i18n';
import MenuSection from '@/components/MenuSection';
import wineEN from '@/content/wine.en.json';
import { getServerLanguage } from '@/lib/getServerLanguage';
import { fetchVinosData } from '@/lib/menuDataFetcher';
import type { ItemCarta } from '@/types/menu';

// Revalidate every 60 seconds (1 minute) for faster wine list updates
export const revalidate = 60;

export default async function WinePage({
  searchParams,
}: {
  searchParams: { lang?: string };
}) {
  const language = getServerLanguage(searchParams);
  const t = i18n[language];

  // For Spanish: fetch from Google Sheets CSV with JSON fallback
  // For English: use existing wine.en.json (no changes)
  const wineData =
    language === 'es'
      ? transformVinosToMenu(await fetchVinosData())
      : wineEN;

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

/**
 * Transforms wine data (ItemCarta[]) to the menu categories format
 * Groups wines by seccion (categoria) and maintains the expected structure
 */
function transformVinosToMenu(items: ItemCarta[]) {
  // Group by seccion (which maps to categoria from CSV)
  const categoriesMap = new Map<
    string,
    Array<{
      id: string;
      name: string;
      description?: string;
      region?: string;
      price?: string;
    }>
  >();

  items.forEach((item) => {
    const categoryName = item.seccion || 'Otros';
    const categoryItems = categoriesMap.get(categoryName) || [];

    categoryItems.push({
      id: `${categoryName.toLowerCase()}-${item.orden}`,
      name: item.nombre,
      description: item.descripcion,
      region: item.region,
      price: item.precio,
    });

    categoriesMap.set(categoryName, categoryItems);
  });

  // Convert to categories array format
  const categories = Array.from(categoriesMap.entries()).map(
    ([name, items]) => ({
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      items,
    })
  );

  return { categories };
}
