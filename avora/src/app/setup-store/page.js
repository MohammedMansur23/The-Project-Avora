'use client'
import { useState } from 'react'
import { useAuth } from '../../lib/AuthContext'
import { createStore } from '../../lib/firestore'
import { uploadImage } from '../../lib/cloudinary'

const CATEGORIES = [
  'Food & Drinks', 'Fashion', 'Electronics', 'Books',
  'Beauty & Hair', 'Repairs', 'Printing', 'Footwear',
  'Tutoring', 'Laundry', 'Photography', 'Second-hand', 'General',
]

export default function SetupStore() {
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [logoFile, setLogoFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState('')
  const [form, setForm] = useState({
    storeName: '',
    category: 'General',
    location: '',
    whatsapp: '',
    description: '',
    emoji: '🏪',
  })

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleStep1 = () => {
    if (!form.storeName.trim()) {
      showToast('⚠️ Please enter a store name')
      return
    }
    if (!form.location.trim()) {
      showToast('⚠️ Please enter your location')
      return
    }
    setStep(2)
  }

  const handleSubmit = async () => {
    if (!form.whatsapp.trim()) {
      showToast('⚠️ Please enter your WhatsApp number')
      return
    }
    setLoading(true)
    try {
      let logoUrl = form.emoji

      if (logoFile) {
        showToast('⏳ Uploading logo...')
        logoUrl = await uploadImage(logoFile)
      }

      await createStore(user.uid, {
        storeName: form.storeName,
        description: form.description,
        location: form.location,
        whatsapp: form.whatsapp,
        category: form.category,
        logo: logoUrl,
        ownerName: user.displayName || user.email,
        ownerEmail: user.email,
      })

      localStorage.setItem('avora_is_seller', 'true')
      window.location.href = '/seller_dashboard'
    } catch (err) {
      console.error(err)
      showToast('❌ Failed to create store. Please try again.')
    }
    setLoading(false)
  }

  if (!user) {
    return (
      <main style={{ minHeight: '100vh', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.85rem', color: '#6a6a6a', marginBottom: '1.5rem' }}>
            You need an account to open a store.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <a href="/signup" style={{
              background: '#C9A84C', color: '#0a0a0a',
              padding: '0.75rem 2rem', fontSize: '0.6rem',
              letterSpacing: '0.2em', textTransform: 'uppercase',
              fontWeight: '700', textDecoration: 'none',
            }}>Create Account</a>
            <a href="/login" style={{
              background: 'transparent', color: '#0a0a0a',
              border: '0.5px solid rgba(0,0,0,0.15)',
              padding: '0.75rem 2rem', fontSize: '0.6rem',
              letterSpacing: '0.2em', textTransform: 'uppercase',
              textDecoration: 'none',
            }}>Log In</a>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main style={{ minHeight: '100vh', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>

      {toast && (
        <div style={{
          position: 'fixed', bottom: '2rem', left: '50%',
          transform: 'translateX(-50%)',
          background: '#0a0a0a', color: '#fafafa',
          padding: '0.75rem 1.5rem', fontSize: '0.7rem',
          letterSpacing: '0.05em', zIndex: 9999, whiteSpace: 'nowrap',
          border: '0.5px solid rgba(255,255,255,0.15)',
        }}>{toast}</div>
      )}

      <div style={{
        maxWidth: '860px', width: '100%',
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        border: '0.5px solid rgba(0,0,0,0.09)', overflow: 'hidden',
      }}>

        {/* LEFT PANEL */}
        <div style={{
          background: '#0a0a0a', padding: '3rem',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          <div>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', color: '#fafafa', letterSpacing: '0.15em' }}>
              AV<span style={{ color: '#C9A84C' }}>O</span>RA
            </span>
            <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '0.4rem' }}>
              Seller Setup
            </p>
          </div>

          <div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', color: '#fafafa', fontWeight: '400', lineHeight: 1.3, marginBottom: '1.5rem' }}>
              Your store.<br />
              <span style={{ color: '#C9A84C' }}>Your rules.</span>
            </h2>
            {[
              '🏪 Free to open, free to run',
              '📦 Manage orders from one place',
              '💰 Get paid securely via Avora Wallet',
              '📣 Reach every student on campus',
              '⚡ Post Flash Deals to drive sales',
            ].map(item => (
              <p key={item} style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.75rem', lineHeight: 1.6 }}>
                {item}
              </p>
            ))}
          </div>

          {/* STEP INDICATORS */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {[1, 2].map(s => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: step >= s ? '#C9A84C' : 'rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.6rem', fontWeight: '700',
                  color: step >= s ? '#0a0a0a' : 'rgba(255,255,255,0.3)',
                }}>{s}</div>
                <span style={{ fontSize: '0.55rem', color: step >= s ? '#C9A84C' : 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {s === 1 ? 'Store Info' : 'Contact'}
                </span>
                {s < 2 && <div style={{ width: '24px', height: '0.5px', background: 'rgba(255,255,255,0.15)' }} />}
              </div>
            ))}
          </div>

          <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em' }}>© 2026 Avora</p>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ background: '#fff', padding: '3rem' }}>

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', fontWeight: '400', color: '#0a0a0a', marginBottom: '0.4rem' }}>
                Set up your store
              </h3>
              <p style={{ fontSize: '0.7rem', color: '#6a6a6a', marginBottom: '2rem' }}>
                Tell buyers who you are and what you sell.
              </p>

              {/* STORE LOGO */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={labelStyle}>Store Logo</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{
                    width: '60px', height: '60px', background: '#f5f3ee',
                    border: '0.5px solid rgba(0,0,0,0.09)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '2rem', overflow: 'hidden', flexShrink: 0,
                  }}>
                    {logoPreview
                      ? <img src={logoPreview} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : form.emoji || '🏪'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => {
                        const file = e.target.files[0]
                        if (file) {
                          setLogoFile(file)
                          setLogoPreview(URL.createObjectURL(file))
                        }
                      }}
                      style={{ fontSize: '0.65rem', marginBottom: '0.5rem', width: '100%' }}
                    />
                    <p style={{ fontSize: '0.55rem', color: '#6a6a6a', marginBottom: '0.3rem' }}>Or use an emoji:</p>
                    <input
                      name="emoji"
                      placeholder="e.g. 🍲"
                      value={form.emoji}
                      onChange={handleChange}
                      style={{ ...inputStyle, marginTop: '0' }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={labelStyle}>Store Name *</label>
                <input
                  name="storeName"
                  placeholder="e.g. Mama Tee's Kitchen"
                  value={form.storeName}
                  onChange={handleChange}
                  style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={labelStyle}>Category *</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  style={{ ...inputStyle, width: '100%', boxSizing: 'border-box', cursor: 'pointer' }}
                >
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={labelStyle}>Location / Hostel *</label>
                <input
                  name="location"
                  placeholder="e.g. Harmony Hostel, Block B"
                  value={form.location}
                  onChange={handleChange}
                  style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '1.75rem' }}>
                <label style={labelStyle}>Store Description</label>
                <textarea
                  name="description"
                  placeholder="Tell buyers what you offer..."
                  value={form.description}
                  onChange={handleChange}
                  style={{
                    ...inputStyle, width: '100%', boxSizing: 'border-box',
                    minHeight: '80px', resize: 'vertical',
                  }}
                />
              </div>

              <button onClick={handleStep1} style={{
                width: '100%', background: '#0a0a0a', color: '#fafafa',
                border: 'none', padding: '0.85rem',
                fontSize: '0.6rem', letterSpacing: '0.2em',
                textTransform: 'uppercase', fontWeight: '700', cursor: 'pointer',
              }}>Continue →</button>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', fontWeight: '400', color: '#0a0a0a', marginBottom: '0.4rem' }}>
                Contact details
              </h3>
              <p style={{ fontSize: '0.7rem', color: '#6a6a6a', marginBottom: '2rem' }}>
                How buyers can reach you directly.
              </p>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={labelStyle}>WhatsApp Number *</label>
                <input
                  name="whatsapp"
                  placeholder="e.g. 08012345678"
                  value={form.whatsapp}
                  onChange={handleChange}
                  style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }}
                />
              </div>

              {/* STORE PREVIEW */}
              <div style={{
                background: '#f5f3ee', border: '0.5px solid rgba(201,168,76,0.3)',
                padding: '1.25rem', marginBottom: '1.75rem',
              }}>
                <p style={{ fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6a6a6a', marginBottom: '0.75rem' }}>
                  Store Preview
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '44px', height: '44px', background: '#0a0a0a',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.4rem', overflow: 'hidden', flexShrink: 0,
                  }}>
                    {logoPreview
                      ? <img src={logoPreview} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : form.emoji || '🏪'}
                  </div>
                  <div>
                    <p style={{ fontSize: '0.85rem', fontWeight: '600', color: '#0a0a0a' }}>
                      {form.storeName || 'Your Store Name'}
                    </p>
                    <p style={{ fontSize: '0.6rem', color: '#C9A84C', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      {form.category} · {form.location || 'Your Location'}
                    </p>
                  </div>
                </div>
                {form.description && (
                  <p style={{ fontSize: '0.68rem', color: '#6a6a6a', marginTop: '0.75rem', lineHeight: 1.6 }}>
                    {form.description}
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={() => setStep(1)} style={{
                  flex: 1, background: 'transparent', color: '#0a0a0a',
                  border: '0.5px solid rgba(0,0,0,0.15)', padding: '0.85rem',
                  fontSize: '0.6rem', letterSpacing: '0.2em',
                  textTransform: 'uppercase', cursor: 'pointer',
                }}>← Back</button>
                <button onClick={handleSubmit} disabled={loading} style={{
                  flex: 2, background: '#C9A84C', color: '#0a0a0a',
                  border: 'none', padding: '0.85rem',
                  fontSize: '0.6rem', letterSpacing: '0.2em',
                  textTransform: 'uppercase', fontWeight: '700',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.8 : 1,
                }}>{loading ? 'Opening Your Store...' : '🏪 Open My Store'}</button>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}

const labelStyle = {
  display: 'block', fontSize: '0.55rem',
  letterSpacing: '0.15em', textTransform: 'uppercase',
  color: '#6a6a6a', marginBottom: '0.4rem',
}

const inputStyle = {
  padding: '0.7rem 0.9rem',
  border: '0.5px solid rgba(0,0,0,0.15)',
  background: '#fafafa', fontSize: '0.72rem',
  color: '#0a0a0a', outline: 'none',
  fontFamily: 'Arial, sans-serif',
}