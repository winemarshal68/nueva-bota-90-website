import { ItemCarta } from '@/types/menu';
import { parseCartaCSV, parseVinosCSV } from './csvParser';

// Local JSON imports - ONLY used in development as last resort
import cartaItemsData from '@/data/carta_items.json';
import wineESData from '@/content/wine.es.json';

// Only enforce strict CSV-only behavior on Vercel production/preview
// Everywhere else (local dev, local build) allows fallback to JSON
const isVercelDeployment = process.env.VERCEL === '1';
const allowLocalFallback = !isVercelDeployment;

/**
 * Fetches carta (food menu) data from Google Sheets CSV
 *
 * PRODUCTION: REQUIRES Google Sheets CSV URL - throws error if missing or fetch fails
 * DEVELOPMENT: Falls back to local JSON for easier local testing
 */
export async function fetchCartaData(): Promise<ItemCarta[]> {
  const csvUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_CARTA_CSV_URL;

  // PRODUCTION: CSV URL is REQUIRED
  if (!csvUrl || csvUrl.trim() === '') {
    if (allowLocalFallback) {
      console.warn('[Menu Fetcher] [DEV ONLY] No CARTA CSV URL configured, using local JSON fallback');
      return cartaItemsData.items as ItemCarta[];
    }

    const error = new Error('NEXT_PUBLIC_GOOGLE_SHEET_CARTA_CSV_URL is required in production');
    console.error('[Menu Fetcher] PRODUCTION ERROR:', error);
    throw error;
  }

  try {
    // Fetch CSV with 1-minute cache for faster updates
    const response = await fetch(csvUrl, {
      next: { revalidate: 60 }, // 1 minute
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const csvText = await response.text();

    // Parse CSV
    const items = parseCartaCSV(csvText);

    if (items.length === 0) {
      throw new Error('Parsed CSV has no valid items');
    }

    console.log(`[Menu Fetcher] Loaded ${items.length} carta items from CSV`);
    return items;
  } catch (error) {
    // DEVELOPMENT: Allow fallback to stale local JSON for convenience
    if (allowLocalFallback) {
      console.warn('[Menu Fetcher] [DEV ONLY] Failed to load CARTA CSV, using local JSON fallback:', error);
      return cartaItemsData.items as ItemCarta[];
    }

    // PRODUCTION: DO NOT hide failures - expose them so they can be fixed
    console.error('[Menu Fetcher] PRODUCTION ERROR: Failed to load CARTA CSV from Google Sheets:', error);
    throw error;
  }
}

/**
 * Fetches vinos (wine menu) data from Google Sheets CSV
 *
 * PRODUCTION: REQUIRES Google Sheets CSV URL - throws error if missing or fetch fails
 * DEVELOPMENT: Falls back to local JSON for easier local testing
 *
 * Note: wine.es.json has a different structure (categories with nested items)
 * This function returns ItemCarta[] for consistency
 */
export async function fetchVinosData(): Promise<ItemCarta[]> {
  const csvUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_VINOS_CSV_URL;

  // PRODUCTION: CSV URL is REQUIRED
  if (!csvUrl || csvUrl.trim() === '') {
    if (allowLocalFallback) {
      console.warn('[Menu Fetcher] [DEV ONLY] No VINOS CSV URL configured, using local JSON fallback');
      return convertWineJSONToItemCarta(wineESData);
    }

    const error = new Error('NEXT_PUBLIC_GOOGLE_SHEET_VINOS_CSV_URL is required in production');
    console.error('[Menu Fetcher] PRODUCTION ERROR:', error);
    throw error;
  }

  try {
    // Fetch CSV with 1-minute cache for faster updates
    const response = await fetch(csvUrl, {
      next: { revalidate: 60 }, // 1 minute
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const csvText = await response.text();

    // Parse CSV
    const items = parseVinosCSV(csvText);

    if (items.length === 0) {
      throw new Error('Parsed CSV has no valid items');
    }

    console.log(`[Menu Fetcher] Loaded ${items.length} vinos items from CSV`);
    return items;
  } catch (error) {
    // DEVELOPMENT: Allow fallback to stale local JSON for convenience
    if (allowLocalFallback) {
      console.warn('[Menu Fetcher] [DEV ONLY] Failed to load VINOS CSV, using local JSON fallback:', error);
      return convertWineJSONToItemCarta(wineESData);
    }

    // PRODUCTION: DO NOT hide failures - expose them so they can be fixed
    console.error('[Menu Fetcher] PRODUCTION ERROR: Failed to load VINOS CSV from Google Sheets:', error);
    throw error;
  }
}

/**
 * Converts the wine.es.json structure to ItemCarta[] format
 * This allows us to use the same transformation logic for both CSV and JSON sources
 */
function convertWineJSONToItemCarta(
  wineData: typeof wineESData
): ItemCarta[] {
  const items: ItemCarta[] = [];
  let globalOrder = 1;

  for (const category of wineData.categories) {
    for (const item of category.items) {
      items.push({
        seccion: category.name, // Use category name as section
        nombre: item.name,
        descripcion: item.description,
        region: item.region,
        precio: item.price,
        disponible: true, // Assume all items in JSON are available
        orden: globalOrder++,
      });
    }
  }

  return items;
}
