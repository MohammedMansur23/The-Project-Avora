'use client'
import { useState, useEffect } from 'react'
import { signInWithGoogle, handleRedirectResult } from '../../lib/auth'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../lib/firebase'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const getRedirect = () => {
    const params = new URLSearchParams(window.location.search)
    return params.get('redirect') || '/marketplace'
  }

  useEffect(() => {
    handleRedirectResult().then(result => {
      if (result.success && result.user) {
        window.location.href = getRedirect()
      }
    })
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      setError('Please fill in all fields.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password)
      window.location.href = getRedirect()
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email.')
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.')
      } else if (err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.')
      } else {
        setError('Login failed. Please try again.')
      }
    }
    setLoading(false)
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: '#fafafa',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        maxWidth: '900px',
        width: '100%',
        border: '0.5px solid rgba(0,0,0,0.09)',
        overflow: 'hidden',
      }}>

        {/* LEFT PANEL */}
        <div style={{
          background: '#0a0a0a',
          padding: '3rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div>
            <span style={{
              fontFamily: 'Georgia, serif',
              fontSize: '1.8rem',
              color: '#fafafa',
              letterSpacing: '0.15em',
            }}>AV<span style={{ color: '#C9A84C' }}>O</span>RA</span>
            <p style={{
              fontSize: '0.6rem',
              color: 'rgba(255,255,255,0.4)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginTop: '0.4rem',
            }}>Buy. Sell. Connect — On Campus.</p>
          </div>

          <div>
            <h2 style={{
              fontFamily: 'Georgia, serif',
              fontSize: '2rem',
              color: '#fafafa',
              fontWeight: '400',
              lineHeight: 1.3,
              marginBottom: '1.5rem',
            }}>
              Good to have you back.
            </h2>
            {[
              '🏪 Your favourite stores are waiting',
              '🛡️ Your wallet balance is safe',
              '📦 Check on your orders',
              '💬 Continue your conversations',
            ].map(item => (
              <p key={item} style={{
                fontSize: '0.72rem',
                color: 'rgba(255,255,255,0.6)',
                marginBottom: '0.75rem',
                lineHeight: 1.6,
              }}>{item}</p>
            ))}
          </div>

          <p style={{
            fontSize: '0.6rem',
            color: 'rgba(255,255,255,0.25)',
            letterSpacing: '0.1em',
          }}>© 2025 Avora</p>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ background: '#fff', padding: '3rem' }}>
          <h3 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '1.5rem',
            fontWeight: '400',
            color: '#0a0a0a',
            marginBottom: '0.4rem',
          }}>Welcome back</h3>
          <p style={{
            fontSize: '0.7rem',
            color: '#6a6a6a',
            marginBottom: '2rem',
          }}>Log in to your Avora account.</p>

          {/* GOOGLE BUTTON */}
          <button
            onClick={async () => {
              const result = await signInWithGoogle()
              if (result.success && result.user) {
                window.location.href = getRedirect()
              }
            }}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '0.5px solid rgba(0,0,0,0.15)',
              background: '#fff',
              fontSize: '0.65rem',
              letterSpacing: '0.1em',
              cursor: 'pointer',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}>
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              <path fill="none" d="M0 0h48v48H0z"/>
            </svg>
            Continue with Google
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1.5rem',
          }}>
            <div style={{ flex: 1, height: '0.5px', background: 'rgba(0,0,0,0.09)' }} />
            <span style={{ fontSize: '0.6rem', color: '#6a6a6a' }}>or</span>
            <div style={{ flex: 1, height: '0.5px', background: 'rgba(0,0,0,0.09)' }} />
          </div>

          <input name="email" type="email" placeholder="Email address"
            value={form.email} onChange={handleChange}
            style={{ ...inputStyle, width: '100%', marginBottom: '0.75rem', boxSizing: 'border-box' }} />

          <input name="password" type="password" placeholder="Password"
            value={form.password} onChange={handleChange}
            style={{ ...inputStyle, width: '100%', marginBottom: '0.5rem', boxSizing: 'border-box' }} />

          <div style={{ textAlign: 'right', marginBottom: '1.25rem' }}>
            <a href="#" style={{
              fontSize: '0.62rem',
              color: '#C9A84C',
              textDecoration: 'none',
            }}>Forgot password?</a>
          </div>

          {error && (
            <p style={{ color: 'red', fontSize: '0.65rem', marginBottom: '0.75rem' }}>{error}</p>
          )}

          <button onClick={handleLogin} style={{
            width: '100%',
            background: '#0a0a0a',
            color: '#fafafa',
            border: 'none',
            padding: '0.85rem',
            fontSize: '0.6rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            fontWeight: '700',
            cursor: 'pointer',
            marginBottom: '1rem',
          }}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>

          <p style={{ fontSize: '0.62rem', color: '#6a6a6a', textAlign: 'center' }}>
            Don't have an account?{' '}
            <a href="/signup" style={{ color: '#C9A84C', textDecoration: 'none', fontWeight: '600' }}>
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}

const inputStyle = {
  padding: '0.7rem 0.9rem',
  border: '0.5px solid rgba(0,0,0,0.15)',
  background: '#fafafa',
  fontSize: '0.72rem',
  color: '#0a0a0a',
  outline: 'none',
  fontFamily: 'Arial, sans-serif',
}