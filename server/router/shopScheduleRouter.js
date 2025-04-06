

import express from "express"
import { addShopSchedule, getShopSchedule, updateShopSchedule } from "../controller/shopSchedulController.js"
import { verifyToken } from "../Utils/verify.js"


const shopScheduleRouter = express.Router()


shopScheduleRouter.post('/add-shopSchedule',verifyToken, addShopSchedule)


shopScheduleRouter.get('/get-shopSchedule', getShopSchedule)


shopScheduleRouter.put('/update-shopSchedule', updateShopSchedule)


export default shopScheduleRouter