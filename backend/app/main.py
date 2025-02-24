from fastapi import FastAPI

app = FastAPI(title="Rental Management API")


@app.get("/")
def read_root():
    return {"message": "Welcome to the Rental Management API"}