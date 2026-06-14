// Schema registry for Biker Babies Studio.
//
// 2026-06-01: added worldLocation and merchCategory (reconstructed from the
// live dataset — 7 worldLocation docs and 4 merchCategory docs existed in
// production with no matching local schemas). Added contactSubmission for the
// new Sanity-backed contact form intake.
// 2026-06-03: added printfulVariant (object type) for the Wyrmfuel-model
// product schema, so the variants[].printfulVariants field resolves.
// 2026-06-14: added wallArt (in-house printed & dispatched wall art) for the
// cross-brand Wall Art feature. Manufactured in-house (NOT Printful); priced
// from src/lib/artwork-pricing.cjs; routed to in-house dispatch by the webhook.
import character from './character';
import episode from './episode';
import book from './book';
import blogPost from './blogPost';
import product from './product';
import printfulVariant from './printfulVariant';
import wallArt from './wallArt';
import category from './category';
import faq from './faq';
import page from './page';
import siteSettings from './siteSettings';
import legalPage from './legalPage';
import worldLocation from './worldLocation';
import merchCategory from './merchCategory';
import contactSubmission from './contactSubmission';
export const schemaTypes = [
  siteSettings,
  worldLocation,
  character,
  episode,
  book,
  blogPost,
  product,
  printfulVariant,
  wallArt,
  category,
  merchCategory,
  faq,
  page,
  legalPage,
  contactSubmission,
];
