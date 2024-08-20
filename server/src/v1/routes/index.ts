import { Router } from "express"

import atsRoutes from "./ats.routes"

const routes = Router()

routes.use("/ats", atsRoutes)

export { routes }
