import { zodResponseFormat } from "openai/helpers/zod"
import { ExtractedData } from "./types"
import { storage, client } from "./cache"
import {
    SKILLSETS_ENDPOINT,
    LOCATIONS_ENDPOINT,
    TITLES_ENDPOINT,
    SPECIALTIES_ENDPOINT,
    LEVELS_ENDPOINT,
    LANGUAGES_ENDPOINT,
    BENEFITS_ENDPOINT
} from "./endpoints"

const MODEL = process.env.MODEL || "gpt-4o-mini"

const fetch_request = async (url: string) => {
    const response = await fetch(url)
    const data = await response.json()
    return data
}

export const updateData = async () => {
    // Fetch all required data concurrently
    const [
        skillsetsData,
        locationsData,
        jobTitlesData,
        specialitiesData,
        levelsData,
        languagesData,
        benefitsData
    ] = await Promise.all([
        fetch_request(SKILLSETS_ENDPOINT),
        fetch_request(LOCATIONS_ENDPOINT),
        fetch_request(TITLES_ENDPOINT),
        fetch_request(SPECIALTIES_ENDPOINT),
        fetch_request(LEVELS_ENDPOINT),
        fetch_request(LANGUAGES_ENDPOINT),
        fetch_request(BENEFITS_ENDPOINT)
    ])

    storage.skillsets = skillsetsData.map((skillset) => skillset?.id)
    storage.locations = locationsData.map((location) => location?.id)
    storage.titles = jobTitlesData.map((title) => title?.id)
    storage.specialities = specialitiesData.map(
        (speciality) => speciality?.name
    )
    storage.levels = levelsData
    storage.languages = languagesData.map((language) => language?.name)
    storage.benefits = benefitsData.map((benefit) => benefit?.nameEN)
}

const call_openai = async (message) => {
    const response = await client.OpenAIClient.beta.chat.completions.parse({
        model: MODEL,
        messages: message,
        response_format: zodResponseFormat(ExtractedData, "data")
    })

    return response.choices[0].message.parsed
}

export const extract_locations = async (description) => {
    const locations = storage.locations

    const messages = [
        {
            role: "system",
            content: `From the job description, choose available locations ONLY from the provided locations list where the future employee will work.`
        },
        {
            role: "user",
            content: `
            Job description: ${description}\n
            locations: ${locations}\n`
        }
    ]

    const res = await call_openai(messages)
    return res.data
}

export const extract_skillsets = async (description) => {
    const skillsets = storage.skillsets

    const messages = [
        {
            role: "system",
            content: `From the job description, choose required skillsets ONLY from the provided skillsets list. You must be case sensitive.`
        },
        {
            role: "user",
            content: `
            Job description: ${description}\n
            skillsets: ${skillsets}\n`
        }
    ]

    const res = await call_openai(messages)
    return res.data
}

export const extract_titles = async (description) => {
    const titles = storage.titles

    const messages = [
        {
            role: "system",
            content: `From the job description, choose the most relevant job titles ONLY from the provided titles list. Sort them in the order of relevance.`
        },
        {
            role: "user",
            content: `
            Job description: ${description}\n
            titles: ${titles}\n`
        }
    ]

    const res = await call_openai(messages)
    return res.data
}

export const extract_specialities = async (description) => {
    const specialities = storage.specialities

    const messages = [
        {
            role: "system",
            content: `From the job description, choose the most relevant specialities ONLY from the provided specialities list. Sort them in the order of relevance.`
        },
        {
            role: "user",
            content: `
            Job description: ${description}\n
            specialities: ${specialities}\n`
        }
    ]

    const res = await call_openai(messages)
    return res.data
}

export const extract_levels = async (description) => {
    const levels = storage.levels

    const messages = [
        {
            role: "system",
            content: `From the job description, choose the minimum required level ONLY from the provided levels list. Choose only one.`
        },
        {
            role: "user",
            content: `
            Job description: ${description}\n
            levels: ${levels}\n`
        }
    ]

    const res = await call_openai(messages)
    return res.data
}

export const extract_languages = async (description) => {
    const languages = storage.languages

    const messages = [
        {
            role: "system",
            content: `From the job description, choose required languages ONLY from the provided languages list.`
        },
        {
            role: "user",
            content: `
            Job description: ${description}\n
            languages: ${languages}\n`
        }
    ]

    const res = await call_openai(messages)
    return res.data
}

export const extract_benefits = async (description) => {
    const benefits = storage.benefits

    const messages = [
        {
            role: "system",
            content: `From the job description, choose available benefits. Choose them ONLY from the provided benefits list.`
        },
        {
            role: "user",
            content: `
            Job description: ${description}\n
            benefits: ${benefits}\n`
        }
    ]

    const res = await call_openai(messages)
    return res.data
}
