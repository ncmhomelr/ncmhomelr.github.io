import { useState } from 'react'
import { formatCurrency } from '../lib/format'

const PLACEHOLDER = 'https://placehold.co/400x300/e2e8f0/475569?text=Producto'
const PLACEHOLDER_ERROR = 'https://placehold.co/400x300/e2e8f0/475569?text=Sin+Imagen'

function StockBadge({ stock }) {
  if (stock === 0) {
    return (
      <span className="bg-red-500 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded shadow">
        Agotado
      </span>
    )
  }
  if (stock > 0 && stock <= 5) {
    return (
      <span className="bg-amber-500 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded shadow">
        ¡Pocas! ({stock})
      </span>
    )
  }
  return null
}

export default function ProductCard({ product, quantityInCart, onAdd }) {
  // Si la imagen falla al cargar, se muestra el placeholder "Sin Imagen"
  const primarySrc = "../../assets/" + product.imagen_url || PLACEHOLDER
  const [failedSrc, setFailedSrc] = useState(null)
  const src = failedSrc === primarySrc ? PLACEHOLDER_ERROR : primarySrc

  const outOfStock = product.stock === 0
  const atLimit = quantityInCart >= product.stock
  const canAdd = product.stock > 0 && !atLimit

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group">
      {/* Imagen de Producto / Placeholder */}
      <div className="relative h-40 sm:h-48 bg-gray-100 dark:bg-gray-700/60 flex items-center justify-center overflow-hidden">
        <img
          src={src}
          alt={product.nombre}
          className="w-full h-full object-contain group-hover:scale-95 transition-transform duration-300"
          loading="lazy"
          onError={() => setFailedSrc(primarySrc)}
        />

        {/* Badges de Stock */}
        <div className="absolute top-2 right-2">
          <StockBadge stock={product.stock} />
        </div>
      </div>

      {/* Información del Producto */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[10px] sm:text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            {product.categoria}
          </span>
          <h3
            className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100 mt-1 line-clamp-1"
            title={product.nombre}
          >
            {product.nombre}
          </h3>
          <p
            className="text-gray-500 dark:text-gray-400 text-xs mt-1 line-clamp-2"
            title={product.descripcion}
          >
            {product.descripcion}
          </p>
        </div>

        <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-gray-100 dark:border-gray-700/80 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 block leading-tight">
              Precio
            </span>
            <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
              {formatCurrency(product.precio)}
            </span>
          </div>

          <button
            onClick={() => onAdd(product)}
            disabled={outOfStock || atLimit}
            className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition-all flex items-center gap-1.5 ${canAdd
              ? 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white shadow-sm'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              }`}
          >
            <i className="fa-solid fa-plus text-xs"></i>
            <span className="hidden xs:inline">
              {outOfStock ? 'Agotado' : atLimit ? 'Límite' : 'Agregar'}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
