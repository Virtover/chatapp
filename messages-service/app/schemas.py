from datetime import datetime
from pydantic import BaseModel


class LoadMoreInput(BaseModel):
    amount: int
    offset: int


class MessageInput(BaseModel):
    sender: str
    date: datetime
    isFile: bool
    content: str


class MessageOutput(MessageInput):
    id: int


class LoadMoreOutput(BaseModel):
    messages: list[MessageOutput]
