import { type SchemaTypeDefinition } from 'sanity'
import { allergenType } from './schemas/allergen'
import { categoryType } from './schemas/category'
import { menuItemType } from './schemas/menuItem'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [allergenType, categoryType, menuItemType],
}
