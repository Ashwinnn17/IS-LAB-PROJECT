from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class Note(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    encrypted_content: str
    encrypted_keywords: str
    signature: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
