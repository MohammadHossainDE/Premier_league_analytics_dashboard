from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from app import crud, schemas
from app.auth import authenticate_user, create_access_token, hash_password
from app.dependencies import CurrentUser, DatabaseSession

router = APIRouter(prefix="/auth", tags=["Auth"])

EMAIL_TAKEN_DETAIL = "Email already registered"
USERNAME_TAKEN_DETAIL = "Username already taken"
INVALID_CREDENTIALS_DETAIL = "Invalid username/email or password"


@router.post("/register", response_model=schemas.User, status_code=status.HTTP_201_CREATED)
def register_user(user: schemas.UserCreate, db: DatabaseSession):
    existing_email = crud.get_user_by_email(db, user.email)
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=EMAIL_TAKEN_DETAIL,
        )

    existing_username = crud.get_user_by_username(db, user.username)
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=USERNAME_TAKEN_DETAIL,
        )

    return crud.create_user(
        db,
        user,
        hashed_password=hash_password(user.password),
    )


@router.post("/login", response_model=schemas.Token)
def login_user(
    db: DatabaseSession,
    form_data: OAuth2PasswordRequestForm = Depends(),
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=INVALID_CREDENTIALS_DETAIL,
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=schemas.User)
def read_current_user(current_user: CurrentUser):
    return current_user
