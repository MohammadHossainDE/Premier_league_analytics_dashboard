from fastapi import APIRouter, HTTPException, status

from app import crud, schemas
from app.dependencies import CurrentUser, DatabaseSession

router = APIRouter(prefix="/snapshots", tags=["Snapshots"])

FAVORITE_NOT_FOUND_DETAIL = "Favorite team not found"
SNAPSHOT_NOT_FOUND_DETAIL = "Snapshot not found"


@router.post(
    "/{favorite_team_id}",
    response_model=schemas.TeamSnapshot,
    status_code=status.HTTP_201_CREATED,
)
def create_snapshot(
    favorite_team_id: int,
    snapshot: schemas.TeamSnapshotCreate,
    db: DatabaseSession,
    current_user: CurrentUser,
):
    created = crud.create_snapshot_for_user(
        db,
        favorite_team_id,
        current_user.id,
        snapshot,
    )

    if not created:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=FAVORITE_NOT_FOUND_DETAIL,
        )

    return created


@router.get("/{favorite_team_id}", response_model=list[schemas.TeamSnapshot])
def read_snapshots(
    favorite_team_id: int,
    db: DatabaseSession,
    current_user: CurrentUser,
):
    snapshots = crud.get_snapshots_by_favorite_and_user(
        db,
        favorite_team_id,
        current_user.id,
    )
    if snapshots is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=FAVORITE_NOT_FOUND_DETAIL,
        )

    return snapshots


@router.delete("/{snapshot_id}")
def delete_snapshot(
    snapshot_id: int,
    db: DatabaseSession,
    current_user: CurrentUser,
):
    deleted = crud.delete_snapshot_for_user(db, snapshot_id, current_user.id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=SNAPSHOT_NOT_FOUND_DETAIL,
        )

    return {"message": "Snapshot deleted successfully"}
