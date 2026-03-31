# Web Board Game Delivery Plan

## Goal
Build the project to satisfy the full course rubric with no missing mandatory features and minimal grading risk.

## Current Baseline
The current codebase already provides a usable starting point:

- React SPA with browser routes
- Authentication and role-based access
- Light/Dark mode
- Retro board-game hub UI with a 20x20 matrix
- One playable game: Tic-Tac-Toe
- Save/load and ranking foundations
- Express + Knex backend with migrations and seeds

Major gaps that still cause deductions if submitted now:

- Missing 6 required games
- Client features are incomplete: profile, search, friends, messages, achievements
- Ranking is incomplete and has no full filtering or pagination
- Admin features are mostly missing
- Rating/comment flow is missing
- API docs with auth are missing
- HTTPS and API key flow are missing
- Demo data is far below rubric minimum
- Backend structure needs clearer "extended MVC" separation

## Delivery Principles
- Do not rewrite the app from scratch.
- Keep the current retro matrix concept and extend it consistently.
- Implement every rubric item to a "demo-safe" level before polishing.
- Prefer complete simple features over ambitious incomplete ones.
- Seed meaningful demo data early so every feature can be shown.

## Target Architecture

### Frontend
- `frontend/src/layouts/ClientLayout.jsx`
- `frontend/src/layouts/AdminLayout.jsx`
- `frontend/src/pages/client/HubPage.jsx`
- `frontend/src/pages/client/GamePage.jsx`
- `frontend/src/pages/client/ProfilePage.jsx`
- `frontend/src/pages/client/UsersPage.jsx`
- `frontend/src/pages/client/FriendsPage.jsx`
- `frontend/src/pages/client/MessagesPage.jsx`
- `frontend/src/pages/client/AchievementsPage.jsx`
- `frontend/src/pages/client/RankingsPage.jsx`
- `frontend/src/pages/admin/AdminDashboardPage.jsx`
- `frontend/src/pages/admin/AdminUsersPage.jsx`
- `frontend/src/pages/admin/AdminGamesPage.jsx`
- `frontend/src/pages/admin/AdminStatsPage.jsx`
- `frontend/src/pages/admin/ApiDocsPage.jsx` or direct route to backend docs
- `frontend/src/hooks/games/` for one hook per game
- `frontend/src/services/` for API wrappers

### Backend
- `src/controllers/authController.js`
- `src/controllers/profileController.js`
- `src/controllers/userSearchController.js`
- `src/controllers/friendController.js`
- `src/controllers/messageController.js`
- `src/controllers/achievementController.js`
- `src/controllers/gameController.js`
- `src/controllers/rankingController.js`
- `src/controllers/reviewController.js`
- `src/controllers/adminController.js`
- `src/services/` for business rules
- `src/repositories/` for query logic
- `src/routes/` split by feature
- `src/middleware/` for auth, role, api key, pagination parsing

### Database
Keep current tables and add the missing ones:

- `users`
- `games`
- `game_sessions`
- `user_stats`
- `saved_games`
- `ratings` or rename/expand to `game_reviews`
- `profiles`
- `friend_requests`
- `friendships`
- `messages`
- `achievements`
- `user_achievements`
- `game_configs`

## Unified 5-Button Interaction Contract
This must be locked before implementing the remaining games so the UI does not become inconsistent.

- `Left`: move selection left, previous item, or rotate direction left
- `Right`: move selection right, next item, or rotate direction right
- `Enter`: confirm selection, place move, toggle cell, pause/resume
- `Back`: cancel, go up one step, or save-and-exit flow
- `Hint`: open game instructions and controls

For 2D grid games that need row and column selection:

1. Select row with `Left/Right`
2. Press `Enter`
3. Select column with `Left/Right`
4. Press `Enter` to commit the move
5. `Back` returns to row selection or exits

The board matrix must visibly show the current mode:

- menu selection
- row selection
- column selection
- active game state
- game over state

## Route Map

### Public
- `/login`
- `/register`
- `/reset-password`
- `/verify-register/:token`
- `/verify-reset/:token`

### Client
- `/hub`
- `/games/:gameId`
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

## API Surface

### Auth
- `POST /api/auth/register`
- `POST /api/auth/verify-register`
- `POST /api/auth/login`
- `POST /api/auth/request-password-reset`
- `POST /api/auth/verify-reset`

### Profile and users
- `GET /api/profile`
- `PATCH /api/profile`
- `GET /api/users/search`
- `GET /api/users/:id`

### Friends
- `GET /api/friends`
- `GET /api/friends/requests`
- `POST /api/friends/requests`
- `PATCH /api/friends/requests/:id/accept`
- `DELETE /api/friends/requests/:id`
- `DELETE /api/friends/:friendId`

### Messages
- `GET /api/messages/conversations`
- `GET /api/messages/conversations/:userId`
- `POST /api/messages`

### Achievements
- `GET /api/achievements`
- `GET /api/achievements/me`

### Games
- `GET /api/games`
- `GET /api/games/:id`
- `GET /api/games/:id/config`
- `POST /api/games/:id/save`
- `GET /api/games/:id/save`
- `DELETE /api/games/:id/save`
- `POST /api/games/:id/session`
- `GET /api/games/:id/reviews`
- `POST /api/games/:id/reviews`

### Rankings
- `GET /api/rankings`
  - query params: `gameId`, `scope=global|friends|me`, `page`, `pageSize`

### Admin
- `GET /api/admin/dashboard`
- `GET /api/admin/users`
- `PATCH /api/admin/users/:id`
- `GET /api/admin/games`
- `PATCH /api/admin/games/:id`
- `GET /api/admin/stats`

### API docs
- `GET /api-docs`
  - protected by admin JWT and `x-api-key`

## Feature Completion Plan

## Phase 0: Stabilize the Foundation
Objective: stop feature drift and define the final contract.

Tasks:

- Freeze the route map and API map above.
- Add `APP_ORIGIN`, `API_KEY`, `FRONTEND_API_BASE_URL`, and timer defaults to env design.
- Replace hardcoded frontend origin in email links.
- Document the 5-button interaction rules.
- Create a single source of truth for game metadata: title, enabled, board size, timer, score type.

Exit criteria:

- No hardcoded localhost URLs in business logic
- Team agrees on the game interaction contract
- All future work branches from the same plan

## Phase 1: Refactor Backend to Extended MVC
Objective: make the backend defensible against the "not MVC" deduction.

Tasks:

- Split controllers by domain instead of one large user controller.
- Add `services` for game scoring, achievements, social rules, admin metrics.
- Add `repositories` for Knex queries.
- Add validators for auth, profile update, friend requests, messages, reviews, ranking queries.
- Add centralized error handler with typed app errors.
- Add middleware for pagination, auth, role, and API key.

Exit criteria:

- Controllers are thin
- Query logic is not mixed with route declarations
- Feature code is grouped by domain

## Phase 2: Finish Data Model and Seeds
Objective: remove grading risk from missing or meaningless demo data.

Tasks:

- Add migrations for profiles, friend requests, friendships, messages, achievements, user achievements, game configs, reviews.
- Expand `games` seed to all 7 required games.
- Seed at least:
  - 1 admin
  - 5 normal users
  - 3+ friend relationships
  - 3+ pending friend requests
  - 3+ conversations with multiple messages each
  - 3+ achievements with unlocked and locked states
  - 3+ reviews/comments per several games
  - saved games for multiple game types
  - ranking/session data for every game
- Seed profile data, avatars, bios, stats, and mixed win/loss history.

Exit criteria:

- Running `migrate + seed` produces a demo-ready dataset
- Every main page has data to show without manual setup

## Phase 3: Frontend Layout and Navigation
Objective: satisfy layout and route requirements before feature detail.

Tasks:

- Build clear `ClientLayout` with navbar, matrix board area, player info, footer.
- Build separate `AdminLayout`.
- Move auth pages into their own structure.
- Add client navigation to profile, users, friends, messages, achievements, rankings.
- Add admin navigation to dashboard, users, games, stats, docs.
- Keep dark/light mode global and consistent.

Exit criteria:

- Client and Admin views are visually distinct
- Browser navigation works across all screens
- Main client UI clearly shows board, controls, player info, navbar, footer

## Phase 4: Implement All 7 Games
Objective: eliminate the largest grading deductions.

Required games:

1. Caro 5
2. Caro 4
3. Tic-Tac-Toe
4. Snake
5. Match-3
6. Memory
7. Free Draw

Rules for every game:

- Must render on the matrix board
- Must use the 5-button control contract
- Must have score or result display
- Must have timer where reasonable, with adjustable value
- Must support save/load
- Must have help/instructions
- Must play against computer where applicable

Implementation notes:

- Reuse the hook pattern already used by Tic-Tac-Toe.
- Caro AI can be random valid moves for base compliance.
- Snake should use timer speed config and save snake/body/food/direction/score.
- Match-3 can be a solo timed puzzle with random board refill, score, and move validation.
- Memory can be a solo timed matching board with flip state persistence.
- Draw stores pixel matrix plus cursor and selected color.

Exit criteria:

- All 7 games are actually playable
- No placeholder-only game entry remains in the hub

## Phase 5: User Features
Objective: satisfy all client-side functional requirements.

Tasks:

- Profile management
  - view profile
  - edit username, bio, avatar
  - show personal stats
- User search
  - keyword search
  - result cards
  - pagination
- Friends
  - send request
  - accept/reject
  - remove friend
  - paginated friend list
- Messages
  - conversation list
  - send and read messages
  - pagination
- Achievements
  - unlock conditions based on wins, sessions, reviews, social actions
  - achievement listing and user progress
- Rankings
  - by game
  - global
  - friends
  - personal
  - pagination
- Reviews
  - rating and comment per game

Exit criteria:

- Every listed user feature exists in UI and API
- Ranking filters are complete and demoable
- Pagination exists for friends, messages, and ranking

## Phase 6: Admin Features
Objective: satisfy all admin deductions with a clear admin workflow.

Tasks:

- Admin dashboard
  - total users
  - active users
  - total sessions
  - hottest game
  - average rating
- User management
  - list/search/filter users
  - promote/demote role if desired
  - enable/disable account
- Game management
  - enable/disable game
  - change board size
  - change default timer
  - change availability
- Statistics page
  - game popularity
  - account growth
  - play count
  - review distribution

Exit criteria:

- Admin pages are not stubs
- Admin can manage users and games from UI
- Dashboard shows at least 2 real statistics

## Phase 7: API Docs, HTTPS, API Key
Objective: remove backend rubric deductions.

Tasks:

- Integrate Swagger UI or Redoc.
- Generate docs from route schema or OpenAPI file.
- Protect `/api-docs` using:
  - valid admin JWT
  - valid `x-api-key`
- Add API key middleware to selected admin-sensitive routes if required by instructor expectation.
- Deploy frontend and backend to HTTPS environments.
- Ensure backend CORS and env config support deployed origins.

Exit criteria:

- `/api-docs` exists
- Unauthenticated access is denied
- Hosted demo is accessible via HTTPS

## Phase 8: QA, Demo Readiness, and Git Hygiene
Objective: reduce final submission risk.

Tasks:

- Write smoke tests for auth, profile, friends, messages, rankings, admin, and key game save/load flows.
- Manual test every rubric item and record proof.
- Use meaningful git commits by feature.
- Prepare demo script:
  - login as user
  - play multiple games
  - save/load
  - rate a game
  - send friend request and message
  - open rankings
  - switch to admin and manage users/games
  - open API docs

Exit criteria:

- The team can demo all rubric items in one pass
- No feature depends on hidden manual DB edits

## Suggested Workstreams
If the team has at least 3 members, split work in parallel:

### Workstream A: Game Engine and Matrix UI
- game hooks
- matrix rendering states
- timer and save/load
- help overlays

### Workstream B: Backend and Data
- migrations
- seeds
- controllers/services/repositories
- ranking and admin APIs
- API docs

### Workstream C: Social and Admin UI
- profile
- search
- friends
- messages
- achievements
- admin pages

## High-Risk Areas
- 7 complete games is the largest schedule risk.
- Meaningful demo data is often left too late and causes major deductions.
- Pagination is easy to forget and has a large penalty.
- API docs and API key are easy to miss because they are backend-only requirements.
- HTTPS cannot be faked locally; deployment must be scheduled before the last day.

## Minimum Milestone Order
Build in this order if time is limited:

1. Finish DB schema and seeds
2. Finish remaining games
3. Finish rankings, reviews, save/load standardization
4. Finish user social features
5. Finish admin pages
6. Finish API docs, API key, deploy to HTTPS
7. Polish UI and demo flow

## Definition of Done
The project is submission-ready only when all of the following are true:

- 7 required games are playable and save/load correctly
- All user features exist and are accessible from the client UI
- All admin features exist and are accessible from the admin UI
- Rankings support game, global, friends, and personal scopes
- Pagination exists on friends, rankings, and messages
- Rating and comment work
- Migrations and seeds create a full demo dataset
- API docs exist and require authentication
- Hosted frontend and backend use HTTPS
- `.env` handling is documented and reasonable for both frontend and backend
- Git history shows meaningful progress

## Bonus Targets
- Keep the retro console theme consistent for theme bonus.
- Deploy a live demo with meaningful data for hosting bonus.
- Add multiple AI levels for Caro for bonus.
- Add guided in-app tutorials on the matrix for bonus.
