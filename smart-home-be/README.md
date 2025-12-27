# Smart Home API - Complete Backend

A production-ready FastAPI backend for Smart Home IoT platform with ThingsBoard integration and complete CRUD operations.

## 🎯 Features

- ✅ **Complete CRUD** for Users, Homes, Rooms, and Devices
- ✅ **JWT Authentication** with secure password hashing
- ✅ **Authorization** with ownership verification
- ✅ **ThingsBoard Integration** for IoT device management
- ✅ **Async PostgreSQL** with SQLAlchemy 2.0
- ✅ **Clean Architecture** (Repository → Service → Router)
- ✅ **Type-Safe** with Pydantic validation
- ✅ **Production-Ready** error handling

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Environment

Create `.env` file:

```bash
# Database
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/smart_home

# JWT
SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=30

# ThingsBoard
THINGSBOARD_URL=http://localhost:8080
THINGSBOARD_USERNAME=tenant@thingsboard.org
THINGSBOARD_PASSWORD=tenant
```

### 3. Start Services

```bash
# Start PostgreSQL, Kafka, ThingsBoard
docker-compose up -d
```

### 4. Run Application

```bash
python -m app.main
```

Visit: **http://localhost:8000/docs**

## 📚 API Documentation

### Authentication

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/register` | POST | Register new user |
| `/auth/login` | POST | Login (get JWT token) |
| `/auth/me` | GET | Get current user |

### Users

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/users/me` | GET | Get my profile |
| `/users/me` | PUT | Update my profile |
| `/users/me` | DELETE | Delete my account |

### Homes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/homes` | POST | Create home |
| `/homes` | GET | List my homes |
| `/homes/{id}` | GET | Get home |
| `/homes/{id}` | PUT | Update home |
| `/homes/{id}` | DELETE | Delete home |

### Rooms

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/homes/{home_id}/rooms` | POST | Create room |
| `/homes/{home_id}/rooms` | GET | List rooms |
| `/rooms/{id}` | GET | Get room |
| `/rooms/{id}` | PUT | Update room |
| `/rooms/{id}` | DELETE | Delete room |

### Devices

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/rooms/{room_id}/device` | POST | Link device |
| `/rooms/{room_id}/device` | GET | Get device |
| `/devices/{id}` | GET | Get device |
| `/devices/{id}` | PUT | Update device |
| `/devices/{id}` | DELETE | Unlink device |

## 🔐 Authentication Flow

### 1. Register

```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "john",
    "password": "password123"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=user@example.com&password=password123"
```

### 3. Use Token

```bash
curl -X GET http://localhost:8000/users/me \
  -H "Authorization: Bearer <your-token>"
```

## 🏗️ Architecture

```
Client Request
    ↓
API Router (FastAPI)
    ↓
Service Layer (Business Logic)
    ↓
Repository Layer (Data Access)
    ↓
Database (PostgreSQL)
```

### Project Structure

```
app/
├── core/                  # Configuration & security
├── models/                # SQLAlchemy models
├── schemas/               # Pydantic schemas
├── repositories/          # Data access layer
├── services/              # Business logic layer
├── routers/               # API endpoints
├── integrations/          # ThingsBoard service
├── dependencies.py        # FastAPI dependencies
└── main.py               # Application entry
```

## 🔒 Security

- **Password Hashing**: Bcrypt with salt
- **JWT Tokens**: Secure authentication
- **Ownership Verification**: Every endpoint checks authorization
- **Input Validation**: Pydantic schemas
- **SQL Injection Protection**: Parameterized queries

## 🛠️ Tech Stack

- **FastAPI** - Modern async web framework
- **SQLAlchemy 2.0** - Async ORM
- **PostgreSQL** - Database
- **Pydantic** - Data validation
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **ThingsBoard** - IoT platform
- **httpx** - Async HTTP client

## 📊 Database Schema

```
User (1) ──owns──> (N) Home
Home (1) ──has──> (N) Room
Room (1) ──has──> (1) Device
Device.device_id → ThingsBoard UUID
```

## 🧪 Testing

### Swagger UI

1. Visit http://localhost:8000/docs
2. Register via `/auth/register`
3. Login via `/auth/login`
4. Click "Authorize" and enter: `Bearer <token>`
5. Test all endpoints!

### Example Workflow

```bash
# 1. Register
POST /auth/register

# 2. Login
POST /auth/login

# 3. Create home
POST /homes

# 4. Create room
POST /homes/1/rooms

# 5. Link device
POST /rooms/1/device
```

## 📖 Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Walkthrough**: See [walkthrough.md](C:\Users\Jasso\.gemini\antigravity\brain\db49d632-ef8d-4f7f-a5b0-6d6688c5a10b\walkthrough.md)

## 🎯 Next Steps

1. Run database migrations with Alembic
2. Add telemetry proxy endpoints
3. Add light control endpoints
4. Implement WebSocket for real-time updates
5. Add comprehensive tests

## 📝 License

Smart Home IoT Project
