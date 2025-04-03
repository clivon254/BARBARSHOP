

import express from "express" 
import { forgotPassword, Login, Register, resetPassword } from "../controller/authController.js"


const authRouter = express.Router()



authRouter.post('/register' , Register)


authRouter.post('/login', Login)


authRouter.post('/forgot-password', forgotPassword)


authRouter.post('/reset-password', resetPassword)



export default authRouter