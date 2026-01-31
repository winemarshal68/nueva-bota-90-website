import { ItemCarta, SeccionCarta } from '@/types/menu';

/**
 * Groups menu items by section and filters by availability
 * Sorts items by 'orden' field within each section
 *
 * @param items - Flat array of menu items
 * @returns Array of sections with their items
 */
export function groupMenuItems(items: ItemCarta[]): SeccionCarta[] {
  // Filter available items only
  const availableItems = items.filter(item => item.disponible);

  // Group by section
  const sectionsMap = new Map<string, ItemCarta[]>();

  availableItems.forEach(item => {
    const sectionItems = sectionsMap.get(item.seccion) || [];
    sectionItems.push(item);
    sectionsMap.set(item.seccion, sectionItems);
  });

  // Convert to array and sort items within each section by 'orden'
  const sections = Array.from(sectionsMap.entries()).map(([nombre, items]) => ({
    nombre,
    items: items.sort((a, b) => a.orden - b.orden)
  }));

  // Define the desired section order to match original menu structure
  const sectionOrder = [
    'Tablas',
    'Tostas',
    'Hamburguesa',
    'Compartimos',
    'Ensaladas',
    'Pokes',
    'Empanadas Argentinas y Milanesas'
  ];

  // Sort sections by the defined order
  return sections.sort((a, b) => {
    const indexA = sectionOrder.indexOf(a.nombre);
    const indexB = sectionOrder.indexOf(b.nombre);

    // If section not in order array, put it at the end
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;

    return indexA - indexB;
  });
}

/**
 * Section metadata (descriptions and notes)
 * This data comes from the original menu structure
 */
export const sectionMetadata: Record<string, { descripcion?: string; nota?: string }> = {
  'Empanadas Argentinas y Milanesas': {
    nota: 'Consultar disponibilidad y precio en el local'
  }
  // Add more section metadata as needed
};
