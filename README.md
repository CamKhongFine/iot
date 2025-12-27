# IoT Smart Home Project

## Project Overview
This project is a comprehensive IoT Smart Home solution featuring a React frontend, FastAPI backend, and PostgreSQL database, integrated with ThingsBoard for device telemetry.

## Directory Structure
- `smart-home-fe`: Frontend application (React + Vite + MUI)
- `smart-home-be`: Backend application (FastAPI + SQLAlchemy)

## Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- Docker & Docker Compose

---

## 🚀 Getting Started

### 1. Docker Services (Database & ThingsBoard)
Start the core infrastructure services first.

```bash
# Navigate to project root
cd "d:\IOT Project"

# Start services
docker-compose up -d
```
This will start:
- PostgreSQL (Port 5432)
- ThingsBoard (Port 8080)
- PGAdmin (Port 5050 - optional)

### 2. Backend Setup (FastAPI)

```bash
# Navigate to backend directory
cd "d:\IOT Project\smart-home-be"

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows (PowerShell):
.venv\Scripts\Activate.ps1
# Linux/Mac:
# source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python main.py
```
The backend API will be available at `http://localhost:8000`.
API Documentation (Swagger UI): `http://localhost:8000/docs`

### 3. Frontend Setup (React)

```bash
# Navigate to frontend directory
cd "d:\IOT Project\smart-home-fe"

# Install dependencies
npm install

# Run development server
npm run dev
```
The frontend application will be available at `http://localhost:3000`.

## 🔑 Default Credentials

**App Login (Seed Data):**
- Email: `admin@example.com`
- Password: `password123` (or as configured in seed script)

**ThingsBoard:**
- URL: `http://localhost:8080`
- User: `tenant@thingsboard.org`
- Password: `tenant`

## 🛠️ Common Commands

**Backend Migration:**
```bash
alembic upgrade head
```

**Frontend Build:**
```bash
npm run build
```
