from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app import crud, schemas
from app.auth import authenticate_user, create_access_token, get_current_user, hash_password
from app.database import SessionLocal

router = APIRouter(prefix="/auth", tags=["Auth"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/register", response_model=schemas.User, status_code=status.HTTP_201_CREATED)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_email = crud.get_user_by_email(db, user.email)
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already registered")

    existing_username = crud.get_user_by_username(db, user.username)
    if existing_username:
        raise HTTPException(status_code=400, detail="Username already taken")

    return crud.create_user(
        db,
        user,
        hashed_password=hash_password(user.password)
    )


@router.post("/login", response_model=schemas.Token)
def login_user(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username/email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=schemas.User)
def read_current_user(current_user=Depends(get_current_user)):
    return current_user
