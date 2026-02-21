import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from '@vercel/analytics/next';


export const metadata: Metadata = {
  title: 'US - Fishing & Huntingshop',
  description: 'Ihr Spezialist für Jagd- und Angelausrüstung. Premium Outdoor-Ausrüstung zu fairen Preisen.',
  generator: '9745 Sevelen',
  /** Color del navegador (barra de direcciones, pestañas, etc.) */
  themeColor: '#2C5F2E',
  icons: {
    icon: '/favicon.png',
    apple: '/icon-192x192.png',
  },
  manifest: '/manifest.json',
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Meta redundante por si prefieres incluirla manualmente */}
        <meta name="theme-color" content="#3333" />
      </head>
      <body>{children} <Analytics /></body>
    </html>
  )
}
