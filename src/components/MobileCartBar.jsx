import { formatCurrency } from '../lib/format'

// Barra inferior flotante (solo móvil)
export default function MobileCartBar({ totalCartItems, cartSubtotal, onOpenCart }) {
  return (
    <div className="sm:hidden fixed bottom-0 inset-x-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 px-4 py-2.5 z-20 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-2">
        <div className="relative">
          <i className="fa-solid fa-cart-shopping text-indigo-600 dark:text-indigo-400 text-lg"></i>
          {totalCartItems > 0 && (
            <span className="absolute -top-2 -right-2.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {totalCartItems}
            </span>
          )}
        </div>
        <div>
          <span className="text-[11px] text-gray-500 dark:text-gray-400 block leading-tight">
            Total estimado
          </span>
          <span className="text-sm font-bold text-gray-900 dark:text-white">
            {formatCurrency(cartSubtotal)}
          </span>
        </div>
      </div>

      <button
        onClick={onOpenCart}
        className="bg-indigo-600 active:bg-indigo-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow"
      >
        <span>Ver Carrito</span>
        <i className="fa-solid fa-arrow-right text-[10px]"></i>
      </button>
    </div>
  )
}
