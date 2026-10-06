'use client'

import Image from 'next/image'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { useStore } from '../context/StoreContext'

export default function Footer() {
  const { config } = useStore()
  const metadata = config.metadata
  const theme = metadata?.theme
  const primaryColor = theme?.primaryColor || '#84CC16'
  const primaryFg = theme?.primaryForeground || '#000000'
  const cardColor = theme?.cardColor || '#FFFFFF'
  const textColor = theme?.textColor || '#09090B'

  return (
    <footer 
      style={{ 
        backgroundColor: cardColor, 
        borderTopColor: primaryColor, 
        color: textColor 
      }} 
      className="border-t-4 mt-12 transition-colors" 
      id="about"
    >
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & About */}
          <div className="space-y-4">
            {metadata?.logo ? (
              <Image 
                src={metadata.logo} 
                alt={metadata.name} 
                width={100} 
                height={100}
                unoptimized
                className="rounded-lg object-contain max-h-16 w-auto"
              />
            ) : (
              <h3 style={{ color: textColor }} className="font-extrabold text-2xl">{metadata?.name}</h3>
            )}
            {metadata?.tagline && (
              <p style={{ color: `${textColor}99` }} className="text-sm font-bold tracking-wider uppercase">
                {metadata.tagline}
              </p>
            )}
            <p style={{ color: `${textColor}80` }} className="text-xs sm:text-sm leading-relaxed">
              {metadata?.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={{ color: textColor }} className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#menu" style={{ color: `${textColor}85` }} className="hover:opacity-75 transition-opacity text-sm">
                  Our Menu
                </a>
              </li>
              <li>
                <a href="#about" style={{ color: `${textColor}85` }} className="hover:opacity-75 transition-opacity text-sm">
                  About Us
                </a>
              </li>
              <li>
                <a href="#contact" style={{ color: `${textColor}85` }} className="hover:opacity-75 transition-opacity text-sm">
                  Contact & Locations
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div id="contact">
            <h3 style={{ color: textColor }} className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              {metadata?.contact?.address && (
                <li className="flex items-start gap-2 text-sm" style={{ color: `${textColor}85` }}>
                  <MapPin size={18} className="flex-shrink-0 mt-0.5" style={{ color: primaryColor }} />
                  <span>{metadata.contact.address}</span>
                </li>
              )}
              {metadata?.contact?.phone && (
                <li className="flex items-center gap-2 text-sm" style={{ color: `${textColor}85` }}>
                  <Phone size={18} className="flex-shrink-0" style={{ color: primaryColor }} />
                  <a href={`tel:${metadata.contact.phone}`} className="hover:underline">
                    {metadata.contact.phone}
                  </a>
                </li>
              )}
              {metadata?.contact?.email && (
                <li className="flex items-center gap-2 text-sm" style={{ color: `${textColor}85` }}>
                  <Mail size={18} className="flex-shrink-0" style={{ color: primaryColor }} />
                  <a href={`mailto:${metadata.contact.email}`} className="hover:underline">
                    {metadata.contact.email}
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 style={{ color: textColor }} className="text-lg font-bold mb-4">Opening Hours</h3>
            {metadata?.openingHours && metadata.openingHours.length > 0 ? (
              <ul className="space-y-2">
                {metadata.openingHours.map((schedule, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm" style={{ color: `${textColor}85` }}>
                    <Clock size={18} className="flex-shrink-0 mt-0.5" style={{ color: primaryColor }} />
                    <div>
                      <p style={{ color: textColor }} className="font-semibold">{schedule.days}</p>
                      <p>{schedule.hours}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: `${textColor}60` }} className="text-sm">Open 7 days a week</p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div 
        style={{ backgroundColor: primaryColor, color: primaryFg }}
        className="transition-colors"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm font-semibold text-center sm:text-left">
              © {new Date().getFullYear()} {metadata?.name || 'Storefront'}. All rights reserved.
            </p>

            {/* Social Media */}
            <div className="flex items-center gap-3">
              {metadata?.socialLinks?.facebook && (
                <a
                  href={metadata.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="bg-white text-black p-2 rounded-full hover:bg-black hover:text-white transition-all duration-300 hover:scale-110 border-2 border-black"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              )}
              {metadata?.socialLinks?.instagram && (
                <a
                  href={metadata.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="bg-white text-black p-2 rounded-full hover:bg-black hover:text-white transition-all duration-300 hover:scale-110 border-2 border-black"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              )}
              {metadata?.socialLinks?.twitter && (
                <a
                  href={metadata.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="bg-white text-black p-2 rounded-full hover:bg-black hover:text-white transition-all duration-300 hover:scale-110 border-2 border-black"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
