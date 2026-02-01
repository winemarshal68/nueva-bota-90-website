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
 * Result type for data fetching - allows graceful error handling
 */
export type FetchResult<T> = {
  data: T;
  error?: string;
};

export type FetchCSVTextResult = {
  csvUrlConfigured: boolean;
  status: number | null;
  contentType: string | null;
  csvText: string | null;
  error?: string;
};

export async function fetchVinosCSVText(): Promise<FetchCSVTextResult> {
  const csvUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_VINOS_CSV_URL;

  if (!csvUrl || csvUrl.trim() === '') {
    return {
      csvUrlConfigured: false,
      status: null,
      contentType: null,
      csvText: null,
      error: 'NEXT_PUBLIC_GOOGLE_SHEET_VINOS_CSV_URL is not configured',
    };
  }

  try {
    // Match the production fetch behavior used by fetchVinosData()
    const response = await fetch(csvUrl, {
      next: { revalidate: 60 },
    });

    const contentType = response.headers.get('content-type');

    if (!response.ok) {
      return {
        csvUrlConfigured: true,
        status: response.status,
        contentType,
        csvText: null,
        error: `Failed to fetch vinos CSV: HTTP ${response.status} ${response.statusText}`,
      };
    }

    const csvText = await response.text();
    return {
      csvUrlConfigured: true,
      status: response.status,
      contentType,
      csvText,
    };
  } catch (error) {
    return {
      csvUrlConfigured: true,
      status: null,
      contentType: null,
      csvText: null,
      error: `Failed to fetch vinos CSV: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

/**
 * Fetches carta (food menu) data from Google Sheets CSV
 *
 * PRODUCTION: Returns empty array with error message if fetch fails (non-fatal)
 * DEVELOPMENT: Falls back to local JSON for easier local testing
 */
export async function fetchCartaData(): Promise<FetchResult<ItemCarta[]>> {
  const csvUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_CARTA_CSV_URL;

  // PRODUCTION: CSV URL is REQUIRED
  if (!csvUrl || csvUrl.trim() === '') {
    if (allowLocalFallback) {
      console.warn('[Menu Fetcher] [DEV ONLY] No CARTA CSV URL configured, using local JSON fallback');
      return { data: cartaItemsData.items as ItemCarta[] };
    }

    const errorMsg = 'NEXT_PUBLIC_GOOGLE_SHEET_CARTA_CSV_URL is not configured';
    console.error('[Menu Fetcher] PRODUCTION ERROR:', errorMsg);
    return { data: [], error: errorMsg };
  }

  try {
    // Fetch CSV with 1-minute cache for faster updates
    const response = await fetch(csvUrl, {
      next: { revalidate: 60 }, // 1 minute
    });

    if (!response.ok) {
      const errorMsg = `Failed to fetch menu: HTTP ${response.status} ${response.statusText}. URL: ${csvUrl}. Hint: Check Google Sheets sharing permissions.`;
      console.error('[Menu Fetcher] PRODUCTION ERROR:', errorMsg);
      return { data: [], error: errorMsg };
    }

    const csvText = await response.text();

    // Parse CSV
    const items = parseCartaCSV(csvText);

    if (items.length === 0) {
      const errorMsg = 'Parsed CSV has no valid items';
      console.error('[Menu Fetcher] PRODUCTION ERROR:', errorMsg);
      return { data: [], error: errorMsg };
    }

    console.log(`[Menu Fetcher] Loaded ${items.length} carta items from CSV`);
    return { data: items };
  } catch (error) {
    // DEVELOPMENT: Allow fallback to stale local JSON for convenience
    if (allowLocalFallback) {
      console.warn('[Menu Fetcher] [DEV ONLY] Failed to load CARTA CSV, using local JSON fallback:', error);
      return { data: cartaItemsData.items as ItemCarta[] };
    }

    // PRODUCTION: Return empty array with error instead of throwing
    const errorMsg = `Failed to load menu data: ${error instanceof Error ? error.message : String(error)}`;
    console.error('[Menu Fetcher] PRODUCTION ERROR:', errorMsg);
    return { data: [], error: errorMsg };
  }
}

/**
 * Fetches vinos (wine menu) data from Google Sheets CSV
 *
 * PRODUCTION: Returns empty array with error message if fetch fails (non-fatal)
 * DEVELOPMENT: Falls back to local JSON for easier local testing
 *
 * Note: wine.es.json has a different structure (categories with nested items)
 * This function returns ItemCarta[] for consistency
 */
export async function fetchVinosData(): Promise<FetchResult<ItemCarta[]>> {
  const csvUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_VINOS_CSV_URL;

  // PRODUCTION: CSV URL is REQUIRED
  if (!csvUrl || csvUrl.trim() === '') {
    if (allowLocalFallback) {
      console.warn('[Menu Fetcher] [DEV ONLY] No VINOS CSV URL configured, using local JSON fallback');
      return { data: convertWineJSONToItemCarta(wineESData) };
    }

    const errorMsg = 'NEXT_PUBLIC_GOOGLE_SHEET_VINOS_CSV_URL is not configured';
    console.error('[Menu Fetcher] PRODUCTION ERROR:', errorMsg);
    return { data: [], error: errorMsg };
  }

  try {
    // Fetch CSV with 1-minute cache for faster updates
    const response = await fetch(csvUrl, {
      next: { revalidate: 60 }, // 1 minute
    });

    if (!response.ok) {
      const errorMsg = `Failed to fetch wine list: HTTP ${response.status} ${response.statusText}. URL: ${csvUrl}. Hint: Check Google Sheets sharing permissions.`;
      console.error('[Menu Fetcher] PRODUCTION ERROR:', errorMsg);
      return { data: [], error: errorMsg };
    }

    const csvText = await response.text();

    // Parse CSV
    const items = parseVinosCSV(csvText);

    if (items.length === 0) {
      const errorMsg = 'Parsed CSV has no valid items';
      console.error('[Menu Fetcher] PRODUCTION ERROR:', errorMsg);
      return { data: [], error: errorMsg };
    }

    console.log(`[Menu Fetcher] Loaded ${items.length} vinos items from CSV`);
    return { data: items };
  } catch (error) {
    // DEVELOPMENT: Allow fallback to stale local JSON for convenience
    if (allowLocalFallback) {
      console.warn('[Menu Fetcher] [DEV ONLY] Failed to load VINOS CSV, using local JSON fallback:', error);
      return { data: convertWineJSONToItemCarta(wineESData) };
    }

    // PRODUCTION: Return empty array with error instead of throwing
    const errorMsg = `Failed to load wine data: ${error instanceof Error ? error.message : String(error)}`;
    console.error('[Menu Fetcher] PRODUCTION ERROR:', errorMsg);
    return { data: [], error: errorMsg };
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
