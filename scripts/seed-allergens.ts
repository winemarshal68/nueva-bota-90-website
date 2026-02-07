/**
 * Seed the 14 EU allergens into Sanity.
 * Run: npx tsx scripts/seed-allergens.ts
 *
 * Requires SANITY_API_WRITE_TOKEN, NEXT_PUBLIC_SANITY_PROJECT_ID,
 * and NEXT_PUBLIC_SANITY_DATASET in .env.local
 */
import { config } from 'dotenv'
config({ path: '.env.local' })
import { createClient } from 'next-sanity'

const ALLERGENS = [
  { sortOrder: 1, slug: 'gluten', title_en: 'Gluten', title_es: 'Gluten' },
  { sortOrder: 2, slug: 'crustaceans', title_en: 'Crustaceans', title_es: 'Crustáceos' },
  { sortOrder: 3, slug: 'eggs', title_en: 'Eggs', title_es: 'Huevos' },
  { sortOrder: 4, slug: 'fish', title_en: 'Fish', title_es: 'Pescado' },
  { sortOrder: 5, slug: 'peanuts', title_en: 'Peanuts', title_es: 'Cacahuetes' },
  { sortOrder: 6, slug: 'soy', title_en: 'Soy', title_es: 'Soja' },
  { sortOrder: 7, slug: 'milk', title_en: 'Milk', title_es: 'Lácteos' },
  { sortOrder: 8, slug: 'nuts', title_en: 'Tree Nuts', title_es: 'Frutos de cáscara' },
  { sortOrder: 9, slug: 'celery', title_en: 'Celery', title_es: 'Apio' },
  { sortOrder: 10, slug: 'mustard', title_en: 'Mustard', title_es: 'Mostaza' },
  { sortOrder: 11, slug: 'sesame', title_en: 'Sesame', title_es: 'Sésamo' },
  { sortOrder: 12, slug: 'sulfites', title_en: 'Sulfites', title_es: 'Sulfitos' },
  { sortOrder: 13, slug: 'lupin', title_en: 'Lupin', title_es: 'Altramuces' },
  { sortOrder: 14, slug: 'molluscs', title_en: 'Molluscs', title_es: 'Moluscos' },
] as const

async function main() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  const token = process.env.SANITY_API_WRITE_TOKEN

  if (!projectId || !dataset || !token) {
    console.error('Missing env vars. Need NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN')
    process.exit(1)
  }

  const client = createClient({
    projectId,
    dataset,
    token,
    apiVersion: '2024-01-01',
    useCdn: false,
  })

  console.log(`Seeding ${ALLERGENS.length} allergens into ${projectId}/${dataset}...\n`)

  const tx = client.transaction()

  for (const a of ALLERGENS) {
    const id = `allergen-${a.slug}`
    tx.createOrReplace({
      _id: id,
      _type: 'allergen',
      title_en: a.title_en,
      title_es: a.title_es,
      slug: { _type: 'slug', current: a.slug },
      iconSlug: a.slug,
      sortOrder: a.sortOrder,
    })
    console.log(`  ${a.sortOrder}. ${a.title_en} (${a.slug})`)
  }

  await tx.commit()
  console.log('\nDone! All 14 EU allergens seeded.')
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
