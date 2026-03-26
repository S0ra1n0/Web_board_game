# Rubric Checklist

Use this file as the pre-submission gate. Do not submit until every item below is checked and demoable from seeded data.

## General Data and Delivery
- [ ] At least 5 users exist with meaningful data
- [ ] At least 3 meaningful records exist for each user feature and admin feature
- [ ] Migrations run from a clean database
- [ ] Seeds populate demo-ready data
- [ ] Backend is Express.js
- [ ] Backend is separated from frontend and exposes RESTful APIs
- [ ] Frontend is React SPA
- [ ] Frontend and backend env configuration is documented and used
- [ ] Git history uses meaningful commits

## Frontend: Authentication and Roles
- [ ] Login works
- [ ] Register works with input validation
- [ ] Password reset works
- [ ] At least 2 roles exist: user and admin
- [ ] Protected routes block unauthorized users
- [ ] Client and Admin UIs are clearly different

## Frontend: Main Layout
- [ ] Main client UI includes board, controls, player info, navbar, and footer
- [ ] Browser navigation works with real routes and URL changes
- [ ] Dark mode and light mode both work
- [ ] Layout is aligned and visually consistent
- [ ] Typography is consistent and semantically appropriate

## Frontend: Board and Controls
- [ ] The matrix board is interactive
- [ ] Left behaves consistently
- [ ] Right behaves consistently
- [ ] Enter behaves consistently
- [ ] Back behaves consistently
- [ ] Hint/Help behaves consistently
- [ ] Menu selection is clearly visible on the board itself
- [ ] Game state changes are clearly visible on the board itself

## Required Games
- [ ] Caro 5 is playable
- [ ] Caro 4 is playable
- [ ] Tic-Tac-Toe is playable
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
- [ ] Profile management exists
- [ ] User search exists
- [ ] Friend management exists
- [ ] Messaging exists without requiring real-time transport
- [ ] Achievements exist
- [ ] Rankings exist
- [ ] Rankings can filter by game
- [ ] Rankings can filter by global scope
- [ ] Rankings can filter by friends scope
- [ ] Rankings can filter by personal scope
- [ ] Friends list has pagination
- [ ] Rankings have pagination
- [ ] Messages have pagination
- [ ] Game rating exists
- [ ] Game comment exists

## Admin Features
- [ ] Admin dashboard exists
- [ ] User management exists
- [ ] Statistics include at least 2 real criteria
- [ ] Game management exists
- [ ] Admin can enable/disable games
- [ ] Admin can update board size
- [ ] Admin can update timer or config

## Backend Quality
- [ ] Knex is used
- [ ] Supabase is used as the database
- [ ] MVC structure is clear and defensible
- [ ] API docs page exists
- [ ] API docs require authentication
- [ ] HTTPS is used in deployment
- [ ] API key is configured and used where required

## Seeded Demo Scenarios
- [ ] Seeded users have profile data
- [ ] Seeded users have rankings/stats
- [ ] Seeded users have friend relationships
- [ ] Seeded users have pending friend requests
- [ ] Seeded users have messages
- [ ] Seeded users have achievements
- [ ] Seeded users have saved games
- [ ] Seeded users have ratings/comments
- [ ] Seeded admin account can show admin dashboard meaningfully
- [ ] Seeded games have config data

## Final Demo Flow
- [ ] User can log in and navigate the client app
- [ ] User can play several games
- [ ] User can save and load game state
- [ ] User can read help for games
- [ ] User can rate and comment on a game
- [ ] User can search another user
- [ ] User can send a friend request
- [ ] User can send a message
- [ ] User can view rankings in all scopes
- [ ] Admin can log in and manage users
- [ ] Admin can view statistics
- [ ] Admin can manage game configuration
- [ ] Admin can open protected API docs

## Bonus Opportunities
- [ ] Theme has a strong and coherent visual identity
- [ ] App is deployed with live data
- [ ] Caro supports multiple AI levels
- [ ] Guided tutorial or scenario-based help exists
