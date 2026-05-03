'use client'
import { useState } from 'react'


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
  const [cart, setCart] = useState([])

  const filtered = activeCategory === 'All'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === activeCategory)

  const addToCart = (product) => {
    setCart(prev => [...prev, product])
    alert(`✅ ${product.name} added to cart!`)
  }

  return (
    <main>
      {/* HERO */}
      <section style={{
        background: '#0a0a0a',
        color: '#fafafa',
        padding: '5rem 2rem',
        textAlign: 'center',
      }}>
        <p style={{
          fontSize: '0.75rem',
          letterSpacing: '0.3em',
          color: '#C9A84C',
          textTransform: 'uppercase',
          marginBottom: '1.5rem',
        }}>· Campus Marketplace ·</p>
        <h1 style={{
          fontFamily: 'Georgia, serif',
          fontSize: 'clamp(2.5rem, 6vw, 5rem)',
          fontWeight: '400',
          letterSpacing: '0.05em',
          lineHeight: 1.1,
          marginBottom: '1.5rem',
        }}>
          Buy. Sell. Connect.<br />
          <span style={{ color: '#C9A84C' }}>On Campus.</span>
        </h1>
        <p style={{
          fontSize: '0.85rem',
          color: 'rgba(255,255,255,0.6)',
          maxWidth: '480px',
          margin: '0 auto 2.5rem',
          lineHeight: 1.8,
          fontWeight: '300',
        }}>
          Avora connects students, vendors, and service providers
          in one trusted campus marketplace.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/marketplace" style={{
            background: '#C9A84C',
            color: '#0a0a0a',
            padding: '0.85rem 2.5rem',
            fontSize: '0.65rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            fontWeight: '700',
            textDecoration: 'none',
          }}>Shop Now</a>
          <a href="/signup" style={{
            background: 'transparent',
            color: '#fafafa',
            border: '0.5px solid rgba(255,255,255,0.3)',
            padding: '0.85rem 2.5rem',
            fontSize: '0.65rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            textDecoration: 'none',
          }}>Open a Store</a>
        </div>
      </section>

      {/* STATS BAR */}
      <section style={{
        background: '#C9A84C',
        padding: '1.2rem 2rem',
        display: 'flex',
        justifyContent: 'center',
        gap: '3rem',
        flexWrap: 'wrap',
      }}>
        {[
          { number: '500+', label: 'Active Buyers' },
          { number: '80+', label: 'Verified Sellers' },
          { number: '1,200+', label: 'Products Listed' },
          { number: '100%', label: 'Secure Payments' },
        ].map((stat) => (
          <div key={stat.label} style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '1.4rem',
              fontFamily: 'Georgia, serif',
              fontWeight: '500',
              color: '#0a0a0a',
            }}>{stat.number}</div>
            <div style={{
              fontSize: '0.55rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(0,0,0,0.6)',
            }}>{stat.label}</div>
          </div>
        ))}
      </section>

      {/* CATEGORIES + PRODUCTS */}
      <section style={{ padding: '4rem 2rem', background: '#fafafa' }}>
        <p style={{
          textAlign: 'center',
          fontSize: '0.6rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: '#C9A84C',
          marginBottom: '0.5rem',
        }}>Featured Listings</p>
        <h2 style={{
          textAlign: 'center',
          fontFamily: 'Georgia, serif',
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
          fontWeight: '400',
          marginBottom: '2rem',
          color: '#0a0a0a',
        }}>What are you looking for?</h2>

        {/* CATEGORY FILTER TABS */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: '2.5rem',
        }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '0.45rem 1rem',
                fontSize: '0.6rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
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
        }}>
          {filtered.map(product => (
            <div key={product.id} style={{
              border: '0.5px solid rgba(0,0,0,0.09)',
              background: '#fff',
              overflow: 'hidden',
              position: 'relative',
            }}>
              {/* Sponsored badge */}
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
              {/* Product image placeholder */}
              <div style={{
                background: '#f5f3ee',
                height: '160px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3.5rem',
              }}>{product.emoji}</div>
              {/* Product info */}
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
                }}>₦{product.price.toLocaleString()}</p>
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
    }}>Add to Cart</button>
  <button style={{
    width: '36px',
    background: 'transparent',
    border: '0.5px solid rgba(0,0,0,0.09)',
    cursor: 'pointer',
    fontSize: '1rem',
  }} title="Message Seller">💬</button>
  <button style={{
    width: '36px',
    background: 'transparent',
    border: '0.5px solid rgba(0,0,0,0.09)',
    cursor: 'pointer',
    fontSize: '1rem',
  }} title="Add to Wishlist">♡</button>
</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        background: '#0a0a0a',
        padding: '5rem 2rem',
        textAlign: 'center',
      }}>
        <h2 style={{
          fontFamily: 'Georgia, serif',
          fontSize: 'clamp(1.8rem, 4vw, 3rem)',
          color: '#fafafa',
          fontWeight: '400',
          marginBottom: '1rem',
        }}>Ready to Join Avora?</h2>
        <p style={{
          color: 'rgba(255,255,255,0.5)',
          fontSize: '0.8rem',
          marginBottom: '2rem',
          fontWeight: '300',
        }}>Join thousands of students already buying and selling on campus.</p>
        <a href="/signup" style={{
          background: '#C9A84C',
          color: '#0a0a0a',
          padding: '0.9rem 3rem',
          fontSize: '0.65rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          fontWeight: '700',
          textDecoration: 'none',
        }}>Get Started — It's Free</a>
      </section>

      {/* FOOTER */}
      <footer style={{
        background: '#0a0a0a',
        borderTop: '0.5px solid rgba(255,255,255,0.08)',
        padding: '2rem',
        textAlign: 'center',
      }}>
        <span style={{
          fontFamily: 'Georgia, serif',
          fontSize: '1.2rem',
          color: '#fafafa',
          letterSpacing: '0.15em',
        }}>AV<span style={{ color: '#C9A84C' }}>O</span>RA</span>
        <p style={{
          fontSize: '0.6rem',
          color: 'rgba(255,255,255,0.3)',
          marginTop: '0.5rem',
          letterSpacing: '0.1em',
        }}>© 2025 Avora. Buy. Sell. Connect — On Campus.</p>
      </footer>
    </main>
  )
}