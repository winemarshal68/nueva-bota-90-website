import { sanityClient } from './client'

export interface SanityAllergen {
  _id: string
  title_en: string
  title_es: string
  slug: string
  iconSlug: string
  sortOrder: number
}

export interface SanityMenuItem {
  _id: string
  name_es: string
  description_es?: string
  price?: number
  category?: { title_es: string; sortOrder: number }
  allergens: SanityAllergen[]
  needsReview?: boolean
  active?: boolean
  sortOrder?: number
}

/** Fetch all 14 EU allergens ordered by sortOrder */
export async function fetchAllergens(): Promise<SanityAllergen[]> {
  return sanityClient.fetch(
    `*[_type == "allergen"] | order(sortOrder asc) {
      _id,
      title_en,
      title_es,
      "slug": slug.current,
      iconSlug,
      sortOrder
    }`
  )
}

/** Fetch all active menu items with their dereferenced allergens */
export async function fetchMenuItems(): Promise<SanityMenuItem[]> {
  return sanityClient.fetch(
    `*[_type == "menuItem" && active != false] | order(sortOrder asc) {
      _id,
      name_es,
      description_es,
      price,
      category->{ title_es, sortOrder },
      "allergens": allergens[]->{ _id, title_en, title_es, "slug": slug.current, iconSlug, sortOrder } | order(sortOrder asc),
      needsReview,
      active,
      sortOrder
    }`
  )
}

/**
 * Build a lookup map: normalized dish name → allergen slugs
 * Used to overlay Sanity allergen data onto Google Sheets menu items
 */
export async function fetchAllergensByDishName(): Promise<
  Map<string, SanityAllergen[]>
> {
  const items = await fetchMenuItems()
  const map = new Map<string, SanityAllergen[]>()
  for (const item of items) {
    if (item.allergens?.length) {
      // Normalize: lowercase, trim whitespace
      const key = item.name_es.toLowerCase().trim()
      map.set(key, item.allergens)
    }
  }
  return map
}
