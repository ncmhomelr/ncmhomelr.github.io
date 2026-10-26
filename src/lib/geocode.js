import { MAP_CONFIG } from './config'

// Búsqueda de direcciones con Nominatim (OpenStreetMap), cumpliendo su política de uso:
//  - solo se consulta al pulsar un botón (nada de autocompletado mientras se escribe)
//  - máximo 1 consulta por segundo
//  - las respuestas se guardan en caché
//  - se muestra la atribución de OpenStreetMap en el mapa
const MIN_INTERVAL_MS = 1100
const cache = new Map()
let lastRequestAt = 0

export class GeocodeError extends Error {
  constructor(message) {
    super(message)
    this.name = 'GeocodeError'
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/** Devuelve { lat, lng, label } o null si no se encontró la dirección. */
export async function geocodeAddress(query, { fetchFn = fetch } = {}) {
  const key = query.trim().toLowerCase().replace(/\s+/g, ' ')
  if (!key) return null
  if (cache.has(key)) return cache.get(key)

  const wait = lastRequestAt + MIN_INTERVAL_MS - Date.now()
  if (wait > 0) await sleep(wait)
  lastRequestAt = Date.now()

  const url = new URL(MAP_CONFIG.geocoderUrl)
  url.search = new URLSearchParams({ q: key, format: 'jsonv2', limit: '1', 'accept-language': 'es' }).toString()

  let res
  try {
    res = await fetchFn(url.toString(), { headers: { Accept: 'application/json' } })
  } catch {
    throw new GeocodeError('No se pudo conectar con el buscador de direcciones.')
  }
  if (!res.ok) throw new GeocodeError('El buscador de direcciones no está disponible ahora.')

  const results = await res.json().catch(() => [])
  const first = Array.isArray(results) ? results[0] : null
  const lat = Number(first?.lat)
  const lng = Number(first?.lon)

  const found = Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng, label: first.display_name ?? '' } : null
  cache.set(key, found)
  return found
}

// Solo para tests
export function _resetGeocodeCache() {
  cache.clear()
  lastRequestAt = 0
}
