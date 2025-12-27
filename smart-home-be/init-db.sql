-- PostgreSQL Initialization Script
-- This script creates the backend database on the same PostgreSQL server

-- Create the backend database if it doesn't exist
SELECT 'CREATE DATABASE smarthome_backend'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'smarthome_backend')\gexec

-- Grant all privileges to postgres user (already the owner)
GRANT ALL PRIVILEGES ON DATABASE smarthome_backend TO postgres;
