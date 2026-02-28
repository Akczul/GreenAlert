# GreenAlert

Plataforma de monitoreo ambiental ciudadano.

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

## Configuracion inicial

### 1. Copiar variables de entorno

```bash
cp .env.example .env
```

### 2. Crear la base de datos en MySQL

```sql
CREATE DATABASE `green-alert`;
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Iniciar en desarrollo

```bash
npm run dev
```

---

## Rutas disponibles

| Metodo | Ruta      | Descripcion                  |
|--------|-----------|------------------------------|
| GET    | /health   | Estado del servidor y la BD  |

---

## Scripts

| Comando       | Descripcion                             |
|---------------|-----------------------------------------|
| npm run dev   | Inicia con nodemon (recarga automatica) |
| npm start     | Inicia en produccion                    |


holaaaaa
