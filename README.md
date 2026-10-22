# Catálogo de Productos & Sistema de Pedidos

Tienda con catálogo, carrito y checkout. Hecha con **React + Vite + Tailwind CSS**,
base de datos en **Supabase** y despliegue en **GitHub Pages**.

## Desarrollo local

Requiere Node.js 20.19 o superior (o 22+).

```bash
npm install
cp .env.example .env     # opcional: pon tus credenciales de Supabase
npm run dev
```

Otros comandos: `npm run build` (genera `dist/`) y `npm run preview`.


## Despliegue en GitHub Pages

1. Sube el proyecto a un repositorio de GitHub (rama `main`).
2. **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. **Settings → Secrets and variables → Actions → New repository secret**, y crea:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Haz push a `main`. El workflow [`deploy.yml`](.github/workflows/deploy.yml) compila y publica.
   La URL queda en `https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/`.

No hace falta configurar el nombre del repositorio: `vite.config.js` usa `base: './'`.

> La clave *anon/publishable* es pública por diseño: queda visible en el JavaScript del
> sitio. La protección real son las reglas RLS de `schema.sql`. **Nunca** uses la clave
> `service_role` en este proyecto.

## Estructura

```
src/
├── App.jsx                  Composición de la pantalla y estado de modales/filtros
├── main.jsx                 Punto de entrada
├── index.css                Tailwind
├── hooks/
│   ├── useCatalog.js        Productos, conexión a Supabase, guardado del pedido
│   ├── useCart.js           Carrito (persistido en localStorage)
│   ├── useTheme.js          Modo claro/oscuro
│   └── useToasts.js         Notificaciones
├── components/
│   ├── Header.jsx           Barra superior, buscador, categorías
│   ├── Catalog.jsx          Grilla + estado vacío
│   ├── ProductCard.jsx
│   ├── CartDrawer.jsx       Panel lateral del carrito
│   ├── CheckoutModal.jsx
│   ├── ConfigModal.jsx      Credenciales de Supabase
│   ├── MobileCartBar.jsx
│   └── ToastContainer.jsx
└── lib/
    ├── supabase.js          Creación del cliente
    ├── mockProducts.js      Datos del Modo Simulación
    ├── storage.js           localStorage con manejo de errores
    └── format.js            Formato de moneda
supabase/schema.sql          Tablas, datos de ejemplo y permisos
.github/workflows/deploy.yml Deploy automático
```
