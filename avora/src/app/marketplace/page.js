'use client'
import { useState } from 'react'
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
  { id: 13, name: 'Fried Rice & Turkey', store: "Mama Tee's Kitchen", price: 1800, category: 'Food & Drinks', emoji: '🍛', sponsored: false, type: 'product' },
  { id: 14, name: 'Makeup (Full Face)', store: 'Glam by Zara', price: 8000, category: 'Beauty & Hair', emoji: '💄', sponsored: true, type: 'service' },
  { id: 15, name: 'Native Senator Wear', store: 'Campus Threads', price: 12000, category: 'Fashion', emoji: '👘', sponsored: false, type: 'product' },
  { id: 16, name: 'Power Bank 20000mAh', store: 'TechZone Unilorin', price: 9500, category: 'Electronics', emoji: '🔋', sponsored: false, type: 'product' },
]

const CATEGORIES = [
  'All', 'Food & Drinks', 'Fashion', 'Electronics', 'Books',
  'Beauty & Hair', 'Repairs', 'Printing', 'Footwear',
  'Tutoring', 'Laundry', 'Photography', 'Second-hand',
]

const SORT_OPTIONS = [
  { label: 'Default', value: 'default' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Featured First', value: 'featured' },
]

function StarRating({ rating, max = 5 }) {
  return (
    <div style={{ display: 'flex', gap: '1px' }}>
      {Array.from({ length: max }).map((_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24">
          <polygon
            points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
            fill={i < Math.round(rating) ? '#C9A84C' : 'none'}
            stroke="#C9A84C"
            strokeWidth="2"
          />
        </svg>
      ))}
    </div>
  )
}

export default function Marketplace() {
  const { addToCart, removeFromCart, isInCart, toggleWishlist, isInWishlist } = useCart()
  const { requireAuth } = useRequireAuth()
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeType, setActiveType] = useState('All')
  const [sort, setSort] = useState('default')
  const [hoveredId, setHoveredId] = useState(null)
  const [toast, setToast] = useState('')

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
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

  let filtered = ALL_PRODUCTS
  if (activeCategory !== 'All') filtered = filtered.filter(p => p.category === activeCategory)
  if (activeType === 'Products') filtered = filtered.filter(p => p.type === 'product')
  if (activeType === 'Services') filtered = filtered.filter(p => p.type === 'service')
  if (sort === 'price_asc') filtered = [...filtered].sort((a, b) => a.price - b.price)
  if (sort === 'price_desc') filtered = [...filtered].sort((a, b) => b.price - a.price)
  if (sort === 'featured') filtered = [...filtered].sort((a, b) => b.sponsored - a.sponsored)

  return (
    <main style={{ minHeight: '100vh', background: '#fafafa' }}>

      {/* TOAST */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '2rem', left: '50%',
          transform: 'translateX(-50%)',
          background: '#0a0a0a', color: '#fafafa',
          padding: '0.75rem 1.5rem', fontSize: '0.72rem',
          zIndex: 999, letterSpacing: '0.05em',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        }}>{toast}</div>
      )}

      {/* PAGE HEADER */}
      <div style={{
        background: '#0a0a0a', padding: '2.5rem 2rem',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{
            fontSize: '0.55rem', letterSpacing: '0.3em',
            textTransform: 'uppercase', color: '#C9A84C', marginBottom: '0.4rem',
          }}>University of Ilorin</p>
          <h1 style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: '400', color: '#fafafa', marginBottom: '0.5rem',
          }}>Marketplace</h1>
          <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)' }}>
            {filtered.length} items available
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem' }}>

        {/* FILTERS ROW */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap',
          gap: '1rem', marginBottom: '1.5rem',
        }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['All', 'Products', 'Services'].map(type => (
              <button key={type} onClick={() => setActiveType(type)} style={{
                padding: '0.4rem 1rem', fontSize: '0.6rem',
                letterSpacing: '0.1em', textTransform: 'uppercase',
                border: '0.5px solid rgba(0,0,0,0.15)',
                background: activeType === type ? '#0a0a0a' : 'transparent',
                color: activeType === type ? '#C9A84C' : '#0a0a0a',
                cursor: 'pointer',
                fontWeight: activeType === type ? '600' : '400',
              }}>{type}</button>
            ))}
          </div>

          <select value={sort} onChange={(e) => setSort(e.target.value)} style={{
            padding: '0.4rem 0.8rem', fontSize: '0.6rem',
            border: '0.5px solid rgba(0,0,0,0.15)',
            background: '#fafafa', color: '#0a0a0a',
            cursor: 'pointer', outline: 'none', letterSpacing: '0.05em',
          }}>
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* CATEGORY FILTER */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{
              padding: '0.35rem 0.85rem', fontSize: '0.55rem',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              border: '0.5px solid rgba(0,0,0,0.12)',
              background: activeCategory === cat ? '#C9A84C' : 'transparent',
              color: activeCategory === cat ? '#0a0a0a' : '#6a6a6a',
              cursor: 'pointer',
              fontWeight: activeCategory === cat ? '700' : '400',
            }}>{cat}</button>
          ))}
        </div>

        {/* OPEN A STORE BANNER */}
        <div style={{
          background: '#0a0a0a', padding: '1.2rem 1.5rem',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap',
          gap: '1rem', marginBottom: '2rem',
        }}>
          <div>
            <p style={{
              fontSize: '0.65rem', color: '#fafafa',
              fontWeight: '600', letterSpacing: '0.05em', marginBottom: '0.2rem',
            }}>Want to sell on Avora?</p>
            <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.45)' }}>
              Open your store in minutes — it's free.
            </p>
          </div>
          <a href="/open-a-store" style={{
            background: '#C9A84C', color: '#0a0a0a',
            padding: '0.6rem 1.5rem', fontSize: '0.55rem',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            fontWeight: '700', textDecoration: 'none',
          }}>Open a Store →</a>
        </div>

        {/* PRODUCT GRID */}
        {filtered.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '4rem 2rem',
            border: '0.5px solid rgba(0,0,0,0.09)',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <h2 style={{
              fontFamily: 'Georgia, serif', fontSize: '1.3rem',
              fontWeight: '400', marginBottom: '0.5rem',
            }}>Nothing in this category yet</h2>
            <p style={{ fontSize: '0.72rem', color: '#6a6a6a' }}>
              Be the first to list here.
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '1.5rem', overflow: 'visible',
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
                  <div style={{ background: '#f5f3ee', height: '160px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {product.image ? (
                      <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{
                        fontSize: '3.5rem',
                        transform: hoveredId === product.id ? 'scale(1.25)' : 'scale(1)',
                        transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}>{product.emoji}</div>
                    )}
                  </div>
                </div>

                <div style={{ padding: '1rem' }}>
                  <a href={`/store/${encodeURIComponent(product.store)}`} style={{
                  display: 'block', fontSize: '0.55rem', color: '#C9A84C',
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  marginBottom: '0.25rem', textDecoration: 'none',     
                  transition: 'font-size 0.2s ease',
                  fontSize: hoveredId === product.id ? '0.7rem' : '0.55rem',            
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
                      </svg>Message
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
                      }}>{isInWishlist(product.id) ? (
                      <svg width="16" height="16" viewBox="0 0 24 24"
                        fill="#ff0000" stroke="#ff0000" strokeWidth="1.5">
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06
                          -1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78
                          -7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24"
                        fill="none" stroke="#968282" strokeWidth="1.5">
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06
                          -1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78
                          -7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                      </svg>
                    )}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}