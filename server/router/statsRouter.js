

import express from "express"
import { stats } from "../controller/statsController.js"


const statsRouter = express.Router()


statsRouter.get('/get-stats', stats)


export default statsRouter