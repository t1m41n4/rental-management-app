from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.models import Payment, Maintenance, User
from app.schemas import MaintenanceRequest, PaymentCreate
from app.services.auth import get_db, get_current_user
from app.services.redis import get_redis, cache_data, get_cached_data
import json

router = APIRouter(prefix="/tenant", tags=["tenant"])


def get_tenant_user(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "tenant":
        raise HTTPException(status_code=403, detail="Not authorized")
    return current_user


@router.get("/details")
def get_rental_details(db: Session = Depends(get_db), redis = Depends(get_redis), user = Depends(get_tenant_user)):
    cache_key = f"tenant_details:{user['sub']}"
    cached = get_cached_data(cache_key)
    if cached:
        print(f"Cache hit for {cache_key}")
        return json.loads(cached)
    print(f"Cache miss for {cache_key}")
    details = {"email": user["sub"], "due_date": "2025-03-01", "amount": 5000}
    cache_data(cache_key, json.dumps(details), expire=3600)
    return details


@router.post("/maintenance")
def submit_maintenance(request: MaintenanceRequest, db: Session = Depends(get_db), redis = Depends(get_redis), user = Depends(get_tenant_user)):
    tenant = db.query(User).filter(User.email == user["sub"]).first()
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")
    maintenance = Maintenance(
        tenant_id=tenant.id,
        description=request.description,
        status="Pending"
    )
    db.add(maintenance)
    db.commit()
    db.refresh(maintenance)
    cache_key = f"tenant_maintenance:{user['sub']}"
    redis.delete(cache_key)
    return {"msg": "Maintenance request submitted", "id": maintenance.id, "description": request.description, "status": maintenance.status}


@router.get("/maintenance")
def get_maintenance_history(db: Session = Depends(get_db), redis = Depends(get_redis), user = Depends(get_tenant_user)):
    cache_key = f"tenant_maintenance:{user['sub']}"
    cached = get_cached_data(cache_key)
    if cached:
        print(f"Cache hit for {cache_key}")
        return json.loads(cached)
    print(f"Cache miss for {cache_key}")
    tenant = db.query(User).filter(User.email == user["sub"]).first()
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")
    maintenance_requests = db.query(Maintenance).filter(Maintenance.tenant_id == tenant.id).all()
    maintenance_data = [{"id": m.id, "description": m.description, "status": m.status, "submitted_at": m.submitted_at.isoformat()} for m in maintenance_requests]
    cache_data(cache_key, json.dumps(maintenance_data), expire=3600)
    return maintenance_data


@router.get("/payments")
def payment_history(db: Session = Depends(get_db), redis = Depends(get_redis), user = Depends(get_tenant_user)):
    cache_key = f"tenant_payments:{user['sub']}"
    cached = get_cached_data(cache_key)
    if cached:
        print(f"Cache hit for {cache_key}")
        return json.loads(cached)
    print(f"Cache miss for {cache_key}")
    tenant = db.query(User).filter(User.email == user["sub"]).first()
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")
    payments = db.query(Payment).filter(Payment.tenant_id == tenant.id).all()
    payment_data = [{"id": p.id, "amount": p.amount, "date": p.date.isoformat()} for p in payments]
    cache_data(cache_key, json.dumps(payment_data), expire=3600)
    return payment_data