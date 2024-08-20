import dotenv from "dotenv"
import { app } from "./src/config/express"

dotenv.config()
const port = process.env.PORT || "5000"

app.listen(port, () => {
    console.log(`Listening to ${port}`)
})
