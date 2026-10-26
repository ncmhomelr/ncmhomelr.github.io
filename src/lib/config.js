// Configuración del comprobante y del mapa

// --- Comprobante de pago ---------------------------------------------------
export const RECEIPT_ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
// Máximo de la foto original que se puede elegir
export const RECEIPT_MAX_ORIGINAL_BYTES = 10 * 1024 * 1024 // 10 MB
// Máximo de lo que se envía al servidor (debe coincidir con MAX_IMAGE_BYTES
// en supabase/functions/procesar_pedido/validation.ts)
export const RECEIPT_MAX_UPLOAD_BYTES = 5 * 1024 * 1024 // 5 MB
// Antes de enviarla, la imagen se reduce a este lado máximo y se guarda como JPEG
export const RECEIPT_MAX_DIMENSION = 2000
export const RECEIPT_JPEG_QUALITY = 0.85

// --- Mapa ------------------------------------------------------------------
const env = import.meta.env
const num = (value, fallback) => {
  const n = Number(value)
  return value !== undefined && value !== '' && Number.isFinite(n) ? n : fallback
}

export const MAP_CONFIG = {
  // Vista inicial (toda Argentina). Cámbiala con VITE_MAP_LAT / VITE_MAP_LNG / VITE_MAP_ZOOM
  // para centrarla en tu zona de entrega, p. ej. zoom 12 sobre tu ciudad.
  center: [num(env.VITE_MAP_LAT, -34.6), num(env.VITE_MAP_LNG, -64)],
  zoom: num(env.VITE_MAP_ZOOM, 4),
  // Los servidores públicos de OpenStreetMap son para uso liviano. Si la tienda crece,
  // cambia a otro proveedor solo con variables de entorno (sin tocar el código).
  tileUrl: env.VITE_MAP_TILE_URL || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution:
    env.VITE_MAP_ATTRIBUTION ||
    '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
  geocoderUrl: env.VITE_GEOCODER_URL || 'https://nominatim.openstreetmap.org/search',
}

// Poner en true para exigir que el cliente marque su ubicación en el mapa
export const LOCATION_REQUIRED = false
