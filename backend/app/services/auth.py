from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from app.schemas import UserCreate  # Import UserCreate
from app.models.models import User
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
import os


# Database setup
DATABASE_URL = os.environ.get(
    "DATABASE_URL", "postgresql://user:password@db:5432/rental_db"
)
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# JWT settings
SECRET_KEY = os.environ.get(
    "SECRET_KEY", "default-insecure-key-for-local-dev-only"
)  # Fallback for safety
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES", 30)
)


# OAuth2 scheme for token extraction
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_user(db: Session, user: "UserCreate"):  # Accept UserCreate object
    hashed_password = hash_password(user.password)
    # Convert role to lowercase before saving
    db_user = User(
        email=user.email,
        hashed_password=hashed_password,
        role=user.role.lower(),   # Use role from UserCreate and convert to lowercase
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, SECRET_KEY, algorithm=ALGORITHM
    )
    return encoded_jwt


def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    print('get_current_user - Token:', token)  # Debug log: token
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print('get_current_user - Payload:', payload)  #  Debug log: decoded payload
        email: str = payload.get("sub")
        role: str = payload.get("role")
        print(
            f"get_current_user - Extracted email: {email}, role: {role}"
        )  # Debug log: extracted email and role
        if email is None or role is None:
            raise credentials_exception
        return {"sub": email, "role": role}
    except JWTError as e:
        print('get_current_user - JWTError:', e)  #   Debug log: JWTError
        raise credentials_exception
