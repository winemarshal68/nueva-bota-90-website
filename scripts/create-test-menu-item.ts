#!/usr/bin/env tsx
/**
 * Creates a single test menuItem in Sanity to verify allergen icon rendering.
 * Run: NEXT_PUBLIC_SANITY_PROJECT_ID=iv0ofcfx NEXT_PUBLIC_SANITY_DATASET=production node --import tsx/esm scripts/create-test-menu-item.ts
 */

import 'dotenv/config'
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2024-01-01',
})

async function createTestMenuItem() {
  // First, fetch allergen IDs for eggs and milk
  const allergens = await client.fetch<{ _id: string; title_es: string; slug: string }[]>(
    `*[_type == "allergen" && slug.current in ["eggs", "milk"]] { _id, title_es, "slug": slug.current }`
  )

  if (allergens.length < 2) {
    console.error('❌ Could not find eggs and milk allergens')
    return
  }

  console.log(`Found allergens:`, allergens.map(a => `${a.title_es} (${a.slug})`).join(', '))

  // Create a test menuItem matching a real dish from the menu
  const testItem = {
    _type: 'menuItem',
    _id: 'menuItem-test-tortilla',
    name_es: 'Tortilla de patata',
    description_es: 'Plato de prueba para verificar iconos de alérgenos',
    price: 8.50,
    allergens: allergens.map(a => ({ _type: 'reference', _ref: a._id })),
    active: true,
    sortOrder: 999,
  }

  console.log('\nCreating test menuItem:', testItem.name_es)
  const result = await client.createOrReplace(testItem)
  console.log('✅ Created:', result._id)
  console.log('\nTest item created with allergens:', allergens.map(a => a.title_es).join(', '))
  console.log('\nVisit https://nuevabota90.es/menu?lang=es to verify icons appear on "Tortilla de patata"')
}

createTestMenuItem().catch(console.error)
