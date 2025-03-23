#!/bin/bash

case $1 in
  "setup")
    echo "Setting up development environment..."
    python3 -m venv venv
    source venv/bin/activate
    pip install -r backend/requirements.txt
    ;;

  "start")
    echo "Starting development environment..."
    chmod +x backend/scripts/start.sh
    docker-compose up --build
    ;;

  "migrate")
    echo "Running database migrations..."
    docker-compose exec backend alembic upgrade head
    ;;

  "shell")
    echo "Starting backend shell..."
    docker-compose exec backend /bin/bash
    ;;

  *)
    echo "Usage: ./dev.sh [command]"
    echo "Commands:"
    echo "  setup   - Set up development environment"
    echo "  start   - Start development environment"
    echo "  migrate - Run database migrations"
    echo "  shell   - Start backend shell"
    ;;
esac
