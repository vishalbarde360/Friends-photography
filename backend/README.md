# Friends Photography Backend

MERN backend for the Friends Photography PRD. It provides admin authentication, portfolio/inquiry/client/event/album/photo CRUD, Cloudinary uploads, private event galleries, publish/unpublish and QR generation.

## Setup

```bash
npm install
cp .env.example .env
npm start
```

Required environment variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
FRONTEND_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

## PRD API

### Auth
- POST `/api/auth/login`
- POST `/api/auth/register`
- POST `/api/auth/setup-admin`
- POST `/api/auth/logout`
- GET `/api/auth/me`

`/api/user/*` is retained as a backward-compatible alias.

### Portfolio
- GET `/api/portfolio`
- GET `/api/portfolio/:id`
- POST `/api/portfolio` (admin, multipart: `coverImage`, `images[]`)
- PUT `/api/portfolio/:id` (admin, multipart)
- DELETE `/api/portfolio/:id` (admin)

### Inquiries
- POST `/api/inquiries`
- GET `/api/inquiries` (admin)
- GET `/api/inquiries/:id` (admin)
- PUT `/api/inquiries/:id` (admin)
- DELETE `/api/inquiries/:id` (admin)

### Clients
- GET/POST `/api/clients`
- GET/PUT/DELETE `/api/clients/:id`

### Events
- GET `/api/events`
- GET `/api/events/:id`
- POST `/api/events`
- PUT `/api/events/:id`
- DELETE `/api/events/:id`

### Albums
- GET `/api/albums`
- GET `/api/albums/:id`
- GET `/api/albums/event/:eventId`
- POST `/api/albums`
- PUT `/api/albums/:id`
- DELETE `/api/albums/:id`

### Photos
- GET `/api/photos`
- GET `/api/photos/:id`
- POST `/api/photos` (multipart: `photos[]`, body: `eventId`, `albumId`)
- DELETE `/api/photos/:id` (also deletes from Cloudinary)

### Gallery
Admin:
- POST `/api/gallery/events/:eventId/token`
- PUT `/api/gallery/events/:eventId/publish`
- PUT `/api/gallery/events/:eventId/unpublish`
- GET `/api/gallery/events/:eventId/qr`

Public:
- GET `/api/gallery/:token`
- GET `/api/gallery/:token/photos`

Backward-compatible gallery routes are also retained.

## Notes

- Gallery tokens use `crypto.randomBytes(32)` and are not based on MongoDB IDs.
- Public gallery requests require a valid token and `Published` status.
- Gallery photo queries are always scoped to the event represented by the token.
- Cloudinary admin credentials are used only on the backend.
