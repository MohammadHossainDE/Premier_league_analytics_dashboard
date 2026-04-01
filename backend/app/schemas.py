
"""
from pydantic import BaseModel
from typing import Optional


class FavoriteBase(BaseModel):
    team_id: int
    team_name: str
    points: int
    played: int
    won: int
    draw: int
    lost: int


class FavoriteCreate(FavoriteBase):
    pass


class Favorite(FavoriteBase):
    id: int
    note: Optional[str] = None

    class Config:
        from_attributes = True


class NoteUpdate(BaseModel):
    note: str"""

from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


# --------------------
# User Schemas
# --------------------
class UserBase(BaseModel):
    username: str
    email: str


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    identifier: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    user_id: Optional[int] = None


class User(UserBase):
    id: int

    class Config:
        from_attributes = True


# --------------------
# Note Schemas
# --------------------
class NoteBase(BaseModel):
    content: str


class NoteCreate(NoteBase):
    pass


class NoteUpdate(NoteBase):
    pass


class Note(NoteBase):
    id: int
    created_at: datetime
    favorite_team_id: int

    class Config:
        from_attributes = True


# --------------------
# Team Snapshot Schemas
# --------------------
class TeamSnapshotBase(BaseModel):
    team_name: str
    points: int
    played: int
    won: int
    draw: int
    lost: int


class TeamSnapshotCreate(TeamSnapshotBase):
    pass


class TeamSnapshot(TeamSnapshotBase):
    id: int
    created_at: datetime
    favorite_team_id: int

    class Config:
        from_attributes = True


# --------------------
# Favorite Team Schemas
# --------------------
class FavoriteBase(BaseModel):
    team_id: int
    team_name: str
    points: int
    played: int
    won: int
    draw: int
    lost: int


class FavoriteCreate(FavoriteBase):
    user_id: Optional[int] = None


class Favorite(FavoriteBase):
    id: int
    user_id: int
    notes: List[Note] = []
    snapshots: List[TeamSnapshot] = []

    class Config:
        from_attributes = True
