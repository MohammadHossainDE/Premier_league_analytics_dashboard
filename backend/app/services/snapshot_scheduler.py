from __future__ import annotations

import threading
from datetime import datetime

from app import crud, schemas
from app.config import AUTO_SNAPSHOT_ENABLED, AUTO_SNAPSHOT_INTERVAL_MINUTES
from app.database import SessionLocal
from app.services.football_api import fetch_premier_league_standings

_stop_event = threading.Event()
_worker_thread = None
_last_run_at = None
_last_run_summary = "Not started"


def collect_snapshots_once():
    global _last_run_at, _last_run_summary

    db = SessionLocal()
    created_count = 0

    try:
      standings = fetch_premier_league_standings()
      standings_by_team_id = {
          team["team_id"]: team
          for team in standings
      }

      favorites = crud.get_all_favorites(db)

      for favorite in favorites:
          live_team = standings_by_team_id.get(favorite.team_id)
          if not live_team:
              continue

          snapshot = schemas.TeamSnapshotCreate(
              team_name=live_team["team_name"],
              points=live_team["points"],
              played=live_team["played"],
              won=live_team["won"],
              draw=live_team["draw"],
              lost=live_team["lost"],
          )
          created = crud.create_snapshot_if_changed(db, favorite, snapshot)
          if created is not None:
              created_count += 1

      _last_run_at = datetime.utcnow()
      _last_run_summary = f"Saved {created_count} new snapshots"
      return {
          "saved": created_count,
          "favorites_checked": len(favorites),
          "ran_at": _last_run_at.isoformat(),
      }
    finally:
      db.close()


def _scheduler_loop():
    global _last_run_summary

    while not _stop_event.is_set():
        try:
            collect_snapshots_once()
        except Exception as exc:
            _last_run_summary = f"Last run failed: {exc}"

        if _stop_event.wait(AUTO_SNAPSHOT_INTERVAL_MINUTES * 60):
            break


def start_snapshot_scheduler():
    global _worker_thread, _last_run_summary

    if not AUTO_SNAPSHOT_ENABLED:
        _last_run_summary = "Scheduler disabled by config"
        return

    if _worker_thread and _worker_thread.is_alive():
        return

    _stop_event.clear()
    _worker_thread = threading.Thread(
        target=_scheduler_loop,
        name="snapshot-scheduler",
        daemon=True,
    )
    _worker_thread.start()
    _last_run_summary = (
        f"Scheduler running every {AUTO_SNAPSHOT_INTERVAL_MINUTES} minute(s)"
    )


def stop_snapshot_scheduler():
    _stop_event.set()


def get_snapshot_scheduler_status():
    return {
        "enabled": AUTO_SNAPSHOT_ENABLED,
        "interval_minutes": AUTO_SNAPSHOT_INTERVAL_MINUTES,
        "last_run_at": _last_run_at.isoformat() if _last_run_at else None,
        "summary": _last_run_summary,
        "running": bool(_worker_thread and _worker_thread.is_alive()),
    }
