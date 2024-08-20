import os
import requests
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
     
TITLES_ENDPOINT = "https://www.jobrela.com/api/category/findAllChildCategories"
SKILLSETS_ENDPOINT = "https://www.jobrela.com/api/skillset/findByName?search=&page=0&size=2000"
LOCATIONS_ENDPOINT = "https://www.jobrela.com/api/locality/findByName?search=&page=0&size=2000"
SPECIALTIES_ENDPOINT = "https://www.jobrela.com/api/speciality/findAll"
LEVELS_ENDPOINT = "https://www.jobrela.com/api/project/getLevels"
LANGUAGES_ENDPOINT = "https://www.jobrela.com/api/language/findAll"
BENEFITS_ENDPOINT = "https://www.jobrela.com/api/benefit/findAll"

def get_information_from_api(api_endpoint):
     response = requests.get(api_endpoint)

     if response.status_code == 200:
          data = response.json()
          return data
     else:
          return []     

def get_best_titles(description, titles):

     tools = [
          {
               "type": "function",
               "function": {
                    "name": "extract_information_from_job_description",
                    "description": "Identify the most relevant job titles from the Job Description. Choose only from the provided lists. Call this function every time for the Job Description.",
                    "parameters": {
                         "type": "object",
                         "properties": {
                              "job_titles": {
                                   "type": "array",
                                   "description": "The most relevant job title for the Job Description.",
                                   "items": {
                                        "type": "string",
                                        "enum": titles,
                                   }
                              },
                         },
                         "required": ["job_titles"],
                         "additionalProperties": False
                    }
               }
          }
     ]

     return call_openai(description, tools)

def get_best_matching(description, specialties, levels, languages, benefits):

     tools = [
          {
               "type": "function",
               "function": {
                    "name": "extract_information_from_job_description",
                    "description": "Identify the most relevant specialties, required levels, languages and benefits from the Job Description. Choose only from the provided lists. Call this function every time for the Job Description.",
                    "parameters": {
                         "type": "object",
                         "properties": {
                              "specialties": {
                                   "type": "array",
                                   "description": "The list of available specialties.",
                                   "items": {
                                        "type": "string",
                                        "enum": specialties
                                   }
                              },
                              "levels": {
                                   "type": "array",
                                   "description": "The list of required levels.",
                                   "items": {
                                        "type": "string",
                                        "enum": levels
                                   }
                              },
                              "languages": {
                                   "type": "array",
                                   "description": "The list of required languages.",
                                   "items": {
                                        "type": "string",
                                        "enum": languages
                                   }
                              },
                              "benefits": {
                                   "type": "array",
                                   "description": "The list of benefits.",
                                   "items": {
                                        "type": "string",
                                        "enum": benefits
                                   }
                              }
                         },
                         "required": ["specialties", "levels", "languages", "benefits"],
                         "additionalProperties": False
                    }
               }
          }
     ]

     return call_openai(description, tools)

def get_best_location(description, locations):

     tools = [
          {
               "type": "function",
               "function": {
                    "name": "extract_information_from_job_description",
                    "description": "Identify the available locations where the future employee will work from the Job Description. Choose only from the provided lists. When you return locations only use original names from the list. When you can not find matched location from provided list, just ignore it and don't return that location. So the key here is you only can return locations from provided list. If you can not find matched location from the list, just return 'None'. If you find location from job description but can not find matching location in the list, just ignore it.",
                    "parameters": {
                         "type": "object",
                         "properties": {
                              "locations": {
                                   "type": "array",
                                   "description": "The list of available locations.",
                                   "items": {
                                        "type": "string",
                                        "enum": locations
                                   }
                              },
                         },
                         "required": ["locations"],
                         "additionalProperties": False
                    }
               }
          }
     ]

     return call_openai(description, tools)


def call_openai(description, tools):
     OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
     MODEL = os.environ.get("MODEL")

     messages = [
          {
               "role": "system",
               "content": "You are a powerful assistant, Your job is to extract informations from the Job Description. Use the supplied tools to assist the user."
          },
          {
               "role": "user",
               "content": f"Job Description: {description}"
          }
     ]

     client = OpenAI(api_key=OPENAI_API_KEY)
     completion = client.chat.completions.create(
          model=MODEL,
          messages=messages,
          tools=tools,
          tool_choice="required"
     )

     result = completion.choices[0].message.tool_calls[0].function.arguments

     return result

if __name__ == "__main__":
     titles = [title["id"] for title in get_information_from_api(TITLES_ENDPOINT)]
     skillsets = [skillset["id"] for skillset in get_information_from_api(SKILLSETS_ENDPOINT)]
     locations = [location["id"] for location in get_information_from_api(LOCATIONS_ENDPOINT)]
     specialties = [specialty["name"] for specialty in get_information_from_api(SPECIALTIES_ENDPOINT)]
     levels = get_information_from_api(LEVELS_ENDPOINT)
     languages = [language["name"] for language in get_information_from_api(LANGUAGES_ENDPOINT)]
     benefits = [benefit["nameEN"] for benefit in get_information_from_api(BENEFITS_ENDPOINT)]
     description = open("job_description.txt", "r").read()

     # result = get_best_titles(description, titles)
     # result2 = get_best_matching(description, specialties, levels, languages, benefits)
     result3 = get_best_location(description, locations + ['None'])
     
     # print(result)
     # print(result2)
     print(result3)
     
