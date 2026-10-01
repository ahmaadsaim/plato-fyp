'use client'

import { X, Trash2, Minus, Plus, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useStore } from '../context/StoreContext'

export default function CartSidebar() {
  const router = useRouter()
  const {
    config,
    cartItems,
    cartOpen,
    setCartOpen,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    formatPrice,
  } = useStore()

  if (!cartOpen) return null

  const theme = config.metadata?.theme
  const primaryColor = theme?.primaryColor || '#60dbdc'
  const primaryFg = theme?.primaryForeground || '#000000'
  const buttonColor = theme?.buttonColor || primaryColor
  const buttonFg = theme?.buttonTextColor || primaryFg

  const handleCheckout = () => {
    setCartOpen(false)
    router.push('/checkout')
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-50 animate-in fade-in duration-300"
        onClick={() => setCartOpen(false)}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div 
          style={{ backgroundColor: primaryColor, color: primaryFg }}
          className="p-4 sm:p-6 flex items-center justify-between shadow-md"
        >
          <div className="flex items-center gap-3">
            <ShoppingBag size={26} />
            <h2 className="text-xl sm:text-2xl font-bold">Your Cart</h2>
          </div>
          <button 
            onClick={() => setCartOpen(false)} 
            className="p-2 hover:bg-black/15 rounded-lg transition-all duration-300 hover:rotate-90 hover:scale-110"
            aria-label="Close cart"
          >
            <X size={24} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="bg-gray-100 rounded-full p-6 mb-4">
                <ShoppingBag size={48} className="text-gray-400" />
              </div>
              <p className="text-xl font-semibold text-black mb-2">
                Your cart is empty
              </p>
              <p className="text-gray-500 mb-6 text-sm">
                Add some delicious items from our menu to get started!
              </p>
              <button
                onClick={() => setCartOpen(false)}
                style={{ backgroundColor: primaryColor, color: primaryFg }}
                className="px-6 py-3 rounded-lg font-bold hover:bg-black hover:text-white transition-all duration-300 border-2 border-black hover:scale-105"
              >
                Explore Menu
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-3 sm:p-4 rounded-xl border-2 border-gray-200 hover:border-black transition-all duration-200 shadow-sm"
                >
                  <div className="flex gap-3">
                    {/* Image */}
                    <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={item.image || '/placeholder.svg'}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-black text-sm leading-tight line-clamp-1">{item.name}</h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-all duration-200 hover:scale-110 ml-2"
                          aria-label="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                        <div className="text-xs text-gray-600 mb-1">
                          <span className="font-semibold">Add-ons:</span> {item.selectedAddOns.join(', ')}
                        </div>
                      )}

                      {item.selectedMeal && (
                        <div className="text-xs text-gray-600 mb-1">
                          <span className="font-semibold">Meal:</span> {item.selectedMeal}
                        </div>
                      )}

                      {item.instructions && (
                        <div className="text-xs text-gray-600 mb-2 italic">
                          <span>Note:</span> {item.instructions}
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="bg-gray-200 hover:bg-gray-300 p-1 rounded transition-all"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="font-bold text-sm min-w-[20px] text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="bg-gray-200 hover:bg-gray-300 p-1 rounded transition-all"
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <p className="text-black font-bold text-sm">{formatPrice(item.totalPrice || item.price * item.quantity)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t-2 border-gray-200 p-4 sm:p-6 space-y-4 bg-gray-50">
            <div className="flex justify-between items-center text-lg font-bold">
              <span className="text-black">Subtotal:</span>
              <span className="text-black text-2xl">{formatPrice(cartSubtotal)}</span>
            </div>
            <button 
              onClick={handleCheckout}
              style={{ backgroundColor: buttonColor, color: buttonFg }}
              className="w-full py-3.5 sm:py-4 rounded-lg font-bold hover:opacity-90 active:scale-[0.99] transition-all duration-200 border border-black/20 shadow-md text-base sm:text-lg"
            >
              Proceed to Checkout
            </button>
            <button
              onClick={() => setCartOpen(false)}
              className="w-full bg-white text-black py-2.5 rounded-lg font-bold hover:bg-gray-100 transition-all duration-300 border-2 border-gray-300"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  )
}
