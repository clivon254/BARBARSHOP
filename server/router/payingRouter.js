
import express from "express"
import { generateAccessToken, verifyToken } from "../Utils/verify.js"
import { callBack, confirmPayment, events, mpesaPrompt } from "../controller/payingController.js"


const payingRouter = express.Router()


payingRouter.post('/stk-push', verifyToken, generateAccessToken , mpesaPrompt)


payingRouter.post('/callback', callBack)


payingRouter.post('/confirm/:CheckoutRequestID/:appointmentId', verifyToken , generateAccessToken , confirmPayment)


payingRouter.get('/event', events)



export default payingRouter