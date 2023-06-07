import datetime

from app.config import settings, pwd_context
from app.database import init_models
from app.dependencies import get_session
from app.schemas import Token, LoginData, RegisterData
from app.models import User
from app.token import encode, decode
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup():
    await init_models()


@app.post("/register", response_model=Token)
async def register(data: RegisterData, db: AsyncSession = Depends(get_session)):
    user = await db.scalar(select(User).where(User.username == str(data.username)))
    if user is not None:
        raise HTTPException(status_code=400, detail="This username is taken")
    
    user = await db.scalar(select(User).where(User.email == str(data.email)))
    if user is not None:
        raise HTTPException(status_code=400, detail="This email is used")
    
    new_user = User(
        username=data.username,
        email=data.email,
        hashed_password=pwd_context.hash(data.password),
        register_time=datetime.datetime.utcnow()
    )
    db.add(new_user)
    await db.commit()

    return Token(token=encode({'username': new_user.username}))


@app.post("/login", response_model=Token)
async def login(data: LoginData, db: AsyncSession = Depends(get_session)):
    user = await db.scalar(select(User).where(User.username == str(data.username)))
    
    if user is None or not pwd_context.verify(data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")
    
    return Token(token=encode({'username': user.username}))
