import datetime

from app.config import settings, pwd_context
from app.database import init_models
from app.dependencies import get_session
from app.schemas import UserData, LoginData, RegisterData, TokenWithUsername, Verification
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


@app.post("/register", response_model=UserData)
async def register(data: RegisterData, db: AsyncSession = Depends(get_session)):
    user = await db.scalar(select(User).where(User.username == str(data.username)))
    if user is not None:
        raise HTTPException(status_code=400, detail="This username is taken")
    
    user = await db.scalar(select(User).where(User.email == str(data.email)))
    if user is not None:
        raise HTTPException(status_code=400, detail="This email address is used")
    
    if len(data.username) > 40:
        raise HTTPException(status_code=400, detail="Username is too long")
    
    new_user = User(
        username=data.username,
        email=data.email,
        hashed_password=pwd_context.hash(data.password),
        register_time=datetime.datetime.utcnow()
    )
    db.add(new_user)
    await db.commit()

    return UserData(
        username=new_user.username,
        token=encode({'username': new_user.username}),
        email=new_user.email,
        join_date=new_user.register_time,
    )


@app.post("/login", response_model=UserData)
async def login(data: LoginData, db: AsyncSession = Depends(get_session)):
    user = await db.scalar(select(User).where(User.username == str(data.username)))

    if user is None or not pwd_context.verify(data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")

    return UserData(
        username=user.username,
        token=encode({'username': user.username}),
        email=user.email,
        join_date=user.register_time,
    )


@app.post("/verify_token", response_model=Verification)
async def verify_token(data: TokenWithUsername, db: AsyncSession = Depends(get_session)):
    user = await db.scalar(select(User).where(User.username == str(data.username)))
    if user is None:
        raise HTTPException(status_code=404, detail="User does not exist")
    
    return Verification(result=(encode({'username': user.username}) == data.token))
