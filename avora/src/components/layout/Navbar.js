'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '../../lib/AuthContext'
import { useCart } from '../../lib/CartContext'

export default function Navbar() {
  const [query, setQuery] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const { user, logout } = useAuth()
  const { cartTotal } = useCart()

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
      <style>{`
        .nav-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.8rem 1rem;
          background: #fafafa;
          border-bottom: 0.5px solid rgba(0,0,0,0.09);
          position: sticky;
          top: 0;
          z-index: 1000;
          gap: 1rem;
        }

        .search-wrapper {
          display: none; /* Hidden on mobile by default, shown in separate bar */
          flex: 1;
          max-width: 480px;
          position: relative;
        }

        .desktop-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .mobile-search-bar {
          display: block;
          padding: 0.5rem 1rem;
          background: #fafafa;
          border-bottom: 0.5px solid rgba(0,0,0,0.05);
        }

        @media (min-width: 768px) {
          .nav-container { padding: 1rem 2rem; }
          .search-wrapper { display: block; }
          .mobile-search-bar { display: none; }
        }

        .profile-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: #fff;
          border: 0.5px solid rgba(0,0,0,0.09);
          min-width: 200px;
          z-index: 1100;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
        }

        .dropdown-link {
          display: block;
          padding: 0.8rem 1.2rem;
          font-size: 0.7rem;
          font-weight: 600;
          color: #0a0a0a;
          text-decoration: none;
          border-bottom: 0.5px solid rgba(0,0,0,0.05);
          letter-spacing: 0.05em;
          text-transform: uppercase;
          transition: background 0.2s;
        }

        .dropdown-link:hover { background: #f9f9f9; }
      `}</style>

      <nav className="nav-container">
        {/* LOGO */}
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{
            fontFamily: 'Georgia, serif',
            fontSize: '1.5rem',
            fontWeight: '500',
            letterSpacing: '0.15em',
            color: '#0a0a0a',
          }}>
            AV<span style={{ color: '#C9A84C' }}>O</span>RA
          </span>
        </Link>

        {/* SEARCH BAR (Desktop Only) */}
        <div className="search-wrapper">
          <SearchInput
            query={query}
            setQuery={setQuery}
            onSearch={handleSearch}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* NAV ACTIONS */}
        <div className="desktop-actions">
          {/* Inbox Icon */}
          <NavIconBtn title="Inbox" href="/inbox">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="1.5">
              <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
            </svg>
          </NavIconBtn>

          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                style={{
                  display: 'flex', alignItems: 'center',
                  background: 'none', border: 'none', cursor: 'pointer', padding: 0
                }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: '#C9A84C', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.9rem', fontWeight: '700', color: '#0a0a0a',
                }}>
                  {user.displayName ? user.displayName[0].toUpperCase() : user.email[0].toUpperCase()}
                </div>
              </button>

              {profileOpen && (
                <div className="profile-dropdown">
                  <Link href="/profile" className="dropdown-link" onClick={() => setProfileOpen(false)}>👤 My Profile</Link>
                  {typeof window !== 'undefined' && localStorage.getItem('avora_is_seller') === 'true' && (
                    <>
                      <Link href='/seller_dashboard?tab=notes' className="dropdown-link" onClick={() => setProfileOpen(false)}>📝 My Notes</Link>
                      <Link href="/seller_dashboard" className="dropdown-link" onClick={() => setProfileOpen(false)}>🏪 My Store</Link>
                    </>
                  )}
                  <Link href="/wallet" className="dropdown-link" onClick={() => setProfileOpen(false)}>💰 My Wallet</Link>
                  <button onClick={logout} style={{
                    display: 'block', width: '100%', padding: '0.8rem 1.2rem',
                    fontSize: '0.7rem', fontWeight: '700', color: '#c0392b',
                    background: 'none', border: 'none', textAlign: 'left',
                    cursor: 'pointer', letterSpacing: '0.05em', textTransform: 'uppercase'
                  }}>🚪 Log Out</button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link href="/login" style={{ textDecoration: 'none' }}>
                <button style={{
                  background: 'transparent', color: '#0a0a0a',
                  border: '0.5px solid rgba(0,0,0,0.15)',
                  padding: '0.5rem 1rem', fontSize: '0.6rem',
                  letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer',
                }}>Log In</button>
              </Link>
              <Link href="/signup" style={{ textDecoration: 'none' }}>
                <button style={{
                  background: '#0a0a0a', color: '#fafafa', border: 'none',
                  padding: '0.5rem 1rem', fontSize: '0.6rem',
                  letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer',
                }}>Sign Up</button>
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* MOBILE SEARCH (Visible only on small screens) */}
      <div className="mobile-search-bar">
        <SearchInput
          query={query}
          setQuery={setQuery}
          onSearch={handleSearch}
          onKeyDown={handleKeyDown}
        />
      </div>
    </>
  )
}

/* Reusable Components to keep the main block clean */

function SearchInput({ query, setQuery, onSearch, onKeyDown }) {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        type="text"
        placeholder="Search Avora..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={onKeyDown}
        style={{
          width: '100%',
          padding: '0.6rem 2.5rem 0.6rem 1rem',
          border: '0.5px solid rgba(0,0,0,0.1)',
          background: '#f5f3ee',
          fontSize: '0.75rem',
          color: '#0a0a0a',
          outline: 'none',
          borderRadius: '2px',
          boxSizing: 'border-box',
        }}
      />
      <button onClick={onSearch} style={{
        position: 'absolute', right: 0, top: 0, bottom: 0,
        width: '40px', background: '#0a0a0a', border: 'none',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fafafa" strokeWidth="2">
          <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
        </svg>
      </button>
    </div>
  )
}

function NavIconBtn({ children, title, href }) {
  return (
    <Link href={href || "#"} title={title} style={{
      width: '36px', height: '36px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      border: '0.5px solid rgba(0,0,0,0.06)',
      background: 'transparent', textDecoration: 'none'
    }}>
      {children}
    </Link>
  )
}