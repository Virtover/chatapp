from datetime import datetime
from pydantic import BaseModel


class UserData(BaseModel):
    username: str
    token: str
    email: str
    join_date: datetime


class LoginData(BaseModel):
    username: str
    password: str


class RegisterData(LoginData):
    email: str


class TokenWithUsername(BaseModel):
    token: str
    username: str


class Verification(BaseModel):
    result: bool
