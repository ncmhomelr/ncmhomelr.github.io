import ProductCard from './ProductCard'

export default function Catalog({ products, getCartQuantity, onAddToCart, onClearFilters }) {
  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

      {/* Encabezado editorial del catálogo */}
      <div className="mb-6 sm:mb-8">
        <h1 className="font-editorial text-2xl sm:text-3xl font-semibold text-stone-800 dark:text-stone-100 tracking-tight">
          Catálogo
        </h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
          {products.length > 0
            ? `${products.length} producto${products.length !== 1 ? 's' : ''} disponible${products.length !== 1 ? 's' : ''}`
            : 'No se encontraron productos'}
        </p>
      </div>

      {/* Grid de productos */}
      {products.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-stone-200 dark:bg-stone-800 border border-stone-200 dark:border-stone-800">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              quantityInCart={getCartQuantity(product.id)}
              onAdd={onAddToCart}
            />
          ))}
        </div>
      )}

      {/* Estado vacío */}
      {products.length === 0 && (
        <div className="text-center py-20 px-6">
          <i className="fa-regular fa-face-meh text-4xl text-stone-300 dark:text-stone-600 mb-4 block" />
          <p className="text-stone-700 dark:text-stone-300 font-medium text-base">
            No se encontraron productos
          </p>
          <p className="text-sm text-stone-400 dark:text-stone-500 mt-1.5">
            Probá con otros términos de búsqueda o cambiá el filtro de categoría.
          </p>
          <button
            id="clear-filters"
            onClick={onClearFilters}
            className="btn-ghost mt-5 text-sm"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </main>
  )
}

