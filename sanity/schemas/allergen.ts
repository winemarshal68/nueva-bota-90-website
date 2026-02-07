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
  title: 'Alérgeno',
  type: 'document',
  fields: [
    defineField({
      name: 'title_en',
      title: 'Nombre (EN)',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'title_es',
      title: 'Nombre (ES)',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Debe ser uno de los 14 slugs de alérgenos UE',
      validation: (r) =>
        r.required().custom((slug) => {
          if (!slug?.current) return 'El slug es obligatorio'
          if (!VALID_SLUGS.includes(slug.current as (typeof VALID_SLUGS)[number])) {
            return `Slug no válido. Debe ser uno de: ${VALID_SLUGS.join(', ')}`
          }
          return true
        }),
    }),
    defineField({
      name: 'iconSlug',
      title: 'Slug del icono',
      type: 'string',
      description: 'Debe coincidir con el slug; se usa para resolver el archivo del icono',
      readOnly: true,
    }),
    defineField({
      name: 'sortOrder',
      title: 'Orden',
      type: 'number',
      validation: (r) => r.required().min(1).max(14),
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
    select: { title: 'title_es', subtitle: 'slug.current', order: 'sortOrder' },
    prepare({ title, subtitle, order }) {
      return { title: `${order}. ${title}`, subtitle }
    },
  },
})
