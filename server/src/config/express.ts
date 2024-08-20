import express from "express"
import cors from "cors"
import morgan from "morgan"
import bodyParser from "body-parser"
import { routes } from "../v1/routes"
import OpenAI from "openai"
import { client } from "../utils"
import { configDotenv } from "dotenv"

configDotenv()

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
client.OpenAIClient = new OpenAI({ apiKey: OPENAI_API_KEY })

const app = express()
app.use(express.static("public"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(express.json())
app.use(morgan("tiny"))
app.use("/api/v1", routes)
app.disable("x-powered-by")

export { app }
