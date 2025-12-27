# Club App Backend (Cloudinary)

Express + MongoDB backend with JWT auth and Cloudinary for image uploads.

## Quick start

1. Copy `.env.example` to `.env` and fill values.
2. `npm install`
3. `npm run dev`
4. Create an admin user via `/api/auth/register` then set `role: 'admin'` in DB or add a seed.
5. Use Postman or frontend to POST `/api/posts` with form-data (image field name: `image`).

