import { ItemCarta } from '@/types/menu';
import { parseCartaCSV, parseVinosCSV } from './csvParser';
import cartaItemsData from '@/data/carta_items.json';
import wineESData from '@/content/wine.es.json';

/**
 * Fetches carta (food menu) data from Google Sheets CSV
 * Falls back to local JSON if CSV fetch or parse fails
 */
export async function fetchCartaData(): Promise<ItemCarta[]> {
  const csvUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_CARTA_CSV_URL;

  // If no CSV URL configured, use local JSON
  if (!csvUrl || csvUrl.trim() === '') {
    console.log('[Menu Fetcher] No CARTA CSV URL configured, using local JSON');
    return cartaItemsData.items as ItemCarta[];
  }

  try {
    // Fetch CSV with 1-hour cache
    const response = await fetch(csvUrl, {
      next: { revalidate: 3600 }, // 1 hour
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
    console.warn('[Menu Fetcher] Failed to load CARTA CSV, using fallback JSON:', error);
    return cartaItemsData.items as ItemCarta[];
  }
}

/**
 * Fetches vinos (wine menu) data from Google Sheets CSV
 * Falls back to local JSON if CSV fetch or parse fails
 *
 * Note: wine.es.json has a different structure (categories with nested items)
 * This function returns ItemCarta[] for consistency
 */
export async function fetchVinosData(): Promise<ItemCarta[]> {
  const csvUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_VINOS_CSV_URL;

  // If no CSV URL configured, convert wine JSON to ItemCarta format
  if (!csvUrl || csvUrl.trim() === '') {
    console.log('[Menu Fetcher] No VINOS CSV URL configured, using local JSON');
    return convertWineJSONToItemCarta(wineESData);
  }

  try {
    // Fetch CSV with 1-hour cache
    const response = await fetch(csvUrl, {
      next: { revalidate: 3600 }, // 1 hour
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
    console.warn('[Menu Fetcher] Failed to load VINOS CSV, using fallback JSON:', error);
    return convertWineJSONToItemCarta(wineESData);
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
