import json
import os
import requests
from openai import OpenAI

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

def get_other_information(description, specialties, levels, languages, benefits):

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
                    "description": "Identify the available locations where the future employee will work from the Job Description. Choose only from the provided lists. Call this function every time for the Job Description.",
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

def extract_information(description, titles, skillsets, locations, specialties, levels, languages, benefits):
     result1 = json.loads(get_best_titles(description, titles))
     result2 = json.loads(get_other_information(description, specialties, levels, languages, benefits))
     
     return result1 | result2