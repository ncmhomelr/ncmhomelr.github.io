import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' -> los assets se enlazan con rutas relativas, por lo que el build
// funciona en GitHub Pages (usuario.github.io/nombre-repo/) sin configurar
// el nombre del repositorio. La app no usa router, así que no hay deep-links.
export default defineConfig({
  plugins: [react()],
  base: '/ncmhomelr/', // Nombre exacto del repositorio en GitHub entre barras
})
