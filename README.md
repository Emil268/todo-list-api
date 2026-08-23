# Todo List Management API

REST API production-ready untuk mengelola todo, kategori, pengguna, dan log
aktivitas — dibangun dengan **Node.js**, **Express.js**, dan **MongoDB (Mongoose)**.

Project ini mengikuti arsitektur **Controller → Service → Model** yang rapi,
dilengkapi **autentikasi JWT dengan Role-Based Access Control (RBAC)**,
**proteksi API Key** untuk endpoint machine-to-machine, **soft delete**,
**pencatatan log aktivitas** otomatis, **validasi** request, lapisan
**penanganan error** global, dokumentasi **Swagger/OpenAPI**, **seeder
database**, dan test suite **Jest + Supertest**.

---

## ✨ Fitur

- **Arsitektur**: Controller–Service–Model, struktur folder yang modular.
- **Auth**: Register/Login dengan hashing password bcrypt, JWT access token.
- **RBAC**: Role `admin` dan `user` diterapkan melalui middleware `protect` + `restrictTo('admin')` (lihat `/api/v1/users/*`).
- **API Key**: Endpoint machine-to-machine terpisah yang dilindungi `x-api-key`.
- **Todos**: CRUD lengkap, dibatasi hanya untuk user yang sedang login.
  - Pagination (`page`, `limit`)
  - Sorting (`field`, `order`)
  - Filtering (`category`, `status`)
  - Search (`search` — mencocokkan judul/deskripsi)
- **Categories**: CRUD lengkap, dibatasi hanya untuk user yang sedang login.
- **Soft Delete**: Penghapusan data mengatur `archived: true`, bukan menghapus dokumen secara permanen.
- **Activity Log**: Jejak audit otomatis untuk aksi create/update/delete pada todo.
- **Validasi**: Middleware validasi request berbasis express-validator.
- **Error Handling**: Custom class `AppError` + middleware error global dengan
  kode status HTTP yang presisi (`200`, `201`, `400`, `401`, `403`, `404`, `409`, `500`).
- **Keamanan**: Helmet, CORS, rate limiting, Mongo sanitization, XSS clean, HPP.
- **Dokumentasi**: Swagger UI di `/api-docs`.
- **Testing**: Jest + Supertest dengan MongoDB in-memory (tidak butuh database eksternal).
- **Seeder**: Membuat 1 admin, 1 user biasa, 3 kategori, dan 3 todo per kategori.

---

## 🗂️ Struktur Proyek

```
todo-list-api/
├── config/            # Koneksi DB, environment variable, konfigurasi Swagger
│   ├── db.js
│   ├── env.js
│   └── swagger.js
├── controllers/        # Handler request/response (lapisan tipis)
│   ├── auth.controller.js
│   ├── user.controller.js
│   ├── category.controller.js
│   ├── todo.controller.js
│   └── activityLog.controller.js
├── services/           # Logika bisnis & query Mongoose
│   ├── auth.service.js
│   ├── user.service.js
│   ├── category.service.js
│   ├── todo.service.js
│   └── activityLog.service.js
├── models/              # Skema Mongoose
│   ├── User.model.js
│   ├── Category.model.js
│   ├── Todo.model.js
│   └── ActivityLog.model.js
├── middlewares/         # Auth, RBAC, API key, logger, notFound, validasi, error handler
│   ├── auth.middleware.js
│   ├── apiKey.middleware.js
│   ├── logger.middleware.js
│   ├── notFound.middleware.js
│   ├── validator.middleware.js
│   └── error.middleware.js
├── routes/              # Router Express (+ anotasi Swagger JSDoc)
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── category.routes.js
│   ├── todo.routes.js
│   ├── activityLog.routes.js
│   ├── external.routes.js   # Dilindungi API-key, machine-to-machine
│   └── index.js
├── validations/         # Rule validasi express-validator
│   ├── auth.validation.js
│   ├── user.validation.js
│   ├── category.validation.js
│   └── todo.validation.js
├── utils/
│   ├── AppError.js
│   ├── catchAsync.js
│   ├── apiFeatures.js    # Helper pagination / sorting / filtering / search
│   └── seed.js           # Script seeder database
├── tests/
│   ├── setup.js          # Test harness MongoDB in-memory
│   ├── auth.test.js
│   └── todo.test.js
├── app.js               # App Express (middleware, routes, error handler)
├── server.js            # Entry point (koneksi DB + HTTP listener)
├── jest.config.js
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

---

## 🚀 Memulai

### 1. Prasyarat

- [Node.js](https://nodejs.org/) v18 atau lebih baru
- [MongoDB](https://www.mongodb.com/) yang berjalan lokal, atau connection URI
  (misalnya MongoDB Atlas)

### 2. Instalasi

```bash
# Clone / ekstrak project, lalu install dependencies
cd todo-list-api
npm install
```

### 3. Konfigurasi

Salin file environment contoh, lalu perbarui isinya:

```bash
cp .env.example .env
```

| Variabel                 | Keterangan                                          | Contoh                                        |
|---------------------------|------------------------------------------------------|------------------------------------------------|
| `NODE_ENV`                | Mode aplikasi                                        | `development` / `production` / `test`          |
| `PORT`                    | Port yang digunakan server                           | `5000`                                          |
| `API_PREFIX`               | Prefix dasar untuk seluruh endpoint API              | `/api/v1`                                       |
| `MONGO_URI`                 | Connection string MongoDB                            | `mongodb://127.0.0.1:27017/todo_list_db`       |
| `MONGO_URI_TEST`            | URI MongoDB yang dipakai saat `NODE_ENV=test`        | `mongodb://127.0.0.1:27017/todo_list_db_test`  |
| `JWT_SECRET`                | Kunci rahasia untuk menandatangani token JWT         | string acak yang panjang                        |
| `JWT_EXPIRES_IN`            | Masa berlaku token JWT                               | `1d`                                            |
| `API_KEY`                   | API key statis untuk endpoint machine-to-machine     | string acak yang panjang                        |
| `RATE_LIMIT_WINDOW_MS`      | Jendela waktu rate limit (ms)                        | `900000`                                        |
| `RATE_LIMIT_MAX`            | Maksimal request per jendela waktu per IP            | `100`                                           |
| `BCRYPT_SALT_ROUNDS`        | Cost factor hashing bcrypt                           | `10`                                            |

### 4. Jalankan server

```bash
# Development (dengan auto-reload lewat nodemon)
npm run dev

# Production
npm start
```

API akan tersedia di `http://localhost:5000/api/v1`, dan dokumentasi Swagger
interaktif di `http://localhost:5000/api-docs`.

### 5. Seed database

```bash
npm run seed
```

Perintah ini membuat:
- User admin → `admin@example.com` / `Admin@123`
- User biasa → `user@example.com` / `User@123`
- 3 kategori (`Work`, `Personal`, `Study`)
- 3 todo per kategori (9 total), dimiliki oleh user biasa

Untuk menghapus data hasil seeding:

```bash
node utils/seed.js --clear
```

### 6. Jalankan test

```bash
npm test
```

Test utamanya menggunakan `mongodb-memory-server` (tidak memerlukan MongoDB
eksternal). Jika binary in-memory tidak bisa diunduh (misalnya jaringan
offline/terbatas), setup test akan otomatis fallback dan connect ke instance
MongoDB asli yang didefinisikan lewat `MONGO_URI_TEST` di file `.env` kamu —
pastikan instance tersebut bisa diakses jika terjadi kondisi ini.

### 7. Pengujian manual dengan Postman

Collection dan environment Postman yang siap di-import sudah disertakan di
folder `postman/`:

- `postman/Todo-List-API.postman_collection.json`
- `postman/Todo-List-API.postman_environment.json`

Import keduanya ke Postman, pilih environment **"Todo List API - Local"**,
lalu jalankan request dari atas ke bawah di dalam tiap folder (Auth → Users →
Categories → Todos → Activity Logs → External). Token dan ID (`token`,
`adminToken`, `categoryId`, `todoId`, `userId`) akan otomatis tersimpan ke
environment variable lewat test script masing-masing request, jadi kamu tidak
perlu copy-paste nilai secara manual antar request.

---

## 🔐 Alur Autentikasi

1. `POST /api/v1/auth/register` → membuat akun, menerima JWT.
2. `POST /api/v1/auth/login` → autentikasi, menerima JWT.
3. Sertakan token pada request-request berikutnya:
   ```
   Authorization: Bearer <token>
   ```
4. `GET /api/v1/auth/me` → mengambil profil user yang sedang login.

### Role-Based Access Control

Setiap user memiliki `role` berupa `user` (default) atau `admin`. Middleware
`restrictTo('admin')` bisa diterapkan pada route mana pun yang memerlukan
akses khusus admin (misalnya melihat activity log seluruh user).

### API Key (Machine-to-Machine)

Route di bawah `/api/v1/external/*` sepenuhnya melewati autentikasi JWT dan
sebagai gantinya memerlukan:

```
x-api-key: <API_KEY>
```

Contoh:

```bash
curl -H "x-api-key: your_api_key_here" http://localhost:5000/api/v1/external/stats
```

---

## 📚 Ringkasan Endpoint API

| Method | Endpoint                         | Auth        | Keterangan                                   |
|--------|-----------------------------------|-------------|------------------------------------------------|
| POST   | `/api/v1/auth/register`           | Public      | Mendaftarkan user baru                          |
| POST   | `/api/v1/auth/login`              | Public      | Login dan menerima JWT                          |
| GET    | `/api/v1/auth/me`                 | JWT         | Mengambil profil user yang sedang login          |
| GET    | `/api/v1/users`                   | JWT (Admin) | Daftar seluruh user (demo RBAC)                 |
| GET    | `/api/v1/users/:id`               | JWT (Admin) | Mengambil user berdasarkan ID                   |
| DELETE | `/api/v1/users/:id`               | JWT (Admin) | Soft-delete akun user                           |
| GET    | `/api/v1/categories`              | JWT         | Daftar kategori (pagination, bisa dicari)       |
| POST   | `/api/v1/categories`              | JWT         | Membuat kategori baru                           |
| GET    | `/api/v1/categories/:id`          | JWT         | Mengambil kategori berdasarkan ID               |
| PUT    | `/api/v1/categories/:id`          | JWT         | Memperbarui kategori                            |
| DELETE | `/api/v1/categories/:id`          | JWT         | Soft-delete kategori                            |
| GET    | `/api/v1/todos`                   | JWT         | Daftar todo (pagination/sort/filter/search)     |
| POST   | `/api/v1/todos`                   | JWT         | Membuat todo baru                               |
| GET    | `/api/v1/todos/:id`               | JWT         | Mengambil todo berdasarkan ID                   |
| PUT    | `/api/v1/todos/:id`               | JWT         | Memperbarui todo                                |
| DELETE | `/api/v1/todos/:id`               | JWT         | Soft-delete todo                                |
| GET    | `/api/v1/activity-logs`           | JWT         | Daftar log aktivitas (milik sendiri, atau semua jika admin) |
| GET    | `/api/v1/external/stats`          | API Key     | Statistik agregat (tidak perlu JWT)             |

Skema request/response lengkap tersedia di Swagger UI pada `/api-docs`.

### Contoh: Daftar todo dengan pagination, sorting, filtering, search

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

## ❗ Format Response Error

Semua error mengikuti format JSON yang konsisten:

```json
{
  "success": false,
  "status": "fail",
  "message": "Todo not found.",
  "errors": []
}
```

| Status Code | Arti                                                      |
|-------------|-------------------------------------------------------------|
| 200         | OK — request berhasil                                        |
| 201         | Created — resource berhasil dibuat                           |
| 400         | Bad Request — validasi gagal                                 |
| 401         | Unauthorized — JWT/API key tidak ada atau tidak valid         |
| 403         | Forbidden — role/izin tidak mencukupi                         |
| 404         | Not Found — resource tidak ditemukan                          |
| 409         | Conflict — resource duplikat (misalnya email sudah digunakan) |
| 500         | Internal Server Error — kesalahan tak terduga/bug sistem      |

---

## 🧩 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose ODM
- **Auth**: jsonwebtoken, bcryptjs
- **Validasi**: express-validator
- **Dokumentasi**: swagger-jsdoc, swagger-ui-express
- **Keamanan**: helmet, cors, express-rate-limit, express-mongo-sanitize, xss-clean, hpp
- **Testing**: Jest, Supertest, mongodb-memory-server

---

## 📄 Lisensi

MIT
