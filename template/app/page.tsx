'use client'

import Header from '../components/header'
import HeroBanner from '../components/hero-banner'
import MenuCategories from '../components/menu-categories'
import ProductsGrid from '../components/products-grid'
import CartSidebar from '../components/cart-sidebar'
import Footer from '../components/footer'
import DemoStoreSwitcher from '../components/demo-store-switcher'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="animate-in fade-in duration-700">
        <HeroBanner />
      </div>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
        <MenuCategories />
      </div>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
        <ProductsGrid />
      </div>
      <Footer />
      <CartSidebar />
      <DemoStoreSwitcher />
    </div>
  )
}
