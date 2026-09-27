# H R FURNITURE

A website for **H R Furniture**, a premium furniture store selling **sofas,
beds, dining sets, chairs, wardrobes and mattresses** (retail — not
manufacturing). Customer-facing marketing site with a gallery, reviews,
map/Instagram/WhatsApp presence, enquiry form, and a single-admin control
panel for images and rates.

**Backend: Postgres** (Neon on Vercel) + Express. All data lives in your own
Postgres database; uploaded images are stored in the database itself (no
external storage service).

## Features

**Public site (`/`)**
- Premium homepage: dark full-bleed showroom hero, category tiles (Sofas,
  Beds, Dining, Chairs, Wardrobes, Combos), admin-editable starting prices,
  gallery of real stock photos, why-us, stats, process, reviews, FAQ,
  location and contact.
- **Reviews** — customers leave a star-rated review; it appears after the
  admin approves it.
- **Google Map** embed, **Instagram** and **WhatsApp** (wa.me) buttons.
- **Enquiry form** — quote requests stored in the database, with optional
  GPS "use my current location".

**Admin panel (`/admin`)**
- Single admin login (username + password, 12-hour session).
- **Images** — upload photos or add by URL, delete.
- **Rates** — edit each category's name, description and starting price.
- **Reviews** — approve / unapprove / delete.
- **Enquiries** — view, mark handled, delete, call/WhatsApp the customer.

## Tech stack

- Frontend: Vite + React 19 + TypeScript, React Router v7, Tailwind v4 +
  shadcn/ui + Lucide + Framer Motion
- Backend: Express 5 + postgres.js (Neon Postgres on Vercel), Multer for
  uploads; images stored in the database as `bytea`
- Local database: embedded Postgres ([PGlite](https://github.com/electric-sql/pglite))
  — nothing to install; data lives in `server/data/pg`

## Project structure

```
api/
  index.js         # Vercel serverless entry (exports the Express app)
server/
  app.js           # Express API: public + admin endpoints, Postgres queries
  index.js         # CLI launcher (local dev / self-hosting)
  preview-server.mjs # Zero-setup preview (embedded Postgres)
  smoke-test.mjs   # End-to-end API test (embedded Postgres, throwaway data)
public/
  client-photos/   # 56 client-supplied showroom photos (seeded into the gallery)
src/
  lib/api.ts       # Frontend API client
  components/      # BrandLogo, ReviewForm, Stars, EnquiryForm, ui/*
  pages/           # Landing.tsx, Admin.tsx, NotFound.tsx
  main.tsx         # routes
  index.css        # theme tokens (espresso + gold premium palette)
```

## Getting started (zero database setup)

```bash
npm install
npm run dev:all        # API on :3001, Vite on :5173
```

No database steps: without `DATABASE_URL` the API automatically uses an
embedded Postgres (PGlite) stored in `server/data/pg`. The four categories
and the default gallery are seeded on first start. Delete `server/data/pg`
for a factory reset.

## Production

```bash
npm run build       # typecheck + build the SPA into dist/
npm start           # Express serves dist/ and the API on one port (3001)
```

Set these env vars in production:

- `DATABASE_URL` — Postgres connection string (Neon on Vercel)
- `ADMIN_USERNAME` / `ADMIN_PASSWORD` — the admin login
- `PORT` — defaults to 3001
- `PUBLIC_API_BASE` — optional; public origin of the API
- `VITE_API_URL` — build-time; API base URL when it differs from the SPA origin

## Deploy free on Vercel — with Neon

The API is Vercel-serverless-ready (`api/index.js` exports the Express app;
`vercel.json` builds the SPA and routes `/api/*` to it).

1. Push this folder to a new GitHub repo and import it at vercel.com.
2. Project → **Storage** → **Create Database** → **Neon** (free plan is fine,
   pick e.g. Mumbai `ap-south-1`). Vercel injects `DATABASE_URL` automatically.
3. Settings → Environment Variables — add:
   - `ADMIN_USERNAME` — your admin username
   - `ADMIN_PASSWORD` — a strong password (do **not** ship the default
     `admin` / `Admin@123` — it's public in this repo)
4. **Deployments → Redeploy** (env vars only apply to new builds).
5. Verify `https://<your-app>.vercel.app/api/health` → `{"ok":true}`, then
   sign in at `/admin`.

Vercel notes: serverless has a ~4.5 MB request limit (image uploads are
accepted at 8 MB locally but effectively ~4 MB on Vercel — compress photos
first), and functions cold-start after inactivity (1–2 s first API call).

## Routes

| Path | Description |
| --- | --- |
| `/` | Marketing homepage |
| `/admin` | Admin control panel |

## API overview

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/api/products` | — | Categories & starting prices (seeded) |
| GET | `/api/gallery` | — | Admin-added images |
| GET | `/api/reviews` | — | Approved reviews |
| POST | `/api/reviews` | — | Submit a review (pending) |
| POST | `/api/enquiries` | — | Submit enquiry |
| GET | `/api/images/:fileId` | — | Serve an uploaded image |
| POST | `/api/admin/login` / `logout` | — | Admin session |
| GET | `/api/admin/stats` | Bearer | Dashboard counters |
| POST/DELETE | `/api/admin/images` | Bearer | Upload / add-by-URL / delete image |
| PATCH | `/api/admin/products/:id` | Bearer | Edit category & rate |
| GET/PATCH/DELETE | `/api/admin/reviews[...]` | Bearer | Moderate reviews |
| GET/PATCH/DELETE | `/api/admin/enquiries[...]` | Bearer | Handle enquiries |

Run the end-to-end API test (embedded Postgres, throwaway data dir):

```bash
node server/smoke-test.mjs
```

## Admin credentials

Exactly **one** admin account, configured via environment variables (see
`.env.example`):

```bash
ADMIN_USERNAME=admin
ADMIN_PASSWORD=Admin@123   # CHANGE THIS before going live
```

## Client details still to fill in (TODOs in the code)

- `src/pages/Landing.tsx` — Instagram handle, WhatsApp number, address,
  map location (search for `TODO`)
- Showroom photos are pre-seeded from the client's WhatsApp images; the admin
  can delete/replace any of them
