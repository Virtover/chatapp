import datetime

from app.database import Base
from sqlalchemy import Column, DateTime, ForeignKey, Index, Integer, String, LargeBinary
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    owner = Column(String, nullable=False)
    content = Column(String, nullable=False)
    time_sent = Column(DateTime, nullable=False)


class File(Base):
    __tablename__ = "file"

    id = Column(Integer, primary_key=True, index=True)
    owner = Column(String, nullable=False)
    filename = Column(String, nullable=False)
    content = Column(LargeBinary, nullable=False)
    time_sent = Column(DateTime, nullable=False)
