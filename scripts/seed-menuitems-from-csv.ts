#!/usr/bin/env tsx
/**
 * Bulk-creates Sanity menuItem documents from Google Sheets CSV.
 *
 * Usage:
 *   DRY RUN:  node --import tsx/esm scripts/seed-menuitems-from-csv.ts
 *   EXECUTE:  node --import tsx/esm scripts/seed-menuitems-from-csv.ts --execute
 *
 * Environment variables required:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID
 *   NEXT_PUBLIC_SANITY_DATASET
 *   SANITY_API_WRITE_TOKEN (Editor or Admin role required)
 *
 * Features:
 *   - Idempotent: safe to rerun, uses deterministic IDs
 *   - No allergens assigned (set to empty array)
 *   - All items marked as active: true
 *   - Preserves section, description, price from CSV
 */

import { config } from 'dotenv'
import { createClient } from '@sanity/client'
import { parse } from 'csv-parse/sync'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load .env.local explicitly
config({ path: join(__dirname, '..', '.env.local') })

const execute = process.argv.includes('--execute')

interface ItemCarta {
  seccion: string
  nombre: string
  descripcion?: string
  precio?: string
  precio_media?: string
  precio_entera?: string
  disponible: boolean
  orden: number
  region?: string
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId) {
  console.error('❌ Missing NEXT_PUBLIC_SANITY_PROJECT_ID')
  process.exit(1)
}

if (execute && !token) {
  console.error('❌ Missing SANITY_API_WRITE_TOKEN')
  console.error('   Please provide a token with Editor or Admin role.')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  useCdn: !execute, // Use CDN for dry-run, direct for execute
  token: token || undefined,
  apiVersion: '2024-01-01',
})

/**
 * Generate deterministic document ID from dish name
 * Example: "Tortilla de patata" → "menuItem-tortilla-de-patata"
 */
function generateMenuItemId(nombre: string): string {
  const slug = nombre
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Spaces to hyphens
    .replace(/-+/g, '-') // Collapse multiple hyphens
    .replace(/^-|-$/g, '') // Trim hyphens

  return `menuItem-${slug}`
}

/**
 * Parse price to number (removes € symbol, handles comma decimal separator)
 */
function parsePrice(priceStr: string | undefined): number | undefined {
  if (!priceStr) return undefined
  if (priceStr === '—') return undefined

  const cleaned = priceStr.replace(/[€\s]/g, '').replace(',', '.')
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? undefined : parsed
}

/**
 * Fetch and parse the carta CSV from Google Sheets
 */
async function fetchCartaCSV(): Promise<ItemCarta[]> {
  const csvUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_CARTA_CSV_URL

  if (!csvUrl) {
    throw new Error('NEXT_PUBLIC_GOOGLE_SHEET_CARTA_CSV_URL not configured')
  }

  const response = await fetch(csvUrl)
  if (!response.ok) {
    throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`)
  }

  const csvText = await response.text()

  // Parse CSV using the same library as the frontend
  const records = parse(csvText, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as any[]

  // Transform CSV rows to ItemCarta format
  const items: ItemCarta[] = []
  let orden = 1

  for (const row of records) {
    // Skip rows without a nombre (dish name)
    if (!row.nombre || row.nombre.trim() === '') continue

    // Skip unavailable items
    const disponible = row.disponible?.toLowerCase() !== 'no'
    if (!disponible) continue

    items.push({
      seccion: row.seccion || 'Sin categoría',
      nombre: row.nombre.trim(),
      descripcion: row.descripcion?.trim() || undefined,
      precio: row.precio?.trim() || undefined,
      precio_media: row.precio_media?.trim() || undefined,
      precio_entera: row.precio_entera?.trim() || undefined,
      disponible: true,
      orden: orden++,
      region: row.region?.trim() || undefined,
    })
  }

  return items
}

async function seedMenuItems() {
  console.log(execute ? '[EXECUTE]' : '[DRY RUN]', `Seeding menuItems to ${projectId}/${dataset}`)

  // Fetch CSV data directly from Google Sheets
  let items: ItemCarta[]
  try {
    items = await fetchCartaCSV()
  } catch (err) {
    console.error('❌ Failed to fetch CSV data:', err)
    process.exit(1)
  }

  if (items.length === 0) {
    console.error('❌ No items found in CSV')
    process.exit(1)
  }

  console.log(`Fetched ${items.length} items from Google Sheets CSV\n`)

  // Check if category documents exist
  const existingCategories = await client.fetch<{ title_es: string }[]>(
    `*[_type == "category"] { title_es }`
  )
  const categoryTitles = new Set(existingCategories.map(c => c.title_es))

  // Build mutations
  const mutations = []
  let createdCount = 0
  let skippedCount = 0

  for (const item of items) {
    const docId = generateMenuItemId(item.nombre)

    // Parse price (handle both single price and half/full prices)
    let price: number | undefined
    if (item.precio) {
      price = parsePrice(item.precio)
    } else if (item.precio_media) {
      // For items with half/full pricing, use the full price
      price = parsePrice(item.precio_entera)
    }

    const doc = {
      _type: 'menuItem',
      _id: docId,
      name_es: item.nombre,
      description_es: item.descripcion || undefined,
      price,
      allergens: [], // No allergens assigned initially
      active: true,
      sortOrder: item.orden,
      // Note: category reference not set (would need to match seccion to category)
    }

    mutations.push({
      createOrReplace: doc,
    })

    if (!execute) {
      const priceDisplay = price ? `€${price}` : 'no price'
      console.log(`  - [${docId}] ${item.nombre} (${priceDisplay})`)
    }

    createdCount++
  }

  console.log(`\nPrepared ${createdCount} menuItem document(s)`)

  if (!execute) {
    console.log('\nDry run complete. Re-run with --execute to write to Sanity.')
    console.log('\nMissing categories (would need to be created separately):')
    const sectionsInCSV = new Set(items.map(i => i.seccion))
    const missingCategories = [...sectionsInCSV].filter(s => !categoryTitles.has(s))
    if (missingCategories.length > 0) {
      missingCategories.forEach(cat => console.log(`  - ${cat}`))
    } else {
      console.log('  (all sections have matching categories)')
    }
    return
  }

  // Execute mutations in batches of 100
  console.log('\nExecuting mutations...')
  const batchSize = 100
  for (let i = 0; i < mutations.length; i += batchSize) {
    const batch = mutations.slice(i, i + batchSize)
    await client
      .transaction(batch.map(m => ({ ...m })))
      .commit()
    console.log(`  Committed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(mutations.length / batchSize)}`)
  }

  console.log(`\n✅ Successfully created/updated ${createdCount} menuItem documents`)

  // Verify the result
  const count = await client.fetch<number>(`count(*[_type == "menuItem"])`)
  console.log(`\nVerification: Total menuItems in dataset: ${count}`)

  // Check how many have allergens
  const withAllergens = await client.fetch<number>(
    `count(*[_type == "menuItem" && count(allergens) > 0])`
  )
  console.log(`Items with allergens assigned: ${withAllergens}`)
}

seedMenuItems().catch((err) => {
  console.error('❌ Error:', err)
  process.exit(1)
})
