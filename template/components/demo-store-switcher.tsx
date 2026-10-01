'use client'

import { useState } from 'react'
import { Sparkles, ChevronDown, Check, Store } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { sampleStores } from '../lib/store-config'

const businesses = [
  {
    id: 'holy-buns',
    name: 'Holy Buns (Reference)',
    category: 'Burgers & Shakes',
    color: '#60dbdc',
    currency: 'Rs. (PKR)',
  },
  {
    id: 'burger-craft',
    name: 'Business A: Burger Craft & Co.',
    category: 'Gourmet Smash Burgers',
    color: '#f59e0b',
    currency: '$ (USD)',
  },
  {
    id: 'pizza-artisan',
    name: 'Business B: Artisan Crust Co.',
    category: 'Wood-Fired Neapolitan Pizza',
    color: '#e64a19',
    currency: '$ (USD)',
  },
  {
    id: 'sushi-sakura',
    name: 'Business C: Sakura Sushi Bar',
    category: 'Modern Japanese & Omakase',
    color: '#e11d48',
    currency: '$ (USD)',
  },
  {
    id: 'velvet-bakery',
    name: 'Business D: Velvet Roasters & Bakery',
    category: 'Specialty Coffee & Sourdough Pastries',
    color: '#b45309',
    currency: '€ (EUR)',
  },
  {
    id: 'taco-cantina',
    name: 'Business E: La Fiesta Taco Cantina',
    category: 'Authentic Street Tacos & Mexican Grill',
    color: '#10b981',
    currency: '$ (USD)',
  },
]

export default function DemoStoreSwitcher() {
  const { config, setStoreConfig, clearCart } = useStore()
  const [open, setOpen] = useState(false)

  const currentStoreId = config.storeId || 'default'

  const handleSelectBusiness = (businessId: string) => {
    const selected = sampleStores[businessId]
    if (selected) {
      clearCart()
      setStoreConfig(selected)
      setOpen(false)
    }
  }

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 bg-black/90 hover:bg-black text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 sm:py-2.5 rounded-full shadow-2xl backdrop-blur-md border border-white/20 transition-all duration-300 hover:scale-105 active:scale-95"
          title="Switch demo business template"
        >
          <Sparkles size={16} className="text-amber-400 animate-spin-slow" />
          <span className="hidden sm:inline text-white/70">Customized For:</span>
          <span className="font-bold text-white truncate max-w-[150px] sm:max-w-[180px]">
            {config.metadata?.name || 'Switch Store'}
          </span>
          <ChevronDown size={14} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={() => setOpen(false)}
            />
            <div className="absolute bottom-12 left-0 z-40 w-[290px] sm:w-[320px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200">
              <div className="bg-gray-900 text-white p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Store size={18} className="text-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-wider">Switch Business Preset</span>
                </div>
                <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-mono">
                  100% Config
                </span>
              </div>

              <div className="p-2 max-h-[340px] overflow-y-auto space-y-1">
                {businesses.map((biz) => {
                  const isActive = currentStoreId === biz.id || (biz.id === 'holy-buns' && currentStoreId === 'holy-buns-lahore')
                  return (
                    <button
                      key={biz.id}
                      onClick={() => handleSelectBusiness(biz.id)}
                      className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between group ${
                        isActive ? 'bg-gray-100 font-bold' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-3.5 h-3.5 rounded-full flex-shrink-0 shadow-sm"
                          style={{ backgroundColor: biz.color }}
                        />
                        <div>
                          <div className="text-xs font-bold text-black group-hover:text-black line-clamp-1">
                            {biz.name}
                          </div>
                          <div className="text-[10px] text-gray-500 line-clamp-1">
                            {biz.category} • <span className="font-semibold">{biz.currency}</span>
                          </div>
                        </div>
                      </div>
                      {isActive && <Check size={16} className="text-black ml-2 flex-shrink-0" />}
                    </button>
                  )
                })}
              </div>

              <div className="p-2.5 bg-gray-50 border-t border-gray-100 text-[10px] text-gray-500 leading-tight">
                Instantly swaps branding, colors, currencies, delivery fees, and full menus.
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
