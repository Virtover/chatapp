import datetime
import httpx
import json
from app.config import settings
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect, Response
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
                data['date'] = datetime.datetime.utcnow().isoformat()
                data['sender'] = data['username']
                if not data['isFile']:
                    result = httpx.post(f'{settings.messages_service_url}/add_message', json=data)
                    if result.status_code == 200:
                        await manager.broadcast_json(result.json())
                    else:
                        print("failed to add message")
                else:
                    result = httpx.post(f'{settings.messages_service_url}/upload_file', json=data)
                    if result.status_code == 200:
                        await manager.broadcast_json(result.json())
                    else:
                        print("failed to add file")
    except WebSocketDisconnect:
        manager.disconnect(websocket)


@app.get("/download_file/{file_id}")
async def download_file(file_id: int):
    async with httpx.AsyncClient() as client:
        url = f"{settings.messages_service_url}/download_file/{file_id}"
        proxied_response = await client.get(url, timeout=None)  # Disable timeout

        response = Response(content=proxied_response.content)
        response.headers.update(proxied_response.headers)
        response.status_code = proxied_response.status_code

        return response


@app.post("/load_more")
async def load_more(data: Dict[str, Any]):
    result = httpx.post(f'{settings.messages_service_url}/load_more', json=data)
    if result.status_code == 200:
        return result.json()
    else:
        raise HTTPException(status_code=result.status_code, detail=result.json()['detail'])
