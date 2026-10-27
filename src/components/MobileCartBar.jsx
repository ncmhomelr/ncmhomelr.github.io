import { formatCurrency } from '../lib/format'

// Barra inferior flotante (solo móvil)
export default function MobileCartBar({ totalCartItems, cartSubtotal, onOpenCart }) {
  return (
    <div className="sm:hidden fixed bottom-0 inset-x-0 bg-cream-100/97 dark:bg-stone-900/97 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 px-4 py-2.5 z-20 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative">
          <i className="fa-solid fa-bag-shopping text-stone-700 dark:text-stone-300 text-base" />
          {totalCartItems > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-stone-800 dark:bg-stone-200 text-stone-50 dark:text-stone-900 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {totalCartItems}
            </span>
          )}
        </div>
        <div>
          <span className="text-[10px] text-stone-400 dark:text-stone-500 block leading-tight uppercase tracking-wider">
            Total
          </span>
          <span className="text-sm font-semibold text-stone-800 dark:text-stone-100 tabular-nums">
            {formatCurrency(cartSubtotal)}
          </span>
        </div>
      </div>

      <button
        id="open-cart-mobile"
        onClick={onOpenCart}
        className="btn-primary py-2 px-4 text-xs"
        aria-label="Ver carrito"
      >
        <span>Ver carrito</span>
        <i className="fa-solid fa-arrow-right text-[10px]" />
      </button>
    </div>
  )
}
