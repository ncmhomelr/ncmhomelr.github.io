import { useCallback, useEffect, useState } from 'react'
import { STORAGE_KEYS, storage } from '../lib/storage'

export function useTheme() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = storage.get(STORAGE_KEYS.theme)
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  // Aplica la clase `dark` en <html> y persiste la preferencia
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    storage.set(STORAGE_KEYS.theme, darkMode ? 'dark' : 'light')
  }, [darkMode])

  const toggleDarkMode = useCallback(() => setDarkMode((d) => !d), [])

  return { darkMode, toggleDarkMode }
}
