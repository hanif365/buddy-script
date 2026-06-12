# BuddyScript

A small social feed app built as a full stack task. Users can register, log in,
create posts (text and image), react, comment, reply, and see who reacted. The
frontend is built with Next.js and the backend is an Express + MongoDB REST API.

## Tech stack

- Frontend: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4
- Backend: Express 5, TypeScript, Mongoose (MongoDB), JWT auth, Zod validation
- Image upload: Cloudinary
- Auth: JWT stored in an httpOnly cookie

## Project structure

    backend/    Express REST API (auth, posts, comments, likes, uploads)
    frontend/   Next.js app (UI and protected routing)

The two apps are independent. In development the frontend proxies `/api/*` to the
backend so the auth cookie stays same origin.

## Getting started

You need Node.js 18+ and a MongoDB database (local or Atlas). A Cloudinary
account is used for image uploads.

### Backend

    cd backend
    npm install
    copy .env.example .env   (then fill in the values)
    npm run dev

Env values:

- `PORT` server port (default 5000)
- `CLIENT_ORIGIN` frontend url for CORS (http://localhost:3000)
- `MONGODB_URI` MongoDB connection string
- `JWT_SECRET` secret used to sign tokens
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (for Google sign in)

Run `npm run seed` to add a few demo users and posts.

### Frontend

    cd frontend
    npm install
    copy .env.example .env.local   (then fill in the values)
    npm run dev

Env values:

- `BACKEND_URL` backend url for the dev proxy (http://localhost:5000)
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` Google OAuth client id

Then open http://localhost:3000.

## Main features

- Register and login with JWT in an httpOnly cookie, plus Google sign in
- Protected feed, posts shown newest first
- Create a post with text and/or image and public or private visibility
- Reactions on posts and comments (like, love, care, haha, wow, sad, angry)
- Comments and one level of replies
- Who reacted list for posts and comments
- Private posts are only visible to their author, enforced on the server

## API

Base path `/api`.

- `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`, `GET /auth/me`, `POST /auth/google`
- `GET /posts`, `POST /posts`, `POST /posts/:id/like`, `GET /posts/:id/likes`
- `GET /posts/:id/comments`, `POST /posts/:id/comments`
- `GET /comments/:id/replies`, `POST /comments/:id/like`, `GET /comments/:id/likes`