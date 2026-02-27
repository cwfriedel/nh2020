import NavBar from '@/components/NavBar'
import dynamic from 'next/dynamic'

export const metadata = {
  title: 'Interactive Map | Nevada County Natural Resources Report',
}

const MapClient = dynamic(() => import('@/components/MapClient'), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center bg-cream" style={{ minHeight: 500 }}>
      <div className="text-center">
        <div className="text-5xl mb-4">🗺</div>
        <div className="text-forest font-semibold text-lg">Loading interactive map…</div>
        <div className="text-gray-500 text-sm mt-1">Initializing Leaflet</div>
      </div>
    </div>
  ),
})

export default function MapPage() {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <NavBar />

      <div className="bg-sage/10 border-b border-sage/30 px-4 py-2 text-xs text-gray-600">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <a href="/" className="text-water hover:underline">Home</a>
          <span className="text-gray-400">›</span>
          <span className="font-medium text-gray-700">Interactive Map</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="bg-forest text-white px-6 py-4">
          <h1 className="text-xl font-bold">Nevada County Natural Resources — Interactive Map</h1>
          <p className="text-white/70 text-sm mt-1">
            Explore watersheds, elevation zones, and key natural features of Nevada County, CA
          </p>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row" style={{ minHeight: '600px' }}>
          <MapClient />
        </div>
      </div>

      <footer className="bg-forest text-white/70 text-xs py-3 px-6">
        <div className="max-w-7xl mx-auto">
          Map data © 2002 Nevada County Planning Department · Base map © OpenStreetMap contributors
        </div>
      </footer>
    </div>
  )
}
