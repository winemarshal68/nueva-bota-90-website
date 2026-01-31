'use client';

import { useLanguage } from '@/hooks/useLanguage';

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price?: string;
  priceHalf?: string;
  priceFull?: string;
  region?: string; // For wines
}

interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  note?: string;
  items: MenuItem[];
}

interface MenuSectionProps {
  categories: MenuCategory[];
}

export default function MenuSection({ categories }: MenuSectionProps) {
  const { language } = useLanguage();
  const halfLabel = language === 'es' ? '1/2' : 'Half';
  const fullLabel = language === 'es' ? 'Entera' : 'Full';

  return (
    <div className="max-w-4xl mx-auto space-y-16">
      {categories.map((category) => (
        <div key={category.id}>
          <h2 className="text-3xl font-serif font-bold text-stone-900 mb-8 pb-3 border-b-2 border-stone-200">
            {category.name}
          </h2>
          {category.description && (
            <p className="text-stone-600 italic mb-6">{category.description}</p>
          )}
          {category.note && (
            <p className="text-sm text-stone-500 italic mb-6 bg-stone-50 p-3 rounded">
              {category.note}
            </p>
          )}
          <div className="space-y-6">
            {category.items.map((item) => (
              <div key={item.id} className="group">
                <div className="grid grid-cols-[1fr_auto] gap-4 items-start mb-2">
                  <div className="min-w-0">
                    <h3 className="text-xl font-semibold text-stone-900 group-hover:text-stone-700 transition-colors">
                      {item.name}
                    </h3>
                  </div>
                  <div className="text-right whitespace-nowrap">
                    {item.price && (
                      <span className="text-xl font-semibold text-stone-900">
                        {item.price === '—' ? '—' : `€${item.price}`}
                      </span>
                    )}
                    {item.priceHalf && item.priceFull && (
                      <div className="flex flex-col items-end">
                        <span className="text-xl font-semibold text-stone-900">
                          <span className="text-sm text-stone-600">{halfLabel}</span> €{item.priceHalf}
                        </span>
                        <span className="text-xl font-semibold text-stone-900">
                          <span className="text-sm text-stone-600">{fullLabel}</span> €{item.priceFull}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                {item.description && (
                  <p className="text-stone-600 leading-relaxed">{item.description}</p>
                )}
                {item.region && (
                  <p className="text-sm text-stone-500 italic mt-1">{item.region}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
