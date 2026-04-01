
import os
from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False
)

Base = declarative_base() 


def run_startup_migrations():
    if engine.dialect.name != "postgresql":
        return

    inspector = inspect(engine)
    tables = inspector.get_table_names()

    if "favorite_teams" not in tables:
        return

    unique_constraints = inspector.get_unique_constraints("favorite_teams")
    indexes = inspector.get_indexes("favorite_teams")
    single_team_constraints = [
        constraint["name"]
        for constraint in unique_constraints
        if constraint.get("column_names") == ["team_id"] and constraint.get("name")
    ]
    single_team_unique_indexes = [
        index["name"]
        for index in indexes
        if index.get("unique") and index.get("column_names") == ["team_id"] and index.get("name")
    ]
    composite_constraint_exists = any(
        constraint.get("name") == "uq_favorite_teams_user_team"
        or constraint.get("column_names") == ["user_id", "team_id"]
        for constraint in unique_constraints
    )

    with engine.begin() as connection:
        for constraint_name in single_team_constraints:
            connection.execute(
                text(
                    f'ALTER TABLE favorite_teams DROP CONSTRAINT IF EXISTS "{constraint_name}"'
                )
            )

        for index_name in single_team_unique_indexes:
            connection.execute(
                text(f'DROP INDEX IF EXISTS "{index_name}"')
            )

        if not composite_constraint_exists:
            connection.execute(
                text(
                    "ALTER TABLE favorite_teams "
                    "ADD CONSTRAINT uq_favorite_teams_user_team UNIQUE (user_id, team_id)"
                )
            )

        connection.execute(
            text(
                "CREATE INDEX IF NOT EXISTS ix_favorite_teams_team_id "
                "ON favorite_teams (team_id)"
            )
        )

