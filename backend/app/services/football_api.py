
from datetime import datetime, timedelta

import requests
from fastapi import HTTPException
from app.config import API_KEY

BASE_URL = "https://api.football-data.org/v4"
HEADERS = {"X-Auth-Token": API_KEY}
CACHE_TTL = timedelta(minutes=10)

_standings_cache = {
    "data": None,
    "expires_at": None,
}


def fetch_premier_league_standings():
    now = datetime.utcnow()
    cached_data = _standings_cache["data"]
    expires_at = _standings_cache["expires_at"]

    if cached_data is not None and expires_at is not None and now < expires_at:
        return cached_data

    url = f"{BASE_URL}/competitions/PL/standings"

    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
    except requests.RequestException:
        raise HTTPException(status_code=500, detail="Could not connect to football API")

    if response.status_code == 429:
        if cached_data is not None:
            return cached_data

        raise HTTPException(
            status_code=429,
            detail="Football API rate limit reached. Please wait a few minutes and try again."
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code,
            detail="Failed to fetch Premier League data"
        )

    data = response.json()
    standings = data.get("standings", [])

    if not standings:
        return []

    table = standings[0].get("table", [])

    teams_stats = []
    for item in table:
        teams_stats.append({
            "team_id": item["team"]["id"],
            "team_name": item["team"]["name"],
            "position": item.get("position", 0),
            "points": item.get("points", 0),
            "played": item.get("playedGames", 0),
            "won": item.get("won", 0),
            "draw": item.get("draw", 0),
            "lost": item.get("lost", 0),
            "goals_for": item.get("goalsFor", 0),
            "goals_against": item.get("goalsAgainst", 0),
            "goal_difference": item.get("goalDifference", 0),
        })

    _standings_cache["data"] = teams_stats
    _standings_cache["expires_at"] = now + CACHE_TTL

    return teams_stats


def fetch_team_by_id(team_id: int):
    teams = fetch_premier_league_standings()

    for team in teams:
        if team["team_id"] == team_id:
            return team

    raise HTTPException(status_code=404, detail="Team not found")
