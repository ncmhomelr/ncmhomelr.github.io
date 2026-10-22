function SearchIcon() {
  return (
    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
      <i className="fa-solid fa-magnifying-glass text-xs"></i>
    </span>
  )
}

export default function Header({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  darkMode,
  onToggleDarkMode,
  onOpenCart,
  totalCartItems,
}) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Fila superior: Logo, Estados y Acciones */}
        <div className="h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            <img
              src="../../assets/Logo.jpeg"
              alt="NCM Home"
              className="h-10 w-auto object-contain rounded-sm"
            />
          </div>

          {/* Buscador Desktop/Tablet (md+) */}
          <div className="hidden md:flex flex-1 max-w-xl items-center gap-2 mx-2">
            <div className="relative flex-1">
              <SearchIcon />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar productos por nombre o descripción..."
                className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-gray-50/50 dark:bg-gray-700/50 focus:bg-white dark:focus:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 transition-colors"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Botones de Acción: Tema Oscuro/Claro, Supabase y Carrito */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Botón de Alternar Modo Claro / Oscuro */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 sm:p-2.5 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              aria-label="Cambiar modo de color"
            >
              <i
                className={`fa-solid text-base sm:text-lg ${darkMode ? 'fa-sun text-amber-400' : 'fa-moon text-indigo-600'
                  }`}
              ></i>
            </button>

            {/* Botón Carrito Header */}
            <button
              onClick={onOpenCart}
              className="relative bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white px-3 sm:px-4 py-2 sm:py-2 rounded-lg font-medium transition-all flex items-center gap-2 shadow"
            >
              <i className="fa-solid fa-cart-shopping text-sm sm:text-base"></i>
              <span className="hidden sm:inline text-sm font-semibold">Carrito</span>
              {/* Badge de Conteo de Items */}
              {totalCartItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 bg-red-500 text-white text-[10px] sm:text-xs font-bold min-w-[20px] h-5 sm:min-w-[24px] sm:h-6 px-1 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800 shadow">
                  {totalCartItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Fila inferior móvil: Buscador y Filtro por Categorías en pantallas menores a MD */}
        <div className="md:hidden pb-3 pt-1 space-y-2 border-t border-gray-100 dark:border-gray-700/60 mt-1">
          <div className="relative w-full">
            <SearchIcon />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar productos..."
              className="w-full pl-9 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-gray-50/50 dark:bg-gray-700/60 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {searchQuery.length > 0 && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <i className="fa-solid fa-circle-xmark text-sm"></i>
              </button>
            )}
          </div>

          {/* Carrusel horizontal de chips de categorías en móvil */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 -mx-3 px-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs transition-colors ${selectedCategory === cat
                  ? 'bg-indigo-600 text-white font-medium shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
