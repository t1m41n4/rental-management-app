from pydantic import BaseModel, constr


from datetime import datetime


class UserCreate(BaseModel):
    email: str
    password: constr(min_length=8)  # Min password length: 8 chars
    role: str  # Add role field


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


class PasswordReset(BaseModel):
    token: str
    new_password: constr(min_length=8)

class TwoFactorSetup(BaseModel):
    code: str
