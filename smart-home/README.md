# Smart Home API - ThingsBoard Integration

A FastAPI backend for Smart Home IoT platform with ThingsBoard integration.

## 🏗️ Architecture

```
Frontend → FastAPI Backend → ThingsBoard → ESP32 Devices
```

**Key Features**:
- ✅ ThingsBoard integration with JWT caching
- ✅ Async telemetry retrieval
- ✅ RPC control for devices
- ✅ PostgreSQL with async SQLAlchemy
- ✅ Clean architecture with separation of concerns

## 📁 Project Structure

```
smart-home/
├── app/
│   ├── main.py                          # FastAPI application
│   ├── core/
│   │   ├── config.py                   # Configuration
│   │   └── database.py                 # Database setup
│   ├── integrations/
│   │   └── thingsboard_service.py      # ThingsBoard integration ⭐
│   ├── models/                          # SQLAlchemy models
│   │   ├── user.py
│   │   ├── home.py
│   │   ├── room.py
│   │   └── device.py
│   └── schemas/                         # Pydantic schemas
│       └── thingsboard.py
├── examples/
│   └── thingsboard_example.py          # Usage examples
├── docker-compose.yaml                  # PostgreSQL, Kafka, ThingsBoard
└── requirements.txt
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Environment

Create `.env` file:

```bash
# ThingsBoard
THINGSBOARD_URL=http://localhost:8080
THINGSBOARD_USERNAME=tenant@thingsboard.org
THINGSBOARD_PASSWORD=tenant

# Database
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/smart_home
```

### 3. Start Services

```bash
# Start ThingsBoard, PostgreSQL, Kafka
docker-compose up -d
```

### 4. Run Application

```bash
python -m app.main
```

Visit: http://localhost:8000/docs

## 🔧 ThingsBoard Service

### Authentication

Automatic JWT token management:
- Caches token in memory
- Auto-refreshes before expiration
- Thread-safe with asyncio locks

### Telemetry

```python
from app.integrations.thingsboard_service import get_thingsboard_service

tb_service = get_thingsboard_service()

# Get latest telemetry
data = await tb_service.get_latest_telemetry(device_id)

# Get historical data
history = await tb_service.get_telemetry_history(
    device_id=device_id,
    start_ts=start_timestamp,
    end_ts=end_timestamp
)
```

### RPC Control

```python
# Send light control command
await tb_service.send_light_rpc(device_id, "on")   # Turn on
await tb_service.send_light_rpc(device_id, "off")  # Turn off

# Verify actual state via telemetry
telemetry = await tb_service.get_latest_telemetry(device_id)
actual_state = telemetry["light"][0]["value"]
```

## 📊 Database Models

### Domain Model

```
User (1) ──owns──> (N) Home
Home (1) ──has──> (N) Room  
Room (1) ──has──> (1) Device
Device.device_id → ThingsBoard UUID
```

- **User**: Web application users (NOT ThingsBoard users)
- **Home**: Physical homes owned by users
- **Room**: Rooms within homes
- **Device**: ESP32 devices mapped to ThingsBoard

## 🧪 Testing

Run example usage:

```bash
python examples/thingsboard_example.py
```

## 📚 API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔐 Security

- ThingsBoard credentials in environment variables
- Separate JWT authentication for web users
- Never expose ThingsBoard JWT to frontend
- HTTP timeout and retry limits

## 🛠️ Tech Stack

- **FastAPI** - Modern async web framework
- **SQLAlchemy 2.0** - Async ORM
- **PostgreSQL** - Database
- **httpx** - Async HTTP client
- **Pydantic** - Data validation
- **ThingsBoard** - IoT platform
- **loguru** - Logging

## 📝 Next Steps

1. Implement authentication endpoints (`/auth/login`, `/auth/me`)
2. Add home/room management endpoints
3. Create telemetry proxy endpoints
4. Implement light control endpoints
5. Add WebSocket for real-time updates

## 📖 Documentation

See [walkthrough.md](C:\Users\Jasso\.gemini\antigravity\brain\db49d632-ef8d-4f7f-a5b0-6d6688c5a10b\walkthrough.md) for detailed implementation guide.

## 🤝 Contributing

This is a Smart Home IoT project integrating FastAPI with ThingsBoard platform.
