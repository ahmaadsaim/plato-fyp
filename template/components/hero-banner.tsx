'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { useStore } from '../context/StoreContext'

export default function HeroBanner() {
  const { config } = useStore()
  const banners = config.heroBanners || []
  const [currentSlide, setCurrentSlide] = useState(0)

  if (banners.length === 0) return null

  const theme = config.metadata?.theme
  const primaryColor = theme?.primaryColor || '#84CC16'
  const primaryFg = theme?.primaryForeground || '#000000'
  const buttonColor = theme?.buttonColor || primaryColor
  const buttonFg = theme?.buttonTextColor || primaryFg

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
  }

  const currentBanner = banners[currentSlide]
  const headline = currentBanner.title || config.metadata?.tagline || config.metadata?.name || 'Handcrafted Flavors'
  const subtitle = currentBanner.subtitle || config.metadata?.name || ''

  return (
    <div className="relative bg-black overflow-hidden rounded-2xl md:rounded-3xl mx-3 sm:mx-4 md:mx-6 my-4 sm:my-6 shadow-xl">
      <div className="relative w-full aspect-[900/375] min-h-[220px] sm:min-h-[280px] max-h-[450px]">
        {/* Banner image / SVG rendering */}
        {currentBanner.image.endsWith('.svg') ? (
          <svg
            key={currentSlide}
            viewBox="0 0 900 375"
            preserveAspectRatio="xMidYMid slice"
            className="w-full h-full animate-in fade-in duration-500 opacity-60 sm:opacity-75"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <image xlinkHref={currentBanner.image} width="900" height="375" preserveAspectRatio="xMidYMid slice" />
          </svg>
        ) : (
          <Image
            src={currentBanner.image}
            alt={currentBanner.alt || 'Store Promotion'}
            fill
            className="object-cover animate-in fade-in duration-500 opacity-60 sm:opacity-75"
            priority
          />
        )}

        {/* Dynamic Gradient & Branded Typography Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20 flex flex-col justify-center px-4 sm:px-8 md:px-14 z-10 pointer-events-none">
          {subtitle && (
            <div className="mb-1.5 sm:mb-3 pointer-events-auto">
              <span
                style={{ backgroundColor: primaryColor, color: primaryFg }}
                className="inline-flex items-center px-2.5 sm:px-4 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs md:text-sm font-extrabold uppercase tracking-wider shadow-md"
              >
                {subtitle}
              </span>
            </div>
          )}
          <h1
            style={{ fontFamily: 'var(--brand-font-family, inherit)' }}
            className="text-lg sm:text-2xl md:text-4xl lg:text-5xl font-black text-white tracking-tight drop-shadow-md max-w-xl leading-tight sm:leading-snug mb-3 sm:mb-6 pointer-events-auto"
          >
            {headline}
          </h1>
          <div className="pointer-events-auto">
            <a
              href="#menu"
              style={{ backgroundColor: buttonColor, color: buttonFg }}
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-6 py-1.5 sm:py-3 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm md:text-base shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
            >
              Explore Menu
            </a>
          </div>
        </div>

        {/* Navigation Arrows (only if multiple slides) */}
        {banners.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              aria-label="Previous Slide"
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 z-20"
            >
              <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next Slide"
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 z-20"
            >
              <ChevronRight size={20} className="sm:w-6 sm:h-6" />
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-3 sm:bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full transition-all duration-300 hover:scale-125 ${
                    index === currentSlide ? 'bg-white scale-110 shadow' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
