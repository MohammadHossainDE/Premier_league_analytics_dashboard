
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app import models
from app.database import engine, run_startup_migrations
from app.routers import teams, favorites, analytics, notes, users, snapshots, auth, snapshot_collector
from app.services.snapshot_scheduler import start_snapshot_scheduler, stop_snapshot_scheduler

models.Base.metadata.create_all(bind=engine)
run_startup_migrations()

app = FastAPI(title="Premier League Analytics API")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(teams.router)
app.include_router(favorites.router)
app.include_router(analytics.router)
app.include_router(notes.router)
app.include_router(users.router)
app.include_router(snapshots.router)
app.include_router(auth.router)
app.include_router(snapshot_collector.router)


@app.on_event("startup")
def on_startup():
    start_snapshot_scheduler()


@app.on_event("shutdown")
def on_shutdown():
    stop_snapshot_scheduler()

@app.get("/")
def root():
    return {"message": "Premier League Analytics API is running"}
