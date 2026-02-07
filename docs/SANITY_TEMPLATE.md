# Sanity CMS Template — Restaurant Menu + EU-14 Allergens

Repeatable setup guide for adding Sanity Studio to a Next.js restaurant website
with standardized EU-14 allergen icons (LaLola icon set).

---

## Overview

This template adds:
- **Sanity Studio** embedded at `/studio` (no separate deploy)
- **Schemas**: `allergen` (14 EU records), `category`, `menuItem`
- **Allergen icons**: Spanish-named PNGs in `public/allergens/`
- **Frontend wiring**: allergen badges rendered per menu item via name matching

## Prerequisites

- Next.js App Router project (tested with 16.x)
- Node 18+
- Sanity account at [sanity.io](https://www.sanity.io)

---

## Step 1 — Install Dependencies

```bash
npm install sanity next-sanity @sanity/image-url @sanity/vision
npm install --save-dev dotenv tsx
```

## Step 2 — Create Sanity Project

Option A — Via CLI:
```bash
npx sanity login
npx sanity init --create-project "restaurant-name" --dataset production
```

Option B — Via dashboard:
1. Go to https://www.sanity.io/manage
2. Create project, note the **Project ID**
3. Create dataset named `production`

## Step 3 — Environment Variables

Create `.env.local`:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_WRITE_TOKEN=your_write_token
```

The write token is only used server-side (seeding scripts). Frontend reads
use the public dataset (no token needed for `aclMode: "public"`).

## Step 4 — Copy Sanity Files

Copy these directories/files from the template restaurant:

```
sanity.config.ts          # Root Sanity config (update project name)
sanity.cli.ts             # CLI config (update project ID)
sanity/
  schema.ts               # Schema index
  schemas/
    allergen.ts            # EU-14 allergen type (slug-validated)
    category.ts            # Menu category
    menuItem.ts            # Menu item with allergen refs
  lib/
    client.ts              # Public read-only Sanity client
    queries.ts             # GROQ queries (allergens, menu items)
    allergenIcons.ts        # Slug → Spanish filename mapping
app/studio/
  layout.tsx              # Bare layout (no site header/footer)
  [[...tool]]/page.tsx    # NextStudio route
components/
  AllergenIcons.tsx        # Renders allergen badges per item
public/allergens/          # 14 Spanish-named icon PNGs
scripts/
  seed-allergens.ts        # Seeds 14 EU allergens into Sanity
```

## Step 5 — Update Config for New Restaurant

In `sanity.config.ts`, change:
```ts
name: 'new-restaurant-slug',
title: 'New Restaurant Name',
```

In `sanity.cli.ts`, update the project ID.

## Step 6 — Seed Allergens

```bash
npx tsx scripts/seed-allergens.ts
```

This creates 14 allergen documents with deterministic IDs (`allergen-gluten`,
`allergen-eggs`, etc.), so it's safe to re-run (uses `createOrReplace`).

## Step 7 — Add CORS Origins

In [Sanity Manage](https://www.sanity.io/manage) → Project → API → CORS Origins:

| Origin | Credentials |
|--------|-------------|
| `http://localhost:3000` | Yes |
| `https://your-domain.vercel.app` | Yes |
| `https://your-custom-domain.com` | Yes |

## Step 8 — Wire Menu Page

The menu page (`app/menu/page.tsx`) fetches allergen data from Sanity and
overlays it onto existing menu items (matched by normalized dish name):

```ts
import { fetchAllergensByDishName } from '@/sanity/lib/queries';

const allergenMap = await fetchAllergensByDishName();
// Map key = item.nombre.toLowerCase().trim()
// Map value = array of { slug, title_en, title_es }
```

In `MenuSection`, items with matching allergens render `<AllergenIcons>`.

## Step 9 — Deploy

Deploy to Vercel as normal. The Studio at `/studio` deploys automatically.
Add Sanity env vars to Vercel project settings.

---

## EU-14 Allergens Reference

| # | Slug | EN | ES | Icon File |
|---|------|----|----|-----------|
| 1 | gluten | Gluten | Gluten | gluten.png |
| 2 | crustaceans | Crustaceans | Crustáceos | crustaceos.png |
| 3 | eggs | Eggs | Huevos | huevos.png |
| 4 | fish | Fish | Pescado | pescado.png |
| 5 | peanuts | Peanuts | Cacahuetes | cacahuetes.png |
| 6 | soy | Soy | Soja | soja.png |
| 7 | milk | Milk | Lácteos | leche.png |
| 8 | nuts | Tree Nuts | Frutos de cáscara | frutos_de_cascara.png |
| 9 | celery | Celery | Apio | apio.png |
| 10 | mustard | Mustard | Mostaza | mostaza.png |
| 11 | sesame | Sesame | Sésamo | sesamo.png |
| 12 | sulfites | Sulfites | Sulfitos | sulfitos.png |
| 13 | lupin | Lupin | Altramuces | altramuces.png |
| 14 | molluscs | Molluscs | Moluscos | moluscos.png |

## Schema Validation

- Allergen slugs are validated against a fixed list — no new slugs can be created
- Each allergen has a deterministic `_id` (`allergen-{slug}`) for cross-project consistency
- `sortOrder` is enforced 1–14
- `iconSlug` is auto-set to match `slug` for icon resolution

## Architecture Notes

- **Frontend reads**: Public CDN client (no token, `useCdn: true`)
- **Studio writes**: Authenticated via Sanity login (browser session)
- **Seed scripts**: Use `SANITY_API_WRITE_TOKEN` (server-side only)
- **Allergen overlay**: Sanity menu items matched to Google Sheets items by name
- **Icons**: Spanish filenames mapped via `ALLERGEN_ICON_MAP` in `allergenIcons.ts`
