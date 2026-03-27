# Rubric Checklist

Use this file as the pre-submission gate. Do not submit until every item below is checked and demoable from seeded data.

## General Data and Delivery
- [x] At least 5 users exist with meaningful data
- [ ] At least 3 meaningful records exist for each user feature and admin feature
- [ ] Migrations run from a clean database
- [ ] Seeds populate demo-ready data
- [x] Backend is Express.js
- [x] Backend is separated from frontend and exposes RESTful APIs
- [x] Frontend is React SPA
- [x] Frontend and backend env configuration is documented and used
- [ ] Git history uses meaningful commits

## Frontend: Authentication and Roles
- [x] Login works
- [x] Register works with input validation
- [x] Password reset works
- [x] At least 2 roles exist: user and admin
- [x] Protected routes block unauthorized users
- [x] Client and Admin UIs are clearly different

## Frontend: Main Layout
- [ ] Main client UI includes board, controls, player info, navbar, and footer
- [x] Browser navigation works with real routes and URL changes
- [x] Dark mode and light mode both work
- [x] Layout is aligned and visually consistent
- [x] Typography is consistent and semantically appropriate

## Frontend: Board and Controls
- [x] The matrix board is interactive
- [x] Left behaves consistently
- [x] Right behaves consistently
- [x] Enter behaves consistently
- [x] Back behaves consistently
- [x] Hint/Help behaves consistently
- [x] Menu selection is clearly visible on the board itself
- [x] Game state changes are clearly visible on the board itself

## Required Games
- [ ] Caro 5 is playable
- [ ] Caro 4 is playable
- [x] Tic-Tac-Toe is playable
- [ ] Snake is playable
- [ ] Match-3 is playable
- [ ] Memory is playable
- [ ] Free Draw is playable

## Per-Game Completion
Every required game must satisfy all items below:

- [ ] Board rendering on matrix
- [ ] 5-button control flow is reasonable
- [ ] Score or result display exists
- [ ] Timer exists where appropriate
- [ ] Timer can be changed where required
- [ ] Save works
- [ ] Load works
- [ ] Hint/help exists
- [ ] Computer or valid solo mode works as required

## User Features
- [x] Profile management exists
- [x] User search exists
- [x] Friend management exists
- [x] Messaging exists without requiring real-time transport
- [x] Achievements exist
- [ ] Rankings exist
- [ ] Rankings can filter by game
- [ ] Rankings can filter by global scope
- [ ] Rankings can filter by friends scope
- [ ] Rankings can filter by personal scope
- [x] Friends list has pagination
- [ ] Rankings have pagination
- [x] Messages have pagination
- [ ] Game rating exists
- [ ] Game comment exists

## Admin Features
- [x] Admin dashboard exists
- [ ] User management exists
- [ ] Statistics include at least 2 real criteria
- [ ] Game management exists
- [ ] Admin can enable/disable games
- [ ] Admin can update board size
- [ ] Admin can update timer or config

## Backend Quality
- [x] Knex is used
- [ ] Supabase is used as the database
- [ ] MVC structure is clear and defensible
- [ ] API docs page exists
- [ ] API docs require authentication
- [ ] HTTPS is used in deployment
- [ ] API key is configured and used where required

## Seeded Demo Scenarios
- [x] Seeded users have profile data
- [ ] Seeded users have rankings/stats
- [x] Seeded users have friend relationships
- [x] Seeded users have pending friend requests
- [x] Seeded users have messages
- [x] Seeded users have achievements
- [ ] Seeded users have saved games
- [ ] Seeded users have ratings/comments
- [ ] Seeded admin account can show admin dashboard meaningfully
- [ ] Seeded games have config data

## Final Demo Flow
- [x] User can log in and navigate the client app
- [ ] User can play several games
- [x] User can save and load game state
- [x] User can read help for games
- [ ] User can rate and comment on a game
- [x] User can search another user
- [x] User can send a friend request
- [x] User can send a message
- [ ] User can view rankings in all scopes
- [ ] Admin can log in and manage users
- [ ] Admin can view statistics
- [ ] Admin can manage game configuration
- [ ] Admin can open protected API docs

## Bonus Opportunities
- [x] Theme has a strong and coherent visual identity
- [ ] App is deployed with live data
- [ ] Caro supports multiple AI levels
- [ ] Guided tutorial or scenario-based help exists
