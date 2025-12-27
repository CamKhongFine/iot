# Database Configuration

## Overview
This project uses a **shared PostgreSQL server** with **separate databases** for different services:

- **ThingsBoard Database**: `thingsboard` (used by ThingsBoard CE)
- **Backend Database**: `smarthome_backend` (used by the Smart Home Backend API)

## PostgreSQL Server Details

- **Host**: `localhost` (from host machine) or `postgres` (from Docker containers)
- **Port**: `5432`
- **User**: `postgres`
- **Password**: `postgres`

## Databases

### 1. ThingsBoard Database
- **Name**: `thingsboard`
- **Purpose**: Used by ThingsBoard CE for IoT device management
- **Connection String**: `jdbc:postgresql://postgres:5432/thingsboard`

### 2. Backend Database
- **Name**: `smarthome_backend`
- **Purpose**: Used by the Smart Home Backend API for application data
- **Connection String**: `postgresql://postgres:postgres@localhost:5432/smarthome_backend`

## How It Works

The `docker-compose.yaml` file configures PostgreSQL with:

1. **Exposed Port**: PostgreSQL is exposed on port `5432:5432` so you can connect from your host machine
2. **Initialization Script**: The `init-db.sql` file is mounted to `/docker-entrypoint-initdb.d/` which automatically runs when the container first starts
3. **Automatic Database Creation**: The init script creates the `smarthome_backend` database if it doesn't exist

## Starting the Services

```bash
cd smart-home-be
docker-compose up -d
```

This will:
- Start PostgreSQL with both databases
- Start Kafka
- Start ThingsBoard CE

## Connecting to PostgreSQL

### From Host Machine (Python/FastAPI Backend)

```python
# Example connection string for SQLAlchemy
DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/smarthome_backend"
```

### From Docker Container

```python
# If your backend runs in Docker, use the service name
DATABASE_URL = "postgresql://postgres:postgres@postgres:5432/smarthome_backend"
```

### Using psql CLI

```bash
# Connect to backend database
docker exec -it <postgres-container-id> psql -U postgres -d smarthome_backend

# Connect to ThingsBoard database
docker exec -it <postgres-container-id> psql -U postgres -d thingsboard
```

## Verifying Database Creation

After starting the services, you can verify both databases exist:

```bash
# List all databases
docker exec -it <postgres-container-id> psql -U postgres -c "\l"
```

You should see both `thingsboard` and `smarthome_backend` in the list.

## Important Notes

- The `init-db.sql` script only runs on **first startup** when the PostgreSQL data volume is empty
- If you need to recreate the databases, you must remove the Docker volume:
  ```bash
  docker-compose down -v
  docker-compose up -d
  ```
- Both databases share the same PostgreSQL instance, which is efficient for resource usage
- The backend database is completely separate from ThingsBoard's data
