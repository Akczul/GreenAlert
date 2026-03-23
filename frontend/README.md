# GreenAlert - Frontend

Cliente web de GreenAlert, construido con React + Vite.

## Requisitos

- Node.js 18 o superior
- npm 9 o superior
- Backend corriendo en http://localhost:3000

## Instalacion y ejecucion

```bash
npm install
npm run dev
```

La aplicacion queda disponible en http://localhost:5173.

## Scripts

- `npm run dev`: inicia entorno de desarrollo
- `npm run build`: genera build de produccion
- `npm run preview`: sirve la build localmente

## Conexion con el backend

- El frontend consume rutas bajo `/api/*`.
- Vite redirige esas rutas al backend (`http://localhost:3000`) y elimina el prefijo `/api`.
- Ejemplo: `/api/auth/login` se envia a `http://localhost:3000/auth/login`.

Configurado en `vite.config.js`.

## Estructura principal

```
frontend/
  src/
    components/   # Componentes reutilizables (formulario, mapa, toasts)
    constants/    # Enumeraciones y configuración de categorías
    context/      # Estado global (AuthContext, ToastContext)
    pages/        # Vistas por ruta
    services/     # Axios y llamadas HTTP
    App.jsx       # Rutas y providers principales
    main.jsx      # Punto de entrada
```

## Autenticacion

- Se usa JWT.
- El token y usuario se guardan en `localStorage` (`ga_token` y `ga_user`).
- `ProtectedRoute` protege vistas privadas.
- Axios agrega `Authorization: Bearer <token>` automaticamente.

## Notificaciones toast

- Sistema centralizado en `ToastContext` (proveedor global en `App.jsx`).
- Uso: `const { showToast } = useToast()` → `showToast(mensaje, tipo, duracion)`.
- Tipos disponibles: `success`, `error`, `warning`, `info`.
- Duración por defecto: 3000 ms. Se puede personalizar por llamada.
- Animaciones con `motion` (spring physics): deslizamiento desde la derecha y barra de progreso.
- Componente visual: `ToastContainer` (se monta en `App.jsx`, esquina inferior derecha).

## Flujo basico de uso

1. Registrar o iniciar sesion.
2. Crear reportes desde la vista de nuevo reporte.
3. Consultar reportes y detalle en mapa/listado.
