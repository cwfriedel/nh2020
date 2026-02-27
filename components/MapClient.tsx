'use client'
import { useEffect, useRef, useState } from 'react'

// Nevada County approximate boundary polygon (WGS84)
// Derived from TIGER/Line county boundaries
const NEVADA_COUNTY_APPROX = {
  type: 'Feature' as const,
  properties: { name: 'Nevada County, CA' },
  geometry: {
    type: 'Polygon' as const,
    coordinates: [[
      [-121.033, 39.073], [-121.028, 39.133], [-121.005, 39.153], [-120.988, 39.194],
      [-120.968, 39.232], [-120.947, 39.258], [-120.940, 39.301], [-120.916, 39.330],
      [-120.881, 39.347], [-120.856, 39.369], [-120.834, 39.401], [-120.801, 39.420],
      [-120.763, 39.432], [-120.724, 39.445], [-120.686, 39.457], [-120.647, 39.465],
      [-120.601, 39.469], [-120.563, 39.458], [-120.518, 39.444], [-120.469, 39.432],
      [-120.421, 39.427], [-120.375, 39.419], [-120.321, 39.408], [-120.275, 39.391],
      [-120.231, 39.368], [-120.190, 39.341], [-120.147, 39.308], [-120.102, 39.272],
      [-120.066, 39.236], [-120.038, 39.196], [-120.025, 39.155], [-120.019, 39.113],
      [-120.021, 39.072], [-120.027, 39.030], [-120.042, 38.991], [-120.065, 38.957],
      [-120.097, 38.937], [-120.137, 38.928], [-120.185, 38.934], [-120.235, 38.947],
      [-120.286, 38.955], [-120.338, 38.961], [-120.391, 38.967], [-120.443, 38.972],
      [-120.494, 38.979], [-120.545, 38.984], [-120.600, 38.985], [-120.654, 38.984],
      [-120.709, 38.988], [-120.762, 38.997], [-120.813, 39.011], [-120.860, 39.027],
      [-120.904, 39.043], [-120.946, 39.053], [-120.989, 39.060], [-121.033, 39.073],
    ]],
  },
}

// Major watersheds / river systems in Nevada County
const RIVERS = [
  {
    name: 'South Yuba River',
    coords: [[-121.02, 39.28], [-120.85, 39.32], [-120.71, 39.38], [-120.58, 39.41], [-120.42, 39.40]],
    color: '#4a7fa5',
  },
  {
    name: 'Middle Yuba River',
    coords: [[-121.00, 39.36], [-120.82, 39.40], [-120.65, 39.43], [-120.49, 39.45]],
    color: '#4a7fa5',
  },
  {
    name: 'North Yuba River',
    coords: [[-121.01, 39.43], [-120.83, 39.45], [-120.67, 39.46], [-120.50, 39.47]],
    color: '#4a7fa5',
  },
  {
    name: 'Bear River',
    coords: [[-121.02, 39.10], [-120.88, 39.08], [-120.72, 39.07], [-120.58, 39.09]],
    color: '#5a9fc5',
  },
  {
    name: 'Truckee River',
    coords: [[-120.28, 39.36], [-120.15, 39.32], [-120.05, 39.29]],
    color: '#6ab0d5',
  },
]

// Key locations
const PLACES = [
  { name: 'Nevada City', lat: 39.2613, lon: -121.0154, type: 'city' },
  { name: 'Grass Valley', lat: 39.2191, lon: -121.0605, type: 'city' },
  { name: 'Truckee', lat: 39.3276, lon: -120.1833, type: 'city' },
  { name: 'Auburn (border)', lat: 38.9155, lon: -121.0743, type: 'ref' },
  { name: 'Lake Tahoe (E border)', lat: 39.17, lon: -120.04, type: 'lake' },
  { name: 'Englebright Reservoir', lat: 39.2375, lon: -121.2706, type: 'water' },
  { name: 'Rollins Reservoir', lat: 39.1469, lon: -121.0194, type: 'water' },
  { name: 'Mt. Lola (9,143 ft)', lat: 39.4248, lon: -120.3716, type: 'peak' },
]

// Elevation zones
const ELEVATION_ZONES = [
  {
    name: 'Zone 1: Valley Foothill (< 2,000 ft)',
    desc: 'Blue oak, foothill pine, annual grasslands, foothill riparian',
    color: '#d4a574',
    range: '< 2,000 ft',
  },
  {
    name: 'Zone 2: Lower Montane (2,000–4,000 ft)',
    desc: 'Mixed conifer, ponderosa pine, black oak, canyon live oak',
    color: '#8fbc68',
    range: '2,000–4,000 ft',
  },
  {
    name: 'Zone 3: Montane (4,000–6,500 ft)',
    desc: 'White fir, Jeffrey pine, red fir, aspen, wet meadows',
    color: '#5a8c3c',
    range: '4,000–6,500 ft',
  },
  {
    name: 'Zone 4: Upper Montane (6,500–8,000 ft)',
    desc: 'Red fir, lodgepole pine, subalpine meadows',
    color: '#3a6c2c',
    range: '6,500–8,000 ft',
  },
  {
    name: 'Zone 5: Subalpine (> 8,000 ft)',
    desc: 'Whitebark pine, subalpine forest, alpine fell-fields',
    color: '#1a4c1c',
    range: '> 8,000 ft',
  },
]

const LAYER_DEFS = [
  { id: 'county', label: 'County Boundary', default: true },
  { id: 'rivers', label: 'Major Rivers', default: true },
  { id: 'places', label: 'Key Locations', default: true },
  { id: 'elevation', label: 'Elevation Zone Legend', default: true },
]

async function loadGeoJson(path: string) {
  const res = await fetch(path)
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`)
  return res.json()
}

export default function MapClient() {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMapRef = useRef<any>(null)
  const [layers, setLayers] = useState<Record<string, boolean>>({
    county: true,
    rivers: true,
    places: true,
    elevation: true,
  })
  const [mapReady, setMapReady] = useState(false)

  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return

    const initMap = async () => {
      const L = (await import('leaflet')).default
      // CSS is loaded via global stylesheet

      // Center on Nevada County
      const map = L.map(mapRef.current!, {
        center: [39.25, -120.52],
        zoom: 10,
        zoomControl: true,
      })

      leafletMapRef.current = map

      // OSM base layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map)

      let countyData: any = NEVADA_COUNTY_APPROX
      let hydrologyData: any = null
      try {
        const [countyJson, hydrologyJson] = await Promise.all([
          loadGeoJson('/gis/county.geojson'),
          loadGeoJson('/gis/hydrology.geojson'),
        ])
        countyData = countyJson
        hydrologyData = hydrologyJson
      } catch (e) {
        // Fallback to bundled approximation if GIS files are unavailable.
        console.warn('GIS data unavailable; using fallback map geometry.', e)
      }

      // County boundary layer
      const countyLayer = L.geoJSON(countyData as any, {
        style: {
          color: '#4a5e2a',
          weight: 3,
          opacity: 0.9,
          fillColor: '#8a9a5b',
          fillOpacity: 0.08,
          dashArray: '8, 4',
        },
      }).addTo(map)
      countyLayer.bindPopup('<strong>Nevada County, CA</strong><br/>Area: ~974 sq mi<br/>3 major watersheds: Yuba, Bear, Truckee')
      ;(countyLayer as any)._customId = 'county'

      if (hydrologyData?.features?.length) {
        const riversLayer = L.geoJSON(hydrologyData as any, {
          style: {
            color: '#4a7fa5',
            weight: 1.2,
            opacity: 0.55,
          },
          onEachFeature: (feature, layer) => {
            ;(layer as any)._customId = 'rivers'
            const major = (feature as any)?.properties?.MAJOR1
            const minor = (feature as any)?.properties?.MINOR1
            layer.bindPopup(`<strong>Hydrology Segment</strong><br/>Class: ${major ?? 'n/a'}-${minor ?? 'n/a'}`)
          },
        }).addTo(map)
        ;(riversLayer as any).eachLayer((layer: any) => {
          layer._customId = 'rivers'
        })
      } else {
        // River layers fallback
        RIVERS.forEach((r) => {
          const line = L.polyline(r.coords.map((c) => [c[1], c[0]] as [number, number]), {
            color: r.color,
            weight: 2.5,
            opacity: 0.8,
          }).addTo(map)
          line.bindPopup(`<strong>${r.name}</strong>`)
          ;(line as any)._customId = 'rivers'
        })
      }

      // Place markers
      const icons: Record<string, string> = {
        city: '🏘',
        lake: '🌊',
        water: '💧',
        peak: '⛰',
        ref: '📍',
      }

      PLACES.forEach((p) => {
        const icon = L.divIcon({
          html: `<div class="flex items-center gap-1 bg-white/90 border border-gray-300 rounded px-1.5 py-0.5 text-xs font-medium shadow-sm whitespace-nowrap">${icons[p.type] || '📍'} ${p.name}</div>`,
          className: '',
          iconAnchor: [0, 10],
        })
        const marker = L.marker([p.lat, p.lon], { icon }).addTo(map)
        marker.bindPopup(`<strong>${p.name}</strong>`)
        ;(marker as any)._customId = 'places'
      })

      // Watershed labels (text only)
      const watershedLabels = [
        { lat: 39.38, lon: -120.68, text: 'Yuba River<br/>Watershed' },
        { lat: 39.09, lon: -120.85, text: 'Bear River<br/>Watershed' },
        { lat: 39.30, lon: -120.15, text: 'Truckee River<br/>Watershed' },
      ]

      watershedLabels.forEach((w) => {
        const icon = L.divIcon({
          html: `<div class="text-xs text-center text-blue-800 font-semibold opacity-80">${w.text}</div>`,
          className: '',
        })
        L.marker([w.lat, w.lon], { icon, interactive: false }).addTo(map)
      })

      setMapReady(true)
      requestAnimationFrame(() => {
        map.invalidateSize()
      })

      const onResize = () => map.invalidateSize()
      window.addEventListener('resize', onResize)
      ;(map as any)._onResizeHandler = onResize
    }

    initMap()

    return () => {
      if (leafletMapRef.current) {
        const onResize = (leafletMapRef.current as any)._onResizeHandler
        if (onResize) window.removeEventListener('resize', onResize)
        leafletMapRef.current.remove()
        leafletMapRef.current = null
      }
    }
  }, [])

  // Toggle layer visibility
  const toggleLayer = (layerId: string) => {
    if (!leafletMapRef.current) return
    const map = leafletMapRef.current
    const newState = !layers[layerId]
    setLayers((prev) => ({ ...prev, [layerId]: newState }))

    map.eachLayer((layer: any) => {
      if (layer._customId === layerId) {
        if (newState) {
          map.addLayer(layer)
        } else {
          map.removeLayer(layer)
        }
      }
    })
  }

  return (
    <div className="flex w-full flex-1 min-h-0 flex-col lg:flex-row gap-0 h-full">
      {/* Sidebar */}
      <div className="lg:w-72 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0">
        <div className="p-4 border-b border-gray-100 bg-forest text-white">
          <h2 className="font-bold text-sm">Map Layers</h2>
          <p className="text-xs text-white/70 mt-1">Toggle layers to explore the county</p>
        </div>

        <div className="p-4 space-y-2">
          {LAYER_DEFS.map((layer) => (
            <label key={layer.id} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={layers[layer.id] ?? layer.default}
                onChange={() => toggleLayer(layer.id)}
                className="rounded border-gray-300 text-forest"
              />
              <span className="text-sm text-gray-700 group-hover:text-forest transition-colors">
                {layer.label}
              </span>
            </label>
          ))}
        </div>

        {/* Elevation zone legend */}
        <div className="p-4 border-t border-gray-100">
          <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-3">
            Elevation Zones
          </h3>
          <div className="space-y-2">
            {ELEVATION_ZONES.map((zone) => (
              <div key={zone.name} className="flex gap-2">
                <div
                  className="w-4 h-4 rounded flex-shrink-0 mt-0.5 border border-gray-200"
                  style={{ backgroundColor: zone.color }}
                />
                <div>
                  <div className="text-xs font-medium text-gray-700">{zone.range}</div>
                  <div className="text-xs text-gray-500 leading-tight">{zone.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key stats */}
        <div className="p-4 border-t border-gray-100 bg-sage/5">
          <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-3">
            County Facts
          </h3>
          <dl className="space-y-1 text-xs">
            {[
              ['Area', '~974 sq mi'],
              ['Elevation range', '250 – 9,143 ft'],
              ['Watersheds', '100 planning units'],
              ['Major drainages', 'Yuba, Bear, Truckee'],
              ['Plant taxa', '1,814 documented'],
              ['Ecosystems', '27 large-patch types'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-2">
                <dt className="text-gray-500">{k}</dt>
                <dd className="font-medium text-gray-700 text-right">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Data note */}
        <div className="p-4 border-t border-gray-100 text-xs text-gray-500 italic">
          Base map: © OpenStreetMap contributors. Boundary and hydrology layers from Nevada County
          Natural Resources Report GIS archive (2002).
        </div>
      </div>

      {/* Map container */}
      <div className="relative flex-1 min-w-0" style={{ minHeight: '500px' }}>
        <div ref={mapRef} className="absolute inset-0" />
        {!mapReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-cream z-10">
            <div className="text-center">
              <div className="text-4xl mb-3">🗺</div>
              <div className="text-forest font-medium">Loading map…</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
