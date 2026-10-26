import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ENV_SUPABASE_KEY,
  ENV_SUPABASE_URL,
  createSupabaseClient,
} from '../lib/supabase'
import { OrderError, submitOrder } from '../lib/orderApi'
import { sendReceiptToTelegram } from '../lib/telegram'

const DEFAULT_CATEGORIES = ['Todas', 'Difusores de Varillas', 'Spray textiles', 'Velas']

/**
 * Catálogo de productos + conexión con Supabase + procesamiento de pedidos.

 */
export function useCatalog(addToast) {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES)
  const [supabaseConnected, setSupabaseConnected] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const clientRef = useRef(null)
  const didInit = useRef(false)

  // ---- Productos y categorías ------------------------------------------
  const applyProducts = useCallback((list) => {
    setProducts(list)
    const dynamicCats = [...new Set(list.map((p) => p.categoria))].filter(Boolean)
    setCategories(['Todas', ...dynamicCats])
  }, [])


  // ---- Conexión con Supabase -------------------------------------------
  const connect = useCallback(
    async (url, key) => {
      if (!url || !key) return

      try {
        const client = createSupabaseClient(url, key)
        clientRef.current = client

        // Verificar la conexión intentando cargar los productos
        const { data, error } = await client.from('productos').select('*').order('id')
        if (error) throw error

        if (data && data.length > 0) {
          applyProducts(data)
        } else {
          throw error
        }

        setSupabaseConnected(true)

      } catch (err) {
        clientRef.current = null
        setSupabaseConnected(false)
      }
    },
    [addToast, applyProducts]
  )

  // Arranque (el ref evita la doble ejecución de React.StrictMode en desarrollo)
  useEffect(() => {
    if (didInit.current) return
    didInit.current = true

    if (ENV_SUPABASE_URL && ENV_SUPABASE_KEY) {
      connect(ENV_SUPABASE_URL, ENV_SUPABASE_KEY)
    } else {
      throw error
    }
  }, [connect])

  /**
   * Registra el pedido usando la función RPC procesar_pedido de Supabase.
   */
  const applyStockChanges = (newStocks) => {
    setProducts((prev) =>
      prev.map((p) => (newStocks.has(p.id) ? { ...p, stock: newStocks.get(p.id) } : p))
    )
  }
  // Descuenta localmente el stock de los productos comprados
  const decrementLocalStock = (cart) => {
    const newStocks = new Map()
    for (const item of cart) {
      const prod = products.find((p) => p.id === item.id)
      if (prod) newStocks.set(prod.id, Math.max(0, prod.stock - item.cantidad))
    }
    applyStockChanges(newStocks)
  }

  // Tras un pedido, el servidor ya descontó el stock: se vuelve a leer el catálogo real
  const refreshProducts = async (client, cart) => {
    try {
      const { data, error } = await client.from('productos').select('*').order('id')
      if (error) throw error
      if (data && data.length > 0) {
        applyProducts(data)
        return
      }
    } catch (err) {
      console.warn('No se pudo refrescar el catálogo, se descuenta el stock localmente:', err.message)
    }
    decrementLocalStock(cart)
  }

  const processOrder = async ({ cart, customer, location, receipt }) => {
    if (cart.length === 0) return false
    setIsSubmitting(true)

    try {
      const client = clientRef.current

      if (supabaseConnected && client) {
        const { pedidoId } = await submitOrder(client, { customer, items: cart, location })
        await sendReceiptToTelegram({ receipt, pedidoId, customer })
        await refreshProducts(client, cart)
        addToast(`¡Pedido registrado exitosamente!`, 'success')

      } else {
        throw error
      }

      return true
    } catch (err) {
      console.error('Error procesando el pedido:', err)
      addToast(
        err instanceof OrderError ? err.message : 'Error al procesar el pedido: ' + err.message,
        'error'
      )
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    products,
    categories,
    supabaseConnected,
    isSubmitting,
    processOrder,
  }
}
