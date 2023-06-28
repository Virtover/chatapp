from typing import List
from fastapi import FastAPI, WebSocket
from fastapi.responses import HTMLResponse

app = FastAPI()

class ConnectionManager:
    def __init__(self):
        self.connections: List[WebSocket] = []
        self.messages: List[str] = []  # Store the messages here

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.connections.append(websocket)

        # Send the current messages to the connected client
        await websocket.send_json(self.messages)

    async def broadcast(self, message: str):
        self.messages.append(message)  # Add the new message to the list

        for connection in self.connections:
            await connection.send_json(self.messages)  # Send the updated messages to all clients


manager = ConnectionManager()

# WebSocket endpoint for user which concurrently sends and receives messages
@app.websocket("/ws/{username}")
async def websocket_endpoint(websocket: WebSocket, username: str):
    await manager.connect(websocket)
    while True:
        data = await websocket.receive_text()
        await manager.broadcast(data)  # Broadcast the received message to all clients


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8888)
