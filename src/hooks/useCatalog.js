import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ENV_SUPABASE_KEY,
  ENV_SUPABASE_URL,
  createSupabaseClient,
} from '../lib/supabase'

const DEFAULT_CATEGORIES = ['Todas', 'Electrónica', 'Accesorios', 'Hogar']

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
  const processOrder = async ({ cart, customer }) => {
    if (cart.length === 0) return false
    setIsSubmitting(true)

    try {
      const client = clientRef.current
      const newStocks = new Map()

      if (supabaseConnected && client) {
        // 1. Mapear únicamente producto_id y cantidad (el backend valida el resto)
        const itemsPayload = cart.map((item) => ({
          producto_id: item.id,
          cantidad: item.cantidad,
        }))

        // 2. Invocación atómica RPC
        const { data: orderId, error } = await client.rpc('procesar_pedido', {
          p_cliente_nombre: customer.nombre,
          p_cliente_telefono: customer.telefono,
          p_cliente_direccion: customer.direccion,
          p_items: itemsPayload,
        })

        if (error) throw error

        // 3. Actualizar estado local
        for (const item of cart) {
          const prod = products.find((p) => p.id === item.id)
          if (prod) newStocks.set(prod.id, Math.max(0, prod.stock - item.cantidad))
        }
        applyStockChanges(newStocks)

        addToast(`¡Pedido registrado exitosamente!`, 'success')
      } else {
        throw error
      }

      return true
    } catch (err) {
      console.error('Error procesando el pedido:', err)
      addToast('Error al procesar el pedido: ' + err.message, 'error')
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
