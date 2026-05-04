'use client'
import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext({})

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])

  // Load from localStorage on first load
  useEffect(() => {
    const savedCart = localStorage.getItem('avora_cart')
    const savedWishlist = localStorage.getItem('avora_wishlist')
    if (savedCart) setCart(JSON.parse(savedCart))
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist))
  }, [])

  // Save to localStorage whenever cart or wishlist changes
  useEffect(() => {
    localStorage.setItem('avora_cart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    localStorage.setItem('avora_wishlist', JSON.stringify(wishlist))
  }, [wishlist])

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

