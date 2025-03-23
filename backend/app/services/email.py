from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr
import os

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_FROM"),
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True
)

fastmail = FastMail(conf)

async def send_reset_email(email: EmailStr, token: str):
    reset_url = f"{os.getenv('FRONTEND_URL')}/reset-password?token={token}"

    message = MessageSchema(
        subject="Password Reset Request",
        recipients=[email],
        body=f"Click the following link to reset your password: {reset_url}",
        subtype="html"
    )

    await fastmail.send_message(message)
