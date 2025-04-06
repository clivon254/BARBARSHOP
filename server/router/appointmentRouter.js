
import express from "express"
import { verifyToken } from "../Utils/verify.js"
import { acceptAppointments, bookAppointments, deleteAppointments, getAppointment, getAppointments, updateAppointments } from "../controller/appointmentController.js"



const appointmentRouter = express.Router()


appointmentRouter.post('/book-appointment',verifyToken,bookAppointments)


appointmentRouter.get('/get-appointment/:appointmentId', getAppointment)


appointmentRouter.get('/get-appointments', getAppointments)


appointmentRouter.put('/update-appointment/:appointmentId', verifyToken , updateAppointments)


appointmentRouter.put('/accept-appointment/:appointmentId', verifyToken , acceptAppointments)


appointmentRouter.delete('/delete-appointment/:appointmentId',verifyToken, deleteAppointments)


export default appointmentRouter