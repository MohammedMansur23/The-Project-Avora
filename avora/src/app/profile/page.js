'use client'
import { useState } from 'react'
import { useAuth } from '../../lib/AuthContext'
import { updateProfile, updateEmail, updatePassword } from 'firebase/auth'
import { auth } from '../../lib/firebase'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(false)

  const [profileForm, setProfileForm] = useState({
    displayName: user?.displayName || '',
    photoURL: user?.photoURL || '',
  })

  const [emailForm, setEmailForm] = useState({
    newEmail: user?.email || '',
  })

  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: '',
  })

  const [preferences, setPreferences] = useState({
    s2sEnabled: false,
    emailNotifications: true,
    orderUpdates: true,
    dealAlerts: false,
    pulseAlerts: true,
  })

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const saveProfile = async () => {
    if (!profileForm.displayName.trim()) {
      showToast('⚠️ Name cannot be empty')
      return
    }
    setLoading(true)
    try {
      await updateProfile(auth.currentUser, {
        displayName: profileForm.displayName,
        photoURL: profileForm.photoURL || null,
      })
      showToast('✅ Profile updated!')
    } catch (err) {
      showToast('❌ Failed to update profile')
    }
    setLoading(false)
  }

  const saveEmail = async () => {
    if (!emailForm.newEmail.trim()) {
      showToast('⚠️ Email cannot be empty')
      return
    }
    setLoading(true)
    try {
      await updateEmail(auth.currentUser, emailForm.newEmail)
      showToast('✅ Email updated!')
    } catch (err) {
      if (err.code === 'auth/requires-recent-login') {
        showToast('⚠️ Please log out and log back in to change your email')
      } else {
        showToast('❌ Failed to update email')
      }
    }
    setLoading(false)
  }

  const savePassword = async () => {
    if (!passwordForm.newPassword) {
      showToast('⚠️ Password cannot be empty')
      return
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('⚠️ Passwords do not match')
      return
    }
    if (passwordForm.newPassword.length < 6) {
      showToast('⚠️ Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      await updatePassword(auth.currentUser, passwordForm.newPassword)
      setPasswordForm({ newPassword: '', confirmPassword: '' })
      showToast('✅ Password updated!')
    } catch (err) {
      if (err.code === 'auth/requires-recent-login') {
        showToast('⚠️ Please log out and log back in to change your password')
      } else {
        showToast('❌ Failed to update password')
      }
    }
    setLoading(false)
  }

  if (!user) {
    return (
      <main style={{ padding: '5rem 2rem', textAlign: 'center' }}>
        <p style={{ fontSize: '0.85rem', color: '#6a6a6a', marginBottom: '1.5rem' }}>
          You need to be logged in to view your profile.
        </p>
        <a href="/login" style={{
          background: '#0a0a0a', color: '#fafafa',
          padding: '0.7rem 2rem', fontSize: '0.6rem',
          letterSpacing: '0.2em', textTransform: 'uppercase',
          textDecoration: 'none', fontWeight: '600',
        }}>Log In</a>
      </main>
    )
  }

  const TABS = [
    { id: 'profile', label: '👤 Profile' },
    { id: 'account', label: '🔐 Account' },
    { id: 'preferences', label: '⚙️ Preferences' },
    { id: 'seller', label: '🏪 Seller' },
  ]

  return (
    <main style={{ minHeight: '100vh', background: '#f5f3ee' }}>

      {/* TOAST */}
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

      {/* HEADER */}
      <div style={{ background: '#0a0a0a', padding: '2.5rem 2rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: '#C9A84C', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '1.5rem', fontWeight: '700',
            color: '#0a0a0a', flexShrink: 0, overflow: 'hidden',
          }}>
            {user.photoURL ? (
              <img src={user.photoURL} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              (user.displayName || user.email || '?')[0].toUpperCase()
            )}
          </div>
          <div>
            <p style={{ fontSize: '0.55rem', letterSpacing: '0.3em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: '0.3rem' }}>My Account</p>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.6rem', fontWeight: '400', color: '#fafafa' }}>
              {user.displayName || 'Avora User'}
            </h1>
            <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.45)', marginTop: '0.2rem' }}>{user.email}</p>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ background: '#fff', borderBottom: '0.5px solid rgba(0,0,0,0.09)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex' }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              padding: '1rem 1.5rem', fontSize: '0.6rem',
              letterSpacing: '0.12em', textTransform: 'uppercase',
              border: 'none', background: 'transparent',
              color: activeTab === tab.id ? '#0a0a0a' : '#6a6a6a',
              borderBottom: activeTab === tab.id ? '2px solid #C9A84C' : '2px solid transparent',
              cursor: 'pointer', fontWeight: activeTab === tab.id ? '600' : '400',
            }}>{tab.label}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.09)', padding: '2rem' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', fontWeight: '400', marginBottom: '1.5rem' }}>
              Profile Information
            </h2>

            {/* AVATAR */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={{
                width: '72px', height: '72px', borderRadius: '50%',
                background: '#f5f3ee', border: '0.5px solid rgba(0,0,0,0.09)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.8rem', overflow: 'hidden', flexShrink: 0,
              }}>
                {profileForm.photoURL ? (
                  <img src={profileForm.photoURL} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  (user.displayName || user.email || '?')[0].toUpperCase()
                )}
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6a6a6a', marginBottom: '0.4rem' }}>
                  Profile Picture URL
                </label>
                <input
                  placeholder="https://your-image-url.com/photo.jpg"
                  value={profileForm.photoURL}
                  onChange={e => setProfileForm({ ...profileForm, photoURL: e.target.value })}
                  style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }}
                />
                <p style={{ fontSize: '0.55rem', color: '#6a6a6a', marginTop: '0.3rem' }}>
                  Paste a direct image URL. Full image upload coming soon.
                </p>
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6a6a6a', marginBottom: '0.4rem' }}>
                Display Name
              </label>
              <input
                placeholder="Your name"
                value={profileForm.displayName}
                onChange={e => setProfileForm({ ...profileForm, displayName: e.target.value })}
                style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6a6a6a', marginBottom: '0.4rem' }}>
                Email Address
              </label>
              <input
                value={user.email}
                disabled
                style={{ ...inputStyle, width: '100%', boxSizing: 'border-box', opacity: 0.5, cursor: 'not-allowed' }}
              />
              <p style={{ fontSize: '0.55rem', color: '#6a6a6a', marginTop: '0.3rem' }}>
                To change your email go to the Account tab.
              </p>
            </div>

            <button onClick={saveProfile} disabled={loading} style={{
              background: '#0a0a0a', color: '#fafafa',
              border: 'none', padding: '0.75rem 2rem',
              fontSize: '0.6rem', letterSpacing: '0.2em',
              textTransform: 'uppercase', fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}>{loading ? 'Saving...' : 'Save Profile'}</button>
          </div>
        )}

        {/* ACCOUNT TAB */}
        {activeTab === 'account' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* CHANGE EMAIL */}
            <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.09)', padding: '2rem' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', fontWeight: '400', marginBottom: '1.5rem' }}>
                Change Email
              </h2>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6a6a6a', marginBottom: '0.4rem' }}>
                  New Email Address
                </label>
                <input
                  type="email"
                  placeholder="new@email.com"
                  value={emailForm.newEmail}
                  onChange={e => setEmailForm({ newEmail: e.target.value })}
                  style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }}
                />
              </div>
              <button onClick={saveEmail} disabled={loading} style={{
                background: '#0a0a0a', color: '#fafafa',
                border: 'none', padding: '0.75rem 2rem',
                fontSize: '0.6rem', letterSpacing: '0.2em',
                textTransform: 'uppercase', fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}>{loading ? 'Saving...' : 'Update Email'}</button>
            </div>

            {/* CHANGE PASSWORD */}
            <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.09)', padding: '2rem' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', fontWeight: '400', marginBottom: '1.5rem' }}>
                Change Password
              </h2>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6a6a6a', marginBottom: '0.4rem' }}>
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="New password (min 6 characters)"
                  value={passwordForm.newPassword}
                  onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6a6a6a', marginBottom: '0.4rem' }}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  placeholder="Repeat new password"
                  value={passwordForm.confirmPassword}
                  onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }}
                />
              </div>
              <button onClick={savePassword} disabled={loading} style={{
                background: '#0a0a0a', color: '#fafafa',
                border: 'none', padding: '0.75rem 2rem',
                fontSize: '0.6rem', letterSpacing: '0.2em',
                textTransform: 'uppercase', fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}>{loading ? 'Saving...' : 'Update Password'}</button>
            </div>

            {/* DANGER ZONE */}
            <div style={{ background: '#fff', border: '0.5px solid rgba(233,30,99,0.2)', padding: '2rem' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', fontWeight: '400', color: '#e91e63', marginBottom: '0.5rem' }}>
                Danger Zone
              </h2>
              <p style={{ fontSize: '0.7rem', color: '#6a6a6a', marginBottom: '1.5rem' }}>
                These actions are permanent and cannot be undone.
              </p>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to log out?')) logout()
                }}
                style={{
                  background: 'transparent', color: '#e91e63',
                  border: '0.5px solid #e91e63', padding: '0.65rem 1.5rem',
                  fontSize: '0.6rem', letterSpacing: '0.15em',
                  textTransform: 'uppercase', cursor: 'pointer',
                }}>Log Out</button>
            </div>
          </div>
        )}

        {/* PREFERENCES TAB */}
        {activeTab === 'preferences' && (
          <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.09)', padding: '2rem' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', fontWeight: '400', marginBottom: '1.5rem' }}>
              Preferences
            </h2>
            {[
              { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive emails about your orders and account activity' },
              { key: 'orderUpdates', label: 'Order Updates', desc: 'Get notified when your order status changes' },
              { key: 'dealAlerts', label: 'Flash Deal Alerts', desc: 'Be the first to know about time-limited deals' },
              { key: 'pulseAlerts', label: 'Avora Pulse Responses', desc: 'Get notified when a seller responds to your Pulse request' },
              { key: 's2sEnabled', label: 'Enable S2S Selling', desc: 'Allow you to post items for sale without opening a full store' },
            ].map(pref => (
              <div key={pref.key} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '1rem 0', borderBottom: '0.5px solid rgba(0,0,0,0.06)',
                gap: '1rem',
              }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.2rem' }}>{pref.label}</p>
                  <p style={{ fontSize: '0.62rem', color: '#6a6a6a', lineHeight: 1.5 }}>{pref.desc}</p>
                </div>
                <button
                  onClick={() => {
                    setPreferences(prev => ({ ...prev, [pref.key]: !prev[pref.key] }))
                    showToast(`${preferences[pref.key] ? '🔕 Disabled' : '🔔 Enabled'}: ${pref.label}`)
                  }}
                  style={{
                    width: '48px', height: '26px', borderRadius: '13px',
                    border: 'none', cursor: 'pointer', flexShrink: 0,
                    background: preferences[pref.key] ? '#C9A84C' : '#ddd',
                    position: 'relative', transition: 'background 0.2s ease',
                  }}>
                  <div style={{
                    position: 'absolute', top: '3px',
                    left: preferences[pref.key] ? '25px' : '3px',
                    width: '20px', height: '20px', borderRadius: '50%',
                    background: '#fff', transition: 'left 0.2s ease',
                  }} />
                </button>
              </div>
            ))}

            <div style={{ marginTop: '1.5rem' }}>
              <button
                onClick={() => showToast('✅ Preferences saved!')}
                style={{
                  background: '#0a0a0a', color: '#fafafa',
                  border: 'none', padding: '0.75rem 2rem',
                  fontSize: '0.6rem', letterSpacing: '0.2em',
                  textTransform: 'uppercase', fontWeight: '700', cursor: 'pointer',
                }}>Save Preferences</button>
            </div>
          </div>
        )}

        {/* SELLER TAB */}
        {activeTab === 'seller' && (
          <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.09)', padding: '2rem' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', fontWeight: '400', marginBottom: '0.5rem' }}>
              Seller Access
            </h2>
            <p style={{ fontSize: '0.72rem', color: '#6a6a6a', marginBottom: '2rem', lineHeight: 1.7 }}>
              Want to sell on Avora? Open a store and start reaching thousands of students on campus.
              It's completely free to get started.
            </p>

            <div style={{
              background: '#f5f3ee', padding: '1.5rem',
              border: '0.5px solid rgba(201,168,76,0.3)', marginBottom: '1.5rem',
            }}>
              {[
                '🏪 Your own verified store page',
                '📦 Manage orders from one dashboard',
                '💰 Get paid securely via Avora Wallet',
                '📊 Track your revenue and performance',
                '⚡ Post Flash Deals to drive sales',
              ].map(item => (
                <p key={item} style={{ fontSize: '0.72rem', color: '#0a0a0a', marginBottom: '0.6rem', lineHeight: 1.6 }}>
                  {item}
                </p>
              ))}
            </div>

            <a href={typeof window !== 'undefined' && localStorage.getItem('avora_is_seller') === 'true' ? '/seller_dashboard' : '/open-a-store'} style={{
                display: 'inline-block',
                background: '#C9A84C', color: '#0a0a0a',
                padding: '0.85rem 2.5rem', fontSize: '0.65rem',
                letterSpacing: '0.2em', textTransform: 'uppercase',
                fontWeight: '700', textDecoration: 'none',
              }}>Open My Store Dashboard
            </a>
          </div>
        )}
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