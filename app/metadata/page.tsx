import NavBar from '@/components/NavBar'

export const metadata = {
  title: 'GIS Metadata | Nevada County Natural Resources Report',
}

const datasets = [
  { key: 'aqb', title: 'Aquatic Buffers', category: 'Water' },
  { key: 'blueoak', title: 'Blue Oak Woodland', category: 'Vegetation' },
  { key: 'calacada', title: 'California Academic Database', category: 'Species' },
  { key: 'calwater', title: 'California Watersheds (CalWater)', category: 'Water' },
  { key: 'calwaterz', title: 'California Watersheds (Zones)', category: 'Water' },
  { key: 'canalsa', title: 'Canals & Aqueducts', category: 'Infrastructure' },
  { key: 'cdffisher', title: 'CDF Fisher Habitat', category: 'Wildlife' },
  { key: 'class1ca', title: 'Class I Waters (CA)', category: 'Water' },
  { key: 'cwc_lpz', title: 'CWC Lakebed Protection Zones', category: 'Water' },
  { key: 'cwc_smp', title: 'CWC Stream Management Plan', category: 'Water' },
  { key: 'damdivnon', title: 'Dams & Diversions (Non-NID)', category: 'Infrastructure' },
  { key: 'dams', title: 'NID Dams', category: 'Infrastructure' },
  { key: 'dev_ce', title: 'Development in Conservation Easements', category: 'Land Use' },
  { key: 'districts', title: 'Water Districts', category: 'Land Use' },
  { key: 'ermance', title: 'Ermance Data', category: 'Other' },
  { key: 'fens', title: 'Fens & Bog Habitats', category: 'Vegetation' },
  { key: 'few', title: 'Fresh Emergent Wetlands', category: 'Vegetation' },
  { key: 'fr', title: 'Foothill Riparian', category: 'Vegetation' },
  { key: 'furbpntsa', title: 'Furbearer Point Sites', category: 'Wildlife' },
  { key: 'gabbro', title: 'Gabbro Soils', category: 'Geology' },
  { key: 'geonamea', title: 'Geographic Names', category: 'Reference' },
  { key: 'hydrarca', title: 'Hydrologic Arc Coverage', category: 'Water' },
  { key: 'hydraulic', title: 'Hydraulic Gold Mining Sites', category: 'Infrastructure' },
  { key: 'hydrpoa', title: 'Hydrology Point Coverage', category: 'Water' },
  { key: 'hydrpola', title: 'Hydrology Polygon Coverage', category: 'Water' },
  { key: 'incasites', title: 'INCA Archaeological Sites', category: 'Other' },
  { key: 'irrigateda', title: 'Irrigated Lands', category: 'Land Use' },
  { key: 'knobcone', title: 'Knobcone Pine', category: 'Vegetation' },
  { key: 'lacustrine', title: 'Lacustrine (Lake) Habitats', category: 'Water' },
  { key: 'lacustrine24', title: 'Lacustrine Habitats (24k)', category: 'Water' },
  { key: 'lavacaps', title: 'Lava Caps / Volcanic Terrain', category: 'Geology' },
  { key: 'leatheroak', title: 'Leather Oak Chaparral', category: 'Vegetation' },
  { key: 'macnab', title: 'McNab Cypress', category: 'Vegetation' },
  { key: 'milsa', title: 'Military Sites', category: 'Other' },
  { key: 'ncfjepson', title: 'NCF Jepson Plant Data', category: 'Species' },
  { key: 'ncwhr', title: 'NV County Wildlife Habitat Relationships', category: 'Wildlife' },
  { key: 'nddbpnt', title: 'NDDB Point Occurrences', category: 'Species' },
  { key: 'nevco', title: 'Nevada County Boundary', category: 'Reference' },
  { key: 'nevcolands', title: 'Nevada County Land Ownership', category: 'Land Use' },
  { key: 'nevstr24', title: 'Nevada County Streams (24k)', category: 'Water' },
  { key: 'nevveg', title: 'Nevada County Vegetation', category: 'Vegetation' },
  { key: 'nh2020rdls', title: 'NH2020 Roadless Areas', category: 'Land Use' },
  { key: 'nid', title: 'Nevada Irrigation District', category: 'Infrastructure' },
  { key: 'plantsn', title: 'Plant Species (Nevada)', category: 'Species' },
  { key: 'privatef', title: 'Private Forest Lands', category: 'Land Use' },
  { key: 'publicf', title: 'Public Forest Lands', category: 'Land Use' },
  { key: 'put_urbgt10ac', title: 'Potential Urban Areas (>10 ac)', category: 'Land Use' },
  { key: 'rds_sed', title: 'Roads & Sedimentation', category: 'Infrastructure' },
  { key: 'rdsfa', title: 'Roads in Floodplain Areas', category: 'Infrastructure' },
  { key: 'roadsa', title: 'Roads Coverage', category: 'Infrastructure' },
  { key: 'serp', title: 'Serpentine Soils', category: 'Geology' },
  { key: 'shafts', title: 'Mine Shafts', category: 'Infrastructure' },
  { key: 'sncso', title: 'Sierra Nevada Conservancy Study Area', category: 'Reference' },
  { key: 'soil123a', title: 'Soil Classes 1-2-3', category: 'Geology' },
  { key: 'springs', title: 'Springs', category: 'Water' },
  { key: 'state_park', title: 'State Parks', category: 'Land Use' },
  { key: 'statelands', title: 'State Lands', category: 'Land Use' },
  { key: 'streams100k', title: 'Streams (100k scale)', category: 'Water' },
  { key: 'streams24k', title: 'Streams (24k scale)', category: 'Water' },
  { key: 'te', title: 'Threatened & Endangered Species', category: 'Species' },
  { key: 'tnffroga', title: 'Tahoe NF Frog Habitats', category: 'Wildlife' },
  { key: 'tnflak24a', title: 'Tahoe NF Lakes (24k)', category: 'Water' },
  { key: 'usfsbirda', title: 'USFS Bird Surveys', category: 'Wildlife' },
  { key: 'usfsplnta', title: 'USFS Plant Surveys', category: 'Species' },
  { key: 'verts', title: 'Vertebrate Occurrences', category: 'Wildlife' },
  { key: 'whitebark', title: 'Whitebark Pine', category: 'Vegetation' },
  { key: 'willowf', title: 'Willow Flycatcher Habitat', category: 'Wildlife' },
]

const categoryColors: Record<string, string> = {
  Water: 'bg-blue-100 text-blue-700',
  Vegetation: 'bg-green-100 text-green-700',
  Wildlife: 'bg-amber-100 text-amber-700',
  Geology: 'bg-stone-100 text-stone-700',
  'Land Use': 'bg-purple-100 text-purple-700',
  Infrastructure: 'bg-gray-100 text-gray-700',
  Species: 'bg-teal-100 text-teal-700',
  Reference: 'bg-indigo-100 text-indigo-700',
  Other: 'bg-rose-100 text-rose-700',
}

const categories = [...new Set(datasets.map((d) => d.category))].sort()

export default function MetadataPage() {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <NavBar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        <header className="mb-8 pb-4 border-b-2 border-sage/40">
          <h1 className="text-3xl font-bold text-forest">GIS Metadata Catalog</h1>
          <p className="mt-2 text-sm text-gray-600">
            FGDC-compliant metadata for 67 spatial datasets included with the Nevada County Natural
            Resources Report. These datasets are in ESRI Shapefile and GeoTIFF format, originally
            distributed on CD-ROM Volume 2.
          </p>
        </header>

        {/* Category summary */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => {
            const count = datasets.filter((d) => d.category === cat).length
            return (
              <span
                key={cat}
                className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[cat] || 'bg-gray-100 text-gray-700'}`}
              >
                {cat} ({count})
              </span>
            )
          })}
        </div>

        {/* Dataset grid */}
        {categories.map((cat) => (
          <section key={cat} className="mb-8">
            <h2 className="text-lg font-bold text-forest mb-3 flex items-center gap-2">
              <span
                className={`px-2 py-0.5 rounded text-xs ${categoryColors[cat] || 'bg-gray-100 text-gray-700'}`}
              >
                {cat}
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {datasets
                .filter((d) => d.category === cat)
                .map((dataset) => (
                  <div
                    key={dataset.key}
                    className="bg-white rounded-lg border border-sage/20 p-4 shadow-sm"
                  >
                    <div className="font-medium text-sm text-gray-800 mb-1">{dataset.title}</div>
                    <div className="text-xs text-gray-500 font-mono">{dataset.key}.shp</div>
                    <div className="mt-3 flex items-center gap-2 text-xs">
                      <span className="text-gray-400">FGDC Metadata</span>
                      <span className="text-gray-300">·</span>
                      <span className="text-gray-400">ESRI Shapefile</span>
                    </div>
                    <div className="mt-2 text-xs text-gray-500 italic">
                      Projection: CA State Plane Zone 2, NAD83
                    </div>
                  </div>
                ))}
            </div>
          </section>
        ))}

        {/* GeoTIFF section */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-forest mb-4">Raster Datasets (GeoTIFF)</h2>
          <p className="text-sm text-gray-600 mb-4">
            The following raster datasets are provided in PackBits-compressed GeoTIFF format, in
            California State Plane Zone 2 (NAD83) projection.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { key: 'nevdem10', title: 'Digital Elevation Model (10m)' },
              { key: 'nevdem50', title: 'Digital Elevation Model (50m)' },
              { key: 'nevdem250', title: 'Digital Elevation Model (250m)' },
              { key: 'nevshd10', title: 'Hillshade Relief (10m)' },
              { key: 'nevshd30', title: 'Hillshade Relief (30m)' },
              { key: 'nevshd50', title: 'Hillshade Relief (50m)' },
              { key: 'nevshd100', title: 'Hillshade Relief (100m)' },
              { key: 'nevslp', title: 'Slope' },
              { key: 'nevslp50', title: 'Slope (50m)' },
              { key: 'nevslgt30', title: 'Slope / Geomorphology (30m)' },
              { key: 'nevcodem30', title: 'County DEM (30m)' },
              { key: 'nevcog', title: 'COG (Cloud Optimized GeoTIFF)' },
              { key: 'nevholland', title: 'Holland Vegetation Classification' },
              { key: 'nevprism', title: 'PRISM Climate Data' },
              { key: 'nevfuelg', title: 'Fire Fuel Model' },
              { key: 'fire_rec', title: 'Fire Recovery Areas' },
              { key: 'riparian', title: 'Riparian Areas (Raster)' },
              { key: 'prec35', title: 'Precipitation (35-year avg)' },
              { key: 'demshd250', title: 'DEM Hillshade (250m)' },
              { key: 'z00nevdemdir', title: 'Flow Direction' },
            ].map((ds) => (
              <div
                key={ds.key}
                className="bg-white rounded-lg border border-blue-100 p-4 shadow-sm"
              >
                <div className="font-medium text-sm text-gray-800 mb-1">{ds.title}</div>
                <div className="text-xs text-gray-500 font-mono">{ds.key}.tif</div>
                <div className="mt-2 text-xs text-gray-500 italic">GeoTIFF Raster</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-forest text-white/70 text-xs py-4 px-6">
        <div className="max-w-5xl mx-auto">
          © 2002 Nevada County Planning Department · Natural Heritage 2020
        </div>
      </footer>
    </div>
  )
}
