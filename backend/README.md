# GreenAlert - Backend

API REST de GreenAlert, construida con Node.js + Express + MySQL.

## 📦 Versión Actual

**v2.0** - Incluye 4 nuevas categorías de riesgo ambiental

## Requisitos

- Node.js 18 o superior
- npm 9 o superior
- MySQL en ejecucion
- Base de datos creada (usar `DATABASE_COMPLETA.sql` en la raiz del proyecto)

## Variables de entorno

Crea un archivo `.env` dentro de `backend/` con este contenido:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_NAME=green-alert
JWT_SECRET=una_clave_secreta
```

## Instalacion y ejecucion

```bash
npm install
npm run dev
```

Servidor disponible en http://localhost:3000.

## Scripts

- `npm run dev`: inicia el servidor con nodemon
- `npm start`: inicia el servidor con node

## 🆕 Cambios Recientes (v2.0)

### 4 Nuevas Categorías de Riesgo Ambiental

Se agregaron 4 nuevas categorías para reportar problemas ambientales críticos:

| Categoría | Código | Severidad | Descripción |
|-----------|--------|-----------|-------------|
| 🌲 Deforestación | `deforestacion` | Alto | Tala o pérdida de cobertura forestal |
| 🔥 Incendios Forestales | `incendios_forestales` | Crítico | Fuegos descontrolados en bosques |
| ⚠️ Deslizamientos | `deslizamientos` | Alto | Movimientos en masa del terreno |
| 💧 Avalanchas Fluviotorrenciales | `avalanchas_fluviotorrenciales` | Crítico | Crecidas súbitas de ríos/quebradas |

### Archivos Nuevos

```
backend/
├── src/
│   ├── models/
│   │   └── categoria-riesgo.model.js    ← Consultas a BD de categorías
│   └── controllers/
│       └── categoria-riesgo.controller.js ← Lógica de categorías
├── routes/
│   └── categoria-riesgo.routes.js       ← Endpoints de categorías
└── docs/
    └── CONSTANTES_VALIDACION.js         ← Constantes para validaciones
```

### Integración Requerida

**Paso 1:** Agregar router en `backend/src/app.js`

```javascript
import categoriaRouter from '../routes/categoria-riesgo.routes.js';

// En la sección de rutas
app.use('/api/categorias', categoriaRouter);
```

### Base de Datos

Ejecutar el script `DATABASE_COMPLETA.sql` en tu cliente MySQL/HeidiSQL:
- Crea tablas: usuarios, reportes, evidencias, categorias_riesgo
- Inserta 11 categorías (7 existentes + 4 nuevas)
- Configura índices optimizados

## Endpoints principales

### Autenticación
- `POST /auth/register`: registro de usuario
- `POST /auth/login`: inicio de sesion

### Reportes
- `GET /reportes`: lista de reportes
- `GET /reportes/:id`: detalle de reporte
- `POST /reportes`: crear reporte (requiere token)
- `PATCH /reportes/:id`: actualizar reporte (requiere token)
- `DELETE /reportes/:id`: eliminar reporte logico (requiere token)

### 🆕 Categorías de Riesgo
- `GET /api/categorias`: obtener todas las categorías con estadísticas
- `GET /api/categorias/:codigo`: obtener detalle de una categoría (ej: `deforestacion`)
- `GET /api/categorias/:codigo/reportes`: listar reportes de una categoría con filtros opcionales
  - Parámetros: `estado`, `nivel_severidad`, `municipio`, `limit`, `offset`
- `GET /api/categorias/estadisticas/resumen`: estadísticas de reportes por categoría
- `GET /api/estadisticas/por-severidad`: estadísticas agrupadas por severidad

### Salud
- `GET /health`: estado del servidor y conexion a base de datos

## 📝 Crear un Reporte

Todos los tipos de contaminación ahora disponibles:

```javascript
POST /api/reportes
Content-Type: application/json
Authorization: Bearer {token}

{
  "tipo_contaminacion": "deforestacion",  // agua, aire, suelo, ruido, residuos, luminica, 
                                            // deforestacion, incendios_forestales, 
                                            // deslizamientos, avalanchas_fluviotorrenciales, otro
  "nivel_severidad": "alto",              // bajo, medio, alto, critico
  "titulo": "Tala masiva en sector X",
  "descripcion": "Descripción detallada del problema...",
  "direccion": "Dirección exacta",
  "municipio": "Mocoa",
  "latitud": 1.1506,
  "longitud": -76.6451
}
```

## 🛠️ Estructura de Capas

```
backend/
├── src/
│   ├── app.js                      Configuración de Express
│   ├── server.js                   Punto de entrada
│   ├── config/
│   │   └── database.js             Conexión MySQL
│   ├── models/                     Acceso a datos (BD)
│   │   ├── usuario.model.js
│   │   ├── reporte.model.js
│   │   ├── evidencia.model.js
│   │   └── categoria-riesgo.model.js
│   ├── controllers/                Lógica de negocio
│   │   ├── auth.controller.js
│   │   ├── health.controller.js
│   │   ├── reporte.controller.js
│   │   └── categoria-riesgo.controller.js
│   ├── services/                   Servicios especializados
│   └── utils/
│       └── response.js             Formato de respuestas
├── routes/                         Definición de rutas
│   ├── auth.routes.js
│   ├── health.routes.js
│   ├── reporte.routes.js
│   └── categoria-riesgo.routes.js
├── middlewares/                    Middleware personalizado
│   ├── auth.middleware.js
│   └── errorHandler.js
└── docs/
    └── CONSTANTES_VALIDACION.js    Constantes y validadores
```

## 📚 Documentación Disponible

- `GUIA_IMPLEMENTACION.md` - Guía completa de integración
- `INICIO_RAPIDO.md` - Pasos rápidos (5 minutos)
- `EJEMPLOS_REPORTES.json` - Ejemplos JSON de reportes
- `TAREA_GITHUB_FormularioReporte.md` - Tarea para el frontend
- `DATABASE_COMPLETA.sql` - Script completo de BD (compatible HeidiSQL)

## 🔍 Ejemplo de Uso

**Crear un reporte de deforestación:**

```bash
curl -X POST http://localhost:3000/api/reportes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGc..." \
  -d '{
    "tipo_contaminacion": "deforestacion",
    "nivel_severidad": "alto",
    "titulo": "Tala masiva de árboles en Mocoapamba",
    "descripcion": "Se observa pérdida forestal de 50 hectáreas...",
    "direccion": "Vereda Mocoapamba",
    "municipio": "Mocoa",
    "latitud": 1.1506,
    "longitud": -76.6451
  }'
```

**Obtener reportes de deforestación:**

```bash
curl http://localhost:3000/api/categorias/deforestacion/reportes?nivel_severidad=alto&limit=10
```

**Ver estadísticas:**

```bash
curl http://localhost:3000/api/categorias/estadisticas/resumen
```

## 🚀 Próximos Pasos

1. **Frontend:** Implementar formulario para crear reportes (ver `TAREA_GITHUB_FormularioReporte.md`)
2. **Testing:** Crear pruebas unitarias para los nuevos endpoints
3. **Validaciones:** Considerar validaciones adicionales por categoría
4. **Notificaciones:** Alertas en tiempo real para reportes críticos

## Estructura principal

```
backend/
  src/
    app.js                # Configuracion de Express y middlewares
    server.js             # Arranque del servidor
    config/
      database.js         # Pool de conexion MySQL
    controllers/          # Logica de endpoints
    models/               # Consultas a base de datos
    utils/
      response.js         # Respuestas estandar
  routes/                 # Definicion de rutas
  middlewares/            # Auth y manejo de errores
```

## Notas utiles

- Si falta `JWT_SECRET`, las rutas de autenticacion devolveran error 500 al generar token.
- Si la conexion a MySQL falla, el servidor se detiene al iniciar.
