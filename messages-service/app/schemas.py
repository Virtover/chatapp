from datetime import datetime
from pydantic import BaseModel


class LoadMoreInput(BaseModel):
    amount: int
    endDate: datetime


class LMMessage(BaseModel):
    id: int
    sender: str
    date: datetime
    isFile: bool
    content: str


class LoadMoreOutput(BaseModel):
    messages: list[LMMessage]
