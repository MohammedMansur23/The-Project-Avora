'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

const ALL_PRODUCTS = [
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

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [results, setResults] = useState([])
  const [cart, setCart] = useState([])

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

  const addToCart = (product) => {
    setCart(prev => [...prev, product])
    alert(`✅ ${product.name} added to cart!`)
  }

  return (
    <main style={{ padding: '3rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>

      {/* SEARCH HEADER */}
      <div style={{ marginBottom: '2rem' }}>
        <p style={{
          fontSize: '0.6rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#C9A84C',
          marginBottom: '0.5rem',
        }}>Search Results</p>
        <h1 style={{
          fontFamily: 'Georgia, serif',
          fontSize: '2rem',
          fontWeight: '400',
          color: '#0a0a0a',
        }}>
          {results.length > 0
            ? `${results.length} result${results.length > 1 ? 's' : ''} for "${query}"`
            : `No results for "${query}"`}
        </h1>
      </div>

      {/* NO RESULTS */}
      {results.length === 0 && (
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
          }}>Nothing found for "{query}"</h2>
          <p style={{ fontSize: '0.75rem', color: '#6a6a6a', marginBottom: '1.5rem' }}>
            Try a different keyword, or post a request on Avora Pulse and let sellers come to you.
          </p>
          <a href="/" style={{
            background: '#0a0a0a',
            color: '#fafafa',
            padding: '0.7rem 2rem',
            fontSize: '0.6rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            fontWeight: '600',
          }}>Back to Home</a>
        </div>
      )}

      {/* RESULTS GRID */}
      {results.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '1.2rem',
        }}>
          {results.map(product => (
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
      )}
    </main>
  )
}