# Frontend-Backend Integration Guide

## ✅ Completed

The frontend has been successfully configured to connect to the FastAPI backend:

1. **API Client Updated** (`src/api/client.ts`)
   - Disabled mock data (`USE_MOCK_DATA = false`)
   - Configured to use `http://localhost:8000`
   - OAuth2 password flow for login
   - Added `getCurrentUser()` method

2. **Authentication Flow**
   - Login sends form data to `/auth/login`
   - Fetches user data from `/auth/me`
   - Stores JWT token in localStorage
   - Adds Bearer token to all requests

3. **TypeScript Configuration**
   - Created `vite-env.d.ts` for environment variables
   - Fixed all TypeScript errors

## 🚀 How to Run

### 1. Start Backend

```bash
cd smart-home-be

# Install dependencies (if not done)
pip install -r requirements.txt

# Start FastAPI server
python -m app.main
```

Backend will run on: **http://localhost:8000**

### 2. Start Frontend

```bash
cd smart-home-fe

# Already installed dependencies
npm run dev
```

Frontend will run on: **http://localhost:5173**

## 📝 Testing the Integration

### 1. Register a User

```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123"
  }'
```

### 2. Login via Frontend

1. Visit http://localhost:5173
2. Enter credentials:
   - Email: `test@example.com`
   - Password: `password123`
3. Click "Sign In"

### 3. Expected Flow

1. Frontend sends login request to `/auth/login`
2. Backend returns JWT token
3. Frontend fetches user data from `/auth/me`
4. User is redirected to dashboard
5. Dashboard loads (currently empty - no rooms yet)

## 🔧 API Endpoints Used

| Frontend Call | Backend Endpoint | Method |
|--------------|------------------|--------|
| `api.login()` | `/auth/login` | POST |
| `api.getCurrentUser()` | `/auth/me` | GET |
| `api.getHomes()` | `/homes` | GET |
| `api.getRooms()` | `/rooms` | GET |
| `api.turnLightOn()` | `/rooms/{id}/light/on` | POST |
| `api.turnLightOff()` | `/rooms/{id}/light/off` | POST |

## 📊 Current Status

### ✅ Working
- API client configuration
- OAuth2 authentication flow
- JWT token management
- TypeScript types

### ⚠️ Needs Backend Setup
- Backend dependencies installation
- Database setup (PostgreSQL)
- Create test data (homes, rooms, devices)

## 🎯 Next Steps

### 1. Setup Backend Database

```bash
cd smart-home-be

# Start PostgreSQL (via Docker)
docker-compose up -d postgres

# Run migrations (if using Alembic)
alembic upgrade head
```

### 2. Create Test Data

Use the backend API to create:
1. Register user
2. Create home
3. Create rooms
4. Link devices

### 3. Test Full Flow

1. Login via frontend
2. See homes and rooms
3. Toggle light switches
4. View room details

## 🐛 Troubleshooting

### CORS Errors

If you see CORS errors, ensure backend has:

```python
# app/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 401 Unauthorized

- Check JWT token is being sent
- Verify token hasn't expired
- Check backend SECRET_KEY matches

### Connection Refused

- Ensure backend is running on port 8000
- Check `VITE_API_URL` environment variable
- Verify no firewall blocking

## 📝 Environment Variables

### Frontend (.env)

```
VITE_API_URL=http://localhost:8000
```

### Backend (.env)

```
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/smart_home
SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## ✨ Summary

The frontend is **ready to connect** to the backend. Once the backend is running with test data, the full application will work end-to-end!
