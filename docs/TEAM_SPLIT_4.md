# Team Split for 4 Members (Low-Dependency Version)

This version minimizes blocking by splitting work into vertical slices with disjoint write scopes.

Important constraint: a full-stack project can never be truly dependency-free. The goal is to reduce dependency to:

- one-time contract freezing in week 1
- no shared ownership of the same files
- each member can implement their own DB + API + UI slice

## Core Rule

Each member owns a feature slice end-to-end:

- migrations for that slice
- backend routes/controllers/services for that slice
- frontend pages/components for that slice
- seed data for that slice

Only 3 shared areas must be frozen early:

1. route naming
2. common response format
3. game metadata format

After that, members should avoid touching each other's files.

## Shared Files With Single Owner

To avoid merge conflicts, assign one owner for each shared area:

- `frontend/src/App.jsx`: Member 1
- `frontend/src/styles/index.css`: Member 1
- `src/app.js`: Member 3
- `src/routes/index` pattern or route mounting: Member 3
- `src/db/migrations/`: each member creates only their own migration files
- `src/db/seeds/`: each member creates separate seed files with numeric prefixes

## Member 1: Auth, Layout, Profile, and User Search

### Counted as already done
- `frontend/src/context/AuthContext.jsx`
- `frontend/src/pages/LoginPage.jsx`
- `frontend/src/pages/RegisterPage.jsx`
- `frontend/src/pages/ResetPasswordPage.jsx`
- `frontend/src/pages/VerifyRegisterPage.jsx`
- `frontend/src/pages/VerifyResetPage.jsx`
- route guard foundation in `frontend/src/App.jsx`
- theme foundation in `frontend/src/styles/index.css`
- auth backend foundation in `src/controllers/authController.js`
- auth routes in `src/routes/authRoutes.js`

### Own from now on
- public auth flow cleanup
- env cleanup for frontend auth URLs
- client and admin top-level layout shells
- profile management
- user search
- top-level routing and navigation
- reusable frontend API client

### Write scope

Frontend:
- `frontend/src/App.jsx`
- `frontend/src/layouts/`
- `frontend/src/pages/auth/` or existing auth pages
- `frontend/src/pages/client/ProfilePage.jsx`
- `frontend/src/pages/client/UsersPage.jsx`
- `frontend/src/components/layout/`
- `frontend/src/services/http.js`
- `frontend/src/services/authService.js`
- `frontend/src/services/profileService.js`
- `frontend/src/services/userService.js`
- `frontend/src/styles/index.css`

Backend:
- `src/controllers/authController.js`
- `src/controllers/profileController.js`
- `src/controllers/userSearchController.js`
- `src/routes/authRoutes.js`
- `src/routes/profileRoutes.js`
- `src/routes/userSearchRoutes.js`
- `src/services/profileService.js`
- `src/services/userSearchService.js`

DB and seeds:
- profile-related migrations
- profile and user-search demo seeds

### Deliverables
- auth stable and deploy-safe
- clear client/admin shell
- profile page works
- user search works

## Member 2: Social Features Slice

### Counted as already done
- social sidebar foundation in `frontend/src/components/hub/SocialSidebar.jsx`

### Own from now on
- friends system
- friend requests
- messaging
- achievements
- pagination for friends and messages
- social seed data

### Write scope

Frontend:
- `frontend/src/pages/client/FriendsPage.jsx`
- `frontend/src/pages/client/MessagesPage.jsx`
- `frontend/src/pages/client/AchievementsPage.jsx`
- `frontend/src/components/social/`
- `frontend/src/services/friendService.js`
- `frontend/src/services/messageService.js`
- `frontend/src/services/achievementService.js`

Backend:
- `src/controllers/friendController.js`
- `src/controllers/messageController.js`
- `src/controllers/achievementController.js`
- `src/routes/friendRoutes.js`
- `src/routes/messageRoutes.js`
- `src/routes/achievementRoutes.js`
- `src/services/friendService.js`
- `src/services/messageService.js`
- `src/services/achievementService.js`

DB and seeds:
- `friend_requests`
- `friendships`
- `messages`
- `achievements`
- `user_achievements`
- social demo seeds

### Deliverables
- send and accept friend requests
- paginated friend list
- non-realtime messages
- achievements with seeded examples

## Member 3: Game Platform Slice

### Counted as already done
- `frontend/src/components/hub/GameMatrix.jsx`
- `frontend/src/components/hub/GameControls.jsx`
- `frontend/src/utils/pixelArt.js`
- `frontend/src/hooks/useTicTacToe.jsx`
- `frontend/src/pages/UserHome.jsx`
- `src/controllers/userController.js` game/save/ranking foundation
- `src/routes/userRoutes.js`
- existing game-related migrations and seeds

### Own from now on
- standardize the 5-button contract
- refactor hub into reusable game platform
- game metadata registry
- save/load standardization
- timer configuration model
- ranking and review foundations
- game APIs and session tracking

### Write scope

Frontend:
- `frontend/src/pages/client/HubPage.jsx`
- `frontend/src/pages/client/GamePage.jsx`
- `frontend/src/components/game/`
- `frontend/src/hooks/games/engine/`
- `frontend/src/hooks/games/shared/`
- `frontend/src/services/gameService.js`
- `frontend/src/services/rankingService.js`
- `frontend/src/services/reviewService.js`

Backend:
- `src/controllers/gameController.js`
- `src/controllers/rankingController.js`
- `src/controllers/reviewController.js`
- `src/routes/gameRoutes.js`
- `src/routes/rankingRoutes.js`
- `src/routes/reviewRoutes.js`
- `src/services/gameService.js`
- `src/services/rankingService.js`
- `src/services/reviewService.js`

DB and seeds:
- `games`
- `game_sessions`
- `saved_games`
- `user_stats`
- `game_reviews` or expanded `ratings`
- `game_configs`
- ranking/review/session seeds

### Deliverables
- unified game platform contract
- save/load works consistently for all games
- ranking API works
- rating/comment API works
- review and ranking data are seed-ready

## Member 4: Concrete Game Implementations + Admin + Docs/Deploy

### Counted as already done
- admin page stub in `frontend/src/pages/AdminHome.jsx`
- admin route stub in `src/routes/adminRoutes.js`

### Own from now on
- all 7 required games implementation on top of Member 3's game platform
- admin dashboard
- admin user management
- admin game management
- admin statistics
- API docs
- API key protection
- HTTPS deployment
- QA and final demo script

### Write scope

Frontend:
- `frontend/src/hooks/games/useTicTacToeGame.jsx`
- `frontend/src/hooks/games/useCaro5Game.jsx`
- `frontend/src/hooks/games/useCaro4Game.jsx`
- `frontend/src/hooks/games/useSnakeGame.jsx`
- `frontend/src/hooks/games/useMatch3Game.jsx`
- `frontend/src/hooks/games/useMemoryGame.jsx`
- `frontend/src/hooks/games/useDrawGame.jsx`
- `frontend/src/pages/admin/`
- `frontend/src/layouts/AdminLayout.jsx`

Backend:
- `src/controllers/adminController.js`
- `src/routes/adminRoutes.js`
- `src/services/adminService.js`
- api-docs integration files
- deployment config files

DB and seeds:
- admin-related analytics seeds if needed

### Deliverables
- 7 playable games
- admin pages are complete
- protected api-docs exists
- deployed HTTPS demo exists

## Why This Split Has Less Dependency

The previous split had "frontend waits for backend" and "games wait for shared APIs".

This split reduces that by making each member own a vertical slice:

- Member 1 owns auth/profile/search end-to-end
- Member 2 owns social end-to-end
- Member 3 owns game platform, rankings, reviews end-to-end
- Member 4 owns game implementations and admin/docs/deploy

The only real dependency that remains:

- Member 4 depends on Member 3 for the game platform contract

That dependency is acceptable because it is narrow and can be frozen early.

## Contract Freeze in Week 1

Member 3 must freeze these items in the first 2-3 days:

- `GameMeta`
```ts
{
  id: string,
  title: string,
  enabled: boolean,
  boardSize: number,
  defaultTimerSeconds: number,
  scoreType: 'wins' | 'score' | 'time' | 'none'
}
```

- `GameSaveState`
```ts
{
  gameId: string,
  state: object,
  savedAt: string
}
```

- `RankingQuery`
```ts
{
  gameId: string,
  scope: 'global' | 'friends' | 'me',
  page: number,
  pageSize: number
}
```

- `ApiListResponse`
```ts
{
  items: any[],
  page: number,
  pageSize: number,
  totalItems: number,
  totalPages: number
}
```

Once frozen, other members should code against these contracts and not wait.

## Clean File Boundaries

### Member 1 should not edit
- game hooks
- social routes
- admin files

### Member 2 should not edit
- auth files
- shared app routing
- game platform files owned by Member 3
- admin files

### Member 3 should not edit
- social UI pages
- concrete game hook implementations
- admin frontend pages

### Member 4 should not edit
- auth/profile/search files
- social files
- core route mounting in `src/app.js`
- top-level routing in `frontend/src/App.jsx`

## Recommended Timeline

### Week 1
- Member 1: route/layout shell + profile/search APIs and UI
- Member 2: social schema + social APIs + social page skeleton
- Member 3: game platform contract + ranking/review/save-load refactor
- Member 4: admin skeleton + 2 game prototypes using frozen contract

### Week 2
- Member 1: finish profile/search polish
- Member 2: finish friends/messages/achievements + pagination
- Member 3: complete game APIs, reviews, rankings, seeds
- Member 4: implement remaining games

### Week 3
- Member 1: integration and route polish
- Member 2: social bug fixing and seeded demo data
- Member 3: game data/admin API support
- Member 4: admin dashboard, game management, docs, API key

### Week 4
- Member 1: UX polish
- Member 2: social regression pass
- Member 3: backend regression pass and seed hardening
- Member 4: deploy, HTTPS verification, demo rehearsal

## Minimum Coordination Meetings

Only three short syncs are required:

1. End of day 2: freeze contracts
2. End of week 2: integration check
3. Final week: demo rehearsal

## Best Practical Split

If the team really wants the least blocking possible, use this ownership:

- Member 1: auth + layouts + profile + search
- Member 2: friends + messages + achievements
- Member 3: game platform + ranking + review + save/load + seed backbone
- Member 4: all concrete games + admin + docs + deploy

This is not zero dependency, but it is close to the minimum possible for this project shape.
