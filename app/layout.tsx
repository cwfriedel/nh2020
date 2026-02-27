import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nevada County Natural Resources Report',
  description: 'A scientifically-sound analysis of the distribution and characteristics of Nevada County\'s watersheds, habitats, and plant and animal species. Natural Heritage 2020.',
  keywords: 'Nevada County, natural resources, wildlife, watersheds, vegetation, California, Sierra Nevada',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-cream">
        {children}
      </body>
    </html>
  )
}
