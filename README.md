# Rental Management App

A full-stack web application designed to streamline rental property management for landlords and tenants. Built with Next.js for the frontend, FastAPI for the backend, and PostgreSQL for data storage, all containerized using Docker.

## Overview
- **Purpose**: Provides tools for landlords to manage tenants, properties, and payments, and for tenants to view rental details, submit maintenance requests, and track payments.
- **Tech Stack**: Next.js (React with TypeScript), FastAPI (Python), PostgreSQL, Docker, Alembic for migrations.
- **Current State**: Backend fully implemented with RESTful APIs and authentication; frontend development in progress.

To get started, clone the repository and use Docker Compose to run the app:
- **Clone**: `git clone https://github.com/t1m41n4/rental-management-app.git`
- **Run**: `cd rental-management-app && docker-compose up --build`
- **Migrate**: `docker-compose exec backend alembic upgrade head`