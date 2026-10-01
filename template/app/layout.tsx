import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import { getStoreConfig } from '../lib/store-config'
import { StoreProvider } from '../context/StoreContext'

const poppins = Poppins({ 
  subsets: ['latin'], 
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins'
})

export async function generateMetadata(): Promise<Metadata> {
  const config = await getStoreConfig()
  const metadata = config.metadata

  return {
    title: `${metadata.name} - ${metadata.tagline || 'Order Online'}`,
    description: metadata.description,
    icons: {
      icon: metadata.favicon || '/icon.svg',
    },
    openGraph: {
      title: metadata.name,
      description: metadata.description,
      images: metadata.logo ? [metadata.logo] : [],
    },
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const config = await getStoreConfig()

  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans antialiased`}>
        <StoreProvider initialConfig={config}>
          {children}
        </StoreProvider>
      </body>
    </html>
  )
}
