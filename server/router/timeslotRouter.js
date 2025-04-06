

import express from "express"
import { verifyToken } from "../Utils/verify.js"
import { addTimeSlot, deleteTimeSlot, getAvailableTimeslots, getTimeSlot, getTimeSlots, getTimeSlotsForDate, updateTimeSlot } from "../controller/timeslotController.js"


const timeslotRouter = express.Router()


timeslotRouter.post('/add-timeslot', verifyToken , addTimeSlot)


timeslotRouter.get('/get-timeslot/:timeslotId', getTimeSlot)


timeslotRouter.get('/get-timeslots', getTimeSlots)


timeslotRouter.get('/get-Datetimeslots', getTimeSlotsForDate)


timeslotRouter.get('/get-Avaliabletimeslots', getAvailableTimeslots)


timeslotRouter.put('/update-timeslot/:timeslotId', updateTimeSlot)


timeslotRouter.delete('/delete-timeslot/:timeslotId', deleteTimeSlot)



export default timeslotRouter