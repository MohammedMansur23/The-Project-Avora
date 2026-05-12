import {
  collection, doc, setDoc, getDoc, getDocs,
  addDoc, updateDoc, deleteDoc, query, where,
  orderBy, serverTimestamp
} from 'firebase/firestore'
import { db } from './firebase'

// ─── STORES ───────────────────────────────────────────

export async function createStore(userId, storeData) {
  const ref = doc(db, 'stores', userId)
  await setDoc(ref, {
    ...storeData,
    ownerId: userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    shield: 70,
    rating: 5.0,
    reviews: 0,
  })
  return ref
}

export async function getStore(userId) {
  const ref = doc(db, 'stores', userId)
  const snap = await getDoc(ref)
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export async function getStoreByName(storeName) {
  const q = query(collection(db, 'stores'), where('storeName', '==', storeName))
  const snap = await getDocs(q)
  if (snap.empty) return null
  const d = snap.docs[0]
  return { id: d.id, ...d.data() }
}

export async function updateStore(userId, data) {
  const ref = doc(db, 'stores', userId)
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() })
}

// ─── PRODUCTS ─────────────────────────────────────────

export async function addProduct(userId, productData) {
  const ref = await addDoc(collection(db, 'products'), {
    ...productData,
    ownerId: userId,
    createdAt: serverTimestamp(),
    orders: 0,
    active: true,
  })
  return ref.id
}

export async function getProductsByStore(userId) {
  const q = query(
    collection(db, 'products'),
    where('ownerId', '==', userId),
    orderBy('createdAt', 'desc')
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function getProductsByStoreName(storeName) {
  const q = query(
    collection(db, 'products'),
    where('store', '==', storeName),
    where('active', '==', true)
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function updateProduct(productId, data) {
  const ref = doc(db, 'products', productId)
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() })
}

export async function deleteProduct(productId) {
  await deleteDoc(doc(db, 'products', productId))
}

export async function getAllActiveProducts() {
  const q = query(collection(db, 'products'), where('active', '==', true))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

// ─── ORDERS ───────────────────────────────────────────

export async function createOrder(orderData) {
  const ref = await addDoc(collection(db, 'orders'), {
    ...orderData,
    status: 'pending',
    createdAt: serverTimestamp(),
  })
  return ref.id
}

export async function getOrdersBySeller(sellerId) {
  try {
    const q = query(
      collection(db, 'orders'),
      where('sellerId', '==', sellerId),
      orderBy('createdAt', 'desc')
    )
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch {
    return []
  }
}

export async function getOrdersByBuyer(buyerId) {
  try {
    const q = query(
      collection(db, 'orders'),
      where('buyerId', '==', buyerId),
      orderBy('createdAt', 'desc')
    )
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch {
    return []
  }
}

export async function updateOrderStatus(orderId, status) {
  const ref = doc(db, 'orders', orderId)
  await updateDoc(ref, { status, updatedAt: serverTimestamp() })
}

// ─── NOTES ────────────────────────────────────────────

export async function addNote(userId, noteData) {
  const ref = await addDoc(collection(db, 'notes'), {
    ...noteData,
    ownerId: userId,
    createdAt: serverTimestamp(),
  })
  return ref.id
}

export async function getNotesBySeller(userId) {
  try {
    const q = query(
      collection(db, 'notes'),
      where('ownerId', '==', userId),
      orderBy('createdAt', 'desc')
    )
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch {
    return []
  }
}

export async function updateNote(noteId, content) {
  await updateDoc(doc(db, 'notes', noteId), {
    content, updatedAt: serverTimestamp()
  })
}

export async function deleteNote(noteId) {
  await deleteDoc(doc(db, 'notes', noteId))
}

// ─── REVIEWS ──────────────────────────────────────────

export async function addReview(storeId, reviewData) {
  await addDoc(collection(db, 'reviews'), {
    ...reviewData,
    storeId,
    createdAt: serverTimestamp(),
  })
}

export async function getReviewsByStore(storeId) {
  try {
    const q = query(
      collection(db, 'reviews'),
      where('storeId', '==', storeId),
      orderBy('createdAt', 'desc')
    )
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch {
    return []
  }
}