interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: string;
  region?: string; // For wines
}

interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

interface MenuSectionProps {
  categories: MenuCategory[];
}

export default function MenuSection({ categories }: MenuSectionProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-16">
      {categories.map((category) => (
        <div key={category.id}>
          <h2 className="text-3xl font-serif font-bold text-stone-900 mb-8 pb-3 border-b-2 border-stone-200">
            {category.name}
          </h2>
          <div className="space-y-6">
            {category.items.map((item) => (
              <div key={item.id} className="group">
                <div className="flex justify-between items-start gap-4 mb-2">
                  <h3 className="text-xl font-semibold text-stone-900 group-hover:text-stone-700 transition-colors">
                    {item.name}
                  </h3>
                  <span className="text-xl font-semibold text-stone-900 whitespace-nowrap">
                    €{item.price}
                  </span>
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
