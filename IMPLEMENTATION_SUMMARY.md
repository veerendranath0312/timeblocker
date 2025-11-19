# Authentication & Backend Integration - Implementation Summary

## ✅ Completed Tasks

### 1. **Removed Firebase**
- Deleted all Firebase-related files (`firebaseAdmin.ts`, `firebaseSession.ts`, `firebaseUser.ts`)
- Removed Firebase dependencies from `package.json`
- Updated all imports and references

### 2. **Implemented JWT Authentication**
- Created JWT utilities (`utils/jwt.ts`)
- Implemented password hashing with bcrypt (`utils/password.ts`)
- Created authentication middleware (`middleware/auth.middleware.ts`)
- JWT tokens stored in HTTP-only cookies and localStorage

### 3. **Implemented OAuth (Google & GitHub)**
- Set up Passport.js with Google OAuth20 and GitHub OAuth2 strategies
- OAuth callbacks redirect to frontend after successful authentication
- Users can link multiple OAuth providers to the same account

### 4. **Database Schema (Drizzle ORM)**
- Created complete schema for:
  - `users` - User accounts with email/password and OAuth IDs
  - `tasks` - User tasks organized by date
  - `notes` - User notes (markdown) organized by date
  - `daily_metrics` - Daily metrics (shutdown complete, deep hours)
  - `events` - Time-blocking events with plan/resource association
  - `replan_history` - History of replan actions

### 5. **Backend APIs**
All APIs are protected with authentication middleware:

**Auth APIs:**
- `POST /api/auth/signup` - Sign up with name, email, password
- `POST /api/auth/login` - Login with email, password
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - Google OAuth callback
- `GET /api/auth/github` - Initiate GitHub OAuth
- `GET /api/auth/github/callback` - GitHub OAuth callback

**Data APIs:**
- `GET /api/tasks?date=YYYY-MM-DD` - Get tasks for date
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

- `GET /api/notes?date=YYYY-MM-DD` - Get note for date
- `POST /api/notes` - Create/update note

- `GET /api/metrics?date=YYYY-MM-DD` - Get metrics for date
- `POST /api/metrics` - Create/update metrics

- `GET /api/events?date=YYYY-MM-DD` - Get events for date
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### 6. **Frontend Integration**
- Created `lib/api.js` - Centralized API client
- Created `store/useAuthStore.js` - Authentication state management
- Updated `store/useDateStore.js` - Synced with backend APIs
- Updated `AuthPage.jsx` - Integrated signup/login/OAuth
- Updated `HomePage.jsx` - Added logout, protected route
- Created `ProtectedRoute.jsx` - Route protection component

## 🔧 Configuration Required

### Backend Environment Variables

Create/update `.env` file in `server/` directory:

```env
# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# OAuth - Google
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# OAuth - GitHub
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_CALLBACK_URL=http://localhost:3000/api/auth/github/callback

# Frontend URL (for CORS and redirects)
FRONTEND_URL=http://localhost:5173

# Database
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=timeblocker
```

### Frontend Environment Variables

Create/update `.env` file in `client/` directory:

```env
VITE_API_URL=http://localhost:3000/api
```

### OAuth Setup

#### Google OAuth:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/google/callback`
6. Copy Client ID and Client Secret to `.env`

#### GitHub OAuth:
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL: `http://localhost:3000/api/auth/github/callback`
4. Copy Client ID and Client Secret to `.env`

### Database Setup

1. **Install dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Generate and run migrations:**
   ```bash
   npm run db:generate
   npm run db:push
   ```

   Or use the existing `initDB.ts` script (you may need to update it to use Drizzle).

## 🚀 Running the Application

### Backend:
```bash
cd server
npm install
npm run build
npm start
```

### Frontend:
```bash
cd client
npm install  # or yarn install
npm run dev  # or yarn dev
```

## 📝 Important Notes

1. **Token Storage**: JWT tokens are stored in both HTTP-only cookies (for security) and localStorage (for frontend access). The API client automatically includes the token in requests.

2. **CORS**: The backend is configured to accept requests from `FRONTEND_URL`. Make sure this matches your frontend URL.

3. **Database**: The schema uses Drizzle ORM. Make sure to run migrations before starting the server.

4. **OAuth Redirects**: After OAuth authentication, users are redirected to `/home`. Make sure your OAuth app redirect URIs match the backend callback URLs.

5. **Protected Routes**: The `/home` route is protected. Unauthenticated users are redirected to `/auth`.

6. **Data Sync**: The Zustand store now syncs with the backend. All create/update/delete operations are persisted to the database.

## 🔒 Security Features

- Passwords are hashed with bcrypt (10 salt rounds)
- JWT tokens with expiration
- HTTP-only cookies for token storage
- CORS protection
- Authentication middleware on all protected routes
- User data isolation (users can only access their own data)

## 🐛 Troubleshooting

1. **"Invalid or expired token"**: Check JWT_SECRET is set correctly
2. **OAuth not working**: Verify OAuth credentials and callback URLs
3. **Database connection errors**: Check database credentials and ensure PostgreSQL is running
4. **CORS errors**: Verify FRONTEND_URL matches your frontend URL

## 📚 Next Steps

1. Set up environment variables
2. Configure OAuth apps (Google & GitHub)
3. Run database migrations
4. Test authentication flows
5. Test data persistence (tasks, notes, metrics, events)

