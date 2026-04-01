from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, schemas
from app.auth import get_current_user
from app.database import SessionLocal
from app.models import User

router = APIRouter(prefix="/favorites", tags=["Favorites"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=schemas.Favorite)
def create_favorite(
    favorite: schemas.FavoriteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    favorite.user_id = current_user.id

    existing = crud.get_favorite_by_team_id_and_user(
        db,
        favorite.team_id,
        current_user.id
    )
    if existing:
        raise HTTPException(status_code=400, detail="Team already in favorites for this user")

    return crud.create_favorite(db, favorite)


@router.get("/", response_model=list[schemas.Favorite])
def read_favorites(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return crud.get_favorites_by_user(db, current_user.id)


@router.get("/{favorite_id}", response_model=schemas.Favorite)
def read_favorite(
    favorite_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    favorite = crud.get_favorite_by_id_and_user(db, favorite_id, current_user.id)
    if not favorite:
        raise HTTPException(status_code=404, detail="Favorite not found")

    return favorite


@router.delete("/{favorite_id}")
def delete_favorite(
    favorite_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    deleted = crud.delete_favorite_for_user(db, favorite_id, current_user.id)

    if not deleted:
        raise HTTPException(status_code=404, detail="Favorite not found")

    return {"message": "Favorite deleted successfully"}
