'use client'
import { useState } from 'react'
import { useAuth } from '../../lib/AuthContext'
import { useRequireAuth } from '../../lib/useRequireAuth'

if (!user) {
  if (typeof window !== 'undefined') window.location.href = '/login'
  return null
}

const MOCK_ORDERS = [
  { id: '#AV-001', item: 'Jollof Rice & Chicken', buyer: 'Tunde A.', amount: 1500, status: 'pending', date: '2026-05-06' },
  { id: '#AV-002', item: 'Fried Rice & Turkey', buyer: 'Amina B.', amount: 1800, status: 'delivered', date: '2026-05-05' },
  { id: '#AV-003', item: 'Jollof Rice & Chicken', buyer: 'Chidi O.', amount: 1500, status: 'confirmed', date: '2026-05-04' },
  { id: '#AV-004', item: 'Fried Rice & Turkey', buyer: 'Fatima K.', amount: 1800, status: 'delivered', date: '2026-05-03' },
]

const MOCK_PRODUCTS = [
  { id: 1, name: 'Jollof Rice & Chicken', price: 1500, category: 'Food & Drinks', emoji: '🍲', active: true, orders: 34 },
  { id: 2, name: 'Fried Rice & Turkey', price: 1800, category: 'Food & Drinks', emoji: '🍛', active: true, orders: 21 },
  { id: 3, name: 'Egusi Soup & Eba', price: 1200, category: 'Food & Drinks', emoji: '🍲', active: false, orders: 8 },
]

const STATUS_COLORS = {
  pending: { bg: '#fff8e1', color: '#f59e0b', label: 'Pending' },
  confirmed: { bg: '#e8f5e9', color: '#4CAF50', label: 'Confirmed' },
  delivered: { bg: '#e3f2fd', color: '#2196F3', label: 'Delivered' },
  cancelled: { bg: '#fce4ec', color: '#e91e63', label: 'Cancelled' },
}

export default function SellerDashboard() {
  const { user } = useAuth()
  const { requireAuth } = useRequireAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [orders, setOrders] = useState(MOCK_ORDERS)
  const [products, setProducts] = useState(MOCK_PRODUCTS)
  const [toast, setToast] = useState(null)
  const [addingProduct, setAddingProduct] = useState(false)
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: 'Food & Drinks', emoji: '📦', type: 'product' })
  const [storeInfo, setStoreInfo] = useState({
    name: user?.displayName ? `${user.displayName}'s Store` : 'My Store',
    description: 'Tell buyers about your store.',
    location: 'Your location on campus',
    whatsapp: '',
    category: 'General',
  })
  const [editingStore, setEditingStore] = useState(false)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const totalRevenue = orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.amount, 0)
  const pendingOrders = orders.filter(o => o.status === 'pending').length
  const totalOrders = orders.length

  const updateOrderStatus = (id, status) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
    showToast(`✅ Order ${id} marked as ${status}`)
  }

  const toggleProduct = (id) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p))
  }

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id))
    showToast('🗑️ Product removed')
  }

  const addProduct = () => {
    if (!newProduct.name || !newProduct.price) {
      showToast('⚠️ Please fill in name and price')
      return
    }
    const product = {
      id: Date.now(),
      name: newProduct.name,
      price: parseInt(newProduct.price),
      category: newProduct.category,
      emoji: newProduct.emoji,
      active: true,
      orders: 0,
    }
    setProducts(prev => [...prev, product])
    setNewProduct({ name: '', price: '', category: 'Food & Drinks', emoji: '📦', type: 'product' })
    setAddingProduct(false)
    showToast('✅ Product added!')
  }

  const TABS = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'orders', label: '📦 Orders' },
    { id: 'listings', label: '🏪 Listings' },
    { id: 'store', label: '⚙️ Store Settings' },
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
      <div style={{ background: '#0a0a0a', padding: '2rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p style={{ fontSize: '0.55rem', letterSpacing: '0.3em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Seller Dashboard</p>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', fontWeight: '400', color: '#fafafa' }}>
              {storeInfo.name}
            </h1>
            <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>
              📍 {storeInfo.location}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <a href={`/store/${encodeURIComponent(storeInfo.name)}`} style={{
              background: 'transparent', color: '#C9A84C',
              border: '0.5px solid rgba(201,168,76,0.4)',
              padding: '0.6rem 1.2rem', fontSize: '0.55rem',
              letterSpacing: '0.15em', textTransform: 'uppercase',
              textDecoration: 'none', cursor: 'pointer',
            }}>View Store →</a>
            <button
              onClick={() => setAddingProduct(true)}
              style={{
                background: '#C9A84C', color: '#0a0a0a',
                border: 'none', padding: '0.6rem 1.2rem',
                fontSize: '0.55rem', letterSpacing: '0.15em',
                textTransform: 'uppercase', fontWeight: '700', cursor: 'pointer',
              }}>+ Add Product</button>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ background: '#fff', borderBottom: '0.5px solid rgba(0,0,0,0.09)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex' }}>
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

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem' }}>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div>
            {/* STATS CARDS */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem', marginBottom: '2rem',
            }}>
              {[
                { label: 'Total Revenue', value: `₦${totalRevenue.toLocaleString()}`, icon: '💰', sub: 'From delivered orders' },
                { label: 'Total Orders', value: totalOrders, icon: '📦', sub: 'All time' },
                { label: 'Pending Orders', value: pendingOrders, icon: '⏳', sub: 'Needs your action' },
                { label: 'Active Listings', value: products.filter(p => p.active).length, icon: '🏪', sub: 'Visible to buyers' },
              ].map(stat => (
                <div key={stat.label} style={{
                  background: '#fff', padding: '1.5rem',
                  border: '0.5px solid rgba(0,0,0,0.09)',
                }}>
                  <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
                  <div style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', color: '#0a0a0a', marginBottom: '0.2rem' }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '0.2rem' }}>
                    {stat.label}
                  </div>
                  <div style={{ fontSize: '0.6rem', color: '#6a6a6a' }}>{stat.sub}</div>
                </div>
              ))}
            </div>

            {/* RECENT ORDERS */}
            <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.09)', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', fontWeight: '400' }}>Recent Orders</h2>
                <button onClick={() => setActiveTab('orders')} style={{
                  background: 'none', border: 'none', color: '#C9A84C',
                  fontSize: '0.6rem', cursor: 'pointer', letterSpacing: '0.1em',
                }}>View All →</button>
              </div>
              {orders.slice(0, 3).map(order => (
                <div key={order.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.85rem 0', borderBottom: '0.5px solid rgba(0,0,0,0.06)',
                  flexWrap: 'wrap', gap: '0.5rem',
                }}>
                  <div>
                    <p style={{ fontSize: '0.72rem', fontWeight: '600', marginBottom: '0.2rem' }}>{order.item}</p>
                    <p style={{ fontSize: '0.6rem', color: '#6a6a6a' }}>by {order.buyer} · {order.date}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontFamily: 'Georgia, serif', fontSize: '0.9rem' }}>₦{order.amount.toLocaleString()}</span>
                    <span style={{
                      background: STATUS_COLORS[order.status].bg,
                      color: STATUS_COLORS[order.status].color,
                      fontSize: '0.5rem', fontWeight: '700',
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      padding: '0.2rem 0.6rem',
                    }}>{STATUS_COLORS[order.status].label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.09)', padding: '1.5rem' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', fontWeight: '400', marginBottom: '1.5rem' }}>
              All Orders ({orders.length})
            </h2>
            {orders.map(order => (
              <div key={order.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '1rem 0', borderBottom: '0.5px solid rgba(0,0,0,0.06)',
                flexWrap: 'wrap', gap: '1rem',
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '0.6rem', color: '#C9A84C', fontWeight: '700' }}>{order.id}</span>
                    <span style={{
                      background: STATUS_COLORS[order.status].bg,
                      color: STATUS_COLORS[order.status].color,
                      fontSize: '0.5rem', fontWeight: '700',
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      padding: '0.2rem 0.5rem',
                    }}>{STATUS_COLORS[order.status].label}</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', fontWeight: '600', marginBottom: '0.2rem' }}>{order.item}</p>
                  <p style={{ fontSize: '0.6rem', color: '#6a6a6a' }}>Buyer: {order.buyer} · {order.date}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'Georgia, serif', fontSize: '1rem' }}>₦{order.amount.toLocaleString()}</span>
                  {order.status === 'pending' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'confirmed')}
                      style={{
                        background: '#4CAF50', color: '#fff',
                        border: 'none', padding: '0.45rem 0.9rem',
                        fontSize: '0.55rem', letterSpacing: '0.1em',
                        textTransform: 'uppercase', cursor: 'pointer', fontWeight: '600',
                      }}>Accept</button>
                  )}
                  {order.status === 'confirmed' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'delivered')}
                      style={{
                        background: '#2196F3', color: '#fff',
                        border: 'none', padding: '0.45rem 0.9rem',
                        fontSize: '0.55rem', letterSpacing: '0.1em',
                        textTransform: 'uppercase', cursor: 'pointer', fontWeight: '600',
                      }}>Mark Delivered</button>
                  )}
                  {order.status === 'pending' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'cancelled')}
                      style={{
                        background: 'transparent', color: '#e91e63',
                        border: '0.5px solid #e91e63', padding: '0.45rem 0.9rem',
                        fontSize: '0.55rem', letterSpacing: '0.1em',
                        textTransform: 'uppercase', cursor: 'pointer',
                      }}>Decline</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* LISTINGS TAB */}
        {activeTab === 'listings' && (
          <div>
            {/* ADD PRODUCT FORM */}
            {addingProduct && (
              <div style={{
                background: '#fff', border: '0.5px solid rgba(201,168,76,0.4)',
                padding: '1.5rem', marginBottom: '1.5rem',
              }}>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', fontWeight: '400', marginBottom: '1.5rem' }}>
                  Add New Product
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
                  <input
                    placeholder="Product name *"
                    value={newProduct.name}
                    onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                    style={inputStyle}
                  />
                  <input
                    placeholder="Price (₦) *"
                    type="number"
                    value={newProduct.price}
                    onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                    style={inputStyle}
                  />
                  <input
                    placeholder="Emoji icon"
                    value={newProduct.emoji}
                    onChange={e => setNewProduct({ ...newProduct, emoji: e.target.value })}
                    style={inputStyle}
                  />
                  <select
                    value={newProduct.category}
                    onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                  >
                    {['Food & Drinks', 'Fashion', 'Electronics', 'Books', 'Beauty & Hair', 'Repairs', 'Printing', 'Footwear', 'Tutoring', 'Laundry', 'Photography', 'Second-hand'].map(c => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button onClick={addProduct} style={{
                    background: '#0a0a0a', color: '#fafafa',
                    border: 'none', padding: '0.65rem 1.5rem',
                    fontSize: '0.6rem', letterSpacing: '0.15em',
                    textTransform: 'uppercase', fontWeight: '700', cursor: 'pointer',
                  }}>Add Product</button>
                  <button onClick={() => setAddingProduct(false)} style={{
                    background: 'transparent', color: '#6a6a6a',
                    border: '0.5px solid rgba(0,0,0,0.15)', padding: '0.65rem 1.5rem',
                    fontSize: '0.6rem', letterSpacing: '0.15em',
                    textTransform: 'uppercase', cursor: 'pointer',
                  }}>Cancel</button>
                </div>
              </div>
            )}

            {/* PRODUCTS LIST */}
            <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.09)', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', fontWeight: '400' }}>
                  Your Listings ({products.length})
                </h2>
                <button onClick={() => setAddingProduct(true)} style={{
                  background: '#C9A84C', color: '#0a0a0a',
                  border: 'none', padding: '0.5rem 1rem',
                  fontSize: '0.55rem', letterSpacing: '0.15em',
                  textTransform: 'uppercase', fontWeight: '700', cursor: 'pointer',
                }}>+ Add New</button>
              </div>

              {products.map(product => (
                <div key={product.id} style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  padding: '1rem 0', borderBottom: '0.5px solid rgba(0,0,0,0.06)',
                  flexWrap: 'wrap',
                }}>
                  <div style={{
                    width: '50px', height: '50px', background: '#f5f3ee',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.8rem', flexShrink: 0,
                  }}>{product.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.78rem', fontWeight: '600', marginBottom: '0.2rem' }}>{product.name}</p>
                    <p style={{ fontSize: '0.6rem', color: '#6a6a6a' }}>
                      {product.category} · {product.orders} orders
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'Georgia, serif', fontSize: '0.95rem' }}>₦{product.price.toLocaleString()}</span>
                    <span style={{
                      background: product.active ? '#e8f5e9' : '#fce4ec',
                      color: product.active ? '#4CAF50' : '#e91e63',
                      fontSize: '0.5rem', fontWeight: '700',
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      padding: '0.2rem 0.5rem',
                    }}>{product.active ? 'Active' : 'Hidden'}</span>
                    <button
                      onClick={() => toggleProduct(product.id)}
                      style={{
                        background: 'transparent', border: '0.5px solid rgba(0,0,0,0.15)',
                        padding: '0.35rem 0.75rem', fontSize: '0.55rem',
                        letterSpacing: '0.1em', textTransform: 'uppercase',
                        cursor: 'pointer', color: '#0a0a0a',
                      }}>{product.active ? 'Hide' : 'Show'}</button>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      style={{
                        background: 'transparent', border: '0.5px solid #e91e63',
                        padding: '0.35rem 0.75rem', fontSize: '0.55rem',
                        letterSpacing: '0.1em', textTransform: 'uppercase',
                        cursor: 'pointer', color: '#e91e63',
                      }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STORE SETTINGS TAB */}
        {activeTab === 'store' && (
          <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.09)', padding: '1.5rem', maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', fontWeight: '400' }}>Store Settings</h2>
              <button onClick={() => setEditingStore(!editingStore)} style={{
                background: editingStore ? '#0a0a0a' : 'transparent',
                color: editingStore ? '#fafafa' : '#0a0a0a',
                border: '0.5px solid rgba(0,0,0,0.15)',
                padding: '0.5rem 1rem', fontSize: '0.55rem',
                letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer',
              }}>{editingStore ? 'Save Changes' : 'Edit'}</button>
            </div>

            {[
              { label: 'Store Name', key: 'name' },
              { label: 'Location / Hostel', key: 'location' },
              { label: 'WhatsApp Number', key: 'whatsapp' },
              { label: 'Category', key: 'category' },
            ].map(field => (
              <div key={field.key} style={{ marginBottom: '1.25rem' }}>
                <label style={{
                  display: 'block', fontSize: '0.55rem',
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  color: '#6a6a6a', marginBottom: '0.4rem',
                }}>{field.label}</label>
                {editingStore ? (
                  <input
                    value={storeInfo[field.key]}
                    onChange={e => setStoreInfo({ ...storeInfo, [field.key]: e.target.value })}
                    style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }}
                  />
                ) : (
                  <p style={{ fontSize: '0.78rem', color: '#0a0a0a', padding: '0.5rem 0', borderBottom: '0.5px solid rgba(0,0,0,0.06)' }}>
                    {storeInfo[field.key]}
                  </p>
                )}
              </div>
            ))}

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{
                display: 'block', fontSize: '0.55rem',
                letterSpacing: '0.15em', textTransform: 'uppercase',
                color: '#6a6a6a', marginBottom: '0.4rem',
              }}>Store Description</label>
              {editingStore ? (
                <textarea
                  value={storeInfo.description}
                  onChange={e => setStoreInfo({ ...storeInfo, description: e.target.value })}
                  style={{
                    ...inputStyle, width: '100%', boxSizing: 'border-box',
                    minHeight: '80px', resize: 'vertical',
                  }}
                />
              ) : (
                <p style={{ fontSize: '0.78rem', color: '#0a0a0a', lineHeight: 1.7 }}>
                  {storeInfo.description}
                </p>
              )}
            </div>

            {editingStore && (
              <button
                onClick={() => {
                  setEditingStore(false)
                  showToast('✅ Store settings saved!')
                }}
                style={{
                  background: '#C9A84C', color: '#0a0a0a',
                  border: 'none', padding: '0.75rem 2rem',
                  fontSize: '0.6rem', letterSpacing: '0.2em',
                  textTransform: 'uppercase', fontWeight: '700', cursor: 'pointer',
                }}>Save Changes</button>
            )}
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
  width: '100%',
}