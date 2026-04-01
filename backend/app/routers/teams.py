

from fastapi import APIRouter, Depends
from app.auth import get_current_user
from app.models import User
from app.services.football_api import (
    fetch_premier_league_standings,
    fetch_team_by_id
)

router = APIRouter(prefix="/teams", tags=["Teams"])


@router.get("/")
def get_teams(current_user: User = Depends(get_current_user)):
    return fetch_premier_league_standings()


@router.get("/{team_id}")
def get_team(team_id: int, current_user: User = Depends(get_current_user)):
    return fetch_team_by_id(team_id)
