import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const cormorantGaramond = Cormorant_Garamond({ 
  subsets: ["latin"],
  variable: '--font-serif',
  weight: ['300', '400', '500', '600', '700']
})

const dmSans = DM_Sans({ 
  subsets: ["latin"],
  variable: '--font-sans',
  weight: ['400', '500', '700']
})

export const metadata: Metadata = {
  title: 'Sri Devi Kangan - One Gram Gold Jewelry',
  description: 'Handcrafted one-gram gold jewelry for the modern Indian woman. BIS Hallmarked, free shipping, and easy returns.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${cormorantGaramond.variable} ${dmSans.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
