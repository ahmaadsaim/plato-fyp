'use client'

import { MapPin, Phone, X, Check } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useStore } from '../context/StoreContext'
import { Branch } from '../types/store'

export default function Header() {
  const { config, selectedBranch, setSelectedBranch, cartItems, cartOpen, setCartOpen } = useStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [branchModalOpen, setBranchModalOpen] = useState(false)

  const branches = config.branches || []
  const hasBranches = branches.length > 0
  const metadata = config.metadata

  const handleBranchSelect = (branch: Branch) => {
    setSelectedBranch(branch)
    setBranchModalOpen(false)
  }

  const theme = metadata?.theme
  const primaryColor = theme?.primaryColor || '#84CC16'
  const primaryFg = theme?.primaryForeground || '#000000'
  const cardColor = theme?.cardColor || '#FFFFFF'
  const textColor = theme?.textColor || '#09090B'

  return (
    <header 
      style={{ backgroundColor: cardColor, borderColor: `${textColor}15`, color: textColor }}
      className="border-b transition-colors"
    >
      {/* Top Banner: Branch Selection & Call to Order */}
      <div 
        style={{ backgroundColor: primaryColor, color: primaryFg }}
        className="py-1.5 sm:py-3 px-2 sm:px-4 md:px-6 mx-2 sm:mx-4 md:mx-6 rounded-lg mt-2 sm:mt-4 mb-2 sm:mb-4 flex flex-row gap-1.5 sm:gap-2 justify-between items-center transition-colors"
      >
        {hasBranches && metadata?.features?.enableBranchSelector !== false ? (
          <button 
            onClick={() => setBranchModalOpen(true)}
            style={{ backgroundColor: cardColor, color: textColor, borderColor: `${textColor}25` }}
            className="flex items-center justify-center gap-0.5 sm:gap-2 px-1.5 sm:px-4 py-1 sm:py-2 rounded-md sm:rounded-lg font-semibold hover:opacity-90 transition-all duration-300 border hover:scale-105 hover:shadow-lg group text-[10px] sm:text-base"
          >
            <MapPin size={12} className="sm:w-[18px] sm:h-[18px] transition-transform duration-300 group-hover:rotate-12" />
            <span className="whitespace-nowrap">{selectedBranch ? selectedBranch.name : 'Select Branch'}</span>
          </button>
        ) : (
          <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-sm font-semibold px-2">
            <MapPin size={14} />
            <span>{metadata?.contact?.city || metadata?.name}</span>
          </div>
        )}

        {metadata?.contact?.phone && metadata?.features?.enableCallAndOrder !== false && (
          <a
            href={`tel:${metadata.contact.phone}`}
            style={{ backgroundColor: cardColor, color: textColor, borderColor: `${textColor}25` }}
            className="flex items-center justify-center gap-0.5 sm:gap-2 px-1.5 sm:px-4 py-1 sm:py-2 rounded-md sm:rounded-lg font-semibold hover:opacity-90 transition-all duration-300 border hover:scale-105 hover:shadow-lg group text-[10px] sm:text-base"
          >
            <Phone size={12} className="sm:w-[18px] sm:h-[18px] transition-transform duration-300 group-hover:rotate-12" />
            <span className="whitespace-nowrap">Call and Order</span>
          </a>
        )}
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 flex items-center justify-between py-4 sm:py-4 md:py-6 relative">
        {/* Left: Menu Icon */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1 sm:p-2 rounded-lg transition-all duration-300 group hover:opacity-80"
          aria-label="Toggle menu"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-[48px] md:h-[48px] flex flex-col justify-center items-center gap-1.5 cursor-pointer">
            <span style={{ backgroundColor: textColor }} className="w-6 h-0.5 rounded-full transition-all duration-300 group-hover:w-7"></span>
            <span style={{ backgroundColor: textColor }} className="w-6 h-0.5 rounded-full transition-all duration-300 group-hover:w-5"></span>
            <span style={{ backgroundColor: textColor }} className="w-6 h-0.5 rounded-full transition-all duration-300 group-hover:w-7"></span>
          </div>
        </button>

        {/* Center: Logo & Store Name */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2 py-2">
          <Link href="/" className="flex items-center gap-2 group">
            {metadata?.logo ? (
              <Image 
                src={metadata.logo} 
                alt={metadata.name || 'Store Logo'} 
                width={100} 
                height={100}
                unoptimized
                className="rounded-lg object-contain w-16 h-16 sm:w-20 sm:h-20 md:w-[100px] md:h-[100px] transition-transform duration-300 group-hover:scale-105"
                priority
              />
            ) : (
              <span style={{ color: textColor }} className="font-extrabold text-2xl tracking-tight">{metadata?.name}</span>
            )}
          </Link>
        </div>

        {/* Right: Cart Icon */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => setCartOpen(!cartOpen)}
            className="relative group p-2"
            aria-label="Open cart"
          >
            <div className="relative transition-all duration-300 group-hover:scale-110 group-hover:rotate-[-5deg] group-active:scale-95">
              <svg 
                style={{ color: textColor }}
                className="w-8 h-8 sm:w-10 sm:h-10 transition-all duration-300"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartItems.length > 0 && (
                <span 
                  style={{ backgroundColor: primaryColor, color: primaryFg, borderColor: cardColor }}
                  className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 text-xs font-bold min-w-5 h-5 sm:min-w-6 sm:h-6 px-1 sm:px-1.5 rounded-full flex items-center justify-center border-2 shadow-md animate-bounce"
                >
                  {cartItems.length}
                </span>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Sidebar Menu */}
      <div 
        className={`fixed inset-0 bg-black/60 z-50 transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div 
          style={{ backgroundColor: cardColor, color: textColor }}
          className={`fixed left-0 top-0 bottom-0 w-full sm:w-[380px] shadow-2xl transition-transform duration-300 ease-in-out z-50 ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <h2 style={{ color: textColor }} className="text-2xl font-bold">{metadata?.name || 'Menu'}</h2>
              <button
                style={{ color: textColor }}
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:opacity-75 rounded-lg transition"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>
            <nav className="flex flex-col gap-3">
              <a 
                href="#menu" 
                style={{ color: textColor }}
                className="font-semibold text-lg transition py-3 px-4 rounded-lg hover:opacity-80"
                onClick={() => setMobileMenuOpen(false)}
              >
                Our Menu
              </a>
              <a 
                href="#about" 
                style={{ color: textColor }}
                className="font-semibold text-lg transition py-3 px-4 rounded-lg hover:opacity-80"
                onClick={() => setMobileMenuOpen(false)}
              >
                About Store
              </a>
              <a 
                href="#contact" 
                style={{ color: textColor }}
                className="font-semibold text-lg transition py-3 px-4 rounded-lg hover:opacity-80"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact & Hours
              </a>
              {metadata?.contact?.whatsapp && (
                <a 
                  href={`https://wa.me/${metadata.contact.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-500 font-semibold text-lg py-3 px-4 rounded-lg hover:opacity-80 flex items-center gap-2 mt-4"
                >
                  Chat on WhatsApp
                </a>
              )}
            </nav>
          </div>
        </div>
      </div>

      {/* Branch Selection Modal */}
      {branchModalOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-50 transition-opacity duration-300 flex items-center justify-center p-3 sm:p-4"
          onClick={() => setBranchModalOpen(false)}
        >
          <div 
            style={{ backgroundColor: cardColor, color: textColor }}
            className="rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-md p-4 sm:p-6 transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 style={{ color: textColor }} className="text-xl sm:text-2xl font-bold">Select Branch</h2>
              <button
                style={{ color: textColor }}
                onClick={() => setBranchModalOpen(false)}
                className="p-2 hover:opacity-75 rounded-lg transition"
              >
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>
            
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {branches.map((branch) => (
                <button
                  key={branch.id}
                  onClick={() => handleBranchSelect(branch)}
                  style={{ borderColor: `${textColor}20` }}
                  className={`w-full text-left p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-300 hover:scale-[1.01] ${
                    selectedBranch?.id === branch.id
                      ? 'shadow-sm'
                      : 'hover:opacity-90'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <MapPin size={16} style={{ color: primaryColor }} />
                        <h3 style={{ color: textColor }} className="font-bold text-base sm:text-lg">{branch.name}</h3>
                      </div>
                      <p style={{ color: `${textColor}90` }} className="text-xs sm:text-sm ml-5 sm:ml-6 mb-2">{branch.address}</p>
                      {branch.phone && (
                        <p style={{ color: `${textColor}70` }} className="text-xs sm:text-sm ml-5 sm:ml-6 flex items-center gap-1">
                          <Phone size={12} />
                          {branch.phone}
                        </p>
                      )}
                    </div>
                    {selectedBranch?.id === branch.id && (
                      <div 
                        style={{ backgroundColor: primaryColor, color: primaryFg }}
                        className="rounded-full p-1 ml-2 flex-shrink-0"
                      >
                        <Check size={14} />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setBranchModalOpen(false)}
              style={{ backgroundColor: primaryColor, color: primaryFg }}
              className="w-full mt-4 sm:mt-6 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold text-sm sm:text-base shadow-md hover:scale-[1.02] transition-all duration-300"
            >
              Confirm Branch
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
