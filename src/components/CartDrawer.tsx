import { useStore } from '@nanostores/react';
import { cartItems, cartOpen, cartTotal, cartCount, removeFromCart, updateQuantity, toggleCart } from '../lib/cart';

export default function CartDrawer() {
  const items = useStore(cartItems);
  const isOpen = useStore(cartOpen);
  const total = useStore(cartTotal);
  const count = useStore(cartCount);

  async function handleCheckout() {
    if (items.length === 0) return;
    try {
      const res = await fetch('/.netlify/functions/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            name: item.name,
            price: item.price,
            size: item.size,
            colour: item.colour || '',
            image: item.image || '',
            quantity: item.quantity,
          })),
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url; else alert('Checkout failed.');
    } catch (err) { console.error(err); alert('Something went wrong.'); }
  }

  const orange = '#ff6b00';
  const bg = '#13131e';

  return (
    <>
      {isOpen && <div onClick={toggleCart} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:998 }} />}

      <div style={{ position:'fixed', top:0, right:0, bottom:0, width:'400px', maxWidth:'90vw', background:bg, zIndex:999, transform:isOpen?'translateX(0)':'translateX(100%)', transition:'transform 0.3s ease', display:'flex', flexDirection:'column', borderLeft:'2px solid rgba(255,107,0,0.3)' }}>
        <div style={{ padding:'24px', borderBottom:'1px solid rgba(255,255,255,0.08)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <h2 style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:'1.5rem', letterSpacing:'0.06em', color:'#ffd700', margin:0 }}>Your Cart</h2>
          <button onClick={toggleCart} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.4)', cursor:'pointer', fontSize:'1.5rem' }}>{'\u2715'}</button>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:'16px 24px' }}>
          {items.length === 0 ? (
            <p style={{ color:'#999', textAlign:'center', padding:'48px 0', fontFamily:"'Inter', sans-serif" }}>Your cart is empty. Gear up for the ride!</p>
          ) : items.map((item) => (
            <div key={`${item.productId}-${item.size}-${item.colour}`} style={{ display:'flex', gap:'16px', padding:'16px 0', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
              {item.image && <img src={item.image} alt={item.name} style={{ width:'64px', height:'64px', objectFit:'cover', borderRadius:'4px' }} />}
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:'1rem', color:'#f0f0f0', letterSpacing:'0.06em' }}>{item.name}</div>
                <div style={{ fontSize:'12px', color:'#999', marginTop:'2px' }}>{item.size}{item.colour ? ` / ${item.colour}` : ''}</div>
                <div style={{ display:'flex', alignItems:'center', gap:'8px', marginTop:'8px' }}>
                  <button onClick={() => updateQuantity(item.productId, item.size, item.colour, item.quantity - 1)} style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,107,0,0.15)', color:'#f0f0f0', width:'28px', height:'28px', cursor:'pointer', borderRadius:'4px' }}>{'\u2212'}</button>
                  <span style={{ color:'#f0f0f0', fontSize:'14px', minWidth:'20px', textAlign:'center' as const }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, item.size, item.colour, item.quantity + 1)} style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,107,0,0.15)', color:'#f0f0f0', width:'28px', height:'28px', cursor:'pointer', borderRadius:'4px' }}>+</button>
                  <span style={{ marginLeft:'auto', color:'#f0f0f0', fontWeight:600 }}>{'\u00A3'}{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
              <button onClick={() => removeFromCart(item.productId, item.size, item.colour)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.2)', cursor:'pointer', fontSize:'1rem', alignSelf:'flex-start' }}>{'\u2715'}</button>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <div style={{ padding:'24px', borderTop:'1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'16px', fontFamily:"'Bebas Neue', sans-serif", fontSize:'1.2rem', letterSpacing:'0.06em', color:'#f0f0f0' }}>
              <span>Total</span><span>{'\u00A3'}{total.toFixed(2)}</span>
            </div>
            <button onClick={handleCheckout} style={{ width:'100%', background:orange, color:'#fff', border:'none', padding:'14px', fontFamily:"'Bebas Neue', sans-serif", fontSize:'1rem', letterSpacing:'0.06em', cursor:'pointer', borderRadius:'4px', transition:'all 0.25s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#e05c00'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = orange; e.currentTarget.style.transform = 'translateY(0)'; }}>
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
