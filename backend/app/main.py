from fastapi import FastAPI
from app.routes import auth, landlord, tenant

app = FastAPI(title="Rental Management API")

app.include_router(auth.router)
app.include_router(landlord.router)
app.include_router(tenant.router)


@app.get("/")
def read_root():
    return {"message": "Welcome to the Rental Management API"}