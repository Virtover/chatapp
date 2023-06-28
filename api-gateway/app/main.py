import datetime
import httpx
import json
from app.config import settings
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
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


class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast_json(self, message: str):
        for connection in self.active_connections:
            await connection.send_json(message)


manager = ConnectionManager()


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_json()
            verification = httpx.post(f'{settings.users_service_url}/verify_token', json=data)
            if verification.status_code == 200 and verification.json()['result']:
                if not data['isFile']:
                    data['date'] = datetime.datetime.utcnow().isoformat()
                    await manager.broadcast_json(data)
                else:
                    print("file there!") #temp, FEATURE TO ADD IN FUTURE!!!
    except WebSocketDisconnect:
        manager.disconnect(websocket)


@app.post("/load_more")
async def load_more(data: Dict[str, Any]):
    result = httpx.post(f'{settings.messages_service_url}/load_more', json=data)
    if result.status_code == 200:
        return result.json()
    else:
        raise HTTPException(status_code=result.status_code, detail=result.json()['detail'])
