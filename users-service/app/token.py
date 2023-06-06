import jwt
from app.config import settings

async def encode(user_data):
    with open(settings.secret_key_file, 'r') as skf:
        return jwt.encode(user_data, skf.read(), algorithm='HS256')

async def decode(token):
    with open(settings.secret_key_file, 'r') as skf:
        return jwt.decode(token, skf.read(), algorithms=['HS256'])