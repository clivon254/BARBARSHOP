
import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import "dotenv/config"
import authRouter from "./router/authRouter.js"
import userRouter from "./router/userRouter.js"
import barbarRouter from "./router/barbarRouter.js"
import serviceRouter from "./router/serviceRouter.js"
import timeslotRouter from "./router/timeslotRouter.js"
import shopScheduleRouter from "./router/shopScheduleRouter.js"
import appointmentRouter from "./router/appointmentRouter.js"
import paymentRouter from "./router/paymentRouter.js"
import statsRouter from "./router/statsRouter.js"



const app = express()


const PORT = process.env.PORT 


app.use(cors())


app.use(express.json())


// DB CONNECTION
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("DB CONNECTED"))
.catch((err) => console.log(err))



// API
app.get('/',(req,res) => {

    res.send("HELLO BARBAR APPOINTMENT")

})


// ROUTER
app.use('/api/auth', authRouter)


app.use('/api/user', userRouter)


app.use('/api/barbar', barbarRouter)


app.use('/api/service', serviceRouter)


app.use('/api/timeslot', timeslotRouter)


app.use('/api/shopSchedule', shopScheduleRouter)


app.use('/api/appointment', appointmentRouter)


app.use('/api/payment', paymentRouter)


app.use('/api/paying' , paymentRouter)


app.use('/api/stats', statsRouter)




// LISTENING
app.listen(PORT,(err) => {

    if(err)
    {
        console.log(err.message)
    }
    else
    {
        console.log(`SERVER RUNNING ON PORT ${PORT}`)
    }

})




// middleware
app.use((err,req,res,next) => {

    const statusCode = err.statusCode || 500

    const message = err.message || "Internal Server Error"

    res.status(statusCode).json({success:false , message:message})

})