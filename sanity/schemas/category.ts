import { defineField, defineType } from 'sanity'

export const categoryType = defineType({
  name: 'category',
  title: 'Categoría',
  type: 'document',
  fields: [
    defineField({
      name: 'title_es',
      title: 'Nombre (ES)',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'sortOrder',
      title: 'Orden',
      type: 'number',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'active',
      title: 'Activa',
      type: 'boolean',
      initialValue: true,
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
    select: { title: 'title_es', order: 'sortOrder', active: 'active' },
    prepare({ title, order, active }) {
      return {
        title: `${order}. ${title}`,
        subtitle: active === false ? 'Inactiva' : undefined,
      }
    },
  },
})
