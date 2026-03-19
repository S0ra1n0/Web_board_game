# Web Board Game Project

A full-stack web application featuring a role-based authentication system, built as a starting foundation for a collection of web-based board games. 

## 🛠️ Tech Stack

**Frontend:**
- **React 18** (Vite for fast bundling)
- **React Router v6** (Client-side routing and protected routes)
- **Lucide React** (Icons)
- **Vanilla CSS** (Premium Glassmorphism & Light/Dark mode design)

**Backend:**
- **Node.js & Express.js** (Server framework)
- **Knex.js** (SQL Query Builder & Migrations)
- **PostgreSQL** (Hosted on Supabase)
- **Bcryptjs & JSON Web Tokens (JWT)** (Secure authentication and RBAC)

---

## 📂 Project Structure

### `/frontend` (React Single Page Application)
Contains the front-facing user interface of the application.

- `/src/pages/`
  - `LoginPage.jsx`: UI for user and admin login. Handles role-based redirects.
  - `RegisterPage.jsx`: UI for creating new user accounts. Includes validation constraints (length). Submitting securely generates an email verification link using Nodemailer.
  - `VerifyRegisterPage.jsx`: UI that catches the `/:token` registration link. On validation, permanently saves the user into the database and issues success screen.
  - `ResetPasswordPage.jsx`: UI for requesting a password reset. Sends a verification token link to the user's email.
  - `VerifyResetPage.jsx`: UI that catches the emailed `/:token` password-reset link and finalizes the password reset securely.
  - `UserHome.jsx`: Protected dashboard acting as a fully-featured retro Game Hub Virtual Console with a 20x20 LED pixel matrix, custom sidebars, and dynamic leaderboards.
  - `AdminHome.jsx`: Protected dashboard for admin users only.
  
- `/src/components/hub/`
  - `GameMatrix.jsx`: Core display logic for the 20x20 visual matrix, which renders actual game states like Tic-Tac-Toe and Menu Pixel Art.
  - `GameControls.jsx`: Emulated physical console buttons providing strictly Left, Right, Enter, Back, and Hint inputs to navigate the UI.
  - `SocialSidebar.jsx`: Displays user profile cards with real-time ranks, achievement trackers, and friends lists.
  - `StatsSidebar.jsx`: Live query system pulling global leaderboards securely from the PostgreSQL backend.
  
- `/src/hooks/`
  - `useTicTacToe.jsx`: Standalone game logic module that maps Tic-Tac-Toe moves exclusively to the 5-button interface and overlays its graphics directly onto the Matrix.
- `/src/context/`
  - `AuthContext.jsx`: Global state manager. Handles JWT tokens in `localStorage`, `user` object access, API communication for auth, and Theme configuration (Light/Dark mode).
- `/src/styles/`
  - `index.css`: Global design system defining CSS variables, glassmorphism UI utility classes, and layout structures.
- `/src/App.jsx`: Primary component. Configures `react-router-dom` and the `ProtectedRoute` wrapper to restrict dashboard access based on `user.role` context.

### `/src` (Express Backend Application)
Contains the REST API server, database configurations, routing, and controllers.

- `/controllers/`
  - `authController.js`: Core logic for auth... Uses bcrypt hashing and JWT.
  - `userController.js`: Manages secure endpoint queries for fetching Global Leaderboards and tracking/upserting live player stat scores and wins inside the Postgres `user_stats` table.
- `/middleware/`
  - `authMiddleware.js`: Security layer. `protect` verifies if requests have a valid JWT. `restrictTo` acts as a factory function to block access unless the user matches specific roles (e.g., 'admin').
- `/routes/`
  - `authRoutes.js`: Maps endpoints like `/api/auth/login` to the appropriate controller methods.
  - `userRoutes.js`: Exposes `/stats` and `/leaderboard/:game_id` endpoints.
  - `adminRoutes.js`: Example routes meant exclusively for admins, secured entirely by `authMiddleware.restrictTo('admin')`.
- `/db/` 
  - `db.js`: Initializes database connection via Knex.
  - `/migrations/`: SQL definition files that construct and alter the database schema (users, games, sessions, user_stats, ratings).
  - `/seeds/`: Scripts to wipe database tables and insert starting data.

---

## 🚀 Getting Started

### Prerequisites
Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher recommended)
- **PostgreSQL** database (Local or Hosted like [Supabase](https://supabase.com/))

### Environment Variables
You will need to create a `.env` file in the root directory to store your environment variables.
An example file named `.env.example` has been provided.

1. Copy `.env.example` to a new file named `.env`:
   ```bash
   cp .env.example .env
   ```
2. Fill in the required variables in your `.env` file:
   - `PORT`: Usually 3000.
   - `DATABASE_URL`: Your PostgreSQL connection string. If using Supabase, you can find this in your project settings under Database > URI.
   - `JWT_SECRET`: A secure random string used to sign JSON Web Tokens.
   - `EMAIL_USER`: Email address used by Nodemailer to send verification/reset emails (e.g., a Gmail address).
   - `EMAIL_PASS`: App password for the email account. For Gmail, you need to enable 2-Step Verification and generate an "App Password" in your Google Account security settings.

### Installation

1. **Install Backend Dependencies**
   From the root directory of the project:
   ```bash
   npm install
   ```

2. **Install Frontend Dependencies**
   Navigate to the frontend folder and install its dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. **Database Setup**
   Ensure your PostgreSQL database is running and the `DATABASE_URL` is set correctly in your `.env` file. Then, run the database migrations and optionally the seed script:
   ```bash
   # In the root directory
   npx knex migrate:latest
   npx knex seed:run
   ```

## 🚀 How to Run

You need to run two separate development servers to test the full application.

### 1. Backend Server
From the root directory of the project:
```bash
# Start the Express server to handle APIs and connect to the database
npm run dev
```
*The backend server will run on port 3000.*

### 2. Frontend Development Server
Open a **new, separate terminal tab**, navigate to the frontend folder, and start Vite:
```bash
cd frontend
npm run dev
```
*The React server will start on port 5173. Open `http://localhost:5173` in your browser.*

---

## 👤 Default Accounts

If you run `npx knex seed:run` in the root directory, your database `users` table will reset and install the two following default accounts:

| Role | Email | Password |
|---|---|---|
| **Admin** | admin@example.com | admin123 |
| **User** | user1@example.com | user123 |

> **Warning:** Running the seed command will **delete** any accounts you've newly registered through the app itself. It is meant to revert the database to a known, raw starting state.
