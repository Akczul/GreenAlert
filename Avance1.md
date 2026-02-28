# Avance 1 — GreenAlert


## ¿De qué trata el proyecto?

GreenAlert es una plataforma de monitoreo ambiental ciudadano. La idea es que las personas puedan reportar y consultar alertas sobre problemas ambientales en su comunidad, como contaminación, incendios, derrames, etc. En este primer avance me enfoqué en dejar lista la base técnica del backend para que el equipo pueda trabajar sobre ella sin problemas.

---

## ¿Qué hice en este avance?

### 1. Organización del proyecto

Lo primero que hice fue separar el proyecto en dos grandes carpetas:

- `backend/` — aquí vive toda la lógica del servidor y la base de datos.
- `frontend/` — por ahora está vacía, pero ya está reservada para cuando empecemos con la interfaz.

Esto lo hice porque mezclar todo en una sola carpeta se vuelve un desorden muy rápido cuando el proyecto crece.

### 2. Stack tecnológico elegido

Para el backend decidí usar:

| Tecnología | Para qué sirve |
|---|---|
| Node.js | entorno de ejecución de JavaScript en el servidor |
| Express | framework para crear la API |
| MySQL | base de datos relacional |
| mysql2 | librería para conectar Node con MySQL |
| dotenv | manejar variables de entorno (contraseñas, puertos, etc.) |
| JWT | autenticación con tokens |
| nodemon | reiniciar el servidor automáticamente al guardar cambios |

Usé **ES Modules** (`type: "module"` en el `package.json`) en lugar de CommonJS porque es el estándar moderno de JavaScript y quería acostumbrarme a escribirlo bien desde el inicio.

### 3. Arquitectura MVC

Organicé el código siguiendo el patrón **MVC (Modelo - Vista - Controlador)**. En el contexto de una API REST no hay "vistas" como tal, pero la separación sigue siendo útil:

```
backend/
└── src/
    ├── config/       → conexión a la base de datos
    ├── controllers/  → lógica de cada endpoint
    ├── middlewares/  → funciones que se ejecutan antes de los controladores
    ├── models/       → consultas a la base de datos (por implementar)
    ├── routes/       → definición de las rutas de la API
    ├── services/     → lógica de negocio reutilizable (por implementar)
    ├── utils/        → funciones de ayuda generales
    ├── app.js        → configuración de Express
    └── server.js     → punto de entrada, levanta el servidor
```

La razón de esta estructura es que si mañana necesito agregar un módulo de usuarios, sé exactamente dónde va cada archivo sin tener que buscar.

### 4. Conexión a MySQL con pool de conexiones

En `src/config/database.js` configuré la conexión a la base de datos usando un **pool de conexiones**. Un pool es básicamente un conjunto de conexiones abiertas que se reutilizan, en lugar de abrir y cerrar una conexión nueva en cada petición. Esto es más eficiente y evita sobrecargar el servidor de base de datos.

También agregué una función `testConnection()` que se ejecuta al iniciar el servidor. Si la base de datos no está disponible, el proceso se detiene con un mensaje de error claro en lugar de fallar silenciosamente después.

### 5. Variables de entorno

Toda información sensible (contraseñas, puertos, secretos) la guardé en un archivo `.env` que **no se sube al repositorio**. Para que otros miembros del equipo sepan qué variables necesitan configurar, creé un archivo `.env.example` con los nombres de las variables pero sin los valores reales.

Las variables que definí son:

```
PORT        → puerto donde corre el servidor
DB_HOST     → dirección del servidor de base de datos
DB_PORT     → puerto de MySQL
DB_USER     → usuario de MySQL
DB_PASSWORD → contraseña de MySQL
DB_NAME     → nombre de la base de datos
JWT_SECRET  → clave secreta para firmar los tokens de autenticación
```

### 6. Middleware de autenticación JWT

Creé un middleware `verifyToken` que revisa si la petición incluye un token JWT válido en el header `Authorization`. Si el token no existe o está vencido, responde con un error 401 o 403 antes de que la petición llegue al controlador. Esto se usará para proteger los endpoints que requieran que el usuario esté autenticado.

### 7. Manejo centralizado de errores

En lugar de manejar errores en cada controlador por separado, creé dos middlewares globales en `errorHandler.js`:

- **notFoundHandler** — responde con 404 cuando alguien llama a una ruta que no existe.
- **errorHandler** — captura cualquier error lanzado en la aplicación y responde con un JSON con el mensaje de error. En modo desarrollo también muestra el stack trace para facilitar la depuración.

### 8. Ruta de prueba `/health`

Agregué una ruta `GET /health` que sirve para verificar que el servidor y la base de datos están funcionando. Devuelve un JSON así:

```json
{
  "status": "ok",
  "message": "servidor funcionando correctamente",
  "database": "conectada",
  "timestamp": "2026-02-27T..."
}
```

Esta ruta es muy útil para hacer una prueba rápida después de levantar el servidor y confirmar que todo está bien.

---

## ¿Cómo se corre el proyecto?

1. Crear la base de datos en MySQL:
   ```sql
   CREATE DATABASE `green-alert`;
   ```

2. Copiar el archivo de variables de entorno:
   ```bash
   cp .env.example .env
   ```

3. Instalar dependencias:
   ```bash
   cd backend
   npm install
   ```

4. Levantar el servidor:
   ```bash
   npm run dev
   ```

5. Probar que funciona abriendo en el navegador o en Postman:
   ```
   GET http://localhost:3000/health
   ```

---

## ¿Qué falta para el siguiente avance?

- Diseñar e implementar las tablas de la base de datos (usuarios, reportes, alertas).
- Crear el módulo de autenticación (registro e inicio de sesión con JWT).
- Crear el módulo de reportes ambientales.
- Empezar con el frontend.

---

## Reflexión

Este avance fue principalmente de configuración y arquitectura, que es la parte menos visible pero la más importante. Si la base está mal organizada, todo lo que se construya encima va a ser un problema. Aprendí bastante sobre cómo estructurar un proyecto Node.js de forma profesional, el manejo de variables de entorno y por qué los pools de conexiones son importantes en aplicaciones que pueden tener muchos usuarios simultáneos.
