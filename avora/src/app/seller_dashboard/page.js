'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '../../lib/AuthContext'
import {
  getStore, updateStore,
  getProductsByStore,
  addProduct as addProductDB,
  updateProduct as updateProductDB,
  deleteProduct as deleteProductDB,
  getOrdersBySeller,
  updateOrderStatus as updateOrderStatusDB,
  getNotesBySeller,
  addNote as addNoteDB,
  updateNote as updateNoteDB,
  deleteNote as deleteNoteDB,
} from '../../lib/firestore'
import { uploadImage } from '../../lib/cloudinary'

const STATUS_COLORS = {
  pending: { bg: '#fff8e1', color: '#f59e0b', label: 'Pending' },
  confirmed: { bg: '#e8f5e9', color: '#4CAF50', label: 'Confirmed' },
  delivered: { bg: '#e3f2fd', color: '#2196F3', label: 'Delivered' },
  cancelled: { bg: '#fce4ec', color: '#e91e63', label: 'Cancelled' },
}

const TAG_CONFIG = {
  regular: { label: 'Regular', color: '#2196F3', bg: '#e3f2fd' },
  vip: { label: 'VIP', color: '#C9A84C', bg: '#fff8e1' },
  difficult: { label: 'Difficult', color: '#e91e63', bg: '#fce4ec' },
  new: { label: 'New', color: '#4CAF50', bg: '#e8f5e9' },
  blocked: { label: 'Blocked', color: '#888', bg: '#f5f5f5' },
}

export default function SellerDashboard() {
  const { user } = useAuth()
  const [isSeller, setIsSeller] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [notes, setNotes] = useState([])
  const [storeInfo, setStoreInfo] = useState({})
  const [toast, setToast] = useState(null)
  const [addingProduct, setAddingProduct] = useState(false)
  const [editingStore, setEditingStore] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: 'Food & Drinks', emoji: '📦' })
  const [productImageFile, setProductImageFile] = useState(null)
  const [productImagePreview, setProductImagePreview] = useState('')
  const [addingNote, setAddingNote] = useState(false)
  const [newNote, setNewNote] = useState({ customerName: '', phone: '', tag: 'regular', content: '' })
  const [editingNoteId, setEditingNoteId] = useState(null)
  const [editingNoteContent, setEditingNoteContent] = useState('')
  const [noteFilter, setNoteFilter] = useState('all')

  useEffect(() => {
    if (!user) { window.location.href = '/login'; return }
    const sellerFlag = localStorage.getItem('avora_is_seller')
    if (sellerFlag !== 'true') { window.location.href = '/open-a-store'; return }
    setIsSeller(true)

    const loadData = async () => {
      try {
        const store = await getStore(user.uid)
        if (store) {
          setStoreInfo({
            name: store.storeName || 'My Store',
            description: store.description || '',
            location: store.location || '',
            whatsapp: store.whatsapp || '',
            category: store.category || 'General',
            logo: store.logo || '🏪',
          })
        }
        const prods = await getProductsByStore(user.uid)
        setProducts(prods)
        const nts = await getNotesBySeller(user.uid)
        setNotes(nts)
        const ords = await getOrdersBySeller(user.uid)
        setOrders(ords)
      } catch (err) {
        console.error('Failed to load dashboard:', err)
        showToast('⚠️ Some data failed to load')
      }
    }
    loadData()
  }, [user])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const addProduct = async () => {
    if (!newProduct.name || !newProduct.price) {
      showToast('⚠️ Please fill in name and price')
      return
    }
    try {
      let imageUrl = ''
      if (productImageFile) {
        showToast('⏳ Uploading image...')
        imageUrl = await uploadImage(productImageFile)
      }
      const productData = {
        name: newProduct.name,
        price: parseInt(newProduct.price),
        category: newProduct.category,
        emoji: newProduct.emoji || '📦',
        image: imageUrl,
        active: true,
        orders: 0,
        sponsored: false,
        type: 'product',
        store: storeInfo.name,
      }
      const id = await addProductDB(user.uid, productData)
      setProducts(prev => [{ id, ...productData }, ...prev])
      setNewProduct({ name: '', price: '', category: 'Food & Drinks', emoji: '📦' })
      setProductImageFile(null)
      setProductImagePreview('')
      setAddingProduct(false)
      showToast('✅ Product added!')
    } catch (err) {
      console.error(err)
      showToast('❌ Failed to add product')
    }
  }

  const toggleProduct = async (id, currentActive) => {
    try {
      await updateProductDB(id, { active: !currentActive })
      setProducts(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p))
    } catch {
      showToast('❌ Failed to update product')
    }
  }

  const deleteProduct = async (id) => {
    try {
      await deleteProductDB(id)
      setProducts(prev => prev.filter(p => p.id !== id))
      showToast('🗑️ Product removed')
    } catch {
      showToast('❌ Failed to delete product')
    }
  }

  const updateOrderStatus = async (id, status) => {
    try {
      await updateOrderStatusDB(id, status)
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
      showToast(`✅ Order marked as ${status}`)
    } catch {
      showToast('❌ Failed to update order')
    }
  }

  const addNote = async () => {
    if (!newNote.customerName.trim() || !newNote.content.trim()) {
      showToast('⚠️ Please fill in customer name and note')
      return
    }
    try {
      const noteData = {
        customerName: newNote.customerName.trim(),
        phone: newNote.phone.trim(),
        tag: newNote.tag,
        content: newNote.content.trim(),
        createdAt: new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }),
      }
      const id = await addNoteDB(user.uid, noteData)
      setNotes(prev => [{ id, ...noteData }, ...prev])
      setNewNote({ customerName: '', phone: '', tag: 'regular', content: '' })
      setAddingNote(false)
      showToast('✅ Note saved!')
    } catch {
      showToast('❌ Failed to save note')
    }
  }

  const saveEditedNote = async (id) => {
    try {
      await updateNoteDB(id, editingNoteContent)
      setNotes(prev => prev.map(n => n.id === id ? { ...n, content: editingNoteContent } : n))
      setEditingNoteId(null)
      setEditingNoteContent('')
      showToast('✅ Note updated')
    } catch {
      showToast('❌ Failed to update note')
    }
  }

  const removeNote = async (id) => {
    try {
      await deleteNoteDB(id)
      setNotes(prev => prev.filter(n => n.id !== id))
      showToast('🗑️ Note deleted')
    } catch {
      showToast('❌ Failed to delete note')
    }
  }

  const saveStoreSettings = async () => {
    try {
      await updateStore(user.uid, {
        storeName: storeInfo.name,
        description: storeInfo.description,
        location: storeInfo.location,
        whatsapp: storeInfo.whatsapp,
        category: storeInfo.category,
      })
      setEditingStore(false)
      showToast('✅ Store settings saved!')
    } catch {
      showToast('❌ Failed to save settings')
    }
  }

  const deleteStore = async () => {
    try {
      localStorage.removeItem('avora_is_seller')
      window.location.href = '/'
    } catch {
      showToast('❌ Failed to delete store')
    }
  }

  const totalRevenue = orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.amount, 0)
  const pendingOrders = orders.filter(o => o.status === 'pending').length
  const filteredNotes = noteFilter === 'all' ? notes : notes.filter(n => n.tag === noteFilter)

  const TABS = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'catalogue', label: '🏪 Catalogue' },
    { id: 'notes', label: '📝 Notes' },
    { id: 'store', label: '⚙️ Store' },
  ]

  if (!isSeller) return null

  return (
    <main className="dashboard-wrapper">
      <style>{`
        .dashboard-wrapper { min-height: 100vh; background: #f5f3ee; padding-bottom: 5rem; }
        .container { max-width: 1100px; margin: 0 auto; padding: 1.5rem; }
        .card { background: #fff; border: 0.5px solid rgba(0,0,0,0.09); padding: 1.5rem; margin-bottom: 1.5rem; }
        .header-bg { background: #0a0a0a; padding: 2rem 1.5rem; }
        .header-inner { max-width: 1100px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1.5rem; }
        .tabs-nav { background: #fff; border-bottom: 0.5px solid rgba(0,0,0,0.09); position: sticky; top: 0; z-index: 100; overflow-x: auto; }
        .tabs-inner { max-width: 1100px; margin: 0 auto; display: flex; }
        .grid-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
        .listing-item { display: flex; align-items: center; gap: 1rem; padding: 1rem 0; border-bottom: 0.5px solid rgba(0,0,0,0.06); flex-wrap: wrap; }
        .order-item { display: flex; align-items: center; gap: 1rem; padding: 1rem 0; border-bottom: 0.5px solid rgba(0,0,0,0.06); flex-wrap: wrap; }
        .note-card { background: #fff; border: 0.5px solid rgba(0,0,0,0.09); padding: 1.25rem; margin-bottom: 0.75rem; }
        .btn-primary { background: #C9A84C; color: #0a0a0a; border: none; padding: 0.6rem 1.2rem; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 700; cursor: pointer; font-size: 0.55rem; }
        .btn-outline { background: transparent; border: 0.5px solid rgba(0,0,0,0.15); padding: 0.5rem 1rem; letter-spacing: 0.15em; text-transform: uppercase; cursor: pointer; font-size: 0.55rem; color: #0a0a0a; }
        @media (max-width: 600px) {
          .header-inner { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      {/* TOAST */}
      {toast && (
        <div style={{ position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', background: '#0a0a0a', color: '#fafafa', padding: '0.75rem 1.5rem', fontSize: '0.7rem', zIndex: 9999, border: '0.5px solid rgba(255,255,255,0.15)', whiteSpace: 'nowrap' }}>
          {toast}
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteConfirm && (
        <div onClick={() => setShowDeleteConfirm(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div onClick={e => e.stopPropagation()} className="card" style={{ maxWidth: '420px', width: '100%' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', color: '#e91e63', marginBottom: '1rem' }}>Delete Store?</h2>
            <p style={{ fontSize: '0.75rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              This permanently deletes <strong>{storeInfo.name}</strong> and all your data. This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => setShowDeleteConfirm(false)} className="btn-outline" style={{ flex: 1 }}>Cancel</button>
              <button onClick={deleteStore} style={{ flex: 1, background: '#e91e63', color: '#fff', border: 'none', padding: '0.6rem', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: '700', cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="header-bg">
        <div className="header-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '56px', height: '56px', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', border: '0.5px solid rgba(201,168,76,0.3)', overflow: 'hidden', flexShrink: 0 }}>
              {storeInfo.logo && storeInfo.logo.startsWith('http')
                ? <img src={storeInfo.logo} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : storeInfo.logo || '🏪'}
            </div>
            <div>
              <p style={{ fontSize: '0.5rem', letterSpacing: '0.2em', color: '#C9A84C', textTransform: 'uppercase' }}>Seller Dashboard</p>
              <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', color: '#fafafa' }}>{storeInfo.name}</h1>
              <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)' }}>📍 {storeInfo.location} · {user?.email}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <a href={`/store/${encodeURIComponent(storeInfo.name)}`} className="btn-outline" style={{ color: '#C9A84C', borderColor: '#C9A84C', textDecoration: 'none' }}>View Store</a>
            <button onClick={() => { setActiveTab('catalogue'); setAddingProduct(true) }} className="btn-primary">+ Add Product</button>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="tabs-nav">
        <div className="tabs-inner">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              padding: '1rem', fontSize: '0.6rem', letterSpacing: '0.1em',
              textTransform: 'uppercase', border: 'none', background: 'transparent',
              color: activeTab === tab.id ? '#0a0a0a' : '#6a6a6a',
              borderBottom: activeTab === tab.id ? '2px solid #C9A84C' : '2px solid transparent',
              cursor: 'pointer', fontWeight: activeTab === tab.id ? '700' : '400', whiteSpace: 'nowrap',
            }}>{tab.label}</button>
          ))}
        </div>
      </div>

      <div className="container">

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <>
            <div className="grid-stats">
              {[
                { label: 'Revenue', val: `₦${totalRevenue.toLocaleString()}`, icon: '💰' },
                { label: 'Orders', val: orders.length, icon: '📦' },
                { label: 'Pending', val: pendingOrders, icon: '⏳' },
                { label: 'Active', val: products.filter(p => p.active).length, icon: '🏪' },
              ].map(s => (
                <div key={s.label} className="card" style={{ padding: '1.25rem', marginBottom: 0 }}>
                  <div style={{ fontSize: '1.2rem' }}>{s.icon}</div>
                  <div style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', margin: '0.4rem 0' }}>{s.val}</div>
                  <div style={{ fontSize: '0.55rem', color: '#C9A84C', textTransform: 'uppercase' }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1rem' }}>Recent Orders</h2>
                <button onClick={() => setActiveTab('orders')} style={{ background: 'none', border: 'none', color: '#C9A84C', fontSize: '0.6rem', cursor: 'pointer' }}>View All →</button>
              </div>
              {orders.length === 0 ? (
                <p style={{ fontSize: '0.72rem', color: '#6a6a6a', textAlign: 'center', padding: '1.5rem 0' }}>No orders yet.</p>
              ) : orders.slice(0, 3).map(order => (
                <div key={order.id} className="order-item">
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: '700' }}>{order.item || order.productName}</p>
                    <p style={{ fontSize: '0.6rem', color: '#6a6a6a' }}>{order.buyer || order.buyerName} · {order.date || order.createdAt?.toDate?.()?.toLocaleDateString()}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <span style={{ fontFamily: 'Georgia, serif', fontSize: '0.85rem' }}>₦{(order.amount || order.price || 0).toLocaleString()}</span>
                    <StatusBadge status={order.status} />
                  </div>
                </div>
              ))}
            </div>

            {notes.length > 0 && (
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1rem' }}>Recent Notes</h2>
                  <button onClick={() => setActiveTab('notes')} style={{ background: 'none', border: 'none', color: '#C9A84C', fontSize: '0.6rem', cursor: 'pointer' }}>View All →</button>
                </div>
                {notes.slice(0, 2).map(note => {
                  const tag = TAG_CONFIG[note.tag] || TAG_CONFIG.regular
                  return (
                    <div key={note.id} style={{ padding: '0.75rem 0', borderBottom: '0.5px solid rgba(0,0,0,0.06)', display: 'flex', gap: '0.75rem' }}>
                      <span style={{ background: tag.bg, color: tag.color, fontSize: '0.45rem', fontWeight: '700', padding: '0.2rem 0.5rem', textTransform: 'uppercase', flexShrink: 0 }}>{tag.label}</span>
                      <div>
                        <p style={{ fontSize: '0.72rem', fontWeight: '700', marginBottom: '0.1rem' }}>{note.customerName}</p>
                        <p style={{ fontSize: '0.65rem', color: '#6a6a6a', lineHeight: 1.5 }}>{note.content}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}

        {/* CATALOGUE */}
        {activeTab === 'catalogue' && (
          <div>
            {addingProduct && (
              <div className="card" style={{ border: '0.5px solid #C9A84C' }}>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', marginBottom: '1rem' }}>Add New Product</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.8rem', marginBottom: '1rem' }}>
                  <input placeholder="Name *" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} style={inputStyle} />
                  <input placeholder="Price (₦) *" type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} style={inputStyle} />
                  <input placeholder="Emoji e.g. 🍲" value={newProduct.emoji} onChange={e => setNewProduct({...newProduct, emoji: e.target.value})} style={inputStyle} />
                  <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} style={inputStyle}>
                    {['Food & Drinks','Fashion','Electronics','Books','Beauty & Hair','Repairs','Printing','Footwear','Tutoring','Laundry','Photography','Second-hand'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>

                {/* PHOTO UPLOAD */}
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.5rem', color: '#6a6a6a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>Product Photo</label>
                  {productImagePreview && (
                    <img src={productImagePreview} alt="preview" style={{ width: '80px', height: '80px', objectFit: 'cover', marginBottom: '0.5rem', border: '0.5px solid rgba(0,0,0,0.09)' }} />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      const file = e.target.files[0]
                      if (file) {
                        setProductImageFile(file)
                        setProductImagePreview(URL.createObjectURL(file))
                      }
                    }}
                    style={{ fontSize: '0.65rem', width: '100%' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={addProduct} className="btn-primary">Add Product</button>
                  <button onClick={() => { setAddingProduct(false); setProductImageFile(null); setProductImagePreview('') }} className="btn-outline">Cancel</button>
                </div>
              </div>
            )}

            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem' }}>Your Catalogue ({products.length})</h2>
                {!addingProduct && <button onClick={() => setAddingProduct(true)} className="btn-primary">+ Add New</button>}
              </div>
              {products.length === 0 ? (
                <p style={{ fontSize: '0.72rem', color: '#6a6a6a', textAlign: 'center', padding: '2rem 0' }}>No products yet. Click "+ Add New" to add your first listing.</p>
              ) : products.map(product => (
                <div key={product.id} className="listing-item">
                  <div style={{ width: '50px', height: '50px', background: '#f5f3ee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0, overflow: 'hidden' }}>
                    {product.image
                      ? <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : product.emoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: '700' }}>{product.name}</p>
                    <p style={{ fontSize: '0.6rem', color: '#6a6a6a' }}>{product.category} · {product.orders || 0} orders</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'Georgia, serif', fontSize: '0.9rem' }}>₦{product.price.toLocaleString()}</span>
                    <span style={{ background: product.active ? '#e8f5e9' : '#fce4ec', color: product.active ? '#4CAF50' : '#e91e63', fontSize: '0.45rem', fontWeight: '700', padding: '0.2rem 0.4rem', textTransform: 'uppercase' }}>
                      {product.active ? 'Active' : 'Hidden'}
                    </span>
                    <button onClick={() => toggleProduct(product.id, product.active)} className="btn-outline">{product.active ? 'Hide' : 'Show'}</button>
                    <button onClick={() => deleteProduct(product.id)} className="btn-outline" style={{ color: '#e91e63', borderColor: '#e91e63' }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NOTES */}
        {activeTab === 'notes' && (
          <div>
            {addingNote && (
              <div className="card" style={{ border: '0.5px solid #C9A84C', marginBottom: '1.5rem' }}>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', fontWeight: '400', marginBottom: '1.25rem' }}>New Customer Note</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.5rem', color: '#6a6a6a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>Customer Name *</label>
                    <input placeholder="e.g. Amina Bello" value={newNote.customerName} onChange={e => setNewNote({...newNote, customerName: e.target.value})} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.5rem', color: '#6a6a6a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>Phone / WhatsApp</label>
                    <input placeholder="e.g. 08012345678" value={newNote.phone} onChange={e => setNewNote({...newNote, phone: e.target.value})} style={inputStyle} />
                  </div>
                </div>
                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{ display: 'block', fontSize: '0.5rem', color: '#6a6a6a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>Tag</label>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {Object.entries(TAG_CONFIG).map(([key, val]) => (
                      <button key={key} onClick={() => setNewNote({...newNote, tag: key})} style={{
                        padding: '0.35rem 0.8rem', fontSize: '0.55rem', fontWeight: '700',
                        letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
                        background: newNote.tag === key ? val.bg : 'transparent',
                        color: newNote.tag === key ? val.color : '#6a6a6a',
                        border: newNote.tag === key ? `1px solid ${val.color}` : '0.5px solid rgba(0,0,0,0.15)',
                      }}>{val.label}</button>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.5rem', color: '#6a6a6a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>Note *</label>
                  <textarea placeholder="e.g. Always pays on time..." value={newNote.content} onChange={e => setNewNote({...newNote, content: e.target.value})} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={addNote} className="btn-primary">Save Note</button>
                  <button onClick={() => { setAddingNote(false); setNewNote({ customerName: '', phone: '', tag: 'regular', content: '' }) }} className="btn-outline">Cancel</button>
                </div>
              </div>
            )}

            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', fontWeight: '400' }}>Customer Notes</h2>
                  <p style={{ fontSize: '0.6rem', color: '#6a6a6a', marginTop: '0.2rem' }}>Private — only you can see these.</p>
                </div>
                {!addingNote && <button onClick={() => setAddingNote(true)} className="btn-primary">+ New Note</button>}
              </div>

              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                <button onClick={() => setNoteFilter('all')} style={{ padding: '0.3rem 0.75rem', fontSize: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', background: noteFilter === 'all' ? '#0a0a0a' : 'transparent', color: noteFilter === 'all' ? '#C9A84C' : '#6a6a6a', border: '0.5px solid rgba(0,0,0,0.12)', fontWeight: noteFilter === 'all' ? '700' : '400' }}>All ({notes.length})</button>
                {Object.entries(TAG_CONFIG).map(([key, val]) => {
                  const count = notes.filter(n => n.tag === key).length
                  if (count === 0) return null
                  return (
                    <button key={key} onClick={() => setNoteFilter(key)} style={{ padding: '0.3rem 0.75rem', fontSize: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', background: noteFilter === key ? val.bg : 'transparent', color: noteFilter === key ? val.color : '#6a6a6a', border: noteFilter === key ? `0.5px solid ${val.color}` : '0.5px solid rgba(0,0,0,0.12)', fontWeight: noteFilter === key ? '700' : '400' }}>{val.label} ({count})</button>
                  )
                })}
              </div>

              {filteredNotes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2.5rem 0' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📝</div>
                  <p style={{ fontSize: '0.72rem', color: '#6a6a6a' }}>{notes.length === 0 ? 'No notes yet.' : 'No notes with this tag.'}</p>
                </div>
              ) : filteredNotes.map(note => {
                const tag = TAG_CONFIG[note.tag] || TAG_CONFIG.regular
                return (
                  <div key={note.id} className="note-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1 }}>
                        <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: tag.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '700', color: tag.color, flexShrink: 0 }}>
                          {note.customerName[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p style={{ fontSize: '0.78rem', fontWeight: '700', color: '#0a0a0a', marginBottom: '0.1rem' }}>{note.customerName}</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {note.phone && <p style={{ fontSize: '0.55rem', color: '#6a6a6a' }}>📱 {note.phone}</p>}
                            <span style={{ background: tag.bg, color: tag.color, fontSize: '0.45rem', fontWeight: '700', padding: '0.15rem 0.4rem', textTransform: 'uppercase' }}>{tag.label}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                        <button onClick={() => { setEditingNoteId(note.id); setEditingNoteContent(note.content) }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.65rem', color: '#6a6a6a' }}>✏️</button>
                        <button onClick={() => removeNote(note.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.65rem', color: '#e91e63' }}>🗑️</button>
                      </div>
                    </div>
                    {editingNoteId === note.id ? (
                      <div>
                        <textarea value={editingNoteContent} onChange={e => setEditingNoteContent(e.target.value)} style={{ ...inputStyle, width: '100%', minHeight: '80px', resize: 'vertical', marginBottom: '0.5rem', boxSizing: 'border-box' }} />
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => saveEditedNote(note.id)} className="btn-primary" style={{ fontSize: '0.5rem', padding: '0.4rem 0.8rem' }}>Save</button>
                          <button onClick={() => { setEditingNoteId(null); setEditingNoteContent('') }} className="btn-outline" style={{ fontSize: '0.5rem', padding: '0.4rem 0.8rem' }}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <p style={{ fontSize: '0.72rem', color: '#0a0a0a', lineHeight: 1.7, background: '#f9f9f9', padding: '0.75rem', borderLeft: `3px solid ${tag.color}` }}>
                        {note.content}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* STORE SETTINGS */}
        {activeTab === 'store' && (
          <div style={{ maxWidth: '600px' }}>
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem' }}>Store Settings</h2>
                <button onClick={() => setEditingStore(!editingStore)} className="btn-outline">{editingStore ? 'Cancel' : 'Edit'}</button>
              </div>
              {['name', 'location', 'whatsapp', 'category', 'description'].map(key => (
                <div key={key} style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.5rem', color: '#6a6a6a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>{key}</label>
                  {editingStore ? (
                    key === 'description' ? (
                      <textarea value={storeInfo[key] || ''} onChange={e => setStoreInfo({...storeInfo, [key]: e.target.value})} style={{ ...inputStyle, minHeight: '70px', resize: 'vertical' }} />
                    ) : (
                      <input value={storeInfo[key] || ''} onChange={e => setStoreInfo({...storeInfo, [key]: e.target.value})} style={inputStyle} />
                    )
                  ) : (
                    <p style={{ fontSize: '0.8rem', fontWeight: '600', paddingBottom: '0.4rem', borderBottom: '0.5px solid #eee' }}>{storeInfo[key] || '—'}</p>
                  )}
                </div>
              ))}
              {editingStore && (
                <button onClick={saveStoreSettings} className="btn-primary" style={{ marginTop: '1rem' }}>Save Changes</button>
              )}
            </div>

            <div className="card" style={{ borderColor: 'rgba(233,30,99,0.3)' }}>
              <h3 style={{ color: '#e91e63', fontFamily: 'Georgia, serif', fontSize: '1rem', marginBottom: '0.5rem' }}>Danger Zone</h3>
              <p style={{ fontSize: '0.7rem', color: '#6a6a6a', margin: '0.5rem 0 1rem', lineHeight: 1.6 }}>This action is permanent and deletes all store data.</p>
              <button onClick={() => setShowDeleteConfirm(true)} className="btn-outline" style={{ color: '#e91e63', borderColor: '#e91e63' }}>Delete My Store</button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

function StatusBadge({ status }) {
  const config = STATUS_COLORS[status] || STATUS_COLORS.pending
  return (
    <span style={{ background: config.bg, color: config.color, fontSize: '0.5rem', fontWeight: '800', textTransform: 'uppercase', padding: '0.15rem 0.5rem' }}>
      {config.label}
    </span>
  )
}

const inputStyle = {
  padding: '0.6rem', border: '0.5px solid #ddd',
  background: '#fafafa', fontSize: '0.75rem',
  outline: 'none', width: '100%', boxSizing: 'border-box',
  fontFamily: 'Arial, sans-serif',
}