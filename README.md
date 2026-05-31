# Igris-Ai

Simple AI-powered image tools and content helpers — full-stack project with a Vite React frontend and an Express backend.

## Overview

Igris-Ai provides utilities around AI image generation and editing plus content helpers (e.g., article writing, resume review). The repository includes a frontend (Vite + React) and a backend (Node/Express) that exposes REST endpoints the frontend consumes.

Key goals:
- Fast prototyping UI for AI image and content features
- Simple backend to orchestrate external AI/image services and handle uploads
- Clear local development workflow

## Features
- Generate images using AI backends (configured in `backend/controllers/aiController.js`)
- Remove background / remove objects (routes in `backend/routes/aiRoutes.js`)
- User authentication and management (`backend/controllers/userController.js`)
- File upload handling with `backend/configs/multer.js` and persistent `backend/uploads/`

## Tech stack
- Frontend: React (Vite)
- Backend: Node.js + Express
- Storage: Local `uploads/` (can be replaced with cloud storage like Cloudinary)
- Authentication: JWT-based (see `backend/middlewares/auth.js`)

## Repo structure

- backend/
  - package.json — backend dependencies and npm scripts
  - server.js — Express app entrypoint
  - controllers/ — route handlers (`aiController.js`, `userController.js`)
  - routes/ — route definitions (`aiRoutes.js`, `userRoutes.js`)
  - configs/ — helpers for DB, Cloudinary, Multer
  - middlewares/ — authentication middleware
  - uploads/ — stored uploads

- frontend/
  - package.json — frontend dependencies and npm scripts
  - src/ — React app source (pages, components)
  - public/ — static assets

## Prerequisites
- Node.js (16+ recommended)
- npm (or yarn)
- A MongoDB instance if you plan to enable database-backed features (or update DB config to use another datastore)

## Quick start (development)

1. Clone the repo and open a terminal.

2. Backend

```bash
cd backend
npm install
# Start the backend. If `npm start` is defined it will run the server; otherwise use:
node server.js
# or if you use nodemon during development:
# npx nodemon server.js
```

3. Frontend

```bash
cd frontend
npm install
npm run dev
# open the printed URL (usually http://localhost:5173)
```

4. Open the app in your browser and test features.

## Environment variables

Create a `.env` file in `backend/` (or use your preferred secrets manager). Example variables used by this project:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/igris-ai
JWT_SECRET=your_jwt_secret_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Adjust names to match the variables referenced in `backend/configs/*` files. If the project uses `versal.json` for secrets in dev, keep it in sync instead of `.env`.

## API / Endpoints

Routes live in `backend/routes/`.

Common endpoints (inspect route files for exact paths):
- `POST /api/ai/...` — image generation / edits
- `POST /api/users/register` — register user
- `POST /api/users/login` — login and receive JWT

Use a tool like Postman or the browser-based frontend to exercise endpoints. If you change route prefixes, update the frontend API base URL in `frontend/src`.

## Configuration notes
- Image uploads are written to `backend/uploads/`. Clean this folder as needed; consider switching to cloud storage for production.
- Cloudinary configuration is in `backend/configs/cloudinary.js` and expects the Cloudinary environment variables above.
- Database config is in `backend/configs/db.js` — update `MONGODB_URI` or the connection logic to suit your environment.

## Useful commands

- Backend: `cd backend && node server.js` (or `npm start` / `npm run dev` if scripts exist)
- Frontend: `cd frontend && npm run dev`
- Install dependencies: `npm install` in each folder

## Troubleshooting
- If backend won't start, check port conflicts and `PORT` env variable.
- If uploads fail, confirm `backend/uploads/` exists and has write permissions.
- If Cloudinary features fail, verify credentials and network access.

## Tests
If tests are added, they will appear in `backend/` and/or `frontend/` and can be run via `npm test` in the respective folder.

## Contributing
- Fork the repo and open a PR with a clear description of changes.
- Keep commits small and focused.
- Add or update documentation when changing behavior.

## License
This repository does not include a license file. Add a `LICENSE` if you want to make the intended license explicit.

---

If you'd like, I can also:
- Add a `.env.example` in `backend/` with the keys shown above.
- Add startup npm scripts to `backend/package.json` and `frontend/package.json` if they are missing.

File: [README.md](README.md)
