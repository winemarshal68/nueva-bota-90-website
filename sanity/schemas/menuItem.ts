import { defineField, defineType } from 'sanity'

export const menuItemType = defineType({
  name: 'menuItem',
  title: 'Plato',
  type: 'document',
  fields: [
    defineField({
      name: 'name_es',
      title: 'Nombre (ES)',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description_es',
      title: 'Descripción (ES)',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'price',
      title: 'Precio (€)',
      type: 'number',
    }),
    defineField({
      name: 'category',
      title: 'Categoría',
      type: 'reference',
      to: [{ type: 'category' }],
    }),
    defineField({
      name: 'allergens',
      title: 'Alérgenos',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'allergen' }] }],
    }),
    defineField({
      name: 'allergenEvidence',
      title: 'Evidencia de alérgenos',
      type: 'text',
      description: 'Notas sobre cómo se determinaron los alérgenos (interno)',
      rows: 3,
    }),
    defineField({
      name: 'needsReview',
      title: 'Requiere revisión',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'active',
      title: 'Activo',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'sortOrder',
      title: 'Orden',
      type: 'number',
    }),
  ],
  orderings: [
    {
      title: 'Orden',
      name: 'sortOrderAsc',
      by: [{ field: 'sortOrder', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'name_es',
      price: 'price',
      active: 'active',
      needsReview: 'needsReview',
    },
    prepare({ title, price, active, needsReview }) {
      const status = []
      if (active === false) status.push('Inactivo')
      if (needsReview) status.push('Revisar')
      return {
        title,
        subtitle: [price != null ? `€${price}` : null, ...status]
          .filter(Boolean)
          .join(' · '),
      }
    },
  },
})
