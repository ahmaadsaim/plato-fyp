'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, User, CreditCard, Wallet, CheckCircle2, MessageSquare } from 'lucide-react'
import { useStore } from '../../context/StoreContext'
import { OrderCustomerInfo } from '../../types/store'

export default function CheckoutPage() {
  const router = useRouter()
  const { config, cartItems, cartSubtotal, deliveryFee, cartTotal, formatPrice, clearCart, selectedBranch } = useStore()

  const [orderPlaced, setOrderPlaced] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card' | 'whatsapp'>('cod')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState<OrderCustomerInfo>({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: config.metadata?.contact?.city || '',
    instructions: '',
  })

  const metadata = config.metadata
  const primaryColor = metadata?.theme?.primaryColor || '#60dbdc'
  const primaryFg = metadata?.theme?.primaryForeground || '#000000'

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const orderPayload = {
      orderId: `ORD-${Date.now().toString().slice(-6)}`,
      storeId: config.storeId || 'default',
      customer: formData,
      branch: selectedBranch,
      items: cartItems,
      subtotal: cartSubtotal,
      deliveryFee: deliveryFee,
      total: cartTotal,
      paymentMethod,
      createdAt: new Date().toISOString(),
    }

    // Optional: If WhatsApp payment/order method is selected
    if (paymentMethod === 'whatsapp' && metadata?.contact?.whatsapp) {
      const itemsList = cartItems
        .map(
          item =>
            `• ${item.quantity}x ${item.name} (${formatPrice(item.totalPrice || item.price)})${
              item.selectedAddOns?.length ? ` + ${item.selectedAddOns.join(', ')}` : ''
            }`
        )
        .join('\n')

      const message = `*New Order for ${metadata.name}*\n\n*Customer Details:*\nName: ${formData.name}\nPhone: ${formData.phone}\nAddress: ${formData.address}, ${formData.city}\nNotes: ${formData.instructions || 'None'}\n\n*Items:*\n${itemsList}\n\n*Subtotal:* ${formatPrice(cartSubtotal)}\n*Delivery Fee:* ${formatPrice(deliveryFee)}\n*Total:* ${formatPrice(cartTotal)}\n*Payment:* WhatsApp Order`
      
      const whatsappUrl = `https://wa.me/${metadata.contact.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`
      clearCart()
      window.open(whatsappUrl, '_blank')
      setOrderPlaced(true)
      return
    }

    // Standard order submission
    try {
      // In SaaS, post to backend API endpoint if configured:
      const apiEndpoint = process.env.NEXT_PUBLIC_SAAS_API_URL
      if (apiEndpoint) {
        await fetch(`${apiEndpoint}/api/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload),
        })
      }
    } catch (err) {
      console.warn('Order webhook call failed, proceeding to order confirmation:', err)
    }

    setIsSubmitting(false)
    setOrderPlaced(true)
    clearCart()

    setTimeout(() => {
      router.push('/')
    }, 3500)
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl animate-in zoom-in duration-500">
          <div 
            style={{ backgroundColor: primaryColor, color: primaryFg }}
            className="rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-md"
          >
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-3xl font-bold text-black mb-3">Order Placed!</h2>
          <p className="text-gray-600 mb-2">Thank you for ordering with {metadata?.name}.</p>
          <p className="text-gray-500 text-sm">We are preparing your items. Redirecting to store...</p>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
          <h2 className="text-2xl font-bold text-black mb-2">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-6 text-sm">Add some items to checkout.</p>
          <Link
            href="/"
            style={{ backgroundColor: primaryColor, color: primaryFg }}
            className="inline-block px-6 py-3 rounded-lg font-bold border-2 border-black hover:scale-105 transition-transform"
          >
            Return to Menu
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-300 hover:scale-110"
            aria-label="Go back"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center gap-3">
            {metadata?.logo && (
              <Image 
                src={metadata.logo} 
                alt={metadata.name} 
                width={40} 
                height={40}
                className="rounded-lg object-contain"
              />
            )}
            <h1 className="text-2xl font-bold text-black">Checkout</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Information */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
                <User size={22} />
                Delivery Information
              </h2>
              <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-all"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-all"
                      placeholder="e.g. 0300-1234567"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Email (Optional)</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Delivery Address *</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-all resize-none"
                    placeholder="House / Apartment #, Street, Area"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-black mb-2">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-all"
                    placeholder="City"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Delivery Instructions (Optional)</label>
                  <textarea
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-all resize-none"
                    placeholder="Special requests, directions, landmark"
                  />
                </div>
              </form>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
                <Wallet size={22} />
                Payment Method
              </h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:border-black transition-all">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="w-5 h-5 text-black focus:ring-black"
                  />
                  <Wallet size={20} />
                  <span className="font-semibold text-black">Cash on Delivery (COD)</span>
                </label>

                {metadata?.features?.enableWhatsAppOrder && metadata?.contact?.whatsapp && (
                  <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:border-black transition-all">
                    <input
                      type="radio"
                      name="payment"
                      value="whatsapp"
                      checked={paymentMethod === 'whatsapp'}
                      onChange={() => setPaymentMethod('whatsapp')}
                      className="w-5 h-5 text-emerald-600 focus:ring-emerald-600"
                    />
                    <MessageSquare size={20} className="text-emerald-600" />
                    <div>
                      <span className="font-semibold text-black">Instant WhatsApp Order</span>
                      <p className="text-xs text-gray-500">Send order directly to store WhatsApp chat</p>
                    </div>
                  </label>
                )}

                <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-not-allowed opacity-50 bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    disabled
                    className="w-5 h-5"
                  />
                  <CreditCard size={20} />
                  <span className="font-semibold text-gray-700">Online Card Payment (Coming Soon)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 sticky top-24">
              <h2 className="text-xl font-bold text-black mb-4">Order Summary</h2>
              
              {/* Items */}
              <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3 pb-3 border-b border-gray-100">
                    <div className="relative w-14 h-14 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={item.image || '/placeholder.svg'}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-black line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-sm font-bold text-black">
                        {formatPrice(item.totalPrice || item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">{formatPrice(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-semibold">{formatPrice(deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t-2 border-gray-200 pt-3">
                  <span className="text-black">Total</span>
                  <span className="text-black text-2xl">{formatPrice(cartTotal)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
                style={{ backgroundColor: primaryColor, color: primaryFg }}
                className="w-full py-3.5 sm:py-4 rounded-lg font-bold text-lg hover:bg-black hover:text-white transition-all duration-300 border-2 border-black hover:scale-[1.02] shadow-md mt-6 disabled:opacity-50"
              >
                {isSubmitting ? 'Placing Order...' : 'Place Order'}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By placing your order, you agree to store policies and terms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
