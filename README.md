# 🌿 Raíz Andina - Plataforma Web Institucional

Plataforma web para el proyecto **Raíz Andina**, desarrollada con una arquitectura desacoplada (*Frontend/Backend*) diseñada para despliegue de costo cero, alta escalabilidad y rendimiento optimizado.

---

## 🛠️ Arquitectura y Tecnologías

El proyecto implementa una arquitectura cliente-servidor con autenticación basada en tokens (JWT) y almacenamiento persistente en la nube.

### **Frontend**
* **HTML5 / CSS3 / JavaScript (Vanilla)**: Sin frameworks pesados para maximizar la velocidad de carga.
* **Navegación**: Enrutamiento basado en Hash (`window.location.hash`) para una experiencia SPA (*Single Page Application*).
* **Alojamiento**: [Netlify](https://www.netlify.com/).

### **Backend**
* **Node.js & Express**: API RESTful para el procesamiento de solicitudes HTTP.
* **Seguridad & Auth**:
  * `bcryptjs`: Encriptación salteada de contraseñas de usuario.
  * `jsonwebtoken (JWT)`: Emisión de tokens de sesión para autenticación stateless.
  * `cors`: Configuración de políticas de origen cruzado para comunicación segura entre Netlify y Render.
* **Alojamiento**: [Render](https://render.com/) (Web Service).

### **Base de Datos**
* **PostgreSQL (Neon.tech)**: Base de datos relacional Serverless alojada en la nube con soporte SSL activado.
* **Driver**: `pg` (node-postgres) con piscina de conexiones (*Connection Pool*).

---

## 📁 Estructura del Proyecto

```text
raiz-andina/
├── backend/
│   ├── config/
│   │   └── db.js            # Configuración de conexión PostgreSQL
│   ├── controllers/
│   │   └── authController.js# Lógica de registro y login de usuarios
│   ├── routes/
│   │   └── authRoutes.js    # Definición de endpoints de autenticación
│   ├── .env                 # Variables de entorno (puerto, BD, secrets)
│   ├── package.json         # Dependencias y scripts de Node.js
│   └── server.js            # Punto de entrada de la API Express
└── frontend/
    ├── css/                 # Estilos globales de la plataforma
    ├── js/
    │   ├── main.js          # Control de navegación y vistas
    │   └── auth.js          # Intercepción de formularios y peticiones a la API
    └── index.html           # Documento principal SPA
```

---

## 🗄️ Esquema de Base de Datos

Tabla de usuarios creada en PostgreSQL:

```sql
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔌 Endpoints de la API

Base URL (Producción): `https://backend-web-sz3a.onrender.com`

| Método | Endpoint | Descripción | Body (JSON) |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Comprobación de estado del servidor | N/A |
| `POST` | `/api/auth/register` | Registro de nuevos usuarios | `{ "nombre", "email", "password" }` |
| `POST` | `/api/auth/login` | Autenticación e inicio de sesión | `{ "email", "password" }` |

---

## 🚀 Configuración y Ejecución Local

### Prerrequisitos
* Node.js (v18+)
* Cuenta en Neon.tech o una instancia local de PostgreSQL

### 1. Clonar el repositorio
```bash
git clone https://github.com/zPro24/raiz-andina.git
cd raiz-andina
```

### 2. Configurar el Backend
```bash
cd backend
npm install
```

Crea un archivo `.env` dentro de la carpeta `backend/` con las siguientes variables:

```env
PORT=5000
DATABASE_URL=postgresql://usuario:password@host-neon.tech/neondb?sslmode=verify-full
JWT_SECRET=tu_clave_secreta_aqui
```

### 3. Iniciar el servidor en desarrollo
```bash
npm run dev
```
El servidor responderá en `http://localhost:5000`.

---

## 👥 Equipo de Desarrollo

* **Darwin Velásquez**
* **Álvaro Martínez**
* **Jesús Gómez**