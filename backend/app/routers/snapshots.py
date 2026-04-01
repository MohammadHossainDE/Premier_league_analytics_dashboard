
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, schemas
from app.auth import get_current_user
from app.database import SessionLocal
from app.models import User

router = APIRouter(prefix="/snapshots", tags=["Snapshots"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/{favorite_team_id}", response_model=schemas.TeamSnapshot)
def create_snapshot(
    favorite_team_id: int,
    snapshot: schemas.TeamSnapshotCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    created = crud.create_snapshot_for_user(
        db,
        favorite_team_id,
        current_user.id,
        snapshot
    )

    if not created:
        raise HTTPException(status_code=404, detail="Favorite team not found")

    return created


@router.get("/{favorite_team_id}", response_model=list[schemas.TeamSnapshot])
def read_snapshots(
    favorite_team_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    snapshots = crud.get_snapshots_by_favorite_and_user(
        db,
        favorite_team_id,
        current_user.id
    )
    if snapshots is None:
        raise HTTPException(status_code=404, detail="Favorite team not found")

    return snapshots


@router.delete("/{snapshot_id}")
def delete_snapshot(
    snapshot_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    deleted = crud.delete_snapshot_for_user(db, snapshot_id, current_user.id)

    if not deleted:
        raise HTTPException(status_code=404, detail="Snapshot not found")

    return {"message": "Snapshot deleted"}
