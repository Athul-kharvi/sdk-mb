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
  description: 'Handcrafted jewelry for the modern Indian woman. Free shipping on orders above ₹599, and easy returns.',
  // generator: 'v0.app',
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
        {/* <p className="font-brandon text-xl border border-red-500">
          BRANDON FONT
        </p>

        <p className="font-monoCustom text-xl">
          SIMPLY MONO FONT
        </p>
        <p className="font-syndicatgrotesk text-xl">
          SYNDICAT GROTESK FONT
        </p>
        <p className="font-kapraneuepro text-xl">
          KAPRANEUEPRO FONT
        </p>
        <p className="font-cormorantGaramond text-xl">
          CORMORANT GARAMOND FONT
        </p>
        <p className="font-dmSans text-xl">
          DM SANS FONT
        </p> */}
      </body>
    </html>
  )
}
