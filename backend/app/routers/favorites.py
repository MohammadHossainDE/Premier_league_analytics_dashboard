from fastapi import APIRouter, HTTPException, status

from app import crud, schemas
from app.dependencies import CurrentUser, DatabaseSession

router = APIRouter(prefix="/favorites", tags=["Favorites"])

FAVORITE_NOT_FOUND_DETAIL = "Favorite not found"
DUPLICATE_FAVORITE_DETAIL = "Team already in favorites for this user"


@router.post(
    "/",
    response_model=schemas.Favorite,
    status_code=status.HTTP_201_CREATED,
)
def create_favorite(
    favorite: schemas.FavoriteCreate,
    db: DatabaseSession,
    current_user: CurrentUser,
):
    favorite.user_id = current_user.id

    existing = crud.get_favorite_by_team_id_and_user(
        db,
        favorite.team_id,
        current_user.id,
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=DUPLICATE_FAVORITE_DETAIL,
        )

    return crud.create_favorite(db, favorite)


@router.get("/", response_model=list[schemas.Favorite])
def read_favorites(
    db: DatabaseSession,
    current_user: CurrentUser,
):
    return crud.get_favorites_by_user(db, current_user.id)


@router.get("/{favorite_id}", response_model=schemas.Favorite)
def read_favorite(
    favorite_id: int,
    db: DatabaseSession,
    current_user: CurrentUser,
):
    favorite = crud.get_favorite_by_id_and_user(db, favorite_id, current_user.id)
    if not favorite:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=FAVORITE_NOT_FOUND_DETAIL,
        )

    return favorite


@router.delete("/{favorite_id}")
def delete_favorite(
    favorite_id: int,
    db: DatabaseSession,
    current_user: CurrentUser,
):
    deleted = crud.delete_favorite_for_user(db, favorite_id, current_user.id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=FAVORITE_NOT_FOUND_DETAIL,
        )

    return {"message": "Favorite deleted successfully"}
