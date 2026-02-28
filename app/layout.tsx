import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Analytics } from '@vercel/analytics/next';
import { CookieBanner } from '@/components/cookie-banner'
import { DemoBanner } from '@/components/demo-banner'


export const metadata: Metadata = {
  title: 'Hot-Sauce Shop — Scharfe Saucen · Schweiz',
  description: 'Ihr Schweizer Spezialist für Hot Sauces, Chilisaucen & Gewürze aus aller Welt. Über 200 Saucen — von mild bis extrem scharf. Schnelle Lieferung in der Schweiz.',
  generator: '9475 Sevelen',
  icons: {
    icon: '/favicon.png',
    apple: '/icon-192x192.png',
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  themeColor: '#CC0000',
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children} <Analytics /><CookieBanner /></body>
    </html>
  )
}
