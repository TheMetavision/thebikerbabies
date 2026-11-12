import { referenceGallery, referencePrivateFieldset } from './galleryImage';

export default {
  name: 'character', title: 'Character', type: 'document',
  fieldsets: [referencePrivateFieldset],
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
    // Fields the live character documents already hold (added to the schema
    // 2026-11-12 so Studio can edit them; no data changed). The website reads
    // image, role and displayOrder on /meet-the-biker-babies.
    { name: 'image', title: 'Character Image', type: 'image', options: { hotspot: true }, description: 'The picture shown on Meet the Gang. (The site reads this, not Character Portrait.)' },
    { name: 'role', title: 'Role', type: 'string', description: 'Shown under the name on Meet the Gang, e.g. "The Leader". Villains use their own name.' },
    { name: 'displayOrder', title: 'Display Order (Meet the Gang)', type: 'number', description: 'Meet the Gang sorts by this first, then by Display Order above.' },
    { name: 'tag', title: 'Tag', type: 'string', options: { list: [{ title: 'Hero', value: 'hero' }, { title: 'Villain', value: 'villain' }] }, description: 'Legacy: not read by the website (it uses Character Type).' },
    { name: 'coreSix', title: 'Core Six', type: 'boolean', description: 'Legacy: not read by the website.' },
    // Private: Studio and Social Content Studio only, never queried by the website.
    referenceGallery('character'),
  ],
  orderings: [{ title: 'Display Order', name: 'sortOrderAsc', by: [{ field: 'sortOrder', direction: 'asc' }] }],
  preview: { select: { title: 'name', subtitle: 'characterTitle', media: 'portrait' } },
};