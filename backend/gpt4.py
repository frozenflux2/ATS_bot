import os
import requests
from pydantic import BaseModel
from openai import OpenAI

# to-do: identify category + skillsets + locations + level from job description
class TitleScore(BaseModel):
     title: str
     score: float

class Extract(BaseModel):
    titles: list[TitleScore]

def get_titles():
     api_endpoint = "https://www.jobrela.com/api/category/findAllChildCategories"
     
     response = requests.get(api_endpoint)

     if response.status_code == 200:
          data = response.json()
          return data
     else:
          return []

def get_best_matching(description, titles):
     OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
     MODEL = os.environ.get("MODEL")

     client = OpenAI(api_key=OPENAI_API_KEY)
     completion = client.beta.chat.completions.parse(
          model=MODEL,
          messages=[
               {
                    "role": "system",
                    "content": f"Give me the relevant ones with their scores out of 10 in the most relevant order from the Job Titles below for the job description.\n\nJob Titles: {titles}.",
               },
               {
                    "role": "user",
                    "content": f"Job Description: {description}",
               }
          ],
          response_format=Extract,
     )

     result = completion.choices[0].message.parsed

     return result