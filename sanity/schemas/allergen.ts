import { defineField, defineType } from 'sanity'

const VALID_SLUGS = [
  'gluten',
  'crustaceans',
  'eggs',
  'fish',
  'peanuts',
  'soy',
  'milk',
  'nuts',
  'celery',
  'mustard',
  'sesame',
  'sulfites',
  'lupin',
  'molluscs',
] as const

export const allergenType = defineType({
  name: 'allergen',
  title: 'Allergen',
  type: 'document',
  fields: [
    defineField({
      name: 'title_en',
      title: 'Title (EN)',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'title_es',
      title: 'Title (ES)',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Must be one of the 14 EU allergen slugs',
      validation: (r) =>
        r.required().custom((slug) => {
          if (!slug?.current) return 'Slug is required'
          if (!VALID_SLUGS.includes(slug.current as (typeof VALID_SLUGS)[number])) {
            return `Invalid slug. Must be one of: ${VALID_SLUGS.join(', ')}`
          }
          return true
        }),
    }),
    defineField({
      name: 'iconSlug',
      title: 'Icon Slug',
      type: 'string',
      description: 'Matches the slug; used to resolve icon file',
      readOnly: true,
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      validation: (r) => r.required().min(1).max(14),
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
    select: { title: 'title_en', subtitle: 'slug.current', order: 'sortOrder' },
    prepare({ title, subtitle, order }) {
      return { title: `${order}. ${title}`, subtitle }
    },
  },
})
