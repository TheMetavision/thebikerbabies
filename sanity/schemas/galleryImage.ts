import { defineType, defineField } from 'sanity';

/**
 * Gallery image: a private working or promo image.  [CROSS-BRAND]
 *
 * Used by character.referenceGallery, worldLocation.referenceGallery and
 * game.gameArt. These galleries feed the Social Content Studio and are NEVER
 * shown on the public website: no site query selects them, so keep every
 * frontend GROQ projection explicit (no `{...}` spreads on character,
 * worldLocation or game).
 */
export default defineType({
  name: 'galleryImage',
  title: 'Gallery image',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'What the image shows, e.g. "Blaze on her motorbike, sunset at Pit Lane".',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'kind',
      title: 'Kind',
      type: 'string',
      options: {
        list: [
          { title: 'Portrait', value: 'portrait' },
          { title: 'Pose (3D model pose or reference sheet)', value: 'pose' },
          { title: 'Vehicle (kart, bike)', value: 'vehicle' },
          { title: 'Model render (3D game model)', value: 'modelRender' },
          { title: 'Scene (character or location in a scene)', value: 'scene' },
          { title: 'Title card', value: 'titleCard' },
          { title: 'Title card, clean (no lettering)', value: 'titleCardClean' },
          { title: 'Level card (per level or track)', value: 'levelCard' },
          { title: 'Stage art (panorama, ground or sign art)', value: 'stageArt' },
          { title: 'Promo (made for socials)', value: 'promo' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'game',
      title: 'Game',
      type: 'string',
      description: 'e.g. "Zoomville Rush".',
    }),
    defineField({
      name: 'level',
      title: 'Level',
      type: 'string',
      description: 'Level, stage or track name.',
    }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      description: 'Generator and job id, e.g. "Higgsfield gpt_image_2_6 / 586723bf-…".',
    }),
    defineField({
      name: 'approved',
      title: 'Approved for posts',
      type: 'boolean',
      initialValue: true,
      description: 'Untick to keep an image on file without using it in posts.',
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
      rows: 2,
    }),
  ],
  preview: {
    select: { caption: 'caption', kind: 'kind', game: 'game', media: 'asset' },
    prepare({ caption, kind, game, media }) {
      return {
        title: caption || '(no caption)',
        subtitle: [kind, game].filter(Boolean).join(' · '),
        media,
      };
    },
  },
});

/**
 * The private reference-gallery field, shared by character and worldLocation.
 * Lives in the collapsed "Reference (private)" fieldset on each document.
 */
export const referenceGallery = (thing: string) => ({
  name: 'referenceGallery',
  title: 'Reference gallery (private)',
  description: `Working and promo images for this ${thing}. Not shown on the website.`,
  type: 'array',
  of: [{ type: 'galleryImage' }],
  options: { layout: 'grid' },
  fieldset: 'referencePrivate',
});

export const referencePrivateFieldset = {
  name: 'referencePrivate',
  title: 'Reference (private)',
  options: { collapsible: true, collapsed: true },
};
