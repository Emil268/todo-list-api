# Todo List Management API

Production-ready REST API for managing todos, categories, users, and activity
logs — built with **Node.js**, **Express.js**, and **MongoDB (Mongoose)**.

The project follows a clean **Controller → Service → Model** architecture,
includes **JWT authentication with Role-Based Access Control (RBAC)**,
**API Key protection** for machine-to-machine endpoints, **soft deletes**,
automatic **activity logging**, request **validation**, a global
**error-handling** layer, **Swagger/OpenAPI** documentation, a **database
seeder**, and a **Jest + Supertest** test suite.

---

## ✨ Features

- **Architecture**: Controller–Service–Model, fully modular folder structure.
- **Auth**: Register/Login with bcrypt password hashing, JWT access tokens.
- **RBAC**: `admin` and `user` roles enforced via `protect` + `restrictTo('admin')` middleware (see `/api/v1/users/*`).
- **API Key**: Separate machine-to-machine endpoints protected by `x-api-key`.
- **Todos**: Full CRUD, scoped to the logged-in user.
  - Pagination (`page`, `limit`)
  - Sorting (`field`, `order`)
  - Filtering (`category`, `status`)
  - Search (`search` — matches title/description)
- **Categories**: Full CRUD, scoped to the logged-in user.
- **Soft Delete**: Deletions set `archived: true` instead of removing documents.
- **Activity Log**: Automatic audit trail for todo create/update/delete actions.
- **Validation**: express-validator-based request validation middleware.
- **Error Handling**: Custom `AppError` class + global error middleware with
  precise HTTP status codes (`200`, `201`, `400`, `401`, `403`, `404`, `409`, `500`).
- **Security**: Helmet, CORS, rate limiting, Mongo sanitization, XSS clean, HPP.
- **Docs**: Swagger UI at `/api-docs`.
- **Testing**: Jest + Supertest with an in-memory MongoDB (no external DB needed).
- **Seeder**: Creates an admin, a regular user, 3 categories, and 3 todos per category.

---

## 🗂️ Project Structure

```
todo-list-api/
├── config/            # DB connection, environment variables, Swagger config
│   ├── db.js
│   ├── env.js
│   └── swagger.js
├── controllers/        # Request/response handlers (thin layer)
│   ├── auth.controller.js
│   ├── user.controller.js
│   ├── category.controller.js
│   ├── todo.controller.js
│   └── activityLog.controller.js
├── services/           # Business logic & Mongoose queries
│   ├── auth.service.js
│   ├── user.service.js
│   ├── category.service.js
│   ├── todo.service.js
│   └── activityLog.service.js
├── models/              # Mongoose schemas
│   ├── User.model.js
│   ├── Category.model.js
│   ├── Todo.model.js
│   └── ActivityLog.model.js
├── middlewares/         # Auth, RBAC, API key, logger, notFound, validation, error handler
│   ├── auth.middleware.js
│   ├── apiKey.middleware.js
│   ├── logger.middleware.js
│   ├── notFound.middleware.js
│   ├── validator.middleware.js
│   └── error.middleware.js
├── routes/              # Express routers (+ Swagger JSDoc annotations)
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── category.routes.js
│   ├── todo.routes.js
│   ├── activityLog.routes.js
│   ├── external.routes.js   # API-key protected, machine-to-machine
│   └── index.js
├── validations/         # express-validator rule chains
│   ├── auth.validation.js
│   ├── user.validation.js
│   ├── category.validation.js
│   └── todo.validation.js
├── utils/
│   ├── AppError.js
│   ├── catchAsync.js
│   ├── apiFeatures.js    # pagination / sorting / filtering / search helper
│   └── seed.js           # database seeder script
├── tests/
│   ├── setup.js          # in-memory MongoDB test harness
│   ├── auth.test.js
│   └── todo.test.js
├── app.js               # Express app (middlewares, routes, error handler)
├── server.js            # Entry point (DB connection + HTTP listener)
├── jest.config.js
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB](https://www.mongodb.com/) running locally or a connection URI
  (e.g. MongoDB Atlas)

### 2. Installation

```bash
# Clone / unzip the project, then install dependencies
cd todo-list-api
npm install
```

### 3. Configuration

Copy the example environment file and update the values:

```bash
cp .env.example .env
```

| Variable                | Description                                       | Example                                   |
|-------------------------|----------------------------------------------------|--------------------------------------------|
| `NODE_ENV`               | Environment mode                                   | `development` / `production` / `test`      |
| `PORT`                   | Port the server listens on                         | `5000`                                      |
| `API_PREFIX`             | Base path for all API routes                       | `/api/v1`                                   |
| `MONGO_URI`              | MongoDB connection string                          | `mongodb://127.0.0.1:27017/todo_list_db`   |
| `MONGO_URI_TEST`         | MongoDB URI used when `NODE_ENV=test`              | `mongodb://127.0.0.1:27017/todo_list_db_test` |
| `JWT_SECRET`             | Secret key used to sign JWT tokens                 | a long random string                        |
| `JWT_EXPIRES_IN`         | JWT expiry duration                                | `1d`                                        |
| `API_KEY`                | Static API key for machine-to-machine endpoints    | a long random string                        |
| `RATE_LIMIT_WINDOW_MS`   | Rate-limit window (ms)                             | `900000`                                    |
| `RATE_LIMIT_MAX`         | Max requests per window per IP                     | `100`                                       |
| `BCRYPT_SALT_ROUNDS`     | bcrypt hashing cost factor                         | `10`                                        |

### 4. Run the server

```bash
# Development (with auto-reload via nodemon)
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:5000/api/v1`, and interactive
Swagger docs at `http://localhost:5000/api-docs`.

### 5. Seed the database

```bash
npm run seed
```

This creates:
- Admin user → `admin@example.com` / `Admin@123`
- Regular user → `user@example.com` / `User@123`
- 3 categories (`Work`, `Personal`, `Study`)
- 3 todos per category (9 total), owned by the regular user

To clear the seeded data instead:

```bash
node utils/seed.js --clear
```

### 6. Run tests

```bash
npm test
```

Tests primarily use `mongodb-memory-server` (no external MongoDB required).
If the in-memory binary cannot be downloaded (e.g. offline / restricted
network), the test setup automatically falls back to connecting to the real
MongoDB instance defined by `MONGO_URI_TEST` in your `.env` — make sure that
instance is reachable in that case.

### 7. Manual testing with Postman

A ready-to-import Postman collection and environment are included in the
`postman/` folder:

- `postman/Todo-List-API.postman_collection.json`
- `postman/Todo-List-API.postman_environment.json`

Import both into Postman, select the **"Todo List API - Local"** environment,
then run requests top-to-bottom inside each folder (Auth → Users → Categories
→ Todos → Activity Logs → External). Tokens and IDs (`token`, `adminToken`,
`categoryId`, `todoId`, `userId`) are captured automatically into environment
variables via each request's test script, so you don't need to copy/paste
values manually between requests.

---

## 🔐 Authentication Flow

1. `POST /api/v1/auth/register` → create an account, receive a JWT.
2. `POST /api/v1/auth/login` → authenticate, receive a JWT.
3. Send the token on subsequent requests:
   ```
   Authorization: Bearer <token>
   ```
4. `GET /api/v1/auth/me` → fetch the currently authenticated user's profile.

### Role-Based Access Control

Users have a `role` of either `user` (default) or `admin`. The
`restrictTo('admin')` middleware can be applied to any route requiring
admin-only access (e.g. viewing all users' activity logs).

### API Key (Machine-to-Machine)

Routes under `/api/v1/external/*` skip JWT auth entirely and instead require:

```
x-api-key: <API_KEY>
```

Example:

```bash
curl -H "x-api-key: your_api_key_here" http://localhost:5000/api/v1/external/stats
```

---

## 📚 API Endpoints Overview

| Method | Endpoint                         | Auth        | Description                              |
|--------|-----------------------------------|-------------|--------------------------------------------|
| POST   | `/api/v1/auth/register`           | Public      | Register a new user                        |
| POST   | `/api/v1/auth/login`              | Public      | Login and receive JWT                      |
| GET    | `/api/v1/auth/me`                 | JWT         | Get current user profile                   |
| GET    | `/api/v1/users`                   | JWT (Admin) | List all users (RBAC demo)                 |
| GET    | `/api/v1/users/:id`               | JWT (Admin) | Get a user by ID                           |
| DELETE | `/api/v1/users/:id`               | JWT (Admin) | Soft-delete a user account                 |
| GET    | `/api/v1/categories`              | JWT         | List categories (paginated, searchable)    |
| POST   | `/api/v1/categories`              | JWT         | Create a category                          |
| GET    | `/api/v1/categories/:id`          | JWT         | Get a category by ID                       |
| PUT    | `/api/v1/categories/:id`          | JWT         | Update a category                          |
| DELETE | `/api/v1/categories/:id`          | JWT         | Soft-delete a category                     |
| GET    | `/api/v1/todos`                   | JWT         | List todos (pagination/sort/filter/search) |
| POST   | `/api/v1/todos`                   | JWT         | Create a todo                              |
| GET    | `/api/v1/todos/:id`               | JWT         | Get a todo by ID                           |
| PUT    | `/api/v1/todos/:id`               | JWT         | Update a todo                              |
| DELETE | `/api/v1/todos/:id`               | JWT         | Soft-delete a todo                         |
| GET    | `/api/v1/activity-logs`           | JWT         | List activity logs (own, or all if admin)  |
| GET    | `/api/v1/external/stats`          | API Key     | Aggregate stats (no JWT required)          |

Full request/response schemas are available in Swagger UI at `/api-docs`.

### Example: List todos with pagination, sorting, filtering, search

```
GET /api/v1/todos?page=1&limit=10&field=createdAt&order=desc&status=pending&category=<categoryId>&search=report
Authorization: Bearer <token>
```

Response:

```json
{
  "success": true,
  "message": "Todos fetched successfully.",
  "data": { "todos": [ /* ... */ ] },
  "meta": {
    "total": 5,
    "page": 1,
    "limit": 10,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

---

## ❗ Error Response Format

All errors follow a consistent JSON shape:

```json
{
  "success": false,
  "status": "fail",
  "message": "Todo not found.",
  "errors": []
}
```

| Status Code | Meaning                                              |
|-------------|--------------------------------------------------------|
| 200         | OK — request succeeded                                  |
| 201         | Created — resource created successfully                 |
| 400         | Bad Request — validation failed                         |
| 401         | Unauthorized — missing/invalid JWT or API key            |
| 403         | Forbidden — insufficient role/permissions                |
| 404         | Not Found — resource does not exist                      |
| 409         | Conflict — duplicate resource (e.g. email already used)  |
| 500         | Internal Server Error — unexpected/programming error     |

---

## 🧩 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose ODM
- **Auth**: jsonwebtoken, bcryptjs
- **Validation**: express-validator
- **Docs**: swagger-jsdoc, swagger-ui-express
- **Security**: helmet, cors, express-rate-limit, express-mongo-sanitize, xss-clean, hpp
- **Testing**: Jest, Supertest, mongodb-memory-server

---

## 📄 License

MIT
