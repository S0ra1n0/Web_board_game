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
  - `UserHome.jsx`: Protected dashboard representing the standard user's landing page.
  - `AdminHome.jsx`: Protected dashboard for admin users only.
- `/src/context/`
  - `AuthContext.jsx`: Global state manager. Handles JWT tokens in `localStorage`, `user` object access, API communication for auth, and Theme configuration (Light/Dark mode).
- `/src/styles/`
  - `index.css`: Global design system defining CSS variables, glassmorphism UI utility classes, and layout structures.
- `/src/App.jsx`: Primary component. Configures `react-router-dom` and the `ProtectedRoute` wrapper to restrict dashboard access based on `user.role` context.

### `/src` (Express Backend Application)
Contains the REST API server, database configurations, routing, and controllers.

- `/controllers/`
  - `authController.js`: Core logic for `register`, `login`, `requestPasswordReset`, and `verifyPasswordReset`. Handles input validation constraints, duplicate checking, bcrypt hashing, and generating JWTs (including temporary 10-minute reset tokens).
- `/middleware/`
  - `authMiddleware.js`: Security layer. `protect` verifies if requests have a valid JWT. `restrictTo` acts as a factory function to block access unless the user matches specific roles (e.g., 'admin').
- `/routes/`
  - `authRoutes.js`: Maps endpoints like `/api/auth/login` to the appropriate controller methods.
  - `adminRoutes.js`: Example routes meant exclusively for admins, secured entirely by `authMiddleware.restrictTo('admin')`.
- `/db/` 
  - `db.js`: Initializes database connection via Knex.
  - `/migrations/`: SQL definition files that construct and alter the database schema (users, games, sessions, ratings).
  - `/seeds/`: Scripts to wipe database tables and insert starting data (e.g., `01_users.js` populates default admin and user profiles).

---

## 🚀 How to Run

You need to run two separate development servers to test the full application.

### 1. Backend Server
From the root directory of the project:
```bash
# Start the Express server to handle APIs and connect to Supabase
npm run dev
```
*The backend server will run on port 3000.*

### 2. Frontend Development Server
Open a **new, separate terminal tab**, navigate to the frontend folder, and start Vite:
```bash
cd frontend
npm run dev
```
*The Vue server will start on port 5173. Open `http://localhost:5173` in your browser.*

---

## 👤 Default Accounts

If you run `npx knex seed:run` in the root directory, your database `users` table will reset and install the two following default accounts:

| Role | Email | Password |
|---|---|---|
| **Admin** | admin@example.com | admin123 |
| **User** | user1@example.com | user123 |

> **Warning:** Running the seed command will **delete** any accounts you've newly registered through the app itself. It is meant to revert the database to a known, raw starting state.
