from pydantic import BaseSettings


class Settings(BaseSettings):
    """Loads configuration of the application.

    When an instance of this class is created, its attributes are
    initialized using the values from both environment variables and
    the content of .env file.
    """

    users_service_url: str
    messages_service_url: str

    class Config:
        case_sensitive = False


settings = Settings()
