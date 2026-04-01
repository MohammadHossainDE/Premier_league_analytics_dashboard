
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, schemas
from app.auth import get_current_user
from app.database import SessionLocal
from app.models import User

router = APIRouter(prefix="/notes", tags=["Notes"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/{favorite_team_id}", response_model=schemas.Note)
def create_note(
    favorite_team_id: int,
    note: schemas.NoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    created_note = crud.create_note_for_user(db, favorite_team_id, current_user.id, note)

    if not created_note:
        raise HTTPException(status_code=404, detail="Favorite team not found")

    return created_note


@router.get("/{favorite_team_id}", response_model=list[schemas.Note])
def read_notes(
    favorite_team_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    notes = crud.get_notes_by_favorite_and_user(db, favorite_team_id, current_user.id)
    if notes is None:
        raise HTTPException(status_code=404, detail="Favorite team not found")

    return notes


@router.delete("/{note_id}")
def delete_note(
    note_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    deleted = crud.delete_note_for_user(db, note_id, current_user.id)

    if not deleted:
        raise HTTPException(status_code=404, detail="Note not found")

    return {"message": "Note deleted successfully"}


@router.put("/{note_id}", response_model=schemas.Note)
def update_note(
    note_id: int,
    note: schemas.NoteUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    updated_note = crud.update_note_for_user(db, note_id, current_user.id, note)

    if not updated_note:
        raise HTTPException(status_code=404, detail="Note not found")

    return updated_note
