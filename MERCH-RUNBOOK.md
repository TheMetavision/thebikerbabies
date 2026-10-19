# The Biker Babies: merch run-book

What was changed in the shop, why, and how to repeat or undo it. Newest work at the bottom of each section.
Tooling lives in `C:\Users\chris\Projects\printful-sync` (its own git repo); the site's code is on branches here.

## Stores and IDs

| | |
|---|---|
| Printful store | `PRINTFUL_STORE_BIKERBABIES` (store-scoped token `PRINTFUL_TOKEN_BIKERBABIES` in printful-sync `.env`; `PRINTFUL_API_KEY` on Netlify) |
| Sanity | project `v518t53u`, dataset `production` |
| Netlify site | `thebikerbabies`, id `bad402af-4674-4973-95cb-3be3de6805b3` (repo linked 18 Oct: `.netlify/state.json`, gitignored) |
| Stripe | shared with Cats On Crack, Labrats and The Fuglys (one account); sessions carry `metadata.brand = bikerbabies` (and the legacy `source = bikerbabies-web`) |

---

## Part A: margin audit (18 Oct 2026)

**Finding.** Every drinkware product lost money on GB orders. Live Printful quotes (`POST /orders/estimate-costs`, single item),
our VAT on GB sales, Stripe 1.5% + 20p, the delivery charge collected. The four IP brands carry the same blanks at the same
prices, so the numbers are the same as Cats On Crack's:

| Product | Printful # | Stocked | Retail | GB landed | GB profit |
|---|---|---|---|---|---|
| 20oz Tumbler | 909 | US only | £22.50 | £36.41 | −£6.44 (−26%) |
| 16oz Can Glass | 690 | US only | £11.50 | £24.17 | −£5.24 (−34%) |
| Can Glass lid & straw | 690 | US only | £12.50 | £25.07 | −£5.17 (−32%) |
| Pin badge set (5) | 660 | US only | £9.95 | £18.41 | −£1.71 (−12%) |

Everything else (adult and kids apparel, baby grow, socks, stickers) makes 28–58% on a GB order. No customer had bought
drinkware or pins, so actual losses were £0.

**Orders.** One Printful order: `F2MB3CUI` (21 Jul, an internal test, Sticker Set 5), placed correctly in this store
(Printful #168075099) and logged here as fulfilled.

**Decisions (Alan, 18 Oct 2026):** tumbler moves to #585 (EU-stocked) at £32.95, white (black at first; dropped 18 Oct for low contrast with the dark art); can glass dropped;
11oz mug #19 (UK/EU) added at £12.95 with the design on both sides; pin badge sets dropped; delivery tied to destination.

### A1. EB21KP20 (19 Jul): a Biker Babies order that was silently dropped

Before the brand guard (21 Jul 2026), every brand's `stripe-webhook` processed every session on the shared Stripe account.

- `EB21KP20` (Sticker Set 3, £14.45, an internal test from `contact@themetavision.co.uk`) was almost certainly a Biker Babies
  checkout: BB was the only brand besides Cats On Crack and The Fuglys with a Sticker Set 3, and both of those stores
  refused it (the store a session really came from accepts it).
- This repo then had a stale `netlify/functions/stripe-webhook.mjs` beside the real `stripe-webhook.js`. The stale one reads
  basket data from `metadata.item_count`, which the checkout no longer sends, so it found "no items" and returned 200 with no
  email, no order log and no Printful order. The Cats On Crack and Fuglys webhooks tried it in their stores and failed.
- Nothing was ever placed; internal test, nothing owed. The record logged in error in **Cats On Crack's** Sanity is kept
  and relabelled there (`status: other-brand`, 18 Oct).
- Fixed on 21 Jul (`a3d0310`: brand guard + stale `.mjs` duplicates removed). Added now, as a second lock: see below.

### Own-store check and confirm rule in the webhook (branch `feat/margin-delivery`)

- Before placing a Printful order, `stripe-webhook.cjs` asks `GET /store/variants/{id}` for every line with the
  store-scoped `PRINTFUL_API_KEY`: 200 only for this store's variants, 404 for another store's. If any line isn't ours, or
  the check fails, **nothing is ordered**: the merchant alert says NOT OUR VARIANT with the ids, and the order log gets
  `status: fulfilment-failed` and the reason in `failureReason`.
- `?confirm=` is always explicit: `true` only when `PRINTFUL_AUTO_CONFIRM` is exactly `'true'` (production context only)
  AND the payment is live. Every Stripe test-mode payment is a Printful **draft**, logged with `test: true` and a `[TEST]`
  alert.
- Tests: `tests/own-store-check.test.mjs`.

### A2. Delivery tied to the destination (branch `feat/margin-delivery`)

Before: all five delivery rates were offered to every buyer, so an overseas buyer could pick UK Standard (£6.95).

- `src/lib/shipping-regions.mjs`: regions and rates (unchanged: UK £6.95, free from £75; Europe £9.95; USA/Canada £10.95;
  Australia/NZ/Japan/Brazil £11.95; Rest of World £14.95) and the same 76 countries. Identical in all four IP sites.
- Cart drawer: "Delivering to" country picker (remembered on the device under `bikerbabies-delivery-country`, guessed from
  the browser language), the delivery line and total for that country, the free-UK bar only for GB, and a warning (with
  checkout disabled) for lines Printful won't ship there.
- `create-checkout.cjs`: requires the country; refuses unknown ones (400) and lines Printful won't ship there (422);
  Stripe gets `allowed_countries: [country]` and only that region's rate; `metadata.delivery_country`.
- `src/data/ship-to.json`: countries refused per productType, generated from Printful's own answers. Regenerate after any
  range change:
  ```powershell
  cd C:\Users\chris\Projects\printful-sync
  node --env-file=.env probe-ship-to.mjs catsoncrack labrats thefuglys bikerbabies --extra=585,19   # ~25 min, quotes only
  node export-ship-to.mjs bikerbabies C:\Users\chris\Projects\bikerbabies\src\data\ship-to.json
  ```
- What the probe found (18 Oct): **Brazil** fails for every Printful product (Printful needs the recipient's CPF/CNPJ and
  the checkout doesn't collect it), so Printful lines are refused for BR; wall art (in-house) still ships there.
  **Ukraine** is refused for adult apparel, the kids long sleeve (#511) and the baby grow (#843); kids tees, kids hoodies,
  socks, stickers, the #585 tumbler and the mug ship there.
- Size guide: the mug replaces the can glass.
- Tests: `tests/delivery-destination.test.mjs`.

### Previews: test payments and draft catalogue

- **Stripe TEST values** in `deploy-preview` and `branch-deploy` only, so preview checkouts are test payments. Production
  keeps the live values. Set with `scripts\set-stripe-test.ps1` (refuses anything but `rk_test_`/`sk_test_` and
  `whsec_`, delete-then-recreate as secrets, stops if production's value ids change). Needs a TEST-mode webhook endpoint
  in Stripe for the preview URL, event `checkout.session.completed`.
  Production value ids before (18 Oct): `STRIPE_SECRET_KEY` `6fefc75d`, `STRIPE_WEBHOOK_SECRET` `abd02011`.
- **Draft catalogue on previews:** `SANITY_PERSPECTIVE=previewDrafts` is set in `deploy-preview` and `branch-deploy` only
  (18 Oct), so a preview build and its checkout read Sanity drafts (with `SANITY_API_TOKEN`, present in both contexts);
  production reads published.
- **`PRINTFUL_AUTO_CONFIRM=true`** is set in the `production` context only (18 Oct). The code on `main` before this branch
  doesn't read it, so it takes effect when the branch is merged: from then on live orders are confirmed automatically
  (today's code creates Printful drafts).

### A3. Pin badge sets (#660)

Printful has no UK/EU badge blank (#660 is its only one, US-stocked). 30% on GB would need £20.50 for a set of five, against
£5–£10 in the market. Dropped. Sanity: `product-badge-set-1` … `-4`; Printful: 437509825, 437509910, 437509916, 437509930.

---

## Part B: drinkware

Config: `printful-sync/brands/bikerbabies.config.mjs`.

| Garment | Blank | Price | Notes |
|---|---|---|---|
| `tumbler` | #585 Stainless Steel Tumbler 20 oz, White (EU). Black was created and then removed (18 Oct, Alan): the 35 Black sync variants deleted with `remove-colour.mjs bikerbabies tumbler Black --apply`, product ids unchanged | £32.95 | `externalKey: tumbler585` (new products sit beside #909's until those go). Printed on both sides, as Dotty's: the design twice, at ¼ and ¾ of the 2776×2374 wrap, each in a 1250×1450 box (`make-mug-wraps.mjs --kind=tumbler` → `designs.tumblerPrintFileUrl`); images: Left, "Printed on both sides", Right |
| `mug` | #19 White Glossy Mug 11 oz (UK + EU) | £12.95 | design twice, at ¼ and ¾ of the 2700×1050 wrap (`make-mug-wraps.mjs` → `designs.mugPrintFileUrl`); images: Front, "Printed on both sides", Handle on Left |
| `glass` | #690 | — | removed from the config |

Steps done (18–19 Oct 2026, printful-sync):

1. Mockup check before creating anything (`mockup-check.mjs`, Mockup Generator, no products): the two-sided tumbler (Left and
   Right) and the mug (Front and Handle on Left) on amara-built-different. Images: `printful-sync/mockup-checks/bikerbabies/`.
2. Wraps for all 35 designs uploaded to the Sanity CDN: `make-mug-wraps.mjs bikerbabies --kind=mug` and `--kind=tumbler`.
3. Printful products created in batches of 6 (`run-batches.ps1 -Brand bikerbabies -Stage printful -Flags "--types=tumbler,mug"`,
   waiting whenever printful-sync was busy): one #585 tumbler and one mug per design, 70 products.
   `store-check.mjs bikerbabies tumbler585,mug`: every design has one of each, no duplicate external ids.
   The manifest was missing arjun-think-fast: read back from Printful with `adopt` (creates nothing).
4. Pin sets: drafts with `active: false` (`draft-inactive.mjs`) for the 4 pin sets (`product-badge-set-1` … `-4`; Printful 437509825, 437509910, 437509916, 437509930). No unfinished Printful orders.
5. Tumbler made **White only** (Alan, 18 Oct: low contrast on black): `remove-colour.mjs bikerbabies tumbler Black --apply`
   deleted the 35 Black sync variants (products kept); config and manifest updated.
6. Mockups for the new garments only, in small resumable runs (`next-mockups.ps1 -Brand bikerbabies -Count 3`, memory checked
   between runs): every tumbler has Left, "Printed on both sides" and Right; every mug Front, "Printed on both sides" and
   Handle on Left (Mockup Generator, re-hosted on the Sanity CDN).
7. Sanity **drafts** (`run-batches.ps1 -Brand bikerbabies -Stage sync -Flags "--types=tumbler,mug --drop-types=glass"`): on all 35 designs
   the tumbler is replaced by #585 (£32.95, White), the mug added (£12.95), the can glass removed; every other garment, all
   copy and images exactly as published. `verify-drafts.mjs bikerbabies tumbler,mug glass`: no problems, every variant id in the
   live store. Production still shows the published (old) catalogue; the deploy preview reads the drafts.
8. Size guide: tumbler 20 oz / 600 ml, 8.4″ (21.4 cm); mug 11 oz, 3.8″ (9.6 cm), from Printful's catalogue for #585 and #19.
9. Preview: https://deploy-preview-2--thebikerbabies.netlify.app. The checkout function refuses no country (400), an unknown one (400), a Printful item to Brazil
   or a tee to Ukraine (422), all before Stripe.

### Launch order, after Alan approves the preview (in this order, nothing earlier)

1. **Merge the PR** (`feat/margin-delivery`, Alan). Netlify rebuilds production from `main`: the new code against the old,
   published catalogue. It handles both: can glasses and badges still list and check out until their products go (tabs
   kept, empty tabs vanish; test "old and new catalogue both check out"), and a basket with no country set just shows the
   picker.
2. **Deploy the Studio schema** from `sanity/`: `npx sanity schema deploy` and `npx sanity deploy` (`other-brand` status,
   `test` flag).
3. **Publish the drafts**: `cd C:\Users\chris\Projects\printful-sync`, `node --env-file=.env publish-drafts.mjs bikerbabies --dry`,
   then without `--dry` (the designs + 4 inactive pin sets). Production then needs a rebuild to show them (Netlify:
   trigger deploy, or the next push to `main`).
4. **Check the live site**: a tumbler and a mug page (both-sides images), the basket country picker, a GB basket reaching
   Stripe with one rate and one country, merch tabs without Can Glasses or Badges.
5. **Only then delete the old products**, after `pins-report.mjs bikerbabies` shows no unfinished Printful orders: the
   #909 tumblers (`bikerbabies-<slug>-tumbler`), the #690 can glasses (`-glass`) and the 4 pin sets (437509825, 437509910,
   437509916, 437509930). The 4 `product-badge-set-*` docs stay in Sanity, inactive.
6. `store-check.mjs bikerbabies tumbler585,mug,tumbler,glass,pin` should then show 0 for tumbler, glass and pin.
7. Production env: `PRINTFUL_AUTO_CONFIRM=true` (production context only, set 18 Oct) makes live orders confirmed; without
   it they are Printful drafts to confirm by hand. Previews never confirm (test-mode payments are always drafts).

### After every preview test payment

Test-mode orders reach Printful as **drafts** (never confirmed) and the Sanity log as `test: true`. Delete them after each test:
`cd C:\Users\chris\Projects\printful-sync`, `node --env-file=.env delete-test-orders.mjs bikerbabies` (lists them), then
`... --apply` (deletes the Printful drafts and the test log records).

---

## Part C: Road History (new design, 19 Oct 2026)

Source: Printful File Library #989503178 (`Untitled-design.png`, 2400×2400, real alpha), the art on the old test product
#433474993 "Wyatt vs Pothole Tee". Kept as `Documents\The Biker Babies\Designs\Road History\Road History - main design (original).png`.
Wyatt (The Historian) vs Professor Pothole, checked against the Sanity character canon.

**Print master** (`Final Print Files\Road History.png`, also `printful-sync\print-files\bikerbabies\`), Alan's decisions:
- The AI-redrawn logo replaced by the official PNG (`public/images/the-biker-babies-logo.png`, same file as the brand-voice
  logo), fitted to the redraw: 572 px centred at (1200, 2044), alpha trimmed ~1 px, soft contact shadow.
- The book's spine gibberish removed (gold strokes masked, filled from the surrounding leather); bands kept.
- The floating V, X and M kept (Roman numerals, with the clock face on the road). No x4plus (already as sharp as the masters).

**Range** (printful-sync, scoped to `road-history`; the other designs untouched):
1. Hosted on the BB Sanity CDN and appended to `designs.bikerbabies.json` at `sortOrder` 35 (a one-off upload, not
   `upload-bikerbabies-designs.mjs`, which re-sorts every design by file name).
2. Wraps: `make-mug-wraps.mjs bikerbabies --kind=mug --only=road-history`, then `--kind=tumbler`.
3. Printful: `sync-products.mjs bikerbabies printful --only=road-history`: the same 11 products as every design
   (tumbler #585 White £32.95, mug #19 £12.95; tee, hoodie, tank, long sleeve, socks, kids tee/hoodie/long sleeve, baby grow
   at the usual prices). The tee has 96 variants, not 86: Printful now offers 4XL/5XL in Azalea, Cardinal, Carolina Blue,
   Dark Chocolate and Sand, on the usual size ladder. Store 396 → 407 products.
4. Mockups: `sync-products.mjs bikerbabies mockups --only=road-history --strict` (every garment real mockups; tumbler
   Left / both sides / Right, mug Front / both sides / Handle on Left).
5. Sanity **draft** `drafts.product-road-history` (`sync-products.mjs ... sanity --only=...`), then copy, `active: true`,
   `sortOrder: 35`. `verify-drafts.mjs`: every variant id in the live store.

**Display names** (Alan): "Mostwanted" → "Most Wanted", "Out Thunk" → "Out-Thunk": drafts of `product-mostwanted` and
`product-out-thunk` (name only), `designs.bikerbabies.json`, and the 22 Printful product names (no variant changes).

### Launch order, after Alan approves the preview

1. `publish-drafts.mjs bikerbabies --dry`, then without `--dry` (3 drafts: the new design and the two names).
2. Rebuild production (Netlify: trigger deploy of `main`), then check live: /merch lists Road History, its product page
   shows £32.95 and £12.95, "Most Wanted" and "Out-Thunk" names.
3. Delete the old test product **#433474993** (by id, after `pins-report.mjs bikerbabies` shows no unfinished orders), then
   `store-check.mjs bikerbabies` (406 products) and `check-live-ids.mjs bikerbabies` (variant ids on the active products all live).

**Renamed before launch** (Alan, 19 Oct): multi-character designs use the slogan only, so "Wyatt Road History" became
**"Road History"** (slug `road-history`, SEO title "Road History | The Biker Babies"). Because Printful external ids come
from the slug, the 11 unpublished `bikerbabies-wyatt-road-history-*` products were deleted by id (no orders) and recreated
as `bikerbabies-road-history-*` (same print file and wraps, strict mockups again), the old draft deleted and a new
`drafts.product-road-history` seeded. Print master renamed `Road History.png`.
