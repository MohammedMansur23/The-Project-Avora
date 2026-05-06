'use client'
import { Montserrat, Cormorant_Garamond } from 'next/font/google'
import './globals.css'
import Navbar from '../components/layout/Navbar'
import { AuthProvider } from '../lib/AuthContext'
import { CartProvider } from '../lib/CartContext'
import { useAuth } from '../lib/AuthContext'
import { useCart } from '../lib/CartContext'
import { useState } from 'react'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-montserrat',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-cormorant',
})

function FloatingButtons() {
  const { user } = useAuth()
  const { cart, wishlist, removeFromCart, toggleWishlist, cartTotal } = useCart()
  const [cartOpen, setCartOpen] = useState(false)
  const [wishlistOpen, setWishlistOpen] = useState(false)

  if (!user) return null

  return (
    <>
      {/* FLOATING WISHLIST BUTTON */}
      <button onClick={() => setWishlistOpen(true)} style={{
        position: 'fixed', bottom: '2rem', left: '2rem',
        background: '#C9A84C', color: '#0a0a0a',
        border: 'none', width: '56px', height: '56px',
        borderRadius: '50%', fontSize: '1.3rem',
        cursor: 'pointer', zIndex: 200,
        boxShadow: '0 4px 20px rgba(58,46,13,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        🧺
        {wishlist.length > 0 && (
          <span style={{
            position: 'absolute', top: '-4px', right: '-4px',
            background: '#0a0a0a', color: '#C9A84C',
            fontSize: '0.55rem', fontWeight: '700',
            width: '20px', height: '20px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{wishlist.length}</span>
        )}
      </button>

      {/* FLOATING CART BUTTON */}
      <button onClick={() => setCartOpen(true)} style={{
        position: 'fixed', bottom: '2rem', right: '2rem',
        background: '#C9A84C', color: '#0a0a0a',
        border: 'none', width: '56px', height: '56px',
        borderRadius: '50%', fontSize: '1.3rem',
        cursor: 'pointer', zIndex: 200,
        boxShadow: '0 4px 20px rgba(58,46,13,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        🛒
        {cart.length > 0 && (
          <span style={{
            position: 'absolute', top: '-4px', right: '-4px',
            background: '#0a0a0a', color: '#C9A84C',
            fontSize: '0.55rem', fontWeight: '700',
            width: '20px', height: '20px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{cart.length}</span>
        )}
      </button>

      {/* CART PANEL */}
<div
  onClick={() => setCartOpen(false)}
  style={{
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.5)',
    zIndex: 400,
    opacity: cartOpen ? 1 : 0,
    pointerEvents: cartOpen ? 'all' : 'none',
    transition: 'opacity 0.5s ease',
  }}>
  <div
    onClick={e => e.stopPropagation()}
    style={{
      position: 'absolute', top: 0, right: 0, bottom: 0,
      width: '400px', background: '#0a0a0a',
      borderLeft: '0.5px solid rgba(255,255,255,0.1)',
      display: 'flex', flexDirection: 'column',
      transform: cartOpen ? 'translateX(0)' : 'translateX(100%)',
      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    }}>
    <div style={{
      padding: '1.5rem',
      borderBottom: '0.5px solid rgba(255,255,255,0.08)',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      <div>
        <p style={{ fontSize: '0.55rem', letterSpacing: '0.25em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
          {cart.length} item{cart.length !== 1 ? 's' : ''}
        </p>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.3rem', color: '#fafafa', fontWeight: '400' }}>Your Cart</h2>
      </div>
      <button onClick={() => setCartOpen(false)} style={{ background: 'none', border: 'none', color: '#fafafa', fontSize: '1.4rem', cursor: 'pointer' }}>✕</button>
    </div>

    <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
      {cart.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</div>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem' }}>Your cart is empty.</p>
        </div>
      ) : cart.map(item => (
        <div key={item.id} style={{
          display: 'flex', alignItems: 'center', gap: '1rem',
          padding: '1rem', border: '0.5px solid rgba(255,255,255,0.08)',
          marginBottom: '0.75rem', background: 'rgba(255,255,255,0.02)',
        }}>
          <div style={{
            width: '56px', height: '56px', background: '#1a1a1a',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.8rem', flexShrink: 0,
          }}>{item.emoji}</div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '0.55rem', color: '#C9A84C', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>{item.store}</p>
            <p style={{ fontSize: '0.78rem', color: '#fafafa', fontWeight: '500', marginBottom: '0.3rem' }}>{item.name}</p>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: '0.9rem', color: '#fafafa' }}>₦{item.price.toLocaleString()}</p>
          </div>
          <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '1rem', cursor: 'pointer' }}>✕</button>
        </div>
      ))}
    </div>

    {cart.length > 0 && (
      <div style={{ padding: '1rem 1.5rem', borderTop: '0.5px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Total</span>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#fafafa' }}>₦{cartTotal.toLocaleString()}</span>
        </div>
        <button style={{
          width: '100%', background: '#C9A84C', color: '#0a0a0a',
          border: 'none', padding: '0.8rem', fontSize: '0.6rem',
          letterSpacing: '0.2em', textTransform: 'uppercase',
          fontWeight: '700', cursor: 'pointer',
        }}>Checkout</button>
      </div>
    )}
  </div>
</div>

      {/* WISHLIST PANEL */}
<div
  onClick={() => setWishlistOpen(false)}
  style={{
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.5)',
    zIndex: 400,
    opacity: wishlistOpen ? 1 : 0,
    pointerEvents: wishlistOpen ? 'all' : 'none',
    transition: 'opacity 0.3s ease',
  }}>
  <div
    onClick={e => e.stopPropagation()}
    style={{
      position: 'absolute', top: 0, left: 0, bottom: 0,
      width: '400px', background: '#0a0a0a',
      borderRight: '0.5px solid rgba(255,255,255,0.1)',
      display: 'flex', flexDirection: 'column',
      transform: wishlistOpen ? 'translateX(0)' : 'translateX(-100%)',
      transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
    }}>
    <div style={{
      padding: '1.5rem',
      borderBottom: '0.5px solid rgba(255,255,255,0.08)',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      <div>
        <p style={{ fontSize: '0.55rem', letterSpacing: '0.25em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Saved Items</p>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.3rem', color: '#fafafa', fontWeight: '400' }}>Your Wishlist</h2>
      </div>
      <button onClick={() => setWishlistOpen(false)} style={{ background: 'none', border: 'none', color: '#fafafa', fontSize: '1.4rem', cursor: 'pointer' }}>✕</button>
    </div>

    <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
      {wishlist.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>♡</div>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧺</div>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem' }}>No saved items yet.</p>
          <p style={{ color: 'rgba(255, 255, 255, 0.55)', fontSize: '0.65rem', marginTop: '0.5rem' }}>Tap {<svg width="10" height="10" viewBox="0 0 24 19"
                fill="#ffffff8c" stroke="#ffffff8c" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06
                  -1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78
                  -7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
              </svg>} on any product to save it here.</p>
        </div>
      ) : wishlist.map(item => (
        <div key={item.id} style={{
          display: 'flex', alignItems: 'center', gap: '1rem',
          padding: '1rem', border: '0.5px solid rgba(255,255,255,0.08)',
          marginBottom: '0.75rem', background: 'rgba(255,255,255,0.02)',
        }}>
          <div style={{
            width: '56px', height: '56px', background: '#1a1a1a',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.8rem', flexShrink: 0,
          }}>{item.emoji}</div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '0.55rem', color: '#C9A84C', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>{item.store}</p>
            <p style={{ fontSize: '0.78rem', color: '#fafafa', fontWeight: '500', marginBottom: '0.3rem' }}>{item.name}</p>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: '0.9rem', color: '#fafafa' }}>₦{item.price.toLocaleString()}</p>
          </div>
          <button onClick={() => toggleWishlist(item)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '1rem', cursor: 'pointer' }}>✕</button>
        </div>
      ))}
    </div>

    {wishlist.length > 0 && (
      <div style={{ padding: '1rem 1.5rem', borderTop: '0.5px solid rgba(255,255,255,0.08)' }}>
        <button onClick={() => {
          wishlist.forEach(item => addToCart(item))
          setWishlistOpen(false)
        }} style={{
          width: '100%', background: '#C9A84C', color: '#0a0a0a',
          border: 'none', padding: '0.8rem', fontSize: '0.6rem',
          letterSpacing: '0.2em', textTransform: 'uppercase',
          fontWeight: '700', cursor: 'pointer',
        }}>Add All to Cart</button>
      </div>
    )}
  </div>
</div>
    </>
  )
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${cormorant.variable}`}>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            {children}
            <FloatingButtons />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}