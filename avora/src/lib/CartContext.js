'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'

const CartContext = createContext({})

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])

  const cartKey = user ? `avora_cart_${user.uid}` : null
  const wishlistKey = user ? `avora_wishlist_${user.uid}` : null

  // Load from localStorage when user logs in
  useEffect(() => {
    if (user) {
      const savedCart = localStorage.getItem(`avora_cart_${user.uid}`)
      const savedWishlist = localStorage.getItem(`avora_wishlist_${user.uid}`)
      setCart(savedCart ? JSON.parse(savedCart) : [])
      setWishlist(savedWishlist ? JSON.parse(savedWishlist) : [])
    } else {
      setCart([])
      setWishlist([])
    }
  }, [user])

  // Save to localStorage whenever cart changes
  useEffect(() => {
    if (cartKey) localStorage.setItem(cartKey, JSON.stringify(cart))
  }, [cart, cartKey])

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    if (wishlistKey) localStorage.setItem(wishlistKey, JSON.stringify(wishlist))
  }, [wishlist, wishlistKey])

  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(p => p.id === product.id)
      if (exists) return prev
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(p => p.id !== productId))
  }

  const isInCart = (productId) => cart.some(p => p.id === productId)

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.find(p => p.id === product.id)
      if (exists) return prev.filter(p => p.id !== product.id)
      return [...prev, product]
    })
  }

  const isInWishlist = (productId) => wishlist.some(p => p.id === productId)

  const cartTotal = cart.reduce((sum, p) => sum + p.price, 0)

  return (
    <CartContext.Provider value={{
      cart, wishlist,
      addToCart, removeFromCart, isInCart,
      toggleWishlist, isInWishlist,
      cartTotal
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)