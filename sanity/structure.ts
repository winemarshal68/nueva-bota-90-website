import type { StructureResolver } from 'sanity/structure'

export const studioStructure: StructureResolver = (S) =>
  S.list()
    .title('Contenido')
    .items([
      S.documentTypeListItem('menuItem').title('Platos'),
      S.documentTypeListItem('category').title('Categorías'),
      S.documentTypeListItem('allergen').title('Alérgenos'),
    ])
