import pytz
from app.database import init_models
from app.dependencies import get_session
from app.models import Message
from app.schemas import LoadMoreInput, LoadMoreOutput, LMMessage
from datetime import datetime
from fastapi import FastAPI, Depends, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from sqlalchemy import select, update, cast, Date
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


@app.post("/load_more", response_model=LoadMoreOutput)
async def load_more(data: LoadMoreInput, db: AsyncSession = Depends(get_session)):
    if data.amount < 1 or data.amount > 250:
        raise HTTPException(status=400, detail="Wrong amount")
    
    end_date = datetime.fromisoformat(str(data.endDate)).replace(tzinfo=None)
    m = await db.scalars(
        select(Message)
        .where(Message.time_sent <= end_date)
        .order_by(Message.time_sent.desc(), Message.id.desc())
        .limit(data.amount)
    )
    messages = m.all()
    
    result = []
    for msg in messages:
        result.append(LMMessage(
            id=msg.id,
            sender=msg.owner,
            date=msg.time_sent,
            isFile=True,
            content=msg.content
        ))
    
    return LoadMoreOutput(messages=result)
