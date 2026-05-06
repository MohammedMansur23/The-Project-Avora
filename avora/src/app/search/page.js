'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useCart } from '../../lib/CartContext'
import { useRequireAuth } from '../../lib/useRequireAuth'

const ALL_PRODUCTS = [
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

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [results, setResults] = useState([])
  const [hoveredId, setHoveredId] = useState(null)
  const [toast, setToast] = useState(null)
  const { addToCart, removeFromCart, isInCart, toggleWishlist, isInWishlist } = useCart()
  const { requireAuth } = useRequireAuth()

  useEffect(() => {
    if (query) {
      const filtered = ALL_PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.store.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      )
      setResults(filtered)
    }
  }, [query])

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

  return (
    <main style={{ padding: '3rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>

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

      {/* SEARCH HEADER */}
      <div style={{ marginBottom: '2rem' }}>
        <p style={{
          fontSize: '0.6rem', letterSpacing: '0.2em',
          textTransform: 'uppercase', color: '#C9A84C', marginBottom: '0.5rem',
        }}>Search Results</p>
        <h1 style={{
          fontFamily: 'Georgia, serif', fontSize: '2rem',
          fontWeight: '400', color: '#0a0a0a',
        }}>
          {results.length > 0
            ? `${results.length} result${results.length > 1 ? 's' : ''} for "${query}"`
            : `No results for "${query}"`}
        </h1>
      </div>

      {/* NO RESULTS */}
      {results.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '4rem 2rem',
          border: '0.5px solid rgba(0,0,0,0.09)',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <h2 style={{
            fontFamily: 'Georgia, serif', fontSize: '1.3rem',
            fontWeight: '400', marginBottom: '0.5rem',
          }}>Nothing found for "{query}"</h2>
          <p style={{ fontSize: '0.75rem', color: '#6a6a6a', marginBottom: '1.5rem' }}>
            Try a different keyword, or post a request on Avora Pulse and let sellers come to you.
          </p>
          <a href="/" style={{
            background: '#0a0a0a', color: '#fafafa',
            padding: '0.7rem 2rem', fontSize: '0.6rem',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            textDecoration: 'none', fontWeight: '600',
          }}>Back to Home</a>
        </div>
      )}

      {/* RESULTS GRID */}
      {results.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '1.5rem', overflow: 'visible',
        }}>
          {results.map(product => (
            <div
              key={product.id}
              onMouseEnter={() => setHoveredId(product.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                border: '0.5px solid rgba(0,0,0,0.09)',
                background: '#fff', overflow: 'hidden',
                position: 'relative', borderRadius: '3%',
                transition: 'box-shadow 0.3s ease, transform 0.3s ease',
                boxShadow: hoveredId === product.id ? '0 8px 32px rgba(0,0,0,0.15)' : 'none',
                transform: hoveredId === product.id ? 'translateY(-4px)' : 'translateY(0)',
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

              {/* IMAGE */}
              <div style={{
                background: '#f5f3ee', height: '160px',
                overflow: 'hidden',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{
                  fontSize: '3.5rem',
                  transform: hoveredId === product.id ? 'scale(1.25)' : 'scale(1)',
                  transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                }}>{product.emoji}</div>
              </div>

              <div style={{ padding: '1rem' }}>
                <a href={`/store/${encodeURIComponent(product.store)}`} style={{
                  display: 'block', fontSize: '0.55rem', color: '#C9A84C',
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  marginBottom: '0.25rem', textDecoration: 'none',
                  }}>{product.store}
                </a>
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

                {/* BUTTONS */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    title="Message Seller"
                    style={{
                      flex: 1, border: 'none', padding: '0.6rem',
                      fontSize: '0.55rem', letterSpacing: '0.15em',
                      textTransform: 'uppercase', fontWeight: '600',
                      cursor: 'pointer', background: '#0a0a0a', color: '#fafafa',
                    }}>
                    <svg width="16" height="10" viewBox="0 0 24 20"
                      fill="#ffffff" stroke="#ffffff" strokeWidth="1.5">
                      <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03
                        8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512
                        15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                    </svg> Message
                  </button>
                  <button
                    onClick={() => handleCart(product)}
                    title={isInCart(product.id) ? 'Remove from Cart' : 'Add to Cart'}
                    style={{
                      width: '36px', border: 'none', cursor: 'pointer', fontSize: '1rem',
                      background: isInCart(product.id) ? '#fff0f0' : 'transparent',
                      border: '0.5px solid rgba(0,0,0,0.09)',
                      color: isInCart(product.id) ? '#fafafa' : '#0a0a0a',
                    }}>🛒</button>
                  <button
                    onClick={() => handleWishlist(product)}
                    title="Wishlist"
                    style={{
                      width: '36px', cursor: 'pointer', fontSize: '1rem',
                      background: isInWishlist(product.id) ? '#fff0f0' : 'transparent',
                      border: '0.5px solid rgba(0,0,0,0.09)',
                    }}>
                    {isInWishlist(product.id) ? (
                      <svg width="16" height="16" viewBox="0 0 24 24"
                        fill="#ff0000" stroke="#ff0000" strokeWidth="1.5">
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06
                          -1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78
                          -7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 19"
                        fill="none" stroke="#968282" strokeWidth="1.5">
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06
                          -1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78
                          -7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}