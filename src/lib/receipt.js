import {
  RECEIPT_ACCEPTED_TYPES,
  RECEIPT_JPEG_QUALITY,
  RECEIPT_MAX_DIMENSION,
  RECEIPT_MAX_ORIGINAL_BYTES,
  RECEIPT_MAX_UPLOAD_BYTES,
} from './config'

/** Error con un mensaje listo para mostrarle al cliente. */
export class ReceiptError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ReceiptError'
  }
}

export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

/** Lee los primeros bytes de un archivo (FileReader funciona en todos los navegadores). */
function readHead(blob, length = 12) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(new Uint8Array(reader.result))
    reader.onerror = () => reject(new ReceiptError('No se pudo leer el archivo.'))
    reader.readAsArrayBuffer(blob.slice(0, length))
  })
}

/** Tipo REAL de imagen según su contenido (no según su nombre ni su Content-Type). */
export function sniffImageType(b) {
  if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'image/jpeg'
  if (b.length >= 8 && [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((v, i) => b[i] === v)) {
    return 'image/png'
  }
  if (
    b.length >= 12 &&
    [0x52, 0x49, 0x46, 0x46].every((v, i) => b[i] === v) &&
    [0x57, 0x45, 0x42, 0x50].every((v, i) => b[8 + i] === v)
  ) {
    return 'image/webp'
  }
  return null
}

/** Valida tipo y tamaño ANTES de procesar o enviar. Lanza ReceiptError si no es válido. */
export async function validateReceiptFile(file) {
  if (!file) throw new ReceiptError('No se seleccionó ningún archivo.')
  if (file.size === 0) throw new ReceiptError('El archivo está vacío.')

  if (file.size > RECEIPT_MAX_ORIGINAL_BYTES) {
    throw new ReceiptError(
      `La imagen pesa ${formatBytes(file.size)}. El máximo permitido es ${formatBytes(RECEIPT_MAX_ORIGINAL_BYTES)}.`
    )
  }

  // Tipo declarado por el navegador (puede venir vacío en algunos móviles)
  if (file.type && !RECEIPT_ACCEPTED_TYPES.includes(file.type)) {
    throw new ReceiptError('Formato no permitido. Usa una imagen JPG, PNG o WebP.')
  }

  // Tipo real según los primeros bytes: detecta archivos renombrados
  const type = sniffImageType(await readHead(file))
  if (!type) throw new ReceiptError('El archivo no parece ser una imagen JPG, PNG o WebP.')
  return type
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new ReceiptError('No se pudo abrir la imagen. Prueba con otra.'))
    }
    img.src = url
  })
}

/**
 * Reduce la imagen (lado máximo RECEIPT_MAX_DIMENSION) y la convierte a JPEG.
 * Beneficios: sube rápido con datos móviles y elimina los metadatos EXIF (por ejemplo,
 * la ubicación GPS de la foto). Devuelve null si el navegador no puede hacerlo.
 */
async function compressToJpeg(file) {
  const img = await loadImage(file)
  const { naturalWidth: w, naturalHeight: h } = img
  if (!w || !h) throw new ReceiptError('No se pudo abrir la imagen. Prueba con otra.')

  const scale = Math.min(1, RECEIPT_MAX_DIMENSION / Math.max(w, h))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(w * scale)
  canvas.height = Math.round(h * scale)

  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  // Fondo blanco: los PNG/WebP con transparencia quedarían negros en JPEG
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

  return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', RECEIPT_JPEG_QUALITY))
}

/**
 * Valida y prepara el comprobante para enviarlo. Devuelve un File listo para subir.
 * Lanza ReceiptError con un mensaje para el cliente si algo falla.
 */
export async function prepareReceipt(file) {
  await validateReceiptFile(file)

  let blob = null
  try {
    blob = await compressToJpeg(file)
  } catch (err) {
    if (err instanceof ReceiptError) throw err
  }

  if (blob) {
    if (blob.size > RECEIPT_MAX_UPLOAD_BYTES) {
      throw new ReceiptError('No se pudo reducir la imagen lo suficiente. Prueba con una captura de pantalla.')
    }
    return new File([blob], 'comprobante.jpg', { type: 'image/jpeg' })
  }

  // Sin soporte de canvas: se envía el original si cabe
  if (file.size > RECEIPT_MAX_UPLOAD_BYTES) {
    throw new ReceiptError(`La imagen pesa ${formatBytes(file.size)} y no se pudo reducir. Usa una más liviana.`)
  }
  return file
}
