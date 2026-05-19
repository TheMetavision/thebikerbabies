// scripts/migrate-books.js
// Seeds the 4 Biker Babies books into Sanity.
// Run from project root: node scripts/migrate-books.js
//
// Matches the existing cross-brand book schema at
// C:\Users\chris\the-biker-babies\schemaTypes\book.js
// (fields: title, slug, description, coverImage, seriesOrder, format, orderUrl, status, publishedAt)
//
// Requires SANITY_TOKEN environment variable with write permissions.
// Get one at https://www.sanity.io/manage → API → Tokens

import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config();

const client = createClient({
  projectId: 'v518t53u',
  dataset: 'production',
  apiVersion: '2025-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const books = [
  {
    _id: 'book-bb-toad-in-the-hole',
    _type: 'book',
    seriesOrder: 1,
    title: 'Toad in the Hole',
    slug: { _type: 'slug', current: 'toad-in-the-hole' },
    description:
      "When Turbo Toad accidentally hops into one of Professor Pothole's deep traps, The Biker Babies must work together to rescue him before he's stuck forever!",
    format: 'book',
    status: 'coming-soon',
  },
  {
    _id: 'book-bb-rusty-rex-revenge',
    _type: 'book',
    seriesOrder: 2,
    title: "Rusty Rex's Revenge",
    slug: { _type: 'slug', current: 'rusty-rexs-revenge' },
    description:
      "Grumpy old robot Rusty Rex is spreading rust all over the bike paths, hoping to make every bike as creaky as he is. The Biker Babies need to outsmart him before their wheels stop spinning!",
    format: 'book',
    status: 'coming-soon',
  },
  {
    _id: 'book-bb-grumble-gnome-garden-grudge',
    _type: 'book',
    seriesOrder: 3,
    title: "Grumble Gnome's Garden Grudge",
    slug: { _type: 'slug', current: 'grumble-gnomes-garden-grudge' },
    description:
      "Grumble Gnome is furious that bikers keep riding near his perfect lawn! He sets up tricky traps to stop the Biker Babies, but they're determined to find a way through without ruining his garden.",
    format: 'book',
    status: 'coming-soon',
  },
  {
    _id: 'book-bb-captain-cone-roadblock-rumble',
    _type: 'book',
    seriesOrder: 4,
    title: "Captain Cone's Roadblock Rumble",
    slug: { _type: 'slug', current: 'captain-cones-roadblock-rumble' },
    description:
      "Captain Cone is at it again, setting up fake detour signs and blocking the best bike paths. The Biker Babies must navigate his maze of cones and prove they don't need his \"safety\" rules!",
    format: 'book',
    status: 'coming-soon',
  },
];

async function migrate() {
  console.log(`🚀 Seeding ${books.length} books into Sanity (project v518t53u)...\n`);

  for (const book of books) {
    try {
      const result = await client.createOrReplace(book);
      console.log(`✅ Book ${book.seriesOrder}: ${book.title}`);
      console.log(`   _id: ${result._id}\n`);
    } catch (err) {
      console.error(`❌ Failed: ${book.title}`);
      console.error(`   ${err.message}\n`);
    }
  }

  console.log('✨ Migration complete.');
  console.log('Next step: upload cover images via Sanity Studio for each book.\n');
}

migrate().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
