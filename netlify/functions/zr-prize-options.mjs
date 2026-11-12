// GET /api/zr-prize-options  ->  { designs: [{ slug, name, garments: [{ type, label, colours: [{ colour, image, sizes }] }] }] }
// The T-shirts a Zoomville Rush prize can be: every active Biker Babies design with T-shirt (and, where it has them,
// kids T-shirt) variants, built only from its real Printful variants (netlify/lib/zr-prize.mjs). Read only.
import { json } from '../lib/zr-shared.mjs';
import { sanityRead, PRIZE_QUERY, prizeDesigns } from '../lib/zr-prize.mjs';

export default async (req) => {
  if (req.method !== 'GET') return json({ error: 'method' }, 405);
  try {
    return json({ designs: prizeDesigns(await sanityRead(PRIZE_QUERY)) }, 200, { 'cache-control': 'public, max-age=300' });
  } catch (e) {
    console.error('[ZR-PRIZE] options failed:', e.message);
    return json({ designs: [], error: 'unavailable' }, 503);
  }
};
