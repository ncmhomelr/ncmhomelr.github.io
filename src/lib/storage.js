// Wrapper seguro de localStorage (puede lanzar excepciones en modo privado
// o con el almacenamiento bloqueado).
export const STORAGE_KEYS = {
  theme: 'theme',
  cart: 'catalog_cart',
}

export const storage = {
  get(key) {
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value)
    } catch {
      /* ignorar */
    }
  },
  remove(key) {
    try {
      localStorage.removeItem(key)
    } catch {
      /* ignorar */
    }
  },
}
