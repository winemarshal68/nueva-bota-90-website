/**
 * Menu item in Spanish-language schema
 * Designed to map directly from Google Sheets columns
 */
export interface ItemCarta {
  /** Section name (e.g., "Tostas", "Ensaladas", "Tablas") */
  seccion: string;

  /** Item name */
  nombre: string;

  /** Optional description */
  descripcion?: string;

  /** Single price (mutually exclusive with precio_media/precio_entera) */
  precio?: string;

  /** Half portion price (for shared items) */
  precio_media?: string;

  /** Full portion price (for shared items) */
  precio_entera?: string;

  /** Whether item is available (false = don't show on menu) */
  disponible: boolean;

  /** Sort order within section */
  orden: number;

  /** Optional region/origin (mainly for wines) */
  region?: string;
}

/**
 * Grouped menu items by section
 * Used for rendering categorized menu sections
 */
export interface SeccionCarta {
  /** Section name */
  nombre: string;

  /** Optional section description */
  descripcion?: string;

  /** Optional note (e.g., "Ask in-house for daily specials") */
  nota?: string;

  /** Menu items in this section */
  items: ItemCarta[];
}
