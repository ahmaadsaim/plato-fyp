'use client'

import ProductCard from './product-card'
import { useMemo } from 'react'
import { useStore } from '../context/StoreContext'

export default function ProductsGrid() {
  const { config } = useStore()
  const categories = useMemo(() => config.categories || [], [config.categories])
  const products = config.products || []
  const theme = config.metadata?.theme
  const textColor = theme?.textColor || '#09090B'

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-12 pb-16 sm:pb-24">
      <style>{`
        @keyframes pop {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.03);
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-pop {
          animation: pop 0.6s ease-out;
        }
      `}</style>

      {categories.map((category) => {
        const categoryProducts = products.filter(
          (p) => String(p.category) === String(category.id) && p.isAvailable !== false
        )
        
        if (categoryProducts.length === 0) return null
        
        return (
          <div 
            key={category.id} 
            className="mb-8 sm:mb-12" 
            id={`category-${category.id}`}
          >
            {/* Simple Large Text Category Header */}
            <div 
              style={{ borderColor: `${textColor}15` }}
              className="mb-6 sm:mb-8 pt-4 pb-3 border-b-2 flex items-baseline justify-between gap-4"
            >
              <div>
                <h2 
                  style={{ color: textColor }}
                  className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight"
                >
                  {category.name}
                </h2>
                {category.description && (
                  <p 
                    style={{ color: `${textColor}99` }}
                    className="mt-1 text-xs sm:text-sm font-medium"
                  >
                    {category.description}
                  </p>
                )}
              </div>
              <span 
                style={{ color: `${textColor}70` }}
                className="text-xs font-semibold font-mono shrink-0"
              >
                {categoryProducts.length} {categoryProducts.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            
            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {categoryProducts.map((product) => (
                <div key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
