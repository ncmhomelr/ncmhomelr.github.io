import { formatCurrency } from '../lib/format'

// Panel lateral del carrito (full-width en móvil, sidebar en desktop)
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
    <div className="fixed inset-0 z-40 overflow-hidden" role="dialog" aria-modal="true" aria-label="Carrito de compras">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-stone-900/40 dark:bg-black/60 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-full sm:max-w-sm bg-cream-100 dark:bg-stone-900 flex flex-col border-l border-stone-200 dark:border-stone-800 animate-slide-in-right">

          {/* Header del carrito */}
          <div className="px-5 py-4 flex items-center justify-between border-b border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-3">
              <h2 className="font-editorial text-base font-semibold text-stone-800 dark:text-stone-100">
                Tu carrito
              </h2>
              <span className="text-xs text-stone-500 dark:text-stone-400 tabular-nums">
                {totalCartItems} {totalCartItems === 1 ? 'ítem' : 'ítems'}
              </span>
            </div>
            <button
              id="close-cart"
              onClick={onClose}
              className="btn-icon"
              aria-label="Cerrar carrito"
            >
              <i className="fa-solid fa-xmark text-base" />
            </button>
          </div>

          {/* Lista de ítems */}
          <div className="flex-1 overflow-y-auto">
            {cart.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full py-16 px-6 text-center">
                <i className="fa-regular fa-bag-shopping text-4xl text-stone-300 dark:text-stone-700 mb-4" />
                <p className="text-stone-600 dark:text-stone-400 font-medium text-sm">Tu carrito está vacío</p>
                <p className="text-xs text-stone-400 dark:text-stone-600 mt-1">
                  Explorá el catálogo y agregá productos.
                </p>
                <button
                  id="explore-from-cart"
                  onClick={onClose}
                  className="btn-ghost mt-5 text-xs"
                >
                  Explorar productos
                </button>
              </div>
            )}

            <ul className="divide-y divide-stone-100 dark:divide-stone-800">
              {cart.map((item) => (
                <li key={item.id} className="px-5 py-4 flex items-start gap-3">
                  {/* Info del producto */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-stone-800 dark:text-stone-200 truncate">
                      {item.nombre}
                    </h4>
                    <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">
                      {formatCurrency(item.precio)} c/u
                    </p>
                  </div>

                  {/* Controles de cantidad */}
                  <div className="flex items-center border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 shrink-0">
                    <button
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="w-7 h-7 flex items-center justify-center text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors text-xs"
                      aria-label={`Reducir cantidad de ${item.nombre}`}
                    >
                      <i className="fa-solid fa-minus text-[10px]" />
                    </button>
                    <span className="px-2 text-xs font-semibold text-stone-800 dark:text-stone-200 min-w-[24px] text-center tabular-nums">
                      {item.cantidad}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      disabled={item.cantidad >= item.stock}
                      className={`w-7 h-7 flex items-center justify-center transition-colors text-xs ${
                        item.cantidad >= item.stock
                          ? 'text-stone-300 dark:text-stone-600 cursor-not-allowed'
                          : 'text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700'
                      }`}
                      aria-label={`Aumentar cantidad de ${item.nombre}`}
                    >
                      <i className="fa-solid fa-plus text-[10px]" />
                    </button>
                  </div>

                  {/* Subtotal + Eliminar */}
                  <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
                    <span className="text-xs font-semibold text-stone-800 dark:text-stone-200 tabular-nums">
                      {formatCurrency(item.precio * item.cantidad)}
                    </span>
                    <button
                      onClick={() => onRemove(item.id)}
                      className="text-stone-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
                      title={`Eliminar ${item.nombre}`}
                      aria-label={`Eliminar ${item.nombre} del carrito`}
                    >
                      <i className="fa-solid fa-trash-can text-xs" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer con resumen y checkout */}
          {cart.length > 0 && (
            <div className="px-5 py-4 border-t border-stone-200 dark:border-stone-800 space-y-3 bg-white dark:bg-stone-900/80">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-stone-500 dark:text-stone-400">Subtotal</span>
                <span className="text-xs text-stone-500 dark:text-stone-400 tabular-nums">{formatCurrency(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-stone-100 dark:border-stone-800">
                <span className="text-sm font-semibold text-stone-800 dark:text-stone-100">Total</span>
                <span className="text-base font-bold text-stone-900 dark:text-stone-50 tabular-nums">{formatCurrency(cartSubtotal)}</span>
              </div>

              <button
                id="proceed-to-checkout"
                onClick={onCheckout}
                className="btn-primary w-full py-3 justify-center"
              >
                <span>Realizar pedido</span>
                <i className="fa-solid fa-arrow-right text-xs" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

