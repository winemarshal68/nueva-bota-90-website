import { ItemCarta } from '@/types/menu';

export type VinosCSVDiagnostics = {
  totalRows: number;
  parsedRows: number;
  availableRows: number;
  disponibleTokenHistogram: Record<string, number>;
  headers: string[];
  missingRequiredColumns: string[];
};

/**
 * Parses a CSV string into an array of ItemCarta objects
 * Handles type conversion, validation, and filtering
 */
export function parseCSV(
  csvText: string,
  columnMapping: Record<string, string>,
  debugLabel?: string
): ItemCarta[] {
  const debugEnabled = process.env.DEBUG_CSV === '1';
  const lines = csvText
    .trim()
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length < 2) {
    console.warn('[CSV Parser] CSV has no data rows');
    return [];
  }

  // Parse header row
  const headers = parseCSVLine(lines[0]);
  const headerIndices = createHeaderIndices(headers);

  const disponibleColumn = Object.entries(columnMapping).find(
    ([, cartaField]) => cartaField === 'disponible'
  )?.[0];
  const disponibleIndex = disponibleColumn
    ? headerIndices.get(disponibleColumn.toLowerCase())
    : undefined;

  // Validate required columns exist
  const requiredColumns = Object.keys(columnMapping);
  const missingColumns = requiredColumns.filter(
    (col) => !headerIndices.has(col.toLowerCase())
  );

  if (missingColumns.length > 0) {
    if (debugEnabled) {
      const label = debugLabel ? ` ${debugLabel}` : '';
      console.log(
        `[CSV Parser]${label} missingColumns=${missingColumns.join(',')} headers=[${headers
          .map((h) => h.trim())
          .join(', ')}]`
      );
    }
    console.warn(
      `[CSV Parser] Missing required columns: ${missingColumns.join(', ')}`
    );
    // Return empty array, will trigger fallback to JSON
    return [];
  }

  // Parse data rows
  const items: ItemCarta[] = [];
  let parsedRows = 0;
  let availableRows = 0;
  const disponibleTokenCounts: Record<string, number> = {};

  for (let i = 1; i < lines.length; i++) {
    const fields = parseCSVLine(lines[i]);

    // Skip blank rows (all fields empty)
    if (fields.every((field) => field.trim() === '')) {
      continue;
    }

    if (debugEnabled && disponibleIndex !== undefined) {
      const raw = (fields[disponibleIndex] ?? '').toString();
      const token = raw.trim().toLowerCase();
      const key = token === '' ? '(blank)' : token;
      disponibleTokenCounts[key] = (disponibleTokenCounts[key] || 0) + 1;
    }

    try {
      const item = parseRow(fields, headerIndices, columnMapping);
      parsedRows += 1;

      // Only include items that are available
      if (item.disponible) {
        items.push(item);
        availableRows += 1;
      }
    } catch (error) {
      console.warn(`[CSV Parser] Skipping invalid row ${i + 1}:`, error);
      // Continue parsing other rows
    }
  }

  if (debugEnabled) {
    const label = debugLabel ? ` ${debugLabel}` : '';
    console.log(
      `[CSV Parser]${label} rows=${Math.max(lines.length - 1, 0)} parsed=${parsedRows} available=${availableRows}`
    );

    if (debugLabel === 'vinos') {
      const sorted = Object.entries(disponibleTokenCounts).sort((a, b) => b[1] - a[1]);
      const asObject: Record<string, number> = {};
      for (const [k, v] of sorted) asObject[k] = v;
      console.log(`[CSV Parser]${label} disponibleTokens=${JSON.stringify(asObject)}`);
    }
  }

  return items;
}

/**
 * Parses a single CSV line, handling quoted fields
 */
function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (inQuotes) {
      if (char === '"') {
        const next = line[i + 1];
        // Escaped quote inside a quoted field: "" => "
        if (next === '"') {
          current += '"';
          i += 1;
          continue;
        }
        // End of quoted field
        inQuotes = false;
        continue;
      }

      current += char;
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      continue;
    }

    if (char === ',') {
      fields.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  // Add the last field
  fields.push(current.trim());

  return fields;
}

/**
 * Creates a map of column names to their indices (case-insensitive)
 */
function createHeaderIndices(headers: string[]): Map<string, number> {
  const indices = new Map<string, number>();

  headers.forEach((header, index) => {
    // Normalize: lowercase, trim
    const normalized = header.toLowerCase().trim();
    indices.set(normalized, index);
  });

  return indices;
}

/**
 * Parses a single data row into an ItemCarta object
 */
function parseRow(
  fields: string[],
  headerIndices: Map<string, number>,
  columnMapping: Record<string, string>
): ItemCarta {
  const item: Partial<ItemCarta> = {};

  // Map CSV columns to ItemCarta fields
  for (const [csvColumn, cartaField] of Object.entries(columnMapping)) {
    const index = headerIndices.get(csvColumn.toLowerCase());

    if (index === undefined) {
      continue;
    }

    const value = fields[index]?.trim() || '';

    // Type conversion based on field name
    if (cartaField === 'disponible') {
      item[cartaField] = parseDisponibilidad(value);
    } else if (
      cartaField === 'precio' ||
      cartaField === 'precio_media' ||
      cartaField === 'precio_entera'
    ) {
      const num = parsePriceValue(value);
      if (num !== undefined) {
        item[cartaField] = num.toFixed(2);
      }
    } else if (cartaField === 'orden') {
      item[cartaField] = parseNumber(value) || 0;
    } else if (cartaField === 'seccion') {
      item.seccion = value;
    } else if (cartaField === 'nombre') {
      item.nombre = value;
    } else if (cartaField === 'descripcion') {
      if (value) item.descripcion = value;
    } else if (cartaField === 'region') {
      if (value) item.region = value;
    }
  }

  // Validate required fields
  if (!item.nombre || item.nombre.length === 0) {
    throw new Error('Missing required field: nombre');
  }

  // Ensure disponible has a default
  if (item.disponible === undefined) {
    item.disponible = true;
  }

  // Ensure orden has a default
  if (item.orden === undefined) {
    item.orden = 999;
  }

  return item as ItemCarta;
}

/**
 * Parses the "disponible" column.
 * Default behavior: available unless explicitly false.
 */
function parseDisponibilidad(raw: string | number | undefined | null): boolean {
  const v = (raw ?? '').toString().trim().toLowerCase();

  const falseTokens = new Set(['false', 'falso', '0', 'no', 'n', 'off']);
  const trueTokens = new Set(['true', 'verdadero', '1', 'si', 'sí', 's', 'on']);

  if (falseTokens.has(v)) return false;
  if (trueTokens.has(v)) return true;

  // Blank/unknown => available
  return true;
}

/**
 * Robust price parser that handles various input formats
 * Accepts: number, string, or undefined
 * Returns: number or undefined (never null, never defaults to 0)
 *
 * Handles:
 * - Currency symbols (€, $, etc.)
 * - European decimals (comma as decimal separator)
 * - Whitespace
 * - Empty/placeholder values
 */
function parsePriceValue(value: string | number | undefined): number | undefined {
  // Handle undefined/null
  if (value === undefined || value === null) {
    return undefined;
  }

  // If already a number, return it if valid
  if (typeof value === 'number') {
    return isNaN(value) ? undefined : value;
  }

  // String processing
  const trimmed = value.trim();

  // Check for empty or placeholder values
  if (trimmed === '' || trimmed === '—' || trimmed === '-') {
    return undefined;
  }

  // Remove currency symbols (€, $, £, etc.) and any whitespace
  const cleaned = trimmed
    .replace(/[€$£¥₹]/g, '')
    .replace(/\s+/g, '')
    .trim();

  // Handle European decimal format: replace comma with dot
  // Only replace comma if it appears to be a decimal separator (not thousands)
  // Example: "6,5" → "6.5" but "1.234,56" → "1234.56"
  let normalized = cleaned;
  if (cleaned.includes(',')) {
    // If both comma and dot exist, assume European format (dot=thousands, comma=decimal)
    if (cleaned.includes('.') && cleaned.includes(',')) {
      normalized = cleaned.replace(/\./g, '').replace(',', '.');
    } else {
      // Only comma exists, treat it as decimal separator
      normalized = cleaned.replace(',', '.');
    }
  }

  const num = parseFloat(normalized);

  return isNaN(num) ? undefined : num;
}

/**
 * Converts a string to a number (for non-price fields like 'orden')
 * Returns null for invalid or empty values (maintains backward compatibility)
 */
function parseNumber(value: string): number | null {
  const result = parsePriceValue(value);
  return result === undefined ? null : result;
}

/**
 * Parses CARTA CSV (food menu)
 * Expected columns: seccion,nombre,descripcion,precio,precio_media,precio_entera,disponible,orden
 */
export function parseCartaCSV(csvText: string): ItemCarta[] {
  const columnMapping = {
    seccion: 'seccion',
    nombre: 'nombre',
    descripcion: 'descripcion',
    precio: 'precio',
    precio_media: 'precio_media',
    precio_entera: 'precio_entera',
    disponible: 'disponible',
    orden: 'orden',
  };

  return parseCSV(csvText, columnMapping, 'carta');
}

/**
 * Parses VINOS CSV (wine menu)
 * Expected columns: categoria,nombre,descripcion,origen,precio,disponible,orden
 * Maps: categoria → seccion, origen → region
 */
export function parseVinosCSV(csvText: string): ItemCarta[] {
  const columnMapping = {
    categoria: 'seccion',
    nombre: 'nombre',
    descripcion: 'descripcion',
    origen: 'region',
    precio: 'precio',
    disponible: 'disponible',
    orden: 'orden',
  };

  return parseCSV(csvText, columnMapping, 'vinos');
}

export function parseVinosCSVWithDiagnostics(csvText: string): VinosCSVDiagnostics {
  const columnMapping = {
    categoria: 'seccion',
    nombre: 'nombre',
    descripcion: 'descripcion',
    origen: 'region',
    precio: 'precio',
    disponible: 'disponible',
    orden: 'orden',
  };

  const lines = csvText
    .trim()
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const totalRows = Math.max(lines.length - 1, 0);

  if (lines.length < 2) {
    return {
      totalRows,
      parsedRows: 0,
      availableRows: 0,
      disponibleTokenHistogram: {},
      headers: lines.length > 0 ? parseCSVLine(lines[0]) : [],
      missingRequiredColumns: Object.keys(columnMapping),
    };
  }

  const headers = parseCSVLine(lines[0]);
  const headerIndices = createHeaderIndices(headers);

  const requiredColumns = Object.keys(columnMapping);
  const missingRequiredColumns = requiredColumns.filter(
    (col) => !headerIndices.has(col.toLowerCase())
  );

  const disponibleIndex = headerIndices.get('disponible');
  const disponibleTokenHistogram: Record<string, number> = {};

  let parsedRows = 0;
  let availableRows = 0;

  for (let i = 1; i < lines.length; i++) {
    const fields = parseCSVLine(lines[i]);

    if (fields.every((field) => field.trim() === '')) {
      continue;
    }

    if (disponibleIndex !== undefined) {
      const raw = (fields[disponibleIndex] ?? '').toString();
      const token = raw.trim().toLowerCase();
      const key = token;
      disponibleTokenHistogram[key] = (disponibleTokenHistogram[key] || 0) + 1;
    }

    try {
      const item = parseRow(fields, headerIndices, columnMapping);
      parsedRows += 1;
      if (item.disponible) {
        availableRows += 1;
      }
    } catch {
      // Diagnostics only: ignore invalid rows
    }
  }

  return {
    totalRows,
    parsedRows,
    availableRows,
    disponibleTokenHistogram,
    headers,
    missingRequiredColumns,
  };
}
