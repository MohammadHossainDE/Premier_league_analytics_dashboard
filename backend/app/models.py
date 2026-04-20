
from datetime import datetime
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import relationship

from app.database import Base

try:
    STOCKHOLM_TZ = ZoneInfo("Europe/Stockholm")
except ZoneInfoNotFoundError:
    STOCKHOLM_TZ = None


def sweden_now():
    # Store Sweden local wall-clock time when zone data exists.
    # Fallback to UTC so the app still starts on systems missing tzdata.
    if STOCKHOLM_TZ is None:
        return datetime.utcnow()

    return datetime.now(STOCKHOLM_TZ).replace(tzinfo=None)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False, default="")

    favorite_teams = relationship(
        "FavoriteTeam", back_populates="user", cascade="all, delete"
    )


class FavoriteTeam(Base):
    __tablename__ = "favorite_teams"
    __table_args__ = (
        UniqueConstraint("user_id", "team_id", name="uq_favorite_teams_user_team"),
    )

    id = Column(Integer, primary_key=True, index=True)
    team_id = Column(Integer, index=True, nullable=False)
    team_name = Column(String, nullable=False)
    points = Column(Integer, default=0)
    played = Column(Integer, default=0)
    won = Column(Integer, default=0)
    draw = Column(Integer, default=0)
    lost = Column(Integer, default=0)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    user = relationship("User", back_populates="favorite_teams")
    notes = relationship("Note", back_populates="favorite_team", cascade="all, delete")
    snapshots = relationship(
        "TeamSnapshot", back_populates="favorite_team", cascade="all, delete"
    )


class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=sweden_now)

    favorite_team_id = Column(Integer, ForeignKey("favorite_teams.id"), nullable=False)

    favorite_team = relationship("FavoriteTeam", back_populates="notes")


class TeamSnapshot(Base):
    __tablename__ = "team_snapshots"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    team_name = Column(String, nullable=False)
    points = Column(Integer, default=0)
    played = Column(Integer, default=0)
    won = Column(Integer, default=0)
    draw = Column(Integer, default=0)
    lost = Column(Integer, default=0)
    created_at = Column(DateTime, default=sweden_now)

    favorite_team_id = Column(Integer, ForeignKey("favorite_teams.id"), nullable=False)

    favorite_team = relationship("FavoriteTeam", back_populates="snapshots")
