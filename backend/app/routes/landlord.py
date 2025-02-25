from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.models import User, Property, Payment
from app.schemas import TenantCreate, PropertyCreate, PaymentCreate
from app.services.auth import get_db, get_current_user, hash_password

router = APIRouter(prefix="/landlord", tags=["landlord"])


def get_landlord_user(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "landlord":
        raise HTTPException(status_code=403, detail="Not authorized")
    return current_user


@router.post("/tenants")
def add_tenant(tenant: TenantCreate, db: Session = Depends(get_db), user = Depends(get_landlord_user)):
    db_tenant = User(email=tenant.email, hashed_password=hash_password(tenant.password), role="tenant")
    db.add(db_tenant)
    db.commit()
    db.refresh(db_tenant)
    return {"msg": "Tenant added", "tenant_id": db_tenant.id}


@router.get("/tenants")
def list_tenants(db: Session = Depends(get_db), user = Depends(get_landlord_user)):
    tenants = db.query(User).filter(User.role == "tenant").all()
    return [{"id": t.id, "email": t.email} for t in tenants]


@router.post("/properties")
def add_property(property: PropertyCreate, db: Session = Depends(get_db), user = Depends(get_landlord_user)):
    db_property = Property(name=property.name, address=property.address, landlord_id=int(user["sub"]))
    db.add(db_property)
    db.commit()
    db.refresh(db_property)
    return {"msg": "Property added", "property_id": db_property.id}


@router.get("/payments")
def payment_history(db: Session = Depends(get_db), user = Depends(get_landlord_user)):
    payments = db.query(Payment).all()
    return [{"id": p.id, "tenant_id": p.tenant_id, "amount": p.amount, "date": p.date} for p in payments]