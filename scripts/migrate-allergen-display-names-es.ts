/**
 * One-time migration: normalize Spanish allergen display names by slug.
 *
 * Safe defaults:
 * - Dry run by default (no writes).
 * - Uses dataset "production" by default.
 *
 * Usage:
 *   npx tsx scripts/migrate-allergen-display-names-es.ts
 *   npx tsx scripts/migrate-allergen-display-names-es.ts --execute
 */
import { config } from 'dotenv'
import { createClient } from 'next-sanity'

config({ path: '.env.local' })

const SPANISH_BY_SLUG: Record<string, string> = {
  gluten: 'Gluten',
  crustaceans: 'Crustáceos',
  eggs: 'Huevos',
  fish: 'Pescado',
  peanuts: 'Cacahuetes',
  soy: 'Soja',
  milk: 'Leche',
  nuts: 'Frutos de cáscara',
  celery: 'Apio',
  mustard: 'Mostaza',
  sesame: 'Sésamo',
  sulfites: 'Sulfitos',
  lupin: 'Altramuces',
  molluscs: 'Moluscos',
}

async function main() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
  const token = process.env.SANITY_API_WRITE_TOKEN
  const execute = process.argv.includes('--execute')

  if (!projectId || !token) {
    console.error(
      'Missing env vars. Need NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN.'
    )
    process.exit(1)
  }

  const client = createClient({
    projectId,
    dataset,
    token,
    apiVersion: '2024-01-01',
    useCdn: false,
  })

  const slugs = Object.keys(SPANISH_BY_SLUG)
  console.log(
    `[${execute ? 'EXECUTE' : 'DRY RUN'}] Checking ${slugs.length} allergen slugs in ${projectId}/${dataset}`
  )

  const tx = client.transaction()
  let patchCount = 0

  for (const slug of slugs) {
    const docs = await client.fetch<{ _id: string; title_es?: string }[]>(
      `*[_type == "allergen" && slug.current == $slug]{ _id, title_es }`,
      { slug }
    )

    if (!docs.length) {
      console.warn(`- Missing document for slug "${slug}"`)
      continue
    }

    const desired = SPANISH_BY_SLUG[slug]
    for (const doc of docs) {
      if (doc.title_es === desired) {
        console.log(`- OK ${slug}: ${desired}`)
        continue
      }

      patchCount += 1
      console.log(`- PATCH ${slug}: "${doc.title_es ?? ''}" -> "${desired}" (${doc._id})`)
      tx.patch(doc._id, { set: { title_es: desired } })
    }
  }

  if (!patchCount) {
    console.log('No changes needed.')
    return
  }

  if (!execute) {
    console.log(`Dry run complete. ${patchCount} patch(es) prepared, none applied.`)
    console.log('Re-run with --execute to apply changes.')
    return
  }

  await tx.commit()
  console.log(`Migration complete. Applied ${patchCount} patch(es).`)
}

main().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
