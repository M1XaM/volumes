from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import timedelta
from database import engine, get_db
import models, schemas, auth
import json

models.Base.metadata.create_all(bind=engine)

tags_metadata = [
    {
        "name": "auth",
        "description": "Operations with user authentication and registration.",
    },
    {
        "name": "user data",
        "description": "Retrieve and update user-specific data like bookmarks and read lists.",
    },
]

app = FastAPI(
    title="Read List Sync Server",
    description="API for the Read List Sync App, providing user auth and data synchronization.",
    version="1.0.0",
    openapi_tags=tags_metadata
)

app.add_middleware(
    CORSMiddleware,

    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/register", response_model=schemas.UserResponse, tags=["auth"], summary="Register a new user")
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """
    Registers a new user in the database.
    - **username**: Must be unique.
    - **password**: Will be securely hashed and stored.
    """
    db_user = auth.get_user(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed_password = auth.get_password_hash(user.password)
    new_user = models.User(username=user.username, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create empty user data
    user_data = models.UserData(user_id=new_user.id, marks="{}", read_list="[]")
    db.add(user_data)
    db.commit()
    
    return new_user

@app.post("/login", response_model=schemas.Token, tags=["auth"], summary="Login to get access token")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    OAuth2 compatible token login, returning a JWT Token.
    """
    user = auth.get_user(db, form_data.username)
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/data", response_model=schemas.UserDataSchema, tags=["user data"], summary="Get current user data")
def get_user_data(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    """
    Retrieves the authenticated user's reading lists and bookmarks.
    """
    user_data = db.query(models.UserData).filter(models.UserData.user_id == current_user.id).first()
    marks = json.loads(user_data.marks) if user_data and user_data.marks else {}
    read_list = json.loads(user_data.read_list) if user_data and user_data.read_list else []
    
    return {"marks": marks, "read_list": read_list}

@app.post("/data", response_model=schemas.UserDataSchema, tags=["user data"], summary="Update user data")
def update_user_data(data: schemas.UserDataSchema, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    """
    Updates the authenticated user's reading lists and bookmarks.
    Overwrites the current data with the payload.
    """
    user_data = db.query(models.UserData).filter(models.UserData.user_id == current_user.id).first()
    if not user_data:
        user_data = models.UserData(user_id=current_user.id)
        db.add(user_data)
    
    user_data.marks = json.dumps(data.marks)
    user_data.read_list = json.dumps(data.read_list)
    db.commit()
    db.refresh(user_data)
    
    return {"marks": json.loads(user_data.marks), "read_list": json.loads(user_data.read_list)}
