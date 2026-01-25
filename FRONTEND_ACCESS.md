# Frontend Access Guide

## ❌ Wrong URL
- `https://garrizon.com/register` - This is the production domain and won't work locally

## ✅ Correct URL
- `http://localhost:5173/register` - This is your local development server

## How to Access

1. **Open your browser** and go to:
   ```
   http://localhost:5173
   ```

2. **Or directly to the register page**:
   ```
   http://localhost:5173/register
   ```

3. **Or directly to the login page**:
   ```
   http://localhost:5173/login
   ```

## Available Routes

- Home: `http://localhost:5173/`
- Products: `http://localhost:5173/products`
- Login: `http://localhost:5173/login`
- Register: `http://localhost:5173/register`
- Cart: `http://localhost:5173/cart` (requires login)
- Checkout: `http://localhost:5173/checkout` (requires login)
- Admin: `http://localhost:5173/admin` (requires admin login)

## Troubleshooting

If you see a 404 error with `garrizon.com`:
1. Make sure you're using `localhost:5173` not `garrizon.com`
2. Clear your browser cache
3. Try in an incognito/private window
4. Check that the frontend container is running: `docker ps | findstr garrizon-frontend`

## Frontend Status

- Frontend container: Running on port 5173
- Backend API: Running on port 8080
- Database: Running on port 3306

The frontend is configured to connect to `http://localhost:8080/api` for backend requests.
