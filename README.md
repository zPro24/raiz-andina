# 🌿 Raíz Andina - Plataforma Web Institucional

Plataforma web para el proyecto **Raíz Andina**, desarrollada con una arquitectura desacoplada (*Frontend/Backend*) diseñada para despliegue de costo cero, alta escalabilidad y rendimiento optimizado.

---

## 🛠️ Arquitectura y Tecnologías

El proyecto implementa una arquitectura cliente-servidor con autenticación basada en tokens (JWT) y almacenamiento persistente en la nube.

### **Frontend**
* **HTML5 / CSS3 / JavaScript (Vanilla)**: Arquitectura multi-página sin frameworks pesados para maximizar la velocidad de carga.
* **Diseño**: Tailwind CSS (CDN) + sistema de diseño propio con dark mode nativo, glassmorphism, animaciones GPU a 60 FPS y efectos neón.
* **Alojamiento**: [Vercel](https://vercel.com/) (Vercel Edge Network).

### **Backend**
* **Node.js & Express**: API RESTful para el procesamiento de solicitudes HTTP.
* **Seguridad & Auth**:
  * `bcryptjs`: Encriptación salteada de contraseñas de usuario.
  * `jsonwebtoken (JWT)`: Emisión de tokens de sesión para autenticación stateless.
  * `cors`: Configuración de políticas de origen cruzado para comunicación segura entre Vercel y Render.
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
│   │   └── db.js               # Configuración de conexión PostgreSQL (pool SSL)
│   ├── controllers/
│   │   └── authController.js   # Lógica de registro y login de usuarios
│   ├── routes/
│   │   └── authRoutes.js       # Definición de endpoints de autenticación
│   ├── .env                    # Variables de entorno (no versionado)
│   ├── .env.example            # Plantilla de variables de entorno
│   ├── .gitignore              # Exclusiones de git para el backend
│   ├── package.json            # Dependencias y scripts de Node.js
│   └── server.js               # Punto de entrada de la API Express
└── frontend/
    ├── assets/
    │   └── img/                # Imágenes y recursos estáticos
    ├── css/
    │   └── style.css           # Sistema de diseño completo (dark mode, glassmorphism, animaciones GPU)
    ├── js/
    │   ├── auth.js             # Intercepción de formularios y peticiones a la API de autenticación
    │   ├── main.js             # Animaciones, partículas canvas, scroll reveal y filtros de productos
    │   └── panel.js            # Lógica del dashboard de usuario (perfil, pedidos, favoritos)
    ├── index.html              # Página principal (hero, productos destacados, impacto)
    ├── nosotros.html           # Página "Sobre Nosotros" (historia, valores, equipo)
    ├── productos.html          # Catálogo de productos con filtros interactivos
    ├── contacto.html           # Formulario de contacto
    ├── login.html              # Página de autenticación (login / registro)
    └── panel.html              # Dashboard privado del usuario autenticado
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

* **Álvaro Martínez**
* **Jesús Gómez**