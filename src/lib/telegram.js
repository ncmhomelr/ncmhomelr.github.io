
export async function enviarComprobante(archivoImagen, datosPedido) {
  const formData = new FormData();
  
  // Agregas los campos de texto
  formData.append("nombre", datosPedido.nombre);
  formData.append("monto", datosPedido.monto);
  formData.append("latitud", datosPedido.latitud);   // Ej: "-31.4201"
  formData.append("longitud", datosPedido.longitud); // Ej: "-64.1888"
  formData.append("id_pedido", datosPedido.idPedido);
  
  // Agregas el archivo (obtenido de un <input type="file">)
  formData.append("imagen", archivoImagen);

  try {
    const respuesta = await fetch("LA_URL_DE_TU_CLOUDFLARE_WORKER", {
      method: "POST",
      // IMPORTANTE: Cuando usas FormData, NO debes configurar el "Content-Type" manualmente.
      // El navegador lo configurará automáticamente a 'multipart/form-data' agregando el boundary necesario.
      body: formData
    });

    const resultado = await respuesta.json();
    if (resultado.success) {
      console.log("¡Enviado al bot con éxito!");
    } else {
      console.error("Error del worker:", resultado.error);
    }
  } catch (error) {
    console.error("Error de red:", error);
  }
}


/*// telegram.js  ← nuevo archivo, ponelo junto a orders.js
const TG_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN
const TG_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID

/**
 * Envía el comprobante a Telegram. No lanza error — si falla, el pedido
 * ya está registrado en Supabase y no vale la pena interrumpir al usuario.
 
export async function sendReceiptToTelegram({ receipt, pedidoId, customer }) {
    if (!receipt || !TG_TOKEN || !TG_CHAT_ID) return

    const caption =
        `🧾 Pedido #${pedidoId}\n` +
        `👤 ${customer.nombre}\n` +
        `📞 ${customer.telefono}\n` +
        `📍 ${customer.direccion}`

    const form = new FormData()
    form.set('chat_id', TG_CHAT_ID)
    form.set('caption', caption)
    form.set('photo', receipt)           // File object directo del input

    try {
        const res = await fetch(
            `https://api.telegram.org/bot${TG_TOKEN}/sendPhoto`,
            { method: 'POST', body: form }
        )
        if (!res.ok) console.warn('Telegram respondió con error:', await res.text())
    } catch (err) {
        console.warn('No se pudo enviar el comprobante a Telegram:', err)
    }
}*/