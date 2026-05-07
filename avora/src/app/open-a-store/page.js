'use client'
import { useAuth } from '../../lib/AuthContext'

export default function OpenAStore() {
  const { user } = useAuth()

  return (
    <main style={{ minHeight: '100vh', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ maxWidth: '600px', width: '100%', textAlign: 'center' }}>

        <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🏪</div>

        <p style={{ fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '0.75rem' }}>
          Start Selling on Avora
        </p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: '400', color: '#0a0a0a', marginBottom: '1rem', lineHeight: 1.3 }}>
          Turn your products into profit.
        </h1>
        <p style={{ fontSize: '0.78rem', color: '#6a6a6a', lineHeight: 1.8, marginBottom: '2.5rem', maxWidth: '440px', margin: '0 auto 2.5rem' }}>
          Open your free Avora store and reach thousands of students on campus. No setup fees. No monthly charges. You only pay when you make a sale.
        </p>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '1rem', marginBottom: '2.5rem', textAlign: 'left',
        }}>
          {[
            { icon: '📦', title: 'List Products', desc: 'Add your items with photos and prices in minutes' },
            { icon: '💬', title: 'Chat with Buyers', desc: 'Respond to messages directly from your dashboard' },
            { icon: '💰', title: 'Get Paid Safely', desc: 'Payments held in escrow until delivery is confirmed' },
            { icon: '📊', title: 'Track Everything', desc: 'See your orders, revenue, and performance in one place' },
          ].map(f => (
            <div key={f.title} style={{ border: '0.5px solid rgba(0,0,0,0.09)', padding: '1.25rem', background: '#fff' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{f.icon}</div>
              <p style={{ fontSize: '0.72rem', fontWeight: '600', marginBottom: '0.3rem' }}>{f.title}</p>
              <p style={{ fontSize: '0.62rem', color: '#6a6a6a', lineHeight: 1.5 }}>{f.desc}</p>
            </div>
          ))}
        </div>

        {user ? (
          <button
            onClick={() => {
              localStorage.setItem('avora_is_seller', 'true')
              window.location.href = '/seller_dashboard'
            }}
            style={{
              background: '#C9A84C', color: '#0a0a0a',
              border: 'none', padding: '1rem 3rem',
              fontSize: '0.65rem', letterSpacing: '0.2em',
              textTransform: 'uppercase', fontWeight: '700', cursor: 'pointer',
            }}>Open My Store — It's Free</button>
        ) : (
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/signup" style={{
              background: '#C9A84C', color: '#0a0a0a',
              padding: '1rem 2.5rem', fontSize: '0.65rem',
              letterSpacing: '0.2em', textTransform: 'uppercase',
              fontWeight: '700', textDecoration: 'none',
            }}>Sign Up & Open Store</a>
            <a href="/login" style={{
              background: 'transparent', color: '#0a0a0a',
              border: '0.5px solid rgba(0,0,0,0.15)',
              padding: '1rem 2.5rem', fontSize: '0.65rem',
              letterSpacing: '0.2em', textTransform: 'uppercase',
              textDecoration: 'none',
            }}>Already have an account?</a>
          </div>
        )}
      </div>
    </main>
  )
}