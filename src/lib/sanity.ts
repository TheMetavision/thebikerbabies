import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: import.meta.env.SANITY_PROJECT_ID || 'v518t53u',
  dataset: import.meta.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01', useCdn: true,
});

const builder = imageUrlBuilder(client);
export function urlFor(source: any) { return builder.image(source); }

export async function getAllCharacters() {
  return client.fetch(`*[_type == "character"] | order(sortOrder asc) { _id, name, "slug": slug.current, characterTitle, characterType, bio, extendedBio, portrait, galleryImages, sortOrder, seoTitle, seoDescription }`);
}
export async function getHeroes() {
  return client.fetch(`*[_type == "character" && characterType == "hero"] | order(sortOrder asc) { _id, name, "slug": slug.current, characterTitle, bio, portrait }`);
}
export async function getVillains() {
  return client.fetch(`*[_type == "character" && characterType == "villain"] | order(sortOrder asc) { _id, name, "slug": slug.current, characterTitle, bio, portrait }`);
}
export async function getCharacterBySlug(slug: string) {
  return client.fetch(`*[_type == "character" && slug.current == $slug][0] { _id, name, "slug": slug.current, characterTitle, characterType, bio, extendedBio, portrait, galleryImages, seoTitle, seoDescription }`, { slug });
}
export async function getAllEpisodes() {
  return client.fetch(`*[_type == "episode"] | order(publishedAt desc) { _id, title, "slug": slug.current, videoType, season, episodeNumber, youtubeUrl, youtubeId, thumbnail, description, "featuredCharacters": featuredCharacters[]->{ name, "slug": slug.current, portrait }, publishedAt, duration, featured, seoTitle, seoDescription }`);
}
export async function getFeaturedEpisodes() {
  return client.fetch(`*[_type == "episode" && featured == true] | order(publishedAt desc)[0...4] { _id, title, "slug": slug.current, videoType, youtubeUrl, youtubeId, thumbnail, description, publishedAt, duration }`);
}
export async function getAllBlogPosts() {
  return client.fetch(`*[_type == "blogPost"] | order(publishedAt desc) { _id, title, "slug": slug.current, tag, category, excerpt, body, featuredImage, publishedAt, seoTitle, seoDescription }`);
}
export async function getBlogPostBySlug(slug: string) {
  return client.fetch(`*[_type == "blogPost" && slug.current == $slug][0] { _id, title, "slug": slug.current, tag, category, excerpt, body, featuredImage, publishedAt, seoTitle, seoDescription }`, { slug });
}
export async function getAllProducts() {
  return client.fetch(`*[_type == "product"] | order(name asc) { _id, name, "slug": slug.current, "category": category->{ title, "slug": slug.current }, description, price, compareAtPrice, images, printfulVariants, material, featured, seoTitle, seoDescription }`);
}
export async function getAllCategories() {
  return client.fetch(`*[_type == "category"] | order(sortOrder asc) { _id, title, "slug": slug.current, description, image, sortOrder }`);
}
export async function getAllFaqs() {
  return client.fetch(`*[_type == "faq"] | order(order asc) { _id, question, answer, category, order }`);
}
export async function getPageBySlug(slug: string) {
  return client.fetch(`*[_type == "page" && slug.current == $slug][0] { _id, title, "slug": slug.current, body, noIndex, seoTitle, seoDescription }`, { slug });
}
export async function getSiteSettings() {
  return client.fetch(`*[_type == "siteSettings"][0] { siteName, tagline, siteDescription, contactEmail, youtubeChannel, socialLinks, announcementBar, logo, footerLogo, footerText, newsletterHeadline, newsletterSubtext }`);
}

// ─── Theme audio (added 2026-04-30 for the IP brand theme-tune feature build #3/4) ───
// Pinned to _id == "siteSettings" so it only ever reads the canonical singleton.
// Returns null URLs if the singleton has no MP3 uploaded yet OR if themeEnabled
// is explicitly false — both render-blocking states the BBSpeedometer component
// safely handles by rendering nothing.
//
// engineSfxUrl is OPTIONAL — the BB build is the first of the four to use a
// pre-track engine-start SFX prologue. Component degrades gracefully to silent
// prologue (~700ms WARMING UP... visual continuity) if the asset isn't uploaded.
export interface ThemeAudio {
  audioUrl: string | null;
  engineSfxUrl: string | null;
  trackTitle: string | null;
  trackArtist: string | null;
  enabled: boolean;
}
export async function getThemeAudio(): Promise<ThemeAudio> {
  const result = await client.fetch(`*[_type == "siteSettings" && _id == "siteSettings"][0]{
    "audioUrl": themeAudioFile.asset->url,
    "engineSfxUrl": themeEngineSfxFile.asset->url,
    "trackTitle": themeTrackTitle,
    "trackArtist": themeTrackArtist,
    "enabled": themeEnabled
  }`);
  return {
    audioUrl: result?.audioUrl ?? null,
    engineSfxUrl: result?.engineSfxUrl ?? null,
    trackTitle: result?.trackTitle ?? 'The Biker Babies Main Theme',
    trackArtist: result?.trackArtist ?? '',
    enabled: result?.enabled !== false, // null treated as enabled (kill switch must be explicit false to disable)
  };
}
