// Schema registry for Biker Babies Studio.
//
// 2026-06-01: added worldLocation and merchCategory (reconstructed from the
// live dataset — 7 worldLocation docs and 4 merchCategory docs existed in
// production with no matching local schemas). Added contactSubmission for the
// new Sanity-backed contact form intake.
import character from './character';
import episode from './episode';
import book from './book';
import blogPost from './blogPost';
import product from './product';
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
  category,
  merchCategory,
  faq,
  page,
  legalPage,
  contactSubmission,
];
