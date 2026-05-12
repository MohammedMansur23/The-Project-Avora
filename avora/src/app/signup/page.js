'use client'
import { useState } from 'react'
import { signInWithGoogle } from '../../lib/auth'

export default function SignUp() {
  const [step, setStep] = useState('form')
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: ''
  })
  const [code, setCode] = useState('')
  const [sentCode, setSentCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if (!form.firstName || !form.email || !form.password) {
      setError('Please fill in all required fields.')
      return
    }
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, firstName: form.firstName }),
      })
      const data = await res.json()

      if (data.success) {
        setSentCode(data.code)
        setStep('verify')
      } else {
        setError('Failed to send verification email. Please try again.')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  const handleVerify = () => {
    if (code === sentCode) {
      window.location.href = '/marketplace'
    } else {
      setError('Incorrect code. Please try again.')
    }
  }

  // --- SHARED STYLE LOGIC ---
  const sharedStyles = (
    <style>{`
      .main-wrapper {
        min-height: 100vh;
        background: #fafafa;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
      }
      .signup-card {
        display: flex;
        flex-direction: column;
        max-width: 900px;
        width: 100%;
        border: 0.5px solid rgba(0,0,0,0.09);
        background: #fff;
        overflow: hidden;
      }
      .left-panel {
        background: #0a0a0a;
        padding: 2.5rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 3rem;
      }
      .right-panel {
        padding: 2.5rem;
      }
      .name-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 0.75rem;
        margin-bottom: 0.75rem;
      }
      
      @media (min-width: 768px) {
        .main-wrapper { padding: 2rem; }
        .signup-card { flex-direction: row; }
        .left-panel, .right-panel { flex: 1; padding: 3rem; }
        .name-grid { grid-template-columns: 1fr 1fr; }
      }

      .verify-card {
        max-width: 420px;
        width: 100%;
        border: 0.5px solid rgba(0,0,0,0.09);
        padding: 2.5rem;
        background: #fff;
        text-align: center;
      }
    `}</style>
  )

  // --- STEP: VERIFY ---
  if (step === 'verify') {
    return (
      <main className="main-wrapper">
        {sharedStyles}
        <div className="verify-card">
          <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', color: '#0a0a0a', letterSpacing: '0.15em' }}>
            AV<span style={{ color: '#C9A84C' }}>O</span>RA
          </span>

          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', fontWeight: '400', color: '#0a0a0a', margin: '1.5rem 0 0.5rem' }}>
            Check your email
          </h3>
          <p style={{ fontSize: '0.72rem', color: '#6a6a6a', marginBottom: '2rem', lineHeight: 1.6 }}>
            We sent a 6-digit code to<br />
            <strong style={{ color: '#0a0a0a' }}>{form.email}</strong>
          </p>

          <input
            type="text"
            maxLength={6}
            placeholder="000000"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{
              ...inputStyle,
              width: '100%',
              boxSizing: 'border-box',
              textAlign: 'center',
              fontSize: '1.5rem',
              letterSpacing: '0.3em',
              marginBottom: '1rem',
              padding: '1rem',
            }}
          />

          {error && <p style={{ color: 'red', fontSize: '0.65rem', marginBottom: '1rem' }}>{error}</p>}

          <button onClick={handleVerify} style={btnStyle}>Verify & Continue</button>

          <p style={{ fontSize: '0.62rem', color: '#6a6a6a', marginTop: '1rem' }}>
            Didn't get the code?{' '}
            <span onClick={handleSubmit} style={{ color: '#C9A84C', cursor: 'pointer', fontWeight: '600' }}>Resend</span>
          </p>
        </div>
      </main>
    )
  }

  // --- STEP: FORM ---
  return (
    <main className="main-wrapper">
      {sharedStyles}
      <div className="signup-card">
        {/* LEFT PANEL */}
        <div className="left-panel">
          <div>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', color: '#fafafa', letterSpacing: '0.15em' }}>
              AV<span style={{ color: '#C9A84C' }}>O</span>RA
            </span>
            <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '0.4rem' }}>
              Buy. Sell. Connect — On Campus.
            </p>
          </div>

          <div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', color: '#fafafa', fontWeight: '400', lineHeight: 1.3, marginBottom: '1.5rem' }}>
              Join thousands of students on campus.
            </h2>
            {[
              '🏪 Discover stores & services near you',
              '🛡️ Shop with full payment protection',
              '📣 Post requests via Avora Pulse',
              '💬 Chat directly with sellers',
            ].map(item => (
              <p key={item} style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.75rem', lineHeight: 1.6 }}>
                {item}
              </p>
            ))}
          </div>

          <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em' }}>© 2026 Avora</p>
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', fontWeight: '400', color: '#0a0a0a', marginBottom: '0.4rem' }}>
            Create your account
          </h3>
          <p style={{ fontSize: '0.7rem', color: '#6a6a6a', marginBottom: '2rem' }}>It's free. No card required.</p>

          <button
            onClick={async () => {
              const result = await signInWithGoogle()
              if (result.success) window.location.href = '/marketplace'
              else setError('Google sign-in failed. Please try again.')
            }}
            style={googleBtnStyle}>
            <GoogleIcon /> Continue with Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ flex: 1, height: '0.5px', background: 'rgba(0,0,0,0.09)' }} />
            <span style={{ fontSize: '0.6rem', color: '#6a6a6a' }}>or</span>
            <div style={{ flex: 1, height: '0.5px', background: 'rgba(0,0,0,0.09)' }} />
          </div>

          <div className="name-grid">
            <input name="firstName" placeholder="First name *" value={form.firstName} onChange={handleChange} style={inputStyle} />
            <input name="lastName" placeholder="Last name" value={form.lastName} onChange={handleChange} style={inputStyle} />
          </div>

          <input name="email" type="email" placeholder="Email address *" value={form.email} onChange={handleChange}
            style={{ ...inputStyle, width: '100%', marginBottom: '0.75rem', boxSizing: 'border-box' }} />
          <input name="phone" type="tel" placeholder="Phone number" value={form.phone} onChange={handleChange}
            style={{ ...inputStyle, width: '100%', marginBottom: '0.75rem', boxSizing: 'border-box' }} />
          <input name="password" type="password" placeholder="Password *" value={form.password} onChange={handleChange}
            style={{ ...inputStyle, width: '100%', marginBottom: '1.25rem', boxSizing: 'border-box' }} />

          {error && <p style={{ color: 'red', fontSize: '0.65rem', marginBottom: '0.75rem' }}>{error}</p>}

          <button onClick={handleSubmit} style={btnStyle}>
            {loading ? 'Sending Code...' : 'Create My Account'}
          </button>

          <p style={{ fontSize: '0.62rem', color: '#6a6a6a', textAlign: 'center', marginTop: '1rem' }}>
            Already have an account?{' '}
            <a href="/login" style={{ color: '#C9A84C', textDecoration: 'none', fontWeight: '600' }}>Log In</a>
          </p>

          <div style={sellerBoxStyle}>
            <p style={{ fontSize: '0.65rem', color: '#0a0a0a', marginBottom: '0.4rem' }}>Want to sell on Avora?</p>
            <a href="/open-a-store" style={{ fontSize: '0.6rem', color: '#C9A84C', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none' }}>
              Open a Store →
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}

// --- STYLES ---
const inputStyle = {
  padding: '0.7rem 0.9rem',
  border: '0.5px solid rgba(0,0,0,0.15)',
  background: '#fafafa',
  fontSize: '0.72rem',
  color: '#0a0a0a',
  outline: 'none',
  fontFamily: 'Arial, sans-serif',
}

const btnStyle = {
  width: '100%', background: '#0a0a0a', color: '#fafafa',
  border: 'none', padding: '0.85rem', fontSize: '0.6rem',
  letterSpacing: '0.2em', textTransform: 'uppercase',
  fontWeight: '700', cursor: 'pointer',
}

const googleBtnStyle = {
  width: '100%', padding: '0.75rem', border: '0.5px solid rgba(0,0,0,0.15)',
  background: '#fff', fontSize: '0.65rem', letterSpacing: '0.1em',
  cursor: 'pointer', marginBottom: '1.5rem', display: 'flex',
  alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
}

const sellerBoxStyle = {
  marginTop: '1.5rem', background: '#f5f3ee',
  border: '0.5px solid rgba(201,168,76,0.3)', padding: '1rem', textAlign: 'center',
}

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
)