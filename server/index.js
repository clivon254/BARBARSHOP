
import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import "dotenv/config"
import authRouter from "./router/authRouter.js"



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