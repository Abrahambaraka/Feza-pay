# Fix: 500 Error on /api/auth/signup

## Problem
The signup endpoint is failing with a 500 error because the PostgreSQL database connection is not configured in Vercel.

**Error Message:**
```
VercelPostgresError - 'missing_connection_string': You did not supply a `connectionString` and no `POSTGRES_URL_NON_POOLING` env var was found.
```

## Root Cause
The `@vercel/postgres` package requires one of these environment variables to be set:
- `POSTGRES_URL_NON_POOLING` (recommended for serverless)
- `POSTGRES_URL` (for pooled connections)
- `DATABASE_URL` (generic fallback)

## Solution

### Option 1: Set Up Vercel Postgres (Recommended)

1. **Go to your Vercel project dashboard**
   - Visit https://vercel.com/dashboard
   - Select your project (fezapay)

2. **Create a Postgres database**
   - Click on the **Storage** tab
   - Click **Create Database**
   - Select **Postgres**
   - Choose a name for your database (e.g., `fezapay-db`)
   - Select a region close to your users
   - Click **Create**

3. **Connect to your project**
   - Vercel will automatically add these environment variables:
     - `POSTGRES_URL`
     - `POSTGRES_URL_NON_POOLING`
     - `POSTGRES_PRISMA_URL`
     - `POSTGRES_URL_NO_SSL`
     - `POSTGRES_USER`
     - `POSTGRES_HOST`
     - `POSTGRES_PASSWORD`
     - `POSTGRES_DATABASE`

4. **Redeploy your application**
   - Go to **Deployments** tab
   - Click on the latest deployment
   - Click **Redeploy**

### Option 2: Use External PostgreSQL Database

If you have an existing PostgreSQL database (e.g., from Supabase, Railway, Neon, etc.):

1. **Get your connection string**
   - Format: `postgres://username:password@host:port/database?sslmode=require`

2. **Add to Vercel environment variables**
   - Go to your project → **Settings** → **Environment Variables**
   - Add a new variable:
     - **Name:** `POSTGRES_URL_NON_POOLING`
     - **Value:** Your connection string
     - **Environment:** Production, Preview, Development (select all)
   - Click **Save**

3. **Redeploy**
   - Trigger a new deployment for changes to take effect

### Option 3: Local Development

For local testing, create a `.env` file in the `backend` directory:

```env
# Database
POSTGRES_URL_NON_POOLING=postgres://username:password@localhost:5432/fezapay

# Other required variables
JWT_SECRET=your-super-secret-jwt-key-change-this
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
FRONTEND_URL=http://localhost:5173

# Payment providers
CINETPAY_API_KEY=your-cinetpay-api-key
CINETPAY_SITE_ID=your-cinetpay-site-id
BITNOB_API_KEY=your-bitnob-api-key
```

## Code Changes Made

I've updated the code to provide better error messages:

1. **`database.service.ts`**: Added validation to check for database configuration before attempting to create a user
2. **`auth.controller.ts`**: Enhanced error handling to return a 503 status with a clear message when the database is not configured

## Verification Steps

After setting up the database:

1. **Check environment variables**
   ```bash
   # In Vercel dashboard → Settings → Environment Variables
   # Verify POSTGRES_URL_NON_POOLING or POSTGRES_URL exists
   ```

2. **Test the signup endpoint**
   - Try creating a new account
   - The error should be resolved

3. **Check database tables**
   - The tables should be automatically created on first use
   - Tables: `users`, `user_cards`, `user_transactions`, `kyc_verifications`

## Next Steps

1. Set up the database using one of the options above
2. Redeploy your application
3. Test the signup functionality
4. If issues persist, check the Vercel function logs for more details

## Additional Resources

- [Vercel Postgres Documentation](https://vercel.com/docs/storage/vercel-postgres)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
