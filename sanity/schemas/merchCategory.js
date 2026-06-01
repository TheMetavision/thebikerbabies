// Reconstructed 2026-06-01 from the live Sanity dataset.
// Mirrors the field shape of the 4 active merchCategory documents
// (Apparel, Accessories, Artwork & Prints, and one other).

export default {
  name: 'merchCategory',
  title: 'Merch Category',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    },
    {
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers display first.',
    },
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
      order: 'displayOrder',
    },
    prepare({ title, subtitle, order }) {
      return {
        title,
        subtitle: order != null ? `#${order} \u00B7 ${subtitle || ''}` : subtitle,
      };
    },
  },

  orderings: [
    {
      title: 'Display Order',
      name: 'displayOrderAsc',
      by: [{ field: 'displayOrder', direction: 'asc' }],
    },
    {
      title: 'Title (A\u2192Z)',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
};
