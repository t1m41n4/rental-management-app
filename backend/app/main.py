from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, landlord, tenant
import os
import datetime

app = FastAPI(
    title="Rental Management API",
    description="API for managing rental properties, tenants, and payments",
    version="1.0.0"
)

# Get allowed origins from environment or use default for development
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)

app.include_router(auth.router)
app.include_router(landlord.router)
app.include_router(tenant.router)


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.datetime.now().isoformat()
    }

@app.get("/")
def read_root():
    return {"message": "Welcome to the Rental Management API"}
