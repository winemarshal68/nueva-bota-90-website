import { defineField, defineType } from 'sanity'

export const menuItemType = defineType({
  name: 'menuItem',
  title: 'Menu Item',
  type: 'document',
  fields: [
    defineField({
      name: 'name_es',
      title: 'Name (ES)',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description_es',
      title: 'Description (ES)',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'price',
      title: 'Price (€)',
      type: 'number',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
    }),
    defineField({
      name: 'allergens',
      title: 'Allergens',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'allergen' }] }],
    }),
    defineField({
      name: 'allergenEvidence',
      title: 'Allergen Evidence',
      type: 'text',
      description: 'Notes on how allergens were determined (internal)',
      rows: 3,
    }),
    defineField({
      name: 'needsReview',
      title: 'Needs Review',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
    }),
  ],
  orderings: [
    {
      title: 'Sort Order',
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
      if (active === false) status.push('Inactive')
      if (needsReview) status.push('Needs Review')
      return {
        title,
        subtitle: [price != null ? `€${price}` : null, ...status]
          .filter(Boolean)
          .join(' · '),
      }
    },
  },
})
