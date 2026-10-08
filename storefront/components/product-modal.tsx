'use client'

import { X, Minus, Plus } from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { Product, ProductAddOn, MealOption } from '../types/store'
import { useStore } from '../context/StoreContext'

export default function ProductModal({
  product,
  onClose,
}: {
  product: Product
  onClose: () => void
}) {
  const { config, addToCart, formatPrice } = useStore()
  const [quantity, setQuantity] = useState(1)
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])
  const [selectedMeal, setSelectedMeal] = useState('')
  const [instructions, setInstructions] = useState('')

  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )

  // Use product-specific add-ons/meals, fallback to global store add-ons/meals
  const addOns: ProductAddOn[] = product.addOns || config.globalAddOns || []
  const mealOptions: MealOption[] = product.mealOptions || config.globalMealOptions || []

  const theme = config.metadata?.theme
  const primaryColor = theme?.primaryColor || '#60dbdc'
  const primaryFg = theme?.primaryForeground || '#000000'
  const buttonColor = theme?.buttonColor || primaryColor
  const buttonFg = theme?.buttonTextColor || primaryFg

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const calculateTotal = () => {
    let unitTotal = product.price

    selectedAddOns.forEach(addOnName => {
      const addOn = addOns.find(a => a.name === addOnName)
      if (addOn) unitTotal += addOn.price
    })

    if (selectedMeal) {
      const meal = mealOptions.find(m => m.name === selectedMeal)
      if (meal) unitTotal += meal.price
    }

    return unitTotal * quantity
  }

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      description: product.description,
      image: product.image,
      price: product.price,
      quantity,
      selectedAddOns,
      selectedMeal,
      instructions,
      totalPrice: calculateTotal(),
    })
    onClose()
  }

  const toggleAddOn = (addOnName: string) => {
    if (selectedAddOns.includes(addOnName)) {
      setSelectedAddOns(selectedAddOns.filter(a => a !== addOnName))
    } else {
      setSelectedAddOns([...selectedAddOns, addOnName])
    }
  }

  if (!isClient) return null

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl w-[92vw] sm:w-[90vw] md:w-[85vw] lg:w-[80vw] max-w-4xl max-h-[92vh] sm:max-h-[90vh] overflow-hidden shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 bg-black p-2 sm:p-2.5 rounded-full hover:bg-gray-800 transition-all duration-300 shadow-lg hover:scale-110 hover:rotate-90"
        >
          <X size={20} className="sm:w-6 sm:h-6 text-white" />
        </button>

        <div className="flex flex-col md:flex-row max-h-[95vh] sm:max-h-[90vh]">
          {/* Left: Product Image */}
          <div className="relative w-full md:w-1/2 h-48 sm:h-64 md:h-auto bg-gradient-to-br from-gray-50 to-gray-100 hidden md:block">
            <Image
              src={product.image || '/placeholder.svg'}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Right: Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-black mb-1.5 pr-8">{product.name}</h2>
            <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">{product.description}</p>

            {/* Add-Ons Section */}
            {addOns.length > 0 && (
              <div className="mb-4 sm:mb-6">
                <h3 className="text-sm sm:text-base font-bold text-black mb-2">
                  Add-Ons <span className="text-xs font-normal text-gray-500">(Optional)</span>
                </h3>
                <div className="space-y-2">
                  {addOns.map((addOn) => (
                    <label
                      key={addOn.name}
                      className="flex items-center justify-between p-2 sm:p-3 rounded-lg hover:bg-gray-50 border border-gray-100 cursor-pointer transition-all duration-200"
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <input
                          type="checkbox"
                          checked={selectedAddOns.includes(addOn.name)}
                          onChange={() => toggleAddOn(addOn.name)}
                          className="w-4 h-4 rounded text-black focus:ring-black"
                        />
                        <span className="text-xs sm:text-sm text-black font-medium">{addOn.name}</span>
                      </div>
                      <span className="text-xs sm:text-sm text-black font-bold whitespace-nowrap">
                        +{formatPrice(addOn.price)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Make It a Meal Section */}
            {mealOptions.length > 0 && (
              <div className="mb-4 sm:mb-6">
                <h3 className="text-sm sm:text-base font-bold text-black mb-2">
                  Make It a Meal <span className="text-xs font-normal text-gray-500">(Optional)</span>
                </h3>
                <div className="space-y-2">
                  {mealOptions.map((meal) => (
                    <label
                      key={meal.name}
                      className="flex items-center justify-between p-2 sm:p-3 rounded-lg hover:bg-gray-50 border border-gray-100 cursor-pointer transition-all duration-200"
                    >
                      <div className="flex items-center gap-2 sm:gap-3 flex-1">
                        <input
                          type="radio"
                          name="meal"
                          value={meal.name}
                          checked={selectedMeal === meal.name}
                          onChange={(e) => setSelectedMeal(e.target.value)}
                          className="w-4 h-4 text-black focus:ring-black"
                        />
                        <div className="flex-1">
                          <div className="text-xs sm:text-sm text-black font-medium">{meal.name}</div>
                          {meal.description && (
                            <div className="text-[10px] sm:text-xs text-gray-500">{meal.description}</div>
                          )}
                        </div>
                      </div>
                      <span className="text-xs sm:text-sm text-black font-bold whitespace-nowrap">
                        +{formatPrice(meal.price)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Instructions */}
            {config.metadata?.features?.enableOrderNotes !== false && (
              <div className="mb-4 sm:mb-6">
                <h3 className="text-sm sm:text-base font-bold text-black mb-1.5">Special Instructions</h3>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g. No onions, extra spicy, sauce on side"
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none text-xs sm:text-sm"
                  rows={2}
                />
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-200">
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ backgroundColor: buttonColor, color: buttonFg }}
                  className="p-2 rounded-lg hover:opacity-90 transition-all duration-200 border border-black/20"
                >
                  <Minus size={16} />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-12 sm:w-16 text-center border border-gray-300 rounded-lg py-1.5 font-bold focus:outline-none text-sm sm:text-base"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ backgroundColor: buttonColor, color: buttonFg }}
                  className="p-2 rounded-lg hover:opacity-90 transition-all duration-200 border border-black/20"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                style={{ backgroundColor: buttonColor, color: buttonFg }}
                className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold hover:opacity-90 active:scale-95 transition-all duration-200 border border-black/20 text-sm sm:text-base shadow-md"
              >
                {formatPrice(calculateTotal())} - Add To Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
