from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pydantic import BaseModel
from gpt4 import extract_information
from utils import get_information_from_api, TITLES_ENDPOINT, SKILLSETS_ENDPOINT, LOCATIONS_ENDPOINT, SPECIALTIES_ENDPOINT, LEVELS_ENDPOINT, LANGUAGES_ENDPOINT, BENEFITS_ENDPOINT

load_dotenv()

app = FastAPI()
app.add_middleware(  
    CORSMiddleware,  
    allow_origins=["*"],  # Allows all origins  
    allow_credentials=True,  
    allow_methods=["*"],  # Allows all methods  
    allow_headers=["*"],  # Allows all headers  
)  

titles = [title["id"] for title in get_information_from_api(TITLES_ENDPOINT)]
skillsets = [skillset["id"] for skillset in get_information_from_api(SKILLSETS_ENDPOINT)]
locations = [location["id"] for location in get_information_from_api(LOCATIONS_ENDPOINT)]
specialties = [specialty["name"] for specialty in get_information_from_api(SPECIALTIES_ENDPOINT)]
levels = get_information_from_api(LEVELS_ENDPOINT)
languages = [language["name"] for language in get_information_from_api(LANGUAGES_ENDPOINT)]
benefits = [benefit["nameEN"] for benefit in get_information_from_api(BENEFITS_ENDPOINT)]

class Description(BaseModel):
    description: str

@app.get("/")
def hello_world():
    return {"message": "Hello World"}

@app.post("/extract")
async def extract(description: Description):
    result = extract_information(description.description, titles, skillsets, locations, specialties, levels, languages, benefits)
    return result
