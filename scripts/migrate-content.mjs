#!/usr/bin/env node
import { createClient } from '@sanity/client';
import { config } from 'dotenv';
config();

const client = createClient({ projectId: process.env.SANITY_PROJECT_ID || 'v518t53u', dataset: process.env.SANITY_DATASET || 'production', apiVersion: '2024-01-01', token: process.env.SANITY_API_TOKEN, useCdn: false });

function slugify(text) { return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); }

const heroes = [
  { name: 'Amara "The Innovator"', title: "The Innovator", bio: "A tech-savvy rider who combines traditional biking with modern gadgets. Her smart helmet design helps the team stay connected during adventures, and her innovative bike modifications often save the day." },
  { name: 'Zeya "The Tech Whiz"', title: "The Tech Whiz", bio: "A coding prodigy who uses her programming skills to create apps that help the team track their routes and monitor bike maintenance. Her digital savvy brings a modern edge to their adventures." },
  { name: 'Kai "The Daredevil"', title: "The Daredevil", bio: "The team's fearless stunt performer who never backs down from a challenge. With natural athletic ability and unwavering confidence, Kai pushes the boundaries of what's possible on two wheels." },
  { name: 'Santiago "The Mechanic"', title: "The Mechanic", bio: "A natural problem solver with an intuitive understanding of how things work. Santiago can fix any bike issue and often creates custom modifications to help the team overcome obstacles." },
  { name: 'Logan "The Navigator"', title: "The Navigator", bio: "With an exceptional sense of direction and love for exploration, Logan helps the team discover new routes and adventures. Always carries a collection of hand-drawn maps." },
  { name: 'Cassidy "The Artist"', title: "The Artist", bio: "Creative and expressive, Cassidy brings colour to the team by customizing their bikes with unique designs. Her artistic vision helps make each bike as individual as its rider." },
  { name: 'Arjun "The Strategist"', title: "The Strategist", bio: "The team's master planner who thinks three steps ahead. Arjun's careful preparation and quick thinking help the team navigate tricky situations." },
  { name: 'Cinnamon "The Peacemaker"', title: "The Peacemaker", bio: "The heart of the group who keeps everyone united. Cinnamon's empathy and understanding help resolve conflicts and strengthen team bonds." },
  { name: 'Harper "The Environmentalist"', title: "The Environmentalist", bio: "Passionate about nature and conservation, Harper leads the team's eco-friendly initiatives and teaches them about respecting the environment during their adventures." },
  { name: 'Ethan "The Entertainer"', title: "The Entertainer", bio: "Always ready with a joke or funny story, Ethan keeps spirits high during challenging rides. His positive energy is contagious and helps the team stay motivated." },
  { name: 'Hiro "The Inventor"', title: "The Inventor", bio: "A brilliant mind who creates innovative bike accessories from recycled materials. Hiro's inventions often have unexpected but helpful features." },
  { name: 'Kofi "The Musician"', title: "The Musician", bio: "Brings rhythm to the team's rides with his beat-boxing and improvised songs. Kofi's music helps coordinate group movements and adds fun to every adventure." },
  { name: 'Maddison "The Leader"', title: "The Leader", bio: "Natural-born leader who brings out the best in everyone. Maddison's strong sense of responsibility and care for others makes her a respected figure in the group." },
  { name: 'Leilani "The Naturalist"', title: "The Naturalist", bio: "An expert in local flora and fauna, Leilani helps the team safely navigate through nature and teaches them about the wildlife they encounter." },
  { name: 'Mateo "The Storyteller"', title: "The Storyteller", bio: "Gifted with imagination, Mateo turns every ride into an epic adventure through his storytelling. His tales inspire the team to push their boundaries." },
  { name: 'Nia "The Scientist"', title: "The Scientist", bio: "Curious and analytical, Nia studies the physics of biking to help the team improve their techniques. Her experiments often lead to interesting discoveries." },
  { name: 'Yara "The Athlete"', title: "The Athlete", bio: "A natural athlete who helps train the team in fitness and endurance. Yara's training programs help everyone become stronger and more skilled riders." },
  { name: 'Wyatt "The Historian"', title: "The Historian", bio: "Fascinated by local history, Wyatt guides the team to interesting historical locations and shares stories about the neighbourhood's past." },
];

const villains = [
  { name: "Grumble Gnome", title: "Grumble Gnome", bio: "A grouchy garden gnome who believes bikes ruin his perfectly manicured lawn. Sets up elaborate traps to protect his territory from The Biker Babies." },
  { name: "Grumpy Gearhead", title: "Grumpy Gearhead", bio: "A cranky former bike shop owner who creates mechanical obstacles for the team. Deep down, he's impressed by their skills but too proud to admit it." },
  { name: "Blaze", title: "Blaze", bio: "A retired stunt rider with a fiery obsession, who thrives on danger and drama. He views The Biker Babies as obstacles to reignite his glory days." },
  { name: "Sir Stop-Alot", title: "Sir Stop-Alot", bio: "A self-appointed crossing guard who takes his job way too seriously. His elaborate traffic rules and random stop signs create chaos for The Biker Babies." },
  { name: "Turbo Toad", title: "Turbo Toad", bio: "A speed-obsessed amphibian who rides a souped-up pogo stick. Constantly tries to prove that hopping is better than biking." },
  { name: "Slick Sally", title: "Slick Sally", bio: "A playful troublemaker who turns her love of slime into gooey obstacles for The Biker Babies." },
  { name: "Count Crankshaft", title: "Count Crankshaft", bio: "An eccentric inventor who creates bizarre anti-bike devices. His contraptions never work as planned, often backfiring in comical ways." },
  { name: "The Flat Tyre Gang", title: "The Flat Tyre Gang", bio: "A mischievous group of porcupines who drop spikes on bike paths. They think it's hilarious, but The Biker Babies always have to watch out for their pranks." },
  { name: "Scorch", title: "Scorch", bio: "Blaze's equally daring young son, eager to follow in his father's fiery footsteps. Though smaller in size, Scorch is bold and mischievous." },
  { name: "Grease Goblin", title: "Grease Goblin", bio: "A sneaky creature who lives in the storm drains and collects broken bike parts. Sometimes helps the team in exchange for shiny new bike bells." },
];

const episodes = [
  { title: "The Biker Babies Official Trailer", videoType: "trailer", youtubeUrl: "", youtubeId: "", description: "Meet The Biker Babies — a diverse crew of young riders on thrilling adventures!", featured: true, publishedAt: "2026-01-15T00:00:00Z" },
  { title: "The Great Trail Race", videoType: "episode", youtubeUrl: "", youtubeId: "", description: "The team faces their biggest challenge yet as they race against Turbo Toad's crew through the city's most treacherous bike trail.", featured: false, publishedAt: "2026-03-01T00:00:00Z" },
  { title: "Grumble Gnome's Garden Showdown", videoType: "episode", youtubeUrl: "", youtubeId: "", description: "When the team's favourite shortcut gets blocked by Grumble Gnome's elaborate trap garden, they have to think fast.", featured: false, publishedAt: "2026-04-01T00:00:00Z" },
];

const blogPosts = [
  { title: "From Page to Screen: The Biker Babies Story", category: "bts", excerpt: "Discover how the Biker Babies' adventures come to life in both the book series and the animated show!", publishedAt: "2026-02-25T00:00:00Z" },
  { title: "Meet the Villains: Who's Causing Trouble This Season?", category: "lore", excerpt: "From Grumble Gnome's garden traps to Turbo Toad's pogo-stick antics, get the lowdown on the troublemakers giving The Biker Babies a run for their money!", publishedAt: "2026-02-18T00:00:00Z" },
  { title: "Top 5 Tips for Young Riders", category: "dispatches", excerpt: "Inspired by the crew, here are five real-world bike safety and riding tips that every young cyclist should know.", publishedAt: "2026-02-10T00:00:00Z" },
  { title: "The Biker Babies Book Series – What to Read First", category: "dispatches", excerpt: "New to the series? Here's the perfect reading order to jump into the world of The Biker Babies.", publishedAt: "2026-01-28T00:00:00Z" },
];

const categories = [
  { title: "Apparel", description: "Hoodies, tees, caps — ride-ready gear", sortOrder: 1 },
  { title: "Accessories", description: "Patches, keychains, water bottles", sortOrder: 2 },
  { title: "Collectibles", description: "Stickers, prints, enamel pins", sortOrder: 3 },
];

const siteSettings = {
  _id: 'siteSettings', _type: 'siteSettings',
  siteName: 'The Biker Babies', tagline: 'Adventure on Two Wheels!',
  siteDescription: 'Join The Biker Babies on thrilling animated adventures, dive into the book series, and grab official merchandise!',
  contactEmail: 'contact@bikerbabies.com', youtubeChannel: 'https://www.youtube.com/@TheBikerBabies',
  socialLinks: [
    { _type: 'object', _key: 'yt', platform: 'YouTube', url: 'https://www.youtube.com/@TheBikerBabies' },
    { _type: 'object', _key: 'ig', platform: 'Instagram', url: 'https://www.instagram.com/thebikerbabies' },
    { _type: 'object', _key: 'fb', platform: 'Facebook', url: 'https://www.facebook.com/thebikerbabies' },
    { _type: 'object', _key: 'tt', platform: 'TikTok', url: 'https://www.tiktok.com/@thebikerbabies' },
    { _type: 'object', _key: 'x', platform: 'X', url: 'https://x.com/TheBikerBabies' },
  ],
  footerText: '© The Metavision 2026. All rights reserved.',
  newsletterHeadline: 'Join the Ride!', newsletterSubtext: 'Get the latest adventures, merch drops, and behind-the-scenes action.',
};

async function migrate() {
  console.log('🏍️  Starting The Biker Babies content migration...\n');

  console.log('📋 Creating site settings...');
  await client.createOrReplace(siteSettings);
  console.log('   ✅ Site settings created\n');

  console.log('🦸 Creating heroes...');
  for (let i = 0; i < heroes.length; i++) {
    const char = heroes[i];
    await client.createOrReplace({
      _type: 'character', _id: `character-${slugify(char.name)}`,
      name: char.name, slug: { _type: 'slug', current: slugify(char.name) },
      characterTitle: char.title, characterType: 'hero', bio: char.bio, sortOrder: i + 1,
      seoTitle: `${char.name} — The Biker Babies`, seoDescription: char.bio.substring(0, 155) + '...',
    });
    console.log(`   ✅ ${char.name}`);
  }
  console.log(`   → ${heroes.length} heroes created\n`);

  console.log('🦹 Creating villains...');
  for (let i = 0; i < villains.length; i++) {
    const char = villains[i];
    await client.createOrReplace({
      _type: 'character', _id: `character-${slugify(char.name)}`,
      name: char.name, slug: { _type: 'slug', current: slugify(char.name) },
      characterTitle: char.title, characterType: 'villain', bio: char.bio, sortOrder: heroes.length + i + 1,
      seoTitle: `${char.name} — The Biker Babies`, seoDescription: char.bio.substring(0, 155) + '...',
    });
    console.log(`   ✅ ${char.name}`);
  }
  console.log(`   → ${villains.length} villains created\n`);

  console.log('🎬 Creating episodes...');
  for (const ep of episodes) {
    await client.createOrReplace({
      _type: 'episode', _id: `episode-${slugify(ep.title)}`,
      title: ep.title, slug: { _type: 'slug', current: slugify(ep.title) },
      videoType: ep.videoType, youtubeUrl: ep.youtubeUrl, youtubeId: ep.youtubeId,
      description: ep.description, featured: ep.featured, publishedAt: ep.publishedAt,
      seoTitle: `${ep.title} — The Biker Babies`, seoDescription: ep.description.substring(0, 155) + '...',
    });
    console.log(`   ✅ ${ep.title}`);
  }
  console.log(`   → ${episodes.length} episodes created\n`);

  console.log('📝 Creating blog posts...');
  for (const post of blogPosts) {
    await client.createOrReplace({
      _type: 'blogPost', _id: `post-${slugify(post.title)}`,
      title: post.title, slug: { _type: 'slug', current: slugify(post.title) },
      category: post.category, excerpt: post.excerpt,
      body: [{ _type: 'block', _key: 'placeholder', style: 'normal', markDefs: [], children: [{ _type: 'span', _key: 'span1', text: post.excerpt + ' [Full article content to be added in Sanity Studio]', marks: [] }] }],
      publishedAt: post.publishedAt,
      seoTitle: `${post.title} — Baby Babble`, seoDescription: post.excerpt.substring(0, 155) + '...',
    });
    console.log(`   ✅ ${post.title}`);
  }
  console.log(`   → ${blogPosts.length} blog posts created\n`);

  console.log('🏷️  Creating merch categories...');
  for (const cat of categories) {
    await client.createOrReplace({
      _type: 'category', _id: `category-${slugify(cat.title)}`,
      title: cat.title, slug: { _type: 'slug', current: slugify(cat.title) },
      description: cat.description, sortOrder: cat.sortOrder,
    });
    console.log(`   ✅ ${cat.title}`);
  }
  console.log(`   → ${categories.length} categories created\n`);

  const total = heroes.length + villains.length;
  console.log('═══════════════════════════════════════════');
  console.log('🎉 Migration complete!');
  console.log(`   ${total} characters (${heroes.length} heroes + ${villains.length} villains)`);
  console.log(`   ${episodes.length} episodes`);
  console.log(`   ${blogPosts.length} blog posts`);
  console.log(`   ${categories.length} categories`);
  console.log(`   1 site settings document`);
  console.log('═══════════════════════════════════════════');
}

migrate().catch((err) => { console.error('❌ Migration failed:', err); process.exit(1); });
