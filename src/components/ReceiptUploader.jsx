import { useEffect, useRef, useState } from 'react'
import { RECEIPT_ACCEPTED_TYPES, RECEIPT_MAX_ORIGINAL_BYTES } from '../lib/config'
import { ReceiptError, formatBytes, prepareReceipt } from '../lib/receipt'

const ACCEPT = RECEIPT_ACCEPTED_TYPES.join(',')

const BUTTON_CLASSES =
  'inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed'

/**
 * Selector del comprobante de transferencia.
 *  - "Tomar foto" abre la cámara del celular; "Elegir imagen" abre galería/archivos.
 *  - Valida tipo y tamaño al elegir, reduce la imagen y muestra una vista previa.
 *  - `file` es el archivo ya validado y listo para enviar.
 */
export default function ReceiptUploader({ file, onChange, onBusyChange, error, disabled }) {
  const cameraInput = useRef(null)
  const galleryInput = useRef(null)
  const [processing, setProcessing] = useState(false)
  const [localError, setLocalError] = useState('')
  const [previewUrl, setPreviewUrl] = useState(null)

  // Vista previa del comprobante elegido
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null)
      return undefined
    }
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const handleSelect = async (e) => {
    const selected = e.target.files?.[0]
    e.target.value = '' // permite volver a elegir el mismo archivo
    if (!selected) return

    setLocalError('')
    setProcessing(true)
    onBusyChange?.(true)
    try {
      onChange(await prepareReceipt(selected))
    } catch (err) {
      setLocalError(err instanceof ReceiptError ? err.message : 'No se pudo procesar la imagen. Prueba con otra.')
    } finally {
      setProcessing(false)
      onBusyChange?.(false)
    }
  }

  const clear = () => {
    setLocalError('')
    onChange(null)
  }

  const shownError = localError || error

  return (
    <div>
      <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5">
        Comprobante de transferencia <span className="text-stone-400">(opcional)</span>
      </label>

      <div
        className={`border border-dashed p-4 transition-colors ${
          shownError
            ? 'border-rose-400 dark:border-rose-500 bg-rose-50/50 dark:bg-rose-950/20'
            : 'border-stone-300 dark:border-stone-600 bg-stone-50/60 dark:bg-stone-800/30'
        }`}
      >
        {/* Inputs ocultos: uno abre la cámara, el otro la galería */}
        <input
          ref={cameraInput}
          type="file"
          accept={ACCEPT}
          capture="environment"
          className="hidden"
          aria-label="Tomar foto del comprobante"
          onChange={handleSelect}
        />
        <input
          ref={galleryInput}
          type="file"
          accept={ACCEPT}
          className="hidden"
          aria-label="Elegir imagen del comprobante"
          onChange={handleSelect}
        />

        {processing && (
          <div className="flex items-center justify-center gap-2 py-5 text-sm text-stone-500 dark:text-stone-400" role="status">
            <i className="fa-solid fa-spinner animate-spin text-stone-600 dark:text-stone-400" />
            <span>Procesando imagen…</span>
          </div>
        )}

        {!processing && file && (
          <div className="flex items-center gap-3">
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Vista previa del comprobante"
                className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-600 bg-white shrink-0"
              />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                <i className="fa-solid fa-circle-check text-stone-600 dark:text-stone-400" />
                <span>Comprobante listo</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {`${file.name} · ${formatBytes(file.size)}`}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => galleryInput.current?.click()}
                  disabled={disabled}
                  className={`${BUTTON_CLASSES} bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700`}
                >
                  <i className="fa-solid fa-arrows-rotate"></i>
                  <span>Cambiar</span>
                </button>
                <button
                  type="button"
                  onClick={clear}
                  disabled={disabled}
                  className={`${BUTTON_CLASSES} text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30`}
                >
                  <i className="fa-solid fa-trash"></i>
                  <span>Quitar</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {!processing && !file && (
          <div className="text-center">
            <i className="fa-solid fa-receipt text-3xl text-gray-300 dark:text-gray-500 mb-2"></i>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Adjunta una imagen del comprobante</p>
            <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {`JPG, PNG o WebP. Hasta ${formatBytes(RECEIPT_MAX_ORIGINAL_BYTES)}.`}
            </p>
            <div className="flex flex-col xs:flex-row items-stretch xs:items-center justify-center gap-2 mt-3">
              {/* La cámara solo tiene sentido en celulares y tablets */}
            <button
                type="button"
                onClick={() => cameraInput.current?.click()}
                disabled={disabled}
                className={`${BUTTON_CLASSES} md:hidden bg-stone-800 hover:bg-stone-900 text-stone-50`}
              >
                <i className="fa-solid fa-camera"></i>
                <span>Tomar foto</span>
              </button>
              <button
                type="button"
                onClick={() => galleryInput.current?.click()}
                disabled={disabled}
                className={`${BUTTON_CLASSES} bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 md:bg-stone-800 md:hover:bg-stone-900 md:text-stone-50 md:border-stone-800`}
              >
                <i className="fa-solid fa-image"></i>
                <span>Elegir imagen</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {shownError ? (
        <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 flex items-start gap-1.5" role="alert">
          <i className="fa-solid fa-circle-exclamation mt-0.5" aria-hidden="true" />
          <span>{shownError}</span>
        </p>
      ) : (
        <p className="mt-1.5 text-[11px] text-stone-400 dark:text-stone-500 flex items-start gap-1.5">
          <i className="fa-solid fa-lock mt-0.5" aria-hidden="true" />
          <span>El comprobante se enviará de forma segura para su procesamiento.</span>
        </p>
      )}
    </div>
  )
}
