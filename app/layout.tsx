import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import localFont from "next/font/local";

const brandon = localFont({
  src: [
    { path: './fonts/brandon/brandon-regular.woff2', weight: '400', style: 'normal' },
  ],
  variable: '--font-brandon-grotesque',
  display: 'swap',
})

const syndicatgrotesk = localFont({
  src: [
    { path: './fonts/syndicatgrotesk/syndicatgrotesk-regular.woff2', weight: '400', style: 'normal' },
  ],
  variable: '--font-syndicatgrotesk',
})

const simplyMono = localFont({
  src: [
    { path: './fonts/simply-mono/simplymono-regular.woff2', weight: '400', style: 'normal' },
    { path: './fonts/simply-mono/simplymono-bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-simply-mono',
  display: 'swap',
})

const kapraneuepro = localFont({
  src: [
    { path: './fonts/kapraneuepro/kapraneuepro.woff2', weight: '400', style: 'normal' },
  ],
  variable: '--font-kapraneuepro',  // ← renamed
  display: 'swap',
})


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
      className={`
    ${brandon.variable}
    ${simplyMono.variable}
    ${cormorantGaramond.variable}
    ${dmSans.variable}
    ${kapraneuepro.variable}
    ${syndicatgrotesk.variable}
  `}
    >
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
