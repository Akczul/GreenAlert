# GreenAlert

Plataforma de monitoreo ambiental ciudadano.

GreenAlert es una plataforma web de monitoreo ambiental ciudadano. Permite a los usuarios reportar problemas de contaminación en su comunidad — agua, aire, suelo, ruido, residuos, entre otros.

Cada reporte incluye:

- Tipo y severidad del problema
- Ubicación geográfica (para mostrarlos en un mapa)
- Evidencias adjuntas (fotos, videos, audio)
- Estado de seguimiento (pendiente → en revisión → resuelto)

La plataforma tiene tres tipos de usuarios: ciudadanos (crean reportes), moderadores (verifican y gestionan reportes) y administradores. También tiene soporte para procesamiento con IA para etiquetar y validar los reportes automáticamente.

Stack: React en el frontend, Node.js/Express en el backend, y MySQL como base de datos.

---

## Stack

| Capa          | Tecnologia              |
|---------------|-------------------------|
| Runtime       | Node.js (ES Modules)    |
| Framework     | Express                 |
| Base de datos | MySQL (mysql2/promise)  |
| Auth          | JWT                     |
| Variables     | dotenv                  |

---

## Estructura del proyecto

```
src/
├── config/
│   └── database.js          # Pool de conexiones MySQL
├── controllers/
│   └── health.controller.js
├── middlewares/
│   ├── auth.middleware.js
│   └── errorHandler.js
├── models/
├── routes/
│   └── health.routes.js
├── services/
├── utils/
│   └── response.js
├── app.js
└── server.js
```
---

## Avance No.3
Se crearon 3 archivos en models, uno por cada tabla de la base de datos. Cada archivo es simplemente un objeto con funciones que ejecutan queries SQL:

usuario.model.js — Maneja la tabla usuarios

- Buscar usuario por email (para el login)
- Buscar usuario por ID (para verificar sesión)
- Crear usuario (para el registro)
- Registrar la última vez que alguien inició sesión


reporte.model.js — Maneja la tabla reportes

- Listar reportes con filtros (por tipo, estado, severidad) y paginación
- Ver detalle de un reporte
- Crear un reporte (también guarda la ubicación en formato geográfico para el mapa)
- Editar un reporte
- Eliminar un reporte (soft-delete: no borra de la BD, solo marca deleted_at)


evidencia.model.js — Maneja la tabla evidencias

- Obtener todas las fotos/videos de un reporte
- Registrar una nueva evidencia (el archivo ya debe estar subido previamente)
- Eliminar una evidencia

La idea es que los controllers (que vienen después) usen estos modelos en lugar de escribir SQL directamente. Así el código queda ordenado y cada archivo tiene una sola responsabilidad.

---

## Flujo de registro (`POST /auth/register`)

Se implemento el endpoint de registro para conectar el formulario del frontend con el backend.

Ruta:

`POST /auth/register`

Body esperado:

```json
{
	"nombre": "Juan Diego",
	"email": "juan@example.com",
	"password": "miPassword123"
}
```

Validaciones en backend:

- `nombre` obligatorio, minimo 2 caracteres.
- `email` obligatorio y con formato valido.
- `password` obligatorio, minimo 8 caracteres.
- `email` unico (si ya existe, responde conflicto).

Proceso interno:

1. Valida los datos de entrada.
2. Verifica si ya existe el correo en `usuarios`.
3. Hashea la contrasena con `crypto.scrypt`.
4. Crea el usuario con rol `ciudadano`.
5. Genera JWT.
6. Devuelve respuesta estandar usando `successResponse` de `src/utils/response.js`.

Respuesta exitosa (201):

```json
{
	"status": "success",
	"message": "Cuenta creada correctamente.",
	"data": {
		"token": "<jwt>",
		"user": {
			"id_usuario": 1,
			"uuid": "...",
			"nombre": "Juan Diego",
			"apellido": "",
			"email": "juan@example.com",
			"rol": "ciudadano",
			"activo": 1,
			"email_verificado": 0,
			"avatar_url": null,
			"telefono": null,
			"created_at": "2026-03-13T..."
		}
	}
}
```

Errores comunes:

- `400`: datos invalidos.
- `409`: correo ya registrado.
- `500`: error interno o falta `JWT_SECRET` en entorno.
