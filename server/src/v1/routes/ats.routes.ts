import { Router } from "express"

import * as atsController from "../controllers/ats.controller"

const routes = Router()

routes.post("/extract", atsController.extractData)

export default routes
