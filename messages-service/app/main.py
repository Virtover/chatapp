import pytz
import sys
import base64
from app.database import init_models
from app.dependencies import get_session
from app.models import Message, File
from app.schemas import LoadMoreInput, LoadMoreOutput, MessageOutput, MessageInput
from datetime import datetime
from fastapi import FastAPI, Depends, WebSocket, WebSocketDisconnect, HTTPException, UploadFile, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from sqlalchemy import select, update, cast, Date, union
from sqlalchemy.exc import IntegrityError
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


@app.post("/add_message", response_model=MessageOutput)
async def add_message(data: MessageInput, db: AsyncSession = Depends(get_session)):
    if data.isFile:
        raise HTTPException(status=400, detail="Cannot add file to messages!")

    new_message = Message(
        owner=data.sender,
        time_sent=data.date,
        content=data.content
    )

    db.add(new_message)
    await db.commit()
    await db.refresh(new_message)

    return MessageOutput(
        sender=new_message.owner,
        date=new_message.time_sent,
        content=new_message.content,
        id=new_message.id,
        isFile=False
    )


@app.post("/upload_file", response_model=MessageOutput)
async def upload_file(data: MessageInput, db: AsyncSession = Depends(get_session)):
    if not data.isFile:
        raise HTTPException(status=400, detail="Cannot add message to files!")

    file_content = None
    if isinstance(data.content, str):
        file_content = base64.b64decode(data.content)
    elif isinstance(data.content, UploadFile):
        file_content = await data.content.read()
    
    new_file = File(
        owner=data.sender,
        time_sent=data.date,
        filename=data.filename,
        content=file_content,
    )
    db.add(new_file)
    await db.commit()
    await db.refresh(new_file)
    
    response = MessageOutput(
        id=new_file.id,
        sender=new_file.owner,
        date=new_file.time_sent,
        isFile=True,
        content={
            "filename": new_file.filename,
            "size": int(sys.getsizeof(file_content) / 10) / 100,
            "id": new_file.id
        }
    )
    return response


@app.get("/download_file/{file_id}")
async def download_file(file_id: int, db: AsyncSession = Depends(get_session)):
    file = await db.execute(select(File).where(File.id == file_id))
    file = file.scalar_one_or_none()
    if file is None:
        raise HTTPException(status_code=404, detail="File not found")
    
    response = Response(content=file.content, media_type="application/octet-stream")
    response.headers["Content-Disposition"] = f"attachment; filename={file.filename}"
    return response


@app.post("/load_more", response_model=LoadMoreOutput)
async def load_more(data: LoadMoreInput, db: AsyncSession = Depends(get_session)):
    if data.amount < 1 or data.amount > 250:
        raise HTTPException(status=400, detail="Wrong amount")

    message_query = select(Message).order_by(Message.time_sent.desc(), Message.id.desc())
    message_query = message_query.offset(data.offset).limit(data.amount)
    messages = (await db.scalars(message_query)).all()

    file_query = select(File).order_by(File.time_sent.desc(), File.id.desc())
    file_query = file_query.offset(data.offset).limit(data.amount)
    files = (await db.scalars(file_query)).all()

    result = []
    for message in messages:
        result.append(MessageOutput(
            id=message.id,
            sender=message.owner,
            date=message.time_sent,
            isFile=False,
            content=message.content
        ))

    for file in files:
        content = {
            "filename": file.filename,
            "size": int(sys.getsizeof(file.content) / 10) / 100,
            "id": file.id
        }
        result.append(MessageOutput(
            id=file.id,
            sender=file.owner,
            date=file.time_sent,
            isFile=True,
            content=content
        ))

    result.sort(key=lambda x: (x.date, x.id), reverse=True)

    return LoadMoreOutput(messages=result[:data.amount])
