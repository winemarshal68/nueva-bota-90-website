#!/usr/bin/env tsx
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'iv0ofcfx',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2024-01-01',
})

async function verify() {
  const items = await client.fetch(
    `*[_type == 'menuItem'] {
      _id,
      name_es,
      active,
      'allergens': allergens[]->{ title_es }
    } | order(name_es asc)`
  )

  console.log('Total menuItems:', items.length)
  console.log('Active menuItems:', items.filter((i: any) => i.active !== false).length)
  console.log('\nFirst 5 items:')
  items.slice(0, 5).forEach((item: any) => {
    const allergens = item.allergens?.map((a: any) => a.title_es).join(', ') || 'none'
    console.log(`  - ${item.name_es} (allergens: ${allergens})`)
  })

  const withAllergens = items.filter((i: any) => i.allergens?.length > 0)
  console.log(`\nAllergen map size: ${withAllergens.length}`)
  console.log('(This is how many items will show allergen icons on the menu)')
}

verify().catch(console.error)
