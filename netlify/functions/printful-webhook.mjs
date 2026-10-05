/**
 * netlify/functions/printful-webhook.mjs  (The Biker Babies)
 *
 * Printful → Sanity fulfilment-status sync, mirroring Cats On Crack and Labrats. On Printful events:
 *   package_shipped → find the order, set status "shipped" + carrier/tracking/shippedAt,
 *                     and email the customer their tracking ("It's shipped").
 *   order_failed    → set status "fulfilment-failed" + failureReason (surfaces in Studio).
 *   order_created   → log only (stripe-webhook already marked it "fulfilled").
 *
 * Matching: stripe-webhook stores Printful's order id on the Sanity order as
 * `printfulOrderId`, and sends Printful `external_id` = the last 32 chars of the
 * Stripe session id, which is also the Sanity _id suffix (order.<key>, or the
 * older order-<key>). We match on printfulOrderId first, then external_id.
 *
 * Idempotent: a repeated event for an order already in that state (same
 * tracking number / same reason) is logged and skipped, so shippedAt doesn't move.
 * The tracking email goes out only when this delivery actually moved the order
 * to shipped or changed its tracking number — never on a repeat. The patch is
 * conditional on the order's _rev, so two copies of one event arriving together
 * can't both win (the loser gets a 409 and sends nothing).
 *
 * Every step is non-fatal — processed events always get 200 so Printful doesn't
 * retry-storm. Only a bad ?key (401), wrong method (405) or unparseable body (400)
 * gets anything else.
 *
 * Env vars:
 *   SANITY_API_TOKEN        — Sanity *write* (Editor) token (SANITY_TOKEN still works as a fallback)
 *   SANITY_PROJECT_ID       — optional; default v518t53u
 *   SANITY_DATASET          — optional; default production
 *   PRINTFUL_WEBHOOK_SECRET — optional; if set, the request must include ?key=<secret>
 *   RESEND_API_KEY          — optional; without it the tracking email is skipped
 *   ORDER_EMAIL_FROM        — optional; default "The Biker Babies <orders@thebikerbabies.com>"
 *                             (the order confirmation's sender in stripe-webhook.cjs)
 *   BRAND_NAME              — optional; default "The Biker Babies"
 *   BRAND_ACCENT            — optional; falls back to EMAIL_ACCENT, then #ff6b00 (site --color-orange)
 *                             (the order confirmation's accent in stripe-webhook.cjs)
 *   EMAIL_HEADER_BG         — optional; default #0a0a0a
 *   LOGO_URL                — optional; absolute https logo for the email header (text wordmark without it)
 *
 * Point Printful's webhook at:
 *   https://thebikerbabies.com/api/printful-webhook?key=<PRINTFUL_WEBHOOK_SECRET>
 * (Default function path — no `export const config = { path }`; the
 *  netlify.toml /api/* rewrite maps it to /.netlify/functions/printful-webhook.)
 */
import { timingSafeEqual } from 'node:crypto';

const SANITY_API_VER = '2024-01-01';
const SANITY_TIMEOUT_MS = 8000;
const RESEND_URL = 'https://api.resend.com/emails';
const RESEND_TIMEOUT_MS = 8000;

// Read per call so tests (and env changes) take effect without a reload.
const sanityProjectId = () => process.env.SANITY_PROJECT_ID || 'v518t53u';
const sanityDataset = () => process.env.SANITY_DATASET || 'production';
// SANITY_API_TOKEN is the name Netlify and the site use; SANITY_TOKEN is the older one.
const sanityWriteToken = () => process.env.SANITY_API_TOKEN || process.env.SANITY_TOKEN || '';
// Accent and sender match the order confirmation (stripe-webhook.cjs), so both
// emails look alike and come from the address already verified in Resend.
const brand = () => ({
  name: process.env.BRAND_NAME || 'The Biker Babies',
  accent: process.env.BRAND_ACCENT || process.env.EMAIL_ACCENT || '#ff6b00',
  headerBg: process.env.EMAIL_HEADER_BG || '#0a0a0a',
  logoUrl: process.env.LOGO_URL || '',
  from: process.env.ORDER_EMAIL_FROM || 'The Biker Babies <orders@thebikerbabies.com>',
});

const esc = (s) =>
  String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

function keyMatches(given, secret) {
  const a = Buffer.from(String(given || ''));
  const b = Buffer.from(String(secret));
  return a.length === b.length && timingSafeEqual(a, b);
}

async function sanityQuery(groq, params) {
  const qs = Object.entries(params)
    .map(([k, v]) => `&$${k}=${encodeURIComponent(JSON.stringify(v))}`)
    .join('');
  const url = `https://${sanityProjectId()}.api.sanity.io/v${SANITY_API_VER}/data/query/${sanityDataset()}` +
    `?query=${encodeURIComponent(groq)}${qs}`;
  const res = await fetch(url, {
    headers: { Authorization: 'Bearer ' + sanityWriteToken() },
    signal: AbortSignal.timeout(SANITY_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`Sanity query ${res.status}: ${await res.text()}`);
  return (await res.json()).result ?? null;
}

const ORDER_FIELDS = '{ _id, _rev, orderRef, status, trackingNumber, failureReason, customerName, customerEmail }';

async function findOrder(printfulOrderId, externalId) {
  if (printfulOrderId != null && printfulOrderId !== '') {
    const byId = await sanityQuery(
      `*[_type == "order" && printfulOrderId == $pid][0]${ORDER_FIELDS}`,
      { pid: String(printfulOrderId) }
    );
    if (byId) return byId;
  }
  if (externalId) {
    const key = String(externalId);
    return sanityQuery(
      `*[_type == "order" && _id in [$a, $b]][0]${ORDER_FIELDS}`,
      { a: `order.${key}`, b: `order-${key}` }
    );
  }
  return null;
}

// With ifRevisionID, Sanity rejects the patch (409) if the order changed since we
// read it; that returns false instead of throwing.
async function patchOrder(orderId, set, ifRevisionID) {
  const patch = { id: orderId, set };
  if (ifRevisionID) patch.ifRevisionID = ifRevisionID;
  const res = await fetch(
    `https://${sanityProjectId()}.api.sanity.io/v${SANITY_API_VER}/data/mutate/${sanityDataset()}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + sanityWriteToken() },
      body: JSON.stringify({ mutations: [{ patch }] }),
      signal: AbortSignal.timeout(SANITY_TIMEOUT_MS),
    }
  );
  if (ifRevisionID && res.status === 409) return false;
  if (!res.ok) throw new Error(`Sanity mutate ${res.status}: ${await res.text()}`);
  return true;
}

// Only http(s) links go in the button; anything else is dropped.
const safeUrl = (u) => (/^https?:\/\//i.test(String(u || '')) ? String(u) : '');

// "The Biker Babies" → "Biker Babies", so the subject reads like the order confirmation's.
const shortName = (name) => String(name).replace(/^the\s+/i, '');

// "It's shipped" email in The Biker Babies order-confirmation palette (stripe-webhook.cjs).
function buildShippedEmailHtml(order, shipment, b = brand()) {
  const ref = esc(order.orderRef || '');
  const carrier = esc(shipment.carrier || 'the carrier');
  const num = esc(shipment.tracking_number || '');
  const url = safeUrl(shipment.tracking_url);
  const header = b.logoUrl
    ? `<img src="${esc(b.logoUrl)}" alt="${esc(b.name)}" width="240" style="max-width:240px;width:240px;height:auto;display:inline-block;border:0;" />`
    : `<span style="font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:800;letter-spacing:3px;color:${esc(b.accent)};text-transform:uppercase;">${esc(b.name)}</span>`;
  const trackBtn = url
    ? `<a href="${esc(url)}" style="display:inline-block;margin-top:8px;padding:12px 26px;background:${esc(b.accent)};color:#0a0a0a;font-family:Arial,Helvetica,sans-serif;font-weight:700;text-transform:uppercase;letter-spacing:1px;text-decoration:none;border-radius:3px;font-size:14px;">Track your order</a>`
    : '';
  return `<!doctype html><html><body style="margin:0;padding:0;background:#0a0a0a;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:32px 16px;"><tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#161616;border:1px solid ${esc(b.accent)};">
        <tr><td style="background:${esc(b.headerBg)};padding:22px 28px;text-align:center;">${header}</td></tr>
        <tr><td style="padding:32px 28px;">
          <h1 style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:24px;letter-spacing:1px;color:#f5c518;text-transform:uppercase;">It's shipped</h1>
          <p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#9aa3a4;">Order ref <strong style="color:${esc(b.accent)};">#${ref}</strong></p>
          <p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#f5f5f5;">
            Throttle open! Your gear has left the workshop and is on the road${num ? ` with ${carrier}` : ''}.
          </p>
          ${num ? `<p style="margin:0 0 4px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:1px;color:#9aa3a4;text-transform:uppercase;">Tracking number</p>
          <p style="margin:0 0 12px;font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#f5f5f5;font-weight:700;">${num}</p>` : ''}
          ${trackBtn}
          <p style="margin:24px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:#9aa3a4;border-top:1px solid #2a2a2a;padding-top:16px;">
            ${esc(b.name)} — printed &amp; shipped on demand. Questions? Just reply to this email.
          </p>
        </td></tr>
      </table>
    </td></tr></table>
  </body></html>`;
}

// Never throws: the order is already patched, so a mail failure is just logged.
async function sendShippedEmail(order, shipment) {
  const ref = order.orderRef || '';
  if (!process.env.RESEND_API_KEY) {
    console.warn(`[SHIP-EMAIL-SKIP] ${ref}: RESEND_API_KEY not set.`);
    return;
  }
  if (!order.customerEmail) {
    console.warn(`[SHIP-EMAIL-SKIP] ${ref}: no customer email on the order.`);
    return;
  }
  const b = brand();
  try {
    const res = await fetch(RESEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + process.env.RESEND_API_KEY },
      body: JSON.stringify({
        from: b.from,
        to: order.customerEmail,
        subject: `Your ${shortName(b.name)} order #${ref} has shipped`,
        html: buildShippedEmailHtml(order, shipment, b),
      }),
      signal: AbortSignal.timeout(RESEND_TIMEOUT_MS),
    });
    if (!res.ok) console.error(`[SHIP-EMAIL-FAIL] ${ref}: Resend ${res.status} — ${await res.text()}`);
    else console.log(`[SHIP-EMAIL-OK] ${ref}: tracking sent to ${order.customerEmail}.`);
  } catch (err) {
    console.error(`[SHIP-EMAIL-FAIL] ${ref}:`, err && err.message ? err.message : err);
  }
}

// Printful sends shipped_at as a unix timestamp (seconds); fall back to now.
function shippedAtIso(shipment) {
  const t = Number(shipment.shipped_at);
  return Number.isFinite(t) && t > 0 ? new Date(t * 1000).toISOString() : new Date().toISOString();
}

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  // Optional shared-secret gate via ?key=… (Printful V1 doesn't sign payloads).
  const secret = process.env.PRINTFUL_WEBHOOK_SECRET;
  if (secret) {
    const key = new URL(req.url).searchParams.get('key');
    if (!keyMatches(key, secret)) {
      console.warn('[PRINTFUL-WEBHOOK] rejected: bad or missing ?key');
      return new Response('Unauthorized', { status: 401 });
    }
  } else {
    console.warn('[PRINTFUL-WEBHOOK] PRINTFUL_WEBHOOK_SECRET not set — accepting unauthenticated request.');
  }

  let body;
  try {
    body = await req.json();
  } catch (_) {
    return new Response('Bad request', { status: 400 });
  }

  const eventType = body?.type;
  const printfulOrderId = body?.data?.order?.id;
  const externalId = body?.data?.order?.external_id;
  const label = `Printful #${printfulOrderId ?? '?'} (external_id ${externalId ?? '?'})`;

  try {
    if (eventType !== 'package_shipped' && eventType !== 'order_failed') {
      if (eventType === 'order_created') console.log('[ORDER-CREATED] Printful confirmed', label);
      else console.log('[PRINTFUL-WEBHOOK] unhandled event:', eventType);
      return new Response('OK', { status: 200 });
    }

    if (!sanityWriteToken()) {
      console.warn('[PRINTFUL-WEBHOOK] neither SANITY_API_TOKEN nor SANITY_TOKEN is set — cannot update orders.');
      return new Response('OK', { status: 200 });
    }

    const order = await findOrder(printfulOrderId, externalId);

    if (eventType === 'package_shipped') {
      const shipment = body.data?.shipment || {};
      const trackingNumber = String(shipment.tracking_number || '');
      if (!order) {
        console.error(`[SHIPPED] ORDER NOT FOUND in Sanity for ${label} — tracking ${trackingNumber || 'none'} not recorded.`);
      } else if (order.status === 'shipped' && (order.trackingNumber || '') === trackingNumber) {
        console.log(`[SHIPPED] ${order.orderRef} already shipped with tracking ${trackingNumber || 'none'} — repeat event, skipped.`);
      } else {
        const patched = await patchOrder(order._id, {
          status: 'shipped',
          carrier: String(shipment.carrier || ''),
          trackingNumber,
          trackingUrl: String(shipment.tracking_url || ''),
          shippedAt: shippedAtIso(shipment),
        }, order._rev);
        if (!patched) {
          console.log(`[SHIPPED] ${order.orderRef} changed while this event was handled (concurrent delivery) — skipped, no email.`);
        } else {
          console.log(`[SHIPPED] ${order.orderRef} → shipped (${trackingNumber || 'no number'}).`);
          await sendShippedEmail(order, shipment);
        }
      }
    } else {
      const reason = String(body.data?.reason || '');
      if (!order) {
        console.error(`[ORDER-FAILED] ORDER NOT FOUND in Sanity for ${label}. Reason:`, reason);
      } else if (order.status === 'fulfilment-failed' && (order.failureReason || '') === reason) {
        console.log(`[ORDER-FAILED] ${order.orderRef} already fulfilment-failed with this reason — repeat event, skipped.`);
      } else {
        await patchOrder(order._id, { status: 'fulfilment-failed', failureReason: reason });
        console.error(`[ORDER-FAILED] ${order.orderRef} → fulfilment-failed. Reason:`, reason);
      }
    }

    return new Response('OK', { status: 200 });
  } catch (err) {
    // Non-fatal: log and still 200 so Printful doesn't retry-storm.
    console.error(`[PRINTFUL-WEBHOOK] error handling ${eventType} for ${label}:`, err && err.message ? err.message : err);
    return new Response('OK', { status: 200 });
  }
}
