import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import localFont from "next/font/local";

const brandon = localFont({
  src: [
    { path: './fonts/brandon/brandon-regular.woff2', weight: '400', style: 'normal' },
  ],
  variable: '--font-brandon-grotesque',
  display: 'swap',
  preload: true,
})

const syndicatgrotesk = localFont({
  src: [
    { path: './fonts/syndicatgrotesk/syndicatgrotesk-regular.woff2', weight: '400', style: 'normal' },
  ],
  variable: '--font-syndicatgrotesk',
  display: 'swap',
  preload: true,
})

const simplyMono = localFont({
  src: [
    { path: './fonts/simply-mono/simplymono-regular.woff2', weight: '400', style: 'normal' },
  ],
  variable: '--font-simply-mono',
  display: 'optional',
  preload: false,
})

const kapraneuepro = localFont({
  src: [
    { path: './fonts/kapraneuepro/kapraneuepro.woff2', weight: '400', style: 'normal' },
  ],
  variable: '--font-kapraneuepro',
  display: 'optional',
  preload: false,
})

export const metadata: Metadata = {
  metadataBase: new URL('https://sridevik.in'),
  title: 'Vinayak Creation',
  description: "Free shipping on orders above ₹599, and easy returns.",
  // generator: 'v0.app',
  icons: {
    icon: [
      { url: '/images/logo/vinayak_logo.png', type: 'image/png' },
    ],
    apple: '/images/logo/vinayak_logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${brandon.variable} ${syndicatgrotesk.variable} ${simplyMono.variable} ${kapraneuepro.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://gmutwwuglrhyvcpzealx.supabase.co" />
        <link rel="dns-prefetch" href="https://gmutwwuglrhyvcpzealx.supabase.co" />
      </head>
      <body className="font-brandon">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
