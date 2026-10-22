import ProductCard from './ProductCard'

export default function Catalog({ products, getCartQuantity, onAddToCart, onClearFilters }) {
  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* Encabezado de catálogo e información de filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2">
        <div>
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
            Catálogo de Productos
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Explora nuestros artículos disponibles y agrégalos al pedido
          </p>
        </div>

      </div>

      {/* Grid de productos (1 col móvil muy pequeño, 2 en móvil/tablet chica, 3 en tablet grande, 4 en desktop) */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            quantityInCart={getCartQuantity(product.id)}
            onAdd={onAddToCart}
          />
        ))}
      </div>

      {/* Estado vacío si no se encuentran productos */}
      {products.length === 0 && (
        <div className="text-center py-12 px-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 mt-4 shadow-sm">
          <i className="fa-solid fa-box-open text-4xl text-gray-300 dark:text-gray-600 mb-3"></i>
          <p className="text-gray-600 dark:text-gray-300 font-medium text-base sm:text-lg">
            No se encontraron productos coincidentes.
          </p>
          <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 mt-1">
            Prueba cambiando los términos de búsqueda o quitando los filtros de categoría.
          </p>
          <button
            onClick={onClearFilters}
            className="mt-4 px-4 py-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-lg font-semibold text-xs sm:text-sm hover:bg-indigo-100 transition"
          >
            Limpiar Filtros y Búsqueda
          </button>
        </div>
      )}
    </main>
  )
}
