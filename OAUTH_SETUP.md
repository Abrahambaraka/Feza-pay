# Backend .env Configuration

Add these variables to your `backend/.env` file:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=https://your-app.vercel.app/api/auth/google/callback

# JWT
JWT_SECRET=generate_a_secure_random_string_here
JWT_EXPIRES_IN=7d

# Frontend URL
FRONTEND_URL=https://your-app.vercel.app

# Vercel Postgres is automatically configured by Vercel
```

# Frontend .env Configuration

Create a `.env` file in the project root:

```env
VITE_API_URL=https://your-backend.vercel.app
```

# Vercel Deployment Setup

1. **Deploy Backend:**
   - Push backend code to a separate Git repo or monorepo
   - Connect to Vercel
   - Add environment variables in Vercel dashboard
   - Ensure Vercel Postgres is connected

2. **Deploy Frontend:**
   - Push frontend code to Git
   - Connect to Vercel
   - Add `VITE_API_URL` environment variable

3. **Initialize Database:**
   - After first deployment, call `/health` endpoint
   - Database tables will be created automatically on first connection

# Testing Locally

1. Start backend:
   ```bash
   cd backend
   npm run dev
   ```

2. Start frontend:
   ```bash
   npm run dev
   ```

3. Navigate to http://localhost:5173
