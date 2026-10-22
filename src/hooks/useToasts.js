import { useCallback, useRef, useState } from 'react'

const TOAST_DURATION_MS = 4000

export function useToasts() {
  const [toasts, setToasts] = useState([])
  const nextId = useRef(0)

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback(
    (message, type = 'info') => {
      const id = ++nextId.current
      setToasts((prev) => [...prev, { id, message, type }])
      setTimeout(() => removeToast(id), TOAST_DURATION_MS)
    },
    [removeToast]
  )

  return { toasts, addToast, removeToast }
}
