'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { StoreConfig, Branch, CartItem, formatCurrency } from '../types/store'

interface StoreContextType {
  config: StoreConfig
  setStoreConfig: (newConfig: StoreConfig) => void
  selectedBranch: Branch | null
  setSelectedBranch: (branch: Branch) => void
  cartItems: CartItem[]
  cartOpen: boolean
  setCartOpen: (open: boolean) => void
  addToCart: (item: Omit<CartItem, 'id'> | Record<string, unknown>) => void
  removeFromCart: (itemId: string | number) => void
  updateQuantity: (itemId: string | number, newQuantity: number) => void
  clearCart: () => void
  cartSubtotal: number
  deliveryFee: number
  cartTotal: number
  formatPrice: (amount: number) => string
}

const StoreContext = createContext<StoreContextType | null>(null)

export function StoreProvider({
  initialConfig,
  children,
}: {
  initialConfig: StoreConfig
  children: React.ReactNode
}) {
  const [config, setConfig] = useState<StoreConfig>(initialConfig)
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(
    initialConfig.branches?.find(b => b.isActive) || initialConfig.branches?.[0] || null
  )

  const [cartOpen, setCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const savedCart = localStorage.getItem(`cart_${initialConfig.storeId || 'default'}`)
      return savedCart ? JSON.parse(savedCart) : []
    } catch (e) {
      console.error('Failed to load cart from localStorage:', e)
      return []
    }
  })

  // Save cart to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(`cart_${config.storeId || 'default'}`, JSON.stringify(cartItems))
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e)
    }
  }, [cartItems, config.storeId])

  // Inject dynamic brand CSS variables
  useEffect(() => {
    if (typeof document !== 'undefined' && config.metadata?.theme) {
      const root = document.documentElement
      const theme = config.metadata.theme

      if (theme.primaryColor) {
        root.style.setProperty('--brand-primary', theme.primaryColor)
      }
      if (theme.secondaryColor) {
        root.style.setProperty('--brand-secondary', theme.secondaryColor)
      }
      if (theme.buttonColor || theme.primaryColor) {
        root.style.setProperty('--brand-button-bg', theme.buttonColor || theme.primaryColor)
      }
      if (theme.buttonTextColor || theme.primaryForeground) {
        root.style.setProperty('--brand-button-fg', theme.buttonTextColor || theme.primaryForeground || '#FFFFFF')
      }
      if (theme.cardColor) {
        root.style.setProperty('--brand-card-bg', theme.cardColor)
      }
      if (theme.backgroundColor) {
        root.style.setProperty('--brand-page-bg', theme.backgroundColor)
      }
      if (theme.textColor) {
        root.style.setProperty('--brand-text', theme.textColor)
      }
      if (theme.accentColor || theme.primaryColor) {
        root.style.setProperty('--brand-accent', theme.accentColor || theme.primaryColor)
      }
      if (theme.primaryForeground) {
        root.style.setProperty('--brand-primary-fg', theme.primaryForeground)
      }

      // Font styles
      let resolvedFont = "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      if (theme.fontStyle === 'serif') {
        resolvedFont = "Georgia, 'Playfair Display', Cambria, Times, serif"
      } else if (theme.fontStyle === 'display') {
        resolvedFont = "'Outfit', 'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif"
      } else if (theme.fontStyle === 'geometric') {
        resolvedFont = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      }
      root.style.setProperty('--brand-font-family', resolvedFont)

      // Animation mode
      const anim = theme.animationOption || 'smooth'
      root.setAttribute('data-animation-style', anim)
    }
  }, [config])

  const addToCart = (product: Omit<CartItem, 'id'> | Record<string, unknown>) => {
    const newItem: CartItem = {
      ...(product as unknown as CartItem),
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }
    setCartItems(prev => [...prev, newItem])
  }

  const removeFromCart = (itemId: string | number) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId))
  }

  const updateQuantity = (itemId: string | number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId)
      return
    }

    setCartItems(prev =>
      prev.map(item => {
        if (item.id === itemId) {
          const basePrice = item.price
          // Calculate item's unit price with add-ons and meal
          const addOnsPrice =
            item.selectedAddOns?.reduce((sum: number, addOnName: string) => {
              const addOn =
                config.products?.find(p => p.id === item.productId)?.addOns?.find(a => a.name === addOnName) ||
                config.globalAddOns?.find(a => a.name === addOnName)
              return sum + (addOn ? addOn.price : 0)
            }, 0) || 0

          const meal =
            config.products?.find(p => p.id === item.productId)?.mealOptions?.find(m => m.name === item.selectedMeal) ||
            config.globalMealOptions?.find(m => m.name === item.selectedMeal)
          const mealPrice = meal ? meal.price : 0

          const unitPrice = basePrice + addOnsPrice + mealPrice
          return {
            ...item,
            quantity: newQuantity,
            totalPrice: unitPrice * newQuantity,
          }
        }
        return item
      })
    )
  }

  const clearCart = () => {
    setCartItems([])
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`cart_${config.storeId || 'default'}`)
    }
  }

  const cartSubtotal = cartItems.reduce((sum, item) => sum + (item.totalPrice || item.price * item.quantity), 0)
  const deliveryFee = config.metadata?.delivery?.fee || 0
  const cartTotal = cartSubtotal + deliveryFee

  const setStoreConfig = (newConfig: StoreConfig) => {
    setConfig(newConfig)
    setSelectedBranch(newConfig.branches?.find(b => b.isActive) || newConfig.branches?.[0] || null)
  }

  const formatPrice = (amount: number) => {
    return formatCurrency(amount, config.metadata?.currency)
  }

  return (
    <StoreContext.Provider
      value={{
        config,
        setStoreConfig,
        selectedBranch,
        setSelectedBranch,
        cartItems,
        cartOpen,
        setCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartSubtotal,
        deliveryFee,
        cartTotal,
        formatPrice,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider')
  }
  return context
}

export function useStoreSafe() {
  return useContext(StoreContext)
}
