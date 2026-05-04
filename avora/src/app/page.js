'use client'
import { useState, useEffect } from 'react'

const PRODUCTS = [
  { id: 1, name: 'Jollof Rice & Chicken', store: "Mama Tee's Kitchen", price: 1500, category: 'Food & Drinks', emoji: '🍲', sponsored: true },
  { id: 2, name: 'Ankara Crop Top', store: 'Campus Threads', price: 4500, category: 'Fashion', emoji: '👗', sponsored: true },
  { id: 3, name: 'iPhone Charger (Fast)', store: 'TechZone Unilorin', price: 2800, category: 'Electronics', emoji: '📱', sponsored: true },
  { id: 4, name: '200L Anatomy Textbook', store: 'BookStore NG', price: 3500, category: 'Books', emoji: '📚', sponsored: false },
  { id: 5, name: 'Box Braids (Full Head)', store: 'Glamour by Sade', price: 7000, category: 'Beauty & Hair', emoji: '💇', sponsored: true },
  { id: 6, name: 'Phone Screen Repair', store: 'FixIt Fast', price: 5000, category: 'Repairs', emoji: '🔧', sponsored: false },
  { id: 7, name: 'Assignment Printing (20 pages)', store: 'QuickPrint Hub', price: 400, category: 'Printing', emoji: '📄', sponsored: true },
  { id: 8, name: 'Air Force 1 (Size 42)', store: 'Sole Brothers', price: 35000, category: 'Footwear', emoji: '👟', sponsored: true },
  { id: 9, name: 'Maths Tutoring (1hr)', store: 'SmartMinds', price: 2000, category: 'Tutoring', emoji: '🎓', sponsored: false },
  { id: 10, name: 'Laundry Service (per bag)', store: 'CleanUp Crew', price: 1500, category: 'Laundry', emoji: '🧺', sponsored: false },
  { id: 11, name: 'Used HP Laptop', store: 'S2S Listings', price: 85000, category: 'Second-hand', emoji: '♻️', sponsored: false },
  { id: 12, name: 'Passport Photo (4 copies)', store: 'Clicks Studio', price: 500, category: 'Photography', emoji: '📸', sponsored: true },
]

const CATEGORIES = [
  'All', 'Food & Drinks', 'Fashion', 'Electronics', 'Books',
  'Beauty & Hair', 'Repairs', 'Printing', 'Footwear',
  'Tutoring', 'Laundry', 'Photography', 'Second-hand',
]

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [hoveredId, setHoveredId] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [wishlistItems, setWishlistItems] = useState([])
  const [wishlistOpen, setWishlistOpen] = useState(false)
  const [toast, setToast] = useState(null)

  // Load cart and wishlist from localStorage on mount
  useEffect(() => {
    setCartItems(JSON.parse(localStorage.getItem('avora_cart') || '[]'))
    setWishlistItems(JSON.parse(localStorage.getItem('avora_wishlist') || '[]'))
  }, [])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const addToCart = (product) => {
    const existing = JSON.parse(localStorage.getItem('avora_cart') || '[]')
    const updated = [...existing, { ...product, cartId: Date.now() }]
    localStorage.setItem('avora_cart', JSON.stringify(updated))
    setCartItems(updated)
    showToast(`✅ ${product.name} added to cart`)
  }

  const removeFromCart = (cartId) => {
    const updated = cartItems.filter(i => i.cartId !== cartId)
    localStorage.setItem('avora_cart', JSON.stringify(updated))
    setCartItems(updated)
  }

  const addToWishlist = (product) => {
    const existing = JSON.parse(localStorage.getItem('avora_wishlist') || '[]')
    if (existing.find(i => i.id === product.id)) {
      showToast('Already in your wishlist!')
      return
    }
    const updated = [...existing, product]
    localStorage.setItem('avora_wishlist', JSON.stringify(updated))
    setWishlistItems(updated)
    showToast(`♡ ${product.name} saved to wishlist`)
  }

  const removeFromWishlist = (id) => {
    const updated = wishlistItems.filter(i => i.id !== id)
    localStorage.setItem('avora_wishlist', JSON.stringify(updated))
    setWishlistItems(updated)
  }

  const cartTotal = cartItems.reduce((sum, i) => sum + i.price, 0)

  const filtered = activeCategory === 'All'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === activeCategory)

  return (
    <main>

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#0a0a0a',
          color: '#fafafa',
          padding: '0.75rem 1.5rem',
          fontSize: '0.7rem',
          letterSpacing: '0.05em',
          border: '0.5px solid rgba(255,255,255,0.15)',
          zIndex: 9999,
          whiteSpace: 'nowrap',
        }}>{toast}</div>
      )}

      {/* CART OVERLAY */}
      {cartOpen && (
        <div
          onClick={() => setCartOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 300,
          }}
        />
      )}

      {/* CART SLIDE-IN */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: cartOpen ? 0 : '-420px',
        width: '400px',
        height: '100vh',
        background: '#0a0a0a',
        borderLeft: '0.5px solid rgba(255,255,255,0.1)',
        zIndex: 400,
        transition: 'right 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{
          padding: '1.5rem',
          borderBottom: '0.5px solid rgba(255,255,255,0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <p style={{ fontSize: '0.55rem', letterSpacing: '0.25em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              {cartItems.length} item{cartItems.length !== 1 ? 's' : ''}
            </p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.3rem', color: '#fafafa', fontWeight: '400' }}>Your Cart</h2>
          </div>
          <button onClick={() => setCartOpen(false)} style={{ background: 'none', border: 'none', color: '#fafafa', fontSize: '1.4rem', cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '4rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</div>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>Your cart is empty.</p>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item.cartId} style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '1rem',
                border: '0.5px solid rgba(255,255,255,0.08)',
                marginBottom: '0.75rem',
                background: 'rgba(255,255,255,0.02)',
              }}>
                <div style={{
                  width: '56px', height: '56px',
                  background: '#1a1a1a',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.8rem', flexShrink: 0,
                }}>{item.emoji}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.55rem', color: '#C9A84C', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>{item.store}</p>
                  <p style={{ fontSize: '0.78rem', color: '#fafafa', fontWeight: '500', marginBottom: '0.3rem' }}>{item.name}</p>
                  <p style={{ fontFamily: 'Georgia, serif', fontSize: '0.9rem', color: '#fafafa' }}>₦{item.price.toLocaleString()}</p>
                </div>
                <button onClick={() => removeFromCart(item.cartId)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: '1rem', cursor: 'pointer' }}>✕</button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div style={{ padding: '1rem 1.5rem', borderTop: '0.5px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Total</span>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#fafafa' }}>₦{cartTotal.toLocaleString()}</span>
            </div>
            <button style={{
              width: '100%', background: '#C9A84C', color: '#0a0a0a',
              border: 'none', padding: '0.8rem',
              fontSize: '0.6rem', letterSpacing: '0.2em',
              textTransform: 'uppercase', fontWeight: '700', cursor: 'pointer',
            }}>Checkout</button>
          </div>
        )}
      </div>

      {/* WISHLIST OVERLAY */}
      {wishlistOpen && (
        <div
          onClick={() => setWishlistOpen(true)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300 }}
        />
      )}

      {/* WISHLIST SLIDE-IN */}
      <div style={{
        position: 'fixed',
        top: '2rem',
        right: wishlistOpen ? 0 : '-420px',
        width: '400px',
        height: '100vh',
        background: '#0a0a0a',
        borderLeft: '0.5px solid rgba(255,255,255,0.1)',
        zIndex: 400,
        transition: 'right 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
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
          {wishlistItems.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '4rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>♡</div>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>No saved items yet.</p>
              <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.65rem', marginTop: '0.5rem' }}>Tap ♡ on any product to save it here.</p>
            </div>
          ) : (
            wishlistItems.map(item => (
              <div key={item.id} style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '1rem',
                border: '0.5px solid rgba(255,255,255,0.08)',
                marginBottom: '0.75rem',
                background: 'rgba(255,255,255,0.02)',
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
                <button onClick={() => removeFromWishlist(item.id)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: '1rem', cursor: 'pointer' }}>✕</button>
              </div>
            ))
          )}
        </div>

        {wishlistItems.length > 0 && (
          <div style={{ padding: '1rem 1.5rem', borderTop: '0.5px solid rgba(255,255,255,0.08)' }}>
            <button
              onClick={() => {
                wishlistItems.forEach(item => addToCart(item))
                setWishlistOpen(false)
              }}
              style={{
                width: '100%', background: '#C9A84C', color: '#0a0a0a',
                border: 'none', padding: '0.8rem',
                fontSize: '0.6rem', letterSpacing: '0.2em',
                textTransform: 'uppercase', fontWeight: '700', cursor: 'pointer',
              }}>Add All to Cart</button>
          </div>
        )}
      </div>

      {/* FLOATING CART BUTTON */}
      <button
        onClick={() => setCartOpen(true)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          background: '#C9A84C',
          color: '#0a0a0a',
          border: 'none',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          fontSize: '1.3rem',
          cursor: 'pointer',
          zIndex: 200,
          boxShadow: '0 4px 20px rgba(201,168,76,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        🛒
        {cartItems.length > 0 && (
          <span style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            background: '#0a0a0a',
            color: '#C9A84C',
            fontSize: '0.55rem',
            fontWeight: '700',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>{cartItems.length}</span>
        )}
      </button>

      {/* HERO */}
      <section style={{
        background: '#0a0a0a', color: '#fafafa',
        padding: '5rem 2rem', textAlign: 'center',
      }}>
        <p style={{ fontSize: '0.65rem', letterSpacing: '0.3em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
          · Campus Marketplace ·
        </p>
        <h1 style={{
          fontFamily: 'Georgia, serif',
          fontSize: 'clamp(2.5rem, 6vw, 5rem)',
          fontWeight: '400', letterSpacing: '0.05em', lineHeight: 1.1, marginBottom: '1.5rem',
        }}>
          Buy. Sell. Connect.<br />
          <span style={{ color: '#C9A84C' }}>On Campus.</span>
        </h1>
        <p style={{
          fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)',
          maxWidth: '480px', margin: '0 auto 2.5rem', lineHeight: 1.8, fontWeight: '300',
        }}>
          Avora connects students, vendors, and service providers in one trusted campus marketplace.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/marketplace" style={{
            background: '#C9A84C', color: '#0a0a0a',
            padding: '0.85rem 2.5rem', fontSize: '0.65rem',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            fontWeight: '700', textDecoration: 'none',
          }}>Shop Now</a>
          <a href="/signup" style={{
            background: 'transparent', color: '#fafafa',
            border: '0.5px solid rgba(255,255,255,0.3)',
            padding: '0.85rem 2.5rem', fontSize: '0.65rem',
            letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none',
          }}>Open a Store</a>
        </div>
      </section>

      {/* STATS BAR */}
      <section style={{
        background: '#C9A84C', padding: '1.2rem 2rem',
        display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap',
      }}>
        {[
          { number: '500+', label: 'Active Buyers' },
          { number: '80+', label: 'Verified Sellers' },
          { number: '1,200+', label: 'Products Listed' },
          { number: '100%', label: 'Secure Payments' },
        ].map((stat) => (
          <div key={stat.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontFamily: 'Georgia, serif', fontWeight: '500', color: '#0a0a0a' }}>{stat.number}</div>
            <div style={{ fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.6)' }}>{stat.label}</div>
          </div>
        ))}
      </section>

      {/* CATEGORIES + PRODUCTS */}
      <section style={{ padding: '4rem 2rem', background: '#fafafa' }}>
        <p style={{ textAlign: 'center', fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '0.5rem' }}>
          Featured Listings
        </p>
        <h2 style={{
          textAlign: 'center', fontFamily: 'Georgia, serif',
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: '400',
          marginBottom: '2rem', color: '#0a0a0a',
        }}>What are you looking for?</h2>

        {/* CATEGORY FILTER TABS */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2.5rem' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '0.45rem 1rem', fontSize: '0.6rem',
                letterSpacing: '0.1em', textTransform: 'uppercase',
                border: '0.5px solid rgba(0,0,0,0.15)',
                background: activeCategory === cat ? '#0a0a0a' : 'transparent',
                color: activeCategory === cat ? '#C9A84C' : '#0a0a0a',
                cursor: 'pointer',
                fontWeight: activeCategory === cat ? '600' : '400',
              }}
            >{cat}</button>
          ))}
        </div>

        {/* PRODUCT GRID */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '1.2rem',
          maxWidth: '1100px',
          margin: '0 auto',
          overflow: 'visible',
        }}>
          {filtered.map(product => (
            <div
              key={product.id}
              onMouseEnter={() => setHoveredId(product.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                border: '0.5px solid rgba(0,0,0,0.09)',
                background: '#fff',
                overflow: 'hidden',
                position: 'relative',
                // Landscape scale: more X than Y
                transform: hoveredId === product.id
                  ? 'scaleX(1.1) scaleY(1.01)'
                  : 'scale(1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                boxShadow: hoveredId === product.id
                  ? '0 16px 48px rgba(0,0,0,0.18)'
                  : 'none',
                zIndex: hoveredId === product.id ? 10 : 1,
              }}
            >
              {product.sponsored && (
                <div style={{
                  position: 'absolute', top: '10px', left: '10px',
                  background: '#C9A84C', color: '#0a0a0a',
                  fontSize: '0.45rem', letterSpacing: '0.15em',
                  textTransform: 'uppercase', fontWeight: '700',
                  padding: '0.2rem 0.5rem', zIndex: 2,
                }}>Featured</div>
              )}

              {/* Image — gets shorter on hover = landscape ratio */}
              <div style={{
                background: '#f5f3ee',
                height: hoveredId === product.id ? '110px' : '160px',
                transition: 'height 0.3s ease, font-size 0.3s ease',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: hoveredId === product.id ? '2.8rem' : '3.5rem',
              }}>{product.emoji}</div>

              <div style={{ padding: '1rem' }}>
                <p style={{ fontSize: '0.55rem', color: '#C9A84C', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{product.store}</p>
                <h3 style={{ fontSize: '0.85rem', fontWeight: '600', color: '#0a0a0a', marginBottom: '0.5rem', lineHeight: 1.4 }}>{product.name}</h3>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', color: '#0a0a0a', marginBottom: '1rem' }}>₦{product.price.toLocaleString()}</p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => addToCart(product)}
                    style={{
                      flex: 1, background: '#0a0a0a', color: '#fafafa',
                      border: 'none', padding: '0.6rem', fontSize: '0.55rem',
                      letterSpacing: '0.15em', textTransform: 'uppercase',
                      fontWeight: '600', cursor: 'pointer',
                    }}>Add to Cart</button>
                  <button
                    onClick={() => addToWishlist(product)}
                    style={{ width: '36px', background: 'transparent', border: '0.5px solid rgba(0,0,0,0.09)', cursor: 'pointer', fontSize: '1rem' }}
                    title="Add to Wishlist"
                  >♡</button>
                  <button
                    style={{ width: '36px', background: 'transparent', border: '0.5px solid rgba(0,0,0,0.09)', cursor: 'pointer', fontSize: '1rem' }}
                    title="Message Seller"
                  >💬</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#0a0a0a', padding: '5rem 2rem', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: '#fafafa', fontWeight: '400', marginBottom: '1rem' }}>
          Ready to Join Avora?
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginBottom: '2rem', fontWeight: '300' }}>
          Join thousands of students already buying and selling on campus.
        </p>
        <a href="/signup" style={{
          background: '#C9A84C', color: '#0a0a0a',
          padding: '0.9rem 3rem', fontSize: '0.65rem',
          letterSpacing: '0.2em', textTransform: 'uppercase',
          fontWeight: '700', textDecoration: 'none',
        }}>Get Started — It's Free</a>
      </section>

      {/* FOOTER */}
      <footer style={{
        background: '#0a0a0a',
        borderTop: '0.5px solid rgba(255,255,255,0.08)',
        padding: '2rem', textAlign: 'center',
      }}>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', color: '#fafafa', letterSpacing: '0.15em' }}>
          AV<span style={{ color: '#C9A84C' }}>O</span>RA
        </span>
        <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.5rem', letterSpacing: '0.1em' }}>
          © 2026 Avora. Buy. Sell. Connect — On Campus.
        </p>
      </footer>

    </main>
  )
}