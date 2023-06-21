import httpx
import json
from app.config import settings
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/register")
async def register(data: Dict[str, Any]):
    result = httpx.post(f'{settings.users_service_url}/register', json=data)
    if result.status_code == 200:
        return result.json()
    else:
        raise HTTPException(status_code=result.status_code, detail=result.json()['detail'])


@app.post("/login")
async def login(data: Dict[str, Any]):
    result = httpx.post(f'{settings.users_service_url}/login', json=data)
    if result.status_code == 200:
        return result.json()
    else:
        raise HTTPException(status_code=result.status_code, detail=result.json()['detail'])


@app.post("/verify_token")
async def verify_token(data: Dict[str, Any]):
    result = httpx.post(f'{settings.users_service_url}/verify_token', json=data)
    if result.status_code == 200:
        return result.json()
    else:
        raise HTTPException(status_code=result.status_code, detail=result.json()['detail'])
