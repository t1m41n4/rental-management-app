#!/bin/bash
set -e

echo "Waiting for database..."
while ! pg_isready -h db -p 5432 -U "$POSTGRES_USER"; do
    sleep 1
done
echo "Database is ready!"

echo "Running migrations..."
alembic upgrade head

echo "Starting FastAPI application..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
