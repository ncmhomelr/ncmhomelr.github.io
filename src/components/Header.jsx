function SearchIcon() {
  return (
    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
      <i className="fa-solid fa-magnifying-glass text-xs" />
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
    <header className="sticky top-0 z-30 bg-cream-100/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Fila principal: Logo · Búsqueda · Acciones */}
        <div className="h-14 sm:h-16 flex items-center justify-between gap-3 sm:gap-5">

          {/* Logo */}
          <div className="shrink-0">
            <img
              src="/assets/Logo+dibujo.png"
              alt="NCM Home"
              className="h-9 sm:h-10 w-auto object-contain"
            />
          </div>

          {/* Buscador Desktop/Tablet (md+) */}
          <div className="hidden md:flex flex-1 max-w-md items-center gap-2.5">
            <div className="relative flex-1">
              <SearchIcon />
              <input
                id="search-desktop"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar productos…"
                className="field-base pl-9 pr-4 py-2"
              />
              {searchQuery.length > 0 && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
                  aria-label="Limpiar búsqueda"
                >
                  <i className="fa-solid fa-xmark text-xs" />
                </button>
              )}
            </div>

            <select
              id="category-filter-desktop"
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="field-base w-auto py-2 pr-8 cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">

            {/* Modo oscuro / claro */}
            <button
              id="toggle-darkmode"
              onClick={onToggleDarkMode}
              className="btn-icon"
              title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              aria-label="Cambiar modo de color"
            >
              <i className={`fa-solid text-base ${darkMode ? 'fa-sun text-amber-400' : 'fa-moon'}`} />
            </button>

            {/* Carrito */}
            <button
              id="open-cart"
              onClick={onOpenCart}
              className="relative btn-primary py-2 px-3 sm:px-4"
              aria-label="Abrir carrito"
            >
              <i className="fa-solid fa-bag-shopping text-sm" />
              <span className="hidden sm:inline text-sm">Carrito</span>
              {totalCartItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-sienna-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] px-0.5 rounded-full flex items-center justify-center border-2 border-cream-100 dark:border-stone-900">
                  {totalCartItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Fila móvil: Búsqueda + Categorías */}
        <div className="md:hidden pb-3 pt-1 space-y-2 border-t border-stone-200/60 dark:border-stone-700/40 mt-0.5">
          <div className="relative w-full">
            <SearchIcon />
            <input
              id="search-mobile"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar productos…"
              className="field-base pl-9 pr-8 py-2"
            />
            {searchQuery.length > 0 && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
                aria-label="Limpiar búsqueda"
              >
                <i className="fa-solid fa-xmark text-xs" />
              </button>
            )}
          </div>

          {/* Chips de categoría horizontales */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 -mx-4 px-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`shrink-0 px-3.5 py-1.5 rounded-sm text-xs font-medium transition-colors duration-150 ${selectedCategory === cat
                    ? 'bg-stone-800 text-stone-50'
                    : 'bg-stone-100 dark:bg-stone-800/60 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
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

