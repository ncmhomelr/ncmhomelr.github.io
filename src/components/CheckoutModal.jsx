import { formatCurrency } from '../lib/format'

const INPUT_CLASSES =
  'w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none'

// Modal de checkout (scroll en el contenido, responsive)
export default function CheckoutModal({
  isOpen,
  onClose,
  customer,
  onCustomerChange,
  totalCartItems,
  cartSubtotal,
  isSubmitting,
  onSubmit,
}) {
  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit()
  }

  const handleChange = (field) => (e) => onCustomerChange({ ...customer, [field]: e.target.value })

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-3 sm:px-4 py-6">
        <div className="fixed inset-0 bg-black/50 dark:bg-black/75 transition-opacity" onClick={onClose}></div>

        <div className="relative bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full p-4 sm:p-6 shadow-2xl border border-gray-200 dark:border-gray-700 my-auto">
          <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-700 mb-4">
            <h3 className="font-bold text-base sm:text-lg text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <i className="fa-solid fa-clipboard-check text-indigo-600 dark:text-indigo-400"></i>
              <span>Finalizar Pedido</span>
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
            >
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Nombre Completo *
              </label>
              <input
                type="text"
                value={customer.nombre}
                onChange={handleChange('nombre')}
                required
                placeholder="Ej: Juan Pérez"
                className={INPUT_CLASSES}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Teléfono / WhatsApp *
              </label>
              <input
                type="tel"
                value={customer.telefono}
                onChange={handleChange('telefono')}
                required
                placeholder="Ej: +54 9 11 1234-5678"
                className={INPUT_CLASSES}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Dirección de Entrega *
              </label>
              <textarea
                value={customer.direccion}
                onChange={handleChange('direccion')}
                required
                rows={2}
                placeholder="Calle, número, piso/depto, ciudad..."
                className={INPUT_CLASSES}
              ></textarea>
            </div>

            {/* Resumen rápido de compra */}
            <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 p-3 rounded-lg text-xs space-y-1.5">
              <div className="font-bold text-indigo-900 dark:text-indigo-300 flex items-center justify-between">
                <span>Resumen de la orden:</span>
                <span className="text-[11px] font-normal text-indigo-700 dark:text-indigo-400">
                  {`${totalCartItems} productos seleccionados`}
                </span>
              </div>
              <div className="flex justify-between text-indigo-900 dark:text-indigo-200 font-bold text-sm pt-1.5 border-t border-indigo-200 dark:border-indigo-800">
                <span>Total a abonar:</span>
                <span>{formatCurrency(cartSubtotal)}</span>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition text-center"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg transition flex items-center justify-center gap-2 shadow"
              >
                {isSubmitting && <i className="fa-solid fa-spinner animate-spin"></i>}
                <span>{isSubmitting ? 'Enviando...' : 'Confirmar y Enviar Pedido'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
