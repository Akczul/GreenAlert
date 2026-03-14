# GreenAlert — Frontend

Aplicación web para el reporte ciudadano de problemas ambientales en Colombia. Construida con React + Vite.

---

## Tecnologías

| Librería | Versión | Uso |
|---|---|---|
| React | 18.3.1 | UI |
| Vite | 5.3.1 | Bundler / dev server |
| React Router DOM | 6.23.1 | Enrutamiento SPA |
| Axios | 1.7.2 | Llamadas HTTP al backend |
| Tailwind CSS | 3.4.4 | Estilos utilitarios |
| Lucide React | 0.577.0 | Iconografía SVG |
| Leaflet + react-leaflet | 1.9.4 / 4.2.1 | Mapas interactivos |

---

## Estructura

```
frontend/
├── public/
│   ├── favicon.ico
│   ├── chrome-192x192.png     # Ícono cuadrado (navbar, PWA)
│   └── chrome-512x512.png     # Logo completo (login, register)
└── src/
    ├── assets/                # Imágenes estáticas adicionales
    ├── components/
    │   ├── Layout.jsx          # Wrapper con Navbar
    │   ├── Navbar.jsx          # Navegación sticky con menú de usuario
    │   ├── LocationPicker.jsx  # Mapa Leaflet para seleccionar coordenadas
    │   ├── ReportsMap.jsx      # Mapa de visualización de reportes
    │   └── ProtectedRoute.jsx  # Redirección a /login si no hay sesión
    ├── context/
    │   └── AuthContext.jsx     # Estado global de autenticación (JWT)
    ├── pages/
    │   ├── Home.jsx            # Landing page
    │   ├── Login.jsx           # Inicio de sesión
    │   ├── Register.jsx        # Registro de usuario
    │   ├── Dashboard.jsx       # Panel principal con mapa y estadísticas
    │   ├── Reports.jsx         # Listado de reportes
    │   └── NewReport.jsx       # Formulario multistep para crear reporte
    ├── services/
    │   └── api.js              # Instancia Axios con interceptores JWT
    ├── App.jsx                 # Rutas y providers
    └── main.jsx                # Entry point
```

---

## Configuración y ejecución

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo (http://localhost:5173)
npm run dev

# Build de producción
npm run build
```

El backend debe estar corriendo en `http://localhost:3000`. El proxy de Vite redirige automáticamente todas las peticiones `/api/*`.

---

## Autenticación

- JWT almacenado en `localStorage` bajo las claves `ga_token` y `ga_user`.
- `AuthContext` expone: `user`, `loading`, `login`, `register`, `logout`.
- `ProtectedRoute` protege las rutas `/dashboard`, `/reports` y `/reports/new`.
- El interceptor de Axios adjunta el header `Authorization: Bearer <token>` en cada petición y limpia la sesión automáticamente ante un 401.

---

## Formulario de nuevo reporte

El formulario es multistep (4 pasos) y sus campos corresponden directamente a las columnas de la tabla `reportes` en la base de datos:

| Campo del form | Columna DB | Obligatorio |
|---|---|---|
| `tipo_contaminacion` | `tipo_contaminacion` | ✅ |
| `nivel_severidad` | `nivel_severidad` | ✅ |
| `titulo` | `titulo` | ✅ |
| `descripcion` | `descripcion` | ✅ |
| `direccion` | `direccion` | ✅ |
| `municipio` | `municipio` | ✅ |
| `departamento` | `departamento` | ✅ |
| `latitud` | `latitud` | Opcional |
| `longitud` | `longitud` | Opcional |
| `file` | evidencia (tabla `evidencias`) | Opcional |

Los campos generados por el backend (`ia_*`, `votos_relevancia`, `estado`, `uuid`, etc.) no se incluyen en el formulario.

---

## Registro de usuario

El formulario recoge los siguientes campos que mapean a la tabla `usuarios`:

| Campo | Columna DB | Obligatorio |
|---|---|---|
| `nombre` | `nombre` | ✅ |
| `apellido` | `apellido` | ✅ |
| `email` | `email` | ✅ |
| `password` | `password_hash` | ✅ |
| `telefono` | `telefono` | No |

El rol (`ciudadano` por defecto) es asignado por el backend.

---

## Variables de entorno

No se requieren variables de entorno adicionales en desarrollo. El proxy de Vite se configura en `vite.config.js`:

```js
proxy: {
  '/api': 'http://localhost:3000'
}
```
