import { useState } from 'react'
import { formatCurrency } from '../lib/format'

const PLACEHOLDER = 'https://placehold.co/400x480/EAE4DC/A89078?text=Producto'
const PLACEHOLDER_ERROR = 'https://placehold.co/400x480/EAE4DC/A89078?text=Sin+imagen'

function StockBadge({ stock }) {
  if (stock === 0) {
    return (
      <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-2 py-0.5">
        Agotado
      </span>
    )
  }
  if (stock > 0 && stock <= 5) {
    return (
      <span className="text-[10px] font-semibold uppercase tracking-wider text-sienna-600 dark:text-sienna-400 bg-cream-200 dark:bg-stone-800 px-2 py-0.5">
        Últimas {stock}
      </span>
    )
  }
  return null
}

export default function ProductCard({ product, quantityInCart, onAdd }) {
  const primarySrc = '/assets/' + product.imagen_url || PLACEHOLDER
  const [failedSrc, setFailedSrc] = useState(null)
  const src = failedSrc === primarySrc ? PLACEHOLDER_ERROR : primarySrc

  const outOfStock = product.stock === 0
  const atLimit = quantityInCart >= product.stock
  const canAdd = product.stock > 0 && !atLimit

  return (
    <article className="group flex flex-col bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 transition-all duration-200">
      {/* Imagen del producto */}
      <div className="relative overflow-hidden bg-cream-200 dark:bg-stone-800 aspect-[4/5]">
        <img
          src={src}
          alt={product.nombre}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          loading="lazy"
          onError={() => setFailedSrc(primarySrc)}
        />

        {/* Badge de stock — esquina superior izquierda */}
        <div className="absolute top-2.5 left-2.5">
          <StockBadge stock={product.stock} />
        </div>

        {/* Indicador de cantidad en carrito */}
        {quantityInCart > 0 && (
          <div className="absolute top-2.5 right-2.5 bg-stone-900/90 dark:bg-stone-100/90 text-stone-50 dark:text-stone-900 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {quantityInCart}
          </div>
        )}
      </div>

      {/* Información del producto */}
      <div className="p-3.5 sm:p-4 flex flex-col gap-3 flex-1">
        <div>
          <p className="badge-category mb-1">{product.categoria}</p>
          <h3
            className="text-sm sm:text-[0.9375rem] font-medium text-stone-800 dark:text-stone-100 leading-snug line-clamp-1"
            title={product.nombre}
          >
            {product.nombre}
          </h3>
          {product.descripcion && (
            <p
              className="text-stone-500 dark:text-stone-400 text-xs mt-1 leading-relaxed line-clamp-2"
              title={product.descripcion}
            >
              {product.descripcion}
            </p>
          )}
        </div>

        {/* Precio + Acción */}
        <div className="flex items-center justify-between gap-2 mt-auto pt-2 border-t border-stone-100 dark:border-stone-800">
          <span className="text-base sm:text-lg font-semibold text-stone-900 dark:text-stone-50 tracking-tight">
            {formatCurrency(product.precio)}
          </span>

          <button
            id={`add-to-cart-${product.id}`}
            onClick={() => onAdd(product)}
            disabled={outOfStock || atLimit}
            aria-label={
              outOfStock ? 'Producto agotado' :
              atLimit ? 'Límite de stock alcanzado' :
              `Agregar ${product.nombre} al carrito`
            }
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
              canAdd
                ? 'btn-primary px-3 py-1.5 text-xs'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-400 dark:text-stone-600 cursor-not-allowed'
            }`}
          >
            <i className="fa-solid fa-plus text-[10px]" />
            <span className="hidden xs:inline">
              {outOfStock ? 'Agotado' : atLimit ? 'Límite' : 'Agregar'}
            </span>
          </button>
        </div>
      </div>
    </article>
  )
}

