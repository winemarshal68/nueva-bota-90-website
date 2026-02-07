/**
 * Maps EU-14 allergen slugs (English, used in Sanity schema)
 * to the Spanish icon filenames in public/allergens/
 */
export const ALLERGEN_ICON_MAP: Record<string, string> = {
  gluten: 'gluten.png',
  crustaceans: 'crustaceos.png',
  eggs: 'huevos.png',
  fish: 'pescado.png',
  peanuts: 'cacahuetes.png',
  soy: 'soja.png',
  milk: 'leche.png',
  nuts: 'frutos_de_cascara.png',
  celery: 'apio.png',
  mustard: 'mostaza.png',
  sesame: 'sesamo.png',
  sulfites: 'sulfitos.png',
  lupin: 'altramuces.png',
  molluscs: 'moluscos.png',
}

/** Resolve an allergen slug to its icon path (relative to public/) */
export function allergenIconPath(slug: string): string {
  const file = ALLERGEN_ICON_MAP[slug]
  return file ? `/allergens/${file}` : `/allergens/${slug}.png`
}
