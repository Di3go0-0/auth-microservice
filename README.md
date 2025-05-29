**README.md**

---

## Microservicio de Autenticación (Fragmentación Vertical)

Este microservicio se encarga de registro, login, actualización y eliminación de usuarios, usando **fragmentación vertical** en tres bases de datos lógicas:

1. **users_emails_db**: almacena únicamente correos electrónicos.
2. **users_passwords_db**: almacena contraseñas hasheadas.
3. **users_links_db**: tabla `user_map` que enlaza `email_ref` ↔ `password_ref` formando la entidad completa de **usuario**.

---

### Arquitectura general

```
┌───────────────────────────┐
│      NestJS (AuthModule)  │
│ ┌────────┐ ┌──────────┐    │
│ │Emails  │ │Passwords │    │
│ │Service │ │Service   │    │
│ └────────┘ └──────────┘    │
│      └──────┐              │
│             ▼              │
│        LinksService        │
│             ▼              │
└───────────┬───────────────┘
            │
┌───────────┴───────────┐
│ 3 conexiones TypeORM  │
│ • emailsConn          │ → users_emails_db      │
│ • passwordsConn       │ → users_passwords_db   │
│ • linksConn           │ → users_links_db       │
└───────────────────────┘
```

Cada servicio (`EmailsService`, `PasswordsService`, `LinksService`) es responsable de su propia base de datos lógica. El `AuthService` orquesta operaciones compuestas con patrón SAGA (compensaciones en caso de error parcial).

---

## Instalación y puesta en marcha

1. **Clona el repositorio** y sitúate en la carpeta `api/`:

   ```bash
   git clone <repo-url>
   cd api
   ```

2. **Crea un archivo `.env`** junto a tu `docker-compose.yml`, por ejemplo:

3. **Docker Compose**
   Levanta Postgres y el microservicio:

   ```bash
   docker-compose up -d --build
   ```

   - **postgres** expone `5432:5432` y aplica init‐scripts (creación de bases y roles).
   - **auth-service** escucha en el puerto definido por `API_PORT`.

4. **Instala dependencias y arranca localmente** (opcional):

   ```bash
   npm ci
   npm run start:dev
   ```

5. **Swagger UI**
   Accede a `http://localhost:${API_PORT}/api/docs` para explorar la API.

---

## Dockerfile

```dockerfile
# Builder
FROM node:18-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Runner
FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /usr/src/app/dist ./dist
ENV NODE_ENV=production
EXPOSE ${API_PORT}
CMD ["node", "dist/main.js"]
```

---

## Estructura del código

```
src/
├── app.module.ts
├── main.ts
├── database/
│   ├── emails-db.module.ts
│   ├── passwords-db.module.ts
│   └── links-db.module.ts
├── emails/
│   ├── email.entity.ts
│   └── emails.service.ts
├── passwords/
│   ├── password.entity.ts
│   └── passwords.service.ts
├── links/
│   ├── user-map.entity.ts
│   └── links.service.ts
├── auth/
│   ├── auth.module.ts
│   ├── auth.service.ts
│   └── auth.controller.ts
└── dto/
    ├── register.dto.ts
    └── login.dto.ts
```

---

## Módulos y Conexiones

- **EmailsDbModule** → `TypeOrmModule.forRootAsync({ name: 'emailsConn', … })`
- **PasswordsDbModule** → `…({ name: 'passwordsConn', … })`
- **LinksDbModule** → `…({ name: 'linksConn', … })`

Cada uno importa la configuración desde `ConfigService` leyendo las variables de entorno (`EMAILS_DB_*`, etc.) y carga la entidad correspondiente.

---

## Patrón SAGA en `AuthService`

- **Registro** (`POST /auth/register`):

  1. Inserta email → guarda `email.id`
  2. Hashea y guarda contraseña → guarda `password.id`
  3. Crea `user_map` relacionando ambos IDs
  4. Si alguna operación falla, deshace las previas en orden inverso.

- **Login** (`POST /auth/login`):

  1. Busca email → obtiene `email.id`
  2. Busca `user_map` por `email_ref` → obtiene `password_ref`
  3. Carga contraseña hash → compara con la recibida
  4. Genera JWT si es válida.

- **Actualizar contraseña** y **Eliminar usuario** siguen lógica similar con compensaciones y borrado en cascada controlado.

---

## Endpoints

| Método | Ruta             | DTO / Parámetros                  | Descripción                  |
| ------ | ---------------- | --------------------------------- | ---------------------------- |
| POST   | `/auth/register` | `RegisterDto { email, password }` | Registra un nuevo usuario    |
| POST   | `/auth/login`    | `LoginDto { email, password }`    | Inicia sesión y devuelve JWT |
| PUT    | `/auth/password` | `{ email, newPassword }`          | Cambia la contraseña         |
| DELETE | `/auth/:id`      | `:id = user_map.id`               | Elimina usuario completo     |

---

## Scripts de inicialización de Postgres

- **00-repl-user.sql** (solo si usas réplica)

  ```sql
  CREATE ROLE repl_user WITH REPLICATION LOGIN PASSWORD 'repl_pass';
  ```

- **01-init.sql**

  ```sql
  CREATE DATABASE users_emails_db;
  CREATE DATABASE users_passwords_db;
  CREATE DATABASE users_links_db;

  CREATE ROLE auth_emails_user WITH LOGIN PASSWORD 'supersecret';
  CREATE ROLE auth_pass_user   WITH LOGIN PASSWORD 'anothersecret';
  CREATE ROLE auth_links_user  WITH LOGIN PASSWORD 'yetanothersecret';

  GRANT ALL PRIVILEGES ON DATABASE users_emails_db     TO auth_emails_user;
  GRANT ALL PRIVILEGES ON DATABASE users_passwords_db  TO auth_pass_user;
  GRANT ALL PRIVILEGES ON DATABASE users_links_db      TO auth_links_user;
  ```

---

## Notas

- **Modularidad**: cada fragmento de datos tiene su módulo y conexión.
- **Seguridad**: contraseñas hasheadas con bcrypt, JWT para sesión.
- **Consistencia**: patrón SAGA asegura no dejar datos huérfanos.

Con este microservicio tendrás un esquema de autenticación distribuido, escalable y resiliente.
