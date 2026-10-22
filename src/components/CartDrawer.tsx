// Display only: the cart keeps the original image URL; productImg resizes it via the CDN.
import { productImg } from '../lib/sanityImage';
import { useStore } from '@nanostores/react';
import { useState, useEffect } from 'react';
import { cartItems, cartOpen, cartTotal, qualifiesForFreeShipping, amountToFreeShipping, FREE_SHIPPING_THRESHOLD, addToCart, removeFromCart, updateQuantity, MAX_QTY_PER_LINE, toggleCart, clearCart } from '../lib/cart';
// @ts-ignore — shared CommonJS pricing module (no .d.ts; resolved by Vite at build)
import { isWallArt, artworkVariantLabel } from '../lib/artwork-pricing.mjs';
// @ts-ignore — shared ES module (no .d.ts); the checkout function uses the same one
import { SHIPPING_REGIONS, deliveryPence, unshippableLines, guessCountry } from '../lib/shipping-regions.mjs';
import SHIP_TO from '../data/ship-to.json';

// The delivery country, remembered on this device (a convenience only; the
// checkout is what enforces it).
const COUNTRY_KEY = 'bikerbabies-delivery-country';
function initialCountry(): string {
  try {
    const saved = localStorage.getItem(COUNTRY_KEY);
    if (saved && SHIPPING_REGIONS.some((r: any) => r.countries.includes(saved))) return saved;
  } catch (_) { /* storage blocked: fall through */ }
  return guessCountry(typeof navigator !== 'undefined' ? navigator.languages : []) || 'GB';
}

// Country names in English, A–Z within each region, for the picker.
function countryOptions() {
  let names: Intl.DisplayNames | null = null;
  try { names = new Intl.DisplayNames(['en-GB'], { type: 'region' }); } catch (_) { /* old browser: codes */ }
  const label = (cc: string) => (cc === 'XK' ? 'Kosovo' : (names && names.of(cc)) || cc);
  return SHIPPING_REGIONS.map((r: any) => ({
    name: r.name,
    countries: r.countries.map((cc: string) => ({ cc, label: label(cc) })).sort((a: any, b: any) => a.label.localeCompare(b.label)),
  }));
}

/* Brand tokens — read from the site's CSS variables (defined in Layout.astro)
   with hex fallbacks, so this component ports across IP brands by inheriting
   each site's palette instead of hardcoding colours. */
const ACCENT = 'var(--color-orange, #ff6b00)';      // brand accent (buttons/borders)
const HIGHLIGHT = 'var(--color-gold, #ffd700)'; // headings/prices
const BG = 'var(--color-bg-card, #13131e)';
const TEXT = 'var(--color-text, #f0f0f0)';
const HEADING_FONT = "'Bebas Neue', sans-serif";
const BODY_FONT = "'Inter', sans-serif";

export default function CartDrawer() {
  const items = useStore(cartItems);
  const isOpen = useStore(cartOpen);
  const total = useStore(cartTotal);
  const freeShipping = useStore(qualifiesForFreeShipping);
  const toFreeShipping = useStore(amountToFreeShipping);
  const progressPct = Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100);
  const [confirmClear, setConfirmClear] = useState(false);
  // 'GB' on the server render; the saved or guessed country once mounted.
  const [country, setCountry] = useState('GB');
  const [regions] = useState(countryOptions);
  useEffect(() => { setCountry(initialCountry()); }, []);
  function chooseCountry(cc: string) {
    setCountry(cc);
    try { localStorage.setItem(COUNTRY_KEY, cc); } catch (_) { /* storage blocked: keep it for this visit */ }
  }
  const deliveryGbp = (deliveryPence(country, Math.round(total * 100)) ?? 0) / 100;
  const cantShip = unshippableLines(items, country, SHIP_TO);
  const countryName = regions.flatMap((r: any) => r.countries).find((c: any) => c.cc === country)?.label || country;

  /* Wall-art PDP uses a define:vars (inline) script that can't import the store,
     so it dispatches a window 'add-to-cart' CustomEvent. This globally-mounted
     drawer catches it and maps the detail onto a Biker Babies cart line. Garment
     PDPs call addToCart() directly and don't fire this event, so nothing doubles
     up. Robust to either id/title or productId/name shaped details. */
  useEffect(() => {
    function handleAdd(e: any) {
      const d = (e && e.detail) || {};
      addToCart({
        productId: d.productId || d.id,
        name: d.name || d.title || 'Item',
        price: Number(d.price) || 0,
        size: d.size || '',
        colour: d.colour || '',
        image: d.image || '',
        productType: d.productType || '',
        format: d.format,
      }, d.quantity);
    }
    window.addEventListener('add-to-cart', handleAdd as EventListener);
    return () => window.removeEventListener('add-to-cart', handleAdd as EventListener);
  }, []);

  useEffect(() => { if (!isOpen || items.length === 0) setConfirmClear(false); }, [isOpen, items.length]);

  async function handleCheckout() {
    if (items.length === 0 || cantShip.length > 0) return;
    try {
      const res = await fetch('/.netlify/functions/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            /* id + productType let create-checkout resolve the exact Printful
               sync variant (id = product-{slug}-{productType}, set by the PDP).
               Wall-art lines carry productType:'wallart' + format so checkout
               re-prices them server-side from artwork-pricing.mjs. */
            id: item.productId,
            title: item.name,
            name: item.name,
            productType: item.productType || '',
            price: item.price,
            size: item.size,
            colour: item.colour || '',
            format: item.format || '',
            image: item.image || '',
            quantity: item.quantity,
          })),
          country,
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else if (data.error) {
        const named = Array.isArray(data.items) && data.items.length ? `\n\n${data.items.join('\n')}` : '';
        alert(`Checkout failed: ${data.error}${named}`);
      }
      else alert('Checkout failed.');
    } catch (err) { console.error(err); alert('Something went wrong.'); }
  }

  function handleClear() {
    if (items.length === 0) return;
    setConfirmClear(true);
  }
  function confirmClearYes() { clearCart(); setConfirmClear(false); }

  return (
    <>
      {isOpen && <div onClick={toggleCart} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:998 }} />}

      <div style={{ position:'fixed', top:0, right:0, bottom:0, width:'400px', maxWidth:'90vw', background:BG, zIndex:999, transform:isOpen?'translateX(0)':'translateX(100%)', transition:'transform 0.3s ease', display:'flex', flexDirection:'column', borderLeft:`2px solid ${ACCENT}` }}>
        <div style={{ padding:'24px', borderBottom:'1px solid rgba(255,255,255,0.1)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <h2 style={{ fontFamily:HEADING_FONT, fontWeight:700, fontSize:'20px', letterSpacing:'1px', textTransform:'uppercase' as const, color:HIGHLIGHT, margin:0 }}>Your Cart</h2>
          <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
            {items.length > 0 && (
              <button onClick={handleClear} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.45)', cursor:'pointer', fontFamily:HEADING_FONT, fontWeight:700, fontSize:'11px', letterSpacing:'1.5px', textTransform:'uppercase' as const, padding:0, textDecoration:'underline', textUnderlineOffset:'3px' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; }}>
                Clear cart
              </button>
            )}
            <button onClick={toggleCart} aria-label="Close cart" style={{ background:'none', border:'none', color:'rgba(255,255,255,0.4)', cursor:'pointer', fontSize:'1.5rem' }}>{'\u2715'}</button>
          </div>
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:'16px 24px' }}>
          {items.length === 0 ? (
            <p style={{ color:'rgba(245,245,245,0.4)', textAlign:'center', padding:'48px 0', fontFamily:BODY_FONT }}>Your cart is empty. Gear up and ride!</p>
          ) : items.map((item) => (
            <div key={`${item.productId}-${item.size}-${item.colour}`} style={{ display:'flex', gap:'16px', padding:'16px 0', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
              {item.image && <img src={productImg(item.image, 128)} width={64} height={64} alt={item.name} style={{ width:'64px', height:'64px', objectFit:'cover', borderRadius:'4px' }} />}
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:HEADING_FONT, fontWeight:700, fontSize:'15px', color:HIGHLIGHT, letterSpacing:'1px', textTransform:'uppercase' as const }}>{item.name}</div>
                <div style={{ fontSize:'12px', color:'rgba(245,245,245,0.4)', marginTop:'2px' }}>
                  {isWallArt(item)
                    ? artworkVariantLabel(item.format || '', item.size)
                    : `${item.size}${item.colour ? ` / ${item.colour}` : ''}`}
                </div>
                {/* − stops at 1 rather than removing the line, so tapping it a few
                    times too many can't empty the basket; the ✕ removes it. */}
                <div style={{ display:'flex', alignItems:'center', gap:'8px', marginTop:'8px' }} role="group" aria-label={`Quantity of ${item.name}`}>
                  <button onClick={() => updateQuantity(item.productId, item.size, item.colour, item.quantity - 1)} disabled={item.quantity <= 1} aria-label={`Decrease quantity of ${item.name}`} style={{ background:'rgba(255,255,255,0.06)', border:`1px solid ${ACCENT}`, color:TEXT, width:'28px', height:'28px', cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer', opacity: item.quantity <= 1 ? 0.35 : 1, borderRadius:'4px' }}>{'\u2212'}</button>
                  <span aria-live="polite" style={{ color:TEXT, fontSize:'14px', minWidth:'20px', textAlign:'center' as const }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, item.size, item.colour, item.quantity + 1)} disabled={item.quantity >= MAX_QTY_PER_LINE} aria-label={`Increase quantity of ${item.name}`} style={{ background:'rgba(255,255,255,0.06)', border:`1px solid ${ACCENT}`, color:TEXT, width:'28px', height:'28px', cursor: item.quantity >= MAX_QTY_PER_LINE ? 'not-allowed' : 'pointer', opacity: item.quantity >= MAX_QTY_PER_LINE ? 0.35 : 1, borderRadius:'4px' }}>+</button>
                  <span style={{ marginLeft:'auto', color:TEXT, fontWeight:600 }}>{'\u00A3'}{(item.price * item.quantity).toFixed(2)}</span>
                </div>
                {item.quantity >= MAX_QTY_PER_LINE && (
                  <div style={{ fontSize:'11px', color:'rgba(245,245,245,0.5)', marginTop:'6px' }}>Max {MAX_QTY_PER_LINE} per item. Need more? Get in touch.</div>
                )}
              </div>
              <button onClick={() => removeFromCart(item.productId, item.size, item.colour)} aria-label={`Remove ${item.name}`} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.2)', cursor:'pointer', fontSize:'1rem', alignSelf:'flex-start' }}>{'\u2715'}</button>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div style={{ padding:'24px', borderTop:'1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ marginBottom:'14px' }}>
              <label htmlFor="bikerbabies-delivery-country" style={{ display:'block', fontFamily:HEADING_FONT, fontWeight:700, fontSize:'11px', letterSpacing:'1.5px', textTransform:'uppercase' as const, color:'rgba(255,255,255,0.55)', margin:'0 0 6px' }}>Delivering to</label>
              {/* The open list is drawn natively (white on Chrome/Edge for Windows) and the
                  options inherit the white text, so colour them explicitly. */}
              <style>{`
                #bikerbabies-delivery-country { color-scheme: dark; }
                #bikerbabies-delivery-country optgroup { background: ${BG}; color: ${ACCENT}; font-weight: 700; font-style: normal; }
                #bikerbabies-delivery-country option { background: ${BG}; color: ${TEXT}; font-weight: 400; }
                #bikerbabies-delivery-country option:checked { background: ${ACCENT}; color: #0a0a14; font-weight: 700; }
              `}</style>
              <select id="bikerbabies-delivery-country" value={country} onChange={(e) => chooseCountry(e.target.value)}
                style={{ width:'100%', padding:'10px 12px', background:'rgba(255,255,255,0.06)', color:TEXT, border:`1px solid ${ACCENT}`, borderRadius:'4px', fontFamily:BODY_FONT, fontSize:'14px' }}>
                {regions.map((r: any) => (
                  <optgroup key={r.name} label={r.name}>
                    {r.countries.map((c: any) => <option key={c.cc} value={c.cc}>{c.label}</option>)}
                  </optgroup>
                ))}
              </select>
            </div>
            {cantShip.length > 0 && (
              <div role="alert" style={{ background:'rgba(255,68,102,0.12)', border:'1px solid #ff4466', borderRadius:'4px', color:TEXT, fontFamily:BODY_FONT, fontSize:'12px', lineHeight:1.5, padding:'10px 12px', margin:'0 0 14px' }}>
                <strong>We can&rsquo;t deliver {cantShip.length === 1 ? 'this' : 'these'} to {countryName}:</strong>{' '}
                {cantShip.map((it: any) => it.name).join(', ')}. Remove {cantShip.length === 1 ? 'it' : 'them'} to check out.
              </div>
            )}
            {country === 'GB' && <div style={{ marginBottom:'16px', padding:'12px 14px', background: freeShipping ? 'rgba(255,107,0,0.10)' : 'rgba(255,255,255,0.04)', border:`1px solid ${freeShipping ? ACCENT : 'rgba(255,255,255,0.12)'}`, borderRadius:'8px' }}>
              <p style={{ fontFamily:HEADING_FONT, fontWeight:700, fontSize:'12px', letterSpacing:'1px', textTransform:'uppercase' as const, textAlign:'center' as const, margin:'0 0 8px', color: freeShipping ? HIGHLIGHT : '#cfcfcf' }}>
                {freeShipping
                  ? "\uD83C\uDF89 You've unlocked FREE UK delivery!"
                  : `Add \u00A3${toFreeShipping.toFixed(2)} more for FREE UK delivery`}
              </p>
              <div style={{ height:'5px', background:'rgba(255,255,255,0.12)', borderRadius:'3px', overflow:'hidden' as const }}>
                <div style={{ height:'100%', width:`${progressPct}%`, background:`linear-gradient(90deg, ${ACCENT}, ${HIGHLIGHT})`, borderRadius:'3px', transition:'width 0.4s ease' }} />
              </div>
            </div>}
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px', fontFamily:BODY_FONT, fontSize:'13px', color:'rgba(245,245,245,0.6)' }}>
              <span>Items</span><span>{'\u00A3'}{total.toFixed(2)}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'10px', fontFamily:BODY_FONT, fontSize:'13px', color:'rgba(245,245,245,0.6)' }}>
              <span>Delivery to {countryName}</span><span>{deliveryGbp === 0 ? 'FREE' : `\u00A3${deliveryGbp.toFixed(2)}`}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'16px', fontFamily:HEADING_FONT, fontWeight:700, fontSize:'18px', letterSpacing:'1px', textTransform:'uppercase' as const, color:TEXT }}>
              <span>Total</span><span>{'\u00A3'}{(total + deliveryGbp).toFixed(2)}</span>
            </div>
            <p style={{ color:'rgba(255,255,255,0.45)', fontFamily:BODY_FONT, fontSize:'11px', lineHeight:1.5, textAlign:'center' as const, margin:'0 0 12px' }}>
              Payments are taken by The Metavision Multimedia Ltd and show on your statement as THE METAVISION.
            </p>
            <button onClick={handleCheckout} disabled={cantShip.length > 0} style={{ width:'100%', background:ACCENT, color:'#0a0a0a', border:'none', padding:'14px', fontFamily:HEADING_FONT, fontWeight:700, fontSize:'15px', letterSpacing:'1.5px', textTransform:'uppercase' as const, cursor: cantShip.length > 0 ? 'not-allowed' : 'pointer', opacity: cantShip.length > 0 ? 0.4 : 1, borderRadius:'4px', transition:'all 0.25s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(1.15)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              Checkout
            </button>
          </div>
        )}
      </div>

      {confirmClear && (
        <div onClick={() => setConfirmClear(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.82)', zIndex:2100, display:'flex', alignItems:'center', justifyContent:'center', padding:'24px' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ position:'relative', width:'360px', maxWidth:'90vw', background:BG, border:`2px solid ${ACCENT}`, borderRadius:'10px', padding:'34px 30px 30px', textAlign:'center' as const, boxShadow:`0 24px 60px rgba(0,0,0,0.6)` }}>
            <span style={{ position:'absolute', top:0, right:0, background:ACCENT, color:'#0a0a14', fontFamily:HEADING_FONT, fontWeight:700, fontSize:'0.8rem', letterSpacing:'2px', padding:'6px 14px', textTransform:'uppercase' as const, borderRadius:'0 8px 0 10px' }}>Whoa!</span>
            <h3 style={{ fontFamily:HEADING_FONT, fontSize:'2rem', letterSpacing:'1px', color:HIGHLIGHT, margin:'0 0 8px', textTransform:'uppercase' as const }}>Empty the garage?</h3>
            <div style={{ width:'48px', height:'3px', background:ACCENT, margin:'0 auto 16px' }} />
            <p style={{ color:'#cfcfcf', fontFamily:BODY_FONT, fontSize:'14px', lineHeight:1.6, margin:'0 0 26px' }}>
              This rolls all {items.length} {items.length === 1 ? 'item' : 'items'} out of your cart. No backsies!
            </p>
            <div style={{ display:'flex', gap:'12px' }}>
              <button onClick={() => setConfirmClear(false)} style={{ flex:1, padding:'12px', background:'transparent', color:TEXT, border:`1px solid ${ACCENT}`, borderRadius:'8px', fontFamily:HEADING_FONT, fontWeight:700, fontSize:'1.05rem', letterSpacing:'1.5px', textTransform:'uppercase' as const, cursor:'pointer' }}>Keep it</button>
              <button onClick={confirmClearYes} style={{ flex:1, padding:'12px', background:ACCENT, color:'#0a0a14', border:'none', borderRadius:'8px', fontFamily:HEADING_FONT, fontWeight:700, fontSize:'1.05rem', letterSpacing:'1.5px', textTransform:'uppercase' as const, cursor:'pointer' }}>Clear it</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
