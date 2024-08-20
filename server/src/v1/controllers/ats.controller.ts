import {
    extract_locations,
    extract_skillsets,
    extract_titles,
    extract_specialities,
    extract_levels,
    extract_languages,
    extract_benefits,
    storage,
    updateData
} from "../../utils"

export const extractData = async (req, res) => {
    const { description } = req.body
    try {
        if (Object.values(storage).some((x) => x.length === 0)) {
            await updateData()
        }

        // Extract locations, skillsets, and titles concurrently
        const [
            extracted_locations,
            extracted_skillsets,
            extracted_titles,
            extracted_specialities,
            extracted_levels,
            extracted_languages,
            extracted_benefits
        ] = await Promise.all([
            extract_locations(description),
            extract_skillsets(description),
            extract_titles(description),
            extract_specialities(description),
            extract_levels(description),
            extract_languages(description),
            extract_benefits(description)
        ])

        // Filter the extracted results
        const filtered_locations = extracted_locations.filter((location) =>
            storage.locations.includes(location)
        )
        console.log(extracted_locations)
        console.log(filtered_locations)

        const filtered_skillsets = extracted_skillsets.filter((skillset) =>
            storage.skillsets.includes(skillset)
        )
        console.log(extracted_skillsets)
        console.log(filtered_skillsets)

        const filtered_titles = extracted_titles.filter((title) =>
            storage.titles.includes(title)
        )
        console.log(extracted_titles)
        console.log(filtered_titles)

        const filtered_specialities = extracted_specialities.filter(
            (speciality) => storage.specialities.includes(speciality)
        )
        console.log(extracted_specialities)
        console.log(filtered_specialities)

        const filtered_levels = extracted_levels.filter((level) =>
            storage.levels.includes(level)
        )
        console.log(extracted_levels)
        console.log(filtered_levels)

        const filtered_languages = extracted_languages.filter((language) =>
            storage.languages.includes(language)
        )
        console.log(extracted_languages)
        console.log(filtered_languages)

        const filtered_benefits = extracted_benefits.filter((benefit) =>
            storage.benefits.includes(benefit)
        )
        console.log(extracted_benefits)
        console.log(filtered_benefits)

        res.status(200).json({
            titles: filtered_titles,
            skillsets: filtered_skillsets,
            locations: filtered_locations,
            specialities: filtered_specialities.length
                ? filtered_specialities[0]
                : "",
            levels: filtered_levels.length ? filtered_levels[0] : "",
            languages: filtered_languages,
            benefits: filtered_benefits
        })
    } catch (error) {
        res.status(500).json({ error: error })
    }
}
