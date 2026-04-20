from sqlalchemy.orm import Session

from app import models, schemas


# -------------------------
# User CRUD
# -------------------------
def create_user(db: Session, user: schemas.UserCreate, hashed_password: str):
    db_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_users(db: Session):
    return db.query(models.User).all()


def get_user_by_id(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()


def get_user_by_username_or_email(db: Session, identifier: str):
    return db.query(models.User).filter(
        (models.User.username == identifier) | (models.User.email == identifier)
    ).first()


def get_or_create_default_user(db: Session):
    default_email = "demo@premierleague.local"
    user = get_user_by_email(db, default_email)

    if user:
        return user

    db_user = models.User(
        username="demo_user",
        email=default_email,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# -------------------------
# Favorite Team CRUD
# -------------------------
def get_favorite_by_team_id_and_user(db: Session, team_id: int, user_id: int):
    return db.query(models.FavoriteTeam).filter(
        models.FavoriteTeam.team_id == team_id,
        models.FavoriteTeam.user_id == user_id,
    ).first()


def get_favorite_by_id(db: Session, favorite_id: int):
    return db.query(models.FavoriteTeam).filter(
        models.FavoriteTeam.id == favorite_id
    ).first()


def get_favorite_by_id_and_user(db: Session, favorite_id: int, user_id: int):
    return db.query(models.FavoriteTeam).filter(
        models.FavoriteTeam.id == favorite_id,
        models.FavoriteTeam.user_id == user_id,
    ).first()


def get_favorites(db: Session):
    return db.query(models.FavoriteTeam).all()


def get_favorites_by_user(db: Session, user_id: int):
    return db.query(models.FavoriteTeam).filter(
        models.FavoriteTeam.user_id == user_id
    ).all()


def create_favorite(db: Session, favorite: schemas.FavoriteCreate):
    db_favorite = models.FavoriteTeam(
        team_id=favorite.team_id,
        team_name=favorite.team_name,
        points=favorite.points,
        played=favorite.played,
        won=favorite.won,
        draw=favorite.draw,
        lost=favorite.lost,
        user_id=favorite.user_id,
    )
    db.add(db_favorite)
    db.commit()
    db.refresh(db_favorite)
    return db_favorite


def delete_favorite(db: Session, favorite_id: int):
    favorite = get_favorite_by_id(db, favorite_id)
    if not favorite:
        return None

    db.delete(favorite)
    db.commit()
    return favorite


def delete_favorite_for_user(db: Session, favorite_id: int, user_id: int):
    favorite = get_favorite_by_id_and_user(db, favorite_id, user_id)
    if not favorite:
        return None

    db.delete(favorite)
    db.commit()
    return favorite


# -------------------------
# Note CRUD
# -------------------------
def create_note(db: Session, favorite_team_id: int, note: schemas.NoteCreate):
    favorite = get_favorite_by_id(db, favorite_team_id)
    if not favorite:
        return None

    db_note = models.Note(
        content=note.content,
        favorite_team_id=favorite_team_id,
    )
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note


def create_note_for_user(
    db: Session, favorite_team_id: int, user_id: int, note: schemas.NoteCreate
):
    favorite = get_favorite_by_id_and_user(db, favorite_team_id, user_id)
    if not favorite:
        return None

    db_note = models.Note(
        content=note.content,
        favorite_team_id=favorite_team_id,
    )
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note


def get_notes_by_favorite(db: Session, favorite_team_id: int):
    return db.query(models.Note).filter(
        models.Note.favorite_team_id == favorite_team_id
    ).all()


def get_notes_by_favorite_and_user(db: Session, favorite_team_id: int, user_id: int):
    favorite = get_favorite_by_id_and_user(db, favorite_team_id, user_id)
    if not favorite:
        return None

    return get_notes_by_favorite(db, favorite_team_id)


def get_note_by_id(db: Session, note_id: int):
    return db.query(models.Note).filter(models.Note.id == note_id).first()


def get_note_by_id_and_user(db: Session, note_id: int, user_id: int):
    return (
        db.query(models.Note)
        .join(models.FavoriteTeam, models.Note.favorite_team_id == models.FavoriteTeam.id)
        .filter(
            models.Note.id == note_id,
            models.FavoriteTeam.user_id == user_id,
        )
        .first()
    )


def delete_note(db: Session, note_id: int):
    note = get_note_by_id(db, note_id)
    if not note:
        return None

    db.delete(note)
    db.commit()
    return note


def delete_note_for_user(db: Session, note_id: int, user_id: int):
    note = get_note_by_id_and_user(db, note_id, user_id)
    if not note:
        return None

    db.delete(note)
    db.commit()
    return note


def update_note_for_user(
    db: Session, note_id: int, user_id: int, note: schemas.NoteUpdate
):
    db_note = get_note_by_id_and_user(db, note_id, user_id)
    if not db_note:
        return None

    db_note.content = note.content
    db.commit()
    db.refresh(db_note)
    return db_note


# -------------------------
# Team Snapshot CRUD
# -------------------------
def create_snapshot(
    db: Session,
    favorite_team_id: int,
    snapshot: schemas.TeamSnapshotCreate,
):
    favorite = get_favorite_by_id(db, favorite_team_id)
    if not favorite:
        return None

    db_snapshot = models.TeamSnapshot(
        user_id=favorite.user_id,
        team_name=snapshot.team_name,
        points=snapshot.points,
        played=snapshot.played,
        won=snapshot.won,
        draw=snapshot.draw,
        lost=snapshot.lost,
        favorite_team_id=favorite_team_id,
    )
    db.add(db_snapshot)
    db.commit()
    db.refresh(db_snapshot)
    return db_snapshot


def create_snapshot_for_user(
    db: Session,
    favorite_team_id: int,
    user_id: int,
    snapshot: schemas.TeamSnapshotCreate,
):
    favorite = get_favorite_by_id_and_user(db, favorite_team_id, user_id)
    if not favorite:
        return None

    db_snapshot = models.TeamSnapshot(
        user_id=user_id,
        team_name=snapshot.team_name,
        points=snapshot.points,
        played=snapshot.played,
        won=snapshot.won,
        draw=snapshot.draw,
        lost=snapshot.lost,
        favorite_team_id=favorite_team_id,
    )
    db.add(db_snapshot)
    db.commit()
    db.refresh(db_snapshot)
    return db_snapshot


def get_snapshots_by_favorite(db: Session, favorite_team_id: int):
    return db.query(models.TeamSnapshot).filter(
        models.TeamSnapshot.favorite_team_id == favorite_team_id
    ).all()


def get_snapshots_by_favorite_and_user(
    db: Session, favorite_team_id: int, user_id: int
):
    favorite = get_favorite_by_id_and_user(db, favorite_team_id, user_id)
    if not favorite:
        return None

    return (
        db.query(models.TeamSnapshot)
        .filter(models.TeamSnapshot.favorite_team_id == favorite_team_id)
        .order_by(models.TeamSnapshot.created_at.desc())
        .all()
    )


def get_snapshot_by_id(db: Session, snapshot_id: int):
    return db.query(models.TeamSnapshot).filter(
        models.TeamSnapshot.id == snapshot_id
    ).first()


def get_latest_snapshot_for_favorite(db: Session, favorite_team_id: int):
    return (
        db.query(models.TeamSnapshot)
        .filter(models.TeamSnapshot.favorite_team_id == favorite_team_id)
        .order_by(models.TeamSnapshot.created_at.desc())
        .first()
    )


def get_snapshot_by_id_and_user(db: Session, snapshot_id: int, user_id: int):
    return (
        db.query(models.TeamSnapshot)
        .join(
            models.FavoriteTeam,
            models.TeamSnapshot.favorite_team_id == models.FavoriteTeam.id,
        )
        .filter(
            models.TeamSnapshot.id == snapshot_id,
            models.FavoriteTeam.user_id == user_id,
        )
        .first()
    )


def delete_snapshot(db: Session, snapshot_id: int):
    snapshot = get_snapshot_by_id(db, snapshot_id)
    if not snapshot:
        return None

    db.delete(snapshot)
    db.commit()
    return snapshot


def create_snapshot_if_changed(
    db: Session,
    favorite: models.FavoriteTeam,
    snapshot: schemas.TeamSnapshotCreate,
):
    latest = get_latest_snapshot_for_favorite(db, favorite.id)
    if latest and all(
        [
            latest.team_name == snapshot.team_name,
            latest.points == snapshot.points,
            latest.played == snapshot.played,
            latest.won == snapshot.won,
            latest.draw == snapshot.draw,
            latest.lost == snapshot.lost,
        ]
    ):
        return None

    db_snapshot = models.TeamSnapshot(
        user_id=favorite.user_id,
        team_name=snapshot.team_name,
        points=snapshot.points,
        played=snapshot.played,
        won=snapshot.won,
        draw=snapshot.draw,
        lost=snapshot.lost,
        favorite_team_id=favorite.id,
    )
    db.add(db_snapshot)
    db.commit()
    db.refresh(db_snapshot)
    return db_snapshot


def delete_snapshot_for_user(db: Session, snapshot_id: int, user_id: int):
    snapshot = get_snapshot_by_id_and_user(db, snapshot_id, user_id)
    if not snapshot:
        return None

    db.delete(snapshot)
    db.commit()
    return snapshot
