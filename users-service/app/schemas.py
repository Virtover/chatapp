from pydantic import BaseModel


class Token(BaseModel):
    token: str


class LoginData(BaseModel):
    username: str
    password: str


class RegisterData(LoginData):
    email: str


class TokenWithUsername(Token):
    username: str


class Verification(BaseModel):
    result: bool
