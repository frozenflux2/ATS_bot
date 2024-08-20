import OpenAI from "openai"
import { z } from "zod"

export type StorageType = {
    titles: string[]
    skillsets: string[]
    locations: string[]
    specialities: string[]
    levels: string[]
    languages: string[]
    benefits: string[]
}

export type ClientType = {
    OpenAIClient: OpenAI | null
}

export const ExtractedData = z.object({
    data: z.array(z.string())
})
