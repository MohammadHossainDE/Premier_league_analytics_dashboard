from fastapi import APIRouter, HTTPException, status

from app import crud, schemas
from app.dependencies import CurrentUser, DatabaseSession

router = APIRouter(prefix="/notes", tags=["Notes"])

FAVORITE_NOT_FOUND_DETAIL = "Favorite team not found"
NOTE_NOT_FOUND_DETAIL = "Note not found"


@router.post(
    "/{favorite_team_id}",
    response_model=schemas.Note,
    status_code=status.HTTP_201_CREATED,
)
def create_note(
    favorite_team_id: int,
    note: schemas.NoteCreate,
    db: DatabaseSession,
    current_user: CurrentUser,
):
    created_note = crud.create_note_for_user(db, favorite_team_id, current_user.id, note)

    if not created_note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=FAVORITE_NOT_FOUND_DETAIL,
        )

    return created_note


@router.get("/{favorite_team_id}", response_model=list[schemas.Note])
def read_notes(
    favorite_team_id: int,
    db: DatabaseSession,
    current_user: CurrentUser,
):
    notes = crud.get_notes_by_favorite_and_user(db, favorite_team_id, current_user.id)
    if notes is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=FAVORITE_NOT_FOUND_DETAIL,
        )

    return notes


@router.delete("/{note_id}")
def delete_note(
    note_id: int,
    db: DatabaseSession,
    current_user: CurrentUser,
):
    deleted = crud.delete_note_for_user(db, note_id, current_user.id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=NOTE_NOT_FOUND_DETAIL,
        )

    return {"message": "Note deleted successfully"}


@router.put("/{note_id}", response_model=schemas.Note)
def update_note(
    note_id: int,
    note: schemas.NoteUpdate,
    db: DatabaseSession,
    current_user: CurrentUser,
):
    updated_note = crud.update_note_for_user(db, note_id, current_user.id, note)

    if not updated_note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=NOTE_NOT_FOUND_DETAIL,
        )

    return updated_note
