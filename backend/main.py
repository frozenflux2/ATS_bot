from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pydantic import BaseModel
from gpt4 import get_best_matching, get_titles

load_dotenv()

app = FastAPI()
app.add_middleware(  
    CORSMiddleware,  
    allow_origins=["*"],  # Allows all origins  
    allow_credentials=True,  
    allow_methods=["*"],  # Allows all methods  
    allow_headers=["*"],  # Allows all headers  
)  

titles = get_titles()

class Description(BaseModel):
    description: str

@app.get("/")
def hello_world():
    return {"message": "Hello World"}

@app.post("/extract")
async def extract(description: Description):
    result = get_best_matching(description.description, [title["id"] for title in titles])
    return {"titles": result.titles}
