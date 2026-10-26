// telegram.js  ← nuevo archivo, ponelo junto a orders.js
const TG_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN
const TG_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID

/**
 * Envía el comprobante a Telegram. No lanza error — si falla, el pedido
 * ya está registrado en Supabase y no vale la pena interrumpir al usuario.
 */
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
}