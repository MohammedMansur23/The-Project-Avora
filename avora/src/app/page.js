'use client'
import { useState } from 'react'
import { useAuth } from '../lib/AuthContext'
import { useCart } from '../lib/CartContext'
import { useRequireAuth } from '../lib/useRequireAuth'

const PRODUCTS = [
  { id: 1, name: 'Jollof Rice & Chicken', store: "Mama Tee's Kitchen", price: 1500, category: 'Food & Drinks', emoji: '🍲', sponsored: true, type: 'product' },
  { id: 2, name: 'Ankara Crop Top', store: 'Campus Threads', price: 4500, category: 'Fashion', emoji: '👗', sponsored: true, type: 'product' },
  { id: 3, name: 'iPhone Charger (Fast)', store: 'TechZone Unilorin', price: 2800, category: 'Electronics', emoji: '📱', sponsored: true, type: 'product' },
  { id: 4, name: '200L Anatomy Textbook', store: 'BookStore NG', price: 3500, category: 'Books', emoji: '📚', sponsored: false, type: 'product' },
  { id: 5, name: 'Box Braids (Full Head)', store: 'Glamour by Sade', price: 7000, category: 'Beauty & Hair', emoji: '💇', sponsored: true, type: 'service' },
  { id: 6, name: 'Phone Screen Repair', store: 'FixIt Fast', price: 5000, category: 'Repairs', emoji: '🔧', sponsored: false, type: 'service' },
  { id: 7, name: 'Assignment Printing (20 pages)', store: 'QuickPrint Hub', price: 400, category: 'Printing', emoji: '📄', sponsored: true, type: 'service' },
  { id: 8, name: 'Air Force 1 (Size 42)', store: 'Sole Brothers', price: 35000, category: 'Footwear', emoji: '👟', sponsored: true, type: 'product' },
  { id: 9, name: 'Maths Tutoring (1hr)', store: 'SmartMinds', price: 2000, category: 'Tutoring', emoji: '🎓', sponsored: false, type: 'service' },
  { id: 10, name: 'Laundry Service (per bag)', store: 'CleanUp Crew', price: 1500, category: 'Laundry', emoji: '🧺', sponsored: false, type: 'service' },
  { id: 11, name: 'Used HP Laptop', store: 'S2S Listings', price: 85000, category: 'Second-hand', emoji: '♻️', sponsored: false, type: 'product' },
  { id: 12, name: 'Passport Photo (4 copies)', store: 'Clicks Studio', price: 500, category: 'Photography', emoji: '📸', sponsored: true, type: 'service' },
]

const CATEGORIES = [
  'All', 'Food & Drinks', 'Fashion', 'Electronics', 'Books',
  'Beauty & Hair', 'Repairs', 'Printing', 'Footwear',
  'Tutoring', 'Laundry', 'Photography', 'Second-hand',
]

export default function Home() {
  const { user } = useAuth()
  const { addToCart, removeFromCart, isInCart, toggleWishlist, isInWishlist } = useCart()
  const { requireAuth } = useRequireAuth()
  const [activeCategory, setActiveCategory] = useState('All')
  const [hoveredId, setHoveredId] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const handleCart = (product) => {
    requireAuth(() => {
      if (isInCart(product.id)) {
        removeFromCart(product.id)
        showToast(`🗑️ ${product.name} removed from cart`)
      } else {
        addToCart(product)
        showToast(`✅ ${product.name} added to cart`)
      }
    })
  }

  const handleWishlist = (product) => {
    requireAuth(() => {
      toggleWishlist(product)
      showToast(isInWishlist(product.id) ? `💔 Removed from wishlist` : `❤️ Saved to wishlist`)
    })
  }

  const filtered = activeCategory === 'All'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === activeCategory)

  return (
    <main>

      {/* TOAST */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '2rem', left: '50%',
          transform: 'translateX(-50%)',
          background: '#0a0a0a', color: '#fafafa',
          padding: '0.75rem 1.5rem', fontSize: '0.7rem',
          letterSpacing: '0.05em',
          border: '0.5px solid rgba(255,255,255,0.15)',
          zIndex: 9999, whiteSpace: 'nowrap',
        }}>{toast}</div>
      )}

      {/* HERO */}
      <section style={{
        background: '#0a0a0a', color: '#fafafa',
        padding: '5rem 2rem', textAlign: 'center',
      }}>
        <p style={{
          fontSize: '0.65rem', letterSpacing: '0.3em',
          color: '#C9A84C', textTransform: 'uppercase', marginBottom: '1.5rem',
        }}>· Campus Marketplace ·</p>
        <h1 style={{
          fontFamily: 'Georgia, serif',
          fontSize: 'clamp(2.5rem, 6vw, 5rem)',
          fontWeight: '400', letterSpacing: '0.05em',
          lineHeight: 1.1, marginBottom: '1.5rem',
        }}>
          Buy. Sell. Connect.<br />
          <span style={{ color: '#C9A84C' }}>On Campus.</span>
        </h1>
        <p style={{
          fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)',
          maxWidth: '480px', margin: '0 auto 2.5rem',
          lineHeight: 1.8, fontWeight: '300',
        }}>
          Avora connects students, vendors, and service providers
          in one trusted campus marketplace.
        </p>

        {!user ? (
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
              letterSpacing: '0.2em', textTransform: 'uppercase',
              textDecoration: 'none',
            }}>Open a Store</a>
          </div>
        ) : (
          <a href="/marketplace" style={{
            background: '#C9A84C', color: '#0a0a0a',
            padding: '0.85rem 2.5rem', fontSize: '0.65rem',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            fontWeight: '700', textDecoration: 'none',
            display: 'inline-block',
          }}>Browse Marketplace</a>
        )}
      </section>

      {/* STATS BAR */}
      <section style={{
        background: '#C9A84C', padding: '1.2rem 2rem',
        display: 'flex', justifyContent: 'center',
        gap: '3rem', flexWrap: 'wrap',
      }}>
        {[
          { number: '500+', label: 'Active Buyers' },
          { number: '80+', label: 'Verified Sellers' },
          { number: '1,200+', label: 'Products Listed' },
          { number: '100%', label: 'Secure Payments' },
        ].map((stat) => (
          <div key={stat.label} style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '1.4rem', fontFamily: 'Georgia, serif',
              fontWeight: '500', color: '#0a0a0a',
            }}>{stat.number}</div>
            <div style={{
              fontSize: '0.55rem', letterSpacing: '0.2em',
              textTransform: 'uppercase', color: 'rgba(0,0,0,0.6)',
            }}>{stat.label}</div>
          </div>
        ))}
      </section>

      {/* CATEGORIES + PRODUCTS */}
      <section style={{ padding: '4rem 2rem', background: '#fafafa' }}>
        <p style={{
          textAlign: 'center', fontWeight: '500', fontSize: '0.6rem',
          letterSpacing: '0.3em', textTransform: 'uppercase',
          color: '#C9A84C', marginBottom: '0.5rem',
        }}>Featured Listings</p>
        <h2 style={{
          textAlign: 'center', fontFamily: 'Georgia, serif',
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: '400',
          marginBottom: '2rem', color: '#0a0a0a',
        }}>What are you looking for?</h2>

        {/* CATEGORY FILTER */}
        <div style={{
          display: 'flex', gap: '0.5rem',
          flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2.5rem',
        }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{
              padding: '0.45rem 1rem', fontSize: '0.6rem',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              border: '0.5px solid rgba(0,0,0,0.15)',
              background: activeCategory === cat ? '#0a0a0a' : 'transparent',
              color: activeCategory === cat ? '#C9A84C' : '#0a0a0a',
              cursor: 'pointer',
              fontWeight: activeCategory === cat ? '600' : '400',
            }}>{cat}</button>
          ))}
        </div>

        {/* PRODUCT GRID */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '1.5rem', maxWidth: '1100px',
          margin: '0 auto', overflow: 'visible',
        }}>
          {filtered.map(product => (
            <div
              key={product.id}
              onMouseEnter={() => setHoveredId(product.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                border: '0.5px solid rgba(0,0,0,0.09)',
                background: '#fff', overflow: 'hidden',
                position: 'relative', borderRadius: '3%',
                transform: hoveredId === product.id ? 'scaleX(1.05) scaleY(1.01)' : 'scale(1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                boxShadow: hoveredId === product.id ? '0 8px 24px rgba(0,0,0,0.12)' : 'none',
                zIndex: hoveredId === product.id ? 10 : 1,
              }}>
              {product.sponsored && (
                <div style={{
                  position: 'absolute', top: '10px', left: '10px',
                  background: '#C9A84C', color: '#0a0a0a',
                  fontSize: '0.45rem', letterSpacing: '0.15em',
                  textTransform: 'uppercase', fontWeight: '700',
                  padding: '0.2rem 0.5rem', zIndex: 2,
                }}>Featured</div>
              )}
              {product.type === 'service' && (
                <div style={{
                  position: 'absolute', top: '10px', right: '10px',
                  background: '#0a0a0a', color: '#fafafa',
                  fontSize: '0.45rem', letterSpacing: '0.15em',
                  textTransform: 'uppercase', fontWeight: '700',
                  padding: '0.2rem 0.5rem', zIndex: 2,
                }}>Service</div>
              )}
              <div style={{
                background: '#f5f3ee',
                height: hoveredId === product.id ? '120px' : '160px',
                transition: 'height 0.3s ease, font-size 0.3s ease',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: hoveredId === product.id ? '2.8rem' : '3.5rem',
              }}>{product.emoji}</div>
              <div style={{ padding: '1rem' }}>
                <p style={{
                  fontSize: '0.55rem', color: '#C9A84C',
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  marginBottom: '0.25rem',
                }}>{product.store}</p>
                <h3 style={{
                  fontSize: '0.85rem', fontWeight: '600',
                  color: '#0a0a0a', marginBottom: '0.5rem', lineHeight: 1.4,
                }}>{product.name}</h3>
                <p style={{
                  fontFamily: 'Georgia, serif', fontSize: '1rem',
                  color: '#0a0a0a', marginBottom: '1rem',
                }}>
                  {product.type === 'service' ? 'From ' : ''}
                  ₦{product.price.toLocaleString()}
                </p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleCart(product)}
                    style={{
                      flex: 1, border: 'none', padding: '0.6rem',
                      fontSize: '0.55rem', letterSpacing: '0.15em',
                      textTransform: 'uppercase', fontWeight: '600', cursor: 'pointer',
                      background: isInCart(product.id) ? '#c0392b' : '#0a0a0a',
                      color: '#fafafa',
                    }}>
                    {product.type === 'service' ? 'Book Now' : isInCart(product.type.id) ? 'Remove' : 'Add to Cart'}
                  </button>
                  <button
                    onClick={() => handleWishlist(product)}
                    title="Add to Wishlist"
                    style={{
                      width: '36px', cursor: 'pointer', fontSize: '1rem',
                      background: isInWishlist(product.id) ? '#fff0f0' : 'transparent',
                      border: '0.5px solid rgba(0,0,0,0.09)',
                    }}>{isInWishlist(product.id) ? 
                        <svg width="16" height="16" viewBox="0 0 24 24"
                        fill="#ff0000" stroke="#ff0000" strokeWidth="1.5">
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06
                                -1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78
                                -7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                        </svg> 
                    :
                        <svg width="16" height="16" viewBox="0 0 24 24"
                        fill="#968282" stroke="#968282" strokeWidth="1.5">
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06
                                -1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78
                                -7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                        </svg>}
                  </button>
                  <button title="Message Seller" style={{
                    width: '36px', background: 'transparent',
                    border: '0.5px solid rgba(0,0,0,0.09)',
                    cursor: 'pointer', fontSize: '1rem',
                  }}><svg width="16" height="16" viewBox="0 0 24 24"
                  fill="none" stroke="#0a0a0a" strokeWidth="1.5">
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03
                    8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512
                    15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA — only when NOT logged in */}
      {!user && (
        <section style={{ background: '#0a0a0a', padding: '5rem 2rem', textAlign: 'center' }}>
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
            color: '#fafafa', fontWeight: '400', marginBottom: '1rem',
          }}>Ready to Join Avora?</h2>
          <p style={{
            color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem',
            marginBottom: '2rem', fontWeight: '300',
          }}>Join thousands of students already buying and selling on campus.</p>
          <a href="/signup" style={{
            background: '#C9A84C', color: '#0a0a0a',
            padding: '0.9rem 3rem', fontSize: '0.65rem',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            fontWeight: '700', textDecoration: 'none',
          }}>Get Started — It's Free</a>
        </section>
      )}

      {/* FOOTER */}
      <footer style={{
        background: '#0a0a0a',
        borderTop: '0.5px solid rgba(255,255,255,0.08)',
        padding: '2rem', textAlign: 'center',
      }}>
        <span style={{
          fontFamily: 'Georgia, serif', fontSize: '1.2rem',
          color: '#fafafa', letterSpacing: '0.15em',
        }}>AV<span style={{ color: '#C9A84C' }}>O</span>RA</span>
        <p style={{
          fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)',
          marginTop: '0.5rem', letterSpacing: '0.1em',
        }}>© 2026 Avora. Buy. Sell. Connect — On Campus.</p>
      </footer>

    </main>
  )
}