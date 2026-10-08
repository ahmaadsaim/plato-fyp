export interface StoreMetadata {
  name: string
  tagline?: string
  description: string
  logo: string
  favicon?: string
  currency: {
    symbol: string
    code: string
    position?: 'before' | 'after'
  }
  contact: {
    phone: string
    email: string
    address: string
    city?: string
    country?: string
    whatsapp?: string
  }
  openingHours: {
    days: string
    hours: string
  }[]
  socialLinks: {
    facebook?: string
    instagram?: string
    twitter?: string
    tiktok?: string
    youtube?: string
  }
  theme: {
    name?: string // e.g. 'Plato Default'
    primaryColor: string // e.g. '#60dbdc'
    primaryForeground?: string // e.g. '#000000'
    secondaryColor?: string // e.g. '#1A1A1A'
    buttonColor?: string // e.g. '#E05A2B'
    buttonTextColor?: string // e.g. '#FFFFFF'
    cardColor?: string // e.g. '#FFFFFF'
    backgroundColor?: string // e.g. '#FFFFFF'
    textColor?: string // e.g. '#09090B'
    fontStyle?: 'sans' | 'serif' | 'display' | 'geometric' | string
    animationOption?: 'smooth' | 'energetic' | 'minimal' | string
    accentColor?: string
    borderRadius?: string // e.g. '0.75rem'
  }
  delivery: {
    fee: number
    freeDeliveryAbove?: number
    estimatedTimeMin?: number
    estimatedTimeMax?: number
    minimumOrder?: number
  }
  features: {
    enableCallAndOrder?: boolean
    enableBranchSelector?: boolean
    enableOrderNotes?: boolean
    enableWhatsAppOrder?: boolean
  }
}

export interface Branch {
  id: number | string
  name: string
  address: string
  phone: string
  city?: string
  isActive?: boolean
}

export interface HeroBannerSlide {
  id: number | string
  image: string
  alt: string
  title?: string
  subtitle?: string
  link?: string
}

export interface Category {
  id: number | string
  name: string
  description?: string
  banner?: string
  icon?: string
}

export interface ProductAddOn {
  name: string
  price: number
}

export interface MealOption {
  name: string
  description?: string
  price: number
}

export interface Product {
  id: number | string
  name: string
  description: string
  price: number
  image: string
  category: number | string
  isAvailable?: boolean
  isFeatured?: boolean
  badge?: string
  addOns?: ProductAddOn[]
  mealOptions?: MealOption[]
}

export interface StoreConfig {
  storeId?: string
  domain?: string
  metadata: StoreMetadata
  branches: Branch[]
  heroBanners: HeroBannerSlide[]
  categories: Category[]
  products: Product[]
  globalAddOns?: ProductAddOn[]
  globalMealOptions?: MealOption[]
}

export interface CartItem {
  id: string | number
  productId: string | number
  name: string
  description?: string
  image: string
  price: number
  quantity: number
  selectedAddOns?: string[]
  selectedMeal?: string
  instructions?: string
  totalPrice: number
}

export interface OrderCustomerInfo {
  name: string
  phone: string
  email?: string
  address: string
  city: string
  instructions?: string
}

export interface OrderPayload {
  orderId?: string
  storeId?: string
  customer: OrderCustomerInfo
  branch?: Branch
  items: CartItem[]
  subtotal: number
  deliveryFee: number
  total: number
  paymentMethod: 'cod' | 'card' | 'whatsapp' | string
  createdAt?: string
}

/**
 * Formats a currency amount according to store settings.
 * Kept here (client-safe) so client components can import it
 * without pulling in Node.js modules from lib/store-config.ts.
 */
export function formatCurrency(
  amount: number,
  currency?: { symbol: string; position?: 'before' | 'after' }
): string {
  const symbol = currency?.symbol || 'Rs.'
  const position = currency?.position || 'before'
  const formatted = amount.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
  return position === 'after' ? `${formatted} ${symbol}` : `${symbol} ${formatted}`
}
