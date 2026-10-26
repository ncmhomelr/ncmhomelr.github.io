// Envío del pedido a la Edge Function `procesar_pedido` de Supabase

export const ORDER_FUNCTION = 'procesar_pedido'
const ORDER_TIMEOUT_MS = 90_000

/** Error con un mensaje listo para mostrarle al cliente. */
export class OrderError extends Error {
  constructor(message) {
    super(message)
    this.name = 'OrderError'
  }
}

export function buildOrderFormData({ customer, items, location, receipt }) {
  const form = new FormData()
  form.set('nombre', customer.nombre.trim())
  form.set('telefono', customer.telefono.trim())
  form.set('direccion', customer.direccion.trim())
  // Solo id y cantidad: el precio y el total los calcula el servidor con los datos de la base
  form.set('items', JSON.stringify(items.map((i) => ({ producto_id: i.id, cantidad: i.cantidad }))))
  if (location) {
    form.set('latitud', String(location.lat))
    form.set('longitud', String(location.lng))
  }

  return form
}

async function messageFromFunctionsError(error) {
  if (error?.name === 'FunctionsHttpError') {
    const status = error.context?.status
    try {
      const body = await error.context.json()
      const text = body?.error ?? body?.message
      if (typeof text === 'string' && text) return text
    } catch {
      /* cuerpo no JSON */
    }
    return `El servidor rechazó la solicitud (HTTP ${status ?? '?'}).`
  }

  if (error?.name === 'FunctionsRelayError') {
    return 'El servicio no está disponible en este momento. Intenta nuevamente en unos minutos.'
  }

  // FunctionsFetchError: sin conexión o tiempo agotado. El servidor pudo haber registrado
  // el pedido, así que no se afirma que falló.
  return (
    'No pudimos confirmar el pedido por un problema de conexión. Revisa tu conexión y, ' +
    'si el problema continúa, contáctanos antes de volver a enviarlo.'
  )
}

/**
 * Envía el pedido y el comprobante. Resuelve SOLO si el servidor confirma el pedido
 * con su número; en cualquier otro caso lanza OrderError.
 */
export async function submitOrder(client, payload) {
  const { data, error } = await client.functions.invoke(ORDER_FUNCTION, {
    body: buildOrderFormData(payload),
    timeout: ORDER_TIMEOUT_MS,
  })

  if (error) throw new OrderError(await messageFromFunctionsError(error))

  if (!data || data.ok !== true || !Number.isInteger(data.pedido_id)) {
    throw new OrderError('El servidor no confirmó el pedido. Intenta nuevamente en unos minutos.')
  }

  return { pedidoId: data.pedido_id, total: Number(data.total) || 0 }
}
