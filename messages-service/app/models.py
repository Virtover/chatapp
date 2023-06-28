import datetime

from app.database import Base
from sqlalchemy import Column, DateTime, ForeignKey, Index, Integer, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    owner = Column(String, unique=True, nullable=False)
    content = Column(String, unique=True, nullable=False)
    time_sent = Column(DateTime, nullable=False)
