#!/usr/bin/env node
/**
 * CSV Export Script for Seeding Google Sheets
 *
 * Generates two CSV files from existing JSON data:
 * - scripts/out/carta_items_seed.csv
 * - scripts/out/vinos_items_seed.csv
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Types matching the JSON structures
interface CartaItem {
  seccion: string;
  nombre: string;
  descripcion?: string;
  precio?: string;
  precio_media?: string;
  precio_entera?: string;
  disponible: boolean;
  orden: number;
}

interface WineItem {
  id: string;
  name: string;
  region: string;
  description: string;
  price: string;
}

interface WineCategory {
  id: string;
  name: string;
  items: WineItem[];
}

interface CartaJSON {
  items: CartaItem[];
}

interface WineJSON {
  categories: WineCategory[];
}

/**
 * Escapes a CSV field value
 * Handles quotes, commas, and newlines
 */
function escapeCSV(value: string | number | boolean | undefined): string {
  if (value === undefined || value === null) {
    return '';
  }

  const str = String(value);

  // If contains comma, quote, or newline, wrap in quotes and escape quotes
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}

/**
 * Converts precio fields to a single numeric value
 * Handles precio, precio_media/precio_entera, and "—" placeholders
 */
function normalizePrecio(item: CartaItem): string {
  // If precio_media and precio_entera exist, use precio_media
  if (item.precio_media && item.precio_entera) {
    const precio = parseFloat(item.precio_media);
    return isNaN(precio) ? '' : precio.toString();
  }

  // Use precio field
  if (item.precio) {
    const precio = parseFloat(item.precio);
    return isNaN(precio) ? '' : precio.toString();
  }

  return '';
}

/**
 * Export carta items to CSV
 */
function exportCartaCSV(): void {
  const inputPath = join(process.cwd(), 'data', 'carta_items.json');
  const outputPath = join(process.cwd(), 'scripts', 'out', 'carta_items_seed.csv');

  console.log('[Carta Export] Reading:', inputPath);

  const json = JSON.parse(readFileSync(inputPath, 'utf-8')) as CartaJSON;
  const items = json.items;

  // Sort by seccion, then orden
  items.sort((a, b) => {
    if (a.seccion !== b.seccion) {
      return a.seccion.localeCompare(b.seccion);
    }
    return a.orden - b.orden;
  });

  // CSV Headers (exact order required by Google Sheets)
  const headers = ['seccion', 'nombre', 'descripcion', 'precio', 'disponible', 'orden'];

  // Build CSV rows
  const rows: string[] = [headers.join(',')];

  for (const item of items) {
    const row = [
      escapeCSV(item.seccion),
      escapeCSV(item.nombre),
      escapeCSV(item.descripcion || ''),
      escapeCSV(normalizePrecio(item)),
      escapeCSV(item.disponible ? 'TRUE' : 'FALSE'),
      escapeCSV(item.orden),
    ];
    rows.push(row.join(','));
  }

  // Write CSV
  const csv = rows.join('\n');
  writeFileSync(outputPath, csv, 'utf-8');

  console.log(`[Carta Export] ✓ Exported ${items.length} items to: ${outputPath}`);
}

/**
 * Export vinos items to CSV
 * Flattens the category structure
 */
function exportVinosCSV(): void {
  const inputPath = join(process.cwd(), 'content', 'wine.es.json');
  const outputPath = join(process.cwd(), 'scripts', 'out', 'vinos_items_seed.csv');

  console.log('[Vinos Export] Reading:', inputPath);

  const json = JSON.parse(readFileSync(inputPath, 'utf-8')) as WineJSON;

  // Flatten categories into items
  const flatItems: Array<{
    categoria: string;
    nombre: string;
    descripcion: string;
    origen: string;
    precio: string;
    disponible: string;
    orden: number;
  }> = [];

  let globalOrder = 1;

  for (const category of json.categories) {
    for (const item of category.items) {
      const precio = parseFloat(item.price);

      flatItems.push({
        categoria: category.name,
        nombre: item.name,
        descripcion: item.description,
        origen: item.region,
        precio: isNaN(precio) ? '' : precio.toString(),
        disponible: 'TRUE',
        orden: globalOrder * 10, // Use multiples of 10
      });

      globalOrder++;
    }
  }

  // CSV Headers (exact order required by Google Sheets)
  const headers = ['categoria', 'nombre', 'descripcion', 'origen', 'precio', 'disponible', 'orden'];

  // Build CSV rows
  const rows: string[] = [headers.join(',')];

  for (const item of flatItems) {
    const row = [
      escapeCSV(item.categoria),
      escapeCSV(item.nombre),
      escapeCSV(item.descripcion),
      escapeCSV(item.origen),
      escapeCSV(item.precio),
      escapeCSV(item.disponible),
      escapeCSV(item.orden),
    ];
    rows.push(row.join(','));
  }

  // Write CSV
  const csv = rows.join('\n');
  writeFileSync(outputPath, csv, 'utf-8');

  console.log(`[Vinos Export] ✓ Exported ${flatItems.length} items to: ${outputPath}`);
}

/**
 * Main execution
 */
function main(): void {
  try {
    console.log('========================================');
    console.log('  CSV Export for Google Sheets Seeding');
    console.log('========================================\n');

    exportCartaCSV();
    exportVinosCSV();

    console.log('\n✓ All CSV files generated successfully!');
    console.log('\nNext steps:');
    console.log('  1. See scripts/seed-google-sheets/README.md for import instructions');
    console.log('  2. Import CSVs into your Google Sheets tabs');
    console.log('  3. Verify data is correct in the sheets\n');
  } catch (error) {
    console.error('\n✗ Error during CSV export:', error);
    process.exit(1);
  }
}

main();
