'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '../../lib/AuthContext'
import { useCart } from '../../lib/CartContext'

export default function Navbar() {
  const [query, setQuery] = useState('')
  const [cartOpen, setCartOpen] = useState(false)
  const [wishlistOpen, setWishlistOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const { user, logout } = useAuth()
  const { cart, wishlist, removeFromCart, toggleWishlist, cartTotal } = useCart()

  const handleSearch = () => {
    if (query.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(query.trim())}`
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <>
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 2rem',
        background: '#fafafa',
        borderBottom: '0.5px solid rgba(0,0,0,0.09)',
        position: 'sticky',
        top: 0,
        zIndex: 200,
        gap: '1rem',
        flexWrap: 'wrap',
      }}>

        {/* LOGO */}
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{
            fontFamily: 'Georgia, serif',
            fontSize: '1.8rem',
            fontWeight: '500',
            letterSpacing: '0.15em',
            color: '#0a0a0a',
          }}>
            AV<span style={{ color: '#C9A84C' }}>O</span>RA
          </span>
        </Link>

        {/* SEARCH BAR */}
        <div style={{ flex: 1, maxWidth: '480px', position: 'relative' }}>
          <input
            type="text"
            placeholder="Search items, services, stores..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              width: '100%',
              padding: '0.65rem 3rem 0.65rem 1.1rem',
              border: '0.5px solid rgba(0,0,0,0.09)',
              background: '#f5f3ee',
              fontFamily: 'Arial, sans-serif',
              fontSize: '0.72rem',
              color: '#0a0a0a',
              outline: 'none',
              borderRadius: '0',
              boxSizing: 'border-box',
            }}
          />
          <button onClick={handleSearch} style={{
            position: 'absolute',
            right: 0, top: 0, bottom: 0,
            width: '42px',
            background: '#0a0a0a',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24"
              fill="none" stroke="#fafafa" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
          </button>
        </div>

        {/* NAV ACTIONS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>

          {/* Messages */}
          <NavIconBtn title="Messages">
            <svg width="16" height="16" viewBox="0 0 24 24"
              fill="none" stroke="#0a0a0a" strokeWidth="1.5">
              <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03
                8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512
                15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
          </NavIconBtn>

        
          
          {/* AUTH */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  background: '#fafafa',
                  border: 'none',
                  padding: '0.45rem 1rem 0.45rem 0.45rem', cursor: 'pointer',
                }}>
                <div style={{
                  width: '50px', height: '50px', borderRadius: '50%',
                  background: '#C9A84C', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem', fontWeight: '700', color: '#0a0a0a',
                }}>
                  {user.displayName ? user.displayName[0].toUpperCase() : user.email[0].toUpperCase()}
                </div>
                <span style={{
                  fontSize: '0.6rem', color: '#fafafa', letterSpacing: '0.05em',
                  maxWidth: '80px', overflow: 'hidden',
                  textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {/*{user.displayName || user.email.split('@')[0]}*/}
                </span>
               {/* <svg width="10" height="10" viewBox="0 0 24 24"
                  fill="none" stroke="#fafafa" strokeWidth="2">
                  <path d="M6 9l6 6 6-6"/>
                </svg> */}
              </button>

              {profileOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  background: '#fff', border: '0.5px solid rgba(0,0,0,0.09)',
                  minWidth: '180px', zIndex: 300,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}>
                  {[
                    { label: '👤 My Profile', href: '/profile' },
                    { label: '📦 My Orders', href: '/orders' },
                    { label: '🏪 My Store', href: '/store' },
                    { label: '💰 My Wallet', href: '#' },
                    { label: '⚙️ Settings', href: '#' },
                  ].map(item => (
                    <a key={item.label} href={item.href} style={{
                      display: 'block', padding: '0.75rem 1rem',
                      fontSize: '0.65rem', color: '#0a0a0a',
                      fontWeight: "700",
                      textDecoration: 'none',
                      borderBottom: '0.5px solid rgba(0,0,0,0.06)',
                      letterSpacing: '0.03em',
                    }}>{item.label}</a>
                  ))}
                  <button onClick={logout} style={{
                    display: 'block', width: '100%',
                    padding: '0.75rem 1rem', fontSize: '0.65rem',
                    color: '#c0392b', background: 'none', border: 'none',
                    textAlign: 'left', cursor: 'pointer', letterSpacing: '0.03em',
                  }}>🚪 Log Out</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/signup" style={{ textDecoration: 'none' }}>
                <button style={{
                  background: '#0a0a0a', color: '#fafafa', border: 'none',
                  padding: '0.55rem 1.2rem', fontFamily: 'Arial, sans-serif',
                  fontSize: '0.6rem', fontWeight: '600',
                  letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer',
                }}>Sign Up</button>
              </Link>
              <Link href="/login" style={{ textDecoration: 'none' }}>
                <button style={{
                  background: 'transparent', color: '#0a0a0a',
                  border: '0.5px solid rgba(0,0,0,0.15)',
                  padding: '0.55rem 1.2rem', fontFamily: 'Arial, sans-serif',
                  fontSize: '0.6rem', letterSpacing: '0.2em',
                  textTransform: 'uppercase', cursor: 'pointer',
                }}>Log In</button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* CART PANEL */}
      {cartOpen && (
        <div onClick={() => setCartOpen(false)} style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.4)', zIndex: 400,
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            position: 'absolute', top: 0, right: 0, bottom: 0,
            width: '380px', background: '#fff',
            padding: '2rem', overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontWeight: '400', fontSize: '1.3rem' }}>
                Cart ({cart.length})
              </h2>
              <button onClick={() => setCartOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            {cart.length === 0 ? (
              <p style={{ fontSize: '0.72rem', color: '#6a6a6a', textAlign: 'center', marginTop: '3rem' }}>
                Your cart is empty.<br />
                <a href="/marketplace" style={{ color: '#C9A84C' }}>Browse the marketplace →</a>
              </p>
            ) : (
              <>
                {cart.map(item => (
                  <div key={item.id} style={{
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    padding: '1rem 0', borderBottom: '0.5px solid rgba(0,0,0,0.06)',
                  }}>
                    <div style={{
                      width: '50px', height: '50px', background: '#f5f3ee',
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0,
                    }}>{item.emoji}</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.72rem', fontWeight: '600', marginBottom: '0.2rem' }}>{item.name}</p>
                      <p style={{ fontSize: '0.65rem', color: '#C9A84C' }}>{item.store}</p>
                      <p style={{ fontSize: '0.8rem', fontFamily: 'Georgia, serif' }}>₦{item.price.toLocaleString()}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} style={{
                      background: 'none', border: 'none',
                      color: '#c0392b', cursor: 'pointer', fontSize: '0.65rem',
                    }}>Remove</button>
                  </div>
                ))}
                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '0.5px solid rgba(0,0,0,0.09)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: '600' }}>Total</span>
                    <span style={{ fontFamily: 'Georgia, serif', fontSize: '1rem' }}>₦{cartTotal.toLocaleString()}</span>
                  </div>
                  <button style={{
                    width: '100%', background: '#0a0a0a', color: '#fafafa',
                    border: 'none', padding: '0.85rem',
                    fontSize: '0.6rem', letterSpacing: '0.2em',
                    textTransform: 'uppercase', fontWeight: '700', cursor: 'pointer',
                  }}>Proceed to Checkout</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* WISHLIST PANEL */}
      {wishlistOpen && (
        <div onClick={() => setWishlistOpen(false)} style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.4)', zIndex: 400,
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            position: 'absolute', top: 0, right: 0, bottom: 0,
            width: '380px', background: '#fff',
            padding: '2rem', overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontWeight: '400', fontSize: '1.3rem' }}>
                Wishlist ({wishlist.length})
              </h2>
              <button onClick={() => setWishlistOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            {wishlist.length === 0 ? (
              <p style={{ fontSize: '0.72rem', color: '#6a6a6a', textAlign: 'center', marginTop: '3rem' }}>
                Nothing saved yet.<br />
                <a href="/marketplace" style={{ color: '#C9A84C' }}>Explore items →</a>
              </p>
            ) : (
              wishlist.map(item => (
                <div key={item.id} style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  padding: '1rem 0', borderBottom: '0.5px solid rgba(0,0,0,0.06)',
                }}>
                  <div style={{
                    width: '50px', height: '50px', background: '#f5f3ee',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0,
                  }}>{item.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.72rem', fontWeight: '600', marginBottom: '0.2rem' }}>{item.name}</p>
                    <p style={{ fontSize: '0.65rem', color: '#C9A84C' }}>{item.store}</p>
                    <p style={{ fontSize: '0.8rem', fontFamily: 'Georgia, serif' }}>₦{item.price.toLocaleString()}</p>
                  </div>
                  <button onClick={() => toggleWishlist(item)} style={{
                    background: 'none', border: 'none',
                    color: '#c0392b', cursor: 'pointer', fontSize: '0.65rem',
                  }}>Remove</button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  )
}

function NavIconBtn({ children, title, onClick }) {
  return (
    <button title={title} onClick={onClick} style={{
      width: '36px', height: '36px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      border: '0.5px solid rgba(0,0,0,0.09)',
      background: 'transparent', cursor: 'pointer',
    }}>
      {children}
    </button>
  )
}