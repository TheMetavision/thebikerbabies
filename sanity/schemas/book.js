// schemas/book.js
// The Biker Babies — Book document schema
// Mirrors the episode schema conventions for consistency across content types.

export default {
  name: 'book',
  title: 'Book',
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
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'bookNumber',
      title: 'Book Number',
      type: 'number',
      description: 'Volume number in the series (1, 2, 3, 4...)',
      validation: (Rule) => Rule.required().min(1).integer(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      description: 'Short synopsis shown on the book card',
      validation: (Rule) => Rule.required().max(400),
    },
    {
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      description: 'Front cover artwork (3:4 portrait ratio recommended for KDP)',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Coming Soon', value: 'coming-soon' },
          { title: 'Pre-Order', value: 'pre-order' },
          { title: 'Available', value: 'available' },
        ],
        layout: 'radio',
      },
      initialValue: 'coming-soon',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'purchaseUrl',
      title: 'Purchase URL',
      type: 'url',
      description: 'Amazon KDP / store link (only used when status is "available")',
    },
    {
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      description: 'Display order on the media page (lower numbers appear first)',
    },
  ],

  orderings: [
    {
      title: 'Book Number, Ascending',
      name: 'bookNumberAsc',
      by: [{ field: 'bookNumber', direction: 'asc' }],
    },
    {
      title: 'Sort Order, Ascending',
      name: 'sortOrderAsc',
      by: [{ field: 'sortOrder', direction: 'asc' }],
    },
  ],

  preview: {
    select: {
      title: 'title',
      bookNumber: 'bookNumber',
      status: 'status',
      media: 'coverImage',
    },
    prepare({ title, bookNumber, status, media }) {
      return {
        title: `Book ${bookNumber}: ${title}`,
        subtitle: status === 'coming-soon' ? 'Coming Soon' : status === 'pre-order' ? 'Pre-Order' : 'Available',
        media,
      };
    },
  },
};
