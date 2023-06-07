from app.config import settings
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import declarative_base, sessionmaker


with open(settings.postgres_password_file, 'r') as mpf:
    passwd = mpf.read()

engine = create_async_engine(
    "postgresql+asyncpg://"
    f"{settings.postgres_user}:{passwd}@"
    f"{settings.postgres_host}/"
    f"{settings.postgres_db}",
    echo=True,
)
Base = declarative_base()
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


async def init_models():
    async with engine.begin() as conn:
        '''await conn.run_sync(
            Base.metadata.drop_all
        )  # Can be commented in future if we want to preserve data in database.'''
        await conn.run_sync(Base.metadata.create_all)
