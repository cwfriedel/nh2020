import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const RAW_DIR = path.join(ROOT, 'data', 'gis_raw', 'shape')
const OUT_DIR = path.join(ROOT, 'public', 'gis')
const LAYERS_DIR = path.join(OUT_DIR, 'layers')
const METADATA_PAGE = path.join(ROOT, 'app', 'metadata', 'page.tsx')

const CALIBRATION_SOURCE = 'geonamea'
const MAX_SHP_BYTES = 20 * 1024 * 1024

const SOURCE_ALIASES = {
  hydrpoa: 'hydropoa',
  streams24k: 'nevstr24',
}

function readDbf(filePath) {
  const b = fs.readFileSync(filePath)
  const count = b.readUInt32LE(4)
  const headerLength = b.readUInt16LE(8)
  const recordLength = b.readUInt16LE(10)

  const fields = []
  let offset = 32
  while (b[offset] !== 0x0d) {
    const name = b.toString('latin1', offset, offset + 11).replace(/\0.*$/, '').trim()
    const type = String.fromCharCode(b[offset + 11])
    const length = b[offset + 16]
    const decimals = b[offset + 17]
    fields.push({ name, type, length, decimals })
    offset += 32
  }

  const rows = []
  for (let i = 0; i < count; i += 1) {
    const rowStart = headerLength + i * recordLength
    if (b[rowStart] === 0x2a) continue
    const row = {}
    let pos = rowStart + 1
    for (const field of fields) {
      const raw = b.toString('latin1', pos, pos + field.length)
      pos += field.length
      const text = raw.trim()
      if (field.type === 'N' || field.type === 'F') {
        row[field.name] = text.length ? Number.parseFloat(text) : null
      } else {
        row[field.name] = text
      }
    }
    rows.push(row)
  }

  return rows
}

function readShp(filePath) {
  const b = fs.readFileSync(filePath)
  const features = []
  let offset = 100

  while (offset < b.length) {
    const contentLength = b.readInt32BE(offset + 4) * 2
    const recordOffset = offset + 8
    const recType = b.readInt32LE(recordOffset)
    const recordEnd = recordOffset + contentLength

    if (recType === 0) {
      offset = recordEnd
      continue
    }

    if (recType === 1) {
      const x = b.readDoubleLE(recordOffset + 4)
      const y = b.readDoubleLE(recordOffset + 12)
      features.push({ type: 'Point', coordinates: [x, y] })
      offset = recordEnd
      continue
    }

    if (recType !== 3 && recType !== 5) {
      throw new Error(`Unsupported record shape type ${recType} in ${filePath}`)
    }

    const numParts = b.readInt32LE(recordOffset + 36)
    const numPoints = b.readInt32LE(recordOffset + 40)
    const partsOffset = recordOffset + 44
    const pointsOffset = partsOffset + numParts * 4

    const partStarts = []
    for (let i = 0; i < numParts; i += 1) {
      partStarts.push(b.readInt32LE(partsOffset + i * 4))
    }
    partStarts.push(numPoints)

    const parts = []
    for (let p = 0; p < numParts; p += 1) {
      const start = partStarts[p]
      const end = partStarts[p + 1]
      const ring = []
      for (let i = start; i < end; i += 1) {
        const pt = pointsOffset + i * 16
        const x = b.readDoubleLE(pt)
        const y = b.readDoubleLE(pt + 8)
        ring.push([x, y])
      }
      parts.push(ring)
    }

    if (recType === 3) {
      features.push({
        type: parts.length === 1 ? 'LineString' : 'MultiLineString',
        coordinates: parts.length === 1 ? parts[0] : parts,
      })
    } else {
      features.push({
        type: parts.length === 1 ? 'Polygon' : 'MultiPolygon',
        coordinates: parts.length === 1 ? [parts[0]] : parts.map((ring) => [ring]),
      })
    }

    offset = recordEnd
  }

  return features
}

function solve3x3(a, b) {
  const m = [
    [a[0][0], a[0][1], a[0][2], b[0]],
    [a[1][0], a[1][1], a[1][2], b[1]],
    [a[2][0], a[2][1], a[2][2], b[2]],
  ]

  for (let i = 0; i < 3; i += 1) {
    let pivot = i
    for (let r = i + 1; r < 3; r += 1) {
      if (Math.abs(m[r][i]) > Math.abs(m[pivot][i])) pivot = r
    }
    if (pivot !== i) [m[i], m[pivot]] = [m[pivot], m[i]]

    const d = m[i][i]
    for (let c = i; c < 4; c += 1) m[i][c] /= d

    for (let r = 0; r < 3; r += 1) {
      if (r === i) continue
      const factor = m[r][i]
      for (let c = i; c < 4; c += 1) m[r][c] -= factor * m[i][c]
    }
  }

  return [m[0][3], m[1][3], m[2][3]]
}

function fitAffine(sourcePoints, targetPoints) {
  const xx = sourcePoints.reduce((acc, [x]) => acc + x * x, 0)
  const xy = sourcePoints.reduce((acc, [x, y]) => acc + x * y, 0)
  const x1 = sourcePoints.reduce((acc, [x]) => acc + x, 0)
  const yy = sourcePoints.reduce((acc, [, y]) => acc + y * y, 0)
  const y1 = sourcePoints.reduce((acc, [, y]) => acc + y, 0)
  const n = sourcePoints.length

  const a = [
    [xx, xy, x1],
    [xy, yy, y1],
    [x1, y1, n],
  ]

  const bx = [
    sourcePoints.reduce((acc, [x], i) => acc + x * targetPoints[i][0], 0),
    sourcePoints.reduce((acc, [, y], i) => acc + y * targetPoints[i][0], 0),
    targetPoints.reduce((acc, [tx]) => acc + tx, 0),
  ]
  const by = [
    sourcePoints.reduce((acc, [x], i) => acc + x * targetPoints[i][1], 0),
    sourcePoints.reduce((acc, [, y], i) => acc + y * targetPoints[i][1], 0),
    targetPoints.reduce((acc, [, ty]) => acc + ty, 0),
  ]

  const [ax, bx2, cx] = solve3x3(a, bx)
  const [ay, by2, cy] = solve3x3(a, by)
  return ([x, y]) => [ax * x + bx2 * y + cx, ay * x + by2 * y + cy]
}

function transformGeometry(geom, project) {
  if (geom.type === 'Point') return { ...geom, coordinates: project(geom.coordinates) }
  if (geom.type === 'LineString') return { ...geom, coordinates: geom.coordinates.map(project) }
  if (geom.type === 'MultiLineString') {
    return { ...geom, coordinates: geom.coordinates.map((line) => line.map(project)) }
  }
  if (geom.type === 'Polygon') {
    return { ...geom, coordinates: geom.coordinates.map((ring) => ring.map(project)) }
  }
  if (geom.type === 'MultiPolygon') {
    return {
      ...geom,
      coordinates: geom.coordinates.map((poly) => poly.map((ring) => ring.map(project))),
    }
  }
  throw new Error(`Unsupported geometry type ${geom.type}`)
}

function parseMetadataDatasets() {
  const source = fs.readFileSync(METADATA_PAGE, 'utf8')
  const blockMatch = source.match(/const datasets = \[(.*?)\]\n\nconst categoryColors/s)
  if (!blockMatch) throw new Error('Could not parse datasets block from metadata page')

  const datasets = []
  const re = /\{ key: '([^']+)', title: '([^']+)', category: '([^']+)' \}/g
  let m = re.exec(blockMatch[1])
  while (m) {
    datasets.push({ key: m[1], title: m[2], category: m[3] })
    m = re.exec(blockMatch[1])
  }
  return datasets
}

function scanShapefileTriples() {
  const triples = new Set()
  const parts = new Map()

  for (const name of fs.readdirSync(RAW_DIR)) {
    const full = path.join(RAW_DIR, name)
    if (!fs.statSync(full).isFile()) continue
    const ext = path.extname(name).toLowerCase()
    if (!['.shp', '.shx', '.dbf'].includes(ext)) continue
    const stem = path.basename(name, ext).toLowerCase()
    if (!parts.has(stem)) parts.set(stem, new Set())
    parts.get(stem).add(ext.slice(1))
  }

  for (const [stem, set] of parts.entries()) {
    if (set.has('shp') && set.has('shx') && set.has('dbf')) triples.add(stem)
  }

  return triples
}

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, JSON.stringify(payload))
}

function build() {
  fs.rmSync(LAYERS_DIR, { recursive: true, force: true })
  const datasets = parseMetadataDatasets()
  const triples = scanShapefileTriples()

  if (!triples.has(CALIBRATION_SOURCE)) {
    throw new Error(`Missing calibration source '${CALIBRATION_SOURCE}' in ${RAW_DIR}`)
  }

  const calibDbf = readDbf(path.join(RAW_DIR, `${CALIBRATION_SOURCE}.dbf`))
  const calibShp = readShp(path.join(RAW_DIR, `${CALIBRATION_SOURCE}.shp`))

  const calibration = []
  for (let i = 0; i < Math.min(calibDbf.length, calibShp.length); i += 1) {
    const row = calibDbf[i]
    const shpPt = calibShp[i]?.coordinates
    if (!shpPt) continue
    if (!Number.isFinite(row.LONDD) || !Number.isFinite(row.LATDD)) continue
    calibration.push({ source: shpPt, target: [row.LONDD, row.LATDD] })
  }
  if (calibration.length < 10) {
    throw new Error('Not enough calibration points to compute coordinate transform')
  }

  const project = fitAffine(
    calibration.map((c) => c.source),
    calibration.map((c) => c.target),
  )

  const convertedSources = new Set()

  function convertSource(source) {
    if (convertedSources.has(source)) return

    const shpPath = path.join(RAW_DIR, `${source}.shp`)
    const shpSize = fs.statSync(shpPath).size
    if (shpSize > MAX_SHP_BYTES) {
      throw new Error(`SOURCE_TOO_LARGE:${source}:${shpSize}`)
    }

    const dbf = readDbf(path.join(RAW_DIR, `${source}.dbf`))
    const shp = readShp(shpPath)

    const features = shp.map((geom, i) => {
      if (source === CALIBRATION_SOURCE) {
        return {
          type: 'Feature',
          properties: dbf[i] ?? {},
          geometry: {
            type: 'Point',
            coordinates: [
              dbf[i]?.LONDD ?? project(geom.coordinates)[0],
              dbf[i]?.LATDD ?? project(geom.coordinates)[1],
            ],
          },
        }
      }

      return {
        type: 'Feature',
        properties: dbf[i] ?? {},
        geometry: transformGeometry(geom, project),
      }
    })

    writeJson(path.join(LAYERS_DIR, `${source}.geojson`), {
      type: 'FeatureCollection',
      features,
    })

    convertedSources.add(source)
  }

  const catalog = datasets.map((dataset) => {
    const source = (SOURCE_ALIASES[dataset.key] ?? dataset.key).toLowerCase()

    if (!triples.has(source)) {
      return {
        ...dataset,
        source,
        available: false,
        reason: 'missing_source',
      }
    }

    try {
      convertSource(source)
      return {
        ...dataset,
        source,
        file: `/gis/layers/${source}.geojson`,
        available: true,
      }
    } catch (err) {
      const msg = String(err?.message ?? err)
      if (msg.startsWith('SOURCE_TOO_LARGE:')) {
        return {
          ...dataset,
          source,
          available: false,
          reason: 'too_large',
        }
      }
      throw err
    }
  })

  writeJson(path.join(OUT_DIR, 'catalog.json'), catalog)

  // Core compatibility outputs used by the map shell.
  const coreCopy = {
    county: 'nevcob',
    hydrology: 'hydrarca',
    places: 'geonamea',
    lakes: 'lake_e89',
    springs: 'springs',
    wetlands: 'few',
    serpentine: 'serp',
    gabbro: 'gabbro',
    zones: 'zones',
  }
  for (const [name, source] of Object.entries(coreCopy)) {
    if (!convertedSources.has(source)) {
      if (triples.has(source)) {
        try {
          convertSource(source)
        } catch {
          continue
        }
      } else {
        continue
      }
    }
    fs.copyFileSync(
      path.join(LAYERS_DIR, `${source}.geojson`),
      path.join(OUT_DIR, `${name}.geojson`),
    )
  }
}

build()
