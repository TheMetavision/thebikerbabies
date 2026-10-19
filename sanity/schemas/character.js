export default {
  name: 'character', title: 'Character', type: 'document',
  fields: [
    { name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required() },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name', maxLength: 96 }, validation: (Rule) => Rule.required() },
    { name: 'characterTitle', title: 'Title', type: 'string', description: 'e.g. "The Innovator", "The Daredevil"' },
    { name: 'characterType', title: 'Character Type', type: 'string', options: { list: [{ title: 'Hero', value: 'hero' }, { title: 'Villain', value: 'villain' }] }, validation: (Rule) => Rule.required() },
    { name: 'bio', title: 'Biography', type: 'text', rows: 4, validation: (Rule) => Rule.required() },
    { name: 'extendedBio', title: 'Extended Bio', type: 'array', of: [{ type: 'block' }] },
    { name: 'portrait', title: 'Character Portrait', type: 'image', options: { hotspot: true } },
    { name: 'characterSheet', title: 'Character Sheet / Turnaround', type: 'image', options: { hotspot: true }, description: 'Multi-angle turnaround or model sheet. Used alongside the portrait to build this character\u2019s Higgsfield reference element. Production reference only: not shown on the site.' },
    { name: 'galleryImages', title: 'Gallery Images', type: 'array', of: [{ type: 'image', options: { hotspot: true } }] },
    { name: 'sortOrder', title: 'Display Order', type: 'number' },
    { name: 'seoTitle', title: 'SEO Title', type: 'string' },
    { name: 'seoDescription', title: 'SEO Description', type: 'text', rows: 2 },
  ],
  orderings: [{ title: 'Display Order', name: 'sortOrderAsc', by: [{ field: 'sortOrder', direction: 'asc' }] }],
  preview: { select: { title: 'name', subtitle: 'characterTitle', media: 'portrait' } },
};