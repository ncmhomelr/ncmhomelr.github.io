import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { formatCurrency } from '../lib/format'
import ReceiptUploader from './ReceiptUploader'

// El mapa (Leaflet) se descarga solo cuando se abre el checkout
const LocationPicker = lazy(() => import('./LocationPicker'))

// Modal de checkout (scroll en el contenido, responsive)
export default function CheckoutModal({
  isOpen,
  onClose,
  customer,
  onCustomerChange,
  location,
  onLocationChange,
  receipt,
  onReceiptChange,
  totalCartItems,
  cartSubtotal,
  isSubmitting,
  onSubmit,
}) {
  const [receiptError, setReceiptError] = useState('')
  const [locationError, setLocationError] = useState('')
  const [receiptBusy, setReceiptBusy] = useState(false)
  const receiptRef = useRef(null)
  const locationRef = useRef(null)

  // El modal sigue montado al cerrarse: se limpian los errores para la próxima vez
  useEffect(() => {
    if (!isOpen) {
      setReceiptError('')
      setLocationError('')
    }
  }, [isOpen])

  if (!isOpen) return null

  // Mientras se envía el pedido no se puede cerrar (evita pedidos duplicados)
  const safeClose = () => {
    if (!isSubmitting) onClose()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isSubmitting || receiptBusy) return
    setReceiptError('')
    setLocationError('')
    onSubmit()
  }

  const handleChange = (field) => (e) => onCustomerChange({ ...customer, [field]: e.target.value })

  const handleReceiptChange = (file) => {
    if (file) setReceiptError('')
    onReceiptChange(file)
  }

  const handleLocationChange = (loc) => {
    if (loc) setLocationError('')
    onLocationChange(loc)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true" aria-label="Finalizar pedido">
      <div className="flex items-start justify-center min-h-screen px-4 py-8 sm:py-12">
        <div
          className="fixed inset-0 bg-stone-900/40 dark:bg-black/60 transition-opacity"
          onClick={safeClose}
          aria-hidden="true"
        />

        <div className="relative bg-white dark:bg-stone-900 w-full max-w-lg border border-stone-200 dark:border-stone-800 shadow-2xl my-auto animate-fade-in">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 dark:border-stone-800">
            <h2 className="font-editorial text-lg font-semibold text-stone-800 dark:text-stone-100">
              Finalizar pedido
            </h2>
            <button
              id="close-checkout"
              onClick={safeClose}
              disabled={isSubmitting}
              className="btn-icon disabled:opacity-40"
              aria-label="Cerrar"
            >
              <i className="fa-solid fa-xmark text-base" />
            </button>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

            {/* Datos del cliente */}
            <fieldset className="space-y-3.5">
              <legend className="text-xs font-semibold uppercase tracking-widest text-stone-400 dark:text-stone-500 pb-1">
                Datos del cliente
              </legend>

              <div>
                <label htmlFor="checkout-nombre" className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5">
                  Nombre completo <span className="text-rose-500" aria-hidden="true">*</span>
                </label>
                <input
                  id="checkout-nombre"
                  type="text"
                  value={customer.nombre}
                  onChange={handleChange('nombre')}
                  required
                  maxLength={120}
                  placeholder="Ej: Juan Pérez"
                  className="field-base"
                  autoComplete="name"
                />
              </div>

              <div>
                <label htmlFor="checkout-telefono" className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5">
                  Teléfono / WhatsApp <span className="text-rose-500" aria-hidden="true">*</span>
                </label>
                <input
                  id="checkout-telefono"
                  type="tel"
                  value={customer.telefono}
                  onChange={handleChange('telefono')}
                  required
                  maxLength={40}
                  placeholder="Ej: +54 9 11 1234-5678"
                  className="field-base"
                  autoComplete="tel"
                />
              </div>

              <div>
                <label htmlFor="checkout-direccion" className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5">
                  Dirección de entrega <span className="text-rose-500" aria-hidden="true">*</span>
                </label>
                <textarea
                  id="checkout-direccion"
                  value={customer.direccion}
                  onChange={handleChange('direccion')}
                  required
                  rows={2}
                  maxLength={300}
                  placeholder="Calle, número, piso/depto, ciudad…"
                  className="field-base resize-none"
                  autoComplete="street-address"
                />
              </div>
            </fieldset>

            {/* Mapa interactivo */}
            <div ref={locationRef}>
              <Suspense
                fallback={
                  <div className="h-56 sm:h-64 flex items-center justify-center border border-stone-200 dark:border-stone-700 text-sm text-stone-500 dark:text-stone-400 bg-stone-50 dark:bg-stone-800/60">
                    <i className="fa-solid fa-spinner animate-spin mr-2" />
                    Cargando mapa…
                  </div>
                }
              >
                <LocationPicker
                  value={location}
                  onChange={handleLocationChange}
                  addressQuery={customer.direccion}
                />
              </Suspense>
              {locationError && (
                <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1.5" role="alert">
                  <i className="fa-solid fa-circle-exclamation" />
                  {locationError}
                </p>
              )}
            </div>

            {/* Resumen de compra */}
            <div className="bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-widest text-stone-400 dark:text-stone-500">
                  Resumen
                </span>
                <span className="text-xs text-stone-500 dark:text-stone-400 tabular-nums">
                  {totalCartItems} {totalCartItems === 1 ? 'producto' : 'productos'}
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-stone-200 dark:border-stone-700">
                <span className="text-sm font-medium text-stone-700 dark:text-stone-300">Total a abonar</span>
                <span className="text-base font-bold text-stone-900 dark:text-stone-50 tabular-nums">
                  {formatCurrency(cartSubtotal)}
                </span>
              </div>
            </div>

            {/* Comprobante de transferencia */}
            <div ref={receiptRef}>
              <ReceiptUploader
                file={receipt}
                onChange={handleReceiptChange}
                onBusyChange={setReceiptBusy}
                error={receiptError}
                disabled={isSubmitting}
              />
            </div>

            {/* Acciones */}
            <div className="flex flex-col-reverse sm:flex-row gap-2.5 pt-1">
              <button
                id="cancel-checkout"
                type="button"
                onClick={safeClose}
                disabled={isSubmitting}
                className="btn-ghost w-full sm:w-auto flex-1 justify-center disabled:opacity-40"
              >
                Cancelar
              </button>
              <button
                id="submit-checkout"
                type="submit"
                disabled={isSubmitting || receiptBusy}
                className="btn-primary w-full sm:w-auto flex-1 justify-center py-3"
              >
                {isSubmitting && <i className="fa-solid fa-spinner animate-spin" />}
                <span>{isSubmitting ? 'Enviando…' : 'Confirmar pedido'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

