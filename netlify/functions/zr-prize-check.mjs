// Scheduled daily: every Zoomville Rush prize offer whose claim window has run out passes to the next player
// (netlify/lib/zr-prize.mjs: 30 days after the month for the winner, 14 days for each next player, down the
// top 10), and the team gets an email for each one.
import { zrStore } from '../lib/zr-shared.mjs';
import { sendEmail } from '../lib/zr-email.mjs';
import { expireDue } from '../lib/zr-prize.mjs';
import { passDownEmail } from '../lib/zr-prize-emails.mjs';

export async function checkWindows(now = Date.now()) {
  const store = await zrStore();
  const done = await expireDue(store, now);
  for (const d of done) await sendEmail(passDownEmail(d)).catch((e) => console.error(`[ZR-PRIZE] ${d.month}: pass-down email failed:`, e.message));
  return done.map((d) => ({ month: d.month, status: d.rec.status, idx: d.rec.offer ? d.rec.offer.idx : null }));
}

export default async () => { const r = await checkWindows(); console.log('[ZR-PRIZE] window check:', JSON.stringify(r)); return new Response('ok'); };
export const config = { schedule: '15 6 * * *' };
