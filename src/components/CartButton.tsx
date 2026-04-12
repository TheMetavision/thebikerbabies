import { useStore } from '@nanostores/react';
import { cartCount, toggleCart } from '../lib/cart';

export default function CartButton() {
  const count = useStore(cartCount);

  return (
    <button
      onClick={toggleCart}
      aria-label={`Shopping cart with ${count} items`}
      style={{
        position: 'relative',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#e0e0e0',
        transition: 'color 0.2s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.color = '#ff6b00'; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = '#e0e0e0'; }}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>

      {count > 0 && (
        <span
          style={{
            position: 'absolute',
            top: '2px',
            right: '0px',
            background: '#ff6b00',
            color: '#fff',
            fontSize: '11px',
            fontWeight: 700,
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
}
