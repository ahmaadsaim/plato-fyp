'use client'

import { useState } from 'react'
import { useStore } from '../context/StoreContext'

export default function MenuCategories() {
  const { config } = useStore()
  const rawCategories = config.categories || []
  const [activeCategory, setActiveCategory] = useState<number | string>(0)

  const categories = [{ id: 0, name: 'All' }, ...rawCategories]
  const theme = config.metadata?.theme
  const primaryColor = theme?.primaryColor || '#84CC16'
  const primaryFg = theme?.primaryForeground || '#000000'
  const buttonColor = theme?.buttonColor || primaryColor
  const buttonFg = theme?.buttonTextColor || primaryFg
  const cardColor = theme?.cardColor || '#FFFFFF'
  const textColor = theme?.textColor || '#09090B'

  const scrollToCategory = (categoryId: number | string) => {
    setActiveCategory(categoryId)
    
    if (categoryId === 0) {
      const menuSection = document.getElementById('menu')
      if (menuSection) {
        const yOffset = -100
        const y = menuSection.getBoundingClientRect().top + window.pageYOffset + yOffset
        window.scrollTo({ top: y, behavior: 'smooth' })
      }
    } else {
      const element = document.getElementById(`category-${categoryId}`)
      if (element) {
        const yOffset = -120
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
        window.scrollTo({ top: y, behavior: 'smooth' })
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8" id="menu">
      <h2 style={{ color: textColor }} className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Our Menu</h2>
      <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-4 -mx-3 sm:-mx-4 px-3 sm:px-4 scrollbar-hide scroll-smooth">
        {categories.map((category, index) => {
          const isActive = activeCategory === category.id
          return (
            <button
              key={category.id}
              onClick={() => scrollToCategory(category.id)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold whitespace-nowrap transition-all duration-300 text-sm sm:text-base hover:scale-105 active:scale-95 border-2 ${
                isActive
                  ? 'shadow-md'
                  : 'hover:opacity-80 hover:shadow-xs'
              }`}
              style={{
                animationDelay: `${index * 50}ms`,
                backgroundColor: isActive ? buttonColor : cardColor,
                color: isActive ? buttonFg : textColor,
                borderColor: isActive ? buttonColor : `${textColor}25`,
              }}
            >
              {category.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
