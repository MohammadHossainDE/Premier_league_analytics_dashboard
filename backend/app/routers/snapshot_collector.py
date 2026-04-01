from fastapi import APIRouter, Depends

from app.auth import get_current_user
from app.models import User
from app.services.snapshot_scheduler import (
    collect_snapshots_once,
    get_snapshot_scheduler_status,
)

router = APIRouter(prefix="/snapshot-collector", tags=["Snapshot Collector"])


@router.get("/status")
def get_status(current_user: User = Depends(get_current_user)):
    return get_snapshot_scheduler_status()


@router.post("/run")
def run_collection(current_user: User = Depends(get_current_user)):
    return collect_snapshots_once()
