# Member 4 Deployment Notes

## Backend env
- `PORT`
- `DATABASE_URL`
- `NODE_ENV`
- `JWT_SECRET`
- `API_KEY`
- `APP_ORIGIN`
- `EMAIL_USER`
- `EMAIL_PASS`

## Frontend env
- `VITE_API_BASE_URL`
- `VITE_ADMIN_API_KEY`

## Deployment checklist
1. Run backend migrations so `users.is_active` exists.
2. Seed the database if the demo environment needs starter data.
3. Set the same admin API key on backend `API_KEY` and frontend `VITE_ADMIN_API_KEY`.
4. Point `VITE_API_BASE_URL` to the HTTPS backend origin.
5. Verify `/api/admin/dashboard` works with an admin login.
6. Verify `/api-docs` rejects requests without both admin JWT and `x-api-key`.
7. Open the admin API docs page in the frontend and confirm the embedded docs load.

## HTTPS reminder
- Frontend and backend must both be hosted on HTTPS to satisfy the delivery plan.
- If frontend and backend are on separate hosts, update backend CORS and `APP_ORIGIN` accordingly.
