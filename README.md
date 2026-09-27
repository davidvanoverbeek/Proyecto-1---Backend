# Proyecto 1 - Backend
 
Proyecto de backend desarrollado con Node.js, Express y MongoDB Atlas, que implementa gestión de usuarios con roles, subida de imágenes a Cloudinary, y un sistema de productos favoritos.
 
## 📋 Objetivo
 
Aplicar los conocimientos adquiridos en los módulos de Node.js y Backend: montaje de servidor Express, modelado de datos con Mongoose, autenticación y autorización basada en roles, subida de ficheros a servicios externos (Cloudinary), y un seeder para poblar la base de datos.
 
## 🛠️ Tecnologías
 
- **Node.js** + **Express** — servidor y enrutamiento
- **MongoDB Atlas** + **Mongoose** — base de datos y modelado
- **JWT (jsonwebtoken)** — autenticación
- **bcrypt** — hasheo de contraseñas
- **Cloudinary** + **multer** + **multer-storage-cloudinary** — subida y gestión de imágenes
- **dotenv** — variables de entorno
## 📁 Estructura del proyecto
 
```
src/
├── api/
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   └── product.controller.js
│   ├── models/
│   │   ├── user.model.js
│   │   └── product.model.js
│   └── routes/
│       ├── auth.routes.js
│       ├── user.routes.js
│       └── product.routes.js
├── config/
│   ├── db.js
│   └── cloudinary.js
├── middlewares/
│   ├── auth.middleware.js
│   └── cloudinaryUpload.js
├── seeds/
│   └── products.seed.js
└── utils/
index.js
.env
```
 
## ⚙️ Instalación
 
```bash
npm install
```
 
Crea un archivo `.env` en la raíz con las siguientes variables:
 
```
MONGO_URI=tu_cadena_de_conexion_mongo_atlas
JWT_SECRET=una_cadena_secreta_larga_y_aleatoria
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```
 
## ▶️ Ejecución
 
```bash
node index.js
```
 
### Seeder
 
Para poblar la colección de productos con datos de ejemplo:
 
```bash
npm run seed
```
 
## 📦 Modelos de datos
 
### User
 
| Campo | Tipo | Descripción |
|---|---|---|
| `username` | String | Único, requerido |
| `email` | String | Único, requerido |
| `password` | String | Hasheado con bcrypt antes de guardar |
| `role` | String | `"user"` o `"admin"` (por defecto `"user"`) |
| `image` | Object | `{ url, public_id }` — imagen de perfil en Cloudinary |
| `favorites` | [ObjectId] | Referencias a `Product`, sin duplicados |
 
### Product
 
| Campo | Tipo | Descripción |
|---|---|---|
| `name` | String | Requerido |
| `description` | String | Requerido |
| `price` | Number | Requerido, mínimo 0 |
| `stock` | Number | Requerido, mínimo 0, por defecto 0 |
| `category` | String | Requerido |
| `image` | Object | `{ url, public_id }` (opcional) |
 
## 🔐 Autenticación y roles
 
- El registro (`POST /api/users`) crea siempre usuarios con rol `"user"`.
- El primer administrador se inserta manualmente en MongoDB Atlas.
- Solo un usuario con rol `"admin"` puede cambiar el rol de otro usuario.
- Un usuario con rol `"user"` no puede cambiar su propio rol ni el de otro usuario.
- La autenticación se realiza mediante JWT: al hacer login se genera un token que debe enviarse en el header `Authorization: Bearer <token>` en las rutas protegidas.
## 📚 Endpoints
 
### Auth
 
| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| POST | `/api/auth/login` | Inicia sesión y devuelve un token JWT | Público |
 
### Usuarios
 
| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| POST | `/api/users` | Crea un usuario (con imagen) | Público |
| GET | `/api/users` | Lista todos los usuarios | Autenticado |
| GET | `/api/users/:id` | Obtiene un usuario por id | Autenticado |
| PATCH | `/api/users/:id/role` | Cambia el rol de un usuario | Solo admin |
| DELETE | `/api/users/:id` | Elimina una cuenta (propia o cualquiera si es admin) | Autenticado |
| POST | `/api/users/favorites` | Añade un producto a favoritos (sin duplicados) | Autenticado |
| DELETE | `/api/users/favorites/:productId` | Elimina un producto de favoritos | Autenticado |
 
### Productos
 
| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| GET | `/api/products` | Lista todos los productos | Público |
| GET | `/api/products/:id` | Obtiene un producto por id | Público |
| POST | `/api/products` | Crea un producto | Solo admin |
| PATCH | `/api/products/:id` | Actualiza un producto | Solo admin |
| DELETE | `/api/products/:id` | Elimina un producto (y su imagen en Cloudinary) | Solo admin |
 
## 🖼️ Gestión de imágenes
 
Las imágenes se suben mediante un middleware basado en `multer` + `multer-storage-cloudinary`, que las envía directamente a Cloudinary sin pasar por disco. Se guarda tanto la `url` pública como el `public_id`, necesario para poder eliminar la imagen cuando se elimina el usuario o producto correspondiente.
 
## ✅ Requisitos cubiertos
 
- [x] Servidor Express + MongoDB Atlas
- [x] Mínimo 2 modelos (User y Product)
- [x] Array de datos relacionados en User (favorites → Product)
- [x] Creación de usuarios siempre con rol `"user"`
- [x] Gestión de roles restringida a admin
- [x] Restricción: un usuario no puede cambiar su rol ni el de otro
- [x] Eliminación de cuenta propia y por admin, con restricción para usuarios normales
- [x] Campo `image` con subida vía Cloudinary
- [x] Borrado de imagen en Cloudinary al eliminar la cuenta/producto
- [x] Sin duplicados en el array de favoritos (`$addToSet`)
- [x] Seeder de productos
- [x] Documentación en Markdown
## 📧 Entrega
 
Repositorio público enviado por correo a `antonio.rosales@thepower.education` con el asunto **"Proyecto 1 - Backend - David Antonio van Overbeek Crusells"**.