import { readFileSync } from 'fs';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod'
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const TITLES_ENDPOINT = "https://www.jobrela.com/api/category/findAllChildCategories"
const SKILLSETS_ENDPOINT = "https://www.jobrela.com/api/skillset/findByName?search=&page=0&size=2000"
const LOCATIONS_ENDPOINT = "https://www.jobrela.com/api/locality/findByName?search=&page=0&size=2000"
const SPECIALTIES_ENDPOINT = "https://www.jobrela.com/api/speciality/findAll"
const LEVELS_ENDPOINT = "https://www.jobrela.com/api/project/getLevels"
const LANGUAGES_ENDPOINT = "https://www.jobrela.com/api/language/findAll"
const BENEFITS_ENDPOINT = "https://www.jobrela.com/api/benefit/findAll"

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.MODEL || 'gpt-4o-mini';

const client = new OpenAI({ apiKey: OPENAI_API_KEY });

const ExtractedData = z.object({
    data: z.array(z.string()),
})

const extract_locations = async (description, locations) => {
    const messages = [
        {
            "role": "system",
            "content": `From the job description, choose available locations ONLY from the provided locations list where the future employee will work.`
        },
        {
            'role': 'user',
            'content': `
            Job description: ${description}\n
            locations: ${locations}\n`
        }
    ]

    const res = await call_openai(messages)
    return res.data
}

const extract_skillsets = async (description, skillsets) => {
    const messages = [
        {
            "role": "system",
            "content": `From the job description, choose required skillsets ONLY from the provided skillsets list. You must be case sensitive.`
        },
        {
            'role': 'user',
            'content': `
            Job description: ${description}\n
            skillsets: ${skillsets}\n`
        }
    ]

    const res = await call_openai(messages)
    return res.data
}

const extract_titles = async (description, titles) => {
    const messages = [
        {
            "role": "system",
            "content": `From the job description, choose most relevant job titles ONLY from the provided titles list. Sort them in the order of relevance.`
        },
        {
            'role': 'user',
            'content': `
            Job description: ${description}\n
            titles: ${titles}\n`
        }
    ]

    const res = await call_openai(messages)
    return res.data
}

const extract_specialities = async (description, specialities) => {
    const messages = [
        {
            "role": "system",
            "content": `From the job description, choose most relevant specialities ONLY from the provided specialities list. Sort them in the order of relevance.`
        },
        {
            'role': 'user',
            'content': `
            Job description: ${description}\n
            specialities: ${specialities}\n`
        }
    ]

    const res = await call_openai(messages)
    return res.data
}

const extract_levels = async (description, levels) => {
    const messages = [
        {
            "role": "system",
            "content": `From the job description, choose the minimum required level ONLY from the provided levels list. Choose only one.`
        },
        {
            'role': 'user',
            'content': `
            Job description: ${description}\n
            levels: ${levels}\n`
        }
    ]

    const res = await call_openai(messages)
    return res.data
}

const extract_languages = async (description, languages) => {
    const messages = [
        {
            "role": "system",
            "content": `From the job description, choose required languages ONLY from the provided languages list.`
        },
        {
            'role': 'user',
            'content': `
            Job description: ${description}\n
            languages: ${languages}\n`
        }
    ]

    const res = await call_openai(messages)
    return res.data
}

const extract_benefits = async (description, benefits) => {
    const messages = [
        {
            "role": "system",
            "content": `From the job description, choose available benefits. Choose them ONLY from the provided benefits list.`
        },
        {
            'role': 'user',
            'content': `
            Job description: ${description}\n
            benefits: ${benefits}\n`
        }
    ]

    const res = await call_openai(messages)
    return res.data
}

const call_openai = async (message) => {
    const response = await client.beta.chat.completions.parse({
        model: MODEL,
        messages: message,
        response_format: zodResponseFormat(ExtractedData, 'data'),
    })

    return response.choices[0].message.parsed
}

const fetch_request = async (url) => {
    const response = await fetch(url)
    const data = await response.json()
    return data
}

// Main function
(async () => {
    const description = readFileSync('description.txt', 'utf8');

    // Fetch all required data concurrently  
    const [skillsetsData, locationsData, jobTitlesData, specialitiesData, levelsData, languagesData, benefitsData] = await Promise.all([
        fetch_request(SKILLSETS_ENDPOINT),
        fetch_request(LOCATIONS_ENDPOINT),
        fetch_request(TITLES_ENDPOINT),
        fetch_request(SPECIALTIES_ENDPOINT),
        fetch_request(LEVELS_ENDPOINT),
        fetch_request(LANGUAGES_ENDPOINT),
        fetch_request(BENEFITS_ENDPOINT),
    ]);

    const skillsets = skillsetsData.map((skillset) => skillset?.id);
    const locations = locationsData.map((location) => location?.id);
    const job_titles = jobTitlesData.map((title) => title?.id);
    const specialities = specialitiesData.map((speciality) => speciality?.name);
    const levels = levelsData
    const languages = languagesData.map((language) => language?.name);
    const benefits = benefitsData.map((benefit) => benefit?.nameEN);

    // Extract locations, skillsets, and titles concurrently  
    const [extracted_locations, extracted_skillsets, extracted_titles, extracted_specialities, extracted_levels, extracted_languages, extracted_benefits] = await Promise.all([
        extract_locations(description, locations),
        extract_skillsets(description, skillsets),
        extract_titles(description, job_titles),
        extract_specialities(description, specialities),
        extract_levels(description, levels),
        extract_languages(description, languages),
        extract_benefits(description, benefits),
    ]);

    // Filter the extracted results  
    const filtered_locations = extracted_locations.filter((location) => locations.includes(location));
    console.log(filtered_locations);

    const filtered_skillsets = extracted_skillsets.filter((skillset) => skillsets.includes(skillset));
    console.log(filtered_skillsets);

    const filtered_titles = extracted_titles.filter((title) => job_titles.includes(title));
    console.log(filtered_titles);

    const filtered_specialities = extracted_specialities.filter((speciality) => specialities.includes(speciality));
    console.log(filtered_specialities);

    const filtered_levels = extracted_levels.filter((level) => levels.includes(level));
    console.log(filtered_levels);

    const filtered_languages = extracted_languages.filter((language) => languages.includes(language));
    console.log(filtered_languages);

    const filtered_benefits = extracted_benefits.filter((benefit) => benefits.includes(benefit));
    console.log(filtered_benefits);
})()