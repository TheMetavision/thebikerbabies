/**
 * The Biker Babies' non-secret settings for the shipping code, committed instead of
 * held as Netlify environment variables.
 *
 * WHY. Every variable scoped to Functions is copied into every function, and
 * AWS Lambda refuses a function whose environment is over 4 KB. A brand
 * address, a colour or a public URL costs the same bytes as a secret but
 * protects nothing, so new settings live here and only secrets go in Netlify.
 * (Comic Strip Canvas had a deploy fail on exactly this.)
 *
 * OVERRIDES. Each key is the name of an environment variable. If that variable
 * is set (non-empty) it still wins, so a value can be changed for one deploy
 * context without a commit. A few names (SITE_URL, LOGO_URL, BRAND_NAME,
 * BRAND_ACCENT, EMAIL_HEADER_BG, SANITY_PROJECT_ID, SANITY_DATASET) are
 * already set in Netlify with the same values; they keep working.
 *
 * NOTHING SECRET GOES IN THIS FILE. It is in the repository's history for
 * ever. Tokens, API keys and webhook secrets stay in Netlify.
 *
 * This is the ONLY brand-specific file in the shipping code: every other
 * netlify/functions/_shared/ shipping module is the same in The Fuglys,
 * Labrats, Cats On Crack and The Biker Babies.
 */

export const SITE_CONFIG = Object.freeze({
  SITE_URL: 'https://thebikerbabies.com',
  SITE_HOST: 'thebikerbabies.com',
  STUDIO_URL: 'https://thebikerbabies.sanity.studio',

  SANITY_PROJECT_ID: 'v518t53u',
  SANITY_DATASET: 'production',

  BRAND_NAME: 'The Biker Babies',
  // In email subjects: "Your Labrats wall art is on its way".
  BRAND_SHORT: 'Biker Babies',

  // Customer emails come from the same sender as Printful's "It's shipped"
  // email (ORDER_EMAIL_FROM, unset in Netlify, so its default); replies go to the address the
  // Returns & Refunds policy gives.
  EMAIL_FROM: 'The Biker Babies <orders@thebikerbabies.com>',
  EMAIL_REPLY_TO: 'contact@themetavision.co.uk',
  // Shipping, returns and alert emails to the team (NOTIFICATION_TO).
  TEAM_EMAIL: 'pitcrew@thebikerbabies.com',
  // The address the policies tell customers to write to.
  CONTACT_EMAIL: 'contact@themetavision.co.uk',

  // The look of the customer emails: the "It's shipped" email's palette
  // (printful-webhook.mjs), so both read as one brand.
  LOGO_URL: 'https://cdn.sanity.io/images/v518t53u/production/0b5d5e7ac5d01c7d532c6f40f006f2940616fe32-1000x600.png?w=600&fm=png',
  BRAND_ACCENT: '#ff6b00',
  EMAIL_HEADER_BG: '#000000',
  EMAIL_PAGE_BG: '#0a0a0a',
  EMAIL_CARD_BG: '#161616',
  EMAIL_HEADING: '#f5c518',
  EMAIL_TEXT: '#f5f5f5',
  EMAIL_MUTED: '#9aa3a4',
  EMAIL_RULE: '#2a2a2a',
  EMAIL_BUTTON_TEXT: '#0a0a0a',
  // The wall-art dispatch email's opening line, in the voice of the
  // "It's shipped" email ("Throttle open! Your gear has left the workshop…").
  DISPATCH_LINE: 'Throttle open! Your wall art has left the workshop and is on the road',

  // The metavision-shipping service. Every call is HMAC-signed with
  // SHIPPING_SECRET, which stays in Netlify.
  SHIPPING_API_URL: 'https://mv-shipping-svc-26.netlify.app',
  SHIPPING_BRAND: 'BIKERBABIES',

  // Several posters travel rolled in one tube. The service declares the
  // band's weight (the largest poster's band), so each poster beyond the
  // first adds this many grams, sent to create-parcel as extraWeightG.
  // ⚠ Alan to confirm against a weighed tube.
  POSTER_EXTRA_WEIGHT_G: '70',

  // /returns covers wall art. Merchandise (Printful) returns are built but off
  // until the X1 (mailer) and X2 (bulky box) bands are measured on the
  // shipping service. "true" turns them on.
  RETURNS_CLOTHING: 'false',

  // Where /returns sends people while it is switched off.
  RETURNS_POLICY_PATH: '/legal/returns-refunds/',

  // Where each carrier's returns are collected from. For the team's "ready to
  // collect" email only; never sent to a customer.
  RETURN_POINT_INPOST: 'InPost locker, 59 West Road, Shoeburyness',
  RETURN_POINT_EVRI: 'ASDA Shoebury, North Shoebury Road',
  RETURN_POINT_UPS: 'Skanda, 93-95 West Road, Shoeburyness',
});

/**
 * A setting: the environment variable of the same name if it is set, else the
 * committed value.
 *
 * @param {keyof typeof SITE_CONFIG} name
 * @param {Record<string, string|undefined>} [env] defaults to process.env; tests pass their own
 */
export function setting(name, env = process.env) {
  if (!(name in SITE_CONFIG)) throw new Error(`site-config: unknown setting ${name}`);
  const v = env?.[name];
  return typeof v === 'string' && v.trim() ? v.trim() : SITE_CONFIG[name];
}

/** A yes/no setting. */
export const flag = (name, env = process.env) => ['true', '1', 'yes'].includes(setting(name, env).toLowerCase());

/** A whole-number setting (grams and the like); `fallback` if it isn't one. */
export function intSetting(name, fallback = 0, env = process.env) {
  const n = Number(setting(name, env));
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : fallback;
}

/**
 * The Sanity token for a function that WRITES, in the order stripe-webhook
 * and printful-webhook already read them.
 */
export function sanityWriteToken(env = process.env) {
  for (const name of ['SANITY_API_TOKEN', 'SANITY_TOKEN']) {
    const v = env?.[name];
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  return undefined;
}
