import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const RAW_DIR = path.join(ROOT, 'data', 'gis_raw', 'shape')
const OUT_DIR = path.join(ROOT, 'public', 'gis')

const FILES = {
  county: 'nevcob',
  rivers: 'hydrarca',
  places: 'geonamea',
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
  const shapeType = b.readInt32LE(32)
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

  return { shapeType, features }
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
      for (let c = i; c < 4; c += 1) {
        m[r][c] -= factor * m[i][c]
      }
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
  if (geom.type === 'Point') {
    return { ...geom, coordinates: project(geom.coordinates) }
  }
  if (geom.type === 'LineString') {
    return { ...geom, coordinates: geom.coordinates.map(project) }
  }
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

function writeGeoJson(fileName, featureCollection) {
  fs.mkdirSync(OUT_DIR, { recursive: true })
  fs.writeFileSync(path.join(OUT_DIR, fileName), JSON.stringify(featureCollection))
}

function build() {
  const placesDbf = readDbf(path.join(RAW_DIR, `${FILES.places}.dbf`))
  const placesShp = readShp(path.join(RAW_DIR, `${FILES.places}.shp`))

  const calibration = []
  for (let i = 0; i < Math.min(placesDbf.length, placesShp.features.length); i += 1) {
    const row = placesDbf[i]
    const shpPt = placesShp.features[i]?.coordinates
    if (!shpPt) continue
    if (!Number.isFinite(row.LONDD) || !Number.isFinite(row.LATDD)) continue
    calibration.push({
      source: shpPt,
      target: [row.LONDD, row.LATDD],
    })
  }

  if (calibration.length < 10) {
    throw new Error('Not enough calibration points to compute coordinate transform')
  }

  const project = fitAffine(
    calibration.map((c) => c.source),
    calibration.map((c) => c.target),
  )

  const countyDbf = readDbf(path.join(RAW_DIR, `${FILES.county}.dbf`))
  const countyShp = readShp(path.join(RAW_DIR, `${FILES.county}.shp`))
  const countyFeatures = countyShp.features.map((geom, i) => ({
    type: 'Feature',
    properties: countyDbf[i] ?? {},
    geometry: transformGeometry(geom, project),
  }))

  const riverDbf = readDbf(path.join(RAW_DIR, `${FILES.rivers}.dbf`))
  const riverShp = readShp(path.join(RAW_DIR, `${FILES.rivers}.shp`))
  const riverFeatures = riverShp.features.map((geom, i) => ({
    type: 'Feature',
    properties: riverDbf[i] ?? {},
    geometry: transformGeometry(geom, project),
  }))

  const placeFeatures = placesShp.features.map((geom, i) => ({
    type: 'Feature',
    properties: placesDbf[i] ?? {},
    geometry: {
      type: 'Point',
      coordinates: [placesDbf[i]?.LONDD ?? project(geom.coordinates)[0], placesDbf[i]?.LATDD ?? project(geom.coordinates)[1]],
    },
  }))

  writeGeoJson('county.geojson', { type: 'FeatureCollection', features: countyFeatures })
  writeGeoJson('hydrology.geojson', { type: 'FeatureCollection', features: riverFeatures })
  writeGeoJson('places.geojson', { type: 'FeatureCollection', features: placeFeatures })
}

build()
