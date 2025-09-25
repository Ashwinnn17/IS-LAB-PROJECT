from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.db.database import get_session
from app.models.note import Note
from app.schemas.note import NoteCreate, NoteRead
from app.utils import encrypt_note, decrypt_note, sign_note, verify_note_signature
from typing import List

router = APIRouter(prefix="/notes", tags=["notes"])

@router.post("/", response_model=NoteRead)
def create_note(note: NoteCreate, session: Session = Depends(get_session)):
    user_id = 1  # For demo, use first user
    encrypted = encrypt_note(note.content)
    encrypted_keywords = encrypt_note(note.keywords)
    signature = sign_note(encrypted)
    new_note = Note(
        user_id=user_id,
        encrypted_content=encrypted,
        encrypted_keywords=encrypted_keywords,
        signature=signature
    )
    session.add(new_note)
    session.commit()
    session.refresh(new_note)
    return new_note

@router.get("/search")
def search_notes(q: str, session: Session = Depends(get_session)):
    """Search notes by keywords and content"""
    if not q.strip():
        return []
    
    notes = session.exec(select(Note)).all()
    matching_notes = []
    search_term = q.lower()
    
    for note in notes:
        try:
            # Decrypt keywords to search in them
            decrypted_keywords = decrypt_note(note.encrypted_keywords)
            
            # Search in keywords (case-insensitive)
            if search_term in decrypted_keywords.lower():
                matching_notes.append(note)
        except Exception:
            # Skip notes that can't be decrypted
            continue
    
    return matching_notes


@router.get("/{note_id}")
def read_note(note_id: int, session: Session = Depends(get_session)):
    note = session.get(Note, note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    # Verify signature before decrypting
    if not verify_note_signature(note.encrypted_content, note.signature):
        raise HTTPException(status_code=400, detail="Invalid signature")
    decrypted = decrypt_note(note.encrypted_content)
    decrypted_keywords = decrypt_note(note.encrypted_keywords)
    return {
        "id": note.id,
        "content": decrypted,
        "keywords": decrypted_keywords,
        "created_at": note.created_at,
        "updated_at": note.updated_at
    }

@router.get("/", response_model=List[NoteRead])
def get_all_notes(session: Session = Depends(get_session)):
    notes = session.exec(select(Note)).all()
    return notes


