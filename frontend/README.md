# Friends Photography — Frontend

React + Vite + Tailwind CSS frontend for the Friends Photography backend
(`friends-photography-backend-PRD-updated`). Built directly against every
route in that backend, using the studio's color palette.

## Color palette used

| Color | Hex | Role |
|---|---|---|
| Ivory | `#F8F5EF` | Main background |
| Warm Beige | `#E8D8C3` | Cards / sections |
| Mocha | `#8B6F5A` | Secondary elements |
| Deep Espresso | `#211C18` | Text / buttons |
| Muted Terracotta | `#B98268` | Accent |
| Soft White | `#FFFDF9` | Image / cards |

Configured as `ivory`, `beige`, `mocha`, `espresso`, `terracotta`, `softwhite`
in `tailwind.config.js`.

## Setup

```bash
npm install
cp .env.example .env   # set VITE_API_URL to your backend URL
npm run dev
```

Make sure the backend's `FRONTEND_URL` env var matches this app's dev URL
(default `http://localhost:5173`) since the API uses cookie-based auth with
CORS credentials.

## Pages

**Public site**
- `/` — Home, hero + recent portfolio
- `/portfolio` — Portfolio grid, filterable by category
- `/portfolio/:id` — Portfolio piece detail with lightbox
- `/contact` — Inquiry form (`POST /api/inquiries`)
- `/gallery` — Enter a client gallery token
- `/gallery/:token` — Public client gallery (albums + photos + download)
- `/login`, `/register` — Studio team auth (register supports the admin
  setup key flow via `POST /api/auth/setup-admin`)

**Admin (protected, requires `role: "admin"`)**
- `/admin` — Dashboard with live counts
- `/admin/inquiries` — View & update inquiry status, delete
- `/admin/clients` — Client CRUD
- `/admin/events` — Event CRUD (linked to a client)
- `/admin/albums` — Album CRUD (linked to an event)
- `/admin/photos` — Upload / delete event photos (linked to event + album)
- `/admin/portfolio` — Portfolio CRUD with cover + gallery image upload
- `/admin/galleries` — Generate gallery token, publish/unpublish, QR code

## Responsive behavior

- Fully responsive from small phones up to desktop.
- The public navbar collapses into an animated hamburger menu with a
  full-screen slide-in panel below the `md` breakpoint.
- The admin sidebar becomes a slide-in drawer (triggered by a hamburger
  button in a sticky mobile top bar) below the `lg` breakpoint.
- All grids, tables (horizontally scrollable on narrow screens), and forms
  reflow for mobile.

## Notes on the API integration

- Auth uses an httpOnly cookie set by the backend — the axios instance is
  configured with `withCredentials: true`, no token handling needed in JS.
- All route paths and payload shapes (multipart fields for photo/portfolio
  uploads, required body fields, etc.) were read directly from the
  backend's routes, controllers and models to make sure they match exactly.
- Every `/api/**` module in `src/api/` maps 1:1 to a backend route file.
