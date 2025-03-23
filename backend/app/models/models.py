from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum as SQLEnum, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

Base = declarative_base()

class UserRole(str, enum.Enum):
    LANDLORD = "landlord"
    TENANT = "tenant"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(SQLEnum(UserRole), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    two_factor_secret = Column(String, nullable=True)
    two_factor_enabled = Column(Boolean, default=False)

    # Relationships
    properties = relationship("Property", back_populates="landlord")
    payments = relationship("Payment", back_populates="tenant")
    maintenance_requests = relationship("Maintenance", back_populates="tenant")

class Property(Base):
    __tablename__ = "properties"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    address = Column(String, nullable=False)
    landlord_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    landlord = relationship("User", back_populates="properties")

class Payment(Base):
    __tablename__ = "payments"
    id = Column(Integer, primary_key=True, index=True)
    tenant_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    amount = Column(Float, nullable=False)
    date = Column(DateTime, default=datetime.utcnow)

    # Relationships
    tenant = relationship("User", back_populates="payments")

class Maintenance(Base):
    __tablename__ = "maintenance"
    id = Column(Integer, primary_key=True, index=True)
    tenant_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    description = Column(String, nullable=False)
    status = Column(String, nullable=False)
    submitted_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    tenant = relationship("User", back_populates="maintenance_requests")