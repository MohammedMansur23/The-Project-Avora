'use client'
import {use } from 'react'
import { useState } from 'react'
import { useCart } from '../../../lib/CartContext'
import { useRequireAuth } from '../../../lib/useRequireAuth'

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

const STORE_INFO = {
  "Mama Tee's Kitchen": { emoji: '🍲', category: 'Food & Drinks', location: 'Harmony Hostel, Block B', rating: 4.9, reviews: 134, description: 'Fresh homemade meals delivered hot to your hostel. Tantalizing dishes made with love daily.', shield: 96, hours: '9am - 7pm daily'  },
  'Campus Threads': { emoji: '👗', category: 'Fashion', location: 'Female Hostel A, Room 12', rating: 4.7, reviews: 89, description: 'Trendy fashion for campus life. Ankara, corporate, and casual wear at student-friendly prices.', shield: 88, hours: '8am - 6pm daily'  },
  'TechZone Unilorin': { emoji: '📱', category: 'Electronics', location: 'Gate 2, Campus Market', rating: 4.8, reviews: 210, description: 'All your tech needs in one place. Chargers, accessories, gadgets, and repairs.', shield: 94, hours: '9am - 5pm daily'  },
  'BookStore NG': { emoji: '📚', category: 'Books', location: 'Faculty of Science Building', rating: 4.6, reviews: 67, description: 'New and used textbooks for all departments. We buy back your old books too.', shield: 82, hours: '8am - 10pm daily'  },
  'Glamour by Sade': { emoji: '💇', category: 'Beauty & Hair', location: 'Female Hostel C', rating: 4.9, reviews: 178, description: 'Professional hair styling and braiding at your doorstep. Book your slot in advance.', shield: 97, hours: '8am - 10pm daily'  },
  'FixIt Fast': { emoji: '🔧', category: 'Repairs', location: 'Tech Village, Off Campus', rating: 4.5, reviews: 45, description: 'Fast and reliable phone and laptop repairs. Same day service for most issues.', shield: 79, hours: '9am - 10pm daily'  },
  'QuickPrint Hub': { emoji: '📄', category: 'Printing', location: 'Library Complex', rating: 4.7, reviews: 312, description: 'Printing, binding, lamination, and scanning. Open early to late for all your project needs.', shield: 91, hours: '8am - 6pm daily' },
  'Sole Brothers': { emoji: '👟', category: 'Footwear', location: 'Student Union Building', rating: 4.6, reviews: 56, description: 'Authentic sneakers, sandals and shoes. We source directly so you get the best prices.', shield: 85, hours: '8am - 8pm daily'  },
  'SmartMinds': { emoji: '🎓', category: 'Tutoring', location: 'Comes to you', rating: 4.8, reviews: 93, description: 'Expert tutoring in Maths, Physics, Chemistry and more. Flexible hours for busy students.', shield: 90, hours: '12am - 6pm daily'  },
  'CleanUp Crew': { emoji: '🧺', category: 'Laundry', location: 'All Hostels', rating: 4.4, reviews: 201, description: '24-hour turnaround laundry service. We pick up and deliver fresh, folded clothes to your door.', shield: 76, hours: '24/7 service' },
  'S2S Listings': { emoji: '♻️', category: 'Second-hand', location: 'Various', rating: 4.3, reviews: 34, description: 'Student-to-student marketplace for used items. Everything is verified before listing.', shield: 72, hours: '8am - 10pm daily' },
  'Clicks Studio': { emoji: '📸', category: 'Photography', location: 'Art Faculty Building', rating: 4.9, reviews: 147, description: 'Professional passport photos, event photography, and ID card services.', shield: 95, hours: '8am - 5pm daily' },
  'Glam by Zara': { emoji: '💄', category: 'Beauty & Hair', location: 'Female Hostel B', rating: 4.8, reviews: 112, description: 'Full face makeup, gele tying, and nail art. Available for events and everyday glam.', shield: 93, hours: '8am - 4pm daily' },
}

export default function StorePage({ params }) {
  const { storeName: rawStoreName } = use(params)
  const storeName = decodeURIComponent(rawStoreName)
  const storeProducts = ALL_PRODUCTS.filter(p => p.store === storeName)
  const info = STORE_INFO[storeName] || { emoji: '🏪', category: 'General', location: 'Campus', rating: 4.5, reviews: 0, description: 'Welcome to this store on Avora.', shield: 70, hours: '9am - 5pm daily' }

  const { addToCart, removeFromCart, isInCart, toggleWishlist, isInWishlist } = useCart()
  const { requireAuth } = useRequireAuth()
  const [hoveredId, setHoveredId] = useState(null)
  const [toast, setToast] = useState(null)
  const [reviewsOpen, setReviewsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('listings')

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

  const shieldColor = info.shield >= 90 ? '#C9A84C' : info.shield >= 75 ? '#4CAF50' : '#888'

  if (storeProducts.length === 0 && !STORE_INFO[storeName]) {
    return (
      <main style={{ padding: '5rem 2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', fontWeight: '400', marginBottom: '0.5rem' }}>
          Store not found
        </h2>
        <p style={{ fontSize: '0.75rem', color: '#6a6a6a', marginBottom: '1.5rem' }}>
          This store doesn't exist or has been removed.
        </p>
        <a href="/marketplace" style={{
          background: '#0a0a0a', color: '#fafafa',
          padding: '0.7rem 2rem', fontSize: '0.6rem',
          letterSpacing: '0.2em', textTransform: 'uppercase',
          textDecoration: 'none', fontWeight: '600',
        }}>Back to Marketplace</a>
      </main>
    )
  }

  return (
    <main style={{ minHeight: '100vh', background: '#fafafa' }}>

      {/* TOAST */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '2rem', left: '50%',
          transform: 'translateX(-50%)',
          background: '#0a0a0a', color: '#fafafa',
          padding: '0.75rem 1.5rem', fontSize: '0.7rem',
          letterSpacing: '0.05em', border: '0.5px solid rgba(255,255,255,0.15)',
          zIndex: 9999, whiteSpace: 'nowrap',
        }}>{toast}</div>
      )}

      {/* STORE HEADER */}
      <div style={{ background: '#0a0a0a', padding: '3rem 2rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          {/* BREADCRUMB */}
          <p style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em', marginBottom: '1.5rem' }}>
            <a href="/" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Home</a>
            {' '}/{'  '}
            <a href="/marketplace" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Marketplace</a>
            {' '}/{'  '}
            <span style={{ color: '#C9A84C' }}>{storeName}</span>
          </p>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2rem', flexWrap: 'wrap' }}>

            {/* STORE AVATAR */}
            <div style={{
              width: '100px', height: '100px', background: '#1a1a1a',
              border: '2px solid rgba(201,168,76,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '3.5rem', flexShrink: 0,
            }}>{info.emoji}</div>

            {/* STORE DETAILS */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                <h1 style={{
                  fontFamily: 'Georgia, serif', fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
                  fontWeight: '400', color: '#fafafa',
                }}>{storeName}</h1>
                <span style={{
                  background: shieldColor, color: '#0a0a0a',
                  fontSize: '0.5rem', fontWeight: '700',
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  padding: '0.2rem 0.6rem',
                }}>🛡️ Shield {info.shield}</span>
              </div>

              <p style={{ fontSize: '0.6rem', color: '#C9A84C', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                {info.category} · 📍 {info.location}
              </p>

              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, maxWidth: '500px', marginBottom: '1rem' }}>
                {info.description}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ color: '#C9A84C', fontSize: '0.9rem' }}>{'★'.repeat(Math.round(info.rating))}</span>
                  <span style={{ fontSize: '0.65rem', color: '#fafafa', fontWeight: '600' }}>{info.rating}</span>
                  <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)' }}>({info.reviews} reviews)</span>
                </div>
                <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)' }}>
                  {storeProducts.length} listing{storeProducts.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                onClick={() => requireAuth(() => showToast('💬 Opening chat...'))}
                style={{
                  background: '#C9A84C', color: '#0a0a0a',
                  border: 'none', padding: '0.7rem 1.5rem',
                  fontSize: '0.6rem', letterSpacing: '0.15em',
                  textTransform: 'uppercase', fontWeight: '700', cursor: 'pointer',
                }}><svg width="16" height="10" viewBox="0 0 24 20"
                        fill="#ffffff" stroke="#ffffff" strokeWidth="1.5">
                        <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03
                          8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512
                          15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                      </svg> Message Store</button>
              <button
                onClick={() => setReviewsOpen(true)}
                style={{
                  background: 'transparent', color: '#fafafa',
                  border: '0.5px solid rgba(255,255,255,0.2)', padding: '0.7rem 1.5rem',
                  fontSize: '0.6rem', letterSpacing: '0.15em',
                  textTransform: 'uppercase', cursor: 'pointer',
                }}>⭐ See Reviews</button>
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ borderBottom: '0.5px solid rgba(0,0,0,0.09)', background: '#fff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '0' }}>
          {['listings', 'about'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '1rem 1.5rem', fontSize: '0.6rem',
              letterSpacing: '0.15em', textTransform: 'uppercase',
              border: 'none', background: 'transparent',
              color: activeTab === tab ? '#0a0a0a' : '#6a6a6a',
              borderBottom: activeTab === tab ? '2px solid #C9A84C' : '2px solid transparent',
              cursor: 'pointer', fontWeight: activeTab === tab ? '600' : '400',
            }}>{tab === 'listings' ? `All Listings (${storeProducts.length})` : 'About'}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem' }}>

        {/* LISTINGS TAB */}
        {activeTab === 'listings' && (
          storeProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', border: '0.5px solid rgba(0,0,0,0.09)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.3rem', fontWeight: '400' }}>
                No listings yet
              </h2>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '1.5rem', overflow: 'visible',
            }}>
              {storeProducts.map(product => (
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
                    background: '#f5f3ee', height: '160px', overflow: 'hidden',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <div style={{
                      fontSize: '3.5rem',
                      transform: hoveredId === product.id ? 'scale(1.25)' : 'scale(1)',
                      transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}>{product.emoji}</div>
                  </div>

                  <div style={{ padding: '1rem' }}>
                    <p style={{
                      fontSize: '0.55rem', color: '#C9A84C',
                      letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.25rem',
                    }}>{product.category}</p>
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
                        title="Message Seller"
                        style={{
                          flex: 1, border: 'none', padding: '0.6rem',
                          fontSize: '0.55rem', letterSpacing: '0.15em',
                          textTransform: 'uppercase', fontWeight: '600',
                          cursor: 'pointer', background: '#0a0a0a', color: '#fafafa',
                        }}><svg width="16" height="10" viewBox="0 0 24 20"
                        fill="#ffffff" stroke="#ffffff" strokeWidth="1.5">
                        <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03
                          8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512
                          15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                      </svg> Message</button>
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
          )
        )}

        {/* ABOUT TAB */}
        {activeTab === 'about' && (
          <div style={{ maxWidth: '600px' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.3rem', fontWeight: '400', marginBottom: '1.5rem' }}>
              About {storeName}
            </h2>
            {[
              { label: 'Category', value: info.category },
              { label: 'Location', value: info.location },
              { label: 'Rating', value: `${info.rating} / 5.0 (${info.reviews} reviews)` },
              { label: 'Work Hours', value: info.hours },
              { label: 'Shield Score', value: `${info.shield} / 100` },
              { label: 'Total Listings', value: `${storeProducts.length} items` },
            ].map(row => (
              <div key={row.label} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '0.85rem 0', borderBottom: '0.5px solid rgba(0,0,0,0.06)',
              }}>
                <span style={{ fontSize: '0.65rem', color: '#6a6a6a', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{row.label}</span>
                <span style={{ fontSize: '0.72rem', color: '#0a0a0a', fontWeight: '500' }}>{row.value}</span>
              </div>
            ))}
            <div style={{ marginTop: '1.5rem' }}>
              <p style={{ fontSize: '0.55rem', color: '#6a6a6a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Description</p>
              <p style={{ fontSize: '0.78rem', color: '#0a0a0a', lineHeight: 1.8 }}>{info.description}</p>
            </div>
          </div>
        )}
      </div>

      {/* REVIEWS MODAL */}
      {reviewsOpen && (
        <div onClick={() => setReviewsOpen(false)} style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 500,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '2rem',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: '#fff', maxWidth: '500px', width: '100%',
            padding: '2rem', maxHeight: '80vh', overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.3rem', fontWeight: '400' }}>Reviews</h2>
              <button onClick={() => setReviewsOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            {/* RATING SUMMARY */}
            <div style={{
              background: '#f5f3ee', padding: '1.5rem', textAlign: 'center', marginBottom: '1.5rem',
            }}>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: '3rem', color: '#0a0a0a' }}>{info.rating}</div>
              <div style={{ color: '#C9A84C', fontSize: '1.2rem', marginBottom: '0.25rem' }}>{'★'.repeat(Math.round(info.rating))}</div>
              <div style={{ fontSize: '0.65rem', color: '#6a6a6a' }}>{info.reviews} reviews</div>
            </div>

            {/* SAMPLE REVIEWS */}
            {[
              { name: 'Tunde A.', rating: 5, comment: 'Excellent service, very fast and reliable!', date: '2 days ago' },
              { name: 'Amina B.', rating: 5, comment: 'Best on campus, highly recommend 🙌', date: '1 week ago' },
              { name: 'Chidi O.', rating: 4, comment: 'Good quality, will order again.', date: '2 weeks ago' },
            ].map((review, i) => (
              <div key={i} style={{ padding: '1rem 0', borderBottom: '0.5px solid rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: '600' }}>{review.name}</span>
                  <span style={{ fontSize: '0.6rem', color: '#6a6a6a' }}>{review.date}</span>
                </div>
                <div style={{ color: '#C9A84C', fontSize: '0.8rem', marginBottom: '0.25rem' }}>{'★'.repeat(review.rating)}</div>
                <p style={{ fontSize: '0.72rem', color: '#0a0a0a', lineHeight: 1.6 }}>{review.comment}</p>
              </div>
            ))}

            {/* ADD REVIEW */}
            <div style={{ marginTop: '1.5rem' }}>
              <p style={{ fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Add Your Review</p>
              <textarea placeholder="Write your review..." style={{
                width: '100%', padding: '0.75rem', fontSize: '0.72rem',
                border: '0.5px solid rgba(0,0,0,0.15)', background: '#fafafa',
                resize: 'vertical', minHeight: '80px', marginBottom: '0.75rem',
                boxSizing: 'border-box', fontFamily: 'Arial, sans-serif',
              }} />
              <button
                onClick={() => requireAuth(() => showToast('✅ Review submitted!'))}
                style={{
                  width: '100%', background: '#0a0a0a', color: '#fafafa',
                  border: 'none', padding: '0.75rem', fontSize: '0.6rem',
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  fontWeight: '700', cursor: 'pointer',
                }}>Submit Review</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}