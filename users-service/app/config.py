from passlib.context import CryptContext
from pydantic import BaseSettings


class Settings(BaseSettings):
    """Loads configuration of the application.

    When an instance of this class is created, its attributes are
    initialized using the values from both environment variables and
    the content of .env file.
    """

    postgres_host: str
    postgres_user: str
    postgres_password: str
    postgres_db: str

    class Config:
        case_sensitive = False


settings = Settings()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
