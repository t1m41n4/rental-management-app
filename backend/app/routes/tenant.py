from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.models import Payment
from app.schemas import MaintenanceRequest, PaymentCreate
from app.services.auth import get_db, get_current_user

router = APIRouter(prefix="/tenant", tags=["tenant"])

def get_tenant_user(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "tenant":
        raise HTTPException(status_code=403, detail="Not authorized")
    return current_user

@router.get("/details")
def get_rental_details(db: Session = Depends(get_db), user = Depends(get_tenant_user)):
    # Placeholder logic; replace with real property/tenant data
    return {"email": user["sub"], "due_date": "2025-03-01", "amount": 5000}

@router.post("/maintenance")
def submit_maintenance(request: MaintenanceRequest, db: Session = Depends(get_db), user = Depends(get_tenant_user)):
    # In a real app, save to a Maintenance table
    return {"msg": "Maintenance request submitted", "description": request.description}

@router.get("/payments")
def payment_history(db: Session = Depends(get_db), user = Depends(get_tenant_user)):
    payments = db.query(Payment).filter(Payment.tenant_id == int(user["sub"])).all()
    return [{"id": p.id, "amount": p.amount, "date": p.date} for p in payments]