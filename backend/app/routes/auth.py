from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from app.schemas import UserCreate, UserLogin, PasswordReset
from app.models.models import User
from app.services.auth import (
    get_db,
    create_user,
    verify_password,
    create_access_token,
    get_current_user, # Import get_current_user
    generate_reset_token,
    verify_reset_token,
    generate_2fa_secret,
    verify_2fa_code,
    hash_password, # Import hash_password
)
from app.middlewares.rate_limit import rate_limit
from app.services.email import send_reset_email
import secrets

router = APIRouter()

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):          # Accept UserCreate directly
    db_user = create_user(db, user)          # Pass UserCreate to create_user
    return {"msg": "User created", "user_id": db_user.id}


@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(
        user.password, db_user.hashed_password
    ):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    user_email = db_user.email
    user_role = db_user.role
    print("Login successful for user: " + user_email + ", role: " + user_role)
    token = create_access_token({"sub": db_user.email, "role": db_user.role})
    return {"access_token": token, "token_type": "bearer", "role": db_user.role}


@router.post("/reset-password/request")
@rate_limit(max_requests=5, window_seconds=300)
async def request_password_reset(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if user:
        token = generate_reset_token(user.email)
        await send_reset_email(user.email, token)
    return {"msg": "If the email exists, a reset link has been sent"}


@router.post("/reset-password/confirm")
async def reset_password(
    reset_data: PasswordReset,
    db: Session = Depends(get_db)
):
    email = verify_reset_token(reset_data.token)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.hashed_password = hash_password(
        reset_data.new_password
    )
    db.commit()
    return {"msg": "Password has been reset successfully"}


@router.post("/2fa/setup")
async def setup_2fa(user = Depends(get_current_user), db: Session = Depends(get_db)):
    secret = generate_2fa_secret()
    user_record = db.query(User).filter(User.email == user["sub"]).first()
    user_record.two_factor_secret = secret
    db.commit()
    return {"secret": secret}


@router.post("/2fa/verify")
async def verify_2fa_setup(
    code: str,
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_record = db.query(User).filter(User.email == user["sub"]).first()
    if not verify_2fa_code(user_record.two_factor_secret, code):
        raise HTTPException(status_code=400, detail="Invalid 2FA code")
    return {"msg": "2FA verified successfully"}


@router.post("/csrf-token")
def get_csrf_token(response: Response):
    token = secrets.token_hex(32)
    response.set_cookie(
        key="csrf_token",
        value=token,
        httponly=True,
        secure=True,
        samesite="strict"
    )
    return {
        "csrf_token": token
    }
