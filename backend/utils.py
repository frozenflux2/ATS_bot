import requests

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
