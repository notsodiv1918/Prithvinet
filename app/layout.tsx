import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PrithviNet — Environmental Monitoring Platform',
  description: 'Maharashtra State Pollution Control Board — Smart Environmental Monitoring & Compliance Platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      </head>
      <body>{children}</body>
    </html>
  )
}
