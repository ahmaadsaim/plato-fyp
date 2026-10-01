'use client'

import Image from 'next/image'
import { useState } from 'react'
import ProductModal from './product-modal'
import { Product } from '../types/store'
import { useStore } from '../context/StoreContext'

export default function ProductCard({ product }: { product: Product }) {
  const [showModal, setShowModal] = useState(false)
  const { config, formatPrice } = useStore()
  const theme = config.metadata?.theme
  const primaryColor = theme?.primaryColor || '#84CC16'
  const primaryFg = theme?.primaryForeground || '#000000'
  const secondaryColor = theme?.secondaryColor || '#18181B'
  const buttonColor = theme?.buttonColor || primaryColor
  const buttonFg = theme?.buttonTextColor || primaryFg
  const cardColor = theme?.cardColor || '#FFFFFF'
  const textColor = theme?.textColor || '#09090B'
  const animStyle = theme?.animationOption || 'smooth'

  const hoverAnimClass = 
    animStyle === 'energetic' 
      ? 'hover:scale-105 active:scale-95 transition-transform duration-200' 
      : animStyle === 'minimal' 
      ? 'transition-none' 
      : 'hover:-translate-y-1 hover:shadow-xl transition-all duration-300'

  return (
    <>
      <div 
        onClick={() => setShowModal(true)}
        style={{ 
          backgroundColor: cardColor,
          borderColor: `${textColor}15`,
          color: textColor,
        }}
        className={`rounded-xl sm:rounded-2xl overflow-hidden shadow-md border group flex flex-row h-[140px] sm:h-[180px] md:h-[200px] cursor-pointer ${hoverAnimClass}`}
      >
        {/* Left: Image (40%) */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-50/10 to-gray-100/10 w-[35%] sm:w-[40%] flex-shrink-0">
          <Image
            src={product.image || '/placeholder.svg'}
            alt={product.name}
            fill
            className={`object-cover ${animStyle === 'minimal' ? '' : 'group-hover:scale-110 transition-transform duration-500'}`}
          />
          {product.badge && (
            <span 
              style={{ backgroundColor: primaryColor, color: primaryFg }}
              className="absolute top-2 left-2 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full shadow border border-black/20"
            >
              {product.badge}
            </span>
          )}
        </div>
        
        {/* Right: Content (60%) */}
        <div className="p-2.5 sm:p-3 md:p-4 flex flex-col justify-between flex-grow w-[65%] sm:w-[60%]">
          <div className="flex-grow">
            <h3 
              style={{ color: textColor }}
              className="font-bold text-sm sm:text-base md:text-lg mb-1 leading-tight line-clamp-1"
            >
              {product.name}
            </h3>
            <p 
              style={{ color: `${textColor}99` }}
              className="text-xs sm:text-sm line-clamp-2 sm:line-clamp-3 leading-snug"
            >
              {product.description}
            </p>
          </div>
          
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 mt-2">
            <div 
              style={{ backgroundColor: secondaryColor, color: '#FFFFFF' }}
              className="text-xs sm:text-sm md:text-base font-bold px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg flex-shrink-0 shadow-2xs"
            >
              {formatPrice(product.price)}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowModal(true)
              }}
              style={{ backgroundColor: buttonColor, color: buttonFg }}
              className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg font-bold text-xs sm:text-sm hover:opacity-90 active:scale-95 transition-all duration-200 border border-black/15 shadow-sm flex-grow text-center"
            >
              Add To Cart
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <ProductModal
          product={product}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}
