from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select
from app.db.database import get_session
from app.models.user import User
from app.schemas.user import UserCreate, UserRead
from spake2 import SPAKE2_A
from app.schemas.user import UserLogin
from spake2 import SPAKE2_B
import os
import base64

router = APIRouter(prefix="/auth", tags=["auth"])

from app.utils import hash_password

@router.post("/register", response_model=UserRead)
def register(user: UserCreate, session: Session = Depends(get_session)):
    existing = session.exec(select(User).where(User.username == user.username)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")

    password_hash = hash_password(user.password)

    new_user = User(
        username=user.username,
        password_hash=password_hash
    )
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return UserRead.model_validate(new_user)  # For Pydantic v2


from app.utils import verify_password
from app.schemas.user import UserLogin

@router.post("/login")
def login(user: UserLogin, session: Session = Depends(get_session)):
    db_user = session.exec(select(User).where(User.username == user.username)).first()
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid username or password")

    if not verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid username or password")

    # For now, just return a success message (later, you’ll return a JWT or session token)
    return {"message": "Login successful"}
