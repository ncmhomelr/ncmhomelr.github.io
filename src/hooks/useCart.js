import { useEffect, useMemo, useState } from 'react'
import { STORAGE_KEYS, storage } from '../lib/storage'

function loadSavedCart() {
  const saved = storage.get(STORAGE_KEYS.cart)
  if (!saved) return []
  try {
    const parsed = JSON.parse(saved)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function useCart(addToast) {
  const [cart, setCart] = useState(loadSavedCart)

  // Guardar el carrito localmente cada vez que cambie
  useEffect(() => {
    storage.set(STORAGE_KEYS.cart, JSON.stringify(cart))
  }, [cart])

  const totalCartItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.cantidad, 0),
    [cart]
  )

  const cartSubtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0),
    [cart]
  )

  const getCartQuantity = (productId) => {
    const item = cart.find((i) => i.id === productId)
    return item ? item.cantidad : 0
  }

  const addToCart = (product) => {
    const existing = cart.find((i) => i.id === product.id)
    if (existing) {
      if (existing.cantidad < product.stock) {
        setCart((prev) =>
          prev.map((i) => (i.id === product.id ? { ...i, cantidad: i.cantidad + 1 } : i))
        )
        addToast(`Se incrementó "${product.nombre}" en el carrito`, 'success')
      } else {
        addToast('Límite de stock alcanzado para este producto', 'error')
      }
    } else if (product.stock > 0) {
      setCart((prev) => [...prev, { ...product, cantidad: 1 }])
      addToast(`"${product.nombre}" añadido al carrito`, 'success')
    }
  }

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((i) => i.id !== productId))
    addToast('Producto eliminado del carrito', 'info')
  }

  const updateQuantity = (productId, delta) => {
    const item = cart.find((i) => i.id === productId)
    if (!item) return

    const newQty = item.cantidad + delta
    if (newQty <= 0) {
      removeFromCart(productId)
    } else if (newQty <= item.stock) {
      setCart((prev) => prev.map((i) => (i.id === productId ? { ...i, cantidad: newQty } : i)))
    } else {
      addToast('No hay suficiente stock disponible', 'error')
    }
  }

  const clearCart = () => setCart([])

  return {
    cart,
    totalCartItems,
    cartSubtotal,
    getCartQuantity,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  }
}
