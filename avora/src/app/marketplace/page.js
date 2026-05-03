'use client'
import { useState } from 'react'

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

export default function Marketplace() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeType, setActiveType] = useState('All') // All, Products, Services
  const [sort, setSort] = useState('default')
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [toast, setToast] = useState('')

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const addToCart = (product) => {
    setCart(prev => [...prev, product])
    showToast(`✅ ${product.name} added to cart`)
  }

  const toggleWishlist = (product) => {
    const exists = wishlist.find(w => w.id === product.id)
    if (exists) {
      setWishlist(prev => prev.filter(w => w.id !== product.id))
      showToast(`💔 Removed from wishlist`)
    } else {
      setWishlist(prev => [...prev, product])
      showToast(`❤️ Added to wishlist`)
    }
  }

  let filtered = ALL_PRODUCTS
  if (activeCategory !== 'All') {
    filtered = filtered.filter(p => p.category === activeCategory)
  }
  if (activeType === 'Products') {
    filtered = filtered.filter(p => p.type === 'product')
  } else if (activeType === 'Services') {
    filtered = filtered.filter(p => p.type === 'service')
  }
  if (sort === 'price_asc') filtered = [...filtered].sort((a, b) => a.price - b.price)
  if (sort === 'price_desc') filtered = [...filtered].sort((a, b) => b.price - a.price)
  if (sort === 'featured') filtered = [...filtered].sort((a, b) => b.sponsored - a.sponsored)

  return (
    <main style={{ minHeight: '100vh', background: '#fafafa' }}>

      {/* TOAST */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#0a0a0a',
          color: '#fafafa',
          padding: '0.75rem 1.5rem',
          fontSize: '0.72rem',
          zIndex: 999,
          letterSpacing: '0.05em',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        }}>{toast}</div>
      )}

      {/* PAGE HEADER */}
      <div style={{
        background: '#0a0a0a',
        padding: '2.5rem 2rem',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{
            fontSize: '0.55rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#C9A84C',
            marginBottom: '0.4rem',
          }}>University of Ilorin</p>
          <h1 style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: '400',
            color: '#fafafa',
            marginBottom: '0.5rem',
          }}>Marketplace</h1>
          <p style={{
            fontSize: '0.72rem',
            color: 'rgba(255,255,255,0.45)',
          }}>
            {filtered.length} items available · {cart.length} in cart · {wishlist.length} in wishlist
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem' }}>

        {/* FILTERS ROW */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}>

          {/* TYPE TABS */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['All', 'Products', 'Services'].map(type => (
              <button key={type} onClick={() => setActiveType(type)} style={{
                padding: '0.4rem 1rem',
                fontSize: '0.6rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                border: '0.5px solid rgba(0,0,0,0.15)',
                background: activeType === type ? '#0a0a0a' : 'transparent',
                color: activeType === type ? '#C9A84C' : '#0a0a0a',
                cursor: 'pointer',
                fontWeight: activeType === type ? '600' : '400',
              }}>{type}</button>
            ))}
          </div>

          {/* SORT */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            style={{
              padding: '0.4rem 0.8rem',
              fontSize: '0.6rem',
              border: '0.5px solid rgba(0,0,0,0.15)',
              background: '#fafafa',
              color: '#0a0a0a',
              cursor: 'pointer',
              outline: 'none',
              letterSpacing: '0.05em',
            }}>
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* CATEGORY FILTER */}
        <div style={{
          display: 'flex',
          gap: '0.4rem',
          flexWrap: 'wrap',
          marginBottom: '2rem',
        }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{
              padding: '0.35rem 0.85rem',
              fontSize: '0.55rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
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
          background: '#0a0a0a',
          padding: '1.2rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem',
        }}>
          <div>
            <p style={{
              fontSize: '0.65rem',
              color: '#fafafa',
              fontWeight: '600',
              letterSpacing: '0.05em',
              marginBottom: '0.2rem',
            }}>Want to sell on Avora?</p>
            <p style={{
              fontSize: '0.6rem',
              color: 'rgba(255,255,255,0.45)',
            }}>Open your store in minutes — it's free.</p>
          </div>
          <a href="#" style={{
            background: '#C9A84C',
            color: '#0a0a0a',
            padding: '0.6rem 1.5rem',
            fontSize: '0.55rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            fontWeight: '700',
            textDecoration: 'none',
          }}>Open a Store →</a>
        </div>

        {/* PRODUCT GRID */}
        {filtered.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            border: '0.5px solid rgba(0,0,0,0.09)',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <h2 style={{
              fontFamily: 'Georgia, serif',
              fontSize: '1.3rem',
              fontWeight: '400',
              marginBottom: '0.5rem',
            }}>Nothing in this category yet</h2>
            <p style={{ fontSize: '0.72rem', color: '#6a6a6a' }}>
              Be the first to list here.
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '1.2rem',
          }}>
            {filtered.map(product => {
              const inWishlist = wishlist.find(w => w.id === product.id)
              return (
                <div key={product.id} style={{
                  border: '0.5px solid rgba(0,0,0,0.09)',
                  background: '#fff',
                  overflow: 'hidden',
                  position: 'relative',
                }}>
                  {product.sponsored && (
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      background: '#C9A84C',
                      color: '#0a0a0a',
                      fontSize: '0.45rem',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      fontWeight: '700',
                      padding: '0.2rem 0.5rem',
                    }}>Featured</div>
                  )}
                  {product.type === 'service' && (
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: '#0a0a0a',
                      color: '#fafafa',
                      fontSize: '0.45rem',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      fontWeight: '700',
                      padding: '0.2rem 0.5rem',
                    }}>Service</div>
                  )}
                  <div style={{
                    background: '#f5f3ee',
                    height: '160px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3.5rem',
                  }}>{product.emoji}</div>
                  <div style={{ padding: '1rem' }}>
                    <p style={{
                      fontSize: '0.55rem',
                      color: '#C9A84C',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      marginBottom: '0.25rem',
                    }}>{product.store}</p>
                    <h3 style={{
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      color: '#0a0a0a',
                      marginBottom: '0.5rem',
                      lineHeight: 1.4,
                    }}>{product.name}</h3>
                    <p style={{
                      fontFamily: 'Georgia, serif',
                      fontSize: '1rem',
                      color: '#0a0a0a',
                      marginBottom: '1rem',
                    }}>
                      {product.type === 'service' ? 'From ' : ''}
                      ₦{product.price.toLocaleString()}
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => addToCart(product)}
                        style={{
                          flex: 1,
                          background: '#0a0a0a',
                          color: '#fafafa',
                          border: 'none',
                          padding: '0.6rem',
                          fontSize: '0.55rem',
                          letterSpacing: '0.15em',
                          textTransform: 'uppercase',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}>
                        {product.type === 'service' ? 'Book Now' : 'Add to Cart'}
                      </button>
                      <button
                        title="Message Seller"
                        style={{
                          width: '36px',
                          background: 'transparent',
                          border: '0.5px solid rgba(0,0,0,0.09)',
                          cursor: 'pointer',
                          fontSize: '1rem',
                        }}>💬</button>
                      <button
                        onClick={() => toggleWishlist(product)}
                        title="Wishlist"
                        style={{
                          width: '36px',
                          background: inWishlist ? '#fff0f0' : 'transparent',
                          border: '0.5px solid rgba(0,0,0,0.09)',
                          cursor: 'pointer',
                          fontSize: '1rem',
                        }}>{inWishlist ? '❤️' : '♡'}</button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}