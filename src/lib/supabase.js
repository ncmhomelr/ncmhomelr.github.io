import { createClient } from '@supabase/supabase-js'

// Credenciales por defecto inyectadas en el build (ver .env.example y el
// workflow de GitHub Actions). Son opcionales: si no existen, la app arranca
// en Modo Simulación o con las credenciales guardadas desde el modal.
export const ENV_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
export const ENV_SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export function createSupabaseClient(url, key) {
  // La app no usa Supabase Auth: se desactiva la sesión para evitar escrituras
  // en localStorage y el aviso "Multiple GoTrueClient instances" al reconectar.
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })
}
