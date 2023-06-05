from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

'''
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        os.environ('FRONTEND_URL'),
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
'''

@app.get("/register")
async def register():
    pass

@app.get("/login")
async def login():
    pass

@app.get("/")
async def root():
    return {"message": "Hello World"}
