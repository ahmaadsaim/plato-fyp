"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, User, CreditCard, Wallet, CheckCircle2, MessageSquare } from "lucide-react";
import type { StoreConfig, OrderCustomerInfo } from "@/template/types/store";
import { StoreProvider, useStore } from "@/template/context/StoreContext";

function CheckoutPageContent() {
  const router = useRouter();
  const {
    config,
    cartItems,
    cartSubtotal,
    deliveryFee,
    cartTotal,
    formatPrice,
    clearCart,
    selectedBranch,
  } = useStore();

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card" | "whatsapp">("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<OrderCustomerInfo>({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: config.metadata?.contact?.city || "",
    instructions: "",
  });

  const metadata = config.metadata;
  const primaryColor = metadata?.theme?.primaryColor || "#84CC16";
  const primaryFg = metadata?.theme?.primaryForeground || "#000000";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderPayload = {
      orderId: `ORD-${Date.now().toString().slice(-6)}`,
      storeId: config.storeId || "default",
      customer: formData,
      branch: selectedBranch,
      items: cartItems,
      subtotal: cartSubtotal,
      deliveryFee: deliveryFee,
      total: cartTotal,
      paymentMethod,
      createdAt: new Date().toISOString(),
    };

    // If WhatsApp payment/order method is selected
    if (paymentMethod === "whatsapp" && metadata?.contact?.whatsapp) {
      const itemsList = cartItems
        .map(
          (item) =>
            `• ${item.quantity}x ${item.name} (${formatPrice(item.totalPrice || item.price)})${
              item.selectedAddOns?.length ? ` + ${item.selectedAddOns.join(", ")}` : ""
            }`
        )
        .join("\n");

      const message = `*New Order for ${metadata.name}*\n\n*Customer Details:*\nName: ${formData.name}\nPhone: ${formData.phone}\nAddress: ${formData.address}, ${formData.city}\nNotes: ${formData.instructions || "None"}\n\n*Items:*\n${itemsList}\n\n*Subtotal:* ${formatPrice(cartSubtotal)}\n*Delivery Fee:* ${formatPrice(deliveryFee)}\n*Total:* ${formatPrice(cartTotal)}\n*Payment:* WhatsApp Order`;

      const whatsappUrl = `https://wa.me/${metadata.contact.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`;
      clearCart();
      window.open(whatsappUrl, "_blank");
      setOrderPlaced(true);
      return;
    }

    // Standard order submission
    try {
      const apiEndpoint = process.env.NEXT_PUBLIC_SAAS_API_URL;
      if (apiEndpoint) {
        await fetch(`${apiEndpoint}/api/orders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderPayload),
        });
      }
    } catch (err) {
      console.warn("Order webhook call failed, proceeding to confirmation:", err);
    }

    setIsSubmitting(false);
    setOrderPlaced(true);
    clearCart();

    setTimeout(() => {
      router.push("/");
    }, 3500);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center shadow-xl border border-gray-100 animate-in zoom-in-95 duration-300">
          <div
            style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 size={44} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Order Confirmed!</h2>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            Thank you for ordering with <strong className="text-gray-800">{metadata.name}</strong>. Your delicious meal is being prepared and will be delivered shortly.
          </p>
          <div className="p-4 bg-gray-50 rounded-2xl mb-6 text-left border border-gray-100 text-xs space-y-1">
            <p className="text-gray-400 font-mono">Deliver to: <span className="text-gray-800 font-medium">{formData.address}, {formData.city}</span></p>
            <p className="text-gray-400 font-mono">Payment: <span className="text-gray-800 font-medium uppercase">{paymentMethod}</span></p>
            <p className="text-gray-400 font-mono">Total Paid: <span className="text-gray-900 font-bold">{formatPrice(cartTotal)}</span></p>
          </div>
          <Link
            href="/"
            style={{ backgroundColor: primaryColor, color: primaryFg }}
            className="inline-block w-full py-3.5 rounded-xl font-bold text-sm shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Return to Storefront
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Top Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-black transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Back to Menu</span>
          </Link>

          <div className="flex items-center gap-2">
            {metadata.logo ? (
              <Image
                src={metadata.logo}
                alt={metadata.name}
                width={36}
                height={36}
                className="rounded-lg object-contain"
              />
            ) : (
              <div
                style={{ backgroundColor: primaryColor, color: primaryFg }}
                className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm"
              >
                {metadata.name.charAt(0)}
              </div>
            )}
            <span className="font-extrabold text-base tracking-tight text-gray-900">
              {metadata.name}
            </span>
          </div>
        </div>
      </header>

      {/* Main Checkout Container */}
      <main className="max-w-5xl mx-auto px-4 pt-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Checkout</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Complete your order and arrange fast delivery.
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-200 max-w-lg mx-auto space-y-4">
            <p className="text-lg font-bold text-gray-800">Your basket is empty</p>
            <p className="text-xs text-gray-500">Add some delicious dishes before proceeding to checkout.</p>
            <Link
              href="/"
              style={{ backgroundColor: primaryColor, color: primaryFg }}
              className="inline-block px-6 py-2.5 rounded-xl font-bold text-xs shadow-sm hover:opacity-90"
            >
              Explore Menu
            </Link>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left 7 Columns: Delivery & Payment Details */}
            <div className="lg:col-span-7 space-y-6">
              {/* Customer Contact */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-200 space-y-4">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <User size={18} style={{ color: primaryColor }} />
                  <span>Contact Information</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-black focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="e.g. +1 555-0192"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-black focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Email Address <span className="text-gray-400 font-normal">(Optional for receipt)</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-black focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-200 space-y-4">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <span style={{ color: primaryColor }}>📍</span>
                  <span>Delivery Address</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Street Address & Apt / Suite <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      placeholder="123 Delicious Lane, Apt 4B"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-black focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      placeholder="City"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-black focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Delivery Instructions / Landmark
                  </label>
                  <textarea
                    name="instructions"
                    rows={2}
                    placeholder="e.g. Ring the doorbell twice, leave at reception"
                    value={formData.instructions}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-black focus:bg-white transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-200 space-y-4">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Wallet size={18} style={{ color: primaryColor }} />
                  <span>Payment Method</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cod")}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                      paymentMethod === "cod"
                        ? "border-black bg-gray-50 ring-1 ring-black"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-gray-900">Cash on Delivery</span>
                      {paymentMethod === "cod" && <CheckCircle2 size={16} className="text-black" />}
                    </div>
                    <span className="text-[11px] text-gray-500">Pay cash upon arrival</span>
                  </button>

                  {metadata?.contact?.whatsapp && (
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("whatsapp")}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                        paymentMethod === "whatsapp"
                          ? "border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-emerald-800 flex items-center gap-1">
                          <MessageSquare size={13} className="text-emerald-600" /> WhatsApp
                        </span>
                        {paymentMethod === "whatsapp" && <CheckCircle2 size={16} className="text-emerald-600" />}
                      </div>
                      <span className="text-[11px] text-gray-500">Instant chat order</span>
                    </button>
                  )}

                  <button
                    type="button"
                    disabled
                    className="p-3.5 rounded-xl border border-dashed border-gray-200 bg-gray-50 text-left opacity-60 cursor-not-allowed flex flex-col justify-between gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-gray-400 flex items-center gap-1">
                        <CreditCard size={13} /> Credit Card
                      </span>
                      <span className="text-[9px] uppercase font-bold bg-gray-200 text-gray-600 px-1.5 py-0.2 rounded">
                        Soon
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-400">Online gateway</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Order Summary Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-200 sticky top-24 space-y-5">
                <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
                  Order Summary ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})
                </h3>

                {/* Items Mini List */}
                <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-xs gap-3">
                      <div className="flex items-center gap-2.5 truncate">
                        <span
                          style={{ backgroundColor: `${primaryColor}25`, color: primaryColor }}
                          className="w-5 h-5 rounded flex items-center justify-center font-bold text-[11px] flex-shrink-0"
                        >
                          {item.quantity}×
                        </span>
                        <div className="truncate">
                          <p className="font-semibold text-gray-900 truncate">{item.name}</p>
                          {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                            <p className="text-[10px] text-gray-400 truncate">
                              +{item.selectedAddOns.join(", ")}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="font-mono font-medium text-gray-800 flex-shrink-0">
                        {formatPrice(item.totalPrice || item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Price Calculations */}
                <div className="pt-3 border-t border-gray-100 space-y-2 text-xs">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span className="font-mono text-gray-800">{formatPrice(cartSubtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Delivery Fee</span>
                    <span className="font-mono text-gray-800">
                      {deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-black text-gray-900 pt-2 border-t border-gray-100">
                    <span>Total</span>
                    <span className="font-mono">{formatPrice(cartTotal)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || cartItems.length === 0}
                  style={{ backgroundColor: primaryColor, color: primaryFg }}
                  className="w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? "Placing Order..." : `Place Order • ${formatPrice(cartTotal)}`}
                </button>

                <p className="text-[11px] text-center text-gray-400">
                  By clicking Place Order you agree to store policies and terms.
                </p>
              </div>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}

export default function CheckoutClient({ initialConfig }: { initialConfig: StoreConfig }) {
  return (
    <StoreProvider initialConfig={initialConfig}>
      <CheckoutPageContent />
    </StoreProvider>
  );
}
