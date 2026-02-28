<div align="center">

```
 ██████╗ ██████╗ ███████╗███████╗███╗   ██╗
██╔════╝ ██╔══██╗██╔════╝██╔════╝████╗  ██║
██║  ███╗██████╔╝█████╗  █████╗  ██╔██╗ ██║
██║   ██║██╔══██╗██╔══╝  ██╔══╝  ██║╚██╗██║
╚██████╔╝██║  ██║███████╗███████╗██║ ╚████║
 ╚═════╝ ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═══╝
         A L E R T
```

**Plataforma web de monitoreo ambiental ciudadano**

</div>

---

## 🌿 ¿Qué es GreenAlert?

**GreenAlert** es una plataforma web de monitoreo ambiental ciudadano que permite a la comunidad **reportar, visualizar y dar seguimiento** a problemáticas ambientales en su territorio.

Facilita la participación colectiva mediante geolocalización, evidencia multimedia y un sistema de gestión para la **validación y atención de los reportes**.

---

## 🗺️ Características principales

| Funcionalidad | Descripción |
|---|---|
| 📍 **Geolocalización** | Ubica y mapea problemáticas ambientales con precisión geográfica |
| 📷 **Evidencia multimedia** | Adjunta fotos, videos o documentos a cada reporte |
| 👥 **Participación colectiva** | La comunidad puede reportar, apoyar y comentar incidencias |
| ✅ **Validación de reportes** | Sistema de gestión para verificar y dar seguimiento a cada caso |
| 📊 **Visualización** | Mapa interactivo e indicadores del estado ambiental del territorio |

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
