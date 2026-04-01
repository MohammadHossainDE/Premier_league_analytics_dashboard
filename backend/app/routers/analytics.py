
from fastapi import APIRouter, Depends
from app.auth import get_current_user
from app.models import User
from app.services.football_api import fetch_premier_league_standings

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/summary")
def get_league_summary(current_user: User = Depends(get_current_user)):
    teams = fetch_premier_league_standings()

    if not teams:
        return {
            "total_teams": 0,
            "top_team": None,
            "bottom_team": None,
            "average_points": 0
        }

    total_points = sum(team["points"] for team in teams)
    average_points = round(total_points / len(teams), 2)

    top_team = max(teams, key=lambda x: x["points"])
    bottom_team = min(teams, key=lambda x: x["points"])

    return {
        "total_teams": len(teams),
        "top_team": {
            "team_name": top_team["team_name"],
            "points": top_team["points"]
        },
        "bottom_team": {
            "team_name": bottom_team["team_name"],
            "points": bottom_team["points"]
        },
        "average_points": average_points
    }


@router.get("/top")
def get_top_teams(limit: int = 5, current_user: User = Depends(get_current_user)):
    teams = fetch_premier_league_standings()
    sorted_teams = sorted(teams, key=lambda x: x["points"], reverse=True)

    return sorted_teams[:limit]


@router.get("/form")
def get_best_attack_and_defense(current_user: User = Depends(get_current_user)):
    teams = fetch_premier_league_standings()

    if not teams:
        return {
            "best_attack": None,
            "best_defense": None,
            "best_goal_difference": None
        }

    best_attack = max(teams, key=lambda x: x["goals_for"])
    best_defense = min(teams, key=lambda x: x["goals_against"])
    best_goal_difference = max(teams, key=lambda x: x["goal_difference"])

    return {
        "best_attack": {
            "team_name": best_attack["team_name"],
            "goals_for": best_attack["goals_for"]
        },
        "best_defense": {
            "team_name": best_defense["team_name"],
            "goals_against": best_defense["goals_against"]
        },
        "best_goal_difference": {
            "team_name": best_goal_difference["team_name"],
            "goal_difference": best_goal_difference["goal_difference"]
        }
    }
