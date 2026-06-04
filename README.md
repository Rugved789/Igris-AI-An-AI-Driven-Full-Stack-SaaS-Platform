# Igris.Ai

Igris.Ai is a full-stack AI workspace for generating content and editing images. The app combines a Vite + React frontend with an Express backend, Clerk authentication, Neon Postgres persistence, Cloudinary storage, and AI services for text and image generation.

## Overview

The app focuses on creator workflows:

- Write long-form articles with AI
- Generate blog title ideas
- Create AI images
- Remove backgrounds from images
- Remove specific objects from images
- Review resume PDFs with AI feedback
- Browse and like published creations in a community feed

## Tech Stack

- Frontend: React 19, Vite, React Router, Tailwind CSS 4
- Backend: Node.js, Express 5
- Auth: Clerk (`@clerk/clerk-react` on the frontend, `@clerk/express` on the backend)
- Database: Neon Postgres via `@neondatabase/serverless`
- File handling: Multer and local `backend/uploads/`
- Media storage: Cloudinary
- AI providers: Google Gemini-compatible OpenAI API and Clipdrop

## Project Structure

- backend/
  - `server.js` - Express server entrypoint
  - `configs/db.js` - Neon database client
  - `configs/cloudinary.js` - Cloudinary setup
  - `configs/multer.js` - upload handling
  - `controllers/aiController.js` - article, title, image, background, object, and resume workflows
  - `controllers/userController.js` - dashboard and community creation queries
  - `middlewares/auth.js` - Clerk auth guard
  - `routes/aiRoutes.js` - AI feature endpoints
  - `routes/userRoutes.js` - user/community endpoints

- frontend/
  - `src/pages/` - Home, dashboard, article generation, image tools, resume review, and community pages
  - `src/components/` - layout and UI building blocks
  - `src/App.jsx` - app routing

## Main Features

- Landing page with feature overview and navigation
- Authenticated AI workspace under `/ai`
- Dashboard showing a user’s saved creations
- Article writing and blog title generation
- AI image generation
- Background removal and object removal
- Resume review from uploaded PDF files
- Community feed for published creations

## Backend Routes

The backend currently exposes these route groups:

- `GET /` - health check
- `POST /api/ai/write-article`
- `POST /api/ai/blog-title`
- `POST /api/ai/generate-image`
- `POST /api/ai/remove-bg`
- `POST /api/ai/remove-obj`
- `POST /api/ai/review-resume`
- `GET /api/user/get-user-creations`
- `GET /api/user/get-published-creations`
- `POST /api/user/toggle-like-creations`

Most of these routes are protected by Clerk auth and store results in the `creations` table in Neon Postgres.

## Environment Variables

Create a `backend/.env` file with values like these:

```env
PORT=3000
DATABASE_URL=your_neon_postgres_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
CLIPDROP_API_KEY=your_clipdrop_api_key
GEMINI_API_KEY=your_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

The frontend also expects `VITE_BASE_URL` to point to the backend API URL.

## Local Development

Backend:

```bash
cd backend
npm install
npm start
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## Deployment

The repository is prepared for Vercel deployment through the `backend/versal.json` and `frontend/versal.json` configs.

Live app: https://igris-ai-an-ai-driven-full-stack-sa.vercel.app/

## Notes

- Uploaded files are written to `backend/uploads/` and cleaned up after processing where possible.
- The dashboard fetches user creations from Neon Postgres through Clerk-authenticated requests.
- If you change the API base path or deployment target, update `VITE_BASE_URL` in the frontend environment.

## License

No license file is present in the repository.
