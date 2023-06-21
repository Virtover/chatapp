import jwt

def encode(user_data, secret_key):
    return jwt.encode(user_data, secret_key, algorithm='HS256')

def decode(token, secret_key):
    return jwt.decode(token, secret_key, algorithms=['HS256'])