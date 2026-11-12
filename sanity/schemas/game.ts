import { defineType, defineField } from 'sanity';

/**
 * Game: a Biker Babies game and its private art.  [CROSS-BRAND]
 *
 * Studio-only. The website never queries or renders `game` documents and they
 * have no route, so they cannot reach the sitemap. The Social Content Studio
 * reads gameArt from here.
 */
export default defineType({
  name: 'game',
  title: 'Game',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'e.g. "Zoomville Rush".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'Live game URL',
      type: 'url',
      description: 'The live game page.',
    }),
    defineField({
      name: 'characters',
      title: 'Characters',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'character' }] }],
    }),
    defineField({
      name: 'gameArt',
      title: 'Game art (private)',
      description: 'Title cards, level cards, stage art, model renders and promo images. Not shown on the website.',
      type: 'array',
      of: [{ type: 'galleryImage' }],
      options: { layout: 'grid' },
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'url', media: 'gameArt.0.asset' },
  },
});
