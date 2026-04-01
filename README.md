# Web Board Game Project

Single-page board game platform for the Web Application Programming course. The project uses a React SPA frontend, an Express + Knex backend, and a Supabase Postgres database. It includes authentication, separate client/admin experiences, seven playable games, social features, admin management, protected API docs, and deterministic demo seeds.

## Stack

### Frontend
- React + Vite
- React Router
- Context API for auth and theme state
- Vanilla CSS with light/dark mode

### Backend
- Node.js + Express
- Knex
- PostgreSQL on Supabase
- JWT + bcrypt
- Nodemailer for verify/reset flows

## Core Features

### Authentication
- Login, register, verify-register, reset-password, verify-reset
- JWT-based route protection
- Role-aware redirects for `user`, `moderator`, and `admin`

### Client Features
- Retro matrix-based hub with 5-button interaction
- 7 playable games:
  - Tic-Tac-Toe
  - Caro 5
  - Caro 4
  - Snake
  - Match-3
  - Memory
  - Free Draw
- Per-game help, score/result UI, save/load, and review panel
- Profile management
- User search
- Friend requests and friends list
- Messaging without real-time transport
- Achievements
- Rankings with `global`, `friends`, and `me` scopes plus pagination
- Light/Dark mode

### Admin Features
- Admin dashboard
- User management with role and active-status controls
- Game management with enable/disable, board size, timer, score type, and instructions
- Statistics page with popularity, growth, review distribution, and totals
- Protected API docs page that requires both admin JWT and `x-api-key`

## Routes

### Public
- `/login`
- `/register`
- `/reset-password`
- `/verify-register/:token`
- `/verify-reset/:token`

### Client
- `/hub`
- `/games/:id`
- `/profile`
- `/users`
- `/friends`
- `/messages`
- `/achievements`
- `/rankings`

### Admin
- `/admin`
- `/admin/users`
- `/admin/games`
- `/admin/stats`
- `/admin/api-docs`

## Environment Variables

### Backend `.env`
Copy [`.env.example`](./.env.example) to `.env` and fill these values:

```env
PORT=3000
DATABASE_URL=postgresql://...
NODE_ENV=development
JWT_SECRET=replace-with-a-long-random-secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_app_password
APP_ORIGIN=http://localhost:5173
API_KEY=replace-with-a-private-admin-key
```

### Frontend `frontend/.env`
Copy [frontend/.env.example](./frontend/.env.example) to `frontend/.env`:

```env
VITE_API_BASE_URL=
VITE_ADMIN_API_KEY=replace-with-the-same-admin-key
```

Notes:
- Leave `VITE_API_BASE_URL` empty for local Vite proxy mode.
- `APP_ORIGIN` should match the frontend URL used in email verify/reset links.
- `API_KEY` and `VITE_ADMIN_API_KEY` must match for `/admin/api-docs`.

## Installation

### 1. Install dependencies
From the project root:

```powershell
npm install
cd frontend
npm install
```

### 2. Run migrations and seeds
Back at the project root:

```powershell
npx knex migrate:latest
npx knex seed:run
```

### 3. Start the backend
```powershell
npm run dev
```

### 4. Start the frontend
In a second terminal:

```powershell
cd frontend
npm run dev
```

## Default Seed Accounts

| Role | Email | Password |
|---|---|---|
| Admin | `admin1@example.com` | `admin123` |
| User | `user1@example.com` | `user123` |
| User | `user2@example.com` | `user123` |
| User | `user3@example.com` | `user123` |
| User | `user4@example.com` | `user123` |
| User | `user5@example.com` | `user123` |

## Demo Seed Data

After `seed:run`, the database contains deterministic demo data:

- 6 users
- 7 active games
- 6 profiles
- 3 friendships
- 3 pending friend requests
- 10 messages
- 4 achievements and 24 user-achievement rows
- 126 game sessions
- 42 ratings/comments
- 4 saved games
- 5 user stats rows

This makes the client pages and admin pages demo-ready immediately after a clean seed.

## Protected API Docs

1. Login with an admin account.
2. Open `/admin/api-docs`.
3. Use the configured `VITE_ADMIN_API_KEY`, or paste the same value as backend `API_KEY`.

The frontend page fetches `/api-docs` with:
- `Authorization: Bearer <admin-jwt>`
- `x-api-key: <api-key>`

## Verified Local Checks

The current `integration/merge-member-branches` branch has been verified with:

- `npx knex migrate:latest`
- `npx knex seed:run`
- `npm run build` in `frontend/`
- login for admin and user accounts
- rankings in all scopes
- review submission
- admin user updates
- admin game config updates
- protected `/api-docs`

## Submission Status

The local project is functionally close to submission-ready. The remaining release blocker is HTTPS hosting if the instructor requires a live deployed demo:

- Local development: complete
- Protected API docs: complete
- Deterministic seed/demo data: complete
- HTTPS deployment: still required as a final release step if not yet hosted
