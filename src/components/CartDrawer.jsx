import { formatCurrency } from '../lib/format'

// Panel lateral del carrito (100% de ancho en móvil, panel lateral en desktop)
export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  totalCartItems,
  cartSubtotal,
  onUpdateQuantity,
  onRemove,
  onCheckout,
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-40 overflow-hidden">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 dark:bg-black/75 transition-opacity" onClick={onClose}></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-full sm:max-w-md bg-white dark:bg-gray-800 shadow-2xl flex flex-col border-l border-gray-200 dark:border-gray-700">
          {/* Header del Carrito */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-900/50">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-cart-shopping text-indigo-600 dark:text-indigo-400 text-lg"></i>
              <h3 className="font-bold text-base sm:text-lg text-gray-800 dark:text-gray-100">
                Carrito de Compras
              </h3>
              <span className="text-xs bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-semibold px-2 py-0.5 rounded-full">
                {`${totalCartItems} ítems`}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-700"
            >
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
          </div>

          {/* Lista de Items en Carrito */}
          <div className="flex-1 overflow-y-auto p-4 divide-y divide-gray-100 dark:divide-gray-700">
            {cart.length === 0 && (
              <div className="text-center py-16 px-4">
                <i className="fa-solid fa-basket-shopping text-5xl text-gray-300 dark:text-gray-600 mb-4"></i>
                <p className="text-gray-600 dark:text-gray-300 font-medium">Tu carrito está vacío</p>
                <p className="text-xs text-gray-400 mt-1">
                  Explora el catálogo y agrega los productos que desees comprar.
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 px-4 py-2 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-sm font-semibold rounded-lg hover:bg-indigo-100 transition"
                >
                  Explorar Productos
                </button>
              </div>
            )}

            {cart.map((item) => (
              <div key={item.id} className="py-3.5 flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-800 dark:text-gray-200 text-sm truncate">
                    {item.nombre}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {`${formatCurrency(item.precio)} c/u`}
                  </p>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
                    {`Subtotal: ${formatCurrency(item.precio * item.cantidad)}`}
                  </p>
                </div>

                {/* Controles de Cantidad */}
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-700 shrink-0">
                  <button
                    onClick={() => onUpdateQuantity(item.id, -1)}
                    className="w-7 h-7 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 text-xs"
                  >
                    <i className="fa-solid fa-minus"></i>
                  </button>
                  <span className="px-2 text-xs font-semibold text-gray-800 dark:text-gray-200 min-w-[20px] text-center">
                    {item.cantidad}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, 1)}
                    disabled={item.cantidad >= item.stock}
                    className={`w-7 h-7 flex items-center justify-center text-xs ${item.cantidad >= item.stock
                        ? 'text-gray-300 dark:text-gray-500 cursor-not-allowed'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                  >
                    <i className="fa-solid fa-plus"></i>
                  </button>
                </div>

                {/* Eliminar Item */}
                <button
                  onClick={() => onRemove(item.id)}
                  className="text-red-400 hover:text-red-600 dark:hover:text-red-300 p-1.5 shrink-0"
                  title="Eliminar producto"
                >
                  <i className="fa-solid fa-trash text-sm"></i>
                </button>
              </div>
            ))}
          </div>

          {/* Resumen y Checkout Footer */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex flex-col gap-3">
              <div className="space-y-1 text-sm">
                <div className="flex justify-between text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                  <span>Subtotal</span>
                  <span>{formatCurrency(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 dark:text-white text-base pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span>Total</span>
                  <span>{formatCurrency(cartSubtotal)}</span>
                </div>
              </div>

              <button
                onClick={onCheckout}
                className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold py-3 rounded-lg transition text-center shadow text-sm sm:text-base flex items-center justify-center gap-2"
              >
                <span>Realizar pedido</span>
                <i className="fa-solid fa-arrow-right text-xs"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
