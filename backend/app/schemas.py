from pydantic import BaseModel
from datetime import datetime

class UserCreate(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class TenantCreate(BaseModel):
    email: str
    password: str

class PropertyCreate(BaseModel):
    name: str
    address: str

class MaintenanceRequest(BaseModel):
    description: str

class PaymentCreate(BaseModel):
    tenant_id: int
    amount: float
    date: datetime = datetime.now()